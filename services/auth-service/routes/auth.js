const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, isExpert: user.isExpert },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /register
router.post('/register',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, password } = req.body;
      if (await User.findOne({ email }))
        return res.status(400).json({ error: 'Email already registered' });

      const user = await User.create({ name, email, password });
      const token = signToken(user);
      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, isExpert: user.isExpert, avatar: user.avatar }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /login
router.post('/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ error: 'Invalid credentials' });

      const token = signToken(user);
      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, isExpert: user.isExpert, avatar: user.avatar, bio: user.bio }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /update-profile
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /become-expert
router.post('/become-expert', authMiddleware, async (req, res) => {
  try {
    const { title, specialization, subscriptionFee, description } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        isExpert: true,
        expertProfile: { title, specialization, subscriptionFee, description, isApproved: true }
      },
      { new: true }
    ).select('-password');
    res.json({ message: 'You are now an expert!', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
