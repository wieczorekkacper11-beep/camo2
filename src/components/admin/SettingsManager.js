'use client';

import { useState } from 'react';
import styles from './SettingsManager.module.css';

export default function SettingsManager({ initialSettings = {} }) {
  // Store Settings state
  const [settings, setSettings] = useState({
    shop_name: initialSettings.shop_name || 'CAMO Sklep Strzelecko-Wędkarski',
    shop_phone: initialSettings.shop_phone || '+48 798 025 026',
    shop_address: initialSettings.shop_address || 'Siesławice 229D, 28-100 Busko-Zdrój',
    shop_email: initialSettings.shop_email || 'kontakt@camo-sklep.pl',
    shop_description: initialSettings.shop_description || 'Sklep strzelecko-wędkarski w okolicach Buska-Zdroju. Szeroki wybór sprzętu, przynęt i akcesoriów wędkarskich.',
    shop_hours_weekdays: initialSettings.shop_hours_weekdays || 'Poniedziałek – Piątek: 8:00 – 17:00',
    shop_hours_saturday: initialSettings.shop_hours_saturday || 'Sobota: 8:00 – 14:00',
    shop_hours_sunday: initialSettings.shop_hours_sunday || 'Niedziela: Nieczynne',
    announcement_enabled: initialSettings.announcement_enabled === '1' || initialSettings.announcement_enabled === 'true',
    announcement_text: initialSettings.announcement_text || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Password Change state
  const [pwData, setPwData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(null);
  const [pwError, setPwError] = useState(null);

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);
    setIsSaving(true);

    try {
      const payload = {
        shop_name: settings.shop_name.trim(),
        shop_phone: settings.shop_phone.trim(),
        shop_address: settings.shop_address.trim(),
        shop_email: settings.shop_email.trim(),
        shop_description: settings.shop_description.trim(),
        shop_hours_weekdays: settings.shop_hours_weekdays.trim(),
        shop_hours_saturday: settings.shop_hours_saturday.trim(),
        shop_hours_sunday: settings.shop_hours_sunday.trim(),
        announcement_enabled: settings.announcement_enabled ? '1' : '0',
        announcement_text: settings.announcement_text.trim(),
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Nie udało się zapisać ustawień.');
      }

      setSaveSuccess('Ustawienia sklepu zostały pomyślnie zaktualizowane!');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      setSaveError(err.message || 'Wystąpił błąd podczas zapisywania.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!pwData.currentPassword) {
      setPwError('Podaj obecne hasło.');
      return;
    }

    if (pwData.newPassword.length < 6) {
      setPwError('Nowe hasło musi mieć co najmniej 6 znaków.');
      return;
    }

    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwError('Nowe hasła nie są identyczne.');
      return;
    }

    setIsChangingPw(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: pwData.currentPassword,
          newPassword: pwData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Nie udało się zmienić hasła.');
      }

      setPwSuccess('Hasło zostało pomyślnie zmienione!');
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(null), 4000);
    } catch (err) {
      setPwError(err.message || 'Błąd podczas zmiany hasła.');
    } finally {
      setIsChangingPw(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ustawienia sklepu</h1>
        <p className={styles.subtitle}>
          Dostosuj dane kontaktowe, godziny otwarcia, ogłoszenia oraz bezpieczeństwo
        </p>
      </div>

      {saveError && <div className={styles.alertError}>⚠️ {saveError}</div>}
      {saveSuccess && <div className={styles.alertSuccess}>✓ {saveSuccess}</div>}

      <form onSubmit={handleSaveSettings}>
        {/* Karta 1: Dane kontaktowe */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardIcon}>📍</span>
            Dane teleadresowe sklepu
          </h2>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nazwa sklepu</label>
              <input
                type="text"
                name="shop_name"
                className={styles.input}
                value={settings.shop_name}
                onChange={handleSettingsChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Numer telefonu</label>
              <input
                type="text"
                name="shop_phone"
                className={styles.input}
                value={settings.shop_phone}
                onChange={handleSettingsChange}
                placeholder="+48 798 025 026"
                required
              />
            </div>
          </div>

          <div className={styles.grid2} style={{ marginTop: '16px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Adres sklepu</label>
              <input
                type="text"
                name="shop_address"
                className={styles.input}
                value={settings.shop_address}
                onChange={handleSettingsChange}
                placeholder="Siesławice 229D, 28-100 Busko-Zdrój"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Adres e-mail</label>
              <input
                type="email"
                name="shop_email"
                className={styles.input}
                value={settings.shop_email}
                onChange={handleSettingsChange}
                placeholder="kontakt@camo-sklep.pl"
              />
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginTop: '16px' }}>
            <label className={styles.label}>Krótki opis o sklepie (stopka)</label>
            <textarea
              name="shop_description"
              className={styles.textarea}
              value={settings.shop_description}
              onChange={handleSettingsChange}
            />
          </div>
        </div>

        {/* Karta 2: Godziny otwarcia */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardIcon}>🕒</span>
            Godziny otwarcia sklepu stacjonarnego
          </h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Dni powszednie (Poniedziałek – Piątek)</label>
            <input
              type="text"
              name="shop_hours_weekdays"
              className={styles.input}
              value={settings.shop_hours_weekdays}
              onChange={handleSettingsChange}
              placeholder="Poniedziałek – Piątek: 8:00 – 17:00"
            />
          </div>

          <div className={styles.grid2} style={{ marginTop: '16px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Soboty</label>
              <input
                type="text"
                name="shop_hours_saturday"
                className={styles.input}
                value={settings.shop_hours_saturday}
                onChange={handleSettingsChange}
                placeholder="Sobota: 8:00 – 14:00"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Niedziele i święta</label>
              <input
                type="text"
                name="shop_hours_sunday"
                className={styles.input}
                value={settings.shop_hours_sunday}
                onChange={handleSettingsChange}
                placeholder="Niedziela: Nieczynne"
              />
            </div>
          </div>
        </div>

        {/* Karta 3: Pasek ogłoszeń na stronie */}
        <div className={styles.sectionCard}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardIcon}>📢</span>
            Pasek ogłoszeń / komunikat dla klientów
          </h2>

          <label className={styles.switchGroup}>
            <input
              type="checkbox"
              name="announcement_enabled"
              className={styles.checkbox}
              checked={settings.announcement_enabled}
              onChange={handleSettingsChange}
            />
            <span className={styles.switchLabel}>
              Włącz pasek informacyjny na samej górze strony
            </span>
          </label>

          <div className={styles.formGroup}>
            <label className={styles.label}>Treść komunikatu</label>
            <input
              type="text"
              name="announcement_text"
              className={styles.input}
              value={settings.announcement_text}
              onChange={handleSettingsChange}
              placeholder="np. 🎣 Świeże robaki i zanęty już dostępne przed weekendem! Zapraszamy."
            />
            <span className={styles.hint}>
              Komunikat ten będzie widoczny dla wszystkich odwiedzających stronę główną i katalog.
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {isSaving ? 'Zapisywanie...' : 'Zapisz ustawienia sklepu'}
          </button>
        </div>
      </form>

      {/* Karta 4: Zmiana hasła administratora */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardIcon}>🔒</span>
          Bezpieczeństwo — zmiana hasła administratora
        </h2>

        {pwError && <div className={styles.alertError}>⚠️ {pwError}</div>}
        {pwSuccess && <div className={styles.alertSuccess}>✓ {pwSuccess}</div>}

        <form onSubmit={handleChangePassword}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Aktualne hasło</label>
            <input
              type="password"
              className={styles.input}
              value={pwData.currentPassword}
              onChange={(e) => setPwData({ ...pwData, currentPassword: e.target.value })}
              placeholder="Wpisz bieżące hasło"
              required
            />
          </div>

          <div className={styles.grid2} style={{ marginTop: '16px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nowe hasło</label>
              <input
                type="password"
                className={styles.input}
                value={pwData.newPassword}
                onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                placeholder="Minimum 6 znaków"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Powtórz nowe hasło</label>
              <input
                type="password"
                className={styles.input}
                value={pwData.confirmPassword}
                onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
                placeholder="Powtórz nowe hasło"
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button type="submit" className={styles.pwBtn} disabled={isChangingPw}>
              {isChangingPw ? 'Zmienianie...' : 'Zmień hasło'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
