require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
 
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', env: process.env.VERCEL ? 'vercel' : 'local' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Serve static files from the React frontend app
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

// Anything that doesn't match the API routes, send back the frontend index.html
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
 
// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
