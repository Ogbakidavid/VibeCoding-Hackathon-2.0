const { SUBSCRIPTION_TIERS } = require('../utils/constants');
const { users } = require('../data/sampleData');

const checkSubscription = (requiredTier) => {
    return (req, res, next) => {
        const user = users.get(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userTier = user.subscriptionTier || 'FREE';
        const tierLevels = { 'FREE': 0, 'BASIC': 1, 'PRO': 2, 'ENTERPRISE': 3 };
        
        if (tierLevels[userTier] < tierLevels[requiredTier]) {
            return res.status(403).json({ 
                error: 'Upgrade required',
                currentTier: userTier,
                requiredTier: requiredTier,
                upgradeUrl: '/api/subscription/upgrade'
            });
        }

        req.userTier = userTier;
        next();
    };
};

module.exports = {
    checkSubscription
};