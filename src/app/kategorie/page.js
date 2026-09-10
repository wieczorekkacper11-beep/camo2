export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getCategories } from '@/lib/db/queries.js';
import styles from './page.module.css';

export const metadata = {
  title: 'Kategorie produktów | CAMO Sklep Strzelecko-Wędkarski',
  description:
    'Przeglądaj wszystkie kategorie sprzętu wędkarskiego dostępne w sklepie CAMO w okolicach Buska-Zdroju. Wędki, kołowrotki, przynęty, zanęty, karpiowe i feeder.',
};

// static

const categoryMeta = {
  wedki: {
    desc: 'Spinningowe, feederowe, karpiowe, teleskopowe i bolonki od renomowanych producentów.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 2 20 20" />
        <path d="M5 2h4" />
        <path d="M19 16v4" />
      </svg>
    ),
  },
  kolowrotki: {
    desc: 'Kołowrotki ze szpulą stałą, wolnym biegiem, przednim i tylnym hamulcem.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v6" />
        <path d="M12 15v6" />
      </svg>
    ),
  },
  przynety: {
    desc: 'Woblery, błystki, gumy, rippery i twistery na wszystkie polskie drapieżniki.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c2.5 0 4.8-.9 6.6-2.4l-3.6-3.6" />
        <path d="M16 16c2.2-2.2 2.2-5.8 0-8s-5.8-2.2-8 0" />
      </svg>
    ),
  },
  zanety: {
    desc: 'Zanęty sypkie, pellety, boostery, aromaty i gotowane ziarna zanętowe.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 15 5 5 5-5" />
        <path d="m7 9 5-5 5 5" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  haczyki: {
    desc: 'Haczyki z łopatką, oczkiem, bezzadziorowe, kotwiczki i gotowe przypony.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2v8a6 6 0 0 1-12 0" />
        <circle cx="18" cy="2" r="1.5" />
      </svg>
    ),
  },
  'zylki-i-plecionki': {
    desc: 'Żyłki główne, przyponowe, plecionki 4- i 8-splotowe oraz fluorocarbon.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12c4-4 8 4 12 0s8 4 12 0" />
      </svg>
    ),
  },
  feeder: {
    desc: 'Wędziska method feeder, koszyki, formy do zanęty, podajniki ICS i szczytówki.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="18" x="5" y="3" rx="2" />
        <path d="M9 7h6" />
        <path d="M9 12h6" />
        <path d="M9 17h6" />
      </svg>
    ),
  },
  karpiowe: {
    desc: 'Kulki proteinowe, dipy, zestawy końcowe, podpórki, sygnalizatory i maty.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="m17 7-5-5-5 5" />
        <path d="M5 14h14" />
      </svg>
    ),
  },
  spinning: {
    desc: 'Sprzęt na szczupaka, sandacza, okonia, klenia i bolenia. Kije, główki, stalki.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12A10 10 0 1 1 12 2" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  akcesoria: {
    desc: 'Podbieraki, siatki, krzesełka, skrzynki, wagi, nożyczki, odzież i parasole.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="14" x="3" y="6" rx="2" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
};

export default async function KategoriePage() {
  const categories = await getCategories();

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kategorie produktów</h1>
        <p className={styles.subtitle}>
          Wybierz kategorię, aby zobaczyć aktualnie dostępny asortyment w naszym
          sklepie stacjonarnym CAMO w okolicach Buska-Zdroju.
        </p>
      </div>

      <div className={styles.grid}>
        {categories.map((category) => {
          const meta = categoryMeta[category.slug] || {
            desc: 'Sprawdź produkty z tej kategorii w sklepie CAMO.',
            icon: (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m10 15 5-3-5-3v6Z" />
              </svg>
            ),
          };

          const count = category.productCount || 0;
          const countLabel =
            count === 1
              ? '1 produkt'
              : count > 1 && count < 5
              ? `${count} produkty`
              : `${count} produktów`;

          return (
            <Link
              key={category.id}
              href={`/katalog?kategoria=${category.slug}`}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>{meta.icon}</div>
                <span className={styles.countBadge}>{countLabel}</span>
              </div>

              <h2 className={styles.categoryName}>{category.name}</h2>
              <p className={styles.categoryDesc}>{meta.desc}</p>

              <div className={styles.cardFooter}>
                <span>Przeglądaj asortyment</span>
                <span className={styles.arrow}>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
