/**
 * Seed danych demonstracyjnych dla sklepu CAMO.
 * 
 * UWAGA: Produkty poniżej to DANE DEMONSTRACYJNE.
 * Nie przedstawiają faktycznego aktualnego asortymentu sklepu CAMO.
 * Służą do testowania i prezentacji działania katalogu.
 */

import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', '..', 'camo.db');
const fileUrl = `file:${dbPath.replace(/\\/g, '/')}`;

const client = createClient({ url: fileUrl });

async function seed() {
  console.log('--- Rozpoczynanie seedowania bazy CAMO (dane demonstracyjne) ---');

  // Tworzenie tabel
  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      category_id INTEGER REFERENCES categories(id),
      manufacturer TEXT,
      price REAL,
      availability TEXT DEFAULT 'available',
      quantity INTEGER,
      quantity_label TEXT,
      image_url TEXT,
      is_featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Czyszczenie poprzednich danych
  await client.execute('DELETE FROM products');
  await client.execute('DELETE FROM categories');
  await client.execute('DELETE FROM settings');

  // Kategorie
  const categoriesData = [
    { name: 'Wędki', slug: 'wedki', sort_order: 1, image_url: '/images/categories/wedki.jpg' },
    { name: 'Kołowrotki', slug: 'kolowrotki', sort_order: 2, image_url: '/images/categories/kolowrotki.jpg' },
    { name: 'Przynęty', slug: 'przynety', sort_order: 3, image_url: '/images/categories/przynety.jpg' },
    { name: 'Zanęty', slug: 'zanety', sort_order: 4, image_url: '/images/categories/zanety.jpg' },
    { name: 'Haczyki i akcesoria', slug: 'haczyki', sort_order: 5, image_url: '/images/categories/haczyki.jpg' },
    { name: 'Żyłki i plecionki', slug: 'zylki-i-plecionki', sort_order: 6, image_url: '/images/categories/zylki.jpg' },
    { name: 'Feeder / Method', slug: 'feeder', sort_order: 7, image_url: '/images/categories/feeder.jpg' },
    { name: 'Karpiowe', slug: 'karpiowe', sort_order: 8, image_url: '/images/categories/karpiowe.jpg' },
    { name: 'Spinning', slug: 'spinning', sort_order: 9, image_url: '/images/categories/spinning.jpg' },
    { name: 'Akcesoria i odzież', slug: 'akcesoria', sort_order: 10, image_url: '/images/categories/akcesoria.jpg' },
  ];

  for (const cat of categoriesData) {
    await client.execute({
      sql: 'INSERT INTO categories (name, slug, sort_order, image_url) VALUES (?, ?, ?, ?)',
      args: [cat.name, cat.slug, cat.sort_order, cat.image_url],
    });
  }
  console.log(`✓ Dodano ${categoriesData.length} kategorii.`);

  // Pobranie id kategorii
  const catsRes = await client.execute('SELECT id, slug FROM categories');
  const catMap = {};
  for (const row of catsRes.rows) {
    catMap[row.slug] = row.id;
  }

  // Produkty demonstracyjne
  const productsData = [
    // Wędki
    {
      name: 'Wędka Shimano Catana EX Spinning 270 MH',
      slug: 'shimano-catana-ex-spinning-270-mh',
      description: 'Wszechstronne wędzisko spinningowe o legendarnej renomie. Wykonane z włókna węglowego XT40 z dodatkiem Geofibre. Doskonały wybór do połowu szczupaków i sandaczy na rzekach i jeziorach. Długość: 270 cm, c.w. 14-40g.',
      category_id: catMap['wedki'],
      manufacturer: 'Shimano',
      price: 199.00,
      availability: 'available',
      quantity: 6,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 1,
    },
    {
      name: 'Wędka Mikado Nihonto Red Cut Feeder 360',
      slug: 'mikado-nihonto-red-cut-feeder-360',
      description: 'Mocna i sprężysta wędka feederowa o długości 360 cm, ciężar wyrzutu do 120g. W zestawie 3 wymienne szczytówki o różnej czułości. Precyzyjne rzuty i wysoka dynamika blanku.',
      category_id: catMap['wedki'],
      manufacturer: 'Mikado',
      price: 249.00,
      availability: 'available',
      quantity: 4,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 1,
    },
    {
      name: 'Wędka Dragon Mega Baits Tele Spin 240',
      slug: 'dragon-mega-baits-tele-spin-240',
      description: 'Teleskopowa wędka spinningowa do szybkiego wypadu nad wodę. Niewielka długość transportowa (62 cm) pozwala zabrać ją wszędzie. Blank z kompozytu węglowego.',
      category_id: catMap['wedki'],
      manufacturer: 'Dragon',
      price: 89.00,
      availability: 'low',
      quantity: 2,
      quantity_label: 'mała ilość',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Wędka Karpiowa Daiwa Black Widow XT 12ft 3.00lb',
      slug: 'daiwa-black-widow-xt-12ft-3lb',
      description: 'Klasyk karpiowy o smukłym blanku z włókna węglowego HMC+. Płynna akcja paraboliczna, przelotki ze stali tytanowo-tlenkowej. Doskonały stosunek ceny do jakości.',
      category_id: catMap['karpiowe'],
      manufacturer: 'Daiwa',
      price: 219.00,
      availability: 'available',
      quantity: 5,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 1,
    },
    {
      name: 'Wędka Robinson Diaflex Perch Spin 210',
      slug: 'robinson-diaflex-perch-spin-210',
      description: 'Lekki kij okoniowy o wyjątkowej czułości. Wklejana szczytówka z pełnego węgla doskonale sygnalizuje nawet najdelikatniejsze brania mikroprzynęt.',
      category_id: catMap['spinning'],
      manufacturer: 'Robinson',
      price: null, // Test "Cena dostępna w sklepie"
      availability: 'available',
      quantity: 3,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },

    // Kołowrotki
    {
      name: 'Kołowrotek Shimano Sienna FG 2500',
      slug: 'kołowrotek-shimano-sienna-fg-2500',
      description: 'Niezawodny kołowrotek z przednim hamulcem, znany z bezawaryjnej pracy. Płynna przekładnia, aluminiowa szpula AR-C i precyzyjny nawój żyłki Varispeed.',
      category_id: catMap['kolowrotki'],
      manufacturer: 'Shimano',
      price: 159.00,
      availability: 'available',
      quantity: 8,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 1,
    },
    {
      name: 'Kołowrotek Daiwa Ninja LT 3000-C',
      slug: 'kołowrotek-daiwa-ninja-lt-3000-c',
      description: 'Flagowy model z serii Light & Tough. Wyjątkowo płynna praca przekładni Tough Digigear, hamulec ATD i ultralekki rotor Air Rotor. Waga tylko 250g.',
      category_id: catMap['kolowrotki'],
      manufacturer: 'Daiwa',
      price: 229.00,
      availability: 'available',
      quantity: 7,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 1,
    },
    {
      name: 'Kołowrotek Mikado Noctis LC Feeder 5000',
      slug: 'mikado-noctis-lc-feeder-5000',
      description: 'Kołowrotek z płytką szpulą typu Long Cast stworzony do metody feederowej. System wolnej oscylacji zapewnia idealne układanie żyłki i dalekie rzuty.',
      category_id: catMap['feeder'],
      manufacturer: 'Mikado',
      price: 185.00,
      availability: 'low',
      quantity: 1,
      quantity_label: 'mała ilość',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Kołowrotek Karpiowy Okuma Custom Black CB-60',
      slug: 'okuma-custom-black-cb-60',
      description: 'Dedykowany do wędkarstwa karpiowego kołowrotek z szybkim hamulcem Fast Progressive Drag i grafitowym korpusem odpornym na korozję. Zapasowa szpula w zestawie.',
      category_id: catMap['karpiowe'],
      manufacturer: 'Okuma',
      price: 289.00,
      availability: 'available',
      quantity: 4,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },

    // Przynęty
    {
      name: 'Rapala Original Floater 7cm – Silver',
      slug: 'rapala-original-floater-7cm-silver',
      description: 'Klasyczny, legendarny wobler z balsy. Pływający, pracujący tuż pod powierzchnią. Sprawdza się na wszystkie drapieżniki w polskich wodach.',
      category_id: catMap['przynety'],
      manufacturer: 'Rapala',
      price: 42.00,
      availability: 'available',
      quantity: 15,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 1,
    },
    {
      name: 'Przynęta gumowa Savage Gear Cannibal 10cm – Firetiger',
      slug: 'savage-gear-cannibal-10cm-firetiger',
      description: 'Jedna z najskuteczniejszych gum szczupakowo-sandaczowych. Unikalny kształt i dynamiczna akcja kopyta prowokują do ataku nawet ostrożne drapieżniki.',
      category_id: catMap['spinning'],
      manufacturer: 'Savage Gear',
      price: 5.50,
      availability: 'available',
      quantity: 50,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 1,
    },
    {
      name: 'Błystka obrotowa Mepps Aglia nr 3 – Złota',
      slug: 'mepps-aglia-nr3-gold',
      description: 'Oryginalna obrotówka Mepps produkowana we Francji. Precyzyjnie wyważone skrzydełko zaczyna wirować w ułamku sekundy po wpadnięciu do wody.',
      category_id: catMap['spinning'],
      manufacturer: 'Mepps',
      price: 17.50,
      availability: 'available',
      quantity: 20,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Wobler Salmo Hornet 4cm Sinking – Holo Oki',
      slug: 'salmo-hornet-4cm-sinking-holo-oki',
      description: 'Niezwykle agresywna praca o wysokiej częstotliwości. Jeden z najlepszych woblerów na klenie, jazie, okonie i pstrągi.',
      category_id: catMap['przynety'],
      manufacturer: 'Salmo',
      price: 34.00,
      availability: 'available',
      quantity: 12,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },

    // Zanęty
    {
      name: 'Zanęta Traper Gold Series Concours 1kg',
      slug: 'traper-gold-series-concours-1kg',
      description: 'Wyczynowa zanęta zawodnicza o drobnym uziarnieniu, bogata w pieczywo fluo i prażone ziarna. Przeznaczona na trudne wody i ostrożne ryby.',
      category_id: catMap['zanety'],
      manufacturer: 'Traper',
      price: 15.50,
      availability: 'available',
      quantity: 30,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Zanęta Lorpio Feeder Bream 2kg',
      slug: 'lorpio-feeder-bream-2kg',
      description: 'Słodka zanęta o zapachu karmelu i piernika, stworzona specjalnie do nęcenia dużych leszczy i krąpi w rzekach i zbiornikach zaporowych.',
      category_id: catMap['zanety'],
      manufacturer: 'Lorpio',
      price: 22.00,
      availability: 'available',
      quantity: 18,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Pellet Method Feeder Ringers Dark 2mm 900g',
      slug: 'ringers-dark-pellet-2mm-900g',
      description: 'Oryginalny angielski mikro-pellet method feeder. Po 2 minutach namaczania idealnie klei się w podajniku i szybko uwalnia na dnie łowiska.',
      category_id: catMap['feeder'],
      manufacturer: 'Ringers',
      price: 29.00,
      availability: 'low',
      quantity: 2,
      quantity_label: 'mała ilość',
      image_url: null,
      is_featured: 1,
    },
    {
      name: 'Kulki Proteinowe Dynamite Baits The Source 15mm 1kg',
      slug: 'dynamite-baits-the-source-15mm-1kg',
      description: 'Jedna z najbardziej utytułowanych przynęt karpiowych na świecie, stworzona wg receptury Terryego Hearna. Mączki rybne, robin red i przyprawy.',
      category_id: catMap['karpiowe'],
      manufacturer: 'Dynamite Baits',
      price: 49.00,
      availability: 'available',
      quantity: 8,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 1,
    },

    // Żyłki i plecionki
    {
      name: 'Plecionka Power Pro Hi-Vis Yellow 0.15mm 135m',
      slug: 'power-pro-hi-vis-yellow-015mm-135m',
      description: 'Amerykańska 4-splotowa plecionka z włókien Spectra. Niemal zerowa rozciągliwość, okrągły splot i wysoka odporność na przetarcia na kamieniach.',
      category_id: catMap['zylki-i-plecionki'],
      manufacturer: 'Power Pro',
      price: 79.00,
      availability: 'available',
      quantity: 10,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Żyłka Mikado Sensei Match 0.18mm 150m',
      slug: 'mikado-sensei-match-018mm-150m',
      description: 'Szybko tonąca żyłka zaprojektowana do metody odległościowej i feederowej. Czarna barwa świetnie maskuje ją na dnie.',
      category_id: catMap['zylki-i-plecionki'],
      manufacturer: 'Mikado',
      price: 16.00,
      availability: 'available',
      quantity: 25,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },

    // Haczyki i akcesoria
    {
      name: 'Haczyki Gamakatsu LS-2210B nr 10 (25 szt.)',
      slug: 'gamakatsu-ls-2210b-nr-10',
      description: 'Kute, niezwykle ostre haczyki z łopatką i zadziorem. Wykonane z wysokowęglowej stali japońskiej. Doskonałe na białą rybę i method feeder.',
      category_id: catMap['haczyki'],
      manufacturer: 'Gamakatsu',
      price: 14.50,
      availability: 'available',
      quantity: 35,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Haczyki Owner Pin Hook 50922 nr 8 (10 szt.)',
      slug: 'owner-pin-hook-50922-nr-8',
      description: 'Precyzyjnie ostrzone chemicznie haczyki Owner. Cienki drut nie kaleczy robaków, a łuk kolankowy pewnie trzyma rybę podczas holu.',
      category_id: catMap['haczyki'],
      manufacturer: 'Owner',
      price: 8.50,
      availability: 'available',
      quantity: 40,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Podajnik Method Feeder Preston ICS Dura Flat 30g',
      slug: 'preston-ics-dura-flat-method-feeder-30g',
      description: 'Innowacyjny system wymiennych podajników ICS. Pozwala błyskawicznie zmienić gramaturę koszyka bez demontażu całego zestawu.',
      category_id: catMap['feeder'],
      manufacturer: 'Preston Innovations',
      price: 19.90,
      availability: 'available',
      quantity: 14,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },

    // Akcesoria i odzież
    {
      name: 'Podbierak teleskopowy z siatką gumowaną Jaxon 200cm',
      slug: 'podbierak-teleskopowy-gumowany-jaxon-200cm',
      description: 'Lekki aluminiowy podbierak z szybkim zatrzaskiem. Gumowana siatka nie chłonie zapachów, szybko schnie i nie plącze haków.',
      category_id: catMap['akcesoria'],
      manufacturer: 'Jaxon',
      price: 69.00,
      availability: 'available',
      quantity: 5,
      quantity_label: 'dużo',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Krzesełko wędkarskie z oparciem Elektrostatyk F5R',
      slug: 'krzeselko-wedkarskie-elektrostatyk-f5r',
      description: 'Najpopularniejszy fotel wędkarski w Polsce. Regulowane nóżki z szerokimi stopkami na błoto, regulowane oparcie, mocna stalowa konstrukcja.',
      category_id: catMap['akcesoria'],
      manufacturer: 'Elektrostatyk',
      price: null, // Cena dostępna w sklepie
      availability: 'on_order',
      quantity: 0,
      quantity_label: 'na zamówienie',
      image_url: null,
      is_featured: 0,
    },
    {
      name: 'Skrzynka wędkarska Plano Guide Series 3-Tray',
      slug: 'skrzynka-wedkarska-plano-guide-series-3-tray',
      description: 'Wytrzymała trzypoziomowa skrzynka na akcesoria, haczyki i przynęty spinningowe. Mosiężne zawiasy i solidny zamek.',
      category_id: catMap['akcesoria'],
      manufacturer: 'Plano',
      price: 139.00,
      availability: 'unavailable',
      quantity: 0,
      quantity_label: 'brak',
      image_url: null,
      is_featured: 0,
    },
  ];

  for (const prod of productsData) {
    await client.execute({
      sql: `
        INSERT INTO products (
          name, slug, description, category_id, manufacturer,
          price, availability, quantity, quantity_label, image_url, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        prod.name,
        prod.slug,
        prod.description,
        prod.category_id,
        prod.manufacturer,
        prod.price,
        prod.availability,
        prod.quantity,
        prod.quantity_label,
        prod.image_url,
        prod.is_featured,
      ],
    });
  }
  console.log(`✓ Dodano ${productsData.length} produktów demonstracyjnych.`);

  // Ustawienia sklepu
  const settingsData = [
    { key: 'shop_name', value: 'CAMO Sklep Strzelecko-Wędkarski' },
    { key: 'shop_address', value: 'Siesławice 229D, 28-100 Busko-Zdrój' },
    { key: 'shop_phone', value: '+48 798 025 026' },
    { key: 'demo_data_notice', value: '1' },
  ];

  for (const s of settingsData) {
    await client.execute({
      sql: 'INSERT INTO settings (key, value) VALUES (?, ?)',
      args: [s.key, s.value],
    });
  }
  console.log('✓ Dodano bazowe ustawienia.');

  // Administrator
  await client.execute({
    sql: 'INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)',
    args: ['admin', 'b3a107aec4861c27e590cd5785d22dbb:5a750c136d7df32b0b88bc9bf40c11b9c9af63ca3049ab30dcab686f5c8b0948542bb5e6862c8c96bc097476fbdb2d31b514da5d95ffdaa0e1c882886edbd48e'],
  });
  console.log('✓ Dodano konto administratora (login: admin)');

  console.log('\n=============================================');
  console.log('  SEED ZAKOŃCZONY SUKCESEM!');
  console.log('  Baza danych: camo.db');
  console.log('  Wszystkie dane to DANE DEMONSTRACYJNE');
  console.log('=============================================\n');
}

seed().catch((err) => {
  console.error('Błąd podczas seedowania:', err);
  process.exit(1);
});
