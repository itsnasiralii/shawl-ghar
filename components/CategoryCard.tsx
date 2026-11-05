import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/lib/format';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-16/10 bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 border border-stone-800"
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={category.image_url || 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1000&auto=format&fit=crop'}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-90"
      />

      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent group-hover:via-stone-950/50 transition-colors" />

      {/* Content */}
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center justify-between text-amber-300 text-xs tracking-widest uppercase font-semibold">
          <span>{category.product_count !== undefined ? `${category.product_count} Pieces` : 'Artisanal'}</span>
          <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-amber-600 group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-100 transition-colors">
          {category.name}
        </h3>

        {category.description && (
          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed opacity-90">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
