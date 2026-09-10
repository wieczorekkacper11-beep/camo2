import { getProducts, getCategories } from '@/lib/db/queries.js';
import ProductList from '@/components/admin/ProductList';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Zarządzanie produktami | CAMO Admin',
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts({ sort: 'newest' }),
    getCategories(),
  ]);

  return <ProductList initialProducts={products} categories={categories} />;
}
