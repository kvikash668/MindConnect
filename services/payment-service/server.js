'use strict';

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindconnect-payment';

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'payment-service' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Payment Service: MongoDB connected');
    app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Payment Service: MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
