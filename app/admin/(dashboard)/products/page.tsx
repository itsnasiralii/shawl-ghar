import React from 'react';
import { getAllProducts, getAllCategories, getSettings } from '@/lib/db';
import ProductManagementTable from '@/components/admin/ProductManagementTable';

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
  const products = getAllProducts();
  const categories = getAllCategories();
  const settings = getSettings();

  return (
    <ProductManagementTable
      initialProducts={products}
      categories={categories}
      currencySymbol={settings.currency_symbol}
    />
  );
}
