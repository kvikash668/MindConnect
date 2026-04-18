require('dotenv').config({ path: '../../.env' });
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('combined'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'API Gateway running', timestamp: new Date() }));

// Service URLs
const AUTH_URL    = `http://localhost:${process.env.AUTH_SERVICE_PORT    || 5001}`;
const USER_URL    = `http://localhost:${process.env.USER_SERVICE_PORT    || 5002}`;
const SOCIAL_URL  = `http://localhost:${process.env.SOCIAL_SERVICE_PORT  || 5003}`;
const PAYMENT_URL = `http://localhost:${process.env.PAYMENT_SERVICE_PORT || 5004}`;

const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error(`Proxy error to ${target}:`, err.message);
      res.status(503).json({ error: 'Service temporarily unavailable' });
    }
  }
});

// Route proxies
app.use('/api/auth',    createProxyMiddleware(proxyOptions(AUTH_URL)));
app.use('/api/users',   createProxyMiddleware(proxyOptions(USER_URL)));
app.use('/api/social',  createProxyMiddleware(proxyOptions(SOCIAL_URL)));
app.use('/api/payment', createProxyMiddleware(proxyOptions(PAYMENT_URL)));

app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running at http://localhost:${PORT}`);
  console.log(`   → Auth    → ${AUTH_URL}`);
  console.log(`   → Users   → ${USER_URL}`);
  console.log(`   → Social  → ${SOCIAL_URL}`);
  console.log(`   → Payment → ${PAYMENT_URL}\n`);
});
