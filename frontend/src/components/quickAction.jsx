import React from "react";

const QuickActions = ({ onQuickAction, disabled }) => {
  const quickActions = [
    "I need a modern logo designed for my tech startup, budget around $300",
    "Looking for a React developer to build a dashboard, 2-week timeline",
    "Need SEO content writing for my blog, 10 articles per month",
    "Seeking a UI/UX designer for mobile app redesign, $2000 budget"
  ];

  return (
    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
      <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onQuickAction(action)}
            disabled={disabled}
            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;