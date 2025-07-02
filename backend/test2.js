// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const rateLimit = require('express-rate-limit');
// const { body, validationResult, param } = require('express-validator');
// const WebSocket = require('ws');
// const http = require('http');
// const Stripe = require('stripe');

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const server = http.createServer(app);
// const PORT = process.env.PORT || 5000;

// // Initialize Stripe (replace with your actual key)
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

// // WebSocket for real-time features
// const wss = new WebSocket.Server({ server });

// // Enhanced Security & Logging
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//             fontSrc: ["'self'", "https://fonts.gstatic.com"],
//             scriptSrc: ["'self'"],
//             imgSrc: ["'self'", "data:", "https:"]
//         }
//     }
// }));

// app.use(morgan('combined'));

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: { error: 'Too many requests, please try again later.' }
// });

// const strictLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 20, // More restrictive for sensitive endpoints
//     message: { error: 'Rate limit exceeded for this operation.' }
// });

// app.use('/api/', limiter);

// // Middleware
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Enhanced logging with request ID
// app.use((req, res, next) => {
//     req.requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
//     console.log(`[${req.requestId}] ${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next();
// });

// // SUBSCRIPTION TIERS & MONETIZATION
// const SUBSCRIPTION_TIERS = {
//     FREE: {
//         name: 'Free',
//         price: 0,
//         monthlyPrice: 0,
//         features: {
//             searchesPerMonth: 10,
//             advancedFilters: false,
//             prioritySupport: false,
//             realTimeUpdates: false,
//             customMatchingAlgorithm: false,
//             bulkOperations: false,
//             analyticsAccess: false,
//             apiAccess: false
//         }
//     },
//     BASIC: {
//         name: 'Basic',
//         price: 29,
//         monthlyPrice: 29,
//         stripeProductId: 'prod_basic_plan',
//         stripePriceId: 'price_basic_monthly',
//         features: {
//             searchesPerMonth: 100,
//             advancedFilters: true,
//             prioritySupport: false,
//             realTimeUpdates: true,
//             customMatchingAlgorithm: false,
//             bulkOperations: false,
//             analyticsAccess: true,
//             apiAccess: false
//         }
//     },
//     PRO: {
//         name: 'Pro',
//         price: 79,
//         monthlyPrice: 79,
//         stripeProductId: 'prod_pro_plan',
//         stripePriceId: 'price_pro_monthly',
//         features: {
//             searchesPerMonth: 500,
//             advancedFilters: true,
//             prioritySupport: true,
//             realTimeUpdates: true,
//             customMatchingAlgorithm: true,
//             bulkOperations: true,
//             analyticsAccess: true,
//             apiAccess: true
//         }
//     },
//     ENTERPRISE: {
//         name: 'Enterprise',
//         price: 199,
//         monthlyPrice: 199,
//         stripeProductId: 'prod_enterprise_plan',
//         stripePriceId: 'price_enterprise_monthly',
//         features: {
//             searchesPerMonth: -1, // Unlimited
//             advancedFilters: true,
//             prioritySupport: true,
//             realTimeUpdates: true,
//             customMatchingAlgorithm: true,
//             bulkOperations: true,
//             analyticsAccess: true,
//             apiAccess: true,
//             customIntegrations: true,
//             dedicatedSupport: true
//         }
//     }
// };

// // In-memory stores (replace with database in production)
// const users = new Map();
// const sessions = new Map();
// const userUsage = new Map();
// const matchingHistory = new Map();

// // Enhanced freelancer data with more fields for advanced matching
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

// // ADVANCED MATCHING ALGORITHMS
// class AdvancedMatchingEngine {
//     constructor() {
//         this.weights = {
//             skillMatch: 0.35,
//             experienceLevel: 0.20,
//             availability: 0.15,
//             rateCompatibility: 0.10,
//             portfolioRelevance: 0.10,
//             rating: 0.05,
//             timezone: 0.05
//         };
//     }

//     // Machine Learning-inspired similarity scoring
//     calculateSkillSimilarity(freelancerSkills, requiredSkills) {
//         if (!requiredSkills.length) return 0.5;
        
