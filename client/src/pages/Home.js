import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '⚡', title: 'Instant Uploads', desc: 'Upload any file up to 100MB in seconds with drag & drop.' },
  { icon: '🔗', title: 'Short Links', desc: 'Every file gets a unique short link you can share anywhere.' },
  { icon: '📱', title: 'QR Codes', desc: 'Auto-generated QR codes for easy mobile sharing.' },
  { icon: '🔒', title: 'Password Protection', desc: 'Secure sensitive files with optional password protection.' },
  { icon: '⏳', title: 'Auto-Expiry', desc: 'Set files to auto-delete after 1h, 24h, 7 days, or 30 days.' },
  { icon: '📊', title: 'Analytics', desc: 'Track views and downloads for every file you share.' },
];

export default function Home() {
  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', overflowX: 'hidden' }}>
      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '100px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 50, right: -100,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(0,217,163,0.07) 0%, transparent 70%)',
          animation: 'blob 10s infinite', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px',
            background: 'var(--accent-glow)',
            border: '1px solid rgba(124,106,247,0.4)',
            borderRadius: 99,
            fontSize: 13, color: 'var(--accent)',
            marginBottom: 28,
            fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Free to use · No sign-up required
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 8vw, 76px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            marginBottom: 24,
          }}>
            Share files{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent), #a78bfa, var(--cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>instantly</span>
            <br />with anyone.
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text2)',
            lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px',
          }}>
            Upload any file, get a short shareable link and QR code in seconds. No bloat, no ads — just fast, secure file sharing.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/upload">
              <button style={{
                padding: '14px 32px',
                background: 'var(--accent)',
                border: 'none', borderRadius: 'var(--radius)',
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', transition: 'var(--transition)',
                fontFamily: 'var(--font-display)',
              }}
                onMouseEnter={e => { e.target.style.background = 'var(--accent2)'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(124,106,247,0.4)'; }}
                onMouseLeave={e => { e.target.style.background = 'var(--accent)'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                Upload a File →
              </button>
            </Link>
            <Link to="/register">
              <button style={{
                padding: '14px 32px',
                background: 'transparent',
                border: '1px solid var(--border2)',
                borderRadius: 'var(--radius)',
                color: 'var(--text)',
                fontSize: 16, fontWeight: 600,
                cursor: 'pointer', transition: 'var(--transition)',
              }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text)'; }}>
                Create Free Account
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 40, justifyContent: 'center',
            marginTop: 64, flexWrap: 'wrap',
          }}>
            {[['100MB', 'Max file size'], ['Instant', 'Link generation'], ['Free', 'No credit card']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px' }}>{val}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>
            Everything you need
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 16 }}>Powerful features, zero complexity.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              padding: '28px 24px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              transition: 'var(--transition)',
              animation: `fadeIn 0.4s ease ${i * 0.07}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,106,247,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 24px 80px',
        padding: '60px 40px',
        background: 'linear-gradient(135deg, rgba(124,106,247,0.12), rgba(6,214,227,0.06))',
        border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        maxWidth: 800, marginLeft: 'auto', marginRight: 'auto',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-1px' }}>
          Ready to share?
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 16 }}>
          No account needed. Drop a file and get your link in seconds.
        </p>
        <Link to="/upload">
          <button style={{
            padding: '14px 36px',
            background: 'var(--accent)',
            border: 'none', borderRadius: 'var(--radius)',
            color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', transition: 'var(--transition)',
            fontFamily: 'var(--font-display)',
          }}
            onMouseEnter={e => { e.target.style.background = 'var(--accent2)'; e.target.style.boxShadow = '0 8px 30px rgba(124,106,247,0.4)'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--accent)'; e.target.style.boxShadow = 'none'; }}>
            Start Uploading Free
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '28px 24px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        color: 'var(--text2)',
        fontSize: 13,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>PasteBox</span>
        {' '}— Built with the MERN stack · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
