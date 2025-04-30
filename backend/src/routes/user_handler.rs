use crate::authentication::authentication::Claims;
use crate::db::models::*;
use ethabi::ethereum_types::Address;
use sqlx::types::Decimal;
use web3::types::{H256, U256};

use crate::db::models::{
    AddToCartRequest, CartItem, CheckoutRequest, CreateOrderRequest, Order, RegisterUserRequest,
    User,
};
use crate::db::operations::{
    add_to_cart, calculate_cart_total, checkout, create_order, get_cart, get_user_by_wallet,
    list_cart_items, register_user, update_order_status,
};
use crate::state::AppState;
use anyhow::{anyhow, Result};
use axum::{
    extract::{Extension, Json, Path, State},
    http::StatusCode,
};
use axum_macros::debug_handler;

use std::str::FromStr;
use std::sync::Arc;

#[debug_handler]
pub async fn register_user_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<RegisterUserRequest>,
) -> Result<Json<User>, (StatusCode, String)> {
    let user = register_user(&state.db.pool, payload)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(user))
}

#[debug_handler]
pub async fn add_to_cart_handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<AddToCartRequest>,
) -> Result<Json<CartItem>, (StatusCode, String)> {
    if claims.role != "user" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only users can add to cart".to_string(),
        ));
    }

    let user = get_user_by_wallet(&state.db.pool, &claims.sub)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or_else(|| (StatusCode::UNAUTHORIZED, "User not found".to_string()))?;

    let cart_item = add_to_cart(&state.db.pool, user.id, payload)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(cart_item))
}

#[debug_handler]
pub async fn get_cart_handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if claims.role != "user" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only users can view cart".to_string(),
        ));
    }

    let user = get_user_by_wallet(&state.db.pool, &claims.sub)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or_else(|| (StatusCode::UNAUTHORIZED, "User not found".to_string()))?;

    let cart = get_cart(&state.db.pool, user.id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if let Some(cart) = cart {
        let items = list_cart_items(&state.db.pool, cart.id)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        let total = calculate_cart_total(&state.db.pool, cart.id)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(serde_json::json!({
            "cart": cart,
            "items": items,
            "total": total
        })))
    } else {
        Ok(Json(serde_json::json!({})))
    }
}

#[debug_handler]
pub async fn checkout_handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<CheckoutRequest>,
) -> Result<Json<Order>, (StatusCode, String)> {
    if claims.role != "user" {
        return Err((StatusCode::FORBIDDEN, "Only users can checkout".to_string()));
    }
    if claims.sub != payload.buyer_address {
        return Err((StatusCode::FORBIDDEN, "Invalid buyer address".to_string()));
    }

    let user = get_user_by_wallet(&state.db.pool, &claims.sub)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or_else(|| (StatusCode::UNAUTHORIZED, "User not found".to_string()))?;

    let cart = get_cart(&state.db.pool, user.id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or_else(|| (StatusCode::BAD_REQUEST, "Cart not found".to_string()))?;

    if cart.id != payload.cart_id {
        return Err((StatusCode::BAD_REQUEST, "Invalid cart ID".to_string()));
    }

    let order = checkout(&state.db.pool, &state.web3, payload, user.id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(order))
}

pub async fn verify_payment<T: web3::Transport>(
    web3: &web3::Web3<T>,
    tx_hash: &str,
    expected_seller_address: &str,
    expected_amount: Decimal,
) -> anyhow::Result<()> {
    let tx_hash = H256::from_str(tx_hash.trim_start_matches("0x"))?;
    let receipt = web3
        .eth()
        .transaction_receipt(tx_hash)
        .await?
        .ok_or_else(|| anyhow!("Transaction not found"))?;

    if receipt.status != Some(1.into()) {
        return Err(anyhow!("Transaction failed"));
    }

    // Verify cUSD contract
    let cusd_contract = Address::from_str("0x874069Fa1Eb16D44d622BC6Cf16451f9B2bE0855")?;
    if receipt.to != Some(cusd_contract) {
        return Err(anyhow!("Transaction not sent to cUSD contract"));
    }

    let transfer_topic =
        H256::from_str("ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")?;
    let log = receipt
        .logs
        .iter()
        .find(|log| log.topics.get(0) == Some(&transfer_topic))
        .ok_or_else(|| anyhow!("Transfer event not found"))?;

    let seller_address = Address::from_slice(&log.topics[2][12..]);
    if seller_address != Address::from_str(expected_seller_address)? {
        return Err(anyhow!("Invalid seller address"));
    }

    let amount = U256::from_big_endian(&log.data.0);
    let expected_amount_wei = U256::from_dec_str(&format!(
        "{}000000000000000000", // Convert Decimal to Wei (18 decimals)
        expected_amount.to_string().replace(".", "")
    ))?;
    if amount != expected_amount_wei {
        return Err(anyhow!("Invalid payment amount"));
    }

    Ok(())
}

#[debug_handler]
pub async fn create_order_handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(mut payload): Json<CreateOrderRequest>,
) -> Result<Json<Order>, (StatusCode, String)> {
    if claims.role != "user" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only users can create orders".to_string(),
        ));
    }
    if claims.sub != payload.buyer_address {
        return Err((StatusCode::FORBIDDEN, "Invalid buyer address".to_string()));
    }

    let user = get_user_by_wallet(&state.db.pool, &claims.sub)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or_else(|| (StatusCode::UNAUTHORIZED, "User not found".to_string()))?;

    payload.user_id = user.id;

    let order = create_order(&state.db.pool, payload)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(order))
}

#[debug_handler]
pub async fn update_order_status_handler(
    State(state): State<Arc<AppState>>,
    Path(order_id): Path<String>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<UpdateOrderStatusRequest>,
) -> Result<(), (StatusCode, String)> {
    if claims.role != "store" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only store owners can update order status".to_string(),
        ));
    }

    let order = sqlx::query!(
        r#"
        SELECT store_id FROM orders WHERE order_id = $1
        "#,
        order_id
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|e| (StatusCode::NOT_FOUND, format!("Order not found: {}", e)))?;

    let store = sqlx::query!(
        r#"
        SELECT owner_address FROM stores WHERE id = $1
        "#,
        order.store_id
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|e| (StatusCode::NOT_FOUND, format!("Store not found: {}", e)))?;

    if store.owner_address != claims.sub {
        return Err((StatusCode::FORBIDDEN, "Not store owner".to_string()));
    }

    let valid_statuses = ["pending", "shipped", "delivered", "cancelled"];
    if !valid_statuses.contains(&payload.status.as_str()) {
        return Err((
            StatusCode::BAD_REQUEST,
            "Invalid status. Must be one of: pending, shipped, delivered, cancelled".to_string(),
        ));
    }

    update_order_status(&state.db.pool, &order_id, &payload.status)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(())
}
