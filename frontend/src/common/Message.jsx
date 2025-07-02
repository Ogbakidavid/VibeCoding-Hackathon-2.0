import React from 'react';

const Message = ({ message, isBot, timestamp, showAvatar = true }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-2xl ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {showAvatar && (
          <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg ${
              isBot ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-teal-600'
            }`}>
              {isBot ? '🤖' : '👤'}
            </div>
          </div>
        )}
        
        <div className={`px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
          isBot 
            ? 'bg-white/90 border border-gray-100 text-gray-800' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }`}>
          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: message }} />
          <p className={`text-xs mt-2 ${isBot ? 'text-gray-500' : 'text-blue-100'}`}>
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;