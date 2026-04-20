const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

// Define service routes
app.use('/service1', function(req, res) {
    proxy.web(req, res, { target: 'http://localhost:3001' });
});

app.use('/service2', function(req, res) {
    proxy.web(req, res, { target: 'http://localhost:3002' });
});

app.use('/service3', function(req, res) {
    proxy.web(req, res, { target: 'http://localhost:3003' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
