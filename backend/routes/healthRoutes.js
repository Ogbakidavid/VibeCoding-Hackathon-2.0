const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        aiProvider: 'Local Claude-Style Logic',
        features: ['intelligent_matching', 'skill_scoring', 'requirement_extraction']
    });
});

module.exports = router;