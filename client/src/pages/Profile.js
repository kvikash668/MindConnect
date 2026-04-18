import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');

  const [profile, setProfile] = useState({
    name:   user?.name || '',
    bio:    user?.bio  || '',
    avatar: user?.avatar || ''
  });

  const [expert, setExpert] = useState({
    title:           user?.expertProfile?.title || '',
    specialization:  user?.expertProfile?.specialization?.join(', ') || '',
    subscriptionFee: user?.expertProfile?.subscriptionFee || 500,
    description:     user?.expertProfile?.description || ''
  });

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/update-profile', profile);
      updateUser(data);
      toast.success('Profile updated! ✅');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleBecomeExpert = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/auth/become-expert', {
        ...expert,
        specialization: expert.specialization.split(',').map(s => s.trim()).filter(Boolean)
      });
      updateUser(data.user);
      toast.success('🎓 You are now an expert!');
    } catch { toast.error('Failed to register as expert'); }
    finally { setSaving(false); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        <div className="avatar" style={{ width: 72, height: 72, fontSize: 26 }}>{initials}</div>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 22 }}>{user?.name}</h2>
          <p style={{ color: '#6b7280', fontSize: 14 }}>{user?.email}</p>
          {user?.isExpert && <span className="badge badge-expert" style={{ marginTop: 4 }}>✓ Verified Expert</span>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { id: 'profile', label: '👤 Edit Profile' },
          { id: 'expert',  label: user?.isExpert ? '🎓 Expert Settings' : '🚀 Become Expert' }
        ].map(t => (
          <button key={t.id} className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Profile form */}
      {tab === 'profile' && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Personal Information</h3>
          <form onSubmit={handleSaveProfile}>
            <div className="input-group">
              <label>Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Bio</label>
              <textarea
                rows={3} placeholder="Tell others a bit about yourself..."
                value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div className="input-group">
              <label>Avatar URL (optional)</label>
              <input
                placeholder="https://..."
                value={profile.avatar} onChange={e => setProfile({ ...profile, avatar: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Expert form */}
      {tab === 'expert' && (
        <div className="card">
          {!user?.isExpert && (
            <div style={{
              padding: 16, background: 'linear-gradient(135deg, #667eea20, #764ba220)',
              borderRadius: 10, marginBottom: 20, fontSize: 14, color: '#4b5563', lineHeight: 1.6
            }}>
              <strong>🌟 Become a Counselling Expert</strong><br />
              Register as an expert to offer professional counselling. You can set your own subscription fee
              and users will be able to subscribe to your profile for real counselling sessions.
            </div>
          )}

          <form onSubmit={handleBecomeExpert}>
            <div className="input-group">
              <label>Professional Title</label>
              <input
                placeholder="e.g. Licensed Therapist, Life Coach, Psychologist..."
                value={expert.title} onChange={e => setExpert({ ...expert, title: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Specializations (comma separated)</label>
              <input
                placeholder="e.g. Anxiety, Depression, Relationship Counselling..."
                value={expert.specialization}
                onChange={e => setExpert({ ...expert, specialization: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Monthly Subscription Fee (₹)</label>
              <input
                type="number" min="0"
                value={expert.subscriptionFee}
                onChange={e => setExpert({ ...expert, subscriptionFee: Number(e.target.value) })}
              />
            </div>
            <div className="input-group">
              <label>About Your Practice</label>
              <textarea
                rows={4} placeholder="Describe your experience, approach, and what clients can expect..."
                value={expert.description}
                onChange={e => setExpert({ ...expert, description: e.target.value })}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : user?.isExpert ? '💾 Update Expert Profile' : '🚀 Register as Expert'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
