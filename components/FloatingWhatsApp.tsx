'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cleanWhatsAppNumber } from '@/lib/format';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  siteName: string;
}

export default function FloatingWhatsApp({ whatsappNumber, siteName }: FloatingWhatsAppProps) {
  const cleanPhone = cleanWhatsAppNumber(whatsappNumber || '0313-5209085');
  const message = encodeURIComponent(`Hello! I am browsing ${siteName} and would like to inquire about shawls and order details.`);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <aside aria-label="WhatsApp customer support" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip Pill */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md text-stone-900 border border-emerald-300 shadow-xl px-4 py-2 rounded-full text-xs font-semibold hover:bg-emerald-50 transition-all group"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Order on WhatsApp:</span>
        <span className="font-mono text-emerald-800 font-bold">{whatsappNumber}</span>
      </a>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp with ${siteName} at ${whatsappNumber}`}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group relative border-2 border-white"
        title={`WhatsApp Order: ${whatsappNumber}`}
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white"></span>
        </span>
      </a>
    </aside>
  );
}
