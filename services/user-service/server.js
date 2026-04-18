require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 5002;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindconnect')
  .then(() => console.log('✅ User Service: MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/', userRoutes);
app.get('/health', (req, res) => res.json({ service: 'users', status: 'ok' }));

app.listen(PORT, () => console.log(`👥 User Service running on port ${PORT}`));
