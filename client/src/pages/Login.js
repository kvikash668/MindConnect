import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 💜');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={{ fontSize: 48 }}>🧠</span>
          <h1 style={styles.title}>MindConnect</h1>
          <p style={styles.subtitle}>A safe space to share, heal & grow</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: 15 }} disabled={loading}>
            {loading ? 'Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 }}>
          New here?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 600 }}>Create account</Link>
        </p>

        {/* Demo hint */}
        <div style={{ marginTop: 20, padding: 12, background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#166534' }}>
          <strong>Demo:</strong> Register a new account to get started instantly!
        </div>
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
  title: { fontSize: 28, fontWeight: 800, color: '#1a1a2e', marginTop: 8 },
  subtitle: { color: '#6b7280', fontSize: 14, marginTop: 4 }
};
