export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  product_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  image_url: string;
  additional_images?: string | null;
  is_featured: number;
  is_active: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  material?: string | null;
  origin?: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}

/**
 * Format price in Pakistani Rupees (e.g. Rs. 2,800)
 */
export function formatPrice(amount: number, symbol = 'Rs.'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${symbol} 0`;
  const formatted = Math.round(amount).toLocaleString('en-PK');
  return `${symbol} ${formatted}`;
}

/**
 * Clean phone number for WhatsApp link (e.g. 0313-5209085 -> 923135209085)
 */
export function cleanWhatsAppNumber(phone: string): string {
  if (!phone) return '923135209085';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) {
    return '92' + digits.substring(1);
  }
  if (!digits.startsWith('92') && digits.length === 10) {
    return '92' + digits;
  }
  return digits;
}

/**
 * Generate click-to-chat WhatsApp link
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = cleanWhatsAppNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
