const { SUBSCRIPTION_TIERS } = require('../utils/constants');
const { userUsage, users } = require('../data/sampleData');

const trackUsage = (operation) => {
    return (req, res, next) => {
        const userId = req.user.userId;
        const usage = userUsage.get(userId) || { 
            searchesThisMonth: 0, 
            lastReset: new Date() 
        };

        const now = new Date();
        if (now.getMonth() !== usage.lastReset.getMonth()) {
            usage.searchesThisMonth = 0;
            usage.lastReset = now;
        }

        const user = users.get(userId);
        const tier = SUBSCRIPTION_TIERS[user.subscriptionTier || 'FREE'];
        
        if (operation === 'search' && tier.features.searchesPerMonth !== -1) {
            if (usage.searchesThisMonth >= tier.features.searchesPerMonth) {
                return res.status(429).json({ 
                    error: 'Monthly search limit exceeded',
                    limit: tier.features.searchesPerMonth,
                    used: usage.searchesThisMonth,
                    upgradeUrl: '/api/subscription/upgrade'
                });
            }
            usage.searchesThisMonth++;
        }

        userUsage.set(userId, usage);
        req.usage = usage;
        next();
    };
};

module.exports = {
    trackUsage
};