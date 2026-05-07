const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === 'Admin' ? 'Admin' : 'Member';
        
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, userRole], function(err) {
            if (err) {
                console.error('Signup Database Error:', err);
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: `Database error: ${err.message}` });
            }
            res.status(201).json({ message: 'User created successfully', id: this.lastID });
        });
    } catch (err) {
        console.error('Signup Server Error:', err);
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1d' });
        
        res.json({ message: 'Logged in successfully', token, user: { id: user.id, username: user.username, role: user.role } });
    });
});

router.get('/users', (req, res) => {
    db.all('SELECT id, username, role FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

module.exports = router;
