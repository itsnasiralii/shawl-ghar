'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, formatPrice, buildWhatsAppLink } from '@/lib/format';
import {
  Sparkles,
  ShieldCheck,
  Feather,
  ShoppingBag,
  Heart,
  Share2,
  Info,
  Check,
  MessageCircle,
  Phone,
  Flame
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  whatsappNumber?: string;
  currencySymbol?: string;
  siteName?: string;
}

export default function ProductDetailView({
  product,
  relatedProducts,
  whatsappNumber = '0313-5209085',
  currencySymbol = 'Rs.',
  siteName = 'Shawl Ghar',
}: ProductDetailViewProps) {
  let additional: string[] = [];
  try {
    if (product.additional_images) {
      additional = JSON.parse(product.additional_images);
    }
  } catch {
    additional = [];
  }

  const allImages = [product.image_url, ...additional].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [prototypeModalOpen, setPrototypeModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const formattedPrice = formatPrice(product.price, currencySymbol);
  const formattedComparePrice = product.compare_at_price
    ? formatPrice(product.compare_at_price, currencySymbol)
    : null;

  // Build WhatsApp order link in clean English
  const orderMessage = `Hello! I would like to order this handcrafted item from *${siteName}*:\n\n✨ *${product.name}* ✨\n*Price:* ${formattedPrice} ${formattedComparePrice ? `(Original: ${formattedComparePrice})` : ''}\n*Product Link:* ${typeof window !== 'undefined' ? window.location.href : `http://localhost:3000/products/${product.id}`}\n\nPlease confirm availability and share Cash on Delivery order details. Thank you!`;
  const whatsappUrl = buildWhatsAppLink(whatsappNumber, orderMessage);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-stone-900 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-stone-900 transition">
          Shawl Collection
        </Link>
        <span>/</span>
        {product.category_slug && (
          <>
            <Link
              href={`/products?category=${product.category_slug}`}
              className="hover:text-stone-900 transition"
            >
              {product.category_name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Column: Image Gallery Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/5 w-full bg-stone-100 rounded-3xl overflow-hidden border border-stone-200/90 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.is_featured === 1 && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 bg-stone-900/90 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-xs shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Loom Edition
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails (if multiple images) */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-amber-800 ring-2 ring-amber-800/30'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & WhatsApp Ordering */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs">
              <Link
                href={`/products?category=${product.category_slug}`}
                className="uppercase tracking-widest font-semibold text-amber-900 hover:underline"
              >
                {product.category_name}
              </Link>
              <span className="text-stone-400 font-mono">SKU: SG-00{product.id}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Special Limited Offer Banner & Pricing */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>🎁 Special Limited Time Offer</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-stone-950 font-serif">
                  {formattedPrice}
                </span>
                {formattedComparePrice && (
                  <span className="text-lg text-stone-400 line-through">
                    {formattedComparePrice}
                  </span>
                )}
                {discount && discount > 0 && (
                  <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-2xs">
                    Save {discount}%
                  </span>
                )}
              </div>

              <div className="text-xs text-stone-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-emerald-800">
                  {product.stock_status === 'in_stock'
                    ? 'In Stock — Ready for Nationwide Cash on Delivery'
                    : 'Limited Edition — Low Stock'}
                </span>
              </div>
            </div>

            {/* Description Details */}
            <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-stone-200/80">
              {product.description}
            </div>

            {/* Specifications Matrix */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-2.5 text-xs text-stone-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-500">Fabric &amp; Composition:</span>
                <span className="font-bold text-stone-900">{product.material || 'Premium Pure Wool'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-500">Craftsmanship:</span>
                <span className="font-bold text-stone-900">{product.origin || '100% Authentic Hand-Done Kashmiri Needle Embroidery'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-500">Payment Method:</span>
                <span className="font-bold text-emerald-800">Cash on Delivery (COD Available)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-500">Recommended Care:</span>
                <span className="font-bold text-stone-900">Dry Clean or Delicate Hand Wash</span>
              </div>
            </div>

            {/* PROMINENT WHATSAPP ORDER BUTTON */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>Order on WhatsApp: {whatsappNumber}</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPrototypeModalOpen(true)}
                  className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-500" />
                  <span>Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-stone-500" />}
                  <span>{copiedLink ? 'Copied Link' : 'Share Piece'}</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>100% Authentic Handcrafted Weave</span>
              </div>
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Pure Natural Himalayan Wool</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Complementary Shawls &amp; Stoles
            </h2>
            <Link
              href="/products"
              className="text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-stone-900"
            >
              View Full Catalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all"
              >
                <div className="aspect-4/5 w-full bg-stone-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800">
                    {item.category_name}
                  </span>
                  <h3 className="font-serif font-medium text-stone-900 text-sm line-clamp-1">
                    <Link href={`/products/${item.id}`} className="hover:text-amber-800 transition">
                      {item.name}
                    </Link>
                  </h3>
                  <div className="text-sm font-bold text-stone-900">
                    {formatPrice(item.price, currencySymbol)}
                  </div>
                  <a
                    href={buildWhatsAppLink(
                      whatsappNumber,
                      `Hello! I would like to order: ${item.name} (${formatPrice(item.price, currencySymbol)}) from Shawl Ghar.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold text-center block mt-2"
                  >
                    Order on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Phase 1 Restriction Notice Modal */}
      {prototypeModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Direct WhatsApp Ordering Active
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                For prompt dispatch with Cash on Delivery across Pakistan, please complete your order directly on WhatsApp.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setPrototypeModalOpen(false)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition block text-center shadow-md"
            >
              Start WhatsApp Order ({whatsappNumber})
            </a>

            <button
              type="button"
              onClick={() => setPrototypeModalOpen(false)}
              className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
