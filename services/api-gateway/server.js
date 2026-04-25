const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app  = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

const services = {
  auth:    `http://localhost:${process.env.AUTH_SERVICE_PORT    || 5001}`,
  user:    `http://localhost:${process.env.USER_SERVICE_PORT    || 5002}`,
  social:  `http://localhost:${process.env.SOCIAL_SERVICE_PORT  || 5003}`,
  payment: `http://localhost:${process.env.PAYMENT_SERVICE_PORT || 5004}`,
};

const proxyOpts = (target) => ({
  target,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
      res.status(502).json({ message: 'Gateway error', error: err.message });
    }
  }
});

app.use('/api/auth',    createProxyMiddleware(proxyOpts(services.auth)));
app.use('/api/users',   createProxyMiddleware(proxyOpts(services.user)));
app.use('/api/social',  createProxyMiddleware(proxyOpts(services.social)));
app.use('/api/payment', createProxyMiddleware(proxyOpts(services.payment)));

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/', (req, res) => res.json({ status: 'API Gateway Running', services }));

app.listen(PORT, () => console.log(`API Gateway is running on port ${PORT}`));