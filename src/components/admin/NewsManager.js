'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './NewsManager.module.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function NewsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', isPinned: false });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const showMsg = (text, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setForm(f => ({ ...f, imageUrl: data.url }));
        showMsg('Zdjecie wgrane!');
      } else {
        showMsg(data.error || 'Blad uploadu.', true);
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { showMsg('Podaj tytul!', true); return; }
    setSaving(true);
    try {
      const url = editId ? `/api/news/${editId}` : '/api/news';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(editId ? 'Zaktualizowano!' : 'Dodano aktualnosc!');
        setForm({ title: '', content: '', imageUrl: '', isPinned: false });
        setEditId(null);
        fetchPosts();
      } else {
        showMsg(data.error || 'Blad zapisu.', true);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditId(post.id);
    setForm({
      title: post.title || '',
      content: post.content || '',
      imageUrl: post.imageUrl || '',
      isPinned: !!post.isPinned,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Na pewno usunac ten wpis?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      showMsg('Usunieto!');
      fetchPosts();
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: '', content: '', imageUrl: '', isPinned: false });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span>📰</span> Aktualnosci i ogloszenia
        </h1>
        <p className={styles.subtitle}>Informuj klientow co nowego dotarlo do sklepu</p>
      </div>

      {msg && (
        <div className={`${styles.msg} ${msg.isError ? styles.msgError : styles.msgOk}`}>
          {msg.isError ? '⚠ ' : '✓ '}{msg.text}
        </div>
      )}

      {/* Formularz */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>
          {editId ? '✏️ Edytuj wpis' : '+ Nowy wpis'}
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Tytul *</label>
            <input
              className={styles.input}
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="np. Nowe wedki Shimano juz w sklepie!"
              maxLength={200}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tresc (opcjonalnie)</label>
            <textarea
              className={styles.textarea}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Krótki opis co nowego, godziny promocji itp..."
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Zdjecie</label>
            <div className={styles.imageRow}>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Podglad" className={styles.imagePreview} />
              )}
              <div className={styles.imageActions}>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? '⏳ Wgrywanie...' : '📷 Dodaj zdjecie'}
                </button>
                {form.imageUrl && (
                  <button
                    type="button"
                    className={styles.removeImgBtn}
                    onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}
                  >
                    ✕ Usun zdjecie
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <label className={styles.pinnedRow}>
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))}
            />
            <span>📌 Przypnij na gorze (wazne ogloszenie)</span>
          </label>

          <div className={styles.formActions}>
            {editId && (
              <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                Anuluj
              </button>
            )}
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Zapisywanie...' : editId ? 'Zapisz zmiany' : 'Dodaj wpis'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista postow */}
      <div className={styles.list}>
        {loading ? (
          <div className={styles.loading}>Ladowanie...</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <span>📭</span>
            <p>Brak aktualnosci. Dodaj pierwszy wpis powyzej!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className={`${styles.postCard} ${post.isPinned ? styles.pinned : ''}`}>
              {post.isPinned && <div className={styles.pinnedBadge}>📌 Przypiety</div>}
              <div className={styles.postInner}>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} className={styles.postImage} />
                )}
                <div className={styles.postBody}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  {post.content && <p className={styles.postContent}>{post.content}</p>}
                  <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
                </div>
                <div className={styles.postActions}>
                  <button className={styles.editBtn} onClick={() => handleEdit(post)}>Edytuj</button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? '...' : 'Usun'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
