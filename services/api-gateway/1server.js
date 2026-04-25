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

app.use('/api/auth',    createProxyMiddleware({ target: services.auth,    changeOrigin: true, on: { error: (err,req,res) => res.status(502).json({ error: err.message }) } }));
app.use('/api/users',   createProxyMiddleware({ target: services.user,    changeOrigin: true, pathRewrite: { '^/api/users':   '' }, on: { error: (err,req,res) => res.status(502).json({ error: err.message }) } }));
app.use('/api/social',  createProxyMiddleware({ target: services.social,  changeOrigin: true, pathRewrite: { '^/api/social':  '' }, on: { error: (err,req,res) => res.status(502).json({ error: err.message }) } }));
app.use('/api/payment', createProxyMiddleware({ target: services.payment, changeOrigin: true, pathRewrite: { '^/api/payment': '' }, on: { error: (err,req,res) => res.status(502).json({ error: err.message }) } }));

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/', (req, res) => res.json({ status: 'API Gateway Running', services }));

const server = app.listen(PORT, () => console.log(`API Gateway is running on port ${PORT}`));
server.maxHeaderSize = 32768;
