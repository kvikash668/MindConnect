const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 4000;

app.set('trust proxy', 1);

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});
app.use(limiter);

app.get('/health', (req, res) => res.json({ status: 'API Gateway running', timestamp: new Date() }));

const AUTH_URL    = `http://localhost:${process.env.AUTH_SERVICE_PORT    || 5001}`;
const USER_URL    = `http://localhost:${process.env.USER_SERVICE_PORT    || 5002}`;
const SOCIAL_URL  = `http://localhost:${process.env.SOCIAL_SERVICE_PORT  || 5003}`;
const PAYMENT_URL = `http://localhost:${process.env.PAYMENT_SERVICE_PORT || 5004}`;

const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error('[PROXY ERROR]', target, err.message);
      res.status(503).json({ error: 'Service temporarily unavailable' });
    },
    proxyReq: (proxyReq, req) => {
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  }
});

app.use('/api/auth',    express.json(), createProxyMiddleware(proxyOptions(AUTH_URL)));
app.use('/api/users',   express.json(), createProxyMiddleware(proxyOptions(USER_URL)));
app.use('/api/social',  express.json(), createProxyMiddleware(proxyOptions(SOCIAL_URL)));
app.use('/api/payment', express.json(), createProxyMiddleware(proxyOptions(PAYMENT_URL)));

app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running at http://localhost:${PORT}`);
  console.log(`   → Auth    → ${AUTH_URL}`);
  console.log(`   → Users   → ${USER_URL}`);
  console.log(`   → Social  → ${SOCIAL_URL}`);
  console.log(`   → Payment → ${PAYMENT_URL}\n`);
});