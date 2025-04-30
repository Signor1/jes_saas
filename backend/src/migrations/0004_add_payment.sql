ALTER TABLE orders
ADD COLUMN payment_status VARCHAR NOT NULL DEFAULT 'pending',
ADD COLUMN transaction_hash VARCHAR;
