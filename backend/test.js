// // server.js - FreelancersBot with Local AI Simulation + Claude Prompt Logic
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const morgan = require('morgan');

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security & logging middleware
// app.use(helmet());
// app.use(morgan('dev'));

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Logging middleware
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next();
// });

// // Enhanced freelancer data with more detailed information
// const sampleFreelancers = [
//     {
//         id: "fl_001",
//         name: "Sarah Johnson",
//         skills: ["Logo Design", "Brand Identity", "Adobe Illustrator", "Photoshop", "Creative Direction"],
//         experience_years: 5,
//         rating: 4.9,
//         hourly_rate: 45,
//         availability: "Available immediately",
//         location: "New York, USA",
//         completed_projects: 127,
//         recent_work: ["Tech startup logo", "Restaurant brand identity", "E-commerce brand package"],
//         bio: "Specialized in modern, minimalist logos for startups and tech companies. Award-winning designer with 5+ years of experience."
//     },
//     {
//         id: "fl_002",
//         name: "Mike Chen",
//         skills: ["React", "Node.js", "Full-Stack Development", "MongoDB", "AWS", "JavaScript", "API Development"],
//         experience_years: 7,
//         rating: 4.8,
//         hourly_rate: 65,
//         availability: "Available in 2 days",
//         location: "San Francisco, USA",
//         completed_projects: 89,
//         recent_work: ["E-commerce platform", "SaaS dashboard", "Mobile app backend"],
//         bio: "Expert in modern web applications, e-commerce platforms, and SaaS solutions. Full-stack developer with cloud expertise."
//     },
//     {
//         id: "fl_003",
//         name: "Emma Rodriguez",
//         skills: ["Content Writing", "SEO", "Blog Writing", "Copywriting", "Content Strategy"],
//         experience_years: 4,
//         rating: 4.7,
//         hourly_rate: 35,
//         availability: "Available immediately",
//         location: "Austin, USA",
//         completed_projects: 156,
//         recent_work: ["Tech blog content", "SaaS website copy", "Email marketing campaigns"],
//         bio: "Engaging content for tech startups, SaaS companies, and e-commerce brands. SEO-optimized writing specialist."
//     },
//     {
//         id: "fl_004",
//         name: "David Kim",
//         skills: ["UI/UX Design", "Figma", "Adobe XD", "Prototyping", "User Research", "Mobile UI"],
//         experience_years: 6,
//         rating: 4.9,
//         hourly_rate: 55,
//         availability: "Available next week",
//         location: "Toronto, Canada",
//         completed_projects: 73,
//         recent_work: ["Mobile app redesign", "SaaS dashboard UI", "E-commerce UX audit"],
//         bio: "Award-winning mobile and web app designs for Fortune 500 companies. User-centered design approach."
//     },
//     {
//         id: "fl_005",
//         name: "Alex Thompson",
//         skills: ["Python", "Django", "Machine Learning", "Data Analysis", "API Development", "AI Integration"],
//         experience_years: 8,
//         rating: 4.8,
//         hourly_rate: 70,
//         availability: "Available immediately",
//         location: "London, UK",
//         completed_projects: 65,
//         recent_work: ["AI chatbot development", "Data pipeline automation", "ML model deployment"],
//         bio: "Backend systems and ML solutions for fintech and healthcare companies. AI/ML specialist with 8+ years experience."
//     },
//     {
//         id: "fl_006",
//         name: "Maria Garcia",
//         skills: ["Social Media Marketing", "Instagram", "Facebook Ads", "Content Strategy", "Influencer Marketing"],
//         experience_years: 3,
//         rating: 4.6,
//         hourly_rate: 40,
//         availability: "Available immediately",
//         location: "Miami, USA",
//         completed_projects: 98,
//         recent_work: ["Social media campaign", "Influencer collaboration", "Content calendar strategy"],
//         bio: "Helped 50+ small businesses grow their social media presence and sales. Creative marketing strategist."
//     },
//     {
//         id: "fl_007",
//         name: "Jennifer Walsh",
//         skills: ["Flutter", "Dart", "Mobile Development", "iOS", "Android", "Firebase"],
//         experience_years: 4,
//         rating: 4.8,
//         hourly_rate: 60,
//         availability: "Available next week",
//         location: "Vancouver, Canada",
//         completed_projects: 34,
//         recent_work: ["Cross-platform mobile app", "Firebase integration", "App store deployment"],
//         bio: "Mobile app developer specializing in Flutter cross-platform development. Expert in creating native-feeling apps for both iOS and Android."
//     }
// ];

