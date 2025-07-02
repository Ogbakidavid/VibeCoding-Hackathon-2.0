const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});

const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Rate limit exceeded for this operation.' }
});

// Security middleware
const securityMiddleware = [
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"]
            }
        }
    }),
    morgan('combined')
];

module.exports = {
    limiter,
    strictLimiter,
    securityMiddleware
};