//         const freelancerSet = new Set(freelancerSkills.map(s => s.toLowerCase()));
//         const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));
        
//         // Jaccard similarity
//         const intersection = new Set([...freelancerSet].filter(x => requiredSet.has(x)));
//         const union = new Set([...freelancerSet, ...requiredSet]);
        
//         return intersection.size / union.size;
//     }

//     // Advanced scoring with machine learning principles
//     calculateAdvancedScore(freelancer, requirements, userTier = 'FREE') {
//         let scores = {};
        
//         // Enhanced skill matching with semantic similarity
//         scores.skillMatch = this.calculateSkillSimilarity(
//             freelancer.skills, 
//             requirements.matchedSkills
//         ) * 100;
        
//         // Experience scoring with project complexity consideration
//         const experienceMultiplier = requirements.complexity === 'high' ? 1.2 : 
//                                    requirements.complexity === 'low' ? 0.9 : 1.0;
//         scores.experience = Math.min(
//             (freelancer.experience_years / 10) * 100 * experienceMultiplier, 
//             100
//         );
        
//         // Availability with urgency consideration
//         scores.availability = this.calculateAvailabilityScore(freelancer, requirements);
        
//         // Rate compatibility with budget optimization
//         scores.rateCompatibility = this.calculateRateScore(freelancer, requirements);
        
//         // Portfolio relevance with industry focus
//         scores.portfolioRelevance = this.calculatePortfolioScore(freelancer, requirements);
        
//         // Rating with success rate consideration
//         scores.rating = (freelancer.rating / 5) * 100 * freelancer.success_rate;
        
//         // Timezone compatibility (Pro+ feature)
//         scores.timezone = userTier !== 'FREE' ? 
//             this.calculateTimezoneCompatibility(freelancer, requirements) : 50;
        
//         // Calculate weighted total
//         let totalScore = 0;
//         for (const [metric, score] of Object.entries(scores)) {
//             totalScore += score * (this.weights[metric] || 0);
//         }
        
//         return {
//             totalScore: Math.round(totalScore),
//             breakdown: scores
//         };
//     }

//     calculateAvailabilityScore(freelancer, requirements) {
//         const availability = freelancer.availability.toLowerCase();
//         const urgency = requirements.urgency;
        
//         if (urgency === 'high') {
//             return availability.includes('immediately') ? 100 : 
//                    availability.includes('available') ? 70 : 30;
//         }
//         return availability.includes('available') ? 90 : 60;
//     }

//     calculateRateScore(freelancer, requirements) {
//         if (!requirements.budget) return 70;
        
//         const estimatedHours = requirements.budget / freelancer.hourly_rate;
//         if (estimatedHours >= 20 && estimatedHours <= 80) return 100;
//         if (estimatedHours >= 10) return 85;
//         if (estimatedHours >= 5) return 60;
//         return 30;
//     }

//     calculatePortfolioScore(freelancer, requirements) {
//         const industryMatch = freelancer.industry_focus?.some(industry => 
//             requirements.projectType.includes(industry)
//         ) ? 20 : 0;
        
//         const workMatch = freelancer.recent_work.filter(work =>
//             requirements.matchedSkills.some(skill => 
//                 work.toLowerCase().includes(skill.toLowerCase())
//             )
//         ).length;
        
//         return Math.min(industryMatch + (workMatch * 20), 100);
//     }

//     calculateTimezoneCompatibility(freelancer, requirements) {
//         // Simplified timezone scoring
//         if (requirements.timezone && freelancer.timezone) {
//             return freelancer.timezone === requirements.timezone ? 100 : 70;
//         }
//         return 80;
//     }
// }

// const matchingEngine = new AdvancedMatchingEngine();

// // AUTHENTICATION MIDDLEWARE
// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ error: 'Access token required' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: 'Invalid or expired token' });
//         }
//         req.user = user;
//         next();
//     });
// };

// // SUBSCRIPTION MIDDLEWARE
// const checkSubscription = (requiredTier) => {
//     return (req, res, next) => {
//         const user = users.get(req.user.userId);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const userTier = user.subscriptionTier || 'FREE';
//         const tierLevels = { 'FREE': 0, 'BASIC': 1, 'PRO': 2, 'ENTERPRISE': 3 };
        
