use crate::db::models::*;
use crate::routes::user_handler::verify_payment;
use crate::CheckoutRequest;
use crate::Order;
use anyhow::Result;
use num_traits::identities::Zero;
use sqlx::{types::Decimal, PgPool};
use uuid::Uuid;
use web3::transports::Http;
use web3::Web3;

pub async fn register_user(db: &PgPool, payload: RegisterUserRequest) -> Result<User, sqlx::Error> {
    let user = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (id, wallet_address, user_name, email, phone_number, house_address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, wallet_address, user_name, email, phone_number, house_address
        "#,
        Uuid::new_v4(),
        payload.wallet_address,
        payload.user_name,
        payload.email,
        payload.phone_number,
        payload.house_address
    )
    .fetch_one(db)
    .await?;

    Ok(user)
}

pub async fn get_user_by_wallet(
    db: &PgPool,
    wallet_address: &str,
) -> Result<Option<User>, sqlx::Error> {
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT id, wallet_address, user_name, email, phone_number, house_address
        FROM users
        WHERE wallet_address = $1
        "#,
        wallet_address
    )
    .fetch_optional(db)
    .await?;

    Ok(user)
}

pub async fn create_store(
    db: &PgPool,
    payload: CreateStoreRequest,
    image_cid: Option<String>,
) -> Result<Store, sqlx::Error> {
    let store_id = Uuid::new_v4();
    let share_link = format!("https://jes-saas.onrender.com/store/{}", store_id);

    sqlx::query!(
        r#"
        INSERT INTO stores (id, store_name, image_cid, description, owner_address)
        VALUES ($1, $2, $3, $4, $5)
        "#,
        store_id,
        payload.store_name,
        image_cid,
        payload.description,
        payload.owner_address
    )
    .execute(db)
    .await?;

    let store = sqlx::query_as!(
        Store,
        r#"
        SELECT id, store_name, image_cid, description, owner_address, $1 as "share_link!"
        FROM stores
        WHERE id = $2
        "#,
        share_link,
        store_id
    )
    .fetch_one(db)
    .await?;

    Ok(store)
}

