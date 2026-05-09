import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,18,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 24px',
    height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'box-shadow 0.3s',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: 22, fontWeight: 800,
    color: 'var(--text)',
    display: 'flex', alignItems: 'center', gap: 8,
    letterSpacing: '-0.5px',
  },
  logoIcon: {
    width: 30, height: 30,
    background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 15,
  },
  links: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  link: {
    padding: '7px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14, fontWeight: 500,
    color: 'var(--text2)',
    transition: 'var(--transition)',
    cursor: 'pointer',
  },
  linkActive: {
    color: 'var(--text)',
    background: 'var(--bg3)',
  },
  btn: {
    padding: '8px 18px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14, fontWeight: 600,
    background: 'var(--accent)',
    color: '#fff',
    transition: 'var(--transition)',
    border: 'none', cursor: 'pointer',
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    fontSize: 14, fontWeight: 500,
    color: 'var(--text2)',
    transition: 'var(--transition)',
  },
  avatar: {
    width: 26, height: 26,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#fff',
  },
  hamburger: {
    display: 'none',
    background: 'none', border: 'none',
    color: 'var(--text)',
    fontSize: 22, cursor: 'pointer', padding: 4,
  },
  mobileMenu: {
    position: 'fixed', top: 64, left: 0, right: 0,
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)',
    padding: '12px 16px 20px',
    display: 'flex', flexDirection: 'column', gap: 4,
    zIndex: 99,
    animation: 'fadeIn 0.2s ease',
  },
  mobileLink: {
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 15, fontWeight: 500,
    color: 'var(--text2)',
    display: 'block',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <>
      <nav style={{ ...styles.nav, boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none' }}>
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>📦</div>
          PasteBox
        </Link>

        {/* Desktop links */}
        <div style={styles.links} className="desktop-links">
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>Home</Link>
          <Link to="/upload" style={{ ...styles.link, ...(isActive('/upload') ? styles.linkActive : {}) }}>Upload</Link>
          {user && <Link to="/dashboard" style={{ ...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {}) }}>Dashboard</Link>}
          {user ? (
            <>
              <Link to="/profile" style={styles.userChip}>
                <div style={styles.avatar}>{user.username?.[0]?.toUpperCase()}</div>
                {user.username}
              </Link>
              <button style={styles.btn} onClick={handleLogout}
                onMouseEnter={e => e.target.style.background = 'var(--accent2)'}
                onMouseLeave={e => e.target.style.background = 'var(--accent)'}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register">
                <button style={styles.btn}
                  onMouseEnter={e => e.target.style.background = 'var(--accent2)'}
                  onMouseLeave={e => e.target.style.background = 'var(--accent)'}>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} className="hamburger">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink}>🏠 Home</Link>
          <Link to="/upload" style={styles.mobileLink}>⬆️ Upload</Link>
          {user && <Link to="/dashboard" style={styles.mobileLink}>📊 Dashboard</Link>}
          {user ? (
            <>
              <Link to="/profile" style={styles.mobileLink}>👤 Profile ({user.username})</Link>
              <button onClick={handleLogout} style={{ ...styles.mobileLink, background: 'none', border: 'none', textAlign: 'left', color: 'var(--red)', cursor: 'pointer' }}>🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink}>🔑 Login</Link>
              <Link to="/register" style={{ ...styles.mobileLink, color: 'var(--accent)' }}>✨ Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
