require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./config/logger');
const userRoutes = require('./routes/userRoutes');
const campRoutes = require('./routes/campRoutes');
// const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
// const donorRoutes = require('./routes/donorRoutes');
// const campRoutes = require('./routes/campRoutes');

// Log startup
logger.info('Starting BOSS Backend Server');
logger.info('Environment:', process.env.NODE_ENV || 'development');
logger.info('MongoDB URI:', process.env.MONGO_URI || 'mongodb://localhost:27017/boss-backend');
logger.info('Server Port:', process.env.PORT || 4000);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/boss-backend')
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/camps', campRoutes);
// app.use('/api/requester', bloodRequestRoutes);
// app.use('/api/camps', campRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Error in request:', {
        path: req.path,
        method: req.method,
        error: err.message,
        stack: err.stack
    });
    res.status(500).json({ error: 'Internal Server Error' });
});
