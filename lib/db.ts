import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import {
  Category,
  Product,
  User,
  formatPrice,
  cleanWhatsAppNumber,
  buildWhatsAppLink,
} from './format';

export type { Category, Product, User };
export { formatPrice, cleanWhatsAppNumber, buildWhatsAppLink };

const dbPath = path.join(process.cwd(), 'data', 'showltown.db');

declare global {
  // eslint-disable-next-line no-var
  var __dbInstance: Database.Database | undefined;
}

export function getDatabase(): Database.Database {
  if (!global.__dbInstance) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    global.__dbInstance = new Database(dbPath);
    global.__dbInstance.pragma('journal_mode = WAL');
    global.__dbInstance.pragma('foreign_keys = ON');

    // Ensure database tables exist
    try {
      const hasTables = global.__dbInstance
        .prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='products'")
        .get() as { count: number } | undefined;

      if (!hasTables || hasTables.count === 0) {
        const schemaPath = path.join(process.cwd(), 'scripts', 'init.sql');
        if (fs.existsSync(schemaPath)) {
          const schema = fs.readFileSync(schemaPath, 'utf8');
          global.__dbInstance.exec(schema);
        }
      }
    } catch (e) {
      console.error('[DB] Schema init error:', e);
    }
  }
  return global.__dbInstance;
}

// ---------------- GLOBAL SETTINGS (DYNAMIC SITE CONTROL) ----------------

export function getSettings(): Record<string, string> {
  const db = getDatabase();
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {
    site_name: 'Shawl Ghar',
    site_tagline: '5+ Years of Dedicated Handcrafted Kashmiri Shawls & Artisanal Stoles',
    whatsapp_number: '0313-5209085',
    whatsapp_message: 'Hello! I would like to order this item from Shawl Ghar:\n\n*{product_name}*\nPrice: {price}\n\nPlease confirm availability and share Cash on Delivery details. Thank you!',
    currency_symbol: 'Rs.',
    currency_code: 'PKR',
    contact_email: 'orders@shawlghar.com',
    contact_address: 'Madina Clothes Market, Rawalpindi, Pakistan',
    experience_years: '5+ Years Experience',
  };

  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export function getSetting(key: string, defaultValue = ''): string {
  const db = getDatabase();
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row ? row.value : defaultValue;
}

export function updateSetting(key: string, value: string): void {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, value);
}

export function updateSettings(settings: Record<string, string>): void {
  const db = getDatabase();
  const upsert = db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (@key, @value, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);

  const tx = db.transaction((entries: { key: string; value: string }[]) => {
    for (const entry of entries) {
      upsert.run(entry);
    }
  });

  const entries = Object.entries(settings).map(([key, value]) => ({ key, value }));
  tx(entries);
}

// ---------------- PRODUCTS QUERIES ----------------

export function getAllProducts(options?: {
  categoryId?: number;
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}): Product[] {
  const db = getDatabase();
  let query = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1
  `;
  const params: any[] = [];

  if (options?.featuredOnly) {
    query += ` AND p.is_featured = 1`;
  }

  if (options?.categoryId) {
    query += ` AND p.category_id = ?`;
    params.push(options.categoryId);
  } else if (options?.categorySlug) {
    query += ` AND c.slug = ?`;
    params.push(options.categorySlug);
  }

  if (options?.search) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.material LIKE ?)`;
    const term = `%${options.search}%`;
    params.push(term, term, term);
  }

  query += ` ORDER BY p.is_featured DESC, p.id DESC`;

  if (options?.limit) {
    query += ` LIMIT ?`;
    params.push(options.limit);
    if (options.offset) {
      query += ` OFFSET ?`;
      params.push(options.offset);
    }
  }

  return db.prepare(query).all(...params) as Product[];
}

export function getProductById(id: number): Product | undefined {
  const db = getDatabase();
  return db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`
    )
    .get(id) as Product | undefined;
}

export function getProductBySlug(slug: string): Product | undefined {
  const db = getDatabase();
  return db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ?`
    )
    .get(slug) as Product | undefined;
}

export function getFeaturedProducts(limit = 4): Product[] {
  return getAllProducts({ featuredOnly: true, limit });
}

// ---------------- CATEGORIES QUERIES ----------------

export function getAllCategories(): Category[] {
  const db = getDatabase();
  return db
    .prepare(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
       GROUP BY c.id
       ORDER BY c.id ASC`
    )
    .all() as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const db = getDatabase();
  return db
    .prepare(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
       WHERE c.slug = ?
       GROUP BY c.id`
    )
    .get(slug) as Category | undefined;
}

