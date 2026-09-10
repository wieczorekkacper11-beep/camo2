import { getSettingsMap } from '@/lib/db/queries.js';
import styles from './kontakt.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Kontakt | CAMO Sklep Strzelecko-Wędkarski',
  description: 'Skontaktuj się ze sklepem CAMO – Siesławice 229D, 28-100 Busko-Zdrój. Telefon: +48 798 025 026.',
};

export default async function KontaktPage() {
  const settings = await getSettingsMap();

  const address = settings.shop_address || 'Siesławice 229D, 28-100 Busko-Zdrój';
  const phone = settings.shop_phone || '+48 798 025 026';
  const email = settings.shop_email || 'kontakt@camo-sklep.pl';
  const hoursWeekdays = settings.shop_hours_weekdays || 'Poniedziałek – Piątek: 8:00 – 17:00';
  const hoursSaturday = settings.shop_hours_saturday || 'Sobota: 8:00 – 14:00';
  const hoursSunday = settings.shop_hours_sunday || 'Niedziela: Nieczynne';

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
              {address}
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
              Telefon &amp; E-mail
            </h2>
            <p className={styles.contactCardText}>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className={styles.contactLink}>
                {phone}
              </a>
              <br />
              <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{email}</span>
            </p>
            <div className={styles.contactActions}>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn btn-dark btn-sm">
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
            <div className={styles.contactCardText} style={{ lineHeight: '1.6' }}>
              <div>{hoursWeekdays}</div>
              <div>{hoursSaturday}</div>
              <div style={{ color: '#9ca3af' }}>{hoursSunday}</div>
            </div>
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
