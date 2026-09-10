'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Nieprawidłowy login lub hasło.');
        setIsLoading(false);
        return;
      }

      // Przekierowanie do panelu administratora
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Nieprawidłowy login lub hasło.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/images/logo.png" alt="CAMO" className={styles.logoImg} />
          <h1 className={styles.brand}>CAMO</h1>
          <p className={styles.subtitle}>Panel administratora</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBox} role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Login
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Wprowadź login"
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Hasło
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wprowadź hasło"
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <div className={styles.backLink}>
          <Link href="/">← Powrót do strony sklepu CAMO</Link>
        </div>
      </div>
    </div>
  );
}
