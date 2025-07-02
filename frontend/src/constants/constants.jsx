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

export const FREELANCER_DATABASE = [
  {
    id: 1,
    name: 'Sarah Chen',
    skills: ['React', 'JavaScript', 'UI/UX Design'],
    rating: 4.9,
    hourlyRate: 85,
    completedProjects: 127,
    avatar: '👩‍💻',
    location: 'San Francisco, CA',
    matchScore: 95,
    availability: 'Available now',
    portfolio: ['E-commerce platform', 'SaaS dashboard', 'Mobile app UI']
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    skills: ['Logo Design', 'Brand Identity', 'Illustration'],
    rating: 4.8,
    hourlyRate: 65,
    completedProjects: 89,
    avatar: '🎨',
    location: 'New York, NY',
    matchScore: 92,
    availability: 'Available in 2 days',
    portfolio: ['Tech startup logos', 'Restaurant branding', 'Book covers']
  },
  {
    id: 3,
    name: 'Alex Rodriguez',
    skills: ['Content Writing', 'SEO', 'Copywriting'],
    rating: 4.7,
    hourlyRate: 45,
    completedProjects: 156,
    avatar: '✍️',
    location: 'Austin, TX',
    matchScore: 88,
    availability: 'Available now',
    portfolio: ['Tech blog articles', 'Marketing copy', 'Product descriptions']
  }
];

export const DEMO_SCENARIOS = [
  "I need a modern logo designed for my tech startup, budget around $300",
  "Looking for a React developer to build a dashboard, 2-week timeline",
  "Need SEO content writing for my blog, 10 articles per month",
  "Seeking a UI/UX designer for mobile app redesign, $2000 budget"
];