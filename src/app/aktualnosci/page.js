export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Aktualnosci | CAMO Sklep Strzelecko-Wedkarski',
  description: 'Najnowsze wiadomosci i aktualnosci ze sklepu CAMO w Busku-Zdroju.',
};

async function getNews() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

export default async function AktualnosciPage() {
  const posts = await getNews();

  return (
    <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>
          📰 Aktualnosci
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)', maxWidth: '640px' }}>
          Co nowego dotarlo do sklepu? Sprawdz najnowsze ogloszenia!
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
          <p style={{ fontSize: '1.1rem' }}>Brak aktualnosci. Zajrzyj pozniej!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '760px' }}>
          {posts.map(post => (
            <article key={post.id} style={{
              background: 'var(--color-surface)',
              border: post.isPinned
                ? '1px solid var(--color-primary)'
                : '1px solid var(--color-border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              {post.isPinned && (
                <div style={{
                  background: 'var(--color-primary)',
                  color: '#000',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '5px 16px',
                  letterSpacing: '0.05em',
                }}>
                  📌 WAZNE OGLOSZENIE
                </div>
              )}
              <div style={{
                display: 'flex',
                gap: '20px',
                padding: '20px',
                alignItems: 'flex-start',
              }}>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{
                      width: '120px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    margin: '0 0 8px',
                    lineHeight: 1.3,
                  }}>
                    {post.title}
                  </h2>
                  {post.content && (
                    <p style={{
                      color: 'var(--color-text-muted)',
                      margin: '0 0 10px',
                      lineHeight: 1.6,
                      fontSize: '0.95rem',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {post.content}
                    </p>
                  )}
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
