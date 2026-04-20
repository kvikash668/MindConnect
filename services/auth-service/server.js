'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const router = express.Router();

// Middleware for CORS, logging, and body parsing
router.use(cors());
router.use(morgan('dev'));
router.use(bodyParser.json({ limit: '10mb' })); // increased limit
router.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // increased limit

// Example middleware for error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Auth routes can be mounted here
router.get('/', (req, res) => {
    res.send('Auth service is up and running!');
});

// Mount routes at /api/auth
const authService = express();
authService.use('/api/auth', router);

module.exports = authService;