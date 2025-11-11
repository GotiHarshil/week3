require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./src/routes/auth');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// CORS for cookies
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, // e.g. http://localhost:3000
    credentials: true,
}));

// Connect DB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Database connected'))
    .catch((err) => {
        console.error('DB connection error:', err);
        process.exit(1);
    });

// Routes
app.use('/api/auth', authRoutes);

// Central error handler
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({error: err.message || 'Server error'});
});

const PORT = process.env.PORT || 8000;
// Only start the server when this file is run directly.
// This prevents the app from starting a listener during tests (which would keep
// Jest from exiting due to open handles). Tests should require the app and
// let the test runner handle starting/stopping if needed.
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
}

module.exports = app;