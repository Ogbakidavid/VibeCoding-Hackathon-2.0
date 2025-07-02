const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users } = require('../data/sampleData');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

const registerUser = async (email, password, firstName, lastName) => {
    if (users.has(email)) {
        throw new Error('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user = {
        userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        subscriptionTier: 'FREE',
        createdAt: new Date(),
        isActive: true
    };
    
    users.set(email, user);
    users.set(userId, user);
    
    return user;
};

module.exports = {
    authenticateToken,
    registerUser
};