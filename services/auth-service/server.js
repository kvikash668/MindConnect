'use strict';

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', true);

const app  = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindconnect-auth';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB then start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Auth Service: MongoDB connected');
    app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Auth Service: MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
