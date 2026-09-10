import Link from 'next/link';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.section} id="o-sklepie">
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.label}>O sklepie</span>
          <h2 className={styles.title}>CAMO – Twój lokalny sklep wędkarski</h2>
          <p className={styles.text}>
            CAMO to lokalny sklep wędkarski w okolicach Buska-Zdroju. Oferujemy
            szeroki wybór sprzętu, przynęt i akcesoriów wędkarskich. Jeśli
            potrzebujesz pomocy w wyborze sprzętu, zapraszamy do kontaktu lub
            odwiedzin w sklepie.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎣</span>
              Szeroki wybór sprzętu wędkarskiego
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💬</span>
              Fachowe doradztwo
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📍</span>
              Wygodna lokalizacja
            </div>
          </div>

          <Link href="/o-sklepie" className="btn btn-dark">
            Więcej o sklepie
          </Link>
        </div>

        <div className={styles.imageWrap}>
          <div className={styles.imageCard}>
            <img
              src="/images/sklep-camo.jpg"
              alt="Sklep CAMO – Siesławice 229D, Busko-Zdrój"
              className={styles.shopImg}
            />
            <div className={styles.imageBadge}>
              <span className={styles.imageBadgeDot} />
              <span>Siesławice 229D, Busko-Zdrój</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
