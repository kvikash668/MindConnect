const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expert:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:     { type: Number, required: true },
  currency:   { type: String, default: 'INR' },
  status:     { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
