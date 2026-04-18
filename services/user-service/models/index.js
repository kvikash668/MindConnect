const mongoose = require('mongoose');

// Mirror of auth User (read-only operations here)
const userSchema = new mongoose.Schema({
  name:     { type: String },
  email:    { type: String },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '' },
  isExpert: { type: Boolean, default: false },
  expertProfile: {
    title:           String,
    specialization:  [String],
    subscriptionFee: Number,
    description:     String
  }
}, { collection: 'users' });

const friendshipSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:    { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const subscriptionSchema = new mongoose.Schema({
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expert:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:     { type: String, enum: ['active', 'cancelled'], default: 'active' },
  startDate:  { type: Date, default: Date.now },
  endDate:    { type: Date }
});

module.exports = {
  User:         mongoose.model('User', userSchema),
  Friendship:   mongoose.model('Friendship', friendshipSchema),
  Subscription: mongoose.model('Subscription', subscriptionSchema)
};
