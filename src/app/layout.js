import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getSettingsMap } from '@/lib/db/queries.js';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'CAMO – Sklep Strzelecko-Wędkarski | Busko-Zdrój',
    template: '%s | CAMO Sklep Strzelecko-Wędkarski',
  },
  description:
    'CAMO – lokalny sklep strzelecko-wędkarski w okolicach Buska-Zdroju. Szeroki wybór wędek, kołowrotków, przynęt, zanęt i akcesoriów. Sprawdź aktualny asortyment.',
  keywords: [
    'sklep wędkarski', 'Busko-Zdrój', 'CAMO', 'wędki', 'kołowrotki',
    'przynęty', 'zanęty', 'akcesoria wędkarskie', 'Siesławice',
    'sklep strzelecki',
  ],
  openGraph: {
    title: 'CAMO – Sklep Strzelecko-Wędkarski | Busko-Zdrój',
    description: 'Lokalny sklep strzelecko-wędkarski w okolicach Buska-Zdroju. Sprzęt, przynęty i akcesoria w jednym miejscu.',
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
  const showBanner = (settings.announcement_enabled === '1' || settings.announcement_enabled === 'true') && settings.announcement_text;

  return (
    <html lang="pl" className={inter.variable}>
      <body>
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