// // Claude-inspired matching criteria (adapted for local use)
// const MATCHING_CRITERIA = {
//     SKILL_MATCH: { weight: 40, priority: 1 },
//     EXPERIENCE_LEVEL: { weight: 25, priority: 2 },
//     AVAILABILITY: { weight: 20, priority: 3 },
//     RATE_COMPATIBILITY: { weight: 10, priority: 4 },
//     PORTFOLIO_RELEVANCE: { weight: 15, priority: 5 },
//     RATING_QUALITY: { weight: 10, priority: 6 }
// };

// // Enhanced keyword mapping for better skill matching
// const skillKeywords = {
//     'logo': ['logo', 'brand', 'identity', 'design', 'creative', 'illustrator', 'photoshop'],
//     'web_development': ['website', 'web', 'react', 'frontend', 'backend', 'fullstack', 'development', 'javascript', 'node', 'api'],
//     'content_writing': ['content', 'writing', 'blog', 'copy', 'seo', 'copywriting', 'articles'],
//     'ui_ux_design': ['ui', 'ux', 'interface', 'prototype', 'figma', 'adobe', 'user experience', 'design'],
//     'social_media': ['marketing', 'social', 'instagram', 'facebook', 'ads', 'campaign', 'strategy'],
//     'data_science': ['python', 'django', 'api', 'database', 'server', 'machine learning', 'data', 'analysis', 'ml', 'ai'],
//     'mobile_development': ['mobile', 'app', 'ios', 'android', 'flutter', 'react native'],
//     'ecommerce': ['ecommerce', 'e-commerce', 'online store', 'shop', 'payment', 'cart']
// };

// /**
//  * Claude-inspired project requirement extraction
//  */
// function extractProjectRequirements(message) {
//     const lowerMessage = message.toLowerCase();

//     // Extract budget with multiple patterns
//     const budgetPatterns = [
//         /budget.*?[\$](\d+(?:,\d{3})*(?:\.\d{2})?)/i,
//         /[\$](\d+(?:,\d{3})*(?:\.\d{2})?)/,
//         /(\d+(?:,\d{3})*)\s*(?:dollars?|usd)/i
//     ];

//     let budget = null;
//     for (const pattern of budgetPatterns) {
//         const match = message.match(pattern);
//         if (match) {
//             budget = parseInt(match[1].replace(/,/g, ''));
//             break;
//         }
//     }

//     // Extract timeline with enhanced patterns
//     const timelinePatterns = {
//         'urgent': ['urgent', 'asap', 'immediately', 'today', 'emergency'],
//         '1-3 days': ['tomorrow', '1 day', '2 days', '3 days', 'few days'],
//         '1 week': ['week', '7 days', 'one week'],
//         '2-4 weeks': ['2 weeks', '3 weeks', '4 weeks', 'month'],
//         '1-2 months': ['month', '6 weeks', '8 weeks', '2 months'],
//         'flexible': ['flexible', 'no rush', 'whenever']
//     };

//     let timeline = 'not specified';
//     let urgency = 'medium';

//     for (const [period, keywords] of Object.entries(timelinePatterns)) {
//         if (keywords.some(keyword => lowerMessage.includes(keyword))) {
//             timeline = period;
//             urgency = period === 'urgent' ? 'high' : period.includes('days') ? 'high' : 'medium';
//             break;
//         }
//     }

