export const metadata = {
  title: 'O sklepie',
  description: 'CAMO – lokalny sklep strzelecko-wędkarski w okolicach Buska-Zdroju. Szeroki wybór sprzętu wędkarskiego i fachowe doradztwo.',
};

export default function OSklepiePage() {
  return (
    <div className="page-content">
      <h1 className="page-title">O sklepie</h1>
      <div className="page-text">
        <p>
          CAMO to lokalny sklep wędkarski w okolicach Buska-Zdroju. Oferujemy
          szeroki wybór sprzętu, przynęt i akcesoriów wędkarskich.
        </p>
        <p>
          Jeśli potrzebujesz pomocy w wyborze sprzętu, zapraszamy do kontaktu
          lub odwiedzin w sklepie. Chętnie doradzimy i pomożemy dobrać odpowiedni
          sprzęt do Twoich potrzeb.
        </p>
      </div>

      <div style={{ margin: 'var(--space-8) 0', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
        <img
          src="/images/sklep-camo.jpg"
          alt="Budynek sklepu CAMO – Siesławice 229D, Busko-Zdrój"
          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div style={{ marginTop: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-4)' }}>
          Dane kontaktowe
        </h2>
        <div className="page-text">
          <p>
            <strong>Adres:</strong><br />
            Siesławice 229D<br />
            28-100 Busko-Zdrój
          </p>
          <p>
            <strong>Telefon:</strong><br />
            <a href="tel:+48798025026" style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              +48 798 025 026
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
