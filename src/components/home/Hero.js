import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      {/* Background image with real shop photo */}
      <div className={styles.heroBg} aria-hidden="true">
        <img src="/images/sklep-camo.jpg" alt="" />
      </div>

      {/* Dark overlay for text readability */}
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroMain}>
          <div className={styles.heroLabel}>
            <span className={styles.heroLabelDot} />
            Sklep stacjonarny
          </div>

          <h1 className={styles.heroTitle}>CAMO</h1>
          <p className={styles.heroSubtitle}>Sklep strzelecko-wędkarski</p>
          <p className={styles.heroLocation}>w okolicach Buska-Zdroju</p>
          <p className={styles.heroDesc}>
            Sprzęt, przynęty i akcesoria wędkarskie w jednym miejscu.
            Sprawdź nasz aktualny asortyment lub odwiedź nas osobiście.
          </p>

          <div className={styles.heroActions}>
            <Link href="/katalog" className="btn btn-primary btn-lg">
              Zobacz asortyment
            </Link>
            <Link href="/kontakt#mapa" className="btn btn-outline btn-lg">
              Jak dojechać
            </Link>
          </div>
        </div>

        <div className={styles.heroEmblemWrapper}>
          <img
            src="/images/logo.png"
            alt="CAMO – Sklep Strzelecko-Wędkarski"
            className={styles.heroEmblem}
          />
        </div>
      </div>

      {/* Yellow accent line */}
      <div className={styles.heroAccent} aria-hidden="true" />
    </section>
  );
}
