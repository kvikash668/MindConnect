const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  subscriber:      { type: mongoose.Schema.Types.ObjectId, required: true },
  expert:          { type: mongoose.Schema.Types.ObjectId, required: true },
  amount:          { type: Number, required: true },
  currency:        { type: String, default: 'INR' },
  razorpayOrderId: { type: String },
  razorpayPaymentId:{ type: String },
  razorpaySignature:{ type: String },
  status:          { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  createdAt:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
