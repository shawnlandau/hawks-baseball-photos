import React from 'react';
import { FaUser, FaUserTie } from 'react-icons/fa';

const PlayerCard = ({ player, onPlayerClick, isSelected = false }) => {
  const handleClick = () => {
    if (onPlayerClick) {
      onPlayerClick(player);
    }
  };

  const isCoach = player.jerseyNumber === 'HC' || player.jerseyNumber === 'AC';
  const isHeadCoach = player.jerseyNumber === 'HC';

  return (
    <button
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group relative transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-hawks-red focus:ring-offset-2 ${
        isSelected ? 'ring-4 ring-hawks-red ring-offset-2' : ''
      } ${
        isCoach 
          ? 'bg-white rounded-2xl shadow-lg hover:shadow-2xl ring-1 ring-slate-300 hover:ring-slate-400' 
          : 'bg-gradient-to-br from-hawks-navy to-hawks-navy-dark rounded-2xl shadow-lg hover:shadow-2xl text-white'
      }`}
      aria-label={`View photos for ${player.name} - ${isCoach ? (isHeadCoach ? 'Head Coach' : 'Assistant Coach') : `Player #${player.jerseyNumber}`}`}
      tabIndex={0}
    >
      {/* Enhanced Layout */}
      <div className="p-4">
        {/* Header with Photo and Info */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Circular Profile Photo */}
          <div className="relative flex-shrink-0">
            <div className={`${isCoach ? 'w-24 h-24' : 'w-20 h-20'} rounded-full overflow-hidden border-4 aspect-square ${
              isCoach 
                ? 'border-slate-300 bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg' 
                : 'border-hawks-red bg-gradient-to-br from-hawks-red to-hawks-red-dark shadow-lg'
            } flex items-center justify-center group-hover:shadow-xl transition-all duration-300`}>
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={`${player.name} - ${isCoach ? (isHeadCoach ? 'Head Coach' : 'Assistant Coach') : `Player #${player.jerseyNumber}`}`}
                  className={`w-full h-full rounded-full ${
                    isCoach ? 'object-contain' : 'object-cover'
                  } group-hover:scale-110 transition-transform duration-300`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center rounded-full ${
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
              <div className="absolute -top-2 -right-2 bg-slate-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                {isHeadCoach ? 'HC' : 'AC'}
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="w-full">
            <h3 className={`text-sm font-bold leading-tight break-words ${
              isCoach ? 'text-slate-700' : 'text-white'
            }`}>
              {player.name}
            </h3>
            <p className={`text-xs font-medium ${
              isCoach ? 'text-slate-500' : 'text-hawks-gold'
            }`}>
              {isCoach 
                ? (isHeadCoach ? 'Head Coach' : 'Assistant Coach')
                : `#${player.jerseyNumber}`
              }
            </p>
          </div>
        </div>

        {/* Enhanced Hover Effect Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 rounded-2xl pointer-events-none ${
          isCoach 
            ? 'bg-hawks-red/10 opacity-0 group-hover:opacity-100' 
            : 'bg-white/15 opacity-0 group-hover:opacity-100'
        }`} />
      </div>
    </button>
  );
};

export default PlayerCard; 