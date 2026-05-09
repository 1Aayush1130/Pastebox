export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatRelative = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diff = (now - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
};

export const getFileIcon = (fileType, mimeType = '') => {
  const icons = {
    image: '🖼️', video: '🎬', audio: '🎵',
    document: '📄', archive: '📦', other: '📎',
  };
  if (mimeType === 'application/pdf') return '📋';
  return icons[fileType] || '📎';
};

export const getFileColor = (fileType) => {
  const colors = {
    image: '#FF6B6B',
    video: '#4ECDC4',
    audio: '#FFE66D',
    document: '#74B9FF',
    archive: '#A29BFE',
    other: '#FDCB6E',
  };
  return colors[fileType] || '#FDCB6E';
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
};
