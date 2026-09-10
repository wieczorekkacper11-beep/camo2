'use client';

import { useState } from 'react';
import styles from './CategoryManager.module.css';

export default function CategoryManager({ initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');

  // Modals state
  const [editingCategory, setEditingCategory] = useState(null); // null or category object
  const [isAdding, setIsAdding] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSortOrder, setFormSortOrder] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormName('');
    setFormSlug('');
    setFormSortOrder('0');
    setFormError(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormSortOrder(String(cat.sortOrder || 0));
    setFormError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || formName.trim().length < 2) {
      setFormError('Nazwa kategorii musi mieć co najmniej 2 znaki.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Update
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            slug: formSlug.trim() || undefined,
            sortOrder: parseInt(formSortOrder, 10) || 0,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Nie udało się zaktualizować kategorii.');
        }

        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, ...data.data } : c))
        );
        setEditingCategory(null);
      } else {
        // Create
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            slug: formSlug.trim() || undefined,
            sortOrder: parseInt(formSortOrder, 10) || 0,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Nie udało się dodać kategorii.');
        }

        setCategories((prev) => [...prev, { ...data.data, productCount: 0 }]);
        setIsAdding(false);
      }
    } catch (err) {
      setFormError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Nie udało się usunąć kategorii.');
      }

      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setDeletingCategory(null);
    } catch (err) {
      alert('Błąd podczas usuwania: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Kategorie produktów</h1>
          <p className={styles.subtitle}>
            Zarządzaj działami sklepu wędkarskiego i kolejnością ich wyświetlania
          </p>
        </div>

        <button
          type="button"
          className={styles.addBtn}
          onClick={handleOpenAdd}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Dodaj kategorię
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Szukaj kategorii..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nazwa kategorii</th>
              <th className={styles.th}>Slug (URL)</th>
              <th className={styles.th}>Kolejność</th>
              <th className={styles.th}>Liczba produktów</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyState}>
                  Brak kategorii do wyświetlenia.
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr key={cat.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.catName}>{cat.name}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.catSlug}>/{cat.slug}</span>
                  </td>
                  <td className={styles.td}>
                    {cat.sortOrder !== undefined ? cat.sortOrder : 0}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.badgeCount}>
                      📦 {cat.productCount !== undefined ? cat.productCount : 0} szt.
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => handleOpenEdit(cat)}
                      >
                        Edytuj
                      </button>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => setDeletingCategory(cat)}
                      >
                        Usuń
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit */}
      {(isAdding || editingCategory) && (
        <div className={styles.modalOverlay} onClick={() => !isSubmitting && (setIsAdding(false), setEditingCategory(null))}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingCategory ? `Edytuj kategorię: ${editingCategory.name}` : 'Dodaj nową kategorię'}
            </h2>

            {formError && (
              <div className={styles.alertError} style={{ marginBottom: '16px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nazwa kategorii *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="np. Przynęty spinningowe"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Uproszczona nazwa URL (slug)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="pozostaw puste dla generowania automatycznego"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                />
                <span className={styles.hint}>
                  Np. &quot;przynety-spinningowe&quot;
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Kolejność wyświetlania</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(e.target.value)}
                />
                <span className={styles.hint}>
                  Mniejsza liczba = wyżej na liście w menu i na kafelkach
                </span>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => {
                    setIsAdding(false);
                    setEditingCategory(null);
                  }}
                  disabled={isSubmitting}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className={styles.modalSaveBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Zapisywanie...' : 'Zapisz kategorię'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {deletingCategory && (
        <div className={styles.modalOverlay} onClick={() => !isSubmitting && setDeletingCategory(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle} style={{ color: '#f87171' }}>
              Usuwanie kategorii
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Czy na pewno chcesz usunąć kategorię <strong>{deletingCategory.name}</strong>?
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 20px 0' }}>
              Produkty przypisane do tej kategorii nie zostaną usunięte — zostaną jedynie odpięte (będą widoczne jako bez kategorii).
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancelBtn}
                onClick={() => setDeletingCategory(null)}
                disabled={isSubmitting}
              >
                Anuluj
              </button>
              <button
                type="button"
                className={styles.modalDeleteBtn}
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Usuwanie...' : 'Usuń kategorię'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
