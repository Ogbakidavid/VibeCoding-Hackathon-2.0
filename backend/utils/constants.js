module.exports = {
    SUBSCRIPTION_TIERS: {
        FREE: {
            name: 'Free',
            price: 0,
            monthlyPrice: 0,
            features: {
                searchesPerMonth: 10,
                advancedFilters: false,
                prioritySupport: false,
                realTimeUpdates: false,
                customMatchingAlgorithm: false,
                bulkOperations: false,
                analyticsAccess: false,
                apiAccess: false
            }
        },
        BASIC: {
            name: 'Basic',
            price: 29,
            monthlyPrice: 29,
            stripeProductId: 'prod_basic_plan',
            stripePriceId: 'price_basic_monthly',
            features: {
                searchesPerMonth: 100,
                advancedFilters: true,
                prioritySupport: false,
                realTimeUpdates: true,
                customMatchingAlgorithm: false,
                bulkOperations: false,
                analyticsAccess: true,
                apiAccess: false
            }
        },
        PRO: {
            name: 'Pro',
            price: 79,
            monthlyPrice: 79,
            stripeProductId: 'prod_pro_plan',
            stripePriceId: 'price_pro_monthly',
            features: {
                searchesPerMonth: 500,
                advancedFilters: true,
                prioritySupport: true,
                realTimeUpdates: true,
                customMatchingAlgorithm: true,
                bulkOperations: true,
                analyticsAccess: true,
                apiAccess: true
            }
        },
        ENTERPRISE: {
            name: 'Enterprise',
            price: 199,
            monthlyPrice: 199,
            stripeProductId: 'prod_enterprise_plan',
            stripePriceId: 'price_enterprise_monthly',
            features: {
                searchesPerMonth: -1, // Unlimited
                advancedFilters: true,
                prioritySupport: true,
                realTimeUpdates: true,
                customMatchingAlgorithm: true,
                bulkOperations: true,
                analyticsAccess: true,
                apiAccess: true,
                customIntegrations: true,
                dedicatedSupport: true
            }
        }
    },
    DEFAULT_PORT: 5000,
};