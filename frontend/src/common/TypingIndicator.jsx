import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex max-w-xs lg:max-w-md">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
            🤖
          </div>
        </div>
        <div className="bg-white/90 border border-gray-100 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="flex space-x-2 items-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-sm text-gray-600 ml-2">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;