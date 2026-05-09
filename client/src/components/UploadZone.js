import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatBytes } from '../utils/format';

export default function UploadZone({ onFileSelected, disabled }) {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onFileSelected(accepted[0]);
    setDragOver(false);
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled,
    maxSize: 100 * 1024 * 1024,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
  });

  const active = isDragActive || dragOver;

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${active ? 'var(--accent)' : 'var(--border2)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '56px 32px',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: active
          ? 'rgba(124,106,247,0.08)'
          : 'var(--bg3)',
        transition: 'all 0.25s ease',
        transform: active ? 'scale(1.01)' : 'scale(1)',
        boxShadow: active ? '0 0 40px rgba(124,106,247,0.15)' : 'none',
      }}
    >
      <input {...getInputProps()} />

      {/* Icon */}
      <div style={{
        width: 72, height: 72,
        margin: '0 auto 20px',
        borderRadius: '50%',
        background: active ? 'var(--accent)' : 'var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 30,
        transition: 'all 0.25s ease',
        transform: active ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
      }}>
        {active ? '🎯' : '📁'}
      </div>

      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20, fontWeight: 700,
        color: active ? 'var(--accent)' : 'var(--text)',
        marginBottom: 8,
        transition: 'color 0.2s',
      }}>
        {active ? 'Drop it here!' : 'Drag & drop your file'}
      </p>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
        or click to browse — up to {formatBytes(100 * 1024 * 1024)}
      </p>

      {/* File type badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {['Images', 'Videos', 'PDFs', 'Archives', 'Audio', 'Docs'].map(t => (
          <span key={t} style={{
            padding: '4px 10px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 99, fontSize: 11,
            color: 'var(--text2)',
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
