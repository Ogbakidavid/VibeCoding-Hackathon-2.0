export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['5 project posts/month', 'Basic matching', 'Email support'],
    limit: 5,
    icon: 'User'
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: ['Unlimited projects', 'Advanced AI matching', 'Priority support', 'Analytics dashboard'],
    limit: Infinity,
    icon: 'Crown'
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    features: ['Everything in Pro', 'Custom integrations', 'Dedicated manager', 'White-label options'],
    limit: Infinity,
    icon: 'Sparkles'
  }
};