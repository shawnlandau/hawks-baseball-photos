import React, { useState } from 'react';
import { FaTrophy, FaCalendar, FaClock, FaBaseballBall, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const GameResults = () => {
  const [games, setGames] = useState([
    {
      id: 1,
      opponent: 'Burlington Bulldogs (CT)',
      date: 'July 30, 2025',
      time: '9:00 AM',
      location: 'Field 14',
      result: 'W',
      score: '6-5',
      highlight: 'Exciting opening game with strong pitching and clutch hitting',
      players: ['Cole Thomas', 'Asher Joslin-White', 'Dylan Johnson'],
      day: 'Friday'
    },
    {
      id: 2,
      opponent: 'Great Bay All Stars (NH)',
      date: 'July 31, 2025',
      time: '5:30 PM',
      location: 'Field 1',
      result: 'W',
      score: '8-4',
      highlight: 'Dominant performance with excellent team defense',
      players: ['Asher Joslin-White', 'Brian Aguilar', 'Jared Landau'],
      day: 'Saturday'
    }
  ]);

  const addGame = () => {
    const newGame = {
      id: games.length + 1,
      opponent: '',
      date: '',
      time: '',
      location: '',
      result: '',
      score: '',
      highlight: '',
      players: [],
      day: ''
    };
    setGames([...games, newGame]);
  };

  // Calculate tournament statistics
  const totalGames = games.length;
  const wins = games.filter(game => game.result === 'W').length;
  const losses = games.filter(game => game.result === 'L').length;
  const totalRunsScored = games.reduce((total, game) => {
    const hawksScore = parseInt(game.score.split('-')[0]);
    return total + hawksScore;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="w-24 h-24 bg-hawks-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <FaTrophy className="text-hawks-navy text-4xl" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Game Results
                <span className="block text-hawks-gold text-2xl md:text-3xl mt-2">
                  Cooperstown Dreams Park 2025
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Relive every game, every victory, and every unforgettable moment 
                from our incredible Cooperstown journey.
              </p>

              {/* Tournament Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Tournament #12 - July 30, 2025</h2>
                <p className="text-white/90 text-lg">Official Cooperstown Dreams Park Tournament</p>
                <div className="flex justify-center items-center space-x-4 mt-4">
                  <FaMapMarkerAlt className="text-hawks-gold w-5 h-5" />
                  <span className="text-white/90">Cooperstown, NY</span>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-hawks-gold font-bold text-lg">Hawks Baseball (CA)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Game Results */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Regular Games
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Our complete tournament record and game highlights
              </p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {games.map((game) => (
                <div key={game.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Game Header */}
                  <div className={`p-6 ${game.result === 'W' ? 'bg-green-500' : game.result === 'L' ? 'bg-red-500' : 'bg-gray-500'} text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">vs {game.opponent}</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{game.result}</div>
                        <div className="text-lg">{game.score}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="w-4 h-4" />
                        <span>{game.day} - {game.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClock className="w-4 h-4" />
                        <span>{game.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaBaseballBall className="w-4 h-4" />
                        <span>{game.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-hawks-navy mb-2 flex items-center">
                        <FaStar className="text-hawks-gold w-4 h-4 mr-2" />
                        Game Highlight
                      </h4>
                      <p className="text-gray-700">{game.highlight}</p>
                    </div>

                    {game.players.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-hawks-navy mb-2">Key Players</h4>
                        <div className="flex flex-wrap gap-2">
                          {game.players.map((player, index) => (
                            <span key={index} className="bg-hawks-red/10 text-hawks-red px-3 py-1 rounded-full text-sm font-medium">
                              {player}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Game Button */}
            <div className="text-center">
              <button
                onClick={addGame}
                className="bg-hawks-gold text-hawks-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <FaTrophy className="w-5 h-5" />
                <span>Add Game Result</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tournament Summary */}
        <section className="py-16 px-4 bg-white/95">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-hawks-navy mb-4">
                Tournament Summary
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our incredible journey through Cooperstown Dreams Park
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{totalGames}</span>
                </div>
                <h3 className="text-xl font-semibold text-hawks-navy mb-2">Games Played</h3>
                <p className="text-gray-600">Complete tournament record</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{wins}</span>
                </div>
                <h3 className="text-xl font-semibold text-hawks-navy mb-2">Victories</h3>
                <p className="text-gray-600">Tournament wins</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{losses}</span>
                </div>
                <h3 className="text-xl font-semibold text-hawks-navy mb-2">Losses</h3>
                <p className="text-gray-600">Tournament losses</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-hawks-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{totalRunsScored}</span>
                </div>
                <h3 className="text-xl font-semibold text-hawks-navy mb-2">Runs Scored</h3>
                <p className="text-gray-600">Total offensive production</p>
              </div>
            </div>

            {/* Win Percentage */}
            <div className="text-center mt-8">
              <div className="bg-hawks-gold rounded-xl p-6 inline-block">
                <h3 className="text-2xl font-bold text-hawks-navy mb-2">
                  Win Percentage: {totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0}%
                </h3>
                <p className="text-hawks-navy font-medium">
                  {wins}-{losses} Record
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GameResults; 