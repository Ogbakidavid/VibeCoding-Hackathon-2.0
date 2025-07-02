// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth Service
export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
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
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
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
            const response = await api.post('/match-freelancer', projectDetails);
            return response.data;
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

// Payment Service
export const paymentService = {
    getSubscriptionTiers: async () => {
        try {
            const response = await api.get('/tiers');
            return response.data.tiers || [];
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch subscription tiers' };
        }
    },

    createCheckoutSession: async (tier, success_url, cancel_url) => {
        try {
            const response = await api.post('/create-checkout-session', {
                tier,
                success_url,
                cancel_url
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to create checkout session' };
        }
    }
};

export default api;