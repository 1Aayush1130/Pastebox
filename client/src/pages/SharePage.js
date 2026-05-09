import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { formatBytes, formatDate, getFileIcon, getFileColor, copyToClipboard } from '../utils/format';

export default function SharePage() {
  const { shortCode } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [qr, setQr] = useState('');
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    fetchFile();
  }, [shortCode]);

  const fetchFile = async () => {
    try {
      const res = await api.get(`/files/${shortCode}`);
      setFile(res.data);
      if (!res.data.isPasswordProtected) {
        setFileUrl(res.data.fileUrl);
        setUnlocked(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'File not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await api.post(`/files/${shortCode}/access`, { password });
      setFileUrl(res.data.fileUrl);
      setUnlocked(true);
      toast.success('File unlocked!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Wrong password');
    } finally {
      setVerifying(false);
    }
  };

  const handleDownload = async () => {
    try {
      await api.post(`/files/${shortCode}/download`);
      window.open(fileUrl, '_blank');
    } catch {
      window.open(fileUrl, '_blank');
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(window.location.href);
    toast.success('Link copied!');
  };

  const loadQR = async () => {
    if (qr) { setShowQr(!showQr); return; }
    try {
      const res = await api.get(`/files/${shortCode}/qr`);
      setQr(res.data.qrCode);
      setShowQr(true);
    } catch { toast.error('Could not load QR'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', gap: 14 }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
      <p style={{ color: 'var(--text2)', fontSize: 14 }}>Loading file…</p>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>😕</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 10 }}>{error}</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 28 }}>This file may have expired or been deleted.</p>
      <Link to="/upload">
        <button style={{ padding: '12px 28px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
          Upload Your Own →
        </button>
      </Link>
    </div>
  );

  const color = getFileColor(file.fileType);
  const icon = getFileIcon(file.fileType, file.mimeType);
  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const isAudio = file.mimeType?.startsWith('audio/');

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 660, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        {/* Card */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          {/* Color top bar */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, transparent)` }} />

          <div style={{ padding: '28px 28px 24px' }}>
            {/* File header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 14,
                background: `${color}18`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, flexShrink: 0,
              }}>{icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
                  wordBreak: 'break-word', marginBottom: 6,
                }}>{file.originalName}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 13, color: 'var(--text2)' }}>
                  <span>{formatBytes(file.fileSize)}</span>
                  <span>·</span>
                  <span>Uploaded {formatDate(file.createdAt)}</span>
                </div>
                {file.description && (
                  <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{file.description}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12, marginBottom: 24,
            }}>
              {[
                { icon: '👁', label: 'Views', value: file.viewCount },
                { icon: '⬇️', label: 'Downloads', value: file.downloadCount },
                { icon: '⏳', label: 'Expires', value: file.expiresAt ? formatDate(file.expiresAt) : 'Never' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '12px', background: 'var(--bg3)',
                  borderRadius: 'var(--radius-sm)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {file.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {file.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '3px 10px',
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    borderRadius: 99, fontSize: 12, color: 'var(--text2)',
                  }}>#{tag}</span>
                ))}
              </div>
            )}

            {/* Password form */}
            {file.isPasswordProtected && !unlocked && (
              <form onSubmit={handlePasswordSubmit} style={{
                padding: '20px', background: 'rgba(255,92,122,0.06)',
                border: '1px solid rgba(255,92,122,0.2)',
                borderRadius: 'var(--radius)', marginBottom: 20,
              }}>
                <p style={{ fontSize: 14, marginBottom: 12, color: 'var(--text)' }}>
                  🔒 This file is password protected
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="password" placeholder="Enter password…"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 14px',
                      background: 'var(--bg)', border: '1px solid var(--border2)',
                      borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14,
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                  />
                  <button type="submit" disabled={verifying} style={{
                    padding: '10px 18px',
                    background: 'var(--accent)', border: 'none',
                    borderRadius: 'var(--radius-sm)', color: '#fff',
                    fontWeight: 600, cursor: 'pointer', fontSize: 14,
                  }}>
                    {verifying ? '…' : 'Unlock'}
                  </button>
                </div>
              </form>
            )}

            {/* Preview */}
            {unlocked && fileUrl && (
              <div style={{ marginBottom: 20, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--bg3)' }}>
                {isImage && (
                  <img src={fileUrl} alt={file.originalName}
                    style={{ width: '100%', maxHeight: 400, objectFit: 'contain', display: 'block' }} />
                )}
                {isVideo && (
                  <video src={fileUrl} controls style={{ width: '100%', maxHeight: 340, display: 'block' }} />
                )}
                {isAudio && (
                  <div style={{ padding: '20px' }}>
                    <audio src={fileUrl} controls style={{ width: '100%' }} />
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {unlocked && (
                <button onClick={handleDownload} style={{
                  flex: 2, minWidth: 120, padding: '13px 20px',
                  background: 'var(--accent)', border: 'none',
                  borderRadius: 'var(--radius)', color: '#fff',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  transition: 'var(--transition)', fontFamily: 'var(--font-display)',
                }}
                  onMouseEnter={e => { e.target.style.background = 'var(--accent2)'; e.target.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.target.style.background = 'var(--accent)'; e.target.style.transform = 'translateY(0)'; }}>
                  ⬇️ Download
                </button>
              )}
              <button onClick={handleCopy} style={{
                flex: 1, minWidth: 100, padding: '13px 16px',
                background: 'var(--bg3)', border: '1px solid var(--border2)',
                borderRadius: 'var(--radius)', color: 'var(--text)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'var(--transition)',
              }}
                onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.target.style.borderColor = 'var(--border2)'}>
                🔗 Copy Link
              </button>
              <button onClick={loadQR} style={{
                padding: '13px 16px',
                background: 'var(--bg3)', border: '1px solid var(--border2)',
                borderRadius: 'var(--radius)', color: 'var(--text)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'var(--transition)',
              }}
                onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.target.style.borderColor = 'var(--border2)'}>
                📱 QR
              </button>
            </div>

            {/* QR panel */}
            {showQr && qr && (
              <div style={{
                marginTop: 16, padding: 20, textAlign: 'center',
                background: 'var(--bg3)', borderRadius: 'var(--radius)',
                animation: 'fadeIn 0.3s ease',
              }}>
                <img src={qr} alt="QR Code" style={{
                  width: 180, height: 180, background: '#fff',
                  borderRadius: 12, padding: 8,
                }} />
                <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)' }}>Scan to open on another device</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 10 }}>
            Shared via <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>PasteBox</span>
          </p>
          <Link to="/upload">
            <button style={{
              padding: '9px 22px',
              background: 'var(--accent-glow)', border: '1px solid var(--accent)',
              borderRadius: 99, color: 'var(--accent)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              Share your own file →
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