pub async fn add_product(
    db: &PgPool,
    store_id: Uuid,
    payload: AddProductRequest,
    image_cid: Option<String>,
) -> Result<Product, sqlx::Error> {
    let product = sqlx::query_as!(
        Product,
        r#"
        INSERT INTO products (id, store_id, product_name, image_cid, description, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, store_id, product_name, image_cid, description, price, quantity
        "#,
        Uuid::new_v4(),
        store_id,
        payload.product_name,
        image_cid,
        payload.description,
        payload.price,
        payload.quantity
    )
    .fetch_one(db)
    .await?;

    Ok(product)
}

pub async fn list_products(db: &PgPool, store_id: Uuid) -> Result<Vec<Product>, sqlx::Error> {
    let products = sqlx::query_as!(
        Product,
        r#"
        SELECT id, store_id, product_name, image_cid, description, price, quantity
        FROM products
        WHERE store_id = $1
        "#,
        store_id
    )
    .fetch_all(db)
    .await?;

    Ok(products)
}

pub async fn get_product_quantity(db: &PgPool, product_id: Uuid) -> Result<i32, sqlx::Error> {
    let quantity = sqlx::query_scalar!(
        r#"
        SELECT get_product_quantity($1) AS quantity
        "#,
        product_id
    )
    .fetch_one(db)
    .await?
    .unwrap_or(0);

    Ok(quantity)
}

pub async fn add_to_cart(
    db: &PgPool,
    user_id: Uuid,
    payload: AddToCartRequest,
) -> Result<CartItem, sqlx::Error> {
    let cart = match get_cart(db, user_id).await? {
        Some(cart) => cart,
        None => {
            sqlx::query_as!(
                Cart,
                r#"
                INSERT INTO cart (id, user_id)
                VALUES ($1, $2)
                RETURNING id, user_id
                "#,
                Uuid::new_v4(),
                user_id
            )
            .fetch_one(db)
            .await?
        }
    };

    let existing_item = sqlx::query_as!(
        CartItem,
        r#"
        SELECT id, cart_id, product_id, quantity 
        FROM cart_items 
        WHERE cart_id = $1 AND product_id = $2
        "#,
        cart.id,
        payload.product_id
    )
    .fetch_optional(db)
    .await?;

    let cart_item = match existing_item {
        Some(item) => {
            sqlx::query_as!(
                CartItem,
                r#"
                UPDATE cart_items
                SET quantity = quantity + $1
                WHERE id = $2
                RETURNING id, cart_id, product_id, quantity
                "#,
                payload.quantity,
                item.id
            )
            .fetch_one(db)
            .await?
        }
        None => {
            sqlx::query_as!(
                CartItem,
                r#"
                INSERT INTO cart_items (id, cart_id, product_id, quantity)
                VALUES ($1, $2, $3, $4)
                RETURNING id, cart_id, product_id, quantity
                "#,
                Uuid::new_v4(),
                cart.id,
                payload.product_id,
                payload.quantity
            )
            .fetch_one(db)
            .await?
        }
    };

    Ok(cart_item)
}
pub async fn get_cart(db: &PgPool, user_id: Uuid) -> Result<Option<Cart>, sqlx::Error> {
    let cart = sqlx::query_as!(
        Cart,
        r#"
        SELECT id, user_id
        FROM cart
        WHERE user_id = $1
        "#,
        user_id
    )
    .fetch_optional(db)
    .await?;

    Ok(cart)
}

pub async fn list_cart_items(db: &PgPool, cart_id: Uuid) -> Result<Vec<CartItem>, sqlx::Error> {
    let items = sqlx::query_as!(
        CartItem,
        r#"
        SELECT id, cart_id, product_id, quantity
        FROM cart_items
        WHERE cart_id = $1
        "#,
        cart_id
    )
    .fetch_all(db)
    .await?;

    Ok(items)
}

pub async fn calculate_cart_total(db: &PgPool, cart_id: Uuid) -> Result<Decimal, sqlx::Error> {
    let total = sqlx::query_scalar!(
        r#"
        SELECT SUM(p.price * ci.quantity) as total
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = $1
        "#,
        cart_id
    )
    .fetch_one(db)
    .await?
    .unwrap_or(Decimal::ZERO);

    Ok(total)
}

pub async fn checkout(
    pool: &PgPool,
    web3: &Web3<Http>,
    payload: CheckoutRequest,
    user_id: Uuid,
) -> Result<Order> {
    let cart_items = sqlx::query!(
        r#"
        SELECT ci.product_id, ci.quantity, p.price, p.store_id, p.quantity as stock, s.owner_address
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        JOIN stores s ON p.store_id = s.id
        WHERE ci.cart_id = $1
        "#,
        payload.cart_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow::anyhow!("Failed to fetch cart items: {}", e))?;

    if cart_items.is_empty() {
        return Err(anyhow::anyhow!("Cart is empty"));
    }

    let mut total_amount = Decimal::zero();
    for item in &cart_items {
        if item.stock < item.quantity {
            return Err(anyhow::anyhow!(
                "Insufficient stock for product: {}",
                item.product_id
            ));
        }
        total_amount += item.price * Decimal::from(item.quantity);
    }

    let first_item = &cart_items[0];
    verify_payment(
        web3,
        &payload.transaction_hash,
        &first_item.owner_address,
        total_amount,
    )
    .await
    .map_err(|e| anyhow::anyhow!("Payment verification failed: {}", e))?;

    let mut first_order = None;
    for item in cart_items {
        let order_request = CreateOrderRequest {
            store_id: item.store_id,
            product_id: item.product_id,
            user_id,
            buyer_address: payload.buyer_address.clone(),
            seller_address: item.owner_address.clone(),
            amount: item.price * Decimal::from(item.quantity),
        };

        let mut order = create_order(pool, order_request)
            .await
            .map_err(|e| anyhow::anyhow!("Failed to create order: {}", e))?;

        order.transaction_hash = Some(payload.transaction_hash.clone());
        order.payment_status = "confirmed".to_string();
        order.status = "pending".to_string();
        order.updated_at = Some(chrono::Utc::now());

        sqlx::query!(
            r#"
            UPDATE orders
            SET transaction_hash = $1, payment_status = $2, status = $3, updated_at = $4
            WHERE id = $5
            "#,
            order.transaction_hash,
            &order.payment_status,
            &order.status,
            order.updated_at,
            order.id
        )
        .execute(pool)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to update order: {}", e))?;

        sqlx::query!(
            "UPDATE products SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1",
            item.quantity,
            item.product_id
        )
        .execute(pool)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to update stock: {}", e))?;

        if first_order.is_none() {
            first_order = Some(order);
        }
    }

    sqlx::query!("DELETE FROM cart_items WHERE cart_id = $1", payload.cart_id)
        .execute(pool)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to clear cart: {}", e))?;

    let order = first_order.ok_or_else(|| anyhow::anyhow!("No orders created"))?;

    if order.created_at.is_none() || order.updated_at.is_none() {
        return Err(anyhow::anyhow!("Order missing timestamps"));
    }

    Ok(order)
}
pub async fn create_order(db: &PgPool, payload: CreateOrderRequest) -> Result<Order, sqlx::Error> {
    let order_id = format!(
        "{}-{}-{}",
        payload.store_id,
        payload.product_id,
        Uuid::new_v4()
    );
    let amount = payload.amount;

    let order = sqlx::query_as!(
        Order,
        r#"
        INSERT INTO orders (
            id, order_id, store_id, product_id, user_id, buyer_address, seller_address,
            amount, status, payment_status, transaction_hash
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', 'pending', NULL)
        RETURNING
            id, order_id, store_id, product_id, user_id, buyer_address, seller_address,
            amount, status, payment_status, transaction_hash, created_at, updated_at
        "#,
        Uuid::new_v4(),
        &order_id,
        payload.store_id,
        payload.product_id,
        payload.user_id,
        payload.buyer_address,
        payload.seller_address,
        amount
    )
    .fetch_one(db)
    .await?;

    if order.created_at.is_none() || order.updated_at.is_none() {
        return Err(sqlx::Error::RowNotFound);
    }

    sqlx::query!(
        r#"
        UPDATE products
        SET quantity = quantity - 1
        WHERE id = $1 AND quantity > 0
        "#,
        payload.product_id
    )
    .execute(db)
    .await?;

    Ok(order)
}

pub async fn update_order_status(
    db: &PgPool,
    order_id: &str,
    status: &str,
) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        UPDATE orders
        SET status = $1
        WHERE order_id = $2
        "#,
        status,
        order_id
    )
    .execute(db)
    .await?;

    Ok(())
}

