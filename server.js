const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', { // Update with your MongoDB connection string
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => console.error('Could not connect to MongoDB:', err));

// Mount auth routes
app.use('/register', authRoutes);
app.use('/login', authRoutes);

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
