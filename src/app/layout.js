import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
