export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getProducts, getCategories, getManufacturers } from '@/lib/db/queries.js';
import CatalogView from '@/components/catalog/CatalogView';

export const metadata = {
  title: 'Katalog produktów | CAMO Sklep Strzelecko-Wędkarski',
  description:
    'Przeglądaj asortyment sklepu wędkarskiego CAMO w Busku-Zdroju. Wędki, kołowrotki, przynęty, zanęty i akcesoria wędkarskie. Sprawdź dostępność na miejscu.',
};

export default async function KatalogPage() {
  const [products, categories, manufacturers] = await Promise.all([
    getProducts(),
    getCategories(),
    getManufacturers(),
  ]);

  return (
    <div className="container" style={{ paddingTop: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>
          Katalog produktów
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-lg)',
            maxWidth: '640px',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          Sprawdź aktualny asortyment i dostępność sprzętu w naszym sklepie stacjonarnym w okolicach Buska-Zdroju.
        </p>
      </div>

      <Suspense
        fallback={
          <div
            style={{
              padding: 'var(--space-16) 0',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
            }}
          >
            Ładowanie katalogu produktów...
          </div>
        }
      >
        <CatalogView
          initialProducts={products}
          categories={categories}
          manufacturers={manufacturers}
        />
      </Suspense>
    </div>
  );
}
