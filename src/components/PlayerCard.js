import React from 'react';
import { FaCamera, FaUser } from 'react-icons/fa';

const PlayerCard = ({ player, onPlayerClick, isSelected = false }) => {
  const handleClick = () => {
    if (onPlayerClick) {
      onPlayerClick(player);
    }
  };

  const isCoach = player.jerseyNumber === 'HC' || player.jerseyNumber === 'AC';
  const isHeadCoach = player.jerseyNumber === 'HC';

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
        isSelected ? 'ring-4 ring-hawks-red' : ''
      } ${isCoach ? 'ring-2 ring-hawks-gold' : ''}`}
    >
      {/* Player Photo */}
      <div className={`relative h-48 rounded-t-xl overflow-hidden ${isCoach ? 'bg-gradient-to-br from-hawks-gold to-yellow-400' : 'bg-gradient-to-br from-hawks-navy to-hawks-red'}`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        
        {/* Jersey Number */}
        {!isCoach && (
          <div className="absolute top-2 right-2 bg-white/80 text-hawks-navy text-sm font-medium px-2 py-1 rounded-full shadow-sm">
            {player.jerseyNumber}
          </div>
        )}
        
        {/* Photo or Fallback */}
        <div className="w-full h-full flex items-center justify-center">
          {player.photo ? (
            <img
              src={player.photo}
              alt={`${player.name} - Jersey #${player.jerseyNumber}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-hawks-navy to-hawks-red ${player.photo ? 'hidden' : ''}`}>
            <FaUser className="text-white/60 text-4xl" />
          </div>
        </div>
        
        {/* Photo Count Badge */}
        {player.photoCount && player.photoCount > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/90 text-hawks-navy px-2 py-1 rounded-full text-sm font-medium shadow-lg flex items-center space-x-1">
            <FaCamera className="w-3 h-3" />
            <span>{player.photoCount}</span>
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="p-4">
        {/* Name Only */}
        <div className="text-center">
          <h3 className={`text-lg font-bold ${isCoach ? 'text-hawks-gold' : 'text-hawks-navy'}`}>
            {player.name}
          </h3>
          {isCoach && (
            <p className="text-sm text-gray-600 mt-1">
              {isHeadCoach ? 'Head Coach' : 'Assistant Coach'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 