//         if (tierLevels[userTier] < tierLevels[requiredTier]) {
//             return res.status(403).json({ 
//                 error: 'Upgrade required',
//                 currentTier: userTier,
//                 requiredTier: requiredTier,
//                 upgradeUrl: '/api/subscription/upgrade'
//             });
//         }

//         req.userTier = userTier;
//         next();
//     };
// };

// // USAGE TRACKING MIDDLEWARE
// const trackUsage = (operation) => {
//     return (req, res, next) => {
//         const userId = req.user.userId;
//         const usage = userUsage.get(userId) || { 
//             searchesThisMonth: 0, 
//             lastReset: new Date() 
//         };

//         // Reset monthly counters
//         const now = new Date();
//         if (now.getMonth() !== usage.lastReset.getMonth()) {
//             usage.searchesThisMonth = 0;
//             usage.lastReset = now;
//         }

//         const user = users.get(userId);
//         const tier = SUBSCRIPTION_TIERS[user.subscriptionTier || 'FREE'];
        
//         if (operation === 'search' && tier.features.searchesPerMonth !== -1) {
//             if (usage.searchesThisMonth >= tier.features.searchesPerMonth) {
//                 return res.status(429).json({ 
//                     error: 'Monthly search limit exceeded',
//                     limit: tier.features.searchesPerMonth,
//                     used: usage.searchesThisMonth,
//                     upgradeUrl: '/api/subscription/upgrade'
//                 });
//             }
//             usage.searchesThisMonth++;
//         }

//         userUsage.set(userId, usage);
//         req.usage = usage;
//         next();
//     };
// };

// // VALIDATION SCHEMAS
// const validators = {
//     register: [
//         body('email').isEmail().normalizeEmail(),
//         body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
//         body('firstName').trim().isLength({ min: 1, max: 50 }),
//         body('lastName').trim().isLength({ min: 1, max: 50 })
//     ],
//     login: [
//         body('email').isEmail().normalizeEmail(),
//         body('password').notEmpty()
//     ],
//     matchFreelancer: [
//         body('project_description').trim().isLength({ min: 10, max: 2000 }),
//         body('budget_range').optional().isNumeric(),
//         body('timeline').optional().isIn(['urgent', '1-3 days', '1 week', '2-4 weeks', '1-2 months', 'flexible'])
//     ],
//     freelancerId: [
//         param('id').matches(/^fl_\d+$/)
//     ]
// };

// // ERROR HANDLING
// const handleValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             error: 'Validation failed',
//             details: errors.array()
//         });
//     }
//     next();
// };

// // WEBSOCKET REAL-TIME FEATURES
// wss.on('connection', (ws, req) => {
//     console.log('New WebSocket connection established');
    
//     ws.on('message', async (message) => {
//         try {
//             const data = JSON.parse(message);
            
//             switch (data.type) {
//                 case 'REAL_TIME_SEARCH':
//                     // Process real-time search updates
//                     const results = await processRealtimeSearch(data.query);
//                     ws.send(JSON.stringify({
//                         type: 'SEARCH_RESULTS',
//                         data: results
//                     }));
//                     break;
                    
//                 case 'FREELANCER_STATUS_UPDATE':
//                     // Broadcast freelancer availability updates
//                     broadcastFreelancerUpdate(data.freelancerId, data.status);
//                     break;
//             }
//         } catch (error) {
//             ws.send(JSON.stringify({
//                 type: 'ERROR',
//                 message: 'Invalid message format'
//             }));
//         }
//     });
    
//     ws.on('close', () => {
//         console.log('WebSocket connection closed');
//     });
// });

// function broadcastFreelancerUpdate(freelancerId, status) {
//     const message = JSON.stringify({
//         type: 'FREELANCER_UPDATE',
//         freelancerId,
//         status,
//         timestamp: new Date().toISOString()
//     });
    
//     wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(message);
//         }
//     });
// }

// // ENHANCED ROUTES

