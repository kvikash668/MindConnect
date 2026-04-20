const express = require('express');
const jwt = require('jsonwebtoken');
const { Post } = require('../models');

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

/* ─── CREATE POST ─── */
router.post('/posts', auth, async (req, res) => {
  try {
    const { content, mood, isAnonymous, tags } = req.body;
    const post = await Post.create({
      author:       req.user.id,
      authorName:   isAnonymous ? 'Anonymous' : req.user.name || 'User',
      authorAvatar: isAnonymous ? '' : (req.user.avatar || ''),
      content, mood, isAnonymous, tags
    });
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── GET FEED (all posts, sorted by date) ─── */
router.get('/posts', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Post.countDocuments();
    res.json({ posts, total, page: Number(page) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── GET MY POSTS ─── */
router.get('/posts/mine', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── GET POST BY ID ─── */
router.get('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── DELETE POST ─── */
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ error: 'Post not found or not authorized' });
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── LIKE / UNLIKE POST ─── */
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const idx = post.likes.indexOf(req.user.id);
    if (idx === -1) post.likes.push(req.user.id);
    else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likes: post.likes.length, liked: idx === -1 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── ADD COMMENT ─── */
router.post('/posts/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({
      author:       req.user.id,
      authorName:   req.user.name || 'User',
      authorAvatar: req.user.avatar || '',
      content
    });
    await post.save();
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── DELETE COMMENT ─── */
router.delete('/posts/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });
    comment.deleteOne();
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
