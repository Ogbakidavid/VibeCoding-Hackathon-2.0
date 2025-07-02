class AdvancedMatchingEngine {
    constructor() {
        this.weights = {
            skillMatch: 0.35,
            experienceLevel: 0.20,
            availability: 0.15,
            rateCompatibility: 0.10,
            portfolioRelevance: 0.10,
            rating: 0.05,
            timezone: 0.05
        };
    }

    calculateSkillSimilarity(freelancerSkills, requiredSkills) {
        if (!requiredSkills.length) return 0.5;
        
        const freelancerSet = new Set(freelancerSkills.map(s => s.toLowerCase()));
        const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));
        
        const intersection = new Set([...freelancerSet].filter(x => requiredSet.has(x)));
        const union = new Set([...freelancerSet, ...requiredSet]);
        
        return intersection.size / union.size;
    }

    calculateAdvancedScore(freelancer, requirements, userTier = 'FREE') {
        let scores = {};
        
        scores.skillMatch = this.calculateSkillSimilarity(
            freelancer.skills, 
            requirements.matchedSkills
        ) * 100;
        
        const experienceMultiplier = requirements.complexity === 'high' ? 1.2 : 
                                    requirements.complexity === 'low' ? 0.9 : 1.0;
        scores.experience = Math.min(
            (freelancer.experience_years / 10) * 100 * experienceMultiplier, 
            100
        );
        
        scores.availability = this.calculateAvailabilityScore(freelancer, requirements);
        scores.rateCompatibility = this.calculateRateScore(freelancer, requirements);
        scores.portfolioRelevance = this.calculatePortfolioScore(freelancer, requirements);
        scores.rating = (freelancer.rating / 5) * 100 * freelancer.success_rate;
        scores.timezone = userTier !== 'FREE' ? 
            this.calculateTimezoneCompatibility(freelancer, requirements) : 50;
        
        let totalScore = 0;
        for (const [metric, score] of Object.entries(scores)) {
            totalScore += score * (this.weights[metric] || 0);
        }
        
        return {
            totalScore: Math.round(totalScore),
            breakdown: scores
        };
    }

    calculateAvailabilityScore(freelancer, requirements) {
        const availability = freelancer.availability.toLowerCase();
        const urgency = requirements.urgency;
        
        if (urgency === 'high') {
            return availability.includes('immediately') ? 100 : 
                availability.includes('available') ? 70 : 30;
        }
        return availability.includes('available') ? 90 : 60;
    }

    calculateRateScore(freelancer, requirements) {
        if (!requirements.budget) return 70;
        
        const estimatedHours = requirements.budget / freelancer.hourly_rate;
        if (estimatedHours >= 20 && estimatedHours <= 80) return 100;
        if (estimatedHours >= 10) return 85;
        if (estimatedHours >= 5) return 60;
        return 30;
    }

    calculatePortfolioScore(freelancer, requirements) {
        const industryMatch = freelancer.industry_focus?.some(industry => 
            requirements.projectType.includes(industry)
        ) ? 20 : 0;
        
        const workMatch = freelancer.recent_work.filter(work =>
            requirements.matchedSkills.some(skill => 
                work.toLowerCase().includes(skill.toLowerCase())
            )
        ).length;
        
        return Math.min(industryMatch + (workMatch * 20), 100);
    }

    calculateTimezoneCompatibility(freelancer, requirements) {
        // Simplified timezone scoring
        if (requirements.timezone && freelancer.timezone) {
            return freelancer.timezone === requirements.timezone ? 100 : 70;
        }
        return 80;
    }
}

module.exports = {
    AdvancedMatchingEngine
};