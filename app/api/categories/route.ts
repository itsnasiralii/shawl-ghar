import { NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';

export async function GET() {
  const categories = getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, image_url } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const generatedSlug = slug
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const result = createCategory({
      name: name.trim(),
      slug: generatedSlug,
      description: description ? description.trim() : '',
      image_url: image_url ? image_url.trim() : '/images/products/maroon-stole-1.jpg',
    });

    const categories = getAllCategories();
    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      categoryId: result.lastInsertRowid,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
