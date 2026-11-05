# شال گھر (SHAWL GHAR) — E-COMMERCE WEBSITE PROTOTYPE (PHASE 1: 15% FOUNDATION)

> **خالص کشمیری شالیں، اونی اسٹولز اور شاہی دستکاری**  
> *Authentic Handcrafted Kashmiri Shawls, Pashminas, Pure Wool Stoles & Bridal Wraps.*

---

## 1. نئے فیچرز اور تبدیلیاں (Latest Updates)

1. **کرنسی کی تبدیلی (PKR / Rs.)**: تمام قیمتیں امریکی ڈالر ($) سے پاکستانی روپے (`Rs. 2,800`، `Rs. 4,500` وغیرہ) میں تبدیل کر دی گئی ہیں۔
2. **برانڈ کا نام "شال گھر" (Shawl Ghar)**: پوری ویب سائٹ، ہیڈر، فوٹر اور ٹائٹل پر "شال گھر" نافذ کر دیا گیا ہے۔
3. **ایڈمن سے ویب سائٹ کا نام تبدیل کرنے کا گلوبل کنٹرول**: ایڈمن پینل میں نیا سیکشن **`Settings` (`/admin/settings`)** شامل کیا گیا ہے جہاں سے آپ جب چاہیں ویب سائٹ کا اردو نام، انگریزی نام اور سلوگن تبدیل کر سکتے ہیں، اور وہ فوری طور پر پوری ویب سائٹ پر اپڈیٹ ہو جائے گا۔
4. **واٹس ایپ آرڈر اور نمبر کنٹرول (WhatsApp Hotline: 0313-5209085)**:
   - ہر پروڈکٹ کارڈ پر **"واٹس ایپ پر آرڈر کریں"** کا ڈائریکٹ بٹن۔
   - پروڈکٹ ڈیٹیل پیج پر گرین **"واٹس ایپ پر ابھی آرڈر کریں"** بٹن جس میں پروڈکٹ کا نام اور قیمت خود بخود میسج میں لکھی ہوئی آتی ہے۔
   - اسکرین کے نیچے دائیں جانب مستقل **فلوٹنگ واٹس ایپ بٹن**۔
   - ایڈمن پینل سے واٹس ایپ نمبر کسی بھی وقت تبدیل کرنے کی سہولت۔
5. **کشمیری شالوں کا نایاب کلیکشن (Handcrafted Kashmiri & Wool Stoles)**:
   - *Stunning Maroon Handcrafted Kashmiri Wool Stole* (Original: Rs. 4,500 | Discounted: Rs. 2,800)
   - *Royal Emerald Green Aari Embroidered Cashmere Shawl* (Rs. 5,900)
   - *Classic Jet Black Tilla Zari Border Pashmina Shawl* (Rs. 4,800)
   - *Ivory Cream Sozni Needlework Kashmiri Stole* (Rs. 3,600)
   - *Ruby Red Royal Bridal Velvet Embroidered Shawl* (Rs. 8,500)
   - *Mustard Ochre Woolen Winter Stole with Tassels* (Rs. 2,400)
   - *Charcoal Grey Men's Pure Swati Pattu Shawl* (Rs. 3,900)
   - *Navy Blue Traditional Kashmiri Jaal Work Shawl* (Rs. 6,500)

---

## 2. ایڈمن پینل اور لاگ ان (Admin Access)

- **ایڈمن لاگ ان لنک**: [`http://localhost:3000/admin/login`](http://localhost:3000/admin/login)
- **ایڈمن ڈیش بورڈ**: [`http://localhost:3000/admin`](http://localhost:3000/admin)
- **نام و واٹس ایپ سیٹنگز**: [`http://localhost:3000/admin/settings`](http://localhost:3000/admin/settings)
- **شالوں کی مینیجمنٹ**: [`http://localhost:3000/admin/products`](http://localhost:3000/admin/products)

### ڈیفالٹ ایڈمن لاگ ان کریڈینشلز:
- **ای میل**: `admin@showltown.com`
- **پاس ورڈ**: `admin123`

---

## 3. ٹیسٹ اور تصدیق (Verification)

تمام فنکشنز کی آٹومیٹڈ ٹیسٹنگ کے لیے:
```bash
node scripts/verify-endpoints.mjs
```
تمام 7 بڑے ٹیسٹ (ہوم پیج، پروڈکٹ پیج، پی کے آر پرائسنگ، واٹس ایپ نمبر، ایڈمن سیٹنگز سے لائیو نام بدلنا اور بحال کرنا) 100% کامیابی کے ساتھ پاس ہوئے ہیں۔
