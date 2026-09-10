'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './ProductForm.module.css';

const PRESET_IMAGES = [
  { label: 'Kołowrotek', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80' },
  { label: 'Wędka / Zestaw', url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop&q=80' },
  { label: 'Przynęty / Woblery', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
  { label: 'Żyłki / Plecionki', url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Akcesoria', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80' },
];

/**
 * Kompresja zdjęcia po stronie przeglądarki przed uploadem (np. z aparatu telefonu)
 */
function compressImage(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '') + '.jpg',
                { type: 'image/jpeg' }
              );
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ initialData = null, categories = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    categoryId: initialData?.categoryId !== null && initialData?.categoryId !== undefined ? String(initialData.categoryId) : '',
    manufacturer: initialData?.manufacturer || '',
    price: initialData?.price !== null && initialData?.price !== undefined ? String(initialData.price) : '',
    availability: initialData?.availability || 'available',
    quantity: initialData?.quantity !== null && initialData?.quantity !== undefined ? String(initialData.quantity) : '',
    quantityLabel: initialData?.quantityLabel || '',
    isFeatured: Boolean(initialData?.isFeatured),
    imageUrl: initialData?.imageUrl || '',
    description: initialData?.description || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'imageUrl') {
      setImgLoadError(false);
    }
  };

  const handleApplyPresetImage = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setImgLoadError(false);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Wybierz poprawny plik graficzny (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg(null);
    setIsUploading(true);
    setUploadStatusText('Optymalizuję zdjęcie z urządzenia...');

    try {
      // 1. Kompresja po stronie klienta (idealna na zdjęcia ze smartfona o wadze 10MB)
      const optimizedFile = await compressImage(file);

      setUploadStatusText('Wgrywam zdjęcie na serwer...');

      const uploadData = new FormData();
      uploadData.append('file', optimizedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Nie udało się wgrać zdjęcia.');
      }

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      setImgLoadError(false);
      setUploadStatusText('');
    } catch (err) {
      setErrorMsg(err.message || 'Wystąpił błąd podczas wgrywania pliku.');
      setUploadStatusText('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Nazwa produktu musi zawierać co najmniej 2 znaki.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : null,
        manufacturer: formData.manufacturer.trim() || null,
        price: formData.price !== '' ? parseFloat(formData.price) : null,
        availability: formData.availability,
        quantity: formData.quantity !== '' ? parseInt(formData.quantity, 10) : null,
        quantityLabel: formData.quantityLabel.trim() || null,
        isFeatured: Boolean(formData.isFeatured),
        imageUrl: formData.imageUrl.trim() || null,
        description: formData.description.trim() || null,
      };

      const url = isEdit ? `/api/products/${initialData.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || (data.errors ? data.errors.join(', ') : 'Nie udało się zapisać produktu.'));
      }

      setSuccessMsg(isEdit ? 'Zmiany zostały pomyślnie zapisane!' : 'Produkt został pomyślnie dodany do katalogu!');

      setTimeout(() => {
        router.push('/admin/produkty');
        router.refresh();
      }, 900);
    } catch (err) {
      setErrorMsg(err.message || 'Wystąpił błąd podczas zapisywania.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/products/${initialData.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Nie udało się usunąć produktu.');
      }

      setShowDeleteModal(false);
      router.push('/admin/produkty');
      router.refresh();
    } catch (err) {
      alert('Błąd usuwania produktu: ' + err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/produkty" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Powrót do listy produktów
        </Link>

        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>
              {isEdit ? `Edycja: ${initialData.name}` : 'Dodaj nowy produkt'}
            </h1>
            <p className={styles.subtitle}>
              {isEdit
                ? 'Zmień dane, cenę lub dostępność produktu w katalogu CAMO'
                : 'Wypełnij poniższe pola, aby dodać artykuł do oferty sklepu'}
            </p>
          </div>

          {isEdit && (
            <button
              type="button"
              className={styles.deleteBtnTop}
              onClick={() => setShowDeleteModal(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Usuń ten produkt
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className={styles.errorAlert}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className={styles.successAlert}>
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Karta 1: Podstawowe informacje */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardTitleIcon}>📌</span>
            Podstawowe dane produktu
          </h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nazwa produktu <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              className={styles.input}
              placeholder="np. Kołowrotek Shimano Sahara 4000 FI"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Kategoria</label>
              <select
                name="categoryId"
                className={styles.select}
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">-- Bez kategorii --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Producent / Marka</label>
              <input
                type="text"
                name="manufacturer"
                className={styles.input}
                placeholder="np. Shimano, Daiwa, Savage Gear"
                value={formData.manufacturer}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.grid2} style={{ marginTop: '16px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Cena detaliczna (PLN)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                className={styles.input}
                placeholder="np. 289.00 (puste = 'Cena w sklepie')"
                value={formData.price}
                onChange={handleChange}
              />
              <span className={styles.hint}>
                Zostaw puste pole, jeśli cena ma być sprawdzana na miejscu w sklepie.
              </span>
            </div>

            <div className={styles.formGroup} style={{ justifyContent: 'center' }}>
              <label className={styles.label}>Wyróżnienie na stronie głównej</label>
              <label className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  className={styles.checkbox}
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <span className={styles.checkboxLabel}>
                  ★ Oznacz jako produkt polecany (sekcja na stronie głównej)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Karta 2: Magazyn i Dostępność */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardTitleIcon}>📦</span>
            Dostępność i stan magazynowy
          </h2>

          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Status dostępności <span className={styles.required}>*</span>
              </label>
              <select
                name="availability"
                className={styles.select}
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="available">✓ Dostępny na stanie</option>
                <option value="low">⚠ Mała ilość (końcówka)</option>
                <option value="unavailable">✕ Chwilowy brak</option>
                <option value="on_order">📦 Na zamówienie</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Ilość w magazynie (szt.)</label>
              <input
                type="number"
                name="quantity"
                min="0"
                className={styles.input}
                placeholder="np. 5 (tylko do wglądu admina)"
                value={formData.quantity}
                onChange={handleChange}
              />
              <span className={styles.hint}>
                Widoczne wyłącznie w panelu administratora.
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Etykieta stanu dla klienta</label>
              <input
                type="text"
                name="quantityLabel"
                className={styles.input}
                placeholder="np. Ostatnie 2 szt., Dostępne od ręki"
                value={formData.quantityLabel}
                onChange={handleChange}
              />
              <span className={styles.hint}>
                Opcjonalny krótki dopisek przy produkcie.
              </span>
            </div>
          </div>
        </div>

        {/* Karta 3: Zdjęcie produktu */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardTitleIcon}>📷</span>
            Zdjęcie produktu (z telefonu, komputera lub link)
          </h2>

          {/* Strefa wgrywania z urządzenia */}
          <div
            className={`${styles.uploadSection} ${isDragOver ? styles.uploadSectionDragOver : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className={styles.hiddenFileInput}
              accept="image/*"
              onChange={handleFileInputChange}
            />

            <div className={styles.uploadIcon}>📸</div>

            {isUploading ? (
              <div className={styles.uploadProgress}>
                <span>⏳</span>
                <span>{uploadStatusText}</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.uploadBtnLabel}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Wybierz zdjęcie z telefonu lub komputera</span>
                </button>
                <span className={styles.hint}>
                  Na telefonie możesz zrobić zdjęcie aparatem lub wybrać z galerii (JPG, PNG, WEBP).
                </span>
              </>
            )}
          </div>

          <div className={styles.uploadOrDivider}>
            <span>lub podaj link URL</span>
          </div>

          <div className={styles.imagePreviewRow}>
            <div className={styles.imagePreviewBox}>
              {formData.imageUrl && !imgLoadError ? (
                <img
                  src={formData.imageUrl}
                  alt="Podgląd zdjęcia"
                  onError={() => setImgLoadError(true)}
                />
              ) : (
                <span className={styles.imagePlaceholder}>🐟</span>
              )}
            </div>

            <div className={styles.imageInputCol}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Adres URL zdjęcia</label>
                <input
                  type="text"
                  name="imageUrl"
                  className={styles.input}
                  placeholder="https://... lub /api/uploads/..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                {imgLoadError && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                    ⚠️ Nie udało się wczytać zdjęcia z podanego adresu.
                  </span>
                )}
              </div>

              <div>
                <div className={styles.quickPhotosTitle}>
                  Szybki wybór zdjęć gotowych:
                </div>
                <div className={styles.quickPhotosList}>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={styles.quickPhotoBtn}
                      onClick={() => handleApplyPresetImage(preset.url)}
                    >
                      + {preset.label}
                    </button>
                  ))}
                  {formData.imageUrl && (
                    <button
                      type="button"
                      className={styles.quickPhotoBtn}
                      style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      onClick={() => handleApplyPresetImage('')}
                    >
                      ✕ Usuń zdjęcie
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Karta 4: Opis */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardTitleIcon}>📝</span>
            Szczegółowy opis produktu
          </h2>

          <div className={styles.formGroup}>
            <textarea
              name="description"
              className={styles.textarea}
              placeholder="Wprowadź parametry wędki, kołowrotka, przełożenie, długość, zalecane techniki połowu..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsBar}>
          <Link href="/admin/produkty" className={styles.cancelBtn}>
            Anuluj
          </Link>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <span>Zapisywanie...</span>
              </>
            ) : (
              <>
                <span>{isEdit ? 'Zapisz zmiany' : 'Utwórz produkt'}</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal potwierdzenia usunięcia */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => !isDeleting && setShowDeleteModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Czy na pewno chcesz usunąć ten produkt?</h3>
            <p className={styles.modalWarning}>
              Produkt <strong>{initialData?.name}</strong> zostanie bezpowrotnie usunięty ze sklepu.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancelBtn}
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Anuluj
              </button>
              <button
                type="button"
                className={styles.modalConfirmBtn}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Usuwanie...' : 'Tak, usuń'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
