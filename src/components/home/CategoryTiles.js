import Link from 'next/link';
import styles from './CategoryTiles.module.css';

const categoryIcons = {
  wedki: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20 20 4" />
      <path d="M20 4c1 4-1 9-5 13" />
      <circle cx="7" cy="17" r="2.5" />
      <path d="M9 15l2-2" />
      <path d="M13 11l2-2" />
    </svg>
  ),
  kolowrotki: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 5V2" />
      <path d="M8 2h8" />
      <path d="M14.5 14.5l3.5 3.5" />
      <circle cx="19" cy="19" r="1.5" />
    </svg>
  ),
  przynety: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12c3-4 8-6 13-4 3 1.5 5 4 5 4s-2 2.5-5 4c-5 2-10 0-13-4z" />
      <circle cx="17" cy="11" r="1" fill="currentColor" />
      <path d="M12 16c0 2-1.5 3-3 3s-2-1-2-2" />
      <path d="M21 12l2-2" />
      <path d="M21 12l2 2" />
    </svg>
  ),
  zanety: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16l-1.5 11a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 8z" />
      <path d="M3 8a3 3 0 0 1 18 0" />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  haczyki: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="4" r="2" />
      <path d="M14 6v8a5 5 0 0 1-10 0v-2l3 2" />
    </svg>
  ),
  'zylki-i-plecionki': (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="3" />
      <line x1="2" y1="6" x2="22" y2="6" />
      <line x1="2" y1="18" x2="22" y2="18" />
      <path d="M6 10h12" strokeDasharray="2 2" />
      <path d="M6 14h12" strokeDasharray="2 2" />
    </svg>
  ),
  feeder: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="5" width="12" height="15" rx="2" />
      <line x1="6" y1="9" x2="18" y2="9" />
      <line x1="6" y1="13" x2="18" y2="13" />
      <line x1="6" y1="17" x2="18" y2="17" />
      <line x1="10" y1="5" x2="10" y2="20" />
      <line x1="14" y1="5" x2="14" y2="20" />
      <path d="M12 5V2" />
      <circle cx="12" cy="2" r="1" />
    </svg>
  ),
  karpiowe: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13c4-6 11-7 16-2l4-4v10l-4-4c-3 3-7 4-11 2" />
      <circle cx="7" cy="11" r="1" fill="currentColor" />
      <path d="M11 9c1 1.5 1 3 0 4.5" />
    </svg>
  ),
  spinning: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3-8 9-14 17-17" />
      <path d="M16 4l4 4" />
      <circle cx="6" cy="18" r="2" />
      <path d="M20 4c-2 4-5 7-9 9" strokeDasharray="2 2" />
      <path d="m13 15 2 2-1 3" />
    </svg>
  ),
  akcesoria: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <rect x="10.5" y="11" width="3" height="3" rx="0.5" />
    </svg>
  ),
};

const defaultCategories = [
  { id: 1, name: 'Wędki', slug: 'wedki' },
  { id: 2, name: 'Kołowrotki', slug: 'kolowrotki' },
  { id: 3, name: 'Przynęty', slug: 'przynety' },
  { id: 4, name: 'Zanęty', slug: 'zanety' },
  { id: 5, name: 'Haczyki', slug: 'haczyki' },
  { id: 6, name: 'Żyłki i plecionki', slug: 'zylki-i-plecionki' },
  { id: 7, name: 'Feeder', slug: 'feeder' },
  { id: 8, name: 'Karpiowe', slug: 'karpiowe' },
  { id: 9, name: 'Spinning', slug: 'spinning' },
  { id: 10, name: 'Akcesoria', slug: 'akcesoria' },
];

export default function CategoryTiles({ categories = defaultCategories }) {
  return (
    <section className={styles.section} id="kategorie">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Kategorie produktów</h2>
          <p className={styles.subtitle}>Przejrzyj nasz asortyment według kategorii</p>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/katalog?kategoria=${cat.slug}`} className={styles.tile}>
              <span className={styles.tileIcon} aria-hidden="true">
                {categoryIcons[cat.slug] || (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </span>
              <span className={styles.tileName}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
