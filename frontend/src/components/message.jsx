const Message = ({ message, isBot, timestamp }) => (
  <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
    <div className={`flex max-w-full sm:max-w-xs lg:max-w-md ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
          isBot ? 'bg-blue-500' : 'bg-gray-200'
        }`}>
          {isBot ? '🤖' : '👤'}
        </div>
      </div>
      <div className={`px-4 py-2 rounded-lg shadow-md ${
        isBot 
          ? 'bg-white border border-gray-200 text-gray-800' 
          : 'bg-blue-500 text-white'
      }`}>
        {isBot ? (
          <p
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        ) : (
          <p className="text-sm leading-relaxed">{message}</p>
        )}
        <p className={`text-xs mt-1 ${
          isBot ? 'text-gray-500' : 'text-blue-100'
        }`}>
          {timestamp}
        </p>
      </div>
    </div>
  </div>
);

export default Message;