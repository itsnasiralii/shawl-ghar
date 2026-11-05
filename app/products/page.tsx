import React from 'react';
import Link from 'next/link';
import { getAllProducts, getAllCategories, getSettings } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const { category: categorySlug, search, sort } = await searchParams;

  const settings = getSettings();
  const categories = getAllCategories();
  let products = getAllProducts({
    categorySlug,
    search,
  });

  // Basic sorting
  if (sort === 'price_asc') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products = [...products].sort((a, b) => b.price - a.price);
  }

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header & Breadcrumb */}
      <div className="space-y-3 border-b border-stone-200 pb-8">
        <nav className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-stone-900 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Shawl Catalog</span>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-amber-800 font-semibold">{activeCategory.name}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              {activeCategory ? activeCategory.name : 'The Complete Shawl Collection'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl">
              {activeCategory
                ? activeCategory.description
                : 'Explore our master-loomed Kashmiri pashminas, hand-embroidered wool stoles, and royal bridal wraps. Available with Cash on Delivery nationwide.'}
            </p>
          </div>

          <div className="text-xs uppercase tracking-wider text-stone-500 font-medium">
            Showing <span className="font-bold text-stone-900">{products.length}</span> pieces
          </div>
        </div>
      </div>

      {/* Filter Chips & Sorting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors ${
              !categorySlug
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Pieces ({getAllProducts().length})
          </Link>
          {categories.map((cat) => {
            const isSelected = categorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat.name} ({cat.product_count || 0})
              </Link>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-medium flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort By:</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <Link
              href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}sort=featured`}
              className={`px-2.5 py-1.5 rounded-md border ${
                !sort || sort === 'featured'
                  ? 'border-stone-900 bg-stone-900 text-white font-medium'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              Featured
            </Link>
            <Link
              href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}sort=price_asc`}
              className={`px-2.5 py-1.5 rounded-md border ${
                sort === 'price_asc'
                  ? 'border-stone-900 bg-stone-900 text-white font-medium'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              Price: Low &rarr; High
            </Link>
            <Link
              href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}sort=price_desc`}
              className={`px-2.5 py-1.5 rounded-md border ${
                sort === 'price_desc'
                  ? 'border-stone-900 bg-stone-900 text-white font-medium'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              Price: High &rarr; Low
            </Link>
          </div>
        </div>
      </div>

      {/* Active Search Term notice */}
      {search && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between">
          <span>
            Search results matching: <strong className="font-semibold">&ldquo;{search}&rdquo;</strong>
          </span>
          <Link href="/products" className="text-amber-800 underline font-semibold hover:text-amber-950">
            Clear Filter
          </Link>
        </div>
      )}

      {/* Product Grid with WhatsApp Buttons on cards */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings.whatsapp_number}
              currencySymbol={settings.currency_symbol}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-900">
            No shawls found
          </h3>
          <p className="text-sm text-stone-500">
            We couldn&apos;t find any items matching your selected criteria. Try browsing all categories.
          </p>
          <Link
            href="/products"
            className="inline-flex px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition"
          >
            Reset Filters
          </Link>
        </div>
      )}

    </div>
  );
}
