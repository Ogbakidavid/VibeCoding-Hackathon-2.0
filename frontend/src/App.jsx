import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SUBSCRIPTION_TIERS, FREELANCER_DATABASE, DEMO_SCENARIOS } from './constants/constants';
import Header from './ui/Header';
import Message from './common/Message';
import TypingIndicator from './common/TypingIndicator';
import SubscriptionModal from './subscription/SubscriptionModal';
import SecurityStatus from './common/SecurityStatus';
import SearchResults from './freelancers/SearchResults';
import DemoScenarios from './ui/DemoScenarios';
import MessageInput from './ui/MessageInput';

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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    subscription: 'free',
    projectsUsed: 2,
    emailVerified: true,
    phoneVerified: false,
    idVerified: false,
    twoFactorEnabled: false
  });
  const [searchResults, setSearchResults] = useState([]);
  const [savedFreelancers, setSavedFreelancers] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const findMatches = useCallback((projectDescription, budget, timeline) => {
    const keywords = projectDescription.toLowerCase().split(' ');
    
    const matches = FREELANCER_DATABASE.map(freelancer => {
      let score = 0;
      
      freelancer.skills.forEach(skill => {
        if (keywords.some(keyword => skill.toLowerCase().includes(keyword))) {
          score += 30;
        }
      });
      
      if (budget) {
        const hourlyBudget = budget / 40;
        if (freelancer.hourlyRate <= hourlyBudget * 1.2) {
          score += 25;
        }
      }
      
      score += freelancer.rating * 10;
      
      if (freelancer.completedProjects > 100) score += 15;
      if (freelancer.completedProjects > 50) score += 10;
      
      if (freelancer.availability === 'Available now') score += 10;
      
      return {
        ...freelancer,
        matchScore: Math.min(Math.round(score), 100)
      };
    });
    
    return matches
      .filter(match => match.matchScore > 60)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, []);

  const processMessage = useCallback((message) => {
    const lowerMessage = message.toLowerCase();
    const budgetMatch = message.match(/\$(\d+)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;
    
    const timelineKeywords = ['urgent', 'asap', 'week', 'month', 'days'];
    const hasTimeline = timelineKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (currentUser.subscription === 'free' && currentUser.projectsUsed >= SUBSCRIPTION_TIERS.free.limit) {
      return {
        response: `🔒 <strong>Upgrade Required</strong><br/>You've reached your free plan limit of ${SUBSCRIPTION_TIERS.free.limit} projects this month. Upgrade to Pro for unlimited access and advanced AI matching!<br/><br/>💎 <em>Click the crown icon to see our plans.</em>`,
        matches: []
      };
    }
    
    const matches = findMatches(message, budget, hasTimeline);
    
    let response = '';
    if (matches.length > 0) {
      response = `🎯 <strong>Great! I found ${matches.length} highly-rated freelancers for your project.</strong><br/><br/>`;
      response += `💡 <em>Based on your requirements, here are the top matches:</em><br/>`;
      response += `• <strong>${matches[0].name}</strong> - ${matches[0].matchScore}% match (${matches[0].skills.join(', ')})<br/>`;
      if (matches[1]) response += `• <strong>${matches[1].name}</strong> - ${matches[1].matchScore}% match (${matches[1].skills.join(', ')})<br/>`;
      response += `<br/>📊 <em>Scroll down to see detailed profiles and contact information!</em>`;
    } else {
      response = `🔍 <strong>I'm searching our network for the perfect match...</strong><br/><br/>`;
      response += `Could you provide more details about:<br/>`;
      response += `• Specific skills needed<br/>`;
      response += `• Project timeline<br/>`;
      response += `• Budget range<br/><br/>`;
      response += `💬 <em>The more details you provide, the better I can match you!</em>`;
    }
    
    return { response, matches };
  }, [currentUser, findMatches]);

  const simulateBotResponse = useCallback(async (userMessage) => {
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    try {
      const { response, matches } = processMessage(userMessage);
      
      setIsTyping(false);
      
      const newBotMessage = {
        id: Date.now(),
        text: response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      
      if (matches.length > 0) {
        setSearchResults(matches);
        
        if (currentUser.subscription === 'free') {
          setCurrentUser(prev => ({
            ...prev,
            projectsUsed: prev.projectsUsed + 1
          }));
        }
      }
      
    } catch (error) {
      setIsTyping(false);
      console.error('Error processing message:', error);
      
      const errorMessage = {
        id: Date.now(),
        text: "⚠️ <strong>Something went wrong</strong><br/>I'm having trouble processing your request. Please try again or contact support if the issue persists.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [processMessage, currentUser]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim() === '' || isLoading || inputMessage.length > 500) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const messageToProcess = inputMessage.trim();
    setInputMessage('');
    
    simulateBotResponse(messageToProcess);
    
    setTimeout(() => setIsLoading(false), 1000);
  }, [inputMessage, isLoading, simulateBotResponse]);

  const handleUpgrade = useCallback((tier) => {
    setCurrentUser(prev => ({
      ...prev,
      subscription: tier,
      projectsUsed: 0
    }));
    setShowSubscriptionModal(false);
    
    const successMessage = {
      id: Date.now(),
      text: `🎉 <strong>Welcome to ${SUBSCRIPTION_TIERS[tier].name}!</strong><br/>Your account has been upgraded successfully. You now have access to all premium features!<br/><br/>✨ <em>Let's find you some amazing freelancers!</em>`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, successMessage]);
  }, []);

  const handleContactFreelancer = useCallback((freelancer) => {
    const contactMessage = {
      id: Date.now(),
      text: `📞 <strong>Connecting you with ${freelancer.name}</strong><br/><br/>I've initiated a conversation thread with ${freelancer.name}. They typically respond within 2-4 hours.<br/><br/>💡 <em>Pro tip: Be specific about your project requirements and timeline for the best response!</em>`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, contactMessage]);
  }, []);

  const handleSaveFreelancer = useCallback((freelancer, saved) => {
    if (saved) {
      setSavedFreelancers(prev => [...prev, freelancer]);
    } else {
      setSavedFreelancers(prev => prev.filter(f => f.id !== freelancer.id));
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header 
        currentUser={currentUser} 
        onUpgradeClick={() => setShowSubscriptionModal(true)} 
      />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {!currentUser.emailVerified && messages.length === 1 && (
            <div className="mb-6">
              <SecurityStatus user={currentUser} />
            </div>
          )}

          {messages.map((message) => (
            <Message
              key={message.id}
              message={message.text}
              isBot={message.isBot}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && <TypingIndicator />}

          {searchResults.length > 0 && (
            <SearchResults 
              results={searchResults} 
              onContact={handleContactFreelancer} 
              onSave={handleSaveFreelancer} 
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <DemoScenarios 
        scenarios={DEMO_SCENARIOS} 
        setInputMessage={setInputMessage} 
        isLoading={isLoading} 
        isTyping={isTyping} 
      />

      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        isTyping={isTyping}
        currentUser={currentUser}
        SUBSCRIPTION_TIERS={SUBSCRIPTION_TIERS}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentTier={currentUser.subscription}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}

export default App;