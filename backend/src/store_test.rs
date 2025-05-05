#[cfg(test)]
mod store_tests {
    use crate::authentication::authentication::{auth_middleware, Claims};
    use crate::db::models::*;
    use crate::routes::store_handler::*;
    use crate::state::{AppState, AppStateDb};
    use axum::{
        routing::{get, post, put},
        Router,
    };
    use jsonwebtoken::{encode, EncodingKey, Header};
    use reqwest::Client;
    use serde_json::{json, Value};
    use sqlx::types::Decimal;
    use sqlx::{Executor, PgPool};
    use std::sync::Arc;
    use std::time::{SystemTime, UNIX_EPOCH};
    use uuid::Uuid;

    // Cleanup function to truncate tables
    async fn cleanup_test_db(pool: &PgPool) -> Result<(), sqlx::Error> {
        pool.execute(
            "TRUNCATE TABLE users, cart, cart_items, orders, products, stores RESTART IDENTITY CASCADE"
        )
        .await?;
        Ok(())
    }

    async fn setup_test_app() -> (Router, PgPool, Arc<AppState>) {
        dotenv::dotenv().ok();
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let pool = PgPool::connect(&database_url)
            .await
            .expect("Failed to connect to database");

        // Clean the database before setting up the app
        cleanup_test_db(&pool)
            .await
            .expect("Failed to clean test database");

        let state = Arc::new(AppState {
            db: AppStateDb { pool: pool.clone() },
            web3: web3::Web3::new(web3::transports::Http::new("http://localhost:8545").unwrap()),
            pinata_client: reqwest::Client::new(),
            pinata_api_key: std::env::var("PINATA_API_KEY").expect("PINATA_API_KEY must be set"),
            pinata_secret_key: std::env::var("PINATA_SECRET_KEY")
                .expect("PINATA_SECRET_KEY must be set"),
        });

        let app = Router::new()
            .route("/stores", post(create_store_handler))
            .route(
                "/stores/:id",
                put(update_store_handler).delete(delete_store_handler),
            )
            .route(
                "/stores/:id/products",
                post(add_product_handler).get(list_products_handler),
            )
            .route("/stores/:id/orders", get(get_store_orders_handler))
            .route("/products/:id/quantity", get(get_product_quantity_handler))
            .layer(axum::middleware::from_fn_with_state(
                state.clone(),
                auth_middleware,
            ))
            .with_state(state.clone());

        (app, pool, state)
    }