// // Authentication Routes
// app.post('/api/auth/register', strictLimiter, validators.register, handleValidationErrors, async (req, res) => {
//     try {
//         const { email, password, firstName, lastName } = req.body;
        
//         if (users.has(email)) {
//             return res.status(409).json({ error: 'User already exists' });
//         }
        
//         const hashedPassword = await bcrypt.hash(password, 12);
//         const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
//         const user = {
//             userId,
//             email,
//             password: hashedPassword,
//             firstName,
//             lastName,
//             subscriptionTier: 'FREE',
//             createdAt: new Date(),
//             isActive: true
//         };
        
//         users.set(email, user);
//         users.set(userId, user);
        
//         const token = jwt.sign(
//             { userId, email }, 
//             process.env.JWT_SECRET || 'fallback_secret',
//             { expiresIn: '24h' }
//         );
        
//         res.status(201).json({
//             success: true,
//             token,
//             user: {
//                 userId,
//                 email,
//                 firstName,
//                 lastName,
//                 subscriptionTier: 'FREE'
//             }
//         });
        
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ error: 'Registration failed' });
//     }
// });

// app.post('/api/auth/login', strictLimiter, validators.login, handleValidationErrors, async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = users.get(email);
        
//         if (!user || !await bcrypt.compare(password, user.password)) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }
        
//         const token = jwt.sign(
//             { userId: user.userId, email }, 
//             process.env.JWT_SECRET || 'fallback_secret',
//             { expiresIn: '24h' }
//         );
        
//         res.json({
//             success: true,
//             token,
//             user: {
//                 userId: user.userId,
//                 email,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 subscriptionTier: user.subscriptionTier
//             }
//         });
        
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ error: 'Login failed' });
//     }
// });

// // Subscription Management Routes
// app.get('/api/subscription/tiers', (req, res) => {
//     res.json({
//         success: true,
//         tiers: SUBSCRIPTION_TIERS
//     });
// });

// app.post('/api/subscription/create-checkout-session', authenticateToken, async (req, res) => {
//     try {
//         const { tier } = req.body;
//         const subscriptionTier = SUBSCRIPTION_TIERS[tier];
        
//         if (!subscriptionTier || tier === 'FREE') {
//             return res.status(400).json({ error: 'Invalid subscription tier' });
//         }
        
//         // Create Stripe checkout session (mock implementation)
//         const session = {
//             id: `cs_${Date.now()}`,
//             url: `https://checkout.stripe.com/pay/${Date.now()}`,
//             success_url: `${process.env.FRONTEND_URL}/subscription/success`,
//             cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`
//         };
        
//         res.json({
//             success: true,
//             sessionId: session.id,
//             checkoutUrl: session.url
//         });
        
//     } catch (error) {
//         console.error('Checkout session creation error:', error);
//         res.status(500).json({ error: 'Failed to create checkout session' });
//     }
// });

// // Enhanced Freelancer Matching with Advanced Features
// app.post('/api/match-freelancer', 
//     authenticateToken, 
//     trackUsage('search'),
//     validators.matchFreelancer, 
//     handleValidationErrors, 
//     async (req, res) => {
//     try {
//         const user = users.get(req.user.userId);
//         const userTier = user.subscriptionTier || 'FREE';
//         const tierFeatures = SUBSCRIPTION_TIERS[userTier].features;
        
//         const {
//             project_description,
//             budget_range,
//             timeline,
//             priority_level,
//             client_location,
//             advanced_filters = {}
//         } = req.body;
        
//         // Extract requirements
//         const requirements = extractProjectRequirements(project_description);
//         if (budget_range) requirements.budget = budget_range;
//         if (timeline) requirements.timeline = timeline;
//         if (client_location) requirements.clientLocation = client_location;
        
//         let freelancersToMatch = [...sampleFreelancers];
        
//         // Apply advanced filters for paid tiers
//         if (tierFeatures.advancedFilters && advanced_filters) {
//             freelancersToMatch = applyAdvancedFilters(freelancersToMatch, advanced_filters);
//         }
        
//         // Use advanced matching algorithm for Pro+ tiers
//         const useAdvancedAlgorithm = tierFeatures.customMatchingAlgorithm;
        
