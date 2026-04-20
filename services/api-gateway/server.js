// server.js

const express = require('express');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');

const app = express();

// Middleware to handle request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Timeout configuration
app.use(timeout('5s'));

app.post('/your-endpoint', (req, res) => {
    // Handle your request here
    res.send('Request received');
});

app.use((req, res, next) => {
    res.status(408).send('Request Timeout');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
