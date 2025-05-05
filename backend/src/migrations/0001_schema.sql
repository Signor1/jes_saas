-- Create timestamp function (needed for triggers)
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(255) NOT NULL,
    image_cid VARCHAR(100),
    description TEXT,
    owner_address VARCHAR(42) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create products table
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
    CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id)
    REFERENCES stores (id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(255),
    wallet_address VARCHAR(42) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    house_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL,
    user_id UUID,
    total_amount NUMERIC(18, 2) NOT NULL,
    payment_status VARCHAR NOT NULL DEFAULT 'pending',
    transaction_hash VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT orders_store_id_fkey FOREIGN KEY (store_id)
    REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id)
    REFERENCES cart (id) ON DELETE CASCADE,
    CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT cart_items_quantity_check CHECK (quantity > 0)
);

-- Create triggers
CREATE TRIGGER update_stores_timestamp
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON orders
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products (store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders (store_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items (cart_id);
-- -- existing tables: stores, products
-- create table if not exists stores (
--     id uuid primary key default gen_random_uuid(),
--     store_name varchar(255) not null,
--     image_cid varchar(100),
--     description text,
--     owner_address varchar(42) not null,
--     created_at timestamp with time zone default current_timestamp,
--     updated_at timestamp with time zone default current_timestamp
-- );
--
-- create table if not exists products (
--     id uuid primary key default gen_random_uuid(),
--     store_id uuid not null,
--     product_name varchar(255) not null,
--     image_cid varchar(100),
--     description text,
--     price numeric(18, 2) not null,
--     quantity integer not null,
--     created_at timestamp with time zone default current_timestamp,
--     updated_at timestamp with time zone default current_timestamp,
--     constraint products_quantity_check check (quantity >= 0),
--     constraint products_store_id_fkey foreign key (
--         store_id
--     ) references stores (id) on delete cascade
-- );
--
-- create table if not exists orders (
--     id uuid primary key default gen_random_uuid(),
--     store_id uuid not null,
--     user_id uuid,
--     total_amount numeric(18, 2) not null,
--     payment_status varchar not null default 'pending',
--     transaction_hash varchar,
--     created_at timestamp with time zone default current_timestamp,
--     updated_at timestamp with time zone default current_timestamp,
--     constraint orders_store_id_fkey foreign key (store_id) references stores (
--         id
--     ) on delete cascade,
--     constraint orders_user_id_fkey foreign key (user_id) references users (
--         id
--     ) on delete cascade
-- );
--
-- -- add timestamp trigger
-- create trigger update_orders_timestamp
-- before update on orders
-- for each row
-- execute function update_timestamp();
--
-- -- add index
-- create index if not exists idx_orders_store_id on orders (store_id);
--
-- -- -- alter orders to add user_id
-- -- alter table orders
-- -- add column if not exists user_id uuid,
-- -- add constraint orders_user_id_fkey foreign key (user_id) references users (
-- --     id
-- -- ) on delete cascade;
--
-- -- add new tables  users, cart, cart_items
-- create table if not exists users (
--     id uuid primary key default gen_random_uuid(),
--     user_name varchar(255),
--     wallet_address varchar(42) not null unique,
--     email varchar(255) unique,
--     phone_number varchar(20),
--     house_address text,
--     created_at timestamp with time zone default current_timestamp,
--     updated_at timestamp with time zone default current_timestamp
-- );
--
-- create table if not exists cart (
--     id uuid primary key default gen_random_uuid(),
--     user_id uuid not null,
--     created_at timestamp with time zone default current_timestamp,
--     updated_at timestamp with time zone default current_timestamp,
--     constraint cart_user_id_fkey foreign key (user_id) references users (
--         id
--     ) on delete cascade
-- );
--
-- create table if not exists cart_items (
--     id uuid primary key default gen_random_uuid(),
--     cart_id uuid not null,
--     product_id uuid not null,
--     quantity integer not null,
--     created_at timestamp with time zone default current_timestamp,
--     updated_at timestamp with time zone default current_timestamp,
--     constraint cart_items_cart_id_fkey foreign key (cart_id) references cart (
--         id
--     ) on delete cascade,
--     constraint cart_items_product_id_fkey foreign key (
--         product_id
--     ) references products (id) on delete cascade,
--     constraint cart_items_quantity_check check (quantity > 0)
-- );
--
-- -- add user_id to orders
-- alter table orders
-- add column if not exists user_id uuid,
-- add constraint orders_user_id_fkey foreign key (user_id) references users (
--     id
-- ) on delete cascade;
--
-- -- create indexes
-- create index if not exists idx_orders_user_id on orders (user_id);
-- create index if not exists idx_cart_user_id on cart (user_id);
-- create index if not exists idx_cart_items_cart_id on cart_items (cart_id);
--
-- -- create triggers
-- create or replace function update_timestamp()
-- returns trigger as $$
-- begin
--     new.updated_at = current_timestamp;
--     return new;
-- end;
-- $$ language plpgsql;
--
-- create trigger update_users_timestamp
-- before update on users
-- for each row
-- execute function update_timestamp();
--
-- create trigger update_cart_timestamp
-- before update on cart
-- for each row
-- execute function update_timestamp();
--
-- create trigger update_cart_items_timestamp
-- before update on cart_items
-- for each row
-- execute function update_timestamp();-- indexes
--
-- create index if not exists idx_products_store_id on products (store_id);
-- create index if not exists idx_orders_store_id on orders (store_id);
-- create index if not exists idx_orders_user_id on orders (user_id);
-- create index if not exists idx_cart_user_id on cart (user_id);
-- create index if not exists idx_cart_items_cart_id on cart_items (cart_id);
