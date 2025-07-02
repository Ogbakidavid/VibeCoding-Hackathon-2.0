const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { authenticateToken } = require('../middleware/auth');
const { SUBSCRIPTION_TIERS } = require('../utils/constants');

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
            tiers: Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => ({
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
router.post('/create-checkout-session',
    authenticateToken,
    async (req, res, next) => {
        try {
            const { tier, success_url, cancel_url } = req.body;

            // Validate tier
            if (!SUBSCRIPTION_TIERS[tier] || tier === 'free') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid subscription tier',
                    availableTiers: Object.keys(SUBSCRIPTION_TIERS).filter(t => t !== 'free')
                });
            }

            const subscription = SUBSCRIPTION_TIERS[tier];

            // Create Stripe product and price dynamically
            const product = await stripe.products.create({
                name: `${subscription.name} Subscription`,
                description: subscription.features.join(', ')
            });

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: subscription.price * 100,
                currency: 'usd',
                recurring: { interval: 'month' }
            });

            // Determine redirect URLs
            const baseUrl = req.headers.origin || 'http://localhost:3000';
            const successRedirect = success_url || `${baseUrl}/dashboard?payment=success`;
            const cancelRedirect = cancel_url || `${baseUrl}/pricing?payment=cancelled`;

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: price.id,
                    quantity: 1,
                }],
                mode: 'subscription',
                success_url: successRedirect,
                cancel_url: cancelRedirect,
                client_reference_id: req.user.id,
                metadata: {
                    user_id: req.user.id,
                    tier: tier,
                    env: process.env.NODE_ENV
                }
            });

            res.json({
                success: true,
                sessionId: session.id,
                url: session.url,
                expiresAt: new Date(session.expires_at * 1000).toISOString()
            });

        } catch (error) {
            next(error);
        }
    },
    handleStripeErrors
);

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription events
    switch (event.type) {
        case 'checkout.session.completed':
            // Update user subscription in your database
            break;
        case 'invoice.payment_succeeded':
            // Handle recurring payment
            break;
        case 'customer.subscription.deleted':
            // Handle subscription cancellation
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;