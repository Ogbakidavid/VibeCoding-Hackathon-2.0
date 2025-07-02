// Claude-inspired matching criteria (adapted for local use)
const MATCHING_CRITERIA = {
    SKILL_MATCH: { weight: 40, priority: 1 },
    EXPERIENCE_LEVEL: { weight: 25, priority: 2 },
    AVAILABILITY: { weight: 20, priority: 3 },
    RATE_COMPATIBILITY: { weight: 10, priority: 4 },
    PORTFOLIO_RELEVANCE: { weight: 15, priority: 5 },
    RATING_QUALITY: { weight: 10, priority: 6 }
};

// Enhanced keyword mapping for better skill matching
const skillKeywords = {
    'logo': ['logo', 'brand', 'identity', 'design', 'creative', 'illustrator', 'photoshop'],
    'web_development': ['website', 'web', 'react', 'frontend', 'backend', 'fullstack', 'development', 'javascript', 'node', 'api'],
    'content_writing': ['content', 'writing', 'blog', 'copy', 'seo', 'copywriting', 'articles'],
    'ui_ux_design': ['ui', 'ux', 'interface', 'prototype', 'figma', 'adobe', 'user experience', 'design'],
    'social_media': ['marketing', 'social', 'instagram', 'facebook', 'ads', 'campaign', 'strategy'],
    'data_science': ['python', 'django', 'api', 'database', 'server', 'machine learning', 'data', 'analysis', 'ml', 'ai'],
    'mobile_development': ['mobile', 'app', 'ios', 'android', 'flutter', 'react native'],
    'ecommerce': ['ecommerce', 'e-commerce', 'online store', 'shop', 'payment', 'cart']
};

/**
 * Claude-inspired project requirement extraction
 */
function extractProjectRequirements(message) {
    const lowerMessage = message.toLowerCase();

    // Extract budget with multiple patterns
    const budgetPatterns = [
        /budget.*?[\$](\d+(?:,\d{3})*(?:\.\d{2})?)/i,
        /[\$](\d+(?:,\d{3})*(?:\.\d{2})?)/,
        /(\d+(?:,\d{3})*)\s*(?:dollars?|usd)/i
    ];

    let budget = null;
    for (const pattern of budgetPatterns) {
        const match = message.match(pattern);
        if (match) {
            budget = parseInt(match[1].replace(/,/g, ''));
            break;
        }
    }

    // Extract timeline with enhanced patterns
    const timelinePatterns = {
        'urgent': ['urgent', 'asap', 'immediately', 'today', 'emergency'],
        '1-3 days': ['tomorrow', '1 day', '2 days', '3 days', 'few days'],
        '1 week': ['week', '7 days', 'one week'],
        '2-4 weeks': ['2 weeks', '3 weeks', '4 weeks', 'month'],
        '1-2 months': ['month', '6 weeks', '8 weeks', '2 months'],
        'flexible': ['flexible', 'no rush', 'whenever']
    };

    let timeline = 'not specified';
    let urgency = 'medium';

    for (const [period, keywords] of Object.entries(timelinePatterns)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            timeline = period;
            urgency = period === 'urgent' ? 'high' : period.includes('days') ? 'high' : 'medium';
            break;
        }
    }

    // Determine project type and complexity
    let projectType = 'general';
    let matchedSkills = [];
    let complexity = 'medium';

    for (const [type, keywords] of Object.entries(skillKeywords)) {
        const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
        if (matches.length > 0) {
            projectType = type;
            matchedSkills = matches;
            // Determine complexity based on keywords
            if (lowerMessage.includes('simple') || lowerMessage.includes('basic')) {
                complexity = 'low';
            } else if (lowerMessage.includes('complex') || lowerMessage.includes('advanced') || lowerMessage.includes('enterprise')) {
                complexity = 'high';
            }
            break;
        }
    }

    return {
        projectType,
        budget,
        timeline,
        urgency,
        matchedSkills,
        complexity,
        originalMessage: message
    };
}

/**
 * Claude-inspired freelancer scoring algorithm
 */
