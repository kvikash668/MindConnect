import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { path: '/feed',      label: '🏠 Feed' },
  { path: '/friends',  label: '👥 Friends' },
  { path: '/experts',  label: '🎓 Experts' },
  { path: '/profile',  label: '👤 Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/feed" style={styles.logo}>
          <span style={styles.logoIcon}>🧠</span>
          <span style={styles.logoText}>MindConnect</span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          {NAV_LINKS.map(({ path, label }) => (
            <Link key={path} to={path} style={{
              ...styles.link,
              ...(location.pathname === path ? styles.linkActive : {})
            }}>{label}</Link>
          ))}
        </div>

        {/* User menu */}
        <div style={styles.userArea}>
          {user?.isExpert && <span className="badge badge-expert">Expert</span>}
          <div style={styles.avatarBtn} onClick={() => setMenuOpen(!menuOpen)}>
            <div className="avatar" style={{ width: 38, height: 38, fontSize: 14 }}>{initials}</div>
          </div>
          {menuOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <div style={{ fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{user?.email}</div>
              </div>
              <Link to="/profile" style={styles.dropItem} onClick={() => setMenuOpen(false)}>⚙️ Settings</Link>
              <button style={styles.dropItem} onClick={handleLogout}>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'white', borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  inner: {
    maxWidth: 1100, margin: '0 auto', padding: '0 20px',
    height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  logo: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' },
  logoIcon: { fontSize: 24 },
  logoText: { fontSize: 18, fontWeight: 700, color: '#6366f1' },
  links: { display: 'flex', gap: 4 },
  link: {
    padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
    color: '#6b7280', textDecoration: 'none', transition: 'all 0.15s'
  },
  linkActive: { background: '#eef2ff', color: '#6366f1' },
  userArea: { display: 'flex', alignItems: 'center', gap: 10, position: 'relative' },
  avatarBtn: { cursor: 'pointer' },
  dropdown: {
    position: 'absolute', top: 46, right: 0, background: 'white',
    border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    minWidth: 200, overflow: 'hidden', zIndex: 200
  },
  dropdownHeader: { padding: '12px 16px', borderBottom: '1px solid #f3f4f6' },
  dropItem: {
    display: 'block', width: '100%', textAlign: 'left',
    padding: '10px 16px', fontSize: 14, color: '#374151',
    background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none',
    transition: 'background 0.15s'
  }
};
