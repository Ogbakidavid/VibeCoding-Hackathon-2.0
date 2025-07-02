import React from 'react';
import { Check, X } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '../constants/constants';

const SubscriptionModal = ({ isOpen, onClose, currentTier, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Unlock more features and find better matches</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => {
              const isCurrentTier = currentTier === key;
              const isRecommended = key === 'pro';

              return (
                <div
                  key={key}
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    isRecommended
                      ? 'border-blue-500 bg-blue-50 transform scale-105'
                      : 'border-gray-200 bg-white'
                  } ${isCurrentTier ? 'ring-2 ring-green-500' : ''}`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {isCurrentTier && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Current</span>
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-8 h-8 mx-auto mb-3 ${
                      isRecommended ? 'text-blue-500' : 'text-gray-600'
                    }`}>
                      {tier.icon === 'User' && '👤'}
                      {tier.icon === 'Crown' && '👑'}
                      {tier.icon === 'Sparkles' && '✨'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">${tier.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onUpgrade(key)}
                    disabled={isCurrentTier}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      isCurrentTier
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : isRecommended
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isCurrentTier ? 'Current Plan' : `Upgrade to ${tier.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;