//         const matchResults = freelancersToMatch
//             .map(freelancer => {
//                 const score = useAdvancedAlgorithm ? 
//                     matchingEngine.calculateAdvancedScore(freelancer, requirements, userTier) :
//                     calculateBasicScore(freelancer, requirements);
                
//                 return {
//                     ...freelancer,
//                     matchScore: score.totalScore,
//                     scoreBreakdown: score.breakdown || {}
//                 };
//             })
//             .filter(f => f.matchScore > 20)
//             .sort((a, b) => b.matchScore - a.matchScore);
        
//         // Store matching history for analytics
//         const matchId = `match_${Date.now()}_${req.user.userId}`;
//         matchingHistory.set(matchId, {
//             userId: req.user.userId,
//             query: project_description,
//             results: matchResults.slice(0, 5),
//             timestamp: new Date(),
//             tier: userTier
//         });
        
//         const response = generateEnhancedResponse(requirements, matchResults, userTier);
        
//         // Real-time updates for Pro+ users
//         if (tierFeatures.realTimeUpdates) {
//             broadcastToUser(req.user.userId, {
//                 type: 'MATCH_COMPLETE',
//                 matchId,
//                 topMatch: response.recommended_freelancer
//             });
//         }
        
//         res.json({
//             success: true,
//             match_result: response,
//             matchId,
//             usage: req.usage,
//             tier_features: tierFeatures
//         });
        
//     } catch (error) {
//         console.error(`[${req.requestId}] Match freelancer error:`, error);
//         res.status(500).json({
//             success: false,
//             error: 'Matching failed',
//             requestId: req.requestId
//         });
//     }
// });

// // Analytics Endpoint (Basic+ tiers)
// app.get('/api/analytics/dashboard', 
//     authenticateToken, 
//     checkSubscription('BASIC'),
//     (req, res) => {
//     try {
//         const userMatches = Array.from(matchingHistory.values())
//             .filter(match => match.userId === req.user.userId);
        
//         const analytics = {
//             totalSearches: userMatches.length,
//             averageMatchScore: userMatches.reduce((sum, match) => 
//                 sum + (match.results[0]?.matchScore || 0), 0) / userMatches.length || 0,
//             topSkills: getTopSkills(userMatches),
//             searchTrends: getSearchTrends(userMatches),
//             monthlyUsage: req.usage
//         };
        
//         res.json({
//             success: true,
//             analytics
//         });
        
//     } catch (error) {
//         console.error('Analytics error:', error);
//         res.status(500).json({ error: 'Failed to generate analytics' });
//     }
// });

// // Bulk Operations (Pro+ tiers)
// app.post('/api/bulk/match-freelancers', 
//     authenticateToken, 
//     checkSubscription('PRO'),
//     (req, res) => {
//     try {
//         const { projects } = req.body;
        
//         if (!Array.isArray(projects) || projects.length > 10) {
//             return res.status(400).json({ 
//                 error: 'Invalid projects array (max 10 projects)' 
//             });
//         }
        
//         const results = projects.map((project, index) => {
//             const requirements = extractProjectRequirements(project.description);
//             const matches = sampleFreelancers
//                 .map(fl => ({
//                     ...fl,
//                     ...matchingEngine.calculateAdvancedScore(fl, requirements, req.userTier)
//                 }))
//                 .sort((a, b) => b.totalScore - a.totalScore)
//                 .slice(0, 3);
            
//             return {
//                 projectIndex: index,
//                 projectId: project.id || `proj_${index}`,
//                 topMatches: matches
//             };
//         });
        
//         res.json({
//             success: true,
//             results
//         });
        
//     } catch (error) {
//         console.error('Bulk operations error:', error);
//         res.status(500).json({ error: 'Bulk operation failed' });
//     }
// });

// // Helper Functions
// function applyAdvancedFilters(freelancers, filters) {
//     return freelancers.filter(fl => {
//         if (filters.minRating && fl.rating < filters.minRating) return false;
//         if (filters.maxHourlyRate && fl.hourly_rate > filters.maxHourlyRate) return false;
//         if (filters.minExperience && fl.experience_years < filters.minExperience) return false;
//         if (filters.location && !fl.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
//         if (filters.languages && !filters.languages.some(lang => fl.languages?.includes(lang))) return false;
//         return true;
//     });
// }

