use reqwest::Client;
use web3::{transports::Http, Web3};

use sqlx::PgPool;
#[derive(Clone)]
pub struct AppState {
    pub db: AppStateDb,
    pub web3: Web3<Http>,
    pub pinata_client: Client,
    pub pinata_api_key: String,
    pub pinata_secret_key: String,
}

#[derive(Clone)]
pub struct AppStateDb {
    pub pool: PgPool,
}