//     // Determine project type and complexity
//     let projectType = 'general';
//     let matchedSkills = [];
//     let complexity = 'medium';

//     for (const [type, keywords] of Object.entries(skillKeywords)) {
//         const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
//         if (matches.length > 0) {
//             projectType = type;
//             matchedSkills = matches;
//             // Determine complexity based on keywords
//             if (lowerMessage.includes('simple') || lowerMessage.includes('basic')) {
//                 complexity = 'low';
//             } else if (lowerMessage.includes('complex') || lowerMessage.includes('advanced') || lowerMessage.includes('enterprise')) {
//                 complexity = 'high';
//             }
//             break;
//         }
//     }

//     return {
//         projectType,
//         budget,
//         timeline,
//         urgency,
//         matchedSkills,
//         complexity,
//         originalMessage: message
//     };
// }

// /**
//  * Claude-inspired freelancer scoring algorithm
//  */
// function calculateFreelancerScore(freelancer, requirements) {
//     let totalScore = 0;
//     const scoreBreakdown = {};

//     // 1. Skill Match (40% weight)
//     const freelancerSkillsLower = freelancer.skills.map(skill => skill.toLowerCase());
//     const skillMatches = requirements.matchedSkills.filter(reqSkill =>
//         freelancerSkillsLower.some(fSkill => fSkill.includes(reqSkill) || reqSkill.includes(fSkill))
//     );

//     if (skillMatches.length === 0) return null; // No skill match, exclude freelancer

//     const skillScore = Math.min((skillMatches.length / requirements.matchedSkills.length) * 100, 100);
//     scoreBreakdown.skillMatch = skillScore;
//     totalScore += skillScore * (MATCHING_CRITERIA.SKILL_MATCH.weight / 100);

//     // 2. Experience Level (25% weight)
//     const experienceScore = Math.min((freelancer.experience_years / 10) * 100, 100);
//     // Adjust for complexity
//     let experienceAdjustment = 1;
//     if (requirements.complexity === 'high' && freelancer.experience_years >= 5) {
//         experienceAdjustment = 1.2;
//     } else if (requirements.complexity === 'low' && freelancer.experience_years >= 2) {
//         experienceAdjustment = 1.1;
//     }

//     scoreBreakdown.experience = experienceScore * experienceAdjustment;
//     totalScore += (experienceScore * experienceAdjustment) * (MATCHING_CRITERIA.EXPERIENCE_LEVEL.weight / 100);

//     // 3. Availability (20% weight)
//     let availabilityScore = 50; // Default
//     if (requirements.urgency === 'high') {
//         if (freelancer.availability.toLowerCase().includes('immediately')) {
//             availabilityScore = 100;
//         } else if (freelancer.availability.toLowerCase().includes('available')) {
//             availabilityScore = 70;
//         }
//     } else {
//         if (freelancer.availability.toLowerCase().includes('available')) {
//             availabilityScore = 90;
//         }
//     }

//     scoreBreakdown.availability = availabilityScore;
//     totalScore += availabilityScore * (MATCHING_CRITERIA.AVAILABILITY.weight / 100);

//     // 4. Rate Compatibility (10% weight)
//     let rateScore = 70; // Default
//     if (requirements.budget) {
//         const estimatedHours = requirements.budget / freelancer.hourly_rate;
//         if (estimatedHours >= 10 && estimatedHours <= 80) {
//             rateScore = 100;
//         } else if (estimatedHours >= 5) {
//             rateScore = 85;
//         } else if (estimatedHours >= 2) {
//             rateScore = 60;
//         } else {
//             rateScore = 30;
//         }
//     }

//     scoreBreakdown.rateCompatibility = rateScore;
//     totalScore += rateScore * (MATCHING_CRITERIA.RATE_COMPATIBILITY.weight / 100);

//     // 5. Portfolio Relevance (15% weight)
//     const portfolioMatches = freelancer.recent_work.filter(work =>
//         requirements.matchedSkills.some(skill => work.toLowerCase().includes(skill))
//     );
//     const portfolioScore = Math.min((portfolioMatches.length / Math.max(freelancer.recent_work.length, 1)) * 100, 100);