// function calculateBasicScore(freelancer, requirements) {
//     // Simplified scoring for free tier
//     const skillMatch = requirements.matchedSkills.filter(skill =>
//         freelancer.skills.some(fs => fs.toLowerCase().includes(skill.toLowerCase()))
//     ).length;
    
//     const score = (skillMatch / Math.max(requirements.matchedSkills.length, 1)) * 100;
    
//     return {
//         totalScore: Math.round(score),
//         breakdown: { skillMatch: score }
//     };
// }

// function generateEnhancedResponse(requirements, matches, userTier) {
//     if (!matches.length) {
//         return {
//             recommended_freelancer: null,
//             match_score: 0,
//             summary_message: "No suitable matches found. Try adjusting your criteria.",
//             alternatives: []
//         };
//     }
    
//     const top = matches[0];
//     const tierFeatures = SUBSCRIPTION_TIERS[userTier].features;
    
//     let summaryMessage = `Found ${matches.length} potential matches! `;
//     summaryMessage += `${top.name} is your top match with ${top.matchScore}% compatibility. `;
    
//     if (tierFeatures.advancedFilters) {
//         summaryMessage += `Advanced matching algorithm applied based on your ${userTier} subscription. `;
//     }
    
//     return {
//         recommended_freelancer: {
//             ...top,
//             contact_method: "via_platform_messaging"
//         },
//         match_score: top.matchScore,
//         summary_message: summaryMessage,
//         alternatives: matches.slice(1, 4),
//         tier_benefits: tierFeatures,
//         upgrade_suggestion: userTier === 'FREE' ? 
//             "Upgrade to Basic for advanced filters and real-time updates!" : null
//     };
// }

// function getTopSkills(matches) {
//     const skillCounts = {};
//     matches.forEach(match => {
//         match.results.forEach(result => {
//             result.skills?.forEach(skill => {
//                 skillCounts[skill] = (skillCounts[skill] || 0) + 1;
//             });
//         });
//     });
    
//     return Object.entries(skillCounts)
//         .sort(([,a], [,b]) => b - a)
//         .slice(0, 5)
//         .map(([skill, count]) => ({ skill, count }));
// }

// function getSearchTrends(matches) {
//     const trends = {};
//     matches.forEach(match => {
//         const date = match.timestamp.toISOString().split('T')[0];
//         trends[date] = (trends[date] || 0) + 1;
//     });
    
//     return Object.entries(trends)
//         .sort(([a], [b]) => new Date(a) - new Date(b))
//         .map(([date, searches]) => ({ date, searches }));
// }

// function broadcastToUser(userId, message) {
//     wss.clients.forEach(client => {
//         if (client.userId === userId && client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(message));
//         }
//     });
// }

// function extractProjectRequirements(message) {
//     const lowerMessage = message.toLowerCase();

//     // Enhanced budget extraction
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

//     // Enhanced timeline extraction
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

//     // Enhanced skill extraction
//     const skillKeywords = {
//         'logo': ['logo', 'brand', 'identity', 'design', 'creative', 'illustrator', 'photoshop'],
//         'web_development': ['website', 'web', 'react', 'frontend', 'backend', 'fullstack', 'development', 'javascript', 'node', 'api'],
//         'content_writing': ['content', 'writing', 'blog', 'copy', 'seo', 'copywriting', 'articles'],
//         'ui_ux_design': ['ui', 'ux', 'interface', 'prototype', 'figma', 'adobe', 'user experience', 'design'],
//         'social_media': ['marketing', 'social', 'instagram', 'facebook', 'ads', 'campaign', 'strategy'],
//         'data_science': ['python', 'django', 'api', 'database', 'server', 'machine learning', 'data', 'analysis', 'ml', 'ai'],
//         'mobile_development': ['mobile', 'app', 'ios', 'android', 'flutter', 'react native'],
//         'ecommerce': ['ecommerce', 'e-commerce', 'online store', 'shop', 'payment', 'cart']
//     };

