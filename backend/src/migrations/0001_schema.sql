-- Existing tables: stores, products
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(255) NOT NULL,
    image_cid VARCHAR(100),
    description TEXT,
    owner_address VARCHAR(42) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    image_cid VARCHAR(100),
    description TEXT,
    price NUMERIC(18, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT products_quantity_check CHECK (quantity >= 0),
    CONSTRAINT products_store_id_fkey FOREIGN KEY (
        store_id
    ) REFERENCES stores (id) ON DELETE CASCADE
);

-- Alter orders to add user_id
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (
    id
) ON DELETE CASCADE;

-- New tables: users, cart, cart_items
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    house_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (
        id
    ) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES cart (
        id
    ) ON DELETE CASCADE,
    CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (
        product_id
    ) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT cart_items_quantity_check CHECK (quantity > 0)
);

-- Existing function: get_product_quantity
CREATE OR REPLACE FUNCTION get_product_quantity(product_id UUID)
RETURNS INTEGER AS $$
    SELECT COALESCE((SELECT quantity FROM products WHERE id = product_id), 0);
$$ LANGUAGE sql;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stores_timestamp
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_cart_timestamp
BEFORE UPDATE ON cart
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_cart_items_timestamp
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products (store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders (store_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items (cart_id);
