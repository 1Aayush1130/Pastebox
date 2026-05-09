import React from 'react';
import { formatBytes } from '../utils/format';

export default function StorageBar({ used, limit }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct > 85 ? 'var(--red)' : pct > 60 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--text2)' }}>
        <span>Storage Used</span>
        <span style={{ color }}>{formatBytes(used)} / {formatBytes(limit)}</span>
      </div>
      <div style={{
        height: 6, borderRadius: 99,
        background: 'var(--border)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          borderRadius: 99,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
        {pct.toFixed(1)}% used
      </div>
    </div>
  );
}
