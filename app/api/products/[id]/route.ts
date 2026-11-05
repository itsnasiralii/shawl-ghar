import { NextResponse } from 'next/server';
import { getProductById, deleteProduct, updateProduct } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const product = getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const existing = getProductById(productId);
  if (!existing) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.slug !== undefined) updateData.slug = String(body.slug).trim();
    if (body.description !== undefined) updateData.description = String(body.description);
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.compare_at_price !== undefined) {
      updateData.compare_at_price = body.compare_at_price ? parseFloat(body.compare_at_price) : null;
    }
    if (body.category_id !== undefined) updateData.category_id = parseInt(body.category_id);
    if (body.image_url !== undefined) updateData.image_url = String(body.image_url);
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured ? 1 : 0;
    if (body.stock_status !== undefined) updateData.stock_status = String(body.stock_status);
    if (body.material !== undefined) updateData.material = String(body.material);
    if (body.origin !== undefined) updateData.origin = String(body.origin);

    updateProduct(productId, updateData);
    const updated = getProductById(productId);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  deleteProduct(productId);
  return NextResponse.json({ success: true, message: 'Product deleted successfully' });
}
