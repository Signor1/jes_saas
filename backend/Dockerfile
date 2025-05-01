# Use Rust nightly image for building with specific version tag
FROM rustlang/rust:nightly AS builder

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

# Final runtime image - much smaller than rust image
FROM debian:bookworm-slim

# Install only required dependencies with version pinning and no recommended packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq5=15.12-0+deb12u2 \
    ca-certificates=20230311 && \
    rm -rf /var/lib/apt/lists/*

# Copy the built binary
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/app

# Create a non-root user to run the application
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

# Expose the port (Default 3000)
EXPOSE 3000

# Set environment variables
ENV PORT=3000

# Run the application
CMD ["app"]
