const express = require('express');
const router = express.Router();
const { sampleFreelancers } = require('../data/sampleData');
const { processWithClaudeLogic } = require('../services/aiService');

/**
 * Enhanced chat endpoint with Claude-style processing
 */
router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        console.log(`Processing chat message: "${message.substring(0, 100)}..."`);

        // Process with Claude-style logic
        const matchResult = await processWithClaudeLogic(message, sampleFreelancers);

        res.json({
            success: true,
            response: matchResult.summary_message,
            match_result: matchResult,
            context: context
        });

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process chat message',
            message: error.message
        });
    }
});

/**
 * Legacy endpoint for backward compatibility
 */
router.post('/chat/process', async (req, res) => {
    try {
        const { message, freelancers } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Valid message is required'
            });
        }

        const freelancersToUse = freelancers && freelancers.length > 0 ? freelancers : sampleFreelancers;

        console.log(`Processing legacy chat request: "${message.substring(0, 100)}..."`);

        const matchResult = await processWithClaudeLogic(message, freelancersToUse);

        // Format response in legacy format
        const legacyResponse = `I've analyzed your project and found great matches!\n\n` +
            `🎯 Top Recommendation: ${matchResult.recommended_freelancer.name}\n` +
            `⭐ Match Score: ${matchResult.match_score}%\n` +
            `💰 Rate: $${matchResult.recommended_freelancer.hourly_rate}/hour\n` +
            `📍 Location: ${matchResult.recommended_freelancer.location}\n\n` +
            `${matchResult.summary_message}\n\n` +
            `Key Strengths:\n${matchResult.key_strengths.map(s => `• ${s}`).join('\n')}\n\n` +
            (matchResult.potential_concerns.length > 0 ?
                `Considerations:\n${matchResult.potential_concerns.map(c => `• ${c}`).join('\n')}\n\n` : '') +
            `Would you like me to connect you with ${matchResult.recommended_freelancer.name} or see more options?`;

        res.json({
            success: true,
            response: legacyResponse,
            metadata: {
                messageLength: message.length,
                freelancersCount: freelancersToUse.length,
                responseLength: legacyResponse.length,
                timestamp: new Date().toISOString(),
                aiProvider: 'Local Claude-Style Logic',
                matchScore: matchResult.match_score
            }
        });

    } catch (error) {
        console.error('Error processing legacy chat request:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'An unexpected error occurred'
        });
    }
});

module.exports = router;