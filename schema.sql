-- =============================================
-- Product Inventory Manager — Database Schema
-- =============================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- INDEX for faster queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_products_name ON products(name);

-- =============================================
-- SEED DATA
-- =============================================

-- Seed Categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic devices and gadgets'),
  ('Clothing', 'Apparel and fashion items'),
  ('Food & Beverages', 'Food products and drinks'),
  ('Books', 'Physical and digital books'),
  ('Home & Garden', 'Home improvement and garden supplies');

-- Note: Seed user password is bcrypt hash of "password123"
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
  ('Test User', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user');

-- Seed Products
INSERT INTO products (name, description, price, stock, category_id, created_by) VALUES
  ('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 29.99, 150, 1, 1),
  ('Mechanical Keyboard', 'RGB mechanical keyboard with Cherry MX switches', 89.99, 75, 1, 1),
  ('USB-C Hub', '7-in-1 USB-C hub with HDMI and ethernet', 49.99, 200, 1, 1),
  ('Cotton T-Shirt', 'Premium cotton crew neck t-shirt', 19.99, 500, 2, 1),
  ('Denim Jacket', 'Classic blue denim jacket', 59.99, 120, 2, 1),
  ('Green Tea Pack', 'Organic Japanese green tea, 100 bags', 12.99, 300, 3, 1),
  ('Dark Chocolate Bar', '72% cacao premium dark chocolate', 4.99, 450, 3, 1),
  ('JavaScript Guide', 'The Definitive Guide to JavaScript', 39.99, 80, 4, 1),
  ('Design Patterns', 'Head First Design Patterns book', 44.99, 60, 4, 1),
  ('LED Desk Lamp', 'Adjustable LED desk lamp with dimmer', 34.99, 180, 5, 1);
