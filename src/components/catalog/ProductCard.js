import Link from 'next/link';
import styles from './ProductCard.module.css';

const availabilityConfig = {
  available: {
    label: 'Dostępny',
    badgeClass: 'badge-available',
    dotClass: 'status-dot-available',
  },
  low: {
    label: 'Mała ilość',
    badgeClass: 'badge-low',
    dotClass: 'status-dot-low',
  },
  unavailable: {
    label: 'Niedostępny',
    badgeClass: 'badge-unavailable',
    dotClass: 'status-dot-unavailable',
  },
  on_order: {
    label: 'Na zamówienie',
    badgeClass: 'badge-on-order',
    dotClass: 'status-dot-on-order',
  },
};

export default function ProductCard({ product }) {
  if (!product) return null;

  const availability = availabilityConfig[product.availability] || availabilityConfig.available;
  const formattedPrice =
    product.price !== null && product.price !== undefined && product.price > 0
      ? `${Number(product.price).toFixed(2).replace('.', ',')} zł`
      : null;

  return (
    <Link href={`/katalog/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <div className={styles.topBadges}>
          {product.isFeatured ? (
            <span className={styles.featuredBadge}>★ Polecany</span>
          ) : (
            <span />
          )}
        </div>

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.fallbackImage} aria-hidden="true">
            <div className={styles.fallbackIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c2.5 0 4.8-.9 6.6-2.4l-3.6-3.6" />
                <path d="M16 16c2.2-2.2 2.2-5.8 0-8s-5.8-2.2-8 0" />
                <path d="m14 10 7-7" />
                <circle cx="17.5" cy="6.5" r="1.5" />
              </svg>
            </div>
            <span className={styles.fallbackWatermark}>CAMO BUSKO</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          {product.categoryName && (
            <span className={styles.category}>{product.categoryName}</span>
          )}
          {product.manufacturer && (
            <span className={styles.manufacturer}>{product.manufacturer}</span>
          )}
        </div>

        <h3 className={styles.name} title={product.name}>
          {product.name}
        </h3>

        <div className={styles.bottomSection}>
          <div className={styles.priceAndStock}>
            <div className={styles.priceContainer}>
              {formattedPrice ? (
                <span className={styles.priceValue}>{formattedPrice}</span>
              ) : (
                <span className={styles.priceInStore}>Cena w sklepie</span>
              )}
            </div>

            <span className={`badge ${availability.badgeClass}`}>
              <span className={`status-dot ${availability.dotClass}`} />
              {availability.label}
            </span>
          </div>

          <div className={styles.detailsBtn}>
            <span>Szczegóły</span>
            <svg
              className={styles.arrowIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
