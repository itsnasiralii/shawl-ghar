-- ==============================================================================
-- SHAWL GHAR (شال گھر) E-COMMERCE DATABASE FOUNDATION
-- Target Database: SQLite 3 (Fully portable and extensible for PostgreSQL/MySQL)
-- ==============================================================================

PRAGMA foreign_keys = ON;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('admin', 'customer')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    compare_at_price REAL,
    category_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    additional_images TEXT, -- JSON array of image URLs
    is_featured INTEGER DEFAULT 0 CHECK(is_featured IN (0, 1)),
    is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1)),
    stock_status TEXT DEFAULT 'in_stock' CHECK(stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    material TEXT,
    origin TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

-- 4. SETTINGS TABLE (GLOBAL SYSTEM CONFIGURATION)
-- Controls website name, tagline, WhatsApp number, currency, and template messages
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
