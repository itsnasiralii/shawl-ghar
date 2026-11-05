import { NextResponse } from 'next/server';
import { deleteCategory, getAllCategories } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const { id } = await params;
  const categoryId = parseInt(id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
  }

  try {
    deleteCategory(categoryId);
    const categories = getAllCategories();
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 400 }
    );
  }
}
