'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category } from '@/lib/format';
import {
  Plus,
  Layers,
  Trash2,
  ExternalLink,
  X,
  AlertCircle,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

interface CategoryManagementViewProps {
  initialCategories: Category[];
}

export default function CategoryManagementView({
  initialCategories,
}: CategoryManagementViewProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/products/maroon-stole-1.jpg');

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          image_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      setSuccessMsg(`Category "${name}" created successfully!`);
      setIsModalOpen(false);

      // Reset fields
      setName('');
      setSlug('');
      setDescription('');
      setImageUrl('/images/products/maroon-stole-1.jpg');

      if (data.categories) {
        setCategories(data.categories);
      }
      router.refresh();
    } catch (err: any) {
      setFormError(err.message || 'Error occurred while creating category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }

      if (data.categories) {
        setCategories(data.categories);
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }

      setSuccessMsg(`Category "${catName}" was removed.`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Categories &amp; Collections
          </h1>
          <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">
            Database Category Hierarchy • Showing {categories.length} Collections
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between hover:border-stone-300 transition-all"
          >
            <div className="aspect-16/9 relative bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image_url || '/images/products/maroon-stole-1.jpg'}
                alt={c.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                {c.product_count || 0} Products
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-stone-400">slug: /{c.slug}</span>
                <h3 className="font-serif font-bold text-stone-900 text-lg mt-0.5">{c.name}</h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-3 leading-relaxed">
                  {c.description || 'Authentic handcrafted Kashmiri collection.'}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <Link
                  href={`/products?category=${c.slug}`}
                  target="_blank"
                  className="text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1"
                >
                  <span>View in Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-[10px]">ID: #{c.id}</span>
                  <button
                    type="button"
                    disabled={deletingId === c.id}
                    onClick={() => handleDeleteCategory(c.id, c.name)}
                    className="text-stone-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded transition cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg">
                    Add New Category
                  </h3>
                  <p className="text-xs text-stone-500">
                    Create a new collection for organizing shawls and stoles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pashmina Jamawar Collection"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. pashmina-jamawar"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe this collection's craftsmanship, fabric, or heritage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  placeholder="/images/products/maroon-stole-1.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:border-stone-800"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Provide a path like /images/products/sui-ka-kaam-1.jpg or an external URL.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-50 rounded-lg text-stone-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
