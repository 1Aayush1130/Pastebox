import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import UploadZone from '../components/UploadZone';
import api from '../utils/api';
import { formatBytes, getFileIcon, getFileColor, copyToClipboard } from '../utils/format';

const EXPIRY_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [settings, setSettings] = useState({
    description: '', password: '', expiresIn: 'never',
    maxDownloads: '', isPublic: true, tags: '',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (f) => {
    setFile(f);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      Object.entries(settings).forEach(([k, v]) => { if (v) formData.append(k, v); });
      formData.set('isPublic', settings.isPublic);

      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setResult(res.data.file);
      toast.success('File uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (text) => {
    await copyToClipboard(text);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setFile(null); setResult(null); setProgress(0); setSettings({ description: '', password: '', expiresIn: 'never', maxDownloads: '', isPublic: true, tags: '' }); };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)',
    fontSize: 14, transition: 'border-color 0.2s',
  };

  const labelStyle = { fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 500 };

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>
          Upload File
        </h1>
        <p style={{ color: 'var(--text2)', marginBottom: 36, fontSize: 15 }}>
          Drop any file — get a short link & QR code instantly.
        </p>

        {!result ? (
          <>
            <UploadZone onFileSelected={handleFileSelect} disabled={uploading} />

            {file && (
              <div style={{ marginTop: 20, animation: 'fadeIn 0.3s ease' }}>
                {/* File preview */}
                <div style={{
                  padding: '16px', background: 'var(--card)',
                  border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                  display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 10,
                    background: `${getFileColor('other')}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>
                    {file.type.startsWith('image/') ? '🖼️' : file.type.startsWith('video/') ? '🎬' : '📄'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                    <div style={{ color: 'var(--text2)', fontSize: 12, marginTop: 2 }}>{formatBytes(file.size)} · {file.type || 'Unknown type'}</div>
                  </div>
                  <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 18, cursor: 'pointer' }}>✕</button>
                </div>

                {/* Settings toggle */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  style={{
                    width: '100%', padding: '10px',
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text2)',
                    fontSize: 13, cursor: 'pointer', transition: 'var(--transition)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    marginBottom: 12,
                  }}
                >
                  ⚙️ Advanced Settings {showSettings ? '▲' : '▼'}
                </button>

                {showSettings && (
                  <div style={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Description</label>
                      <input style={inputStyle} placeholder="Optional description..."
                        value={settings.description}
                        onChange={e => setSettings(s => ({ ...s, description: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
                    </div>
                    <div>
                      <label style={labelStyle}>🔒 Password (optional)</label>
                      <input style={inputStyle} type="password" placeholder="Leave blank for public"
                        value={settings.password}
                        onChange={e => setSettings(s => ({ ...s, password: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
                    </div>
                    <div>
                      <label style={labelStyle}>⏳ Expires In</label>
                      <select style={{ ...inputStyle, cursor: 'pointer' }}
                        value={settings.expiresIn}
                        onChange={e => setSettings(s => ({ ...s, expiresIn: e.target.value }))}>
                        {EXPIRY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>⬇️ Max Downloads (optional)</label>
                      <input style={inputStyle} type="number" min="1" placeholder="Unlimited"
                        value={settings.maxDownloads}
                        onChange={e => setSettings(s => ({ ...s, maxDownloads: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>🏷️ Tags (comma-separated)</label>
                      <input style={inputStyle} placeholder="design, work, report..."
                        value={settings.tags}
                        onChange={e => setSettings(s => ({ ...s, tags: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
                    </div>
                  </div>
                )}

                {/* Upload progress */}
                {uploading && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>
                      <span>Uploading...</span><span>{progress}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${progress}%`,
                        background: 'linear-gradient(90deg, var(--accent), var(--cyan))',
                        borderRadius: 99, transition: 'width 0.3s',
                      }} />
                    </div>
                  </div>
                )}

                {/* Upload button */}
                <button onClick={handleUpload} disabled={uploading} style={{
                  width: '100%', padding: '14px',
                  background: uploading ? 'var(--border2)' : 'var(--accent)',
                  border: 'none', borderRadius: 'var(--radius)',
                  color: '#fff', fontSize: 16, fontWeight: 700,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  transition: 'var(--transition)',
                  fontFamily: 'var(--font-display)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                  onMouseEnter={e => { if (!uploading) e.target.style.background = 'var(--accent2)'; }}
                  onMouseLeave={e => { if (!uploading) e.target.style.background = 'var(--accent)'; }}>
                  {uploading ? <><div className="spinner" />Uploading…</> : '⬆️ Upload File'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Result */
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              padding: 28, background: 'var(--card)',
              border: '1px solid var(--green)', borderRadius: 'var(--radius)',
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, background: 'rgba(0,217,163,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>Upload Successful!</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{result.originalName} · {formatBytes(result.fileSize)}</div>
                </div>
              </div>

              {/* Share URL */}
              <label style={labelStyle}>Share Link</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{
                  flex: 1, padding: '10px 14px',
                  background: 'var(--bg)', border: '1px solid var(--border2)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)', fontSize: 13,
                  color: 'var(--accent)', overflow: 'hidden', whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}>{result.shareUrl}</div>
                <button onClick={() => handleCopy(result.shareUrl)} style={{
                  padding: '10px 18px',
                  background: copied ? 'var(--green)' : 'var(--accent)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  color: '#fff', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', transition: 'var(--transition)', whiteSpace: 'nowrap',
                }}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* QR Code */}
              {result.qrCode && (
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <label style={{ ...labelStyle, textAlign: 'center' }}>QR Code</label>
                  <img src={result.qrCode} alt="QR Code"
                    style={{ width: 160, height: 160, borderRadius: 12, border: '4px solid var(--bg)', background: '#fff', padding: 8 }} />
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>Scan to open on mobile</div>
                </div>
              )}

              {/* Metadata */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {result.isPasswordProtected && <span style={{ padding: '4px 10px', background: 'rgba(255,92,122,0.12)', border: '1px solid rgba(255,92,122,0.3)', borderRadius: 99, fontSize: 11, color: 'var(--red)' }}>🔒 Password Protected</span>}
                {result.expiresAt && <span style={{ padding: '4px 10px', background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.3)', borderRadius: 99, fontSize: 11, color: 'var(--yellow)' }}>⏳ Expires {new Date(result.expiresAt).toLocaleDateString()}</span>}
                <span style={{ padding: '4px 10px', background: 'var(--accent-glow)', border: '1px solid rgba(124,106,247,0.3)', borderRadius: 99, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>/{result.shortCode}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Link to={`/share/${result.shortCode}`} style={{ flex: 1 }}>
                <button style={{
                  width: '100%', padding: '12px',
                  background: 'var(--bg3)', border: '1px solid var(--border2)',
                  borderRadius: 'var(--radius)', color: 'var(--text)',
                  fontWeight: 600, cursor: 'pointer', fontSize: 14,
                }}>View Share Page →</button>
              </Link>
              <button onClick={reset} style={{
                flex: 1, padding: '12px',
                background: 'var(--accent)', border: 'none',
                borderRadius: 'var(--radius)', color: '#fff',
                fontWeight: 600, cursor: 'pointer', fontSize: 14,
                fontFamily: 'var(--font-display)',
              }}>Upload Another</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
