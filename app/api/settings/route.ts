import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    updateSettings(body);
    const updated = getSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
