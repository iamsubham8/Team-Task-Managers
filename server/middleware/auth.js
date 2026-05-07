const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };
