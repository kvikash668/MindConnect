import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MOODS = ['happy','sad','anxious','angry','neutral','hopeful','overwhelmed'];
const MOOD_EMOJI = { happy:'😊', sad:'😢', anxious:'😰', angry:'😤', neutral:'😐', hopeful:'🌟', overwhelmed:'😵' };

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newPost, setNewPost]   = useState({ content: '', mood: 'neutral', isAnonymous: false, tags: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/social/posts?limit=50');
      setPosts(data.posts || []);
    } catch { toast.error('Failed to load posts'); }
    finally { setLoading(false); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) return toast.error('Please write something');
    setSubmitting(true);
    try {
      const tags = newPost.tags.split(',').map(t => t.trim()).filter(Boolean);
      const { data } = await api.post('/social/posts', {
        content: newPost.content,
        mood: newPost.mood,
        isAnonymous: newPost.isAnonymous,
        tags
      });
      setPosts(prev => [data, ...prev]);
      setNewPost({ content: '', mood: 'neutral', isAnonymous: false, tags: '' });
      setShowForm(false);
      toast.success('Post shared! 💜');
    } catch { toast.error('Failed to share post'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/social/posts/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
      toast.success('Post deleted');
    } catch { toast.error('Failed to delete post'); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={styles.layout}>
      {/* Left: main feed */}
      <div style={styles.main}>
        {/* Create post box */}
        <div className="card" style={{ marginBottom: 20 }}>
          {!showForm ? (
            <div style={styles.createTrigger} onClick={() => setShowForm(true)}>
              <div className="avatar" style={{ width: 40, height: 40, fontSize: 14 }}>{initials}</div>
              <div style={styles.createPlaceholder}>
                What's on your mind, {user?.name?.split(' ')[0]}?
              </div>
            </div>
          ) : (
            <form onSubmit={handlePost}>
              <div className="input-group">
                <textarea
                  rows={4}
                  placeholder="Share your feelings, thoughts, or what's on your mind... This is a safe space 💜"
                  value={newPost.content}
                  onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>How are you feeling?</label>
                  <select
                    value={newPost.mood}
                    onChange={e => setNewPost({ ...newPost, mood: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14 }}
                  >
                    {MOODS.map(m => (
                      <option key={m} value={m}>{MOOD_EMOJI[m]} {m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>Tags (comma separated)</label>
                  <input
                    placeholder="anxiety, work, family..."
                    value={newPost.tags}
                    onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#6b7280', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newPost.isAnonymous}
                    onChange={e => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                  />
                  Post anonymously
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !newPost.content.trim()}>
                    {submitting ? 'Sharing...' : '💜 Share'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ fontSize: 48 }}>🌱</p>
            <p style={{ color: '#6b7280', marginTop: 12 }}>No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} onDelete={handleDelete} />)
        )}
      </div>

      {/* Right sidebar */}
      <div style={styles.sidebar}>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>💡 Community Guidelines</h3>
          {['Be kind and supportive', 'Respect everyone\'s feelings', 'No judgment zone', 'Seek professional help when needed'].map(g => (
            <div key={g} style={{ fontSize: 13, color: '#6b7280', padding: '4px 0', borderBottom: '1px solid #f9fafb' }}>
              ✅ {g}
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>🆘 Crisis Support</h3>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
            If you're in crisis, please reach out to:<br />
            <strong>iCall: 9152987821</strong><br />
            <strong>Vandrevala Foundation: 1860-2662-345</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { maxWidth: 1100, margin: '0 auto', padding: 24, display: 'flex', gap: 24, alignItems: 'flex-start' },
  main: { flex: 1, minWidth: 0 },
  sidebar: { width: 280, flexShrink: 0 },
  createTrigger: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  createPlaceholder: {
    flex: 1, padding: '10px 16px', background: '#f9fafb', borderRadius: 24,
    color: '#9ca3af', fontSize: 14, border: '1.5px solid #e5e7eb'
  }
};
