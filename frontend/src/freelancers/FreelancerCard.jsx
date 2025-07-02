import React, { useState } from 'react';
import { Heart, MessageCircle, Star } from 'lucide-react';

const FreelancerCard = ({ freelancer, onContact, onSave }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(freelancer, !isSaved);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
            {freelancer.avatar}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{freelancer.name}</h3>
            <p className="text-sm text-gray-600">{freelancer.location}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            freelancer.matchScore >= 90 ? 'bg-green-100 text-green-800' :
            freelancer.matchScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {freelancer.matchScore}% match
          </div>
          <button onClick={handleSave} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{freelancer.rating}</span>
        </div>
        <div className="text-sm text-gray-600">
          {freelancer.completedProjects} projects
        </div>
        <div className="text-sm font-medium text-green-600">
          ${freelancer.hourlyRate}/hr
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {freelancer.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Recent work:</p>
        <div className="space-y-1">
          {freelancer.portfolio.slice(0, 2).map((item, index) => (
            <p key={index} className="text-xs text-gray-500">• {item}</p>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          freelancer.availability === 'Available now' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {freelancer.availability}
        </span>
        <button
          onClick={() => onContact(freelancer)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact</span>
        </button>
      </div>
    </div>
  );
};

export default FreelancerCard;