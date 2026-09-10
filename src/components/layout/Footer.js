import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="main-footer">
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandLogo}>
              <img src="/images/logo.png" alt="CAMO" className={styles.brandImg} />
              <span className={styles.brandName}>CAMO</span>
            </div>
            <p className={styles.brandDesc}>
              Sklep strzelecko-wędkarski w okolicach Buska-Zdroju. Szeroki wybór sprzętu, przynęt i akcesoriów wędkarskich.
            </p>
          </div>

          {/* Asortyment */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Asortyment</h3>
            <div className={styles.columnLinks}>
              <Link href="/katalog" className={styles.columnLink}>Katalog produktów</Link>
              <Link href="/kategorie" className={styles.columnLink}>Kategorie</Link>
            </div>
          </div>

          {/* Informacje */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Informacje</h3>
            <div className={styles.columnLinks}>
              <Link href="/o-sklepie" className={styles.columnLink}>O sklepie</Link>
              <Link href="/kontakt" className={styles.columnLink}>Kontakt</Link>
              <Link href="/regulamin" className={styles.columnLink}>Regulamin</Link>
            </div>
          </div>

          {/* Kontakt */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Kontakt</h3>
            <div className={styles.columnLinks}>
              <div className={styles.contactItem}>
                <svg className={styles.contactIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Siesławice 229D<br />28-100 Busko-Zdrój</span>
              </div>
              <div className={styles.contactItem}>
                <svg className={styles.contactIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+48798025026" className={styles.contactLink}>+48 798 025 026</a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© {currentYear} CAMO – Sklep Strzelecko-Wędkarski</p>
          <div className={styles.bottomLinks}>
            <Link href="/regulamin" className={styles.bottomLink}>Regulamin</Link>
            <Link href="/kontakt" className={styles.bottomLink}>Kontakt</Link>
            <Link href="/admin/login" className={styles.bottomLink}>Panel administratora</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
