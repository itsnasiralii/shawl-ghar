import React from 'react';
import getDatabase from '@/lib/db';
import { Users, Shield, UserCheck, KeyRound } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
  const db = getDatabase();
  const users = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC').all() as any[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Users &amp; Roles Management
        </h1>
        <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">
          Database Authentication Records • Role Hierarchy Foundation
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wider">
            <Users className="w-4 h-4 text-amber-700" />
            <span>Active Registered Accounts ({users.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">System Role</th>
                <th className="py-3.5 px-6">Created Timestamp</th>
                <th className="py-3.5 px-6 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 px-6 font-mono text-stone-400">#{u.id}</td>
                  <td className="py-4 px-6 font-semibold text-stone-900">{u.name}</td>
                  <td className="py-4 px-6 font-mono text-stone-600">{u.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {u.role === 'admin' ? <Shield className="w-3 h-3 text-amber-700" /> : <UserCheck className="w-3 h-3 text-stone-500" />}
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-stone-400 font-mono text-[11px]">{u.created_at}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-[11px] text-stone-500 font-medium">
                      {u.role === 'admin' ? 'Full Back-Office Access' : 'Standard Customer'}
                    </span>
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
