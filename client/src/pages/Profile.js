import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import StorageBar from '../components/StorageBar';
import api from '../utils/api';
import { formatDate } from '../utils/format';

export default function Profile() {
  const { user, refreshUser, logout } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ username: user?.username || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState({});

  const inputStyle = (key) => ({
    width: '100%', padding: '11px 14px',
    background: 'var(--bg)', border: `1px solid ${focused[key] ? 'var(--accent)' : 'var(--border2)'}`,
    borderRadius: 'var(--radius-sm)', color: 'var(--text)',
    fontSize: 14, transition: 'border-color 0.2s',
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/user/profile', profileForm);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm)
      return toast.error('New passwords do not match');
    if (pwForm.newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');
    setSaving(true);
    try {
      await api.put('/user/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password updated!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const tabs = ['profile', 'security', 'storage'];

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 28 }}>
          Account Settings
        </h1>

        {/* User header */}
        <div style={{
          padding: '24px', background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, color: '#fff', flexShrink: 0,
            fontFamily: 'var(--font-display)',
          }}>{user?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{user?.username}</div>
            <div style={{ color: 'var(--text2)', fontSize: 13 }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span style={{ padding: '2px 10px', background: 'var(--accent-glow)', border: '1px solid var(--accent)', borderRadius: 99, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                {user?.plan?.toUpperCase()} PLAN
              </span>
              <span style={{ fontSize: 11, color: 'var(--text2)', padding: '2px 0' }}>
                Member since {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg3)', padding: 4, borderRadius: 'var(--radius-sm)' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px',
              background: tab === t ? 'var(--card)' : 'transparent',
              border: tab === t ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 8, color: tab === t ? 'var(--text)' : 'var(--text2)',
              fontWeight: tab === t ? 600 : 400, fontSize: 13,
              cursor: 'pointer', transition: 'var(--transition)',
              textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Profile Info</h2>
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>Username</label>
                <input value={profileForm.username}
                  onChange={e => setProfileForm(f => ({ ...f, username: e.target.value }))}
                  style={inputStyle('username')}
                  onFocus={() => setFocused(f => ({ ...f, username: true }))}
                  onBlur={() => setFocused(f => ({ ...f, username: false }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>Email</label>
                <input value={user?.email} disabled style={{ ...inputStyle('email'), opacity: 0.5, cursor: 'not-allowed' }} />
                <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>Email cannot be changed.</p>
              </div>
              <button type="submit" disabled={saving} style={{
                padding: '11px', background: saving ? 'var(--border2)' : 'var(--accent)',
                border: 'none', borderRadius: 'var(--radius)', color: '#fff',
                fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14,
                transition: 'var(--transition)', fontFamily: 'var(--font-display)',
              }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Security tab */}
        {tab === 'security' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Change Password</h2>
            <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'currentPassword', label: 'Current Password', placeholder: 'Your current password' },
                { key: 'newPassword', label: 'New Password', placeholder: 'Min 6 characters' },
                { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                  <input type="password" placeholder={f.placeholder}
                    value={pwForm[f.key]}
                    onChange={e => setPwForm(pw => ({ ...pw, [f.key]: e.target.value }))}
                    style={inputStyle(f.key)}
                    onFocus={() => setFocused(foc => ({ ...foc, [f.key]: true }))}
                    onBlur={() => setFocused(foc => ({ ...foc, [f.key]: false }))} />
                </div>
              ))}
              <button type="submit" disabled={saving} style={{
                padding: '11px', background: saving ? 'var(--border2)' : 'var(--red)',
                border: 'none', borderRadius: 'var(--radius)', color: '#fff',
                fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14,
                transition: 'var(--transition)', fontFamily: 'var(--font-display)',
              }}>
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Storage tab */}
        {tab === 'storage' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Storage Usage</h2>
              <StorageBar used={user?.storageUsed || 0} limit={user?.storageLimit || 1073741824} />
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Plan Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Current Plan', user?.plan?.toUpperCase()],
                  ['Storage Limit', '1 GB'],
                  ['Max File Size', '100 MB'],
                  ['File Expiry', 'Up to 30 days'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    <span style={{ color: 'var(--text2)' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
