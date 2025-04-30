# Use official Rust image for building
FROM rust:1.81 AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy Cargo files from backend/ and create a dummy main.rs to cache dependencies
COPY backend/Cargo.toml backend/Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy source code and build the application
COPY backend/ .
RUN cargo build --release

# Final runtime image
FROM rust:1.81-slim-bookworm

# Install libpq for PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy the built binary
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/app

# Expose the port (Render expects PORT env var, default 10000)
EXPOSE 10000

# Set environment variables (will be overridden by Render)
ENV PORT=10000

# Run the application
CMD ["app"]
