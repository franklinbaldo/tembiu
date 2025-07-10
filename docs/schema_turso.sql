-- Tembiu Application Schema for Turso (SQLite)

-- Stores individual menu items
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Or use rowid directly if preferred
    nome TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL,
    preco REAL NOT NULL,
    descricao TEXT,
    emoji TEXT,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE -- TRUE (1) if available, FALSE (0) if not
);

-- Stores restaurant configuration as key-value pairs
CREATE TABLE IF NOT EXISTS restaurant_config (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
);

-- Stores main order information
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Internal DB ID
    order_id TEXT NOT NULL UNIQUE,        -- Public, shareable order ID (e.g., TEMBIU-WEB-TIMESTAMP)
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,                  -- For order confirmations
    total_amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- e.g., Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled
    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_cep TEXT,
    -- Potentially add payment_type, transaction_id if integrating payment gateways later
    notes TEXT -- Any special notes from customer or admin
);

-- Stores items included in each order
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL, -- Foreign key to orders.order_id
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_order REAL NOT NULL, -- Price of the item at the time of order
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders (timestamp);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_categoria ON menu_items (categoria);

-- Initial default configurations (examples, admin can change these)
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('name', 'Meu Restaurante Tembiu');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('phone', '5511999999999');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('cidade', 'Sao Paulo');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('deliveryFee', '5.00');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('emoji', '🍽️');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('openTime', '10:00');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('closeTime', '22:00');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('timezone', 'America/Sao_Paulo');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('googlePlaceId', '');
INSERT OR IGNORE INTO restaurant_config (key, value) VALUES ('restaurantNotificationEmail', 'restaurante@exemplo.com');

-- Example Menu Items (admin should replace these)
INSERT OR IGNORE INTO menu_items (nome, categoria, preco, descricao, emoji, disponivel) VALUES
('Pizza Margherita', 'Pizzas', 30.50, 'Molho de tomate fresco, mussarela de búfala e manjericão.', '🍕', 1),
('Refrigerante Lata', 'Bebidas', 5.00, 'Lata 350ml, diversos sabores.', '🥤', 1),
('Brownie de Chocolate', 'Sobremesas', 12.00, 'Delicioso brownie com nozes.', '🍫', 1);

-- Note: `AUTOINCREMENT` for primary keys is implicit in SQLite if `INTEGER PRIMARY KEY` is used,
-- but explicitly stating it can be clearer for some users.
-- `rowid` is always available as an alias for the integer primary key.
-- `ON DELETE CASCADE` for order_items ensures that if an order is deleted, its associated items are also deleted.
-- Consider if actual deletion of orders is a desired feature or if they should be marked inactive/archived.
-- For `restaurant_config`, `INSERT OR REPLACE` is used in js/admin.js, so these initial values act as defaults if not present.
-- `UNIQUE` constraint on `menu_items.nome` to prevent duplicate item names.
-- `UNIQUE` constraint on `orders.order_id` for the public order identifier.
-- `NOT NULL` constraints added where appropriate.
-- `DEFAULT TRUE` for `menu_items.disponivel`.
-- `DEFAULT 'Pending'` for `orders.status`.
-- `DEFAULT CURRENT_TIMESTAMP` for `orders.timestamp`.
