import React from 'react';
import { FaCamera, FaBaseballBall, FaTrophy, FaUser } from 'react-icons/fa';

const PlayerCard = ({ player, onPlayerClick, isSelected = false }) => {
  const handleClick = () => {
    if (onPlayerClick) {
      onPlayerClick(player);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
        isSelected ? 'ring-4 ring-hawks-red' : ''
      }`}
    >
      {/* Player Photo */}
      <div className="relative h-48 bg-gradient-to-br from-hawks-navy to-hawks-red rounded-t-xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        
        {/* Jersey Number */}
        <div className="absolute top-3 right-3 bg-white/90 text-hawks-navy font-bold text-lg px-2 py-1 rounded-full shadow-lg">
          {player.jerseyNumber}
        </div>
        
        {/* Photo or Fallback */}
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={player.photo}
            alt={`${player.name} - ${player.position}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-hawks-navy to-hawks-red">
            <FaUser className="text-white/60 text-4xl" />
          </div>
        </div>
        
        {/* Photo Count Badge */}
        {player.photoCount > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/90 text-hawks-navy px-2 py-1 rounded-full text-sm font-medium shadow-lg flex items-center space-x-1">
            <FaCamera className="w-3 h-3" />
            <span>{player.photoCount}</span>
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="p-4 space-y-3">
        {/* Name and Position */}
        <div>
          <h3 className="text-lg font-bold text-hawks-navy mb-1">
            {player.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center">
            <FaBaseballBall className="w-3 h-3 mr-1" />
            {player.position}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-medium text-hawks-red">
            {player.stats}
          </p>
        </div>

        {/* Fun Fact */}
        <div className="bg-hawks-red/5 border-l-4 border-hawks-red rounded-r-lg p-3">
          <div className="flex items-start space-x-2">
            <FaTrophy className="text-hawks-red w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              {player.funFact}
            </p>
          </div>
        </div>

        {/* Action Hint */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Tap to view {player.name}'s photos
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 