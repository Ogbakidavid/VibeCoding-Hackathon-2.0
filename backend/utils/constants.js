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
            stripeProductId: "prod_Sc12lN8NxWjblK",
            stripePriceId: "price_1Rgn0F07Ma4q3FW3fTKoVVTP",
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
            stripeProductId: "prod_Sc0WJKPFinYc36",
            stripePriceId: "price_1RgmVe07Ma4q3FW3RsRykAar",
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
            stripeProductId: "prod_Sc0ZQDfzv0Tr34",
            stripePriceId: "price_1RgmYU07Ma4q3FW3K4eIyNVz",
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