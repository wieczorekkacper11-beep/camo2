import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageViewTracker from '@/components/PageViewTracker';
import { getSettingsMap } from '@/lib/db/queries.js';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'CAMO - Sklep Strzelecko-Wedkarski | Busko-Zdrojewoj',
    template: '%s | CAMO Sklep Strzelecko-Wedkarski',
  },
  description:
    'CAMO - lokalny sklep strzelecko-wedkarski w okolicach Buska-Zdroju. Szeroki wybor wedek, kolowrotkow, przynety, zanety i akcesoriow. Sprawdz aktualny asortyment.',
  keywords: [
    'sklep wedkarski', 'Busko-Zdrojewoj', 'CAMO', 'wedki', 'kolowrotki',
    'przynety', 'zanety', 'akcesoria wedkarskie', 'Sieslawice',
    'sklep strzelecki',
  ],
  openGraph: {
    title: 'CAMO - Sklep Strzelecko-Wedkarski | Busko-Zdrojewoj',
    description: 'Lokalny sklep strzelecko-wedkarski w okolicach Buska-Zdroju.',
    type: 'website',
    locale: 'pl_PL',
  },
  icons: {
    icon: '/images/logo-icon.png',
    shortcut: '/images/logo-icon.png',
    apple: '/images/logo-icon.png',
  },
};

export default async function RootLayout({ children }) {
  const settings = await getSettingsMap();
  const showBanner =
    (settings.announcement_enabled === '1' || settings.announcement_enabled === 'true') &&
    settings.announcement_text;

  return (
    <html lang="pl" className={inter.variable}>
      <body>
        {/* Licznik odwiedzin (niewidoczny, uruchamia sie po stronie klienta) */}
        <PageViewTracker />

        {showBanner && (
          <div
            style={{
              background: 'linear-gradient(90deg, #D4A017, #f3cf65, #D4A017)',
              color: '#0d0d0d',
              padding: '8px 16px',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              zIndex: 100,
            }}
          >
            {settings.announcement_text}
          </div>
        )}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
