import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileCard from '../components/FileCard';
import StorageBar from '../components/StorageBar';
import api from '../utils/api';
import { formatBytes } from '../utils/format';

const FILE_TYPES = ['all', 'image', 'video', 'audio', 'document', 'archive', 'other'];

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (filter !== 'all') params.set('type', filter);
      if (search) params.set('search', search);
      const res = await api.get(`/files/my?${params}`);
      setFiles(res.data.files);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [page, filter, search]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/user/stats');
      setStats(res.data);
    } catch {}
  };

  useEffect(() => { fetchFiles(); }, [fetchFiles]);
  useEffect(() => { fetchStats(); refreshUser(); }, []);

  const handleDelete = (id) => {
    setFiles(prev => prev.filter(f => f._id !== id));
    setTotal(prev => prev - 1);
    fetchStats();
    refreshUser();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFiles();
  };

  const statCards = stats ? [
    { label: 'Total Files', value: stats.totalFiles, icon: '📁', color: 'var(--accent)' },
    { label: 'Total Downloads', value: stats.totalDownloads, icon: '⬇️', color: 'var(--cyan)' },
    { label: 'Storage Used', value: formatBytes(stats.storageUsed), icon: '💾', color: 'var(--yellow)' },
    { label: 'Plan', value: user?.plan?.toUpperCase(), icon: '⭐', color: 'var(--green)' },
  ] : [];

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', padding: '36px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>
              Dashboard
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 15 }}>Welcome back, <span style={{ color: 'var(--accent)' }}>{user?.username}</span></p>
          </div>
          <Link to="/upload">
            <button style={{
              padding: '11px 22px',
              background: 'var(--accent)', border: 'none',
              borderRadius: 'var(--radius)', color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'var(--transition)', fontFamily: 'var(--font-display)',
            }}
              onMouseEnter={e => { e.target.style.background = 'var(--accent2)'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.background = 'var(--accent)'; e.target.style.transform = 'translateY(0)'; }}>
              + Upload File
            </button>
          </Link>
        </div>

        {/* Stats grid */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
            {statCards.map(s => (
              <div key={s.label} style={{
                padding: '18px 20px',
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', transition: 'var(--transition)',
                animation: 'fadeIn 0.4s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Storage bar */}
        {user && (
          <div style={{ padding: '18px 20px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 28 }}>
            <StorageBar used={user.storageUsed} limit={user.storageLimit} />
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search files…"
              style={{
                flex: 1, padding: '9px 14px',
                background: 'var(--bg3)', border: '1px solid var(--border2)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
            <button type="submit" style={{
              padding: '9px 16px', background: 'var(--accent)', border: 'none',
              borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 600,
              cursor: 'pointer', fontSize: 13,
            }}>Search</button>
          </form>

          {/* Type filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILE_TYPES.map(type => (
              <button key={type} onClick={() => { setFilter(type); setPage(1); }} style={{
                padding: '7px 13px',
                background: filter === type ? 'var(--accent)' : 'var(--bg3)',
                border: `1px solid ${filter === type ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 99, color: filter === type ? '#fff' : 'var(--text2)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                transition: 'var(--transition)', textTransform: 'capitalize',
              }}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Files count */}
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
          {loading ? 'Loading…' : `${total} file${total !== 1 ? 's' : ''}`}
        </div>

        {/* Files grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>No files yet</h3>
            <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Upload your first file to get started.</p>
            <Link to="/upload">
              <button style={{ padding: '11px 24px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                Upload Now →
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {files.map(f => <FileCard key={f._id} file={f} onDelete={handleDelete} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
              padding: '8px 16px', background: 'var(--bg3)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              color: page === 1 ? 'var(--text2)' : 'var(--text)',
              cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13,
            }}>← Prev</button>
            <span style={{ padding: '8px 16px', color: 'var(--text2)', fontSize: 13 }}>
              {page} / {pages}
            </span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{
              padding: '8px 16px', background: 'var(--bg3)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              color: page === pages ? 'var(--text2)' : 'var(--text)',
              cursor: page === pages ? 'not-allowed' : 'pointer', fontSize: 13,
            }}>Next →</button>
          </div>
        )}
      </div>
    </main>
  );
}
