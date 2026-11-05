import { NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const featuredOnly = searchParams.get('featured') === 'true';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  const products = getAllProducts({
    categorySlug,
    search,
    featuredOnly,
    limit,
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, price, compare_at_price, category_id, image_url, material, origin, is_featured, stock_status } = body;

    if (!name || !slug || !price || !category_id || !image_url) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const result = createProduct({
      name,
      slug,
      description: description || 'Artisanal handcrafted luxury garment.',
      price: parseFloat(price),
      compare_at_price: compare_at_price ? parseFloat(compare_at_price) : null,
      category_id: parseInt(category_id),
      image_url,
      is_featured: is_featured ? 1 : 0,
      stock_status: stock_status || 'in_stock',
      material,
      origin,
    });

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
