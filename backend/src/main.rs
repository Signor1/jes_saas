use crate::routes::store_handler::*;
use axum::{
    body::Body,
    http::{header, Request, Response, StatusCode},
    middleware,
    response::IntoResponse,
    routing::{get, post, put},
    Router,
};
use db::{models::*, operations::*};
use log::info;
use routes::user_handler::*;
use std::net::SocketAddr;
use std::sync::Arc;
mod initializers;
use crate::authentication::authentication::*;
use initializers::{database::initialize_database, web3::initialize_web3};
mod authentication;
mod db;
mod routes;
mod state;
mod utils;
use state::{AppState, AppStateDb};
mod error;
mod store_test;
mod user_test;

async fn cors_middleware(req: Request<Body>, next: middleware::Next) -> impl IntoResponse {
    let mut response = next.run(req).await;

    // Add CORS headers
    response
        .headers_mut()
        .insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    response.headers_mut().insert(
        header::ACCESS_CONTROL_ALLOW_METHODS,
        "GET, POST, PUT, DELETE, OPTIONS".parse().unwrap(),
    );
    response
        .headers_mut()
        .insert(header::ACCESS_CONTROL_ALLOW_HEADERS, "*".parse().unwrap());
    response.headers_mut().insert(
        header::ACCESS_CONTROL_ALLOW_CREDENTIALS,
        "true".parse().unwrap(),
    );

    // Handle preflight OPTIONS requests
    if response.status() == StatusCode::METHOD_NOT_ALLOWED
        && response.headers().get(header::ALLOW).is_some()
    {
        Response::builder()
            .status(StatusCode::OK)
            .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
            .header(
                header::ACCESS_CONTROL_ALLOW_METHODS,
                "GET, POST, PUT, DELETE, OPTIONS",
            )
            .header(header::ACCESS_CONTROL_ALLOW_HEADERS, "*")
            .header(header::ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")
            .body(Body::empty())
            .unwrap()
    } else {
        response
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv::dotenv().ok();
    tracing_subscriber::fmt::init();
    let db = initialize_database().await;
    let state = Arc::new(AppState {
        db: AppStateDb { pool: db.clone() },
        web3: initialize_web3(),
        pinata_client: reqwest::Client::new(),
        pinata_api_key: std::env::var("PINATA_API_KEY").expect("PINATA_API_KEY must be set"),
        pinata_secret_key: std::env::var("PINATA_SECRET_KEY")
            .expect("PINATA_SECRET_KEY must be set"),
    });

    let auth_layer = middleware::from_fn_with_state(state.clone(), auth_middleware);

    let app = Router::new()
        .route("/", get(|| async { "JES SaaS Backend is running!" }))
        .route("/login", post(login_handler))
        .route("/register", post(register_user_handler))
        .route(
            "/create_store",
            post(create_store_handler).layer(auth_layer.clone()),
        )
        .route(
            "/stores/:id/products",
            post(add_product_handler)
                .get(list_products_handler)
                .layer(auth_layer.clone()),
        )
        .route(
            "/stores/:id/orders",
            get(get_store_orders_handler).layer(auth_layer.clone()),
        )
        .route(
            "/stores/:id",
            put(update_store_handler)
                .delete(delete_store_handler)
                .layer(auth_layer.clone()),
        )
        .route("/products/:id/quantity", get(get_product_quantity_handler))
        .route(
            "/create_orders",
            post(create_order_handler).layer(auth_layer.clone()),
        )
        .route("/stores", get(get_all_stores_handler))
        .route(
            "/cart",
            post(add_to_cart_handler)
                .get(get_cart_handler)
                .layer(auth_layer.clone()),
        )
        .route("/store/:store_id", get(get_store_by_id_handler))
        .route("/checkout", post(checkout_handler).layer(auth_layer))
        .with_state(state)
        .layer(middleware::from_fn(cors_middleware));

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    info!("Listening on {}", addr);
    println!("Listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