//     scoreBreakdown.portfolioRelevance = portfolioScore;
//     totalScore += portfolioScore * (MATCHING_CRITERIA.PORTFOLIO_RELEVANCE.weight / 100);

//     // 6. Rating Quality (10% weight)
//     const ratingScore = (freelancer.rating / 5) * 100;
//     scoreBreakdown.rating = ratingScore;
//     totalScore += ratingScore * (MATCHING_CRITERIA.RATING_QUALITY.weight / 100);

//     return {
//         ...freelancer,
//         matchScore: Math.round(totalScore),
//         scoreBreakdown,
//         matchedSkills: skillMatches
//     };
// }

// /**
//  * Claude-inspired response generation
//  */
// function generateClaudeStyleResponse(requirements, rankedFreelancers) {
//     if (!rankedFreelancers || rankedFreelancers.length === 0) {
//         return {
//             recommended_freelancer: null,
//             match_score: 0,
//             summary_message: "I couldn't find any freelancers that match your specific requirements. Try broadening your search criteria or providing more details about your project needs.",
//             key_strengths: [],
//             potential_concerns: ["No suitable matches found with current criteria"]
//         };
//     }

//     const topFreelancer = rankedFreelancers[0];
//     const matchScore = topFreelancer.matchScore;

//     // Generate summary message
//     let summaryMessage = `I've found an excellent match for your ${requirements.projectType.replace('_', ' ')} project! `;
//     summaryMessage += `${topFreelancer.name} is a ${topFreelancer.experience_years}-year experienced professional `;
//     summaryMessage += `with a ${topFreelancer.rating}★ rating and ${topFreelancer.completed_projects} completed projects. `;

//     if (requirements.budget) {
//         const estimatedHours = Math.round(requirements.budget / topFreelancer.hourly_rate);
//         summaryMessage += `At $${topFreelancer.hourly_rate}/hour, your $${requirements.budget} budget would cover approximately ${estimatedHours} hours of work. `;
//     }

//     summaryMessage += `They're ${topFreelancer.availability.toLowerCase()} and have direct experience in ${topFreelancer.matchedSkills.join(', ')}.`;

//     // Generate key strengths
//     const keyStrengths = [];

//     if (topFreelancer.scoreBreakdown.skillMatch > 80) {
//         keyStrengths.push(`Perfect skill match - expertise in ${topFreelancer.matchedSkills.join(', ')}`);
//     }

//     if (topFreelancer.experience_years >= 5) {
//         keyStrengths.push(`Extensive experience (${topFreelancer.experience_years} years) with ${topFreelancer.completed_projects} completed projects`);
//     }

//     if (topFreelancer.rating >= 4.8) {
//         keyStrengths.push(`Excellent client feedback with ${topFreelancer.rating}★ rating and proven track record`);
//     }

//     if (requirements.urgency === 'high' && topFreelancer.availability.toLowerCase().includes('immediately')) {
//         keyStrengths.push('Available to start immediately for your urgent timeline');
//     }

//     // Generate potential concerns
//     const potentialConcerns = [];

//     if (requirements.budget && (requirements.budget / topFreelancer.hourly_rate) < 5) {
//         potentialConcerns.push('Budget may be limited for the scope - consider discussing project phases');
//     }

//     if (requirements.complexity === 'high' && topFreelancer.experience_years < 5) {
//         potentialConcerns.push('Complex project may benefit from more senior-level experience');
//     }

//     if (topFreelancer.hourly_rate > 60 && requirements.budget && requirements.budget < 3000) {
//         potentialConcerns.push('Premium rate specialist - ensure budget alignment before starting');
//     }