function calculateFreelancerScore(freelancer, requirements) {
    let totalScore = 0;
    const scoreBreakdown = {};

    // 1. Skill Match (40% weight)
    const freelancerSkillsLower = freelancer.skills.map(skill => skill.toLowerCase());
    const skillMatches = requirements.matchedSkills.filter(reqSkill =>
        freelancerSkillsLower.some(fSkill => fSkill.includes(reqSkill) || reqSkill.includes(fSkill))
    );

    if (skillMatches.length === 0) return null; // No skill match, exclude freelancer

    const skillScore = Math.min((skillMatches.length / requirements.matchedSkills.length) * 100, 100);
    scoreBreakdown.skillMatch = skillScore;
    totalScore += skillScore * (MATCHING_CRITERIA.SKILL_MATCH.weight / 100);

    // 2. Experience Level (25% weight)
    const experienceScore = Math.min((freelancer.experience_years / 10) * 100, 100);
    // Adjust for complexity
    let experienceAdjustment = 1;
    if (requirements.complexity === 'high' && freelancer.experience_years >= 5) {
        experienceAdjustment = 1.2;
    } else if (requirements.complexity === 'low' && freelancer.experience_years >= 2) {
        experienceAdjustment = 1.1;
    }

    scoreBreakdown.experience = experienceScore * experienceAdjustment;
    totalScore += (experienceScore * experienceAdjustment) * (MATCHING_CRITERIA.EXPERIENCE_LEVEL.weight / 100);

    // 3. Availability (20% weight)
    let availabilityScore = 50; // Default
    if (requirements.urgency === 'high') {
        if (freelancer.availability.toLowerCase().includes('immediately')) {
            availabilityScore = 100;
        } else if (freelancer.availability.toLowerCase().includes('available')) {
            availabilityScore = 70;
        }
    } else {
        if (freelancer.availability.toLowerCase().includes('available')) {
            availabilityScore = 90;
        }
    }

    scoreBreakdown.availability = availabilityScore;
    totalScore += availabilityScore * (MATCHING_CRITERIA.AVAILABILITY.weight / 100);

    // 4. Rate Compatibility (10% weight)
    let rateScore = 70; // Default
    if (requirements.budget) {
        const estimatedHours = requirements.budget / freelancer.hourly_rate;
        if (estimatedHours >= 10 && estimatedHours <= 80) {
            rateScore = 100;
        } else if (estimatedHours >= 5) {
            rateScore = 85;
        } else if (estimatedHours >= 2) {
            rateScore = 60;
        } else {
            rateScore = 30;
        }
    }

    scoreBreakdown.rateCompatibility = rateScore;
    totalScore += rateScore * (MATCHING_CRITERIA.RATE_COMPATIBILITY.weight / 100);

    // 5. Portfolio Relevance (15% weight)
    const portfolioMatches = freelancer.recent_work.filter(work =>
        requirements.matchedSkills.some(skill => work.toLowerCase().includes(skill))
    );
    const portfolioScore = Math.min((portfolioMatches.length / Math.max(freelancer.recent_work.length, 1)) * 100, 100);

    scoreBreakdown.portfolioRelevance = portfolioScore;
    totalScore += portfolioScore * (MATCHING_CRITERIA.PORTFOLIO_RELEVANCE.weight / 100);

    // 6. Rating Quality (10% weight)
    const ratingScore = (freelancer.rating / 5) * 100;
    scoreBreakdown.rating = ratingScore;
    totalScore += ratingScore * (MATCHING_CRITERIA.RATING_QUALITY.weight / 100);

    return {
        ...freelancer,
        matchScore: Math.round(totalScore),
        scoreBreakdown,
        matchedSkills: skillMatches
    };
}

/**
 * Claude-inspired response generation
 */
