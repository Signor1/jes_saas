use axum::http::StatusCode;
use std::error::Error;

#[derive(Debug)]
pub enum AppError {
    Database(sqlx::Error),
    Ipfs(String),
    Web3(String),
    Abi(String),
    InitializationError(String),
    Internal(String),
}
impl From<web3::Error> for AppError {
    fn from(error: web3::Error) -> Self {
        AppError::Internal(error.to_string())
    }
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            AppError::Database(e) => write!(f, "Database error: {}", e),
            AppError::Ipfs(e) => write!(f, "IPFS error: {}", e),
            AppError::Web3(e) => write!(f, "Web3 error: {}", e),
            AppError::Abi(e) => write!(f, "ABI error: {}", e),
            AppError::InitializationError(e) => write!(f, "Initialization Error: {}", e),
            AppError::Internal(e) => write!(f, "Internal Error: {}", e),
        }
    }
}

impl Error for AppError {}

impl axum::response::IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let status = match &self {
            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::Ipfs(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::Web3(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::Abi(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::InitializationError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
        };
        (status, self.to_string()).into_response()
    }
}

impl From<(StatusCode, String)> for AppError {
    fn from((status, message): (StatusCode, String)) -> Self {
        AppError::Ipfs(message)
    }
}
