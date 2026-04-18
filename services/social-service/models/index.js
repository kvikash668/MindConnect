const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, required: true },
  authorName:{ type: String },
  authorAvatar:{ type: String, default: '' },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  author:      { type: mongoose.Schema.Types.ObjectId, required: true },
  authorName:  { type: String },
  authorAvatar:{ type: String, default: '' },
  content:     { type: String, required: true, maxlength: 2000 },
  mood:        { type: String, enum: ['happy', 'sad', 'anxious', 'angry', 'neutral', 'hopeful', 'overwhelmed'], default: 'neutral' },
  isAnonymous: { type: Boolean, default: false },
  likes:       [{ type: mongoose.Schema.Types.ObjectId }],
  comments:    [commentSchema],
  tags:        [String],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = {
  Post: mongoose.model('Post', postSchema)
};
