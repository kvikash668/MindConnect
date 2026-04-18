import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Experts() {
  const [experts, setExperts]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => { fetchExperts(); }, []);

  const fetchExperts = async () => {
    try {
      const { data } = await api.get('/users/experts/all');
      setExperts(data);
    } catch { toast.error('Failed to load experts'); }
    finally { setLoading(false); }
  };

  const handleSubscribe = async (expert) => {
    setSubscribing(expert._id);
    try {
      const amount = expert.expertProfile?.subscriptionFee || 0;

      // Create payment order
      const { data } = await api.post('/payment/create-order', {
        expertId: expert._id,
        amount
      });

      if (data.demo) {
        // Demo mode: simulate payment success
        toast.success(`🎉 Subscribed to ${expert.name}! (Demo mode - no real payment)`);
        setSubscribing(null);
        return;
      }

      // Real Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: data.order.amount,
        currency: 'INR',
        name: 'MindConnect',
        description: `Counselling subscription with ${expert.name}`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              expertId: expert._id
            });
            // Create subscription record
            await api.post('/users/subscriptions', { expertId: expert._id });
            toast.success(`🎉 Subscribed to ${expert.name}!`);
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: '', email: '' },
        theme: { color: '#6366f1' }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Razorpay SDK not loaded. Add your key in .env');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Subscription failed');
    } finally { setSubscribing(null); }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (loading) return <div className="spinner" style={{ marginTop: 60 }} />;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 24 }}>🎓 Expert Counsellors</h2>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Connect with verified mental health experts for real counselling sessions</p>
      </div>

      {experts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontSize: 48 }}>🎓</p>
          <p style={{ color: '#6b7280', marginTop: 16 }}>No experts yet. Become the first expert via Profile settings!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {experts.map(expert => (
            <div key={expert._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div className="avatar" style={{ width: 52, height: 52, fontSize: 18 }}>{initials(expert.name)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{expert.name}</div>
                  <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>
                    {expert.expertProfile?.title || 'Mental Health Expert'}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {expert.bio && (
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12, lineHeight: 1.5 }}>
                  {expert.bio}
                </p>
              )}

              {/* Description */}
              {expert.expertProfile?.description && (
                <p style={{ fontSize: 13, color: '#4b5563', marginBottom: 12, lineHeight: 1.5 }}>
                  {expert.expertProfile.description}
                </p>
              )}

              {/* Specializations */}
              {expert.expertProfile?.specialization?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {expert.expertProfile.specialization.map(s => (
                    <span key={s} style={{
                      background: '#f0fdf4', color: '#16a34a', padding: '3px 10px',
                      borderRadius: 20, fontSize: 12, fontWeight: 500
                    }}>{s}</span>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e' }}>
                    ₹{expert.expertProfile?.subscriptionFee || 0}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>/month</span>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSubscribe(expert)}
                  disabled={subscribing === expert._id}
                >
                  {subscribing === expert._id ? 'Processing...' : '⭐ Subscribe'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
