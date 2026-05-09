import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { formatBytes, formatRelative, getFileIcon, getFileColor, copyToClipboard } from '../utils/format';

export default function FileCard({ file, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const shareUrl = file.shareUrl || `${window.location.origin}/share/${file.shortCode}`;

  const handleCopy = async () => {
    await copyToClipboard(shareUrl);
    toast.success('Link copied!');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/files/${file._id}`);
      toast.success('File deleted');
      onDelete && onDelete(file._id);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const color = getFileColor(file.fileType);
  const icon = getFileIcon(file.fileType, file.mimeType);
  const isExpired = file.expiresAt && new Date() > new Date(file.expiresAt);

  return (
    <div style={{
      background: 'var(--card)',
      border: `1px solid var(--border)`,
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      transition: 'var(--transition)',
      opacity: isExpired ? 0.5 : 1,
      animation: 'fadeIn 0.3s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Color bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div style={{ padding: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>{icon}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontWeight: 600, fontSize: 14,
              color: 'var(--text)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              marginBottom: 2,
            }} title={file.originalName}>{file.originalName}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span>{formatBytes(file.fileSize)}</span>
              <span>·</span>
              <span>{formatRelative(file.createdAt)}</span>
            </div>
          </div>
          {file.isPasswordProtected && (
            <span title="Password protected" style={{ fontSize: 14 }}>🔒</span>
          )}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 16, marginBottom: 14,
          padding: '8px 12px',
          background: 'var(--bg3)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12, color: 'var(--text2)',
        }}>
          <span>👁 {file.viewCount || 0}</span>
          <span>⬇️ {file.downloadCount || 0}</span>
          {file.expiresAt && (
            <span style={{ color: isExpired ? 'var(--red)' : 'var(--yellow)', marginLeft: 'auto' }}>
              {isExpired ? '⏰ Expired' : `⏳ ${formatRelative(file.expiresAt)}`}
            </span>
          )}
          {!file.expiresAt && <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>∞ Never</span>}
        </div>

        {/* Short code */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11, color: 'var(--accent)',
          background: 'var(--accent-glow)',
          padding: '4px 8px', borderRadius: 6,
          marginBottom: 12, display: 'inline-block',
        }}>/{file.shortCode}</div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <Link to={`/share/${file.shortCode}`} style={{ flex: 1 }}>
            <button style={{
              width: '100%', padding: '8px',
              background: 'var(--bg3)', border: '1px solid var(--border2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', transition: 'var(--transition)',
            }}
              onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.target.style.borderColor = 'var(--border2)'}>
              View
            </button>
          </Link>
          <button onClick={handleCopy} style={{
            flex: 1, padding: '8px',
            background: 'var(--accent-glow)', border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent)', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', transition: 'var(--transition)',
          }}>
            Copy Link
          </button>
          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)} style={{
              padding: '8px 12px',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text2)', fontSize: 13,
              cursor: 'pointer', transition: 'var(--transition)',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.color = 'var(--red)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)'; }}>
              🗑
            </button>
          ) : (
            <button onClick={handleDelete} disabled={deleting} style={{
              padding: '8px 10px',
              background: 'var(--red)', border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#fff', fontSize: 11, fontWeight: 600,
              cursor: 'pointer',
            }}>
              {deleting ? '...' : 'Sure?'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
