import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Avatar = ({ name, size = 44 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {initials}
    </div>
  );
};

export default function Friends() {
  const [tab, setTab]             = useState('friends');
  const [friends, setFriends]     = useState([]);
  const [pending, setPending]     = useState([]);
  const [search, setSearch]       = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);

  useEffect(() => { fetchFriends(); fetchPending(); }, []);

  const fetchFriends = async () => {
    try {
      const { data } = await api.get('/users/friends/list');
      setFriends(data);
    } catch { toast.error('Failed to load friends'); }
  };

  const fetchPending = async () => {
    try {
      const { data } = await api.get('/users/friends/pending');
      setPending(data);
    } catch {}
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/users/search?q=${encodeURIComponent(search)}`);
      setResults(data);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const sendRequest = async (userId) => {
    try {
      await api.post(`/users/friends/request/${userId}`);
      toast.success('Friend request sent! 🤝');
      setResults(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    }
  };

  const respond = async (friendshipId, status) => {
    try {
      await api.put(`/users/friends/${friendshipId}`, { status });
      toast.success(status === 'accepted' ? 'Friend added! 🎉' : 'Request declined');
      setPending(prev => prev.filter(p => p._id !== friendshipId));
      if (status === 'accepted') fetchFriends();
    } catch { toast.error('Failed to respond'); }
  };

  const tabs = [
    { id: 'friends', label: `👥 Friends (${friends.length})` },
    { id: 'pending', label: `📬 Requests (${pending.length})` },
    { id: 'find',    label: '🔍 Find People' }
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 20 }}>Friends</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      {/* Friends list */}
      {tab === 'friends' && (
        <div>
          {friends.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <p style={{ fontSize: 40 }}>👥</p>
              <p style={{ color: '#6b7280', marginTop: 12 }}>No friends yet. Use "Find People" to connect!</p>
            </div>
          ) : friends.map(f => (
            <div key={f._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <Avatar name={f.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{f.name}</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>{f.bio || 'No bio yet'}</div>
              </div>
              {f.isExpert && <span className="badge badge-expert">Expert</span>}
            </div>
          ))}
        </div>
      )}

      {/* Pending requests */}
      {tab === 'pending' && (
        <div>
          {pending.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <p style={{ fontSize: 40 }}>📬</p>
              <p style={{ color: '#6b7280', marginTop: 12 }}>No pending friend requests</p>
            </div>
          ) : pending.map(req => (
            <div key={req._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <Avatar name={req.requester?.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{req.requester?.name}</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>{req.requester?.email}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-sm" onClick={() => respond(req._id, 'accepted')}>✓ Accept</button>
                <button className="btn btn-danger btn-sm"  onClick={() => respond(req._id, 'rejected')}>✕ Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Find people */}
      {tab === 'find' && (
        <div>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 8,
                border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: 'inherit'
              }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '...' : '🔍 Search'}
            </button>
          </form>

          {results.map(u => (
            <div key={u._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <Avatar name={u.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>{u.bio || u.email}</div>
              </div>
              {u.isExpert && <span className="badge badge-expert">Expert</span>}
              <button className="btn btn-primary btn-sm" onClick={() => sendRequest(u._id)}>
                + Add Friend
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
