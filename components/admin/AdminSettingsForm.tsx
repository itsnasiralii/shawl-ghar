'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Phone,
  Store,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Save
} from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/format';

interface AdminSettingsFormProps {
  initialSettings: Record<string, string>;
}

export default function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSuccess('Website settings and WhatsApp configuration saved successfully! (Changes are live immediately)');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  const sampleTestLink = buildWhatsAppLink(
    settings.whatsapp_number || '0313-5209085',
    'Hello! Testing WhatsApp order integration from Shawl Ghar Admin.'
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
          <Settings className="w-7 h-7 text-amber-600" />
          <span>Global Brand &amp; WhatsApp Settings</span>
        </h1>
        <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">
          Dynamic Website Name Control, WhatsApp Number &amp; Currency Settings
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="font-bold text-emerald-900 hover:text-emerald-950">
            &times;
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-2 text-xs text-rose-800 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Preview Pill Card */}
      <div className="bg-stone-900 text-stone-200 rounded-2xl p-6 border border-stone-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Live Storefront Preview</span>
          </span>
          <span className="bg-white/10 px-2.5 py-1 rounded-full text-stone-300 text-[10px]">
            Global State Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Brand Name Preview */}
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest">Active Brand Name</span>
            <div className="text-2xl font-serif font-bold text-white tracking-wider">
              {settings.site_name || 'Shawl Ghar'}
            </div>
            <p className="text-xs text-stone-400 italic">
              &quot;{settings.site_tagline || 'Authentic Handcrafted Kashmiri Shawls & Fine Stoles'}&quot;
            </p>
          </div>

          {/* WhatsApp Button Preview */}
          <div className="space-y-2">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest">WhatsApp Order Button Preview</span>
            <div className="flex items-center gap-3">
              <a
                href={sampleTestLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Order on WhatsApp: {settings.whatsapp_number || '0313-5209085'}</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            <p className="text-[11px] text-stone-400">
              Click the preview button to test opening WhatsApp with the current number.
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Section 1: Website Name & Brand */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-700" />
            <span>1. Website Name &amp; Visual Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Website Name *
              </label>
              <input
                type="text"
                required
                value={settings.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                placeholder="e.g. Shawl Ghar"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:border-amber-700 font-medium"
              />
              <span className="text-[10px] text-stone-400">
                This name updates dynamically across the entire website header, footer, and titles.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.site_tagline || ''}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
                placeholder="Authentic Handcrafted Kashmiri Shawls, Pure Wool Stoles & Fine Textiles"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:border-amber-700"
              />
              <span className="text-[10px] text-stone-400">Displayed in headers, SEO descriptions, and footers.</span>
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp Number & Integration */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>2. WhatsApp Ordering &amp; Number Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                WhatsApp Order Hotline *
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="0313-5209085"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
              />
              <span className="text-[10px] text-stone-500">
                All &ldquo;Order on WhatsApp&rdquo; buttons across the storefront will instantly link to this number.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currency_symbol || 'Rs.'}
                onChange={(e) => handleChange('currency_symbol', e.target.value)}
                placeholder="Rs."
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-stone-500">
                Current currency: Pakistani Rupees (Rs. / PKR).
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Automated WhatsApp Message Template</span>
            </label>
            <textarea
              rows={3}
              value={settings.whatsapp_message || ''}
              onChange={(e) => handleChange('whatsapp_message', e.target.value)}
              placeholder="Hello! I would like to order: {product_name} (Price: {price}) from Shawl Ghar. Please share delivery details."
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none"
            />
            <span className="text-[10px] text-stone-400">
              Variables <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-800 font-mono">{`{product_name}`}</code> and <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-800 font-mono">{`{price}`}</code> are automatically replaced with product values.
            </span>
          </div>
        </div>

        {/* Section 3: Contact Info */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-2">
            3. Atelier Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="orders@shawlghar.com"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Showroom / Atelier Address
              </label>
              <input
                type="text"
                value={settings.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                placeholder="Shop 14, Heritage Loom Plaza, MM Alam Road / Blue Area, Pakistan"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold uppercase tracking-widest transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
