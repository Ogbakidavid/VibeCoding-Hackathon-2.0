const express = require('express');
const router = express.Router();
const { sampleFreelancers } = require('../data/sampleData');
const { processWithClaudeLogic } = require('../services/aiService');

/**
 * Get sample freelancers
 */
router.get('/freelancers', (req, res) => {
    res.json({
        success: true,
        freelancers: sampleFreelancers,
        count: sampleFreelancers.length
    });
});

/**
 * Get specific freelancer details
 */
router.get('/freelancers/:id', (req, res) => {
    const { id } = req.params;
    const freelancer = sampleFreelancers.find(fl => fl.id === id);

    if (!freelancer) {
        return res.status(404).json({
            success: false,
            error: 'Freelancer not found'
        });
    }

    res.json({
        success: true,
        freelancer
    });
});

/**
 * Claude-style freelancer matching endpoint
 */
router.post('/match-freelancer', async (req, res) => {
    try {
        const {
            project_description,
            budget_range,
            timeline,
            priority_level,
            client_location,
            communication_preference,
            freelancer_ids
        } = req.body;

        // Validation
        if (!project_description || project_description.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Project description is required'
            });
        }

        // Determine which freelancers to consider
        let freelancersToMatch = sampleFreelancers;
        if (freelancer_ids && Array.isArray(freelancer_ids) && freelancer_ids.length > 0) {
            freelancersToMatch = sampleFreelancers.filter(fl => freelancer_ids.includes(fl.id));
        }

        // Enhance project description with additional context
        let enhancedDescription = project_description;
        if (budget_range) enhancedDescription += ` Budget: ${budget_range}.`;
        if (timeline) enhancedDescription += ` Timeline: ${timeline}.`;
        if (priority_level) enhancedDescription += ` Priority: ${priority_level}.`;

        console.log(`Processing match request for: "${enhancedDescription.substring(0, 100)}..."`);

        // Process with Claude-style logic
        const matchResult = await processWithClaudeLogic(enhancedDescription, freelancersToMatch);

        res.json({
            success: true,
            match_result: matchResult,
            request_context: {
                project_description,
                freelancers_considered: freelancersToMatch.length,
                budget_range,
                timeline,
                priority_level,
                client_location,
                communication_preference
            }
        });

    } catch (error) {
        console.error('Error in match-freelancer endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during freelancer matching',
            message: error.message
        });
    }
});

module.exports = router;