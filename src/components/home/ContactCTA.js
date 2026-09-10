import Link from 'next/link';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  return (
    <section className={styles.section} id="kontakt-cta">
      <div className={styles.inner}>
        <div className={styles.accent} aria-hidden="true" />
        <h2 className={styles.title}>Szukasz konkretnego produktu?</h2>
        <p className={styles.desc}>
          Sprawdź nasz asortyment lub skontaktuj się ze sklepem.
          Nasz asortyment jest szeroki, a dostępność produktów może się zmieniać.
        </p>
        <div className={styles.actions}>
          <Link href="/kontakt" className="btn btn-primary btn-lg">
            Skontaktuj się
          </Link>
          <a href="tel:+48798025026" className="btn btn-outline btn-lg">
            <span className={styles.phone}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Zadzwoń
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