    async fn generate_jwt(wallet_address: &str) -> String {
        let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        let claims = Claims {
            sub: wallet_address.to_string(),
            exp: (SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs()
                + 3600) as usize,
            role: "store".to_string(),
        };
        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(secret.as_ref()),
        )
        .expect("Failed to generate JWT")
    }

    #[tokio::test]
    async fn test_store_handlers() {
        let (app, pool, _state) = setup_test_app().await;
        let client = Client::new();
        let server_addr = "http://localhost:3009";

        let server_task = tokio::spawn(async move {
            axum::serve(
                tokio::net::TcpListener::bind("0.0.0.0:3009").await.unwrap(),
                app,
            )
            .await
            .unwrap();
        });

        let mut tx = pool.begin().await.expect("Failed to start transaction");

        // Use unique wallet_address
        let wallet_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
        let user_id = Uuid::new_v4();
        let email = format!("store_{}@example.com", user_id);
        tx.execute(sqlx::query!(
            "INSERT INTO users (id, wallet_address, email, user_name) VALUES ($1, $2, $3, $4)",
            user_id,
            &wallet_address,
            &email,
            "Store Owner"
        ))
        .await
        .expect("Failed to insert test user");

        let token = generate_jwt(&wallet_address).await;

        let create_payload = json!({
            "store_name": "Test Store",
            "description": "Store Description",
            "owner_address": wallet_address,
            "image": "data:image/jpeg;base64,SGVsbG8gV29ybGQ="
        });

        let response = client
            .post(format!("{}/stores", server_addr))
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", token))
            .json(&create_payload)
            .send()
            .await
            .expect("Failed to send POST /stores");

        let status = response.status();
        if status != 200 {
            let error_body = response.text().await.unwrap_or_default();
            panic!("POST /stores failed with status {}: {}", status, error_body);
        }

        assert_eq!(status.as_u16(), 200, "POST /stores should return 200 OK");

        let body: Value = response
            .json()
            .await
            .expect("Failed to parse POST /stores response");
        println!("Response body: {:?}", body);

        assert_eq!(body["store_name"], "Test Store");
        assert_eq!(body["owner_address"], wallet_address);
        assert_eq!(body["image_cid"], "mock_cid", "Expected IPFS CID");

        let store_id = body["id"].as_str().expect("Store ID should be a string");
        let store_id_uuid = Uuid::parse_str(store_id).expect("Invalid store ID format");

        let store_row = sqlx::query!(
            "SELECT store_name, owner_address, image_cid, description FROM stores WHERE id = $1",
            store_id_uuid
        )
        .fetch_one(&pool)
        .await
        .expect("Failed to fetch store");
        assert_eq!(store_row.store_name, "Test Store");
        assert_eq!(store_row.owner_address, wallet_address);
        assert_eq!(store_row.image_cid, Some("mock_cid".into()));
        assert_eq!(store_row.description, Some("Store Description".into()));

        let update_payload = json!({
            "store_name": "Updated Store",
            "description": "Updated Description",
            "owner_address": wallet_address,
            "image": null
        });

        let response = client
            .put(format!("{}/stores/{}", server_addr, store_id))
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", token))
            .json(&update_payload)
            .send()
            .await
            .expect("Failed to send PUT /stores/:id");

        let status = response.status();
        if status != 200 {
            let error_body = response.text().await.unwrap_or_default();
            panic!(
                "PUT /stores/:id failed with status {}: {}",
                status, error_body
            );
        }

        assert_eq!(status.as_u16(), 200, "PUT /stores/:id should return 200 OK");

        let body: Value = response
            .json()
            .await
            .expect("Failed to parse PUT /stores/:id response");
        assert_eq!(body["store_name"], "Updated Store");
        assert_eq!(body["owner_address"], wallet_address);
        assert_eq!(body["description"], "Updated Description");
        assert_eq!(
            body["image_cid"], "mock_cid",
            "Image CID should remain unchanged"
        );

        let updated_store_row = sqlx::query!(
            "SELECT store_name, owner_address, image_cid, description FROM stores WHERE id = $1",
            store_id_uuid
        )
        .fetch_one(&pool)
        .await
        .expect("Failed to fetch updated store");
        assert_eq!(updated_store_row.store_name, "Updated Store");
        assert_eq!(updated_store_row.owner_address, wallet_address);
        assert_eq!(updated_store_row.image_cid, Some("mock_cid".into()));
        assert_eq!(
            updated_store_row.description,
            Some("Updated Description".into())
        );

        tx.rollback().await.expect("Failed to rollback transaction");
        server_task.abort();
    }

    #[tokio::test]
    async fn test_product_handlers() {
        let (app, pool, _state) = setup_test_app().await;
        let client = Client::new();
        let server_addr = "http://localhost:3010";

        let server_task = tokio::spawn(async move {
            axum::serve(
                tokio::net::TcpListener::bind("0.0.0.0:3010").await.unwrap(),
                app,
            )
            .await
            .unwrap();
        });

        let mut tx = pool.begin().await.expect("Failed to start transaction");

        // Use unique wallet_address
        let wallet_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
        let user_id = Uuid::new_v4();
        let email = format!("store_{}@example.com", user_id);
        let store_id = Uuid::new_v4();

        tx.execute(sqlx::query!(
            "INSERT INTO users (id, wallet_address, email, user_name) VALUES ($1, $2, $3, $4)",
            user_id,
            &wallet_address,
            &email,
            "Store Owner"
        ))
        .await
        .expect("Failed to insert test user");

        tx.execute(sqlx::query!(
            "INSERT INTO stores (id, store_name, owner_address, image_cid) VALUES ($1, $2, $3, $4)",
            store_id,
            "Test Store",
            &wallet_address,
            "mock_cid"
        ))
        .await
        .expect("Failed to insert test store");

        // Commit transaction to make store visible
        tx.commit().await.expect("Failed to commit transaction");

        // Start new transaction for cleanup
        let tx = pool.begin().await.expect("Failed to start transaction");

        let token = generate_jwt(&wallet_address).await;

        let product_payload = json!({
            "product_name": "Test Product",
            "description": "Test Description",
            "price": 10.99,
            "quantity": 100,
            "image": "data:image/jpeg;base64,SGVsbG8gV29ybGQ="
        });

        let response = client
            .post(format!("{}/stores/{}/products", server_addr, store_id))
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", token))
            .json(&product_payload)
            .send()
            .await
            .expect("Failed to send POST request");

        let status = response.status();
        if status != 200 {
            let error_body = response.text().await.unwrap_or_default();
            panic!(
                "POST /stores/{}/products failed with status {}: {}",
                store_id, status, error_body
            );
        }

        assert_eq!(status, 200, "POST should return 200 OK");

        let product: Product = response
            .json()
            .await
            .expect("Failed to parse product response");
        assert_eq!(product.product_name, "Test Product");
        assert_eq!(product.image_cid, Some("mock_cid".to_string()));

        let response = client
            .get(format!("{}/stores/{}/products", server_addr, store_id))
            .header("Authorization", format!("Bearer {}", token))
            .send()
            .await
            .expect("Failed to send GET /stores/:id/products");

        let status = response.status();
        if status != 200 {
            let error_body = response.text().await.unwrap_or_default();
            panic!(
                "GET /stores/{}/products failed with status {}: {}",
                store_id, status, error_body
            );
        }

        assert_eq!(status, 200, "GET /stores/:id/products should return 200 OK");

        let products: Vec<Product> = response
            .json()
            .await
            .expect("Failed to parse products list");
        assert!(!products.is_empty());
        assert_eq!(products[0].product_name, "Test Product");

        let response = client
            .get(format!("{}/products/{}/quantity", server_addr, product.id))
            .header("Authorization", format!("Bearer {}", token))
            .send()
            .await
            .expect("Failed to send GET /products/:id/quantity");

        let status = response.status();
        if status != 200 {
            let error_body = response.text().await.unwrap_or_default();
            panic!(
                "GET /products/{}/quantity failed with status {}: {}",
                product.id, status, error_body
            );
        }

        assert_eq!(
            status, 200,
            "GET /products/:id/quantity should return 200 OK"
        );

        let quantity: i32 = response.json().await.expect("Failed to parse quantity");
        assert_eq!(quantity, 100);

        tx.rollback().await.expect("Failed to rollback transaction");
        server_task.abort();
    }

    #[tokio::test]
    async fn test_unauthorized_access() {
        let (app, pool, _state) = setup_test_app().await;
        let client = Client::new();
        let server_addr = "http://localhost:3011";

        let server_task = tokio::spawn(async move {
            axum::serve(
                tokio::net::TcpListener::bind("0.0.0.0:3011").await.unwrap(),
                app,
            )
            .await
            .unwrap();
        });

        let mut tx = pool.begin().await.expect("Failed to start transaction");

        // Use unique wallet_address
        let owner_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
        let other_user_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
        let user_id = Uuid::new_v4();
        let store_id = Uuid::new_v4();
        let email = format!("store_{}@example.com", user_id);

        tx.execute(sqlx::query!(
            "INSERT INTO users (id, wallet_address, email, user_name) VALUES ($1, $2, $3, $4)",
            user_id,
            &owner_address,
            &email,
            "Store Owner"
        ))
        .await
        .expect("Failed to insert test user");

        tx.execute(sqlx::query!(
            "INSERT INTO stores (id, store_name, owner_address) VALUES ($1, $2, $3)",
            store_id,
            "Test Store",
            &owner_address
        ))
        .await
        .expect("Failed to insert test store");

        // Commit transaction to make store visible
        tx.commit().await.expect("Failed to commit transaction");

        // Start new transaction for cleanup
        let tx = pool.begin().await.expect("Failed to start transaction");

        let other_user_token = generate_jwt(&other_user_address).await;

        let product_payload = json!({
            "product_name": "Test Product",
            "description": "Test Description",
            "price": 10.99,
            "quantity": 100,
            "image": "data:image/jpeg;base64,SGVsbG8gV29ybGQ="
        });

        let response = client
            .post(format!("{}/stores/{}/products", server_addr, store_id))
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", other_user_token))
            .json(&product_payload)
            .send()
            .await
            .expect("Failed to send request");

        let status = response.status();
        if status != 403 {
            let error_body = response.text().await.unwrap_or_default();
            panic!(
                "POST /stores/{}/products failed with status {}: {}",
                store_id, status, error_body
            );
        }

        assert_eq!(
            status, 403,
            "POST /stores/{}/products should return 403 for non-owner",
            store_id
        );

        tx.rollback().await.expect("Failed to rollback transaction");
        server_task.abort();
    }

    #[tokio::test]
    async fn test_low_stock_logging() {
        let (app, pool, _state) = setup_test_app().await;
        let client = Client::new();
        let server_addr = "http://localhost:3012";

        let server_task = tokio::spawn(async move {
            axum::serve(
                tokio::net::TcpListener::bind("0.0.0.0:3012").await.unwrap(),
                app,
            )
            .await
            .unwrap();
        });

        let mut tx = pool.begin().await.expect("Failed to start transaction");

        // Use unique wallet_address
        let wallet_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
        let user_id = Uuid::new_v4();
        let email = format!("store_{}@example.com", user_id);
        let store_id = Uuid::new_v4();

        tx.execute(sqlx::query!(
            "INSERT INTO users (id, wallet_address, email, user_name) VALUES ($1, $2, $3, $4)",
            user_id,
            &wallet_address,
            &email,
            "Store Owner"
        ))
        .await
        .expect("Failed to insert test user");

        tx.execute(sqlx::query!(
            "INSERT INTO stores (id, store_name, owner_address) VALUES ($1, $2, $3)",
            store_id,
            "Test Store",
            &wallet_address
        ))
        .await
        .expect("Failed to insert test store");

        let product_id = Uuid::new_v4();
        tx.execute(sqlx::query!(
            "INSERT INTO products (id, store_id, product_name, price, quantity) VALUES ($1, $2, $3, $4, $5)",
            product_id,
            store_id,
            "Low Stock Item",
            Decimal::new(999, 2), // 9.99
            3 // Low quantity
        ))
        .await
        .expect("Failed to insert low stock product");

        // Commit transaction to make data visible
        tx.commit().await.expect("Failed to commit transaction");

        // Start new transaction for cleanup
        let tx = pool.begin().await.expect("Failed to start transaction");

        let token = generate_jwt(&wallet_address).await;

        let response = client
            .get(format!("{}/stores/{}/products", server_addr, store_id))
            .header("Authorization", format!("Bearer {}", token))
            .send()
            .await
            .expect("Failed to send GET /stores/:id/products");

        let status = response.status();
        if status != 200 {
            let error_body = response.text().await.unwrap_or_default();
            panic!(
                "GET /stores/{}/products failed with status {}: {}",
                store_id, status, error_body
            );
        }

        assert_eq!(status, 200, "GET /stores/:id/products should return 200 OK");

        tx.rollback().await.expect("Failed to rollback transaction");
        server_task.abort();
    }
}
