import React from 'react';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminSession();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans text-stone-900">
      {/* Sidebar Navigation */}
      <AdminSidebar
        user={{
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }}
      />

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-stone-200 px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Environment: Production Local Prototype • SQLite Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="hidden sm:inline">Signed in as: <strong className="text-stone-800">{admin.email}</strong></span>
            <span className="bg-stone-100 border border-stone-300 text-stone-700 px-2 py-1 rounded text-[11px] font-mono">
              Role: {admin.role.toUpperCase()}
            </span>
          </div>
        </header>

        {/* Dynamic Admin Page Container */}
        <div className="p-6 sm:p-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
