const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { registerUser } = require('../middleware/auth');
const { strictLimiter } = require('../config/server');

router.post('/register', strictLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('firstName').trim().isLength({ min: 1, max: 50 }),
    body('lastName').trim().isLength({ min: 1, max: 50 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password, firstName, lastName } = req.body;
        const user = await registerUser(email, password, firstName, lastName);
        
        const token = jwt.sign(
            { userId: user.userId, email }, 
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            success: true,
            token,
            user: {
                userId: user.userId,
                email,
                firstName,
                lastName,
                subscriptionTier: 'FREE'
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.post('/login', strictLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = users.get(email);
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user.userId, email }, 
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                userId: user.userId,
                email,
                firstName: user.firstName,
                lastName: user.lastName,
                subscriptionTier: user.subscriptionTier
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;