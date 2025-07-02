import React from 'react';
import { Check, X, Shield } from 'lucide-react';

const SecurityStatus = ({ user }) => {
  const securityFeatures = [
    { name: 'Email Verified', status: user?.emailVerified || false },
    { name: 'Phone Verified', status: user?.phoneVerified || false },
    { name: 'ID Verification', status: user?.idVerified || false },
    { name: '2FA Enabled', status: user?.twoFactorEnabled || false }
  ];

  const completedFeatures = securityFeatures.filter(f => f.status).length;
  const securityScore = (completedFeatures / securityFeatures.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <span>Security Status</span>
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          securityScore === 100 ? 'bg-green-100 text-green-800' :
          securityScore >= 75 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {securityScore}% Secure
        </div>
      </div>

      <div className="space-y-3">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{feature.name}</span>
            <div className={`flex items-center space-x-2 ${
              feature.status ? 'text-green-600' : 'text-gray-400'
            }`}>
              {feature.status ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>
          </div>
        ))}
      </div>

      {securityScore < 100 && (
        <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          Complete Security Setup
        </button>
      )}
    </div>
  );
};

export default SecurityStatus;