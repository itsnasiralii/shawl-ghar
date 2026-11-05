import React from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  Users,
  CheckCircle,
  ArrowRight,
  Plus,
  Eye,
  Phone,
  Settings
} from 'lucide-react';
import { getAdminStats, getAllProducts, getSettings, formatPrice } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const stats = getAdminStats();
  const settings = getSettings();
  const recentProducts = getAllProducts({ limit: 5 });

  return (
    <div className="space-y-8 max-w-7xl">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
            <span>{settings.site_name || 'Shawl Ghar'} — Admin Dashboard</span>
          </h1>
          <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">
            Global Settings Active • WhatsApp Hotline: <strong className="text-emerald-700 font-mono">{settings.whatsapp_number}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition shadow-sm"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Website Name &amp; WhatsApp Settings</span>
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shawl</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold uppercase tracking-wider transition shadow-2xs"
          >
            <Eye className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
        </div>
      </div>

      {/* Global Configuration Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Active Global Configuration</span>
          </div>
          <div className="text-sm text-stone-800">
            Brand Name: <strong className="font-bold text-stone-950">{settings.site_name}</strong> | WhatsApp Order Hotline: <strong className="font-mono text-emerald-800">{settings.whatsapp_number}</strong> | Currency: <strong className="font-bold">{settings.currency_symbol} (PKR)</strong>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="shrink-0 text-xs font-bold text-amber-900 hover:text-amber-950 underline flex items-center gap-1"
        >
          <span>Change Name or WhatsApp Number</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Shawls</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold font-serif text-stone-900">{stats.totalProducts}</div>
            <div className="text-xs text-emerald-600 font-semibold">{stats.featuredProducts} Featured</div>
          </div>
          <p className="text-[11px] text-stone-400">Active handcrafted items in SQLite catalog</p>
        </div>

        {/* Metric 2: Categories */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Collections</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold font-serif text-stone-900">{stats.totalCategories}</div>
            <div className="text-xs text-stone-500 font-medium">5 Active Collections</div>
          </div>
          <p className="text-[11px] text-stone-400">Pashmina, Wool Stoles, Bridal, Swati, Silk</p>
        </div>

        {/* Metric 3: Users */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">System Users</span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold font-serif text-stone-900">{stats.totalUsers}</div>
            <div className="text-xs text-amber-700 font-semibold">1 Admin, 1 Customer</div>
          </div>
          <p className="text-[11px] text-stone-400">Authenticated accounts with role hierarchy</p>
        </div>

        {/* Metric 4: Stock Status */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory Health</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold font-serif text-stone-900">{stats.inStockCount}</div>
            <div className="text-xs text-rose-600 font-semibold">{stats.lowStockCount} Low Stock</div>
          </div>
          <p className="text-[11px] text-stone-400">Real-time inventory tracking</p>
        </div>

      </div>

      {/* Recent Catalog Activity Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900">
              Sample Shawls &amp; Stoles in Catalog
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              All prices formatted in Pakistani Rupees ({settings.currency_symbol || 'Rs.'} PKR).
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-wider font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            <span>Full Catalog View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6">Material</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-6 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-stone-900">{p.name}</div>
                      <div className="text-[10px] text-stone-400">SKU: SG-00{p.id}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[11px] font-medium">
                      {p.category_name}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-stone-900">
                    {formatPrice(p.price, settings.currency_symbol)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        p.stock_status === 'in_stock'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.stock_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-stone-500 max-w-[200px] truncate">
                    {p.material || 'Pure Wool'}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      href={`/products/${p.id}`}
                      target="_blank"
                      className="text-amber-800 hover:text-amber-950 font-semibold underline text-[11px]"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
