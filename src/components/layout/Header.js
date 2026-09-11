'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: 'Strona glowna' },
  { href: '/aktualnosci', label: 'Aktualnosci' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/kategorie', label: 'Kategorie' },
  { href: '/o-sklepie', label: 'O sklepie' },
  { href: '/kontakt', label: 'Kontakt' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className={styles.header} id="main-header">
      <div className={styles.headerInner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="CAMO - Strona glowna">
          <img src="/images/logo.png" alt="CAMO" className={styles.logoImg} />
          <span className={styles.logoText}>
            <span className={styles.logoName}>CAMO</span>
            <span className={styles.logoSubtitle}>Sklep strzelecko-wedkarski</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Nawigacja glowna">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/katalog" className={styles.searchBtn} aria-label="Szukaj produktu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Zamknij menu' : 'Otworz menu'}
            aria-expanded={mobileOpen}
          >
            <span className={styles.hamburgerIcon}>
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <nav
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}
        aria-label="Menu mobilne"
      >
        <div className={styles.mobileMenuHeader}>
          <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
            <img src="/images/logo.png" alt="CAMO" className={styles.logoImg} />
            <span className={styles.logoText}>
              <span className={styles.logoName}>CAMO</span>
              <span className={styles.logoSubtitle}>Sklep strzelecko-wedkarski</span>
            </span>
          </Link>
          <button className={styles.mobileMenuClose} onClick={() => setMobileOpen(false)} aria-label="Zamknij menu">
            &times;
          </button>
        </div>

        <div className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.mobileNavLinkActive : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/regulamin"
            className={`${styles.mobileNavLink} ${isActive('/regulamin') ? styles.mobileNavLinkActive : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Regulamin
          </Link>
        </div>

        <div className={styles.mobileContact}>
          <p className={styles.mobileContactLabel}>Kontakt</p>
          <a href="tel:+48798025026" className={styles.mobilePhone}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            +48 798 025 026
          </a>
        </div>
      </nav>
    </header>
  );
}
