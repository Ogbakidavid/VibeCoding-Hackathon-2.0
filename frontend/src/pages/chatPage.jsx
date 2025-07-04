import { useState, useRef, useEffect } from "react";
import Header from "../ui/Header";
import Message from "../components/message";
import TypingIndicator from "../components/typingIndicator";
import QuickActions from "../components/quickAction";
import SubscriptionModal from "../components/subscriptionModal";
import { SUBSCRIPTION_TIERS } from "../constants/constant";

const ChatPage = () => {
    // State management
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
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    // Refs for scroll management
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Focus input on component mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

     // simulateBotResponse:
    const simulateBotResponse = async (userMessage) => {
        setIsTyping(true);

        try {
            const response = await fetch('https://vibecoding-hackathon-2-0.onrender.com/api/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            setIsTyping(false);

            if (data.success) {
                const newBotMessage = {
                    id: Date.now(),
                    text: data.response,
                    isBot: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                setMessages(prev => [...prev, newBotMessage]);
            } else {
                // Handle error
                const errorMessage = {
                    id: Date.now(),
                    text: "Sorry, I'm having trouble processing your request. Please try again.",
                    isBot: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            setIsTyping(false);
            console.error('Error calling API:', error);

            const errorMessage = {
                id: Date.now(),
                text: "I'm having trouble connecting right now. Please check your connection and try again.",
                isBot: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, errorMessage]);
        }
    };

    // Handle sending messages
    const handleSendMessage = () => {
        if (inputMessage.trim() === '' || isLoading) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputMessage.trim(),
            isBot: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Store the message before clearing input
        const messageToProcess = inputMessage.trim();
        setInputMessage('');

        // Simulate bot response
        simulateBotResponse(messageToProcess);

        // Reset loading state
        setTimeout(() => setIsLoading(false), 1000);
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle quick action clicks
    const handleQuickAction = (action) => {
        const userMessage = {
            id: Date.now(),
            text: action,
            isBot: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        setIsLoading(true);
        setInputMessage('');

        simulateBotResponse(action);

        setTimeout(() => setIsLoading(false), 1000);
    };

    // Add these lines to define subscription state and related info
    const [subscription, setSubscription] = useState('free'); // or 'pro', 'enterprise'
    const [projectsUsed, setProjectsUsed] = useState(0);

    // Get tier info from your constants
    const tierInfo = SUBSCRIPTION_TIERS[subscription] || SUBSCRIPTION_TIERS['free'];

    // Define the handler (you can customize this as needed)
    const onUpgradeClick = () => {
        setShowSubscriptionModal(true);
    };

    // Handle plan selection
    const handleSelectPlan = (planKey) => {
        setSubscription(planKey);
        setShowSubscriptionModal(false);
    };

    return (
        <>
        <Header currentUser={{ subscription, tierInfo, projectsUsed }} onUpgradeClick={onUpgradeClick} />

        {/* Subscription Modal */}
        <SubscriptionModal
            visible={showSubscriptionModal}
            onClose={() => setShowSubscriptionModal(false)}
            onSelectPlan={handleSelectPlan}
            currentPlan={subscription}
        />

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4">
            <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                    <Message
                        key={message.id}
                        message={message.text}
                        isBot={message.isBot}
                        timestamp={message.timestamp}
                    />
                ))}

                {/* Typing indicator */}
                {isTyping && <TypingIndicator isTyping={isTyping} />}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Quick Actions */}
        <QuickActions
            onQuickAction={handleQuickAction}
            disabled={isLoading || isTyping}
        />

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-2 sm:px-4 py-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-end sm:space-x-3 space-y-2 sm:space-y-0">
                    {/* Text input */}
                    <div className="flex-1 relative w-full">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Describe your project needs... (e.g., 'I need a logo designed for my startup, budget $200')"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="1"
                            style={{ minHeight: '44px', maxHeight: '120px' }}
                            disabled={isLoading || isTyping}
                        />

                        {/* Character counter */}
                        <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                            {inputMessage.length}/500
                        </div>
                    </div>

                    {/* Send button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={inputMessage.trim() === '' || isLoading || isTyping}
                        className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <span>Send</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>

                {/* Input hints */}
                <div className="mt-2 text-xs text-gray-500">
                    💡 Try: "I need a logo for $100 by Friday" or "Find me a React developer for 2 weeks"
                </div>
            </div>
        </div>
    </>
    );
};

export default ChatPage;