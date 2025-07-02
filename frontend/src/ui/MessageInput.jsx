import React from 'react';
import { X } from 'lucide-react';

const MessageInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  isTyping,
  demoScenarios,
  currentUser,
  SUBSCRIPTION_TIERS
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
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
          <div className="text-xs text-gray-500">
            Be specific about skills, timeline, and budget for better matches
          </div>
          {currentUser.subscription === 'free' && (
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <span>🔒</span>
              <span>{SUBSCRIPTION_TIERS.free.limit - currentUser.projectsUsed} searches remaining</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;