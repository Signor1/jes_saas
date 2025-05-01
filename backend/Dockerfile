# Use Rust nightly image for building
FROM rust:nightly AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy Cargo files and create a dummy main.rs to cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy source code and build the application
COPY . .
RUN cargo build --release

# Final runtime image
FROM rust:nightly-slim-bookworm

# Install libpq for PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy the built binary
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/app

# Expose the port (Railway sets PORT env var, default 3000)
EXPOSE 3000

# Run the application
CMD ["app"]
