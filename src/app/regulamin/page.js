export const metadata = {
  title: 'Regulamin',
  description: 'Regulamin i informacje dotyczące katalogu produktów sklepu CAMO.',
};

export default function RegulaminPage() {
  return (
    <div className="page-content">
      <h1 className="page-title">Regulamin i informacje</h1>
      <div className="page-text">
        <p>
          Niniejsza strona internetowa prezentuje aktualny asortyment sklepu
          CAMO – Sklep Strzelecko-Wędkarski z siedzibą w Siesławicach 229D,
          28-100 Busko-Zdrój.
        </p>

        <h2 style={{ fontSize: 'var(--font-size-xl)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>
          Informacje ogólne
        </h2>

        <ul style={{ paddingLeft: 'var(--space-5)', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <li>Strona prezentuje aktualny asortyment sklepu.</li>
          <li>Dostępność produktów może zmieniać się na bieżąco.</li>
          <li>Obecność produktu na stronie nie stanowi rezerwacji.</li>
          <li>Ceny, jeśli są prezentowane, mają charakter informacyjny.</li>
          <li>W przypadku wątpliwości dotyczących dostępności produktu należy skontaktować się ze sklepem.</li>
          <li>Produkty można obejrzeć i kupić bezpośrednio w sklepie.</li>
          <li>Informacje na stronie mogą być aktualizowane.</li>
        </ul>

        <h2 style={{ fontSize: 'var(--font-size-xl)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>
          Kontakt
        </h2>

        <p>
          W razie pytań prosimy o kontakt telefoniczny:{' '}
          <a href="tel:+48798025026" style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>
            +48 798 025 026
          </a>
          <br />
          lub odwiedziny w sklepie: Siesławice 229D, 28-100 Busko-Zdrój.
        </p>
      </div>
    </div>
  );
}
