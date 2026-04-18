import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Welcome to MindConnect! 🎉');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={{ fontSize: 48 }}>🧠</span>
          <h1 style={styles.title}>Join MindConnect</h1>
          <p style={styles.subtitle}>Share, support, and grow together</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text" placeholder="Your name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password" placeholder="Repeat password"
              value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12, fontSize: 15 }} disabled={loading}>
            {loading ? 'Creating account...' : '✨ Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 20
  },
  card: {
    background: 'white', borderRadius: 16, padding: 36,
    width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
  },
  header: { textAlign: 'center', marginBottom: 28 },
  title:  { fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginTop: 8 },
  subtitle: { color: '#6b7280', fontSize: 14, marginTop: 4 }
};