//     return {
//         recommended_freelancer: {
//             id: topFreelancer.id,
//             name: topFreelancer.name,
//             contact_method: "via_platform_messaging",
//             hourly_rate: topFreelancer.hourly_rate,
//             availability: topFreelancer.availability,
//             rating: topFreelancer.rating,
//             experience_years: topFreelancer.experience_years,
//             skills: topFreelancer.skills,
//             location: topFreelancer.location
//         },
//         match_score: matchScore,
//         summary_message: summaryMessage,
//         key_strengths: keyStrengths.slice(0, 3),
//         potential_concerns: potentialConcerns,
//         alternatives: rankedFreelancers.slice(1, 3).map(f => ({
//             name: f.name,
//             match_score: f.matchScore,
//             hourly_rate: f.hourly_rate,
//             key_skill: f.matchedSkills[0] || f.skills[0]
//         }))
//     };
// }

// /**
//  * Main AI processing function with Claude-style logic
//  */
// async function processWithClaudeLogic(message, freelancers = sampleFreelancers) {
//     // Add realistic processing delay
//     await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

//     // Extract requirements using Claude-inspired logic
//     const requirements = extractProjectRequirements(message);
//     console.log('Extracted requirements:', requirements);

//     // Score and rank freelancers
//     const scoredFreelancers = freelancers
//         .map(freelancer => calculateFreelancerScore(freelancer, requirements))
//         .filter(scored => scored !== null)
//         .sort((a, b) => b.matchScore - a.matchScore);

//     console.log('Top matches:', scoredFreelancers.slice(0, 3).map(f => ({ name: f.name, score: f.matchScore })));

//     // Generate Claude-style response
//     const response = generateClaudeStyleResponse(requirements, scoredFreelancers);

//     return response;
// }

// // Routes

// /**
//  * Health check endpoint
//  */
// app.get('/api/health', (req, res) => {
//     res.json({
//         status: 'healthy',
//         timestamp: new Date().toISOString(),
//         version: '2.0.0',
//         aiProvider: 'Local Claude-Style Logic',
//         features: ['intelligent_matching', 'skill_scoring', 'requirement_extraction']
//     });
// });

// /**
//  * Get sample freelancers
//  */
// app.get('/api/freelancers', (req, res) => {
//     res.json({
//         success: true,
//         freelancers: sampleFreelancers,
//         count: sampleFreelancers.length
//     });
// });

// /**
//  * Claude-style freelancer matching endpoint
//  */
// app.post('/api/match-freelancer', async (req, res) => {
//     try {
//         const {
//             project_description,
//             budget_range,
//             timeline,
//             priority_level,
//             client_location,
//             communication_preference,
//             freelancer_ids
//         } = req.body;

//         // Validation
//         if (!project_description || project_description.trim().length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Project description is required'
//             });
//         }

//         // Determine which freelancers to consider
//         let freelancersToMatch = sampleFreelancers;
//         if (freelancer_ids && Array.isArray(freelancer_ids) && freelancer_ids.length > 0) {
//             freelancersToMatch = sampleFreelancers.filter(fl => freelancer_ids.includes(fl.id));
//         }

//         // Enhance project description with additional context
//         let enhancedDescription = project_description;
//         if (budget_range) enhancedDescription += ` Budget: ${budget_range}.`;
//         if (timeline) enhancedDescription += ` Timeline: ${timeline}.`;
//         if (priority_level) enhancedDescription += ` Priority: ${priority_level}.`;

//         console.log(`Processing match request for: "${enhancedDescription.substring(0, 100)}..."`);

//         // Process with Claude-style logic
//         const matchResult = await processWithClaudeLogic(enhancedDescription, freelancersToMatch);

//         res.json({
//             success: true,
//             match_result: matchResult,
//             request_context: {
//                 project_description,
//                 freelancers_considered: freelancersToMatch.length,
//                 budget_range,
//                 timeline,
//                 priority_level,
//                 client_location,
//                 communication_preference
//             }
//         });

//     } catch (error) {
//         console.error('Error in match-freelancer endpoint:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Internal server error during freelancer matching',
//             message: error.message
//         });
//     }
// });

// /**
//  * Enhanced chat endpoint with Claude-style processing
//  */
// app.post('/api/chat', async (req, res) => {
//     try {
//         const { message, context } = req.body;

