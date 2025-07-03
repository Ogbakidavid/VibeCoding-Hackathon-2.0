// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user token:', user?.token);  // Debug
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});


// Auth Service
export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            if (response.data.token) {
                // localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    ...response.data.user,
                    token: response.data.token
                }));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Registration failed' };
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            if (response.data.token) {
                // localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    ...response.data.user,
                    token: response.data.token
                }));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },

    logout: () => {
        // localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// Chat Service
export const chatService = {
    sendMessage: async (message, context) => {
        try {
            const response = await api.post('/chat', { message, context });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to process message' };
        }
    },

    legacyProcessChat: async (message, freelancers = []) => {
        try {
            const response = await api.post('/chat/process', { message, freelancers });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to process chat' };
        }
    }
};

// Freelancer Service
export const freelancerService = {
    getAllFreelancers: async () => {
        try {
            const response = await api.get('/freelancers');
            return response.data.freelancers || [];
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch freelancers' };
        }
    },

    getFreelancerById: async (id) => {
        try {
            const response = await api.get(`/freelancers/${id}`);
            if (!response.data.freelancer) {
                throw new Error('Freelancer not found');
            }
            return response.data.freelancer;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch freelancer' };
        }
    },

    matchFreelancer: async (projectDetails) => {
        try {
            // FIXED: Send the projectDetails as flat fields, not nested
            const response = await api.post('/match-freelancer', projectDetails);
            return response.data.match_result;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to match freelancers' };
        }
    }
};

// System Service
export const systemService = {
    checkHealth: async () => {
        try {
            const response = await api.get('/health');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Health check failed' };
        }
    }
};

// Payment Service - Corrected endpoint paths (no /subscription prefix)
export const paymentService = {
    getSubscriptionTiers: async () => {
        try {
            const response = await api.get('/tiers');
            return {
                ...response.data,
                tiers: response.data.tiers.map(tier => ({
                    ...tier,
                    isCurrent: authService.getCurrentUser()?.subscription?.tier === tier.id
                }))
            };
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch subscription tiers' };
        }
    },

    getCurrentSubscription: async () => {
        try {
            const user = authService.getCurrentUser();
            if (user?.subscription) {
                return user.subscription;
            }
            const response = await api.get('/current');
            return response.data.subscription;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch current subscription' };
        }
    },

    createCheckoutSession: async (tier) => {
        const res = await api.post('/subscription/create-checkout-session', { tier });
        return res.data;
    },


    cancelSubscription: async () => {
        try {
            const response = await api.post('/cancel');
            const user = authService.getCurrentUser();
            if (user) {
                user.subscription = {
                    tier: 'free',
                    status: 'canceled',
                    updatedAt: new Date().toISOString()
                };
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                error: 'Failed to cancel subscription',
                details: error.response?.data?.details
            };
        }
    },

    verifyPayment: async (sessionId) => {
        try {
            const response = await api.get(`/verify-payment?session_id=${sessionId}`);
            if (response.data.success && response.data.subscription) {
                const user = authService.getCurrentUser();
                if (user) {
                    user.subscription = response.data.subscription;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to verify payment' };
        }
    },

    handlePaymentSuccess: async () => {
        try {
            const sessionId = localStorage.getItem('stripe_session_id');
            if (!sessionId) throw new Error('No active session found');
            const result = await paymentService.verifyPayment(sessionId);
            localStorage.removeItem('stripe_session_id');
            return result;
        } catch (error) {
            throw error;
        }
    }
};

export default api;
