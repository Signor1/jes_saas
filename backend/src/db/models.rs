use serde::{Deserialize, Serialize};
use sqlx::types::Decimal;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Store {
    pub id: Uuid,
    pub store_name: String,
    pub image_cid: Option<String>,
    pub description: Option<String>,
    pub owner_address: String,
    pub share_link: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Product {
    pub id: Uuid,
    pub store_id: Uuid,
    pub product_name: String,
    pub image_cid: Option<String>,
    pub description: Option<String>,
    pub price: Decimal,
    pub quantity: i32,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Order {
    pub id: Uuid,
    pub order_id: String,
    pub store_id: Uuid,
    pub product_id: Uuid,
    pub user_id: Option<Uuid>,
    pub buyer_address: String,
    pub seller_address: String,
    pub amount: Decimal,
    pub status: String,
    pub payment_status: String,
    pub transaction_hash: Option<String>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub wallet_address: String,
    pub user_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub house_address: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Cart {
    pub id: Uuid,
    pub user_id: Uuid,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct CartItem {
    pub id: Uuid,
    pub cart_id: Uuid,
    pub product_id: Uuid,
    pub quantity: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateStoreRequest {
    pub store_name: String,
    pub image: Option<String>,
    pub description: Option<String>,
    pub owner_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AddProductRequest {
    pub product_name: String,
    pub image: Option<String>,
    pub description: Option<String>,
    pub price: Decimal,
    pub quantity: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateOrderRequest {
    pub store_id: Uuid,
    pub product_id: Uuid,
    pub user_id: Uuid,
    pub buyer_address: String,
    pub seller_address: String,
    pub amount: Decimal,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterUserRequest {
    pub wallet_address: String,
    pub user_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub house_address: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AddToCartRequest {
    pub product_id: Uuid,
    pub quantity: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CheckoutRequest {
    pub cart_id: Uuid,
    pub buyer_address: String,
    pub payment_type: String,
    pub transaction_hash: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    pub wallet_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub token: String,
}

#[derive(Deserialize)]
pub struct UpdateOrderStatusRequest {
    pub status: String,
}
