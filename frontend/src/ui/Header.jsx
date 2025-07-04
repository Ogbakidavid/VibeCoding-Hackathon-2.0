import { Zap, Bell, Settings } from 'lucide-react';
// import { SUBSCRIPTION_TIERS } from '../constants/constants';

const Header = ({ currentUser, onUpgradeClick }) => {
  // Add any additional state or logic for the header if needed

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start max-lg:space-y-5">
        {/* Left side - logo and title */}
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
        
        {/* Right side - user controls */}
        <div className="flex items-center space-x-4 max-sm:flex-col max-sm:items-start max-sm:space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
              currentUser.subscription === 'free' ? 'bg-gray-100 text-gray-700' :
              currentUser.subscription === 'pro' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {currentUser.subscription === 'free' && '👤'}
              {currentUser.subscription === 'pro' && '👑'}
              {currentUser.subscription === 'enterprise' && '✨'}
              <span>{currentUser.tierInfo.name}</span>
            </div>
            
            {currentUser.subscription === 'free' && (
              <button
                onClick={onUpgradeClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1"
              >
                <span>👑</span>
                <span>Upgrade</span>
              </button>
            )}
          </div>
  
          {currentUser.subscription === 'free' && (
            <div className="text-xs text-gray-600">
              {currentUser.projectsUsed}/{currentUser.tierInfo.limit} projects used
            </div>
          )}
  
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
  
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
  
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;