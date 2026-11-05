import React from 'react';
import { getSettings } from '@/lib/db';
import AdminSettingsForm from '@/components/admin/AdminSettingsForm';

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  const settings = getSettings();

  return <AdminSettingsForm initialSettings={settings} />;
}
