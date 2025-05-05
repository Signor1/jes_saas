// #[cfg(test)]
// mod user_test {
//     use super::*;
//     use crate::authentication::authentication::{auth_middleware, Claims};
//     use crate::db::models::*;
//     use crate::routes::store_handler::*;
//     use crate::state::{AppState, AppStateDb};
//     use axum::{
//         routing::{get, post, put},
//         Router,
//     };
//     use jsonwebtoken::{encode, EncodingKey, Header};
//     use reqwest::Client;
//     use serde_json::{json, Value};
//     use sqlx::types::Decimal;
//     use sqlx::{Executor, PgPool};
//     use std::sync::Arc;
//     use std::time::{SystemTime, UNIX_EPOCH};
//     use uuid::Uuid;
//     use web3::{
//         transports::Http,
//         types::{Address, Log, TransactionReceipt, H256, U256},
//         Transport, Web3,
//     };
//
//     // Mock Web3 transport for verify_payment
//     #[derive(Clone)]
//     struct MockWeb3Transport {
//         should_succeed: bool,
//         seller_address: String,
//         amount: Decimal,
//     }
//
//     #[async_trait::async_trait]
//     impl Transport for MockWeb3Transport {
//         type Out = futures::future::Ready<web3::Result<serde_json::Value>>;
//
//         fn prepare(
//             &self,
//             _method: &str,
//             _params: Vec<serde_json::Value>,
//         ) -> (usize, serde_json::Value) {
//             (0, serde_json::Value::Null)
//         }
//
//         fn execute(&self, _id: usize, _request: serde_json::Value) -> Self::Out {
//             let receipt = if self.should_succeed {
//                 let transfer_topic = H256::from_str(
//                     "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
//                 )
//                 .unwrap();
//                 let seller_address = Address::from_str(&self.seller_address).unwrap();
//                 let amount_wei = U256::from_dec_str(&format!(
//                     "{}000000000000000000",
//                     self.amount.to_string().replace(".", "")
//                 ))
//                 .unwrap();
//                 let mut amount_bytes = [0u8; 32];
//                 amount_wei.to_big_endian(&mut amount_bytes);
//
//                 TransactionReceipt {
//                     status: Some(1.into()),
//                     to: Some(
//                         Address::from_str("0x874069Fa1Eb16D44d622BC6Cf16451f9B2bE0855").unwrap(),
//                     ),
//                     logs: vec![Log {
//                         topics: vec![
//                             transfer_topic,
//                             H256::zero(),
//                             H256::from_low_u64_be(0), // From address (not checked)
//                             H256::from_slice(&seller_address.as_bytes()[12..]), // To address
//                         ],
//                         data: amount_bytes.into(),
//                         ..Default::default()
//                     }],
//                     ..Default::default()
//                 }
//             } else {
//                 TransactionReceipt {
//                     status: Some(0.into()),
//                     ..Default::default()
//                 }
//             };
//
//             futures::future::ready(Ok(serde_json::to_value(receipt).unwrap()))
//         }
//     }
//
//     async fn cleanup_test_db(pool: &PgPool) -> Result<(), sqlx::Error> {
//         pool.execute(
//             "TRUNCATE TABLE users, cart, cart_items, orders, products, stores RESTART IDENTITY CASCADE"
//         )
//         .await?;
//         Ok(())
//     }
//
//     async fn setup_test_app(
//         mock_payment_success: bool,
//         seller_address: &str,
//         amount: Decimal,
//     ) -> (Router, PgPool, Arc<AppState>) {
//         dotenv::dotenv().ok();
//         let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
//         let pool = PgPool::connect(&database_url)
//             .await
//             .expect("Failed to connect to database");
//
//         cleanup_test_db(&pool)
//             .await
//             .expect("Failed to clean test database");
//
//         let state = Arc::new(AppState {
//             db: AppStateDb { pool: pool.clone() },
//             web3: Web3::new(MockWeb3Transport {
//                 should_succeed: mock_payment_success,
//                 seller_address: seller_address.to_string(),
//                 amount,
//             }),
//             pinata_client: reqwest::Client::new(),
//             pinata_api_key: std::env::var("PINATA_API_KEY").unwrap_or_default(),
//             pinata_secret_key: std::env::var("PINATA_SECRET_KEY").unwrap_or_default(),
//         });
//
//         let app = Router::new()
//             .route("/stores", post(create_store_handler))
//             .route(
//                 "/stores/:id",
//                 put(update_store_handler).delete(delete_store_handler),
//             )
//             .route(
//                 "/stores/:id/products",
//                 post(add_product_handler).get(list_products_handler),
//             )
//             .route("/stores/:id/orders", get(get_store_orders_handler))
//             .route("/products/:id/quantity", get(get_product_quantity_handler))
//             .route("/users/register", post(register_user_handler))
//             .route("/users/login", post(login_handler))
//             .route("/cart", post(add_to_cart_handler).get(get_cart_handler))
//             .route("/checkout", post(checkout_handler))
//             .route("/orders", post(create_order_handler))
//             .layer(axum::middleware::from_fn_with_state(
//                 state.clone(),
//                 auth_middleware,
//             ))
//             .with_state(state.clone());
//
//         (app, pool, state)
//     }
//
//     async fn generate_jwt(wallet_address: &str, role: &str) -> String {
//         let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
//         let claims = Claims {
//             sub: wallet_address.to_string(),
//             exp: (SystemTime::now()
//                 .duration_since(UNIX_EPOCH)
//                 .unwrap()
//                 .as_secs()
//                 + 3600) as usize,
//             role: role.to_string(),
//         };
//         encode(
//             &Header::default(),
//             &claims,
//             &EncodingKey::from_secret(secret.as_ref()),
//         )
//         .expect("Failed to generate JWT")
//     }
//
//     #[tokio::test]
//     async fn test_store_handlers() {
//         let (app, pool, _state) = setup_test_app(true, "", Decimal::zero()).await;
//         let client = Client::new();
//         let server_addr = "http://localhost:3009";
//
//         let server_task = tokio::spawn(async move {
//             axum::serve(
//                 tokio::net::TcpListener::bind("0.0.0.0:3009").await.unwrap(),
//                 app,
//             )
//             .await
//             .unwrap();
//         });
//
//         let mut tx = pool.begin().await.expect("Failed to start transaction");
//
//         let wallet_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
//         let user_id = Uuid::new_v4();
//         let email = format!("store_{}@example.com", user_id);
//         tx.execute(sqlx::query!(
//             "INSERT INTO users (id, wallet_address, email, user_name) VALUES ($1, $2, $3, $4)",
//             user_id,
//             &wallet_address,
//             &email,
//             "Store Owner"
//         ))
//         .await
//         .expect("Failed to insert test user");
//
//         let token = generate_jwt(&wallet_address, "store").await;
//
//         let create_payload = json!({
//             "store_name": "Test Store",
//             "description": "Store Description",
//             "owner_address": wallet_address,
//             "image": "data:image/jpeg;base64,SGVsbG8gV29ybGQ="
//         });
//
//         let response = client
//             .post(format!("{}/stores", server_addr))
//             .header("Content-Type", "application/json")
//             .header("Authorization", format!("Bearer {}", token))
//             .json(&create_payload)
//             .send()
//             .await
//             .expect("Failed to send POST /stores");
//
//         assert_eq!(response.status(), 200, "POST /stores should return 200 OK");
//
//         let body: Value = response
//             .json()
//             .await
//             .expect("Failed to parse POST /stores response");
//         assert_eq!(body["store_name"], "Test Store");
//         assert_eq!(body["owner_address"], wallet_address);
//
//         let store_id = body["id"].as_str().expect("Store ID should be a string");
//         let store_id_uuid = Uuid::parse_str(store_id).expect("Invalid store ID format");
//
//         // Test update store
//         let update_payload = json!({
//             "store_name": "Updated Store",
//             "description": "Updated Description",
//             "owner_address": wallet_address,
//             "image": null
//         });
//
//         let response = client
//             .put(format!("{}/stores/{}", server_addr, store_id))
//             .header("Content-Type", "application/json")
//             .header("Authorization", format!("Bearer {}", token))
//             .json(&update_payload)
//             .send()
//             .await
//             .expect("Failed to send PUT /stores/:id");
//
//         assert_eq!(
//             response.status(),
//             200,
//             "PUT /stores/:id should return 200 OK"
//         );
//
//         tx.rollback().await.expect("Failed to rollback transaction");
//         server_task.abort();
//     }
//
//     #[tokio::test]
//     async fn test_product_handlers() {
//         let (app, pool, _state) = setup_test_app(true, "", Decimal::zero()).await;
//         let client = Client::new();
//         let server_addr = "http://localhost:3010";
//
//         let server_task = tokio::spawn(async move {
//             axum::serve(
//                 tokio::net::TcpListener::bind("0.0.0.0:3010").await.unwrap(),
//                 app,
//             )
//             .await
//             .unwrap();
//         });
//
//         let mut tx = pool.begin().await.expect("Failed to start transaction");
//
//         let wallet_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
//         let user_id = Uuid::new_v4();
//         let email = format!("store_{}@example.com", user_id);
//         let store_id = Uuid::new_v4();
//
//         tx.execute(sqlx::query!(
//             "INSERT INTO users (id, wallet_address, email, user_name) VALUES ($1, $2, $3, $4)",
//             user_id,
//             &wallet_address,
//             &email,
//             "Store Owner"
//         ))
//         .await
//         .expect("Failed to insert test user");
//
//         tx.execute(sqlx::query!(
//             "INSERT INTO stores (id, store_name, owner_address, share_link) VALUES ($1, $2, $3, $4)",
//             store_id,
//             "Test Store",
//             &wallet_address,
//             "https://test.store"
//         ))
//         .await
//         .expect("Failed to insert test store");
//
//         tx.commit().await.expect("Failed to commit transaction");
//
//         let tx = pool.begin().await.expect("Failed to start transaction");
//
//         let token = generate_jwt(&wallet_address, "store").await;
//
//         let product_payload = json!({
//             "product_name": "Test Product",
//             "description": "Test Description",
//             "price": 10.99,
//             "quantity": 100,
//             "image": "data:image/jpeg;base64,SGVsbG8gV29ybGQ="
//         });
//
//         let response = client
//             .post(format!("{}/stores/{}/products", server_addr, store_id))
//             .header("Content-Type", "application/json")
//             .header("Authorization", format!("Bearer {}", token))
//             .json(&product_payload)
//             .send()
//             .await
//             .expect("Failed to send POST request");
//
//         assert_eq!(response.status(), 200, "POST should return 200 OK");
//
//         tx.rollback().await.expect("Failed to rollback transaction");
//         server_task.abort();
//     }
//
//     #[tokio::test]
//     async fn test_register_user_handler() {
//         let (app, pool, _state) = setup_test_app(true, "", Decimal::zero()).await;
//         let client = Client::new();
//         let server_addr = "http://localhost:3013";
//
//         let server_task = tokio::spawn(async move {
//             axum::serve(
//                 tokio::net::TcpListener::bind("0.0.0.0:3013").await.unwrap(),
//                 app,
//             )
//             .await
//             .unwrap();
//         });
//
//         let mut tx = pool.begin().await.expect("Failed to start transaction");
//
//         let wallet_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
//         let email = format!("user_{}@example.com", Uuid::new_v4());
//
//         let payload = json!({
//             "wallet_address": wallet_address,
//             "email": email,
//             "user_name": "Test User",
//             "phone_number": "+1234567890",
//             "house_address": "123 Test St"
//         });
//
//         let response = client
//             .post(format!("{}/users/register", server_addr))
//             .header("Content-Type", "application/json")
//             .json(&payload)
//             .send()
//             .await
//             .expect("Failed to send POST /users/register");
//
//         assert_eq!(
//             response.status(),
//             200,
//             "POST /users/register should return 200 OK"
//         );
//
//         tx.rollback().await.expect("Failed to rollback transaction");
//         server_task.abort();
//     }
//
//     #[tokio::test]
//     async fn test_checkout_handler() {
//         let wallet_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
//         let seller_address = format!("0x{}", hex::encode(Uuid::new_v4().as_bytes()));
//         let total = Decimal::new(1998, 2); // 2 * 9.99
//         let (app, pool, _state) = setup_test_app(true, &seller_address, total).await;
//         let client = Client::new();
//         let server_addr = "http://localhost:3017";
//
//         let server_task = tokio::spawn(async move {
//             axum::serve(
//                 tokio::net::TcpListener::bind("0.0.0.0:3017").await.unwrap(),
//                 app,
//             )
//             .await
//             .unwrap();
//         });
//
//         let mut tx = pool.begin().await.expect("Failed to start transaction");
//
//         let user_id = Uuid::new_v4();
//         let email = format!("user_{}@example.com", user_id);
//         let store_id = Uuid::new_v4();
//         let product_id = Uuid::new_v4();
//         let cart_id = Uuid::new_v4();
//
//         tx.execute(sqlx::query!(
//             "INSERT INTO users (id, wallet_address, email, user_name) VALUES ($1, $2, $3, $4)",
//             user_id,
//             &wallet_address,
//             &email,
//             "Test User"
//         ))
//         .await
//         .expect("Failed to insert test user");
//
//         tx.execute(sqlx::query!(
//             "INSERT INTO stores (id, store_name, owner_address, share_link) VALUES ($1, $2, $3, $4)",
//             store_id,
//             "Test Store",
//             &seller_address,
//             "https://test.store"
//         ))
//         .await
//         .expect("Failed to insert test store");
//
//         tx.execute(sqlx::query!(
//             "INSERT INTO products (id, store_id, product_name, price, quantity) VALUES ($1, $2, $3, $4, $5)",
//             product_id,
//             store_id,
//             "Test Product",
//             Decimal::new(999, 2),
//             10
//         ))
//         .await
//         .expect("Failed to insert test product");
//
//         tx.execute(sqlx::query!(
//             "INSERT INTO cart (id, user_id) VALUES ($1, $2)",
//             cart_id,
//             user_id
//         ))
//         .await
//         .expect("Failed to insert test cart");
//
//         tx.execute(sqlx::query!(
//             "INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES ($1, $2, $3, $4)",
//             Uuid::new_v4(),
//             cart_id,
//             product_id,
//             2
//         ))
//         .await
//         .expect("Failed to insert test cart item");
//
//         tx.commit().await.expect("Failed to commit transaction");
//
//         let tx = pool.begin().await.expect("Failed to start transaction");
//
//         let token = generate_jwt(&wallet_address, "user").await;
//
//         let payload = json!({
//             "cart_id": cart_id,
//             "buyer_address": wallet_address,
//             "payment_type": "cUSD",
//             "transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
//         });
//
//         let response = client
//             .post(format!("{}/checkout", server_addr))
//             .header("Content-Type", "application/json")
//             .header("Authorization", format!("Bearer {}", token))
//             .json(&payload)
//             .send()
//             .await
//             .expect("Failed to send POST /checkout");
//
//         assert_eq!(
//             response.status(),
//             200,
//             "POST /checkout should return 200 OK"
//         );
//
//         tx.rollback().await.expect("Failed to rollback transaction");
//         server_task.abort();
//     }
// }
