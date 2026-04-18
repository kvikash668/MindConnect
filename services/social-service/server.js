require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socialRoutes = require('./routes/social');

const app = express();
const PORT = process.env.SOCIAL_SERVICE_PORT || 5003;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindconnect')
  .then(() => console.log('✅ Social Service: MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/', socialRoutes);
app.get('/health', (req, res) => res.json({ service: 'social', status: 'ok' }));

app.listen(PORT, () => console.log(`💬 Social Service running on port ${PORT}`));
