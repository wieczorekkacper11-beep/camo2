import Link from 'next/link';
import { db } from '@/lib/db/index.js';
import { products, categories } from '@/lib/db/schema.js';
import { eq, desc, sql } from 'drizzle-orm';
import styles from './dashboard.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Panel CAMO | Dashboard',
};

const availabilityLabels = {
  available: { label: 'Dostępny', badgeClass: 'badge-available', dotClass: 'status-dot-available' },
  low: { label: 'Mała ilość', badgeClass: 'badge-low', dotClass: 'status-dot-low' },
  unavailable: { label: 'Brak', badgeClass: 'badge-unavailable', dotClass: 'status-dot-unavailable' },
  on_order: { label: 'Na zamówienie', badgeClass: 'badge-on-order', dotClass: 'status-dot-on-order' },
};

export default async function AdminDashboardPage() {
  // Statystyki
  const [allCountRes] = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(products);

  const [availableCountRes] = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(products)
    .where(eq(products.availability, 'available'));

  const [lowCountRes] = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(products)
    .where(eq(products.availability, 'low'));

  const [unavailableCountRes] = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(products)
    .where(eq(products.availability, 'unavailable'));

  const totalCount = allCountRes?.count || 0;
  const availableCount = availableCountRes?.count || 0;
  const lowCount = lowCountRes?.count || 0;
  const unavailableCount = unavailableCountRes?.count || 0;

  // Ostatnio dodane produkty (5 pozycji)
  const recentProducts = await db
    .select({
      id: products.id,
      name: products.name,
      manufacturer: products.manufacturer,
      price: products.price,
      availability: products.availability,
      imageUrl: products.imageUrl,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.id))
    .limit(5);

  return (
    <div className={styles.container}>
      {/* Powitanie */}
      <div className={styles.header}>
        <div className={styles.greeting}>Dzień dobry</div>
        <h1 className={styles.title}>Panel CAMO</h1>
        <p className={styles.subtitle}>
          Zarządzaj asortymentem i ustawieniami sklepu stacjonarnego w Busku-Zdroju
        </p>
      </div>

      {/* Szybkie przyciski */}
      <div className={styles.quickActions}>
        <Link href="/admin/produkty/nowy" className={styles.actionBtnPrimary}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>+ Dodaj produkt</span>
        </Link>

        <Link href="/admin/produkty" className={styles.actionBtnSecondary}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect width="8" height="4" x="8" y="2" rx="1" />
          </svg>
          <span>Zarządzaj produktami</span>
        </Link>

        <Link href="/admin/kategorie" className={styles.actionBtnSecondary}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          <span>Kategorie</span>
        </Link>

        <Link href="/admin/ustawienia" className={styles.actionBtnSecondary}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Ustawienia</span>
        </Link>
      </div>

      {/* 4 Karty statystyk */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Wszystkie produkty</span>
            <div className={`${styles.statIconBox} ${styles.iconAll}`}>📦</div>
          </div>
          <div className={styles.statValue}>{totalCount}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Dostępne</span>
            <div className={`${styles.statIconBox} ${styles.iconAvailable}`}>✓</div>
          </div>
          <div className={styles.statValue}>{availableCount}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Mała ilość</span>
            <div className={`${styles.statIconBox} ${styles.iconLow}`}>⚠</div>
          </div>
          <div className={styles.statValue}>{lowCount}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Brak na stanie</span>
            <div className={`${styles.statIconBox} ${styles.iconUnavailable}`}>✕</div>
          </div>
          <div className={styles.statValue}>{unavailableCount}</div>
        </div>
      </div>

      {/* Ostatnio dodane produkty */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h2 className={styles.recentTitle}>Ostatnio dodane produkty</h2>
          <Link href="/admin/produkty" className={styles.viewAllLink}>
            Zobacz wszystkie ({totalCount}) →
          </Link>
        </div>

        <div className={styles.recentList}>
          {recentProducts.map((p) => {
            const status = availabilityLabels[p.availability] || availabilityLabels.available;
            const priceLabel =
              p.price !== null && p.price !== undefined
                ? `${Number(p.price).toFixed(2).replace('.', ',')} zł`
                : 'Cena w sklepie';

            return (
              <div key={p.id} className={styles.recentItem}>
                <div className={styles.recentItemLeft}>
                  <div className={styles.recentThumb}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} />
                    ) : (
                      <span>🐟</span>
                    )}
                  </div>
                  <div className={styles.recentDetails}>
                    <span className={styles.recentName}>{p.name}</span>
                    <span className={styles.recentMeta}>
                      {p.categoryName || 'Brak kategorii'}{' '}
                      {p.manufacturer ? `• ${p.manufacturer}` : ''}
                    </span>
                  </div>
                </div>

                <div className={styles.recentItemRight}>
                  <span className={styles.recentPrice}>{priceLabel}</span>
                  <span className={`badge ${status.badgeClass}`}>
                    <span className={`status-dot ${status.dotClass}`} />
                    {status.label}
                  </span>
                  <Link
                    href={`/admin/produkty/${p.id}`}
                    className={styles.recentEditLink}
                  >
                    Edytuj
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
