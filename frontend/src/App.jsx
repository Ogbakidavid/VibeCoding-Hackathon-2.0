// App.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Crown, Zap, User, X, Heart, Sparkles, Lock, 
  Award, Clock, DollarSign, TrendingUp 
} from 'lucide-react';

// Import our API services
import api, { 
  authService, 
  chatService, 
  freelancerService, 
  paymentService 
} from './services/api';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51PkMtw07Ma4q3FW312QVbm6lbyhAAft0LR8Fc55Um5XUiIVV5JJMvfypWCa7NZLsaymKevbEfI5I0pZZeAZfz8Hp00NauwOCBf";

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// WebSocket setup (if needed)
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket']
});

const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['5 project posts/month', 'Basic matching', 'Email support'],
    limit: 5,
    icon: User
  },
  PRO: {
    name: 'Pro',
    price: 29,
    features: ['Unlimited projects', 'Advanced AI matching', 'Priority support', 'Analytics dashboard'],
    limit: Infinity,
    icon: Crown
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99,
    features: ['Everything in Pro', 'Custom integrations', 'Dedicated manager', 'White-label options'],
    limit: Infinity,
    icon: Sparkles
  }
};

const DEMO_SCENARIOS = [
  "I need a modern logo for my fintech startup, budget $500, needed by next Friday",
  "Looking for a full-stack developer experienced with React and Node.js for a 3-month project",
  "Seeking a content writer specialized in SEO articles for a healthcare blog",
  "Need a mobile app UI/UX designer for an e-commerce platform, timeline 2 weeks",
  "Require a digital marketing expert for Facebook and Instagram ads campaign"
];

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🚀 <strong>Welcome to FreelancersBot Pro!</strong><br/>I'm your AI-powered assistant for finding the perfect freelance talent. I use advanced matching algorithms to connect you with top-rated professionals.<br/><br/>✨ <em>What project can I help you with today?</em>",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedFreelancers, setSavedFreelancers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialization: get user and saved freelancers
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = authService.getCurrentUser();
        const freelancers = await freelancerService.getAllFreelancers();
        const savedIds = []; // You'll need to implement this based on your backend
        
        setCurrentUser(user);
        setSavedFreelancers(savedIds);
      } catch (error) {
        console.error('Initialization error:', error);
        setCurrentUser(null);
      } finally {
        setIsInitializing(false);
      }
    };
    initializeApp();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Send user message and get bot response from backend
  const simulateBotResponse = useCallback(async (userMessage) => {
    setIsTyping(true);
    try {
      const response = await chatService.sendMessage(userMessage);
      setIsTyping(false);
      
      const newBotMessage = {
        id: Date.now(),
        text: response.response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      
      // Handle match results if available
      if (response.match_result) {
        setSearchResults(response.match_result.recommended_freelancer ? 
          [response.match_result.recommended_freelancer] : []);
        setShowResults(true);
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Bot error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "⚠️ <strong>Something went wrong</strong><br/>Please try again.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setShowResults(false);
      setSearchResults([]);
    }
  }, []);

  // Handle sending user message
  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;
    setIsLoading(true);
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    simulateBotResponse(inputMessage).finally(() => setIsLoading(false));
  }, [inputMessage, simulateBotResponse]);

  // Keyboard Enter key sends message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !isTyping && inputMessage.trim()) {
        handleSendMessage();
      }
    }
  };

  // Handle subscription upgrade flow
  const handleUpgrade = async (tierKey) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const session = await paymentService.createCheckoutSession(tierKey);
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        alert('Failed to start checkout session.');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Subscription upgrade failed. Please try again later.');
    }
  };

  // UI Components
  const Message = ({ message, isBot, timestamp }) => (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
        isBot ? 'bg-white text-gray-800 rounded-bl-none shadow-md' : 'bg-blue-600 text-white rounded-br-none shadow-md'
      }`}>
        <div dangerouslySetInnerHTML={{ __html: message }} />
        <div className="text-xs text-gray-400 mt-1 text-right">{timestamp}</div>
      </div>
    </div>
  );

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-white px-4 py-3 rounded-2xl shadow-md animate-pulse text-gray-400 text-sm">
        FreelancersBot is typing...
      </div>
    </div>
  );

  const FreelancerCard = ({ freelancer }) => {
    const isSaved = savedFreelancers.includes(freelancer.id);
    return (
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col space-y-3 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg">{freelancer.name}</h4>
          <button
            className={`p-2 rounded-full transition-colors ${isSaved ? 'text-red-400 cursor-default' : 'text-gray-400 hover:text-red-600'}`}
            title={isSaved ? "Saved" : "Save Freelancer"}
          >
            <Heart size={20} fill={isSaved ? 'red' : 'none'} />
          </button>
        </div>
        <p className="text-sm text-gray-600">{freelancer.skills.join(', ')}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{freelancer.location}</span>
          <span>${freelancer.hourly_rate}/hour</span>
        </div>
      </div>
    );
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading FreelancersBot Pro</h1>
          <p className="text-gray-600">Initializing your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FreelancersBot Pro
              </h1>
              <p className="text-sm text-gray-600 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>AI-Powered Freelancer Matching</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                currentUser?.subscriptionTier === 'FREE' ? 'bg-gray-100 text-gray-700' :
                currentUser?.subscriptionTier === 'PRO' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {currentUser?.subscriptionTier === 'FREE' && <User className="w-3 h-3" />}
                {currentUser?.subscriptionTier === 'PRO' && <Crown className="w-3 h-3" />}
                {currentUser?.subscriptionTier === 'ENTERPRISE' && <Sparkles className="w-3 h-3" />}
                <span>{SUBSCRIPTION_TIERS[currentUser?.subscriptionTier]?.name || 'Free'}</span>
              </div>
              
              {currentUser?.subscriptionTier === 'FREE' && (
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1"
                >
                  <Crown className="w-3 h-3" />
                  <span>Upgrade</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message.text}
              isBot={message.isBot}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && <TypingIndicator />}

          {showResults && searchResults.length > 0 && (
            <div className="mt-8 animate-fadeIn">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span>Top Matches Found</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>AI-Powered Matching</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((freelancer) => (
                    <FreelancerCard
                      key={freelancer.id}
                      freelancer={freelancer}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Demo Scenarios */}
      <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-gray-600 mb-2 flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Try these demo scenarios:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {DEMO_SCENARIOS.map((scenario, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(scenario)}
                disabled={isLoading || isTyping}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full hover:from-blue-200 hover:to-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
              >
                {scenario.length > 50 ? `${scenario.substring(0, 50)}...` : scenario}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your project in detail..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white/90 backdrop-blur-sm"
                rows="1"
                style={{ minHeight: '52px', maxHeight: '120px' }}
                disabled={isLoading || isTyping}
                maxLength={500}
              />
              
              <div className="absolute bottom-2 right-4 flex items-center space-x-2">
                <div className={`text-xs ${
                  inputMessage.length > 450 ? 'text-red-500' : 
                  inputMessage.length > 400 ? 'text-yellow-500' : 'text-gray-400'
                }`}>
                  {inputMessage.length}/500
                </div>
                {inputMessage.length > 0 && (
                  <button
                    onClick={() => setInputMessage('')}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === '' || isLoading || isTyping || inputMessage.length > 500}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500 flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>Include budget for better matches</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Mention timeline for priority matching</span>
              </span>
              <span className="flex items-center space-x-1">
                <Award className="w-3 h-3" />
                <span>Be specific about skills needed</span>
              </span>
            </div>
            {currentUser?.subscriptionTier === 'FREE' && (
              <div className="text-xs text-gray-500 flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>{SUBSCRIPTION_TIERS.FREE.limit} searches remaining</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">Upgrade Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
                <div key={key} className={`border rounded-xl p-6 ${key === 'PRO' ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-4">
                    <tier.icon className={`w-6 h-6 mr-2 ${
                      key === 'FREE' ? 'text-gray-600' :
                      key === 'PRO' ? 'text-blue-500' : 'text-purple-500'
                    }`} />
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                  </div>
                  <div className="text-3xl font-bold mb-4">
                    ${tier.price}<span className="text-sm text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(key)}
                    className={`w-full py-2 rounded-lg font-medium ${
                      key === 'FREE' ? 'bg-gray-200 text-gray-700 cursor-not-allowed' :
                      key === 'PRO' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                      'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    disabled={key === 'FREE'}
                  >
                    {key === 'FREE' ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;