import { getSettingsMap } from '@/lib/db/queries.js';
import SettingsManager from '@/components/admin/SettingsManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ustawienia sklepu | CAMO Admin',
};

export default async function AdminSettingsPage() {
  const settings = await getSettingsMap();
  return <SettingsManager initialSettings={settings} />;
}
