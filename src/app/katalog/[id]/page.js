export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/db/queries.js';
import styles from './page.module.css';

// static

const availabilityMap = {
  available: {
    label: 'Dostępny',
    badgeClass: 'badge-available',
    dotClass: 'status-dot-available',
    noticeClass: styles.stockNoticeAvailable,
    icon: '✓',
    text: 'Produkt dostępny w sklepie stacjonarnym w Busku-Zdroju. Zapraszamy do obejrzenia na miejscu!',
  },
  low: {
    label: 'Mała ilość',
    badgeClass: 'badge-low',
    dotClass: 'status-dot-low',
    noticeClass: styles.stockNoticeLow,
    icon: '⚠',
    text: 'Ostatnie sztuki na stanie w sklepie stacjonarnym. Przed przyjazdem warto zadzwonić i zapytać o rezerwację.',
  },
  unavailable: {
    label: 'Niedostępny',
    badgeClass: 'badge-unavailable',
    dotClass: 'status-dot-unavailable',
    noticeClass: styles.stockNoticeUnavailable,
    icon: '✕',
    text: 'Produkt chwilowo niedostępny w sklepie stacjonarnym. Skontaktuj się z nami, aby zapytać o dostawę.',
  },
  on_order: {
    label: 'Na zamówienie',
    badgeClass: 'badge-on-order',
    dotClass: 'status-dot-on-order',
    noticeClass: styles.stockNoticeOnOrder,
    icon: '📦',
    text: 'Produkt sprowadzany na zamówienie klienta. Skontaktuj się z nami, aby poznać termin realizacji.',
  },
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Produkt nie znaleziony | CAMO',
    };
  }

  return {
    title: `${product.name} | CAMO Sklep Strzelecko-Wędkarski`,
    description:
      product.description ||
      `Sprawdź dostępność produktu ${product.name} w stacjonarnym sklepie CAMO w okolicach Buska-Zdroju.`,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const stock = availabilityMap[product.availability] || availabilityMap.available;
  const formattedPrice =
    product.price !== null && product.price !== undefined && product.price > 0
      ? `${Number(product.price).toFixed(2).replace('.', ',')} zł`
      : null;

  return (
    <div className={`container ${styles.container}`}>
      {/* Breadcrumbs */}
      <nav aria-label="Ścieżka powrotu" className={styles.breadcrumbs}>
        <Link href="/" className={styles.breadcrumbLink}>
          Strona główna
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/katalog" className={styles.breadcrumbLink}>
          Katalog
        </Link>
        {product.categoryName && (
          <>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link
              href={`/katalog?kategoria=${product.categorySlug}`}
              className={styles.breadcrumbLink}
            >
              {product.categoryName}
            </Link>
          </>
        )}
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      {/* Główna karta produktu */}
      <div className={styles.productLayout}>
        {/* Lewa kolumna: Zdjęcie */}
        <div className={styles.imageColumn}>
          <div className={styles.imageContainer}>
            {product.isFeatured ? (
              <span className={styles.featuredRibbon}>★ Polecany w CAMO</span>
            ) : null}

            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className={styles.mainImage}
              />
            ) : (
              <div className={styles.fallbackImage} aria-hidden="true">
                <div className={styles.fallbackIcon}>
                  <svg
                    width="44"
                    height="44"
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
                <span className={styles.fallbackLabel}>
                  CAMO – Sklep Wędkarski
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Prawa kolumna: Informacje i kontakt */}
        <div className={styles.detailsColumn}>
          <div className={styles.categoryAndBrand}>
            {product.categoryName && (
              <span className={styles.categoryTag}>{product.categoryName}</span>
            )}
            {product.manufacturer && (
              <span className={styles.manufacturerTag}>
                Producent: <strong>{product.manufacturer}</strong>
              </span>
            )}
          </div>

          <h1 className={styles.title}>{product.name}</h1>

          {/* Ramka ceny i statusu */}
          <div className={styles.priceAndStockBox}>
            <div className={styles.priceWrapper}>
              <span className={styles.priceLabel}>Cena w sklepie:</span>
              {formattedPrice ? (
                <span className={styles.priceValue}>{formattedPrice}</span>
              ) : (
                <span className={styles.priceInStoreNotice}>
                  Cena dostępna w sklepie
                </span>
              )}
            </div>

            <div className={`badge ${stock.badgeClass} ${styles.availabilityBadgeBig}`}>
              <span className={`status-dot ${stock.dotClass}`} />
              <span>{stock.label}</span>
            </div>
          </div>

          {/* Wyraźny komunikat o dostępności w sklepie */}
          <div className={`${styles.stockNotice} ${stock.noticeClass}`}>
            <span className={styles.stockIcon}>{stock.icon}</span>
            <div>
              <strong>Status asortymentu:</strong> {stock.text}
            </div>
          </div>

          {/* Opis produktu */}
          {product.description && (
            <div className={styles.descriptionBox}>
              <h2 className={styles.descriptionTitle}>Opis produktu</h2>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>
          )}

          {/* Blok kontaktowy (zamiast koszyka i płatności) */}
          <div className={styles.ctaBox}>
            <div className={styles.ctaHeader}>
              <h3 className={styles.ctaTitle}>Zainteresowany tym produktem?</h3>
              <p className={styles.ctaSubtitle}>
                Nie prowadzimy sprzedaży wysyłkowej online. Zapraszamy do
                odwiedzenia naszego sklepu stacjonarnego lub kontaktu
                telefonicznego.
              </p>
            </div>

            <div className={styles.ctaButtons}>
              <a
                href="tel:+48798025026"
                className={`btn btn-primary btn-lg ${styles.ctaPhoneBtn}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Zadzwoń: 798 025 026
              </a>

              <Link
                href="/kontakt"
                className={`btn btn-secondary btn-lg ${styles.ctaMapBtn}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Dojazd do sklepu
              </Link>
            </div>

            <div className={styles.storeLocationInfo}>
              <span>📍</span>
              <span>
                Siesławice 229D, 28-100 Busko-Zdrój • Pon–Pt 8:00–17:00, Sob
                8:00–14:00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


