const express = require('express');
const crypto  = require('crypto');
const jwt     = require('jsonwebtoken');
const Razorpay = require('razorpay');
const Payment  = require('../models/Payment');

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

// Razorpay instance (will work with test keys)
const getRazorpay = () => new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

/* ─── CREATE ORDER ─── */
router.post('/create-order', auth, async (req, res) => {
  try {
    const { expertId, amount } = req.body;

    // In demo mode without real Razorpay keys, return a mock order
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_your_key_here') {
      const mockOrder = {
        id: 'order_demo_' + Date.now(),
        amount: amount * 100,
        currency: 'INR',
        status: 'created'
      };
      const payment = await Payment.create({
        subscriber: req.user.id,
        expert: expertId,
        amount,
        razorpayOrderId: mockOrder.id,
        status: 'created'
      });
      return res.json({ order: mockOrder, payment, demo: true });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    const payment = await Payment.create({
      subscriber: req.user.id,
      expert: expertId,
      amount,
      razorpayOrderId: order.id,
      status: 'created'
    });

    res.json({ order, payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── VERIFY PAYMENT ─── */
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, expertId } = req.body;

    // Demo mode: auto-verify
    if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_secret_here') {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { razorpayPaymentId: razorpay_payment_id || 'demo_pay_id', status: 'paid' }
      );
      return res.json({ success: true, message: 'Demo payment verified! Subscription activated.' });
    }

    // Real verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ error: 'Payment verification failed' });

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'paid' }
    );

    res.json({ success: true, message: 'Payment verified! Subscription activated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── PAYMENT HISTORY ─── */
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ subscriber: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
