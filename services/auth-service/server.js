require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindconnect')
  .then(() => console.log('✅ Auth Service: MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/', authRoutes);
app.get('/health', (req, res) => res.json({ service: 'auth', status: 'ok' }));

app.listen(PORT, () => console.log(`🔐 Auth Service running on port ${PORT}`));
