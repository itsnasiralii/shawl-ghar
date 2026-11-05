import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById, getAllProducts, getSettings } from '@/lib/db';
import ProductDetailView from '@/components/ProductDetailView';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = getProductById(productId);
  if (!product) {
    notFound();
  }

  const settings = getSettings();

  // Fetch related products in same category or general collection
  const relatedProducts = getAllProducts({
    categoryId: product.category_id,
    limit: 4,
  }).filter((p) => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <ProductDetailView
        product={product}
        relatedProducts={relatedProducts}
        whatsappNumber={settings.whatsapp_number}
        currencySymbol={settings.currency_symbol}
        siteName={settings.site_name}
      />
    </div>
  );
}
