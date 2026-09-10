import Link from 'next/link';
import { getProductById, getCategories } from '@/lib/db/queries.js';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  return {
    title: product ? `Edycja: ${product.name} | CAMO Admin` : 'Produkt nie znaleziony | CAMO Admin',
  };
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '16px' }}>
          Produkt nie został odnaleziony
        </h1>
        <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
          Produkt o ID lub slug &quot;{id}&quot; nie istnieje w bazie danych sklepu.
        </p>
        <Link
          href="/admin/produkty"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: 'var(--color-primary, #D4A017)',
            color: '#000',
            fontWeight: 600,
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          Wróć do listy produktów
        </Link>
      </div>
    );
  }

  return <ProductForm initialData={product} categories={categories} />;
}