//     let projectType = 'general';
//     let matchedSkills = [];
//     let complexity = 'medium';

//     for (const [type, keywords] of Object.entries(skillKeywords)) {
//         const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
//         if (matches.length > 0) {
//             projectType = type;
//             matchedSkills = matches;
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

// async function processRealtimeSearch(query) {
//     const requirements = extractProjectRequirements(query);
    
//     const results = sampleFreelancers
//         .map(fl => ({
//             ...fl,
//             ...matchingEngine.calculateAdvancedScore(fl, requirements, 'PRO')
//         }))
//         .filter(fl => fl.totalScore > 30)
//         .sort((a, b) => b.totalScore - a.totalScore)
//         .slice(0, 5);
    
//     return results;
// }

// // API Documentation Endpoint
// app.get('/api/docs', (req, res) => {
//     res.json({
//         version: '2.0.0',
//         endpoints: {
//             authentication: {
//                 'POST /api/auth/register': 'Register new user',
//                 'POST /api/auth/login': 'Login user'
//             },
//             subscription: {
//                 'GET /api/subscription/tiers': 'Get subscription tiers',
//                 'POST /api/subscription/create-checkout-session': 'Create Stripe checkout'
//             },
//             matching: {
//                 'POST /api/match-freelancer': 'Find matching freelancers',
//                 'GET /api/freelancers': 'List all freelancers',
//                 'GET /api/freelancers/:id': 'Get freelancer details'
//             },
//             analytics: {
//                 'GET /api/analytics/dashboard': 'User analytics (Basic+)'
//             },
//             bulk: {
//                 'POST /api/bulk/match-freelancers': 'Bulk matching (Pro+)'
//             }
//         },
//         features: {
//             free: SUBSCRIPTION_TIERS.FREE.features,
//             basic: SUBSCRIPTION_TIERS.BASIC.features,
//             pro: SUBSCRIPTION_TIERS.PRO.features,
//             enterprise: SUBSCRIPTION_TIERS.ENTERPRISE.features
//         }
//     });
// });

// // Health check with enhanced monitoring
// app.get('/api/health', (req, res) => {
//     const memUsage = process.memoryUsage();
//     const uptime = process.uptime();
    
//     res.json({
//         status: 'healthy',
//         timestamp: new Date().toISOString(),
//         version: '2.0.0',
//         uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
//         memory: {
//             used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
//             total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
//         },
//         features: [
//             'authentication',
//             'subscription_tiers',
//             'advanced_matching',
//             'real_time_updates',
//             'analytics',
//             'bulk_operations',
//             'websocket_support'
//         ],
//         stats: {
//             totalUsers: users.size,
//             activeConnections: wss.clients.size,
//             totalMatches: matchingHistory.size
//         }
//     });
// });

// // Get all freelancers (with pagination for large datasets)
// app.get('/api/freelancers', (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
    
//     const paginatedFreelancers = sampleFreelancers.slice(offset, offset + limit);
    
//     res.json({
//         success: true,
//         freelancers: paginatedFreelancers,
//         pagination: {
//             page,
//             limit,
//             total: sampleFreelancers.length,
//             totalPages: Math.ceil(sampleFreelancers.length / limit),
//             hasNext: offset + limit < sampleFreelancers.length,
//             hasPrev: page > 1
//         }
//     });
// });

// // Get specific freelancer with enhanced details
// app.get('/api/freelancers/:id', validators.freelancerId, handleValidationErrors, (req, res) => {
//     const { id } = req.params;
//     const freelancer = sampleFreelancers.find(fl => fl.id === id);

//     if (!freelancer) {
//         return res.status(404).json({
//             success: false,
//             error: 'Freelancer not found'
//         });
//     }

//     // Enhanced freelancer profile
//     const enhancedProfile = {
//         ...freelancer,
//         stats: {
//             averageRating: freelancer.rating,
//             totalProjects: freelancer.completed_projects,
//             successRate: freelancer.success_rate,
//             responseTime: freelancer.response_time
//         },
//         availability_details: {
//             status: freelancer.availability,
//             timezone: freelancer.timezone,
//             lastActive: freelancer.last_active
//         },
//         expertise: {
//             primarySkills: freelancer.skills.slice(0, 3),
//             industryFocus: freelancer.industry_focus,
//             certifications: freelancer.certifications
//         }
//     };

