import React from 'react';
import Link from 'next/link';
import { Sparkles, Phone } from 'lucide-react';
import { getSettings } from '@/lib/db';
import { cleanWhatsAppNumber } from '@/lib/format';

export default function PromoBanner() {
  const settings = getSettings();
  const whatsapp = settings.whatsapp_number || '0313-5209085';
  const cleanPhone = cleanWhatsAppNumber(whatsapp);

  return (
    <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="flex items-center gap-1 text-amber-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings.site_name || 'Shawl Ghar'}</span>
          </span>
          <span className="hidden md:inline text-stone-500">•</span>
          <span className="hidden md:inline text-stone-300">
            Authentic Kashmiri Pashmina &amp; Pure Wool Stoles | Cash on Delivery Available
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-stone-400">
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Hotline: {whatsapp}</span>
          </a>
          <span className="text-stone-700 hidden sm:inline">|</span>
          <span className="text-amber-400 font-medium hidden sm:inline">
            Free Shipping Nationwide
          </span>
        </div>
      </div>
    </div>
  );
}
