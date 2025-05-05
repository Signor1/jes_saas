use std::env;

pub fn initialize_web3() -> web3::Web3<web3::transports::Http> {
    let transport =
        web3::transports::Http::new(&env::var("WEB3_PROVIDER").expect("WEB3_PROVIDER must be set"))
            .expect("Failed to initialize Web3 transport");
    web3::Web3::new(transport)
}
