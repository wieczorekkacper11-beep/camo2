'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './ProductList.module.css';

export default function ProductList({ initialProducts = [], categories = [] }) {
  const [productsList, setProductsList] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Modal usuwania
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtrowanie produktów
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchName = p.name?.toLowerCase().includes(query);
        const matchMan = p.manufacturer?.toLowerCase().includes(query);
        const matchCat = p.categoryName?.toLowerCase().includes(query);
        if (!matchName && !matchMan && !matchCat) return false;
      }

      if (categoryFilter) {
        if (String(p.categoryId) !== String(categoryFilter)) return false;
      }

      if (availabilityFilter) {
        if (p.availability !== availabilityFilter) return false;
      }

      return true;
    });
  }, [productsList, search, categoryFilter, availabilityFilter]);

  // Szybka zmiana dostępności bezpośrednio z listy
  const handleAvailabilityChange = async (productId, newStatus) => {
    setUpdatingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newStatus }),
      });

      if (res.ok) {
        setProductsList((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, availability: newStatus } : item
          )
        );
      }
    } catch (err) {
      console.error('Błąd zmiany dostępności:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Potwierdzenie i usunięcie produktu
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProductsList((prev) =>
          prev.filter((p) => p.id !== deletingProduct.id)
        );
        setDeletingProduct(null);
      } else {
        alert('Nie udało się usunąć produktu.');
      }
    } catch (err) {
      console.error('Błąd usuwania produktu:', err);
      alert('Wystąpił błąd podczas usuwania produktu.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return styles.statusAvailable;
      case 'low':
        return styles.statusLow;
      case 'unavailable':
        return styles.statusUnavailable;
      case 'on_order':
        return styles.statusOnOrder;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      {/* Nagłówek strony */}
      <div className={styles.topHeader}>
        <div>
          <h1 className={styles.pageTitle}>Zarządzanie produktami</h1>
          <p className={styles.pageSubtitle}>
            Przeglądaj, edytuj i dodawaj asortyment sklepu CAMO
          </p>
        </div>

        <Link href="/admin/produkty/nowy" className={styles.addBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>+ Dodaj produkt</span>
        </Link>
      </div>

      {/* Pasek wyszukiwania i filtrów */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Szukaj produktu (np. Shimano, wędka, mikado)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Wszystkie kategorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
        >
          <option value="">Wszystkie dostępności</option>
          <option value="available">Dostępny</option>
          <option value="low">Mała ilość</option>
          <option value="unavailable">Brak</option>
          <option value="on_order">Na zamówienie</option>
        </select>

        <div className={styles.countInfo}>
          Pokazano: <strong>{filteredProducts.length}</strong> z {productsList.length}
        </div>
      </div>

      {/* Tabela Desktop */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: '64px' }}>Zdjęcie</th>
              <th className={styles.th}>Nazwa produktu</th>
              <th className={styles.th}>Kategoria</th>
              <th className={styles.th}>Producent</th>
              <th className={styles.th}>Cena</th>
              <th className={styles.th}>Dostępność</th>
              <th className={styles.th} style={{ width: '150px' }}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Brak produktów spełniających podane kryteria wyszukiwania.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const priceLabel =
                  product.price !== null && product.price !== undefined
                    ? `${Number(product.price).toFixed(2).replace('.', ',')} zł`
                    : null;

                return (
                  <tr key={product.id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.productThumb}>
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <span>🐟</span>
                        )}
                      </div>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.productNameCell}>
                        <span className={styles.productName}>{product.name}</span>
                        {product.isFeatured ? (
                          <span className={styles.featuredTag}>★ Polecany</span>
                        ) : null}
                      </div>
                    </td>

                    <td className={styles.td}>
                      <span className={styles.categoryCell}>
                        {product.categoryName || 'Brak'}
                      </span>
                    </td>

                    <td className={styles.td}>
                      {product.manufacturer || '—'}
                    </td>

                    <td className={styles.td}>
                      {priceLabel ? (
                        <span className={styles.priceText}>{priceLabel}</span>
                      ) : (
                        <span className={styles.priceNote}>Cena w sklepie</span>
                      )}
                    </td>

                    <td className={styles.td}>
                      <select
                        className={`${styles.statusSelect} ${getStatusClass(
                          product.availability
                        )}`}
                        value={product.availability || 'available'}
                        onChange={(e) =>
                          handleAvailabilityChange(product.id, e.target.value)
                        }
                        disabled={updatingId === product.id}
                        title="Kliknij, aby szybko zmienić status"
                      >
                        <option value="available">✓ Dostępny</option>
                        <option value="low">⚠ Mała ilość</option>
                        <option value="unavailable">✕ Brak</option>
                        <option value="on_order">📦 Na zamówienie</option>
                      </select>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Link
                          href={`/admin/produkty/${product.id}`}
                          className={styles.editBtn}
                        >
                          Edytuj
                        </Link>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setDeletingProduct(product)}
                        >
                          Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Lista Mobilna (karty zamiast tabeli) */}
      <div className={styles.mobileList}>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            Brak produktów spełniających podane kryteria.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const priceLabel =
              product.price !== null && product.price !== undefined
                ? `${Number(product.price).toFixed(2).replace('.', ',')} zł`
                : 'Cena w sklepie';

            return (
              <div key={product.id} className={styles.mobileCard}>
                <div className={styles.mobileCardTop}>
                  <div className={styles.productThumb}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <span>🐟</span>
                    )}
                  </div>
                  <div className={styles.mobileCardInfo}>
                    <span className={styles.mobileCardName}>{product.name}</span>
                    <span className={styles.mobileCardMeta}>
                      {product.categoryName || 'Brak kategorii'}
                      {product.manufacturer ? ` • ${product.manufacturer}` : ''}
                    </span>
                    {product.isFeatured ? (
                      <span className={styles.featuredTag}>★ Polecany</span>
                    ) : null}
                  </div>
                </div>

                <div className={styles.mobileCardMiddle}>
                  <span className={styles.priceText}>{priceLabel}</span>
                  <select
                    className={`${styles.statusSelect} ${getStatusClass(
                      product.availability
                    )}`}
                    value={product.availability || 'available'}
                    onChange={(e) =>
                      handleAvailabilityChange(product.id, e.target.value)
                    }
                    disabled={updatingId === product.id}
                  >
                    <option value="available">✓ Dostępny</option>
                    <option value="low">⚠ Mała ilość</option>
                    <option value="unavailable">✕ Brak</option>
                    <option value="on_order">📦 Na zamówienie</option>
                  </select>
                </div>

                <div className={styles.mobileCardActions}>
                  <Link
                    href={`/admin/produkty/${product.id}`}
                    className={styles.editBtn}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Edytuj
                  </Link>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setDeletingProduct(product)}
                  >
                    Usuń
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Potwierdzenia Usunięcia Produktu */}
      {deletingProduct && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isDeleting && setDeletingProduct(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modalTitle"
          >
            <div className={styles.modalIcon}>⚠️</div>
            <h3 id="modalTitle" className={styles.modalTitle}>
              Czy na pewno chcesz usunąć ten produkt?
            </h3>
            <div className={styles.modalTarget}>
              {deletingProduct.name}
            </div>
            <p className={styles.modalWarning}>
              Tej operacji nie można cofnąć. Produkt zniknie z katalogu i bazy danych sklepu.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelModalBtn}
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
              >
                Anuluj
              </button>
              <button
                type="button"
                className={styles.confirmDeleteBtn}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Usuwanie...' : 'Usuń produkt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
