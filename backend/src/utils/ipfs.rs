use crate::state::AppState;
use base64::Engine;

pub async fn upload_to_ipfs(
    state: &AppState,
    image_data: &str,
) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    if cfg!(test) || image_data.starts_with("test:") {
        return Ok("mock_cid".to_string());
    }

    let url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    let clean_image_data = image_data.split(",").nth(1).unwrap_or(image_data);

    let image_bytes = match base64::engine::general_purpose::STANDARD.decode(clean_image_data) {
        Ok(bytes) => bytes,
        Err(_) => return Err("Invalid base64 image data".into()),
    };

    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let file_name = format!("image_{}.jpg", timestamp);

    let metadata_json = serde_json::to_string(&serde_json::json!({
        "name": &file_name,
        "keyvalues": {
            "timestamp": timestamp.to_string(),
            "source": "marketplace_backend"
        }
    }))?;

    let part = reqwest::multipart::Part::bytes(image_bytes)
        .file_name(file_name)
        .mime_str("image/jpeg")?;

    let form = reqwest::multipart::Form::new()
        .part("file", part)
        .text("pinataMetadata", metadata_json);

    let response = state
        .pinata_client
        .post(url)
        .header("pinata_api_key", &state.pinata_api_key)
        .header("pinata_secret_api_key", &state.pinata_secret_key)
        .multipart(form)
        .send()
        .await?;

    if !response.status().is_success() {
        let error_text = response.text().await?;
        return Err(format!("Pinata API error: {}", error_text).into());
    }

    let json: serde_json::Value = response.json().await?;

    let ipfs_hash = json
        .get("IpfsHash")
        .and_then(|hash| hash.as_str())
        .ok_or("Failed to get CID from Pinata response")?;

    Ok(ipfs_hash.to_string())
}
// use crate::state::AppState;
// use base64::engine::general_purpose::STANDARD as base64_engine;
// use base64::Engine;
// use reqwest::multipart;
// use std::error::Error;
//
// pub async fn upload_to_ipfs(
//     state: &AppState,
//     image_data: &str,
// ) -> Result<String, Box<dyn Error + Send + Sync>> {
//     let url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
//
//     // Decode base64 string to bytes
//     let image_bytes = base64_engine.decode(image_data)?;
//
//     // Create multipart form
//     let form = multipart::Form::new().part(
//         "file",
//         multipart::Part::bytes(image_bytes)
//             .file_name("image.jpg")
//             .mime_str("image/jpeg")?,
//     );
//
//     // Send request to Pinata
//     let response = state
//         .pinata_client
//         .post(url)
//         .multipart(form)
//         .header("pinata_api_key", &state.pinata_api_key)
//         .header("pinata_secret_api_key", &state.pinata_secret_key)
//         .send()
//         .await?;
//
//     // Parse response
//     let json: serde_json::Value = response.json().await?;
//     Ok(json["IpfsHash"]
//         .as_str()
//         .ok_or("Failed to get CID")?
//         .to_string())
// }
