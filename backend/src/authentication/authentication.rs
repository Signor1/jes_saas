use crate::db::models::{LoginRequest, LoginResponse};
use crate::state::AppState;
use axum::{body::Body, http::Request, middleware::Next, response::Response};
use axum::{extract::State, http::StatusCode, Json};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::Arc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub role: String,
    pub exp: usize,
}

pub async fn auth_middleware(
    State(_state): State<Arc<AppState>>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, (StatusCode, String)> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|header| header.to_str().ok())
        .ok_or_else(|| {
            (
                StatusCode::UNAUTHORIZED,
                "Missing Authorization header".to_string(),
            )
        })?;

    let token = auth_header.strip_prefix("Bearer ").ok_or_else(|| {
        (
            StatusCode::UNAUTHORIZED,
            "Invalid Authorization header".to_string(),
        )
    })?;

    let claims = decode::<Claims>(
        token,
        &DecodingKey::from_secret(
            env::var("JWT_SECRET")
                .expect("JWT_SECRET must be set")
                .as_ref(),
        ),
        &Validation::default(),
    )
    .map_err(|e| (StatusCode::UNAUTHORIZED, e.to_string()))?
    .claims;

    req.extensions_mut().insert(claims);
    Ok(next.run(req).await)
}

pub async fn login_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, String)> {
    let user = crate::db::operations::get_user_by_wallet(&state.db.pool, &payload.wallet_address)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let role = if let Some(_user) = user {
        let store = sqlx::query!(
            r#"
            SELECT id FROM stores WHERE owner_address = $1
            "#,
            payload.wallet_address
        )
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        if store.is_some() { "store" } else { "user" }.to_string()
    } else {
        return Err((StatusCode::UNAUTHORIZED, "User not found".to_string()));
    };

    let claims = Claims {
        sub: payload.wallet_address,
        role,
        exp: (std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            + std::time::Duration::from_secs(24 * 3600))
        .as_secs() as usize,
    };

    let token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &jsonwebtoken::EncodingKey::from_secret(
            env::var("JWT_SECRET")
                .expect("JWT_SECRET must be set")
                .as_ref(),
        ),
    )
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(LoginResponse { token }))
}
