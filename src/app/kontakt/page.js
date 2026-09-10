import styles from './kontakt.module.css';

export const metadata = {
  title: 'Kontakt',
  description: 'Skontaktuj się ze sklepem CAMO – Siesławice 229D, 28-100 Busko-Zdrój. Telefon: +48 798 025 026.',
};

export default function KontaktPage() {
  return (
    <div className={styles.contactPage}>
      <h1 className="page-title">Kontakt</h1>

      <div className={styles.contactGrid}>
        <div className={styles.contactInfo}>
          {/* Adres */}
          <div className={styles.contactCard}>
            <h2 className={styles.contactCardTitle}>
              <svg className={styles.contactCardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Adres
            </h2>
            <p className={styles.contactCardText}>
              Siesławice 229D<br />
              28-100 Busko-Zdrój
            </p>
            <div className={styles.contactActions}>
              <a
                href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B50.4479%2C20.7103"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Wyznacz trasę
              </a>
            </div>
          </div>

          {/* Telefon */}
          <div className={styles.contactCard}>
            <h2 className={styles.contactCardTitle}>
              <svg className={styles.contactCardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Telefon
            </h2>
            <p className={styles.contactCardText}>
              <a href="tel:+48798025026" className={styles.contactLink}>
                +48 798 025 026
              </a>
            </p>
            <div className={styles.contactActions}>
              <a href="tel:+48798025026" className="btn btn-dark btn-sm">
                Zadzwoń
              </a>
            </div>
          </div>

          {/* Godziny */}
          <div className={styles.contactCard}>
            <h2 className={styles.contactCardTitle}>
              <svg className={styles.contactCardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Godziny otwarcia
            </h2>
            <p className={styles.contactCardText}>
              Godziny otwarcia zostaną uzupełnione przez administratora sklepu.
            </p>
          </div>
        </div>

        {/* Mapa OpenStreetMap */}
        <div className={styles.mapWrap} id="mapa">
          <iframe
            title="Lokalizacja sklepu CAMO – OpenStreetMap"
            src="https://www.openstreetmap.org/export/embed.html?bbox=20.700%2C50.440%2C20.720%2C50.455&layer=mapnik&marker=50.4479%2C20.7103"
            loading="lazy"
            allowFullScreen=""
          />
        </div>
      </div>
    </div>
  );
}
