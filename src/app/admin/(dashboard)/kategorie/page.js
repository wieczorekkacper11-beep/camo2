import { getCategories } from '@/lib/db/queries.js';
import CategoryManager from '@/components/admin/CategoryManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Zarządzanie kategoriami | CAMO Admin',
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryManager initialCategories={categories} />;
}
