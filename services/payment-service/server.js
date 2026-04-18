require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PAYMENT_SERVICE_PORT || 5004;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindconnect')
  .then(() => console.log('✅ Payment Service: MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/', paymentRoutes);
app.get('/health', (req, res) => res.json({ service: 'payment', status: 'ok' }));

app.listen(PORT, () => console.log(`💳 Payment Service running on port ${PORT}`));