pub async fn get_store_orders(db: &PgPool, store_id: Uuid) -> Result<Vec<Order>, sqlx::Error> {
    let orders = sqlx::query_as!(
        Order,
        r#"
        SELECT
            id, order_id, store_id, product_id, user_id, buyer_address, seller_address,
            amount, status, payment_status, transaction_hash, created_at, updated_at
        FROM orders
        WHERE store_id = $1
        "#,
        store_id
    )
    .fetch_all(db)
    .await?;

    for order in &orders {
        if order.created_at.is_none() || order.updated_at.is_none() {
            return Err(sqlx::Error::RowNotFound);
        }
    }

    Ok(orders)
}

pub async fn update_store(
    db: &PgPool,
    store_id: Uuid,
    payload: CreateStoreRequest,
    image_cid: Option<String>,
) -> Result<Store, sqlx::Error> {
    let share_link = format!("https://jes-saas.onrender.com/store/{}", store_id);

    sqlx::query!(
        r#"
        UPDATE stores
        SET store_name = $1, image_cid = $2, description = $3, owner_address = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        "#,
        payload.store_name,
        image_cid,
        payload.description,
        payload.owner_address,
        store_id
    )
    .execute(db)
    .await?;

    let store = sqlx::query_as!(
        Store,
        r#"
        SELECT id, store_name, image_cid, description, owner_address, $1 as "share_link!"
        FROM stores
        WHERE id = $2
        "#,
        share_link,
        store_id
    )
    .fetch_one(db)
    .await?;

    Ok(store)
}

pub async fn delete_store(db: &PgPool, store_id: Uuid) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        DELETE FROM stores
        WHERE id = $1
        "#,
        store_id
    )
    .execute(db)
    .await?;

    Ok(())
}

pub async fn get_all_stores(db: &PgPool) -> Result<Vec<Store>, sqlx::Error> {
    let stores = sqlx::query_as!(
        Store,
        r#"
        SELECT 
            id, 
            store_name, 
            image_cid, 
            description, 
            owner_address,
            format('https://jes-saas.onrender.com/store/{}', id) as "share_link!"
        FROM stores
        "#
    )
    .fetch_all(db)
    .await?;

    Ok(stores)
}

pub async fn get_store_by_id(db: &PgPool, store_id: Uuid) -> Result<Store, sqlx::Error> {
    sqlx::query_as!(
        Store,
        r#"
        SELECT 
            id, 
            store_name, 
            image_cid, 
            description, 
            owner_address,
            format('https://jes-saas.onrender.com/store/{}', id) as "share_link!"
        FROM stores
        WHERE id = $1
        "#,
        store_id
    )
    .fetch_one(db)
    .await
}