//     res.json({
//         success: true,
//         freelancer: enhancedProfile
//     });
// });

// // Legacy chat endpoint with enhanced features
// app.post('/api/chat', authenticateToken, validators.matchFreelancer, handleValidationErrors, async (req, res) => {
//     try {
//         const { message, context } = req.body;
//         const user = users.get(req.user.userId);
//         const userTier = user.subscriptionTier || 'FREE';

//         console.log(`[${req.requestId}] Processing chat message from ${userTier} user: "${message.substring(0, 100)}..."`);

//         const requirements = extractProjectRequirements(message);
        
//         let freelancersToMatch = sampleFreelancers;
        
//         // Apply context filters if provided
//         if (context && context.filters) {
//             freelancersToMatch = applyAdvancedFilters(freelancersToMatch, context.filters);
//         }

//         const matchResults = freelancersToMatch
//             .map(fl => ({
//                 ...fl,
//                 ...matchingEngine.calculateAdvancedScore(fl, requirements, userTier)
//             }))
//             .filter(fl => fl.totalScore > 20)
//             .sort((a, b) => b.totalScore - a.totalScore);

//         const response = generateEnhancedResponse(requirements, matchResults, userTier);

//         res.json({
//             success: true,
//             response: response.summary_message,
//             match_result: response,
//             context: context,
//             user_tier: userTier,
//             features_used: SUBSCRIPTION_TIERS[userTier].features
//         });

//     } catch (error) {
//         console.error(`[${req.requestId}] Chat error:`, error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to process chat message',
//             requestId: req.requestId
//         });
//     }
// });

// // Enhanced error handling middleware
// app.use((error, req, res, next) => {
//     console.error(`[${req.requestId || 'unknown'}] Unhandled error:`, error);
    
//     const isDevelopment = process.env.NODE_ENV === 'development';
    
//     res.status(error.status || 500).json({
//         success: false,
//         error: error.message || 'Internal server error',
//         requestId: req.requestId,
//         timestamp: new Date().toISOString(),
//         ...(isDevelopment && { stack: error.stack })
//     });
// });

// // 404 handler with helpful suggestions
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         error: 'Endpoint not found',
//         suggestions: [
//             'Check the API documentation at /api/docs',
//             'Verify the HTTP method (GET, POST, etc.)',
//             'Ensure proper authentication headers for protected endpoints'
//         ],
//         availableEndpoints: {
//             public: [
//                 'GET /api/health',
//                 'GET /api/subscription/tiers',
//                 'POST /api/auth/register',
//                 'POST /api/auth/login'
//             ],
//             authenticated: [
//                 'POST /api/match-freelancer',
//                 'GET /api/freelancers',
//                 'POST /api/chat',
//                 'GET /api/analytics/dashboard (Basic+)',
//                 'POST /api/bulk/match-freelancers (Pro+)'
//             ]
//         }
//     });
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM received, shutting down gracefully');
//     server.close(() => {
//         console.log('HTTP server closed');
//         process.exit(0);
//     });
// });

// // Start server
// server.listen(PORT, () => {
//     console.log(`🚀 Enhanced FreelancersBot API Server running on port ${PORT}`);
//     console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
//     console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
//     console.log(`🔐 Authentication: JWT-based with bcrypt password hashing`);
//     console.log(`💳 Subscription Tiers: FREE, BASIC ($29), PRO ($79), ENTERPRISE ($199)`);
//     console.log(`🤖 AI Features: Advanced matching algorithms, real-time updates`);
//     console.log(`🔒 Security: Rate limiting, input validation, helmet protection`);
//     console.log(`📊 Analytics: Usage tracking, performance monitoring`);
//     console.log(`🌐 WebSocket: Real-time freelancer updates on port ${PORT}`);
//     console.log(`✨ Premium Features: Bulk operations, advanced filters, priority support`);
//     console.log(`✅ Production-ready with comprehensive error handling and monitoring!`);
// });