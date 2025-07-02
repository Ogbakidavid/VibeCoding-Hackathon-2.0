import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import FreelancerCard from './FreelancerCard';

const SearchResults = ({ results, onContact, onSave }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span>Top Matches Found</span>
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Award className="w-4 h-4" />
            <span>AI-Powered Matching</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((freelancer) => (
            <FreelancerCard
              key={freelancer.id}
              freelancer={freelancer}
              onContact={onContact}
              onSave={onSave}
            />
          ))}
        </div>

        {results.length > 3 && (
          <div className="mt-6 text-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
              View All {results.length} Matches
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;