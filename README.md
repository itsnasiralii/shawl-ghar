# Shawl Ghar (شال گھر) — Handcrafted Kashmiri Shawls & Artisanal Stoles

A modern, high-performance E-Commerce foundation prototype built for **Shawl Ghar** using **Next.js 16 (App Router + Turbopack)**, **Tailwind CSS**, and **SQLite (better-sqlite3)**.

Designed specifically for the Pakistani artisanal shawl market with Pakistani Rupee (`Rs. / PKR`) pricing, direct WhatsApp order routing, global admin controls, and clean English typography.

---

## Live GitHub Repository
- **Repository URL**: [https://github.com/itsnasiralii/shawl-ghar](https://github.com/itsnasiralii/shawl-ghar)

---

## Key Features

1. **100% English Storefront**:
   - Modern, luxury aesthetic with clean English navigation, labels, and badges.
   - Collections include: *Kashmiri Stoles (Stawlers)*, *Pashmina & Kingri Shawls*, *Needlework & Sozni Shawls*, *Aari Work Shawls*, *Woolen Kashmiri Shawls*, and *Jamawar & Kani Shawls*.
   - Filterable product catalog with instant search, collection filtering pills, and price sorting.
   - Product details view with multi-image previews, material specs, and discount badges.
   - Highlights shop heritage: *Madina Clothes Market, Rawalpindi, Pakistan* and *5+ Years Experience*.

2. **Pakistani Rupee (`Rs.`) Pricing**:
   - Authentic PKR pricing across all products (e.g. `Rs. 2,500`, `Rs. 5,000`, `Rs. 8,500`).
   - Strikethrough compare-at prices with calculated discount percentages.

3. **Direct WhatsApp Order Integration**:
   - Primary WhatsApp Hotline: **`0313-5209085`**.
   - One-click click-to-chat on every product card, product details page, floating button, announcement bar, and footer.
   - Pre-filled WhatsApp inquiry message automatically includes product name and price.

4. **Dynamic Admin Control Panel (`/admin`)**:
   - **Global Settings (`/admin/settings`)**: Live change of Website Name, WhatsApp hotline, order message template, and currency symbol with instant storefront reflection.
   - **Product Management (`/admin/products`)**: Add new shawls, delete items, and quick-edit pricing, compare price, categories, and stock availability.
   - **Category Management (`/admin/categories`)**: Create new collections and manage existing ones.
   - **Authentication**: Secure admin session with PBKDF2 hashing and HTTP-only cookies.

---

## Authentic Product Catalog (From Artisan Chat)

| # | Product Name | Category | Selling Price | Original Price |
|---|--------------|----------|---------------|----------------|
| 1 | Exclusive Handmade Kashmiri Woolen Shawl | Woolen Kashmiri Shawls | Rs. 5,000 | Rs. 8,500 |
| 2 | Exclusive Handmade Aari Work Pure Woolen Shawl | Aari Work Shawls | Rs. 6,500 | Rs. 10,000 |
| 3 | Exclusive Kashmiri Kingri Shawl | Pashmina & Kingri | Rs. 5,000 | Rs. 8,500 |
| 4 | Premium Kashmiri Micro-Check Ring Shawl | Pashmina & Kingri | Rs. 5,500 | Rs. 7,500 |
| 5 | Exclusive Handmade Sui Ka Kaam Kashmiri Shawl | Needlework & Sozni | Rs. 9,000 | Rs. 12,500 |
| 6 | Royal Handcrafted Kashmiri Toosha Wool Stole | Kashmiri Stoles | Rs. 8,500 | Rs. 11,500 |
| 7 | Elegant Black Handcrafted Kashmiri Stole | Kashmiri Stoles | Rs. 2,500 | Rs. 3,500 |
| 8 | Graceful Off-White Handcrafted Kashmiri Stole | Kashmiri Stoles | Rs. 2,500 | Rs. 3,500 |
| 9 | Stunning Maroon Handcrafted Kashmiri Wool Stole | Kashmiri Stoles | Rs. 2,500 | Rs. 3,500 |

*All 21 authentic product photos from the collection are stored in `public/images/products/`.*

---

## Default Admin Credentials

- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email**: `admin@showltown.com`
- **Password**: `admin123`

---

## Deployment to Render.com (Step-by-Step)

1. Sign in to [Render](https://render.com) using your GitHub account (`itsnasiralii`).
2. Click **New +** -> **Web Service**.
3. Choose **Build and deploy from a Git repository**.
4. Select `itsnasiralii/shawl-ghar`.
5. Configure the deployment settings:
   - **Name**: `shawl-ghar`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
6. Click **Deploy Web Service**.
7. Render will build and deploy the app at `https://shawl-ghar.onrender.com`.
