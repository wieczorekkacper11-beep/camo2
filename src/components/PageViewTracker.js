'use client';
import { useEffect } from 'react';

/**
 * Komponent zliczajacy odwiedziny strony.
 * Renderowany po stronie klienta - wysyla POST do /api/views przy kazdym wejsciu.
 */
export default function PageViewTracker() {
  useEffect(() => {
    const key = 'camo_view_counted_' + new Date().toISOString().slice(0, 10);
    if (sessionStorage.getItem(key)) return;

    fetch('/api/views', { method: 'POST' })
      .then(() => sessionStorage.setItem(key, '1'))
      .catch(() => {});
  }, []);

  return null;
}
