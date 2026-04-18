const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Friendship, Subscription } = require('../models');

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

/* ─── USER SEARCH ─── */
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }],
      _id: { $ne: req.user.id }
    }).select('name email avatar bio isExpert expertProfile').limit(20);
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── GET USER BY ID ─── */
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── FRIEND REQUEST ─── */
router.post('/friends/request/:recipientId', auth, async (req, res) => {
  try {
    const exists = await Friendship.findOne({
      $or: [
        { requester: req.user.id, recipient: req.params.recipientId },
        { requester: req.params.recipientId, recipient: req.user.id }
      ]
    });
    if (exists) return res.status(400).json({ error: 'Friend request already exists' });
    const friendship = await Friendship.create({ requester: req.user.id, recipient: req.params.recipientId });
    res.status(201).json(friendship);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── ACCEPT / REJECT ─── */
router.put('/friends/:friendshipId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const friendship = await Friendship.findOneAndUpdate(
      { _id: req.params.friendshipId, recipient: req.user.id },
      { status },
      { new: true }
    );
    if (!friendship) return res.status(404).json({ error: 'Request not found' });
    res.json(friendship);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── MY FRIENDS ─── */
router.get('/friends/list', auth, async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
      status: 'accepted'
    }).populate('requester recipient', 'name email avatar bio isExpert');
    const friends = friendships.map(f =>
      f.requester._id.toString() === req.user.id ? f.recipient : f.requester
    );
    res.json(friends);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── PENDING REQUESTS ─── */
router.get('/friends/pending', auth, async (req, res) => {
  try {
    const pending = await Friendship.find({ recipient: req.user.id, status: 'pending' })
      .populate('requester', 'name email avatar');
    res.json(pending);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── ALL EXPERTS ─── */
router.get('/experts/all', auth, async (req, res) => {
  try {
    const experts = await User.find({ isExpert: true }).select('name email avatar bio expertProfile');
    res.json(experts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── MY SUBSCRIPTIONS ─── */
router.get('/subscriptions/my', auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ subscriber: req.user.id, status: 'active' })
      .populate('expert', 'name email avatar expertProfile');
    res.json(subs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── CREATE SUBSCRIPTION (called by payment service) ─── */
router.post('/subscriptions', auth, async (req, res) => {
  try {
    const { expertId } = req.body;
    const existing = await Subscription.findOne({ subscriber: req.user.id, expert: expertId, status: 'active' });
    if (existing) return res.status(400).json({ error: 'Already subscribed' });
    const sub = await Subscription.create({ subscriber: req.user.id, expert: expertId });
    res.status(201).json(sub);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
