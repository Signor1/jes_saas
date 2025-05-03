use crate::authentication::authentication::Claims;
use crate::db::operations::{
    delete_store, get_all_stores, get_store_by_id, get_store_orders, update_store,
};
use crate::state::AppState;
use crate::{add_product, create_store, get_product_quantity, list_products, Product};
use crate::{AddProductRequest, CreateStoreRequest, Order, Store};
use axum::http::StatusCode;
use axum::{
    extract::{Extension, Path, State},
    Json,
};
use axum_macros::debug_handler;
use std::sync::Arc;
use tracing::{debug, info};
use uuid::Uuid;

#[debug_handler]
pub async fn create_store_handler(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<CreateStoreRequest>,
) -> Result<Json<Store>, (StatusCode, String)> {
    if claims.role != "store" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only store owners can create stores".to_string(),
        ));
    }
    if claims.sub != payload.owner_address {
        return Err((StatusCode::FORBIDDEN, "Invalid owner address".to_string()));
    }

    let image_cid = if let Some(image) = payload.image.as_ref() {
        Some(
            crate::utils::ipfs::upload_to_ipfs(&state, image)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?,
        )
    } else {
        None
    };

    let store = create_store(&state.db.pool, payload, image_cid)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(store))
}

#[debug_handler]
pub async fn add_product_handler(
    State(state): State<Arc<AppState>>,
    Path(store_id): Path<Uuid>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<AddProductRequest>,
) -> Result<Json<Product>, (StatusCode, String)> {
    if claims.role != "store" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only store owners can add products".to_string(),
        ));
    }

    let store = sqlx::query!(
        r#"
        SELECT owner_address FROM stores WHERE id = $1
        "#,
        store_id
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| (StatusCode::NOT_FOUND, "Store not found".to_string()))?;

    if store.owner_address != claims.sub {
        return Err((StatusCode::FORBIDDEN, "Not store owner".to_string()));
    }

    let image_cid = if let Some(image) = payload.image.as_ref() {
        Some(
            crate::utils::ipfs::upload_to_ipfs(&state, image)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?,
        )
    } else {
        None
    };

    let product = add_product(&state.db.pool, store_id, payload, image_cid)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(product))
}

#[debug_handler]
pub async fn list_products_handler(
    State(state): State<Arc<AppState>>,
    Path(store_id): Path<Uuid>,
) -> Result<Json<Vec<Product>>, (StatusCode, String)> {
    let products = list_products(&state.db.pool, store_id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    for product in &products {
        if product.quantity < 5 {
            info!(
                "Low stock for product {}: {} left",
                product.product_name, product.quantity
            );
        }
    }
    Ok(Json(products))
}

#[debug_handler]
pub async fn get_product_quantity_handler(
    State(state): State<Arc<AppState>>,
    Path(product_id): Path<Uuid>,
) -> Result<Json<i32>, (StatusCode, String)> {
    debug!("Fetching quantity for product_id: {}", product_id);
    let quantity = get_product_quantity(&state.db.pool, product_id)
        .await
        .map_err(|e| {
            debug!(
                "Error fetching quantity for product_id {}: {:?}",
                product_id, e
            );
            match e {
                sqlx::Error::RowNotFound => (
                    StatusCode::NOT_FOUND,
                    format!("Product {} not found", product_id),
                ),
                _ => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
            }
        })?;
    Ok(Json(quantity))
}

#[debug_handler]
pub async fn get_store_orders_handler(
    State(state): State<Arc<AppState>>,
    Path(store_id): Path<Uuid>,
    Extension(claims): Extension<Claims>,
) -> Result<Json<Vec<Order>>, (StatusCode, String)> {
    if claims.role != "store" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only store owners can view orders".to_string(),
        ));
    }

    let store = sqlx::query!(
        r#"
        SELECT owner_address FROM stores WHERE id = $1
        "#,
        store_id
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| (StatusCode::NOT_FOUND, "Store not found".to_string()))?;

    if store.owner_address != claims.sub {
        return Err((StatusCode::FORBIDDEN, "Not store owner".to_string()));
    }

    let orders = get_store_orders(&state.db.pool, store_id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(orders))
}

#[debug_handler]
pub async fn update_store_handler(
    State(state): State<Arc<AppState>>,
    Path(store_id): Path<Uuid>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<CreateStoreRequest>,
) -> Result<Json<Store>, (StatusCode, String)> {
    if claims.role != "store" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only store owners can update stores".to_string(),
        ));
    }

    let existing_store = sqlx::query!(
        r#"
        SELECT owner_address, image_cid FROM stores WHERE id = $1
        "#,
        store_id
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| (StatusCode::NOT_FOUND, "Store not found".to_string()))?;

    if existing_store.owner_address != claims.sub {
        return Err((StatusCode::FORBIDDEN, "Not store owner".to_string()));
    }

    let image_cid = if let Some(image) = payload.image.as_ref() {
        Some(
            crate::utils::ipfs::upload_to_ipfs(&state, image)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?,
        )
    } else {
        existing_store.image_cid
    };

    let store = update_store(&state.db.pool, store_id, payload, image_cid)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(store))
}

#[debug_handler]
pub async fn delete_store_handler(
    State(state): State<Arc<AppState>>,
    Path(store_id): Path<Uuid>,
    Extension(claims): Extension<Claims>,
) -> Result<(), (StatusCode, String)> {
    if claims.role != "store" {
        return Err((
            StatusCode::FORBIDDEN,
            "Only store owners can delete stores".to_string(),
        ));
    }

    let store = sqlx::query!(
        r#"
        SELECT owner_address FROM stores WHERE id = $1
        "#,
        store_id
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| (StatusCode::NOT_FOUND, "Store not found".to_string()))?;

    if store.owner_address != claims.sub {
        return Err((StatusCode::FORBIDDEN, "Not store owner".to_string()));
    }

    delete_store(&state.db.pool, store_id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(())
}

#[debug_handler]
pub async fn get_all_stores_handler(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Store>>, (StatusCode, String)> {
    let stores = get_all_stores(&state.db.pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(stores))
}

#[debug_handler]
pub async fn get_store_by_id_handler(
    Path(store_id): Path<Uuid>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Store>, (StatusCode, String)> {
    let store = get_store_by_id(&state.db.pool, store_id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(store))
}
