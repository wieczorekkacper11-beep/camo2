import Link from 'next/link';
import ProductCard from '@/components/catalog/ProductCard';
import styles from './FeaturedProducts.module.css';

export default function FeaturedProducts({ products = [] }) {
  return (
    <section className={styles.section} id="polecane">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>Polecane produkty</h2>
            <p className={styles.subtitle}>
              Wybrane pozycje z naszego aktualnego asortymentu w Busku-Zdroju
            </p>
          </div>
          <Link href="/katalog" className="btn btn-outline-dark">
            Zobacz cały katalog →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎣</div>
            <p className={styles.emptyText}>
              Aktualnie przygotowujemy nowe pozycje polecane.
            </p>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <Link href="/katalog" className="btn btn-primary">
                Przeglądaj wszystkie produkty
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
