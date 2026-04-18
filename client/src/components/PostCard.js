import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MOOD_EMOJI = {
  happy: '😊', sad: '😢', anxious: '😰', angry: '😤',
  neutral: '😐', hopeful: '🌟', overwhelmed: '😵'
};

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [likes, setLikes]         = useState(post.likes?.length || 0);
  const [liked, setLiked]         = useState(post.likes?.includes(user?.id));
  const [comments, setComments]   = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment]     = useState('');
  const [submitting, setSubmitting]     = useState(false);

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/social/posts/${post._id}/like`);
      setLikes(data.likes);
      setLiked(data.liked);
    } catch { toast.error('Failed to like post'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/social/posts/${post._id}/comments`, { content: newComment });
      setComments(prev => [...prev, data]);
      setNewComment('');
    } catch { toast.error('Failed to add comment'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/social/posts/${post._id}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch { toast.error('Failed to delete comment'); }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const timeAgo  = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 40, height: 40, fontSize: 14 }}>
            {initials(post.authorName)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{post.authorName}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {post.mood && (
            <span style={{ fontSize: 18 }} title={post.mood}>{MOOD_EMOJI[post.mood]}</span>
          )}
          {post.author === user?.id && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(post._id)}>✕</button>
          )}
        </div>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              background: '#eef2ff', color: '#6366f1', padding: '2px 10px',
              borderRadius: 20, fontSize: 12, fontWeight: 500
            }}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Content */}
      <p style={{ fontSize: 15, lineHeight: 1.6, color: '#374151', marginBottom: 14 }}>
        {post.content}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleLike}
          style={{ background: liked ? '#eef2ff' : undefined, color: liked ? '#6366f1' : '#6b7280' }}
        >
          {liked ? '💜' : '🤍'} {likes} {likes === 1 ? 'Like' : 'Likes'}
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowComments(!showComments)}
          style={{ color: '#6b7280' }}
        >
          💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={{ marginTop: 14 }}>
          {comments.map(c => (
            <div key={c._id} style={{
              display: 'flex', gap: 8, marginBottom: 10, padding: '8px 10px',
              background: '#f9fafb', borderRadius: 8
            }}>
              <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{initials(c.authorName)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.authorName}</div>
                <div style={{ fontSize: 14, color: '#374151' }}>{c.content}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(c.createdAt)}</div>
              </div>
              {c.author === user?.id && (
                <button
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}
                  onClick={() => handleDeleteComment(c._id)}
                >✕</button>
              )}
            </div>
          ))}

          <form onSubmit={handleComment} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a supportive comment..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? '...' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