function generateClaudeStyleResponse(requirements, rankedFreelancers) {
    if (!rankedFreelancers || rankedFreelancers.length === 0) {
        return {
            recommended_freelancer: null,
            match_score: 0,
            summary_message: "I couldn't find any freelancers that match your specific requirements. Try broadening your search criteria or providing more details about your project needs.",
            key_strengths: [],
            potential_concerns: ["No suitable matches found with current criteria"]
        };
    }

    const topFreelancer = rankedFreelancers[0];
    const matchScore = topFreelancer.matchScore;

    // Generate summary message
    let summaryMessage = `I've found an excellent match for your ${requirements.projectType.replace('_', ' ')} project! `;
    summaryMessage += `${topFreelancer.name} is a ${topFreelancer.experience_years}-year experienced professional `;
    summaryMessage += `with a ${topFreelancer.rating}★ rating and ${topFreelancer.completed_projects} completed projects. `;

    if (requirements.budget) {
        const estimatedHours = Math.round(requirements.budget / topFreelancer.hourly_rate);
        summaryMessage += `At $${topFreelancer.hourly_rate}/hour, your $${requirements.budget} budget would cover approximately ${estimatedHours} hours of work. `;
    }

    summaryMessage += `They're ${topFreelancer.availability.toLowerCase()} and have direct experience in ${topFreelancer.matchedSkills.join(', ')}.`;

    // Generate key strengths
    const keyStrengths = [];

    if (topFreelancer.scoreBreakdown.skillMatch > 80) {
        keyStrengths.push(`Perfect skill match - expertise in ${topFreelancer.matchedSkills.join(', ')}`);
    }

    if (topFreelancer.experience_years >= 5) {
        keyStrengths.push(`Extensive experience (${topFreelancer.experience_years} years) with ${topFreelancer.completed_projects} completed projects`);
    }

    if (topFreelancer.rating >= 4.8) {
        keyStrengths.push(`Excellent client feedback with ${topFreelancer.rating}★ rating and proven track record`);
    }

    if (requirements.urgency === 'high' && topFreelancer.availability.toLowerCase().includes('immediately')) {
        keyStrengths.push('Available to start immediately for your urgent timeline');
    }

    // Generate potential concerns
    const potentialConcerns = [];

    if (requirements.budget && (requirements.budget / topFreelancer.hourly_rate) < 5) {
        potentialConcerns.push('Budget may be limited for the scope - consider discussing project phases');
    }

    if (requirements.complexity === 'high' && topFreelancer.experience_years < 5) {
        potentialConcerns.push('Complex project may benefit from more senior-level experience');
    }

    if (topFreelancer.hourly_rate > 60 && requirements.budget && requirements.budget < 3000) {
        potentialConcerns.push('Premium rate specialist - ensure budget alignment before starting');
    }

    return {
        recommended_freelancer: {
            id: topFreelancer.id,
            name: topFreelancer.name,
            contact_method: "via_platform_messaging",
            hourly_rate: topFreelancer.hourly_rate,
            availability: topFreelancer.availability,
            rating: topFreelancer.rating,
            experience_years: topFreelancer.experience_years,
            skills: topFreelancer.skills,
            location: topFreelancer.location
        },
        match_score: matchScore,
        summary_message: summaryMessage,
        key_strengths: keyStrengths.slice(0, 3),
        potential_concerns: potentialConcerns,
        alternatives: rankedFreelancers.slice(1, 3).map(f => ({
            name: f.name,
            match_score: f.matchScore,
            hourly_rate: f.hourly_rate,
            key_skill: f.matchedSkills[0] || f.skills[0]
        }))
    };
}

/**
 * Main AI processing function with Claude-style logic
 */
async function processWithClaudeLogic(message, freelancers) {
    // Add realistic processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Extract requirements using Claude-inspired logic
    const requirements = extractProjectRequirements(message);
    console.log('Extracted requirements:', requirements);

    // Score and rank freelancers
    const scoredFreelancers = freelancers
        .map(freelancer => calculateFreelancerScore(freelancer, requirements))
        .filter(scored => scored !== null)
        .sort((a, b) => b.matchScore - a.matchScore);

    console.log('Top matches:', scoredFreelancers.slice(0, 3).map(f => ({ name: f.name, score: f.matchScore })));

    // Generate Claude-style response
    const response = generateClaudeStyleResponse(requirements, scoredFreelancers);

    return response;
}

module.exports = {
    processWithClaudeLogic,
    extractProjectRequirements,
    calculateFreelancerScore,
    generateClaudeStyleResponse
};