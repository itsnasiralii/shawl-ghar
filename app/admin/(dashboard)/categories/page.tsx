import React from 'react';
import { getAllCategories } from '@/lib/db';
import CategoryManagementView from '@/components/admin/CategoryManagementView';

export const dynamic = 'force-dynamic';

export default function AdminCategoriesPage() {
  const categories = getAllCategories();

  return <CategoryManagementView initialCategories={categories} />;
}
