import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const inputStyle = (key) => ({
    width: '100%', padding: '12px 16px',
    background: 'var(--bg)', border: `1px solid ${focused[key] ? 'var(--accent)' : 'var(--border2)'}`,
    borderRadius: 'var(--radius-sm)', color: 'var(--text)',
    fontSize: 15, transition: 'border-color 0.2s',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password)
      return toast.error('All fields required');
    if (form.password !== form.confirm)
      return toast.error('Passwords do not match');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const perks = ['100MB file uploads', '1GB free storage', 'Download analytics', 'QR code sharing'];

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--green), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 16px',
          }}>🚀</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, letterSpacing: '-1px', marginBottom: 6 }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>Join PasteBox for free — no credit card needed</p>
        </div>

        {/* Perks */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {perks.map(p => (
            <span key={p} style={{
              padding: '4px 12px',
              background: 'rgba(0,217,163,0.08)', border: '1px solid rgba(0,217,163,0.25)',
              borderRadius: 99, fontSize: 12, color: 'var(--green)',
            }}>✓ {p}</span>
          ))}
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
              { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{field.label}</label>
                <input
                  type={field.type} placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  style={inputStyle(field.key)}
                  onFocus={() => setFocused(f => ({ ...f, [field.key]: true }))}
                  onBlur={() => setFocused(f => ({ ...f, [field.key]: false }))}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'var(--border2)' : 'linear-gradient(135deg, var(--green), var(--cyan))',
              border: 'none', borderRadius: 'var(--radius)',
              color: '#0a0a12', fontSize: 15, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'var(--transition)', fontFamily: 'var(--font-display)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 6,
            }}>
              {loading ? <><div className="spinner" style={{ borderTopColor: '#0a0a12' }} />Creating account…</> : 'Create Free Account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in →</Link>
        </p>
      </div>
    </main>
  );
}
