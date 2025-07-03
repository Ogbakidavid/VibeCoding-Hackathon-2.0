const sampleFreelancers = [
    {
        id: "fl_001",
        name: "Sarah Johnson",
        skills: ["Logo Design", "Brand Identity", "Adobe Illustrator", "Photoshop", "Creative Direction"],
        experience_years: 5,
        rating: 4.9,
        hourly_rate: 45,
        availability: "Available immediately",
        location: "New York, USA",
        completed_projects: 127,
        recent_work: ["Tech startup logo", "Restaurant brand identity", "E-commerce brand package"],
        bio: "Specialized in modern, minimalist logos for startups and tech companies. Award-winning designer with 5+ years of experience."
    },
    {
        id: "fl_002",
        name: "Mike Chen",
        skills: ["React", "Node.js", "Full-Stack Development", "MongoDB", "AWS", "JavaScript", "API Development"],
        experience_years: 7,
        rating: 4.8,
        hourly_rate: 65,
        availability: "Available in 2 days",
        location: "San Francisco, USA",
        completed_projects: 89,
        recent_work: ["E-commerce platform", "SaaS dashboard", "Mobile app backend"],
        bio: "Expert in modern web applications, e-commerce platforms, and SaaS solutions. Full-stack developer with cloud expertise."
    },
    {
        id: "fl_003",
        name: "Emma Rodriguez",
        skills: ["Content Writing", "SEO", "Blog Writing", "Copywriting", "Content Strategy"],
        experience_years: 4,
        rating: 4.7,
        hourly_rate: 35,
        availability: "Available immediately",
        location: "Austin, USA",
        completed_projects: 156,
        recent_work: ["Tech blog content", "SaaS website copy", "Email marketing campaigns"],
        bio: "Engaging content for tech startups, SaaS companies, and e-commerce brands. SEO-optimized writing specialist."
    },
    {
        id: "fl_004",
        name: "David Kim",
        skills: ["UI/UX Design", "Figma", "Adobe XD", "Prototyping", "User Research", "Mobile UI"],
        experience_years: 6,
        rating: 4.9,
        hourly_rate: 55,
        availability: "Available next week",
        location: "Toronto, Canada",
        completed_projects: 73,
        recent_work: ["Mobile app redesign", "SaaS dashboard UI", "E-commerce UX audit"],
        bio: "Award-winning mobile and web app designs for Fortune 500 companies. User-centered design approach."
    },
    {
        id: "fl_005",
        name: "Alex Thompson",
        skills: ["Python", "Django", "Machine Learning", "Data Analysis", "API Development", "AI Integration"],
        experience_years: 8,
        rating: 4.8,
        hourly_rate: 70,
        availability: "Available immediately",
        location: "London, UK",
        completed_projects: 65,
        recent_work: ["AI chatbot development", "Data pipeline automation", "ML model deployment"],
        bio: "Backend systems and ML solutions for fintech and healthcare companies. AI/ML specialist with 8+ years experience."
    },
    {
        id: "fl_006",
        name: "Maria Garcia",
        skills: ["Social Media Marketing", "Instagram", "Facebook Ads", "Content Strategy", "Influencer Marketing"],
        experience_years: 3,
        rating: 4.6,
        hourly_rate: 40,
        availability: "Available immediately",
        location: "Miami, USA",
        completed_projects: 98,
        recent_work: ["Social media campaign", "Influencer collaboration", "Content calendar strategy"],
        bio: "Helped 50+ small businesses grow their social media presence and sales. Creative marketing strategist."
    },
    {
        id: "fl_007",
        name: "Jennifer Walsh",
        skills: ["Flutter", "Dart", "Mobile Development", "iOS", "Android", "Firebase"],
        experience_years: 4,
        rating: 4.8,
        hourly_rate: 60,
        availability: "Available next week",
        location: "Vancouver, Canada",
        completed_projects: 34,
        recent_work: ["Cross-platform mobile app", "Firebase integration", "App store deployment"],
        bio: "Mobile app developer specializing in Flutter cross-platform development. Expert in creating native-feeling apps for both iOS and Android."
    },
    // New Web3 and Blockchain freelancers
    {
        id: "fl_008",
        name: "Omar Hassan",
        skills: ["Solidity", "Smart Contracts", "Ethereum", "Web3.js", "DeFi", "Truffle", "Hardhat"],
        experience_years: 5,
        rating: 4.9,
        hourly_rate: 80,
        availability: "Available immediately",
        location: "Dubai, UAE",
        completed_projects: 48,
        recent_work: ["DeFi lending protocol", "NFT marketplace", "DAO smart contracts"],
        bio: "Experienced blockchain developer specializing in Ethereum smart contracts and decentralized finance applications."
    },
    {
        id: "fl_009",
        name: "Anita Patel",
        skills: ["Blockchain Architecture", "Hyperledger Fabric", "Corda", "Consensus Algorithms", "Distributed Ledger Technology"],
        experience_years: 7,
        rating: 4.7,
        hourly_rate: 90,
        availability: "Available in 3 days",
        location: "London, UK",
        completed_projects: 40,
        recent_work: ["Enterprise blockchain solution", "Supply chain tracking system", "Digital identity platform"],
        bio: "Blockchain architect with expertise in permissioned blockchain platforms and enterprise-grade DLT solutions."
    },
    {
        id: "fl_010",
        name: "Liam O'Reilly",
        skills: ["Rust", "Substrate", "Polkadot", "Web3.js", "Blockchain SDKs", "Cryptography"],
        experience_years: 6,
        rating: 4.8,
        hourly_rate: 85,
        availability: "Available next week",
        location: "Dublin, Ireland",
        completed_projects: 37,
        recent_work: ["Custom blockchain development", "Parachain implementation", "Cross-chain interoperability"],
        bio: "Full-stack blockchain developer with strong Rust and Substrate experience building scalable Web3 applications."
    }
];

// In-memory stores for new features
const users = new Map();
const sessions = new Map();
const userUsage = new Map();
const matchingHistory = new Map();

module.exports = {
    sampleFreelancers,
    users,
    sessions,
    userUsage,
    matchingHistory
};