// ---------------- USER & AUTH QUERIES ----------------

export function getUserByEmail(email: string): User | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as User | undefined;
}

export function getUserById(id: number): User | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

// ---------------- ADMIN & METRICS QUERIES ----------------

export function getAdminStats() {
  const db = getDatabase();
  const totalProducts = (db.prepare('SELECT COUNT(*) as count FROM products').get() as any)?.count || 0;
  const totalCategories = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as any)?.count || 0;
  const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any)?.count || 0;
  const featuredProducts = (db.prepare('SELECT COUNT(*) as count FROM products WHERE is_featured = 1').get() as any)?.count || 0;
  const inStockCount = (db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_status = 'in_stock'").get() as any)?.count || 0;
  const lowStockCount = (db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_status = 'low_stock'").get() as any)?.count || 0;

  return {
    totalProducts,
    totalCategories,
    totalUsers,
    featuredProducts,
    inStockCount,
    lowStockCount,
    systemStatus: 'Operational',
    dbEngine: 'SQLite 3 (WAL mode)',
  };
}

// ---------------- ADMIN CRUD PROTOTYPE ACTIONS ----------------

export function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  category_id: number;
  image_url: string;
  is_featured?: number;
  stock_status?: string;
  material?: string;
  origin?: string;
}) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO products (
      name, slug, description, price, compare_at_price, category_id,
      image_url, is_featured, stock_status, material, origin
    ) VALUES (
      @name, @slug, @description, @price, @compare_at_price, @category_id,
      @image_url, @is_featured, @stock_status, @material, @origin
    )
  `);
  return stmt.run({
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: data.price,
    compare_at_price: data.compare_at_price || null,
    category_id: data.category_id,
    image_url: data.image_url,
    is_featured: data.is_featured ?? 0,
    stock_status: data.stock_status || 'in_stock',
    material: data.material || 'Premium Pure Wool',
    origin: data.origin || '100% Authentic Hand-Done Kashmiri Needle Embroidery',
  });
}

export function deleteProduct(id: number) {
  const db = getDatabase();
  return db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

export function updateProduct(id: number, data: {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  compare_at_price?: number | null;
  category_id?: number;
  image_url?: string;
  is_featured?: number;
  stock_status?: string;
  material?: string;
  origin?: string;
}) {
  const db = getDatabase();
  const fields: string[] = [];
  const params: any = { id };

  if (data.name !== undefined) {
    fields.push('name = @name');
    params.name = data.name;
  }
  if (data.slug !== undefined) {
    fields.push('slug = @slug');
    params.slug = data.slug;
  }
  if (data.description !== undefined) {
    fields.push('description = @description');
    params.description = data.description;
  }
  if (data.price !== undefined) {
    fields.push('price = @price');
    params.price = data.price;
  }
  if (data.compare_at_price !== undefined) {
    fields.push('compare_at_price = @compare_at_price');
    params.compare_at_price = data.compare_at_price;
  }
  if (data.category_id !== undefined) {
    fields.push('category_id = @category_id');
    params.category_id = data.category_id;
  }
  if (data.image_url !== undefined) {
    fields.push('image_url = @image_url');
    params.image_url = data.image_url;
  }
  if (data.is_featured !== undefined) {
    fields.push('is_featured = @is_featured');
    params.is_featured = data.is_featured;
  }
  if (data.stock_status !== undefined) {
    fields.push('stock_status = @stock_status');
    params.stock_status = data.stock_status;
  }
  if (data.material !== undefined) {
    fields.push('material = @material');
    params.material = data.material;
  }
  if (data.origin !== undefined) {
    fields.push('origin = @origin');
    params.origin = data.origin;
  }

  if (fields.length === 0) return { changes: 0 };

  fields.push('updated_at = CURRENT_TIMESTAMP');

  const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = @id`;
  return db.prepare(sql).run(params);
}

// ---------------- CATEGORY CRUD ACTIONS ----------------

export function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO categories (name, slug, description, image_url)
    VALUES (@name, @slug, @description, @image_url)
  `);
  return stmt.run({
    name: data.name,
    slug: data.slug,
    description: data.description || '',
    image_url: data.image_url || '/images/products/maroon-stole-1.jpg',
  });
}

export function deleteCategory(id: number) {
  const db = getDatabase();
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(id) as { count: number } | undefined;
  const count = countRow ? countRow.count : 0;
  if (count > 0) {
    throw new Error(`Cannot delete category: ${count} products are currently assigned to it.`);
  }
  return db.prepare('DELETE FROM categories WHERE id = ?').run(id);
}

export default getDatabase;
