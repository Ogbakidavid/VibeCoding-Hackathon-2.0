import React from 'react';
import { Sparkles } from 'lucide-react';

const DemoScenarios = ({ scenarios, setInputMessage, isLoading, isTyping }) => {
  return (
    <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs text-gray-600 mb-2 flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>Try these demo scenarios:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario, index) => (
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
  );
};

export default DemoScenarios;