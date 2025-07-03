const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { authenticateToken } = require('../middleware/auth');
const constants = require('../utils/constants');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Enhanced error handling middleware for Stripe
const handleStripeErrors = (err, req, res, next) => {
    console.error('Stripe Error:', err);
    res.status(500).json({
        success: false,
        error: 'Payment processing error',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
};

// Get available subscription tiers
router.get('/tiers', (req, res) => {
    try {
        res.json({
            success: true,
            tiers: Object.entries(constants.SUBSCRIPTION_TIERS).map(([key, tier]) => ({
                id: key,
                name: tier.name,
                price: tier.price,
                features: tier.features,
                limit: tier.limit
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to load subscription tiers' });
    }
});

// Create Stripe checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
    try {
        const { tier } = req.body;

        // 1. Input Validation
        if (!tier || typeof tier !== 'string') {
            console.error('Missing or invalid tier parameter');
            return res.status(400).json({
                success: false,
                error: 'Tier parameter is required and must be a string',
                availableTiers: Object.keys(constants.SUBSCRIPTION_TIERS).filter(t => t !== 'FREE')
            });
        }

        // 2. Tier Validation
        const availableTiers = Object.keys(constants.SUBSCRIPTION_TIERS).filter(t => t !== 'FREE');
        if (!availableTiers.includes(tier)) {
            console.error('Invalid tier requested:', tier);
            return res.status(400).json({
                success: false,
                error: 'Invalid subscription tier',
                availableTiers: availableTiers
            });
        }

        // 3. Get Tier Configuration
        const subscriptionConfig = constants.SUBSCRIPTION_TIERS[tier];
        if (!subscriptionConfig?.stripePriceId) {
            console.error('Missing Stripe configuration for tier:', tier);
            return res.status(500).json({
                success: false,
                error: 'Subscription tier not properly configured'
            });
        }

        console.log(`Creating checkout session for ${tier} tier with price ID:`, subscriptionConfig.stripePriceId);

        // 4. Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: subscriptionConfig.stripePriceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing`,
            customer_email: req.user.email, // Add customer email for better tracking
            metadata: {
                userId: req.user.id,
                tier: tier,
                timestamp: new Date().toISOString()
            }
        });

        console.log('Successfully created Stripe session:', session.id);

        // 5. Return Response
        res.json({
            success: true,
            url: session.url,
            sessionId: session.id,
            expiresAt: new Date(session.expires_at * 1000).toISOString()
        });

    } catch (err) {
        console.error('Stripe API error:', {
            message: err.message,
            type: err.type,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });

        res.status(500).json({
            success: false,
            error: 'Failed to create checkout session',
            details: process.env.NODE_ENV === 'development' ? {
                message: err.message,
                type: err.type
            } : null
        });
    }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle events
        switch (event.type) {
            case 'checkout.session.completed':
                handlePaymentSuccess(event.data.object);
                break;
            case 'invoice.paid':
                handleSubscriptionRenewal(event.data.object);
                break;
        }

        res.json({ received: true });
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

module.exports = router;