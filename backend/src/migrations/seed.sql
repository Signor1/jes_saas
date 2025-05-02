-- Seed users
INSERT INTO users (
    wallet_address, email, phone_number, house_address, user_name
)
VALUES
(
    '0x1234567890abcdef1234567890abcdef12345678',
    'alice@example.com',
    '555-0101',
    '123 Elm St',
    'Alice Smith'
),
(
    '0xabcdef1234567890abcdef1234567890abcdef12',
    'bob@example.com',
    '555-0102',
    '456 Oak Ave',
    'Bob Jones'
);

-- Seed stores
INSERT INTO stores (store_name, image_cid, description, owner_address)
VALUES
(
    'Coffee Haven',
    'QmX123...',
    'Cozy coffee shop with artisanal blends',
    '0x1234567890abcdef1234567890abcdef12345678'
),
(
    'Book Nook',
    'QmY456...',
    'Independent bookstore with rare finds',
    '0xabcdef1234567890abcdef1234567890abcdef12'
);

-- Seed products
INSERT INTO products (
    store_id, product_name, image_cid, description, price, quantity
)
VALUES
(
    (
        SELECT id FROM stores
        WHERE store_name = 'Coffee Haven'
    ), 'Espresso Blend', 'QmZ789...', 'Rich and bold coffee beans', 12.99, 100
),
(
    (
        SELECT id FROM stores
        WHERE store_name = 'Book Nook'
    ), 'Classic Novel', 'QmA012...', 'Timeless literature', 19.99, 50
);

-- Seed orders
INSERT INTO orders (
    store_id, user_id, total_amount, payment_status, transaction_hash
)
VALUES
(
    (
        SELECT id FROM stores
        WHERE store_name = 'Coffee Haven'), (
        SELECT id FROM users
        WHERE wallet_address = '0x1234567890abcdef1234567890abcdef12345678'
    ), 25.98, 'completed', '0xabc123...'
),
(
    (
        SELECT id FROM stores
        WHERE store_name = 'Book Nook'), (
        SELECT id FROM users
        WHERE wallet_address = '0xabcdef1234567890abcdef1234567890abcdef12'
    ), 39.98, 'pending', NULL
);

-- Seed cart
INSERT INTO cart (user_id)
VALUES
(
    (
        SELECT id FROM users
        WHERE wallet_address = '0x1234567890abcdef1234567890abcdef12345678'
    )
),
(
    (
        SELECT id FROM users
        WHERE wallet_address = '0xabcdef1234567890abcdef1234567890abcdef12'
    )
);

-- Seed cart_items
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES
(
    (
        SELECT id FROM cart
        WHERE user_id = (
            SELECT id FROM users
            WHERE wallet_address = '0x1234567890abcdef1234567890abcdef12345678'
        )
    ), (
        SELECT id FROM products
        WHERE product_name = 'Espresso Blend'
    ), 2
),
(
    (
        SELECT id FROM cart
        WHERE user_id = (
            SELECT id FROM users
            WHERE wallet_address = '0xabcdef1234567890abcdef1234567890abcdef12'
        )
    ), (
        SELECT id FROM products
        WHERE product_name = 'Classic Novel'
    ), 1
);
