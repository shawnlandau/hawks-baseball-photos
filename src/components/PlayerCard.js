import React from 'react';
import { FaCamera, FaUser, FaUserTie } from 'react-icons/fa';

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
      className={`group relative transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 ${
        isSelected ? 'ring-2 ring-hawks-red ring-offset-2' : ''
      } ${
        isCoach 
          ? 'bg-white rounded-2xl shadow-md hover:shadow-xl ring-1 ring-slate-300 hover:ring-slate-400' 
          : 'bg-gradient-to-br from-hawks-navy to-hawks-navy-dark rounded-2xl shadow-md hover:shadow-xl text-white'
      }`}
    >
      {/* Compact Layout */}
      <div className="p-4">
        {/* Header with Photo and Info */}
        <div className="flex items-center space-x-3">
          {/* Circular Profile Photo */}
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
              isCoach 
                ? 'border-slate-300 bg-gradient-to-br from-slate-600 to-slate-700' 
                : 'border-hawks-red bg-gradient-to-br from-hawks-red to-hawks-red-dark'
            } flex items-center justify-center`}>
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={`${player.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center ${
                isCoach 
                  ? 'bg-gradient-to-br from-slate-600 to-slate-700' 
                  : 'bg-gradient-to-br from-hawks-red to-hawks-red-dark'
              } ${player.photo ? 'hidden' : ''}`}>
                {isCoach ? (
                  <FaUserTie className="text-white/80 text-xl" />
                ) : (
                  <FaUser className="text-white/80 text-xl" />
                )}
              </div>
            </div>
            
            {/* Coach Badge */}
            {isCoach && (
              <div className="absolute -top-1 -right-1 bg-slate-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                {isHeadCoach ? 'HC' : 'AC'}
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold truncate ${
              isCoach ? 'text-slate-700' : 'text-white'
            }`}>
              {player.name}
            </h3>
            <p className={`text-sm font-medium ${
              isCoach ? 'text-slate-500' : 'text-hawks-gold'
            }`}>
              {isCoach 
                ? (isHeadCoach ? 'Head Coach' : 'Assistant Coach')
                : `#${player.jerseyNumber}`
              }
            </p>
          </div>

          {/* Photo Count Indicator */}
          {player.photoCount && player.photoCount > 0 && (
            <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
              isCoach 
                ? 'bg-hawks-red/10 text-hawks-red' 
                : 'bg-white/20 text-white'
            }`}>
              <FaCamera className="w-3 h-3" />
              <span>{player.photoCount}</span>
            </div>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 rounded-2xl pointer-events-none ${
          isCoach 
            ? 'bg-hawks-red/5 opacity-0 group-hover:opacity-100' 
            : 'bg-white/10 opacity-0 group-hover:opacity-100'
        }`} />
      </div>
    </div>
  );
};

export default PlayerCard; 