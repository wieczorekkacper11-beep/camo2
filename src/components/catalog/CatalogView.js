'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import styles from './CatalogView.module.css';

export default function CatalogView({
  initialProducts = [],
  categories = [],
  manufacturers = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialCategory = searchParams.get('kategoria') || searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || searchParams.get('szukaj') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync state if URL changes
  const [prevParams, setPrevParams] = useState(searchParams.toString());
  if (prevParams !== searchParams.toString()) {
    setPrevParams(searchParams.toString());
    const cat = searchParams.get('kategoria') || searchParams.get('category') || '';
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('q') || searchParams.get('szukaj') || '';
    if (q) setSearch(q);
  }

  // Client-side filtering and sorting for instant responsiveness
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search
        if (search.trim()) {
          const query = search.toLowerCase().trim();
          const matchName = product.name?.toLowerCase().includes(query);
          const matchDesc = product.description?.toLowerCase().includes(query);
          const matchMan = product.manufacturer?.toLowerCase().includes(query);
          const matchCat = product.categoryName?.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchMan && !matchCat) return false;
        }

        // Category
        if (selectedCategory) {
          const catMatch =
            product.categorySlug === selectedCategory ||
            String(product.categoryId) === String(selectedCategory);
          if (!catMatch) return false;
        }

        // Availability
        if (selectedAvailability) {
          if (product.availability !== selectedAvailability) return false;
        }

        // Manufacturer
        if (selectedManufacturer) {
          if (product.manufacturer !== selectedManufacturer) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name_asc':
            return a.name.localeCompare(b.name, 'pl');
          case 'name_desc':
            return b.name.localeCompare(a.name, 'pl');
          case 'price_asc':
            if (a.price === null && b.price === null) return 0;
            if (a.price === null) return 1;
            if (b.price === null) return -1;
            return a.price - b.price;
          case 'price_desc':
            if (a.price === null && b.price === null) return 0;
            if (a.price === null) return 1;
            if (b.price === null) return -1;
            return b.price - a.price;
          case 'newest':
          default:
            return b.id - a.id;
        }
      });
  }, [
    initialProducts,
    search,
    selectedCategory,
    selectedAvailability,
    selectedManufacturer,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedAvailability ? 1 : 0) +
    (selectedManufacturer ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedAvailability('');
    setSelectedManufacturer('');
    setSortBy('newest');
    router.replace('/katalog');
  };

  const handleCategoryClick = (slug) => {
    const next = selectedCategory === slug ? '' : slug;
    setSelectedCategory(next);
    if (next) {
      router.replace(`/katalog?kategoria=${next}`);
    } else {
      router.replace('/katalog');
    }
  };

  return (
    <div className={styles.catalogContainer}>
      {/* Informacyjny banner demonstracyjny */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <span className={styles.bannerIcon}>ℹ️</span>
          <div>
            <strong>Katalog stacjonarny CAMO Busko-Zdrój</strong> — prezentujemy
            asortyment dostępny na miejscu w sklepie. Poniższe produkty to dane
            demonstracyjne.
          </div>
        </div>
        <span className={styles.bannerTag}>Wersja demonstracyjna</span>
      </div>

      {/* Górny pasek: wyszukiwarka + sortowanie + przycisk mobilnego drawera */}
      <div className={styles.topBar}>
        <div className={styles.searchAndControls}>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Szukaj po nazwie, producencie, modelu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => setSearch('')}
                aria-label="Wyczyść wyszukiwanie"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className={styles.mobileFilterBtn}
            onClick={() => setIsMobileDrawerOpen(true)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="21" y2="21" />
              <line x1="4" x2="20" y1="14" y2="14" />
              <line x1="4" x2="20" y1="7" y2="7" />
              <circle cx="14" cy="21" r="2" />
              <circle cx="8" cy="14" r="2" />
              <circle cx="16" cy="7" r="2" />
            </svg>
            <span>Filtry</span>
            {activeFiltersCount > 0 && (
              <span className={styles.filterBadgeCount}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className={styles.sortSelectWrapper}>
            <label htmlFor="sortSelect" className={styles.sortLabel}>
              Sortuj:
            </label>
            <select
              id="sortSelect"
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Najnowsze</option>
              <option value="name_asc">Nazwa: A do Z</option>
              <option value="name_desc">Nazwa: Z do A</option>
              <option value="price_asc">Cena: od najniższej</option>
              <option value="price_desc">Cena: od najwyższej</option>
            </select>
          </div>
        </div>

        {/* Desktop pasek filtrów */}
        <div className={styles.desktopFilterBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Kategoria:</span>
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={(e) => handleCategoryClick(e.target.value)}
            >
              <option value="">Wszystkie kategorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} ({c.productCount || 0})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Dostępność:</span>
            <select
              className={styles.filterSelect}
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              <option value="">Wszystkie statusy</option>
              <option value="available">Dostępny</option>
              <option value="low">Mała ilość</option>
              <option value="on_order">Na zamówienie</option>
              <option value="unavailable">Niedostępny</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Producent:</span>
            <select
              className={styles.filterSelect}
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
            >
              <option value="">Wszyscy producenci</option>
              {manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleResetFilters}
            >
              Wyczyść filtry ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Szybkie chipy kategorii */}
        <div className={styles.categoryChips}>
          <button
            type="button"
            className={`${styles.categoryChip} ${
              !selectedCategory ? styles.categoryChipActive : ''
            }`}
            onClick={() => handleCategoryClick('')}
          >
            Wszystkie ({initialProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.categoryChip} ${
                selectedCategory === cat.slug ? styles.categoryChipActive : ''
              }`}
              onClick={() => handleCategoryClick(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Podsumowanie wyników */}
      <div className={styles.resultsMeta}>
        <div className={styles.resultsCount}>
          Znaleziono: <strong>{filteredProducts.length}</strong> produktów
          {selectedCategory && (
            <span>
              {' '}
              w kategorii{' '}
              <strong>
                {categories.find((c) => c.slug === selectedCategory)?.name ||
                  selectedCategory}
              </strong>
            </span>
          )}
        </div>
      </div>

      {/* Siatka produktów */}
      {filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>Brak wyników</h3>
          <p className={styles.emptyText}>
            Nie znaleźliśmy produktów odpowiadających wybranym kryteriom
            wyszukiwania lub filtrowania. Spróbuj zmienić zapytanie lub zresetować
            filtry.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleResetFilters}
          >
            Pokaż wszystkie produkty
          </button>
        </div>
      )}

      {/* Mobilny Drawer / Panel filtrów */}
      {isMobileDrawerOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Filtry produktów"
          >
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>Filtry i sortowanie</h3>
              <button
                type="button"
                className={styles.drawerClose}
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.drawerField}>
              <label htmlFor="drawerCat" className={styles.drawerLabel}>
                Kategoria
              </label>
              <select
                id="drawerCat"
                className={styles.drawerSelect}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Wszystkie kategorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.productCount || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.drawerField}>
              <label htmlFor="drawerAvail" className={styles.drawerLabel}>
                Dostępność
              </label>
              <select
                id="drawerAvail"
                className={styles.drawerSelect}
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
              >
                <option value="">Wszystkie statusy</option>
                <option value="available">Dostępny</option>
                <option value="low">Mała ilość</option>
                <option value="on_order">Na zamówienie</option>
                <option value="unavailable">Niedostępny</option>
              </select>
            </div>

            <div className={styles.drawerField}>
              <label htmlFor="drawerMan" className={styles.drawerLabel}>
                Producent
              </label>
              <select
                id="drawerMan"
                className={styles.drawerSelect}
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
              >
                <option value="">Wszyscy producenci</option>
                {manufacturers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.drawerField}>
              <label htmlFor="drawerSort" className={styles.drawerLabel}>
                Sortowanie
              </label>
              <select
                id="drawerSort"
                className={styles.drawerSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Najnowsze</option>
                <option value="name_asc">Nazwa: A do Z</option>
                <option value="name_desc">Nazwa: Z do A</option>
                <option value="price_asc">Cena: od najniższej</option>
                <option value="price_desc">Cena: od najwyższej</option>
              </select>
            </div>

            <div className={styles.drawerActions}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                Zastosuj ({filteredProducts.length})
              </button>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetFilters}
                >
                  Wyczyść
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
