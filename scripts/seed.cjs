const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const crypto = require('crypto');

function hashPassword(password, salt = 'shawlghar_salt_seed_2026') {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'showltown.db');
const db = new Database(dbPath);

console.log(`[Seed] Initializing database at: ${dbPath}`);

// Read and execute schema
const schemaPath = path.join(__dirname, 'init.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql);

// Clear existing tables for fresh seed
db.prepare('DELETE FROM products').run();
db.prepare('DELETE FROM categories').run();
db.prepare('DELETE FROM users').run();
db.prepare('DELETE FROM settings').run();

// 1. Seed Global Settings
const insertSetting = db.prepare(`
  INSERT INTO settings (key, value) VALUES (@key, @value)
`);

const defaultSettings = [
  { key: 'site_name', value: 'Shawl Ghar' },
  { key: 'site_tagline', value: '5+ Years of Dedicated Handcrafted Kashmiri Shawls & Artisanal Stoles' },
  { key: 'whatsapp_number', value: '0313-5209085' },
  { key: 'whatsapp_message', value: 'Hello! I would like to order this item from Shawl Ghar:\n\n*{product_name}*\nPrice: {price}\n\nPlease confirm availability and share Cash on Delivery details. Thank you!' },
  { key: 'currency_symbol', value: 'Rs.' },
  { key: 'currency_code', value: 'PKR' },
  { key: 'contact_email', value: 'orders@shawlghar.com' },
  { key: 'contact_address', value: 'Madina Clothes Market, Rawalpindi, Pakistan' },
  { key: 'experience_years', value: '5+ Years Experience' }
];

for (const setting of defaultSettings) {
  insertSetting.run(setting);
}
console.log(`[Seed] Seeded ${defaultSettings.length} global site settings.`);

// 2. Seed Categories
const insertCategory = db.prepare(`
  INSERT INTO categories (id, name, slug, description, image_url)
  VALUES (@id, @name, @slug, @description, @image_url)
`);

const categories = [
  {
    id: 1,
    name: 'Kashmiri Stoles (Stawlers)',
    slug: 'kashmiri-stoles',
    description: 'Lightweight, warm, and sophisticated stoles featuring delicate Kashmiri needlework, paisley bootis, and hand-finished fringe details.',
    image_url: '/images/products/maroon-stole-1.jpg'
  },
  {
    id: 2,
    name: 'Pashmina & Kingri Shawls',
    slug: 'pashmina-kingri',
    description: 'Pure Changthangi pashmina and kingri shawls woven with traditional 4-side borders and micro-check ring textures.',
    image_url: '/images/products/kingri-shawl-1.jpg'
  },
  {
    id: 3,
    name: 'Needlework & Sozni Shawls',
    slug: 'needlework-sozni',
    description: 'Authentic 100% hand-done needlework (Sui Ka Kaam) showcasing intricate Kashmiri floral vines and heritage embroidery.',
    image_url: '/images/products/sui-ka-kaam-1.jpg'
  },
  {
    id: 4,
    name: 'Aari Work Shawls',
    slug: 'aari-work',
    description: 'Royal Aari chain-stitch embroidery hand-worked with vibrant silk and wool threads on premium wool bases.',
    image_url: '/images/products/aari-work-shawl-1.jpg'
  },
  {
    id: 5,
    name: 'Woolen Kashmiri Shawls',
    slug: 'woolen-kashmiri',
    description: '100% Pure Premium Quality Wool shawls providing unmatched winter warmth, softness, and traditional motifs.',
    image_url: '/images/products/kashmiri-woolen-shawl-1.jpg'
  },
  {
    id: 6,
    name: 'Jamawar & Kani Shawls',
    slug: 'jamawar-kani',
    description: 'Complex jacquard paisley weaves, Dorukha reversible drapes, and traditional wooden spool Kani craftsmanship.',
    image_url: '/images/products/toosha-stole-1.jpg'
  }
];

for (const cat of categories) {
  insertCategory.run(cat);
}
console.log(`[Seed] Seeded ${categories.length} categories.`);

// 3. Seed Products with REAL PICTURES from Pics/ folder and REAL DATA from chat
const insertProduct = db.prepare(`
  INSERT INTO products (
    name, slug, description, price, compare_at_price, category_id,
    image_url, additional_images, is_featured, is_active, stock_status, material, origin
  ) VALUES (
    @name, @slug, @description, @price, @compare_at_price, @category_id,
    @image_url, @additional_images, @is_featured, @is_active, @stock_status, @material, @origin
  )
`);

const products = [
  // Product 1: Exclusive Handmade Kashmiri Woolen Shawl
  {
    name: 'Exclusive Handmade Kashmiri Woolen Shawl',
    slug: 'exclusive-handmade-kashmiri-woolen-shawl',
    description: 'A true masterpiece crafted with immense dedication and needlework by skilled artisans! This is not machine-printed; it features 100% genuine handmade needle embroidery (Soi ka kaam), specially designed for graceful women who appreciate true elegance.\n\n• Craftsmanship: Authentically handcrafted with needle and thread (Handmade needlework).\n• Material: 100% Premium Quality Wool, providing ultimate warmth and a soft feel.\n• Design: Traditional Kashmiri motifs paired with vibrant, intricate embroidery.\n• Special Discount Offer: Original Price Rs. 8,500 | Discounted Price Rs. 5,000 Only!\n• Orders & Details: Contact right now on WhatsApp at 0313-5209085',
    price: 5000.00,
    compare_at_price: 8500.00,
    category_id: 5,
    image_url: '/images/products/kashmiri-woolen-shawl-1.jpg',
    additional_images: JSON.stringify(['/images/products/kashmiri-woolen-shawl-2.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: '100% Premium Quality Wool (Warmth & Soft Feel)',
    origin: '100% Genuine Handmade Needle Embroidery (Soi Ka Kaam)'
  },

  // Product 2: Exclusive Handmade Aari Work Pure Woolen Shawl
  {
    name: 'Exclusive Handmade Aari Work Pure Woolen Shawl',
    slug: 'exclusive-handmade-aari-work-pure-woolen-shawl',
    description: 'Add a touch of royal elegance to your wardrobe with this exquisite, 100% pure wool shawl featuring stunning and intricate Aari embroidery crafted by skilled artisans. Perfect for graceful women who love traditional craftsmanship.\n\n• Material: 100% Pure Premium Wool, providing ultimate warmth, softness, and comfort.\n• Craftsmanship: Authentically handcrafted with delicate and fine Aari needlework.\n• Design: Rich traditional motifs with vibrant multi-colored thread work on a classic black base.\n• Special Limited Time Offer (For First 5 Customers Only!): Original Price Rs. 10,000 | Discounted Price Rs. 6,500 Only!\n• Orders & Details: Contact right now on WhatsApp at 0313-5209085',
    price: 6500.00,
    compare_at_price: 10000.00,
    category_id: 4,
    image_url: '/images/products/aari-work-shawl-1.jpg',
    additional_images: JSON.stringify(['/images/products/aari-work-shawl-2.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: '100% Pure Premium Wool',
    origin: 'Delicate & Fine Aari Needlework on Black Base'
  },

  // Product 3: Exclusive Kashmiri Kingri Shawl
  {
    name: 'Exclusive Kashmiri Kingri Shawl',
    slug: 'exclusive-kashmiri-kingri-shawl',
    description: 'Wrap yourself in the timeless royalty of authentic Kashmiri Kingri craftsmanship. Handcrafted from pure pashmina with an exquisite 4-sided Kingri border and delicate floral motifs throughout.\n\n• Fabric: Pure Pashmina\n• Design: 4-Side Hand-Made Kashmiri Kingri Border with Fine Motifs\n• Special Limited Time Offer: Original Price Rs. 8,500 | Discounted Price Rs. 5,000 Only!\n• Orders & Details: Contact right now on WhatsApp at 0313-5209085',
    price: 5000.00,
    compare_at_price: 8500.00,
    category_id: 2,
    image_url: '/images/products/kingri-shawl-1.jpg',
    additional_images: JSON.stringify(['/images/products/kingri-shawl-2.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: 'Pure Pashmina Wool',
    origin: '4-Side Hand-Made Kashmiri Kingri Border'
  },

  // Product 4: Premium Kashmiri Micro-Check Ring Shawl
  {
    name: 'Premium Kashmiri Micro-Check Ring Shawl',
    slug: 'premium-kashmiri-micro-check-ring-shawl',
    description: 'Elevate your wardrobe with this charming and incredibly soft Kashmiri Micro-Check Ring Shawl. A perfect blend of exquisite quality and delicate design, this shawl offers exceptional warmth, making it the ideal accessory for graceful women seeking both comfort and style.\n\n• Fabric: 100% Pure Premium Quality Wool / Pashmina Blend (Extremely soft and lightweight ring-shawl quality).\n• Pattern: Classic and sophisticated micro-check pattern with a stylish micro-striped border and hand-knotted fringe.\n• Texture: Ultra-soft, delicate, and durable quality (passes through a ring).\n• Special Offer Price: Original Price Rs. 7,500 | Discounted Price Rs. 5,500 Only! (Limited Time Offer)\n• Orders & Details: Contact right now on WhatsApp at 0313-5209085',
    price: 5500.00,
    compare_at_price: 7500.00,
    category_id: 2,
    image_url: '/images/products/micro-check-ring-1.jpg',
    additional_images: JSON.stringify(['/images/products/micro-check-ring-2.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: '100% Pure Wool / Pashmina Blend (Ring Quality)',
    origin: 'Micro-Check Weave with Hand-Knotted Fringe'
  },

  // Product 5: Exclusive Handmade Sui Ka Kaam Kashmiri Shawl
  {
    name: 'Exclusive Handmade Sui Ka Kaam Kashmiri Shawl',
    slug: 'exclusive-handmade-sui-ka-kaam-kashmiri-shawl',
    description: 'This shawl is a true masterpiece, crafted with immense dedication and skill by master artisans! This is not machine-printed; it features 100% authentic hand-done needlework (Sui Ka Kaam), specially designed for women who appreciate true elegance.\n\n• Craftsmanship: Authentically handcrafted using traditional needlework techniques.\n• Material: 100% premium quality wool, providing warmth and comfort.\n• Design: Traditional Kashmiri motifs combined with an elegant color palette.\n• Special Limited Time Offer: Original Price Rs. 12,500 | Discounted Price Rs. 9,000 Only!\n• Orders & Details: Contact right now on WhatsApp at 0313-5209085',
    price: 9000.00,
    compare_at_price: 12500.00,
    category_id: 3,
    image_url: '/images/products/sui-ka-kaam-1.jpg',
    additional_images: JSON.stringify(['/images/products/sui-ka-kaam-2.jpg', '/images/products/sui-ka-kaam-3.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: '100% Premium Quality Wool',
    origin: 'Master Artisan Hand-Done Needlework (Sui Ka Kaam)'
  },

  // Product 6: Royal Handcrafted Kashmiri Toosha Wool Stole
  {
    name: 'Royal Handcrafted Kashmiri Toosha Wool Stole',
    slug: 'royal-handcrafted-kashmiri-toosha-wool-stole',
    description: 'Wrap yourself in unmatched elegance with this exquisite Handmade Kashmiri Toosha Wool Stole. Designed on a soft off-white base, this masterpiece is adorned with vibrant multi-colored paisley motifs (Booti work), a rich embroidered border, and classic multicolored striped ends featuring delicate tassel fringes. A true symbol of traditional luxury and finesse!\n\n• Fabric: Pure & Ultra-Soft Toosha Wool (Lightweight, cozy, and durable).\n• Craftsmanship: Authentic hand-embroidery featuring rich, traditional Kashmiri needlework.\n• Design: All-over multi-color paisley motifs with vibrant side borders and multi-striped ends.\n• Special Discount Offer: Original Price Rs. 11,500 | Discounted Price Rs. 8,500 Only!\n• Orders & Details: Send a message right now on WhatsApp at 0313-5209085',
    price: 8500.00,
    compare_at_price: 11500.00,
    category_id: 1,
    image_url: '/images/products/toosha-stole-1.jpg',
    additional_images: JSON.stringify(['/images/products/toosha-stole-2.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: 'Pure & Ultra-Soft Toosha Wool',
    origin: 'Authentic Hand-Embroidery with Tassel Fringes'
  },

  // Product 7: Elegant Black Handcrafted Kashmiri Stole (Price updated per Ahmed: Original 3500, Discounted 2500)
  {
    name: 'Elegant Black Handcrafted Kashmiri Stole',
    slug: 'elegant-black-handcrafted-kashmiri-stole',
    description: 'Elevate your winter elegance with this stunning Black Handcrafted Kashmiri Stole. Featuring intricate multi-colored needlework (Aari and fine Kashmiri embroidery) along a sophisticated border and delicate scattered motifs, this piece is a true work of art designed to add grace to any outfit.\n\n• Fabric: Premium Quality Wool (Warm, cozy, and luxuriously soft).\n• Craftsmanship: Exquisite hand-done traditional Kashmiri embroidery with intricate floral and paisley details.\n• Design: Sophisticated black base highlighted with rich multi-color threadwork.\n• Special Limited Time Offer: Original Price Rs. 3,500 | Discounted Price Rs. 2,500 Only!\n• Orders & Details: Contact right now on WhatsApp at 0313-5209085',
    price: 2500.00,
    compare_at_price: 3500.00,
    category_id: 1,
    image_url: '/images/products/black-stole-1.jpg',
    additional_images: JSON.stringify(['/images/products/black-stole-2.jpg', '/images/products/black-stole-3.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: 'Premium Quality Wool (Warm, cozy, luxuriously soft)',
    origin: 'Exquisite Hand-Done Aari & Kashmiri Embroidery'
  },

  // Product 8: Graceful Off-White Handcrafted Kashmiri Stole (Price updated per Ahmed: Original 3500, Discounted 2500)
  {
    name: 'Graceful Off-White Handcrafted Kashmiri Stole',
    slug: 'graceful-off-white-handcrafted-kashmiri-stole',
    description: 'Add a touch of timeless sophistication to your wardrobe with this exquisite Off-White Handcrafted Kashmiri Wool Stole. Designed on a soft ivory base, it features intricate multi-colored Kashmiri needlework (Booti & Paisley motifs) along a fine floral border, making it a perfect choice for elegant wear.\n\n• Fabric: Premium Pure Wool (Soft, lightweight, and warm).\n• Craftsmanship: 100% Authentic Hand-Done Kashmiri Needle Embroidery.\n• Design: Delicately scattered Kashmiri Paisley & Booti motifs with an elegant embroidered frame.\n• Special Limited Time Offer: Original Price Rs. 3,500 | Discounted Price Rs. 2,500 Only!\n• Orders & Details: Contact right now on WhatsApp at 0313-5209085',
    price: 2500.00,
    compare_at_price: 3500.00,
    category_id: 1,
    image_url: '/images/products/offwhite-stole-1.jpg',
    additional_images: JSON.stringify(['/images/products/offwhite-stole-2.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: 'Premium Pure Wool (Soft, lightweight, and warm)',
    origin: '100% Authentic Hand-Done Kashmiri Needle Embroidery'
  },

  // Product 9: Stunning Maroon Handcrafted Kashmiri Wool Stole (Price updated per Ahmed: Original 3500, Discounted 2500)
  {
    name: 'Stunning Maroon Handcrafted Kashmiri Wool Stole',
    slug: 'stunning-maroon-handcrafted-kashmiri-wool-stole',
    description: 'Apne winter look ko mazeed royal aur elegant banayein is dilkash Handmade Kashmiri Wool Stole ke sath. Ek rich maroon base par bani yeh masterpiece shawl apni lajawab Kashmiri embroidery aur fine border details ki wajah se har khaas mauqe ke liye behtareen intekhab hai.\n\n• Fabric: Premium Pure Wool (Naram, halka aur garam fabric).\n• Craftsmanship: 100% Authentic Hand-Done Kashmiri Needle Embroidery with intricate motifs.\n• Design: Rich maroon base par khubsurat traditional Kashmiri border aur sophisticated bootis ka haseen imtizaaj.\n• Special Limited Time Offer: Original Price Rs. 3,500 | Discounted Price Rs. 2,500 Only!\n• Orders & Details: Contact right now on WhatsApp at 0313-5209085',
    price: 2500.00,
    compare_at_price: 3500.00,
    category_id: 1,
    image_url: '/images/products/maroon-stole-1.jpg',
    additional_images: JSON.stringify(['/images/products/maroon-stole-2.jpg']),
    is_featured: 1,
    is_active: 1,
    stock_status: 'in_stock',
    material: 'Premium Pure Wool (Soft, lightweight and warm fabric)',
    origin: '100% Authentic Hand-Done Kashmiri Needle Embroidery'
  }
];

for (const prod of products) {
  insertProduct.run(prod);
}
console.log(`[Seed] Seeded ${products.length} authentic products with real images from Pics.`);

// 4. Seed Users
const insertUser = db.prepare(`
  INSERT INTO users (name, email, password_hash, role)
  VALUES (@name, @email, @password_hash, @role)
`);

const users = [
  {
    name: 'Shawl Ghar Administrator',
    email: 'admin@showltown.com',
    password_hash: hashPassword('admin123'),
    role: 'admin'
  },
  {
    name: 'Ijaz Ahmed Mir',
    email: 'customer@example.com',
    password_hash: hashPassword('customer123'),
    role: 'customer'
  }
];

for (const user of users) {
  insertUser.run(user);
}
console.log(`[Seed] Seeded ${users.length} users.`);

console.log('[Seed] Database initialization and seed completed successfully!');
db.close();
