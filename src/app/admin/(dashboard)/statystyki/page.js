'use client';
import { useState, useEffect } from 'react';

export default function StatystykiPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/views')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
      Ladowanie statystyk...
    </div>
  );

  if (!data) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#f87171' }}>
      Blad ladowania danych
    </div>
  );

  const maxCount = Math.max(...(data.daily?.map(d => d.count) || [1]), 1);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📊</span> Statystyki odwiedzin
        </h1>
        <p style={{ color: '#888', margin: 0 }}>Liczba unikalnych odwiedzin strony CAMO</p>
      </div>

      {/* Karty glowne */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Dzisiaj', value: data.today, icon: '☀️', color: '#D4A017' },
          { label: 'Ten tydzien', value: data.week, icon: '📅', color: '#3b82f6' },
          { label: 'Ostatnie 30 dni', value: data.month, icon: '📆', color: '#8b5cf6' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px',
            padding: '24px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{card.icon}</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: card.color, lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '6px', fontWeight: 600 }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Wykres slupkowy - ostatnie 30 dni */}
      <div style={{
        background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px', padding: '24px'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 20px', color: '#D4A017' }}>
          Odwiedziny dzien po dniu (ostatnie 30 dni)
        </h2>
        {data.daily && data.daily.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px', overflowX: 'auto' }}>
            {data.daily.map(day => {
              const height = Math.max((day.count / maxCount) * 140, 4);
              const isToday = day.date === new Date().toISOString().slice(0, 10);
              return (
                <div key={day.date} title={`${day.date}: ${day.count} odwiedzin`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '1', minWidth: '20px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>{day.count}</div>
                  <div style={{
                    width: '100%', height: `${height}px`, borderRadius: '4px 4px 0 0',
                    background: isToday ? '#D4A017' : '#3b82f6',
                    transition: 'height 0.3s', minHeight: '4px'
                  }} />
                  <div style={{
                    fontSize: '0.6rem', color: isToday ? '#D4A017' : '#555',
                    writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap'
                  }}>
                    {day.date.slice(5)} {/* MM-DD */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            Brak danych. Odwiedziny pojawia sie tutaj automatycznie.
          </div>
        )}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.75rem', color: '#666' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#D4A017', borderRadius: '2px', display: 'inline-block' }} />
            Dzisiaj
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '2px', display: 'inline-block' }} />
            Poprzednie dni
          </span>
        </div>
      </div>

      <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '16px', textAlign: 'center' }}>
        * Kazda osoba liczona raz dziennie (na sesje przegladarki)
      </p>
    </div>
  );
}