//         if (!message || message.trim().length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Message is required'
//             });
//         }

//         console.log(`Processing chat message: "${message.substring(0, 100)}..."`);

//         // Process with Claude-style logic
//         const matchResult = await processWithClaudeLogic(message, sampleFreelancers);

//         res.json({
//             success: true,
//             response: matchResult.summary_message,
//             match_result: matchResult,
//             context: context
//         });

//     } catch (error) {
//         console.error('Error in chat endpoint:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to process chat message',
//             message: error.message
//         });
//     }
// });

// /**
//  * Legacy endpoint for backward compatibility
//  */
// app.post('/api/chat/process', async (req, res) => {
//     try {
//         const { message, freelancers } = req.body;

//         if (!message || typeof message !== 'string' || message.trim().length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Valid message is required'
//             });
//         }

//         const freelancersToUse = freelancers && freelancers.length > 0 ? freelancers : sampleFreelancers;

//         console.log(`Processing legacy chat request: "${message.substring(0, 100)}..."`);

//         const matchResult = await processWithClaudeLogic(message, freelancersToUse);

//         // Format response in legacy format
//         const legacyResponse = `I've analyzed your project and found great matches!\n\n` +
//             `🎯 Top Recommendation: ${matchResult.recommended_freelancer.name}\n` +
//             `⭐ Match Score: ${matchResult.match_score}%\n` +
//             `💰 Rate: $${matchResult.recommended_freelancer.hourly_rate}/hour\n` +
//             `📍 Location: ${matchResult.recommended_freelancer.location}\n\n` +
//             `${matchResult.summary_message}\n\n` +
//             `Key Strengths:\n${matchResult.key_strengths.map(s => `• ${s}`).join('\n')}\n\n` +
//             (matchResult.potential_concerns.length > 0 ?
//                 `Considerations:\n${matchResult.potential_concerns.map(c => `• ${c}`).join('\n')}\n\n` : '') +
//             `Would you like me to connect you with ${matchResult.recommended_freelancer.name} or see more options?`;

//         res.json({
//             success: true,
//             response: legacyResponse,
//             metadata: {
//                 messageLength: message.length,
//                 freelancersCount: freelancersToUse.length,
//                 responseLength: legacyResponse.length,
//                 timestamp: new Date().toISOString(),
//                 aiProvider: 'Local Claude-Style Logic',
//                 matchScore: matchResult.match_score
//             }
//         });

//     } catch (error) {
//         console.error('Error processing legacy chat request:', error);
//         res.status(500).json({
//             success: false,
//             error: error.message || 'An unexpected error occurred'
//         });
//     }
// });

// /**
//  * Get specific freelancer details
//  */
// app.get('/api/freelancers/:id', (req, res) => {
//     const { id } = req.params;
//     const freelancer = sampleFreelancers.find(fl => fl.id === id);

//     if (!freelancer) {
//         return res.status(404).json({
//             success: false,
//             error: 'Freelancer not found'
//         });
//     }

//     res.json({
//         success: true,
//         freelancer
//     });
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//     console.error('Unhandled error:', error);
//     res.status(500).json({
//         success: false,
//         error: 'Internal server error'
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         error: 'Endpoint not found',
//         availableEndpoints: [
//             'GET /api/health',
//             'GET /api/freelancers',
//             'POST /api/match-freelancer',
//             'POST /api/chat',
//             'POST /api/chat/process',
//             'GET /api/freelancers/:id'
//         ]
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`🚀 FreelancersBot API Server running on port ${PORT}`);
//     console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
//     console.log(`🤖 Match endpoint: http://localhost:${PORT}/api/match-freelancer`);
//     console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
//     console.log(`🧠 AI Provider: Local Claude-Style Logic (No API key needed!)`);
//     console.log(`✨ Features: Intelligent matching, skill scoring, requirement extraction`);
//     console.log(`✅ Ready to match freelancers with advanced local AI logic!`);
// });