import React, { useState } from 'react';
import { FaTrophy, FaCalendar, FaClock, FaBaseballBall, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const GameResults = () => {
  const [regularGames, setRegularGames] = useState([
    {
      id: 1,
      opponent: 'Burlington Bulldogs (CT)',
      date: 'July 30, 2025',
      time: '9:00 AM',
      location: 'Field 14',
      result: 'W',
      score: '6-5',
      highlight: 'Exciting opening game with strong pitching and clutch hitting',
      day: 'Friday'
    },
    {
      id: 2,
      opponent: 'Premier Sports Baseball (NY)',
      date: 'July 30, 2025',
      time: '5:30 PM',
      location: 'Field 15',
      result: 'W',
      score: '19-13',
      highlight: 'Offensive explosion with excellent hitting throughout the lineup',
      day: 'Friday'
    },
    {
      id: 3,
      opponent: 'Massachusetts Marauders (MA)',
      date: 'July 30, 2025',
      time: '11:00 PM',
      location: 'Field 1',
      result: 'L',
      score: '16-19',
      highlight: 'High-scoring game with late rally that came up short',
      day: 'Friday'
    },
    {
      id: 4,
      opponent: 'Texas Smoke (TX)',
      date: 'July 31, 2025',
      time: '1:30 PM',
      location: 'Field 17',
      result: 'L',
      score: '3-21',
      highlight: 'Facing strong opponent with challenging game conditions',
      day: 'Saturday'
    },
    {
      id: 5,
      opponent: 'Great Bay All Stars (NH)',
      date: 'July 31, 2025',
      time: '7:30 PM',
      location: 'Field 1',
      result: 'W',
      score: '8-4',
      highlight: 'Strong finish to the tournament with excellent team defense',
      day: 'Saturday'
    }
  ]);

  // eslint-disable-next-line no-unused-vars
  const [tournamentGames, setTournamentGames] = useState([
    {
      id: 1,
      opponent: 'Ridgewood Raiders Black (NJ)',
      date: 'August 1, 2025',
      time: '2:00 PM',
      location: 'Field 22',
      result: 'W',
      score: '5-4',
      highlight: 'Close tournament game with clutch late-inning performance',
      day: 'Sunday'
    },
    {
      id: 2,
      opponent: 'Titans Baseball Club (CA)',
      date: 'August 1, 2025',
      time: '4:30 PM',
      location: 'Field 22',
      result: 'L',
      score: '3-15',
      highlight: 'Challenging tournament matchup against strong opponent',
      day: 'Sunday'
    }
  ]);

  const addGame = () => {
    const newGame = {
      id: regularGames.length + 1,
      opponent: '',
      date: '',
      time: '',
      location: '',
      result: '',
      score: '',
      highlight: '',
      day: ''
    };
    setRegularGames([...regularGames, newGame]);
  };

  // Calculate tournament statistics
  const allGames = [...regularGames, ...tournamentGames];
  const totalGames = allGames.length;
  const wins = allGames.filter(game => game.result === 'W').length;
  const losses = allGames.filter(game => game.result === 'L').length;
  const totalRunsScored = allGames.reduce((total, game) => {
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
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-5xl mx-auto">
              <div className="w-32 h-32 bg-hawks-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white">
                <FaTrophy className="text-hawks-navy text-5xl" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Game Results
                <span className="block text-hawks-gold text-3xl md:text-4xl mt-4">
                  Cooperstown Dreams Park 2025
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                Relive every game, every victory, and every unforgettable moment 
                from our incredible Cooperstown journey.
              </p>

              {/* Tournament Info */}
              <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Tournament #12 - July 30, 2025</h2>
                <p className="text-white/90 text-xl mb-6">Official Cooperstown Dreams Park Tournament</p>
                <div className="flex justify-center items-center space-x-6 mb-6">
                  <FaMapMarkerAlt className="text-hawks-gold w-6 h-6" />
                  <span className="text-white/90 text-lg">Cooperstown, NY</span>
                </div>
                <div className="text-center">
                  <span className="text-hawks-gold font-bold text-2xl">Hawks Baseball (CA)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regular Games */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Regular Games
              </h2>
              <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                Our complete regular season tournament record and game highlights
              </p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
              {regularGames.map((game) => (
                <div key={game.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
                  {/* Game Header */}
                  <div className={`p-8 ${game.result === 'W' ? 'bg-gradient-to-r from-green-500 to-green-600' : game.result === 'L' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'} text-white`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">vs {game.opponent}</h3>
                      <div className="text-right">
                        <div className="text-5xl font-bold">{game.result}</div>
                        <div className="text-2xl font-semibold">{game.score}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-base">
                      <div className="flex items-center space-x-3">
                        <FaCalendar className="w-5 h-5" />
                        <span>{game.day} - {game.date}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaClock className="w-5 h-5" />
                        <span>{game.time}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaBaseballBall className="w-5 h-5" />
                        <span>{game.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-hawks-navy mb-4 flex items-center">
                        <FaStar className="text-hawks-gold w-5 h-5 mr-3" />
                        Game Highlight
                      </h4>
                      <p className="text-gray-700 text-lg leading-relaxed">{game.highlight}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tournament Games */}
        <section className="py-20 px-4 bg-white/15">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Tournament Games
              </h2>
              <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                Championship bracket and elimination tournament games
              </p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
              {tournamentGames.map((game) => (
                <div key={game.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
                  {/* Game Header */}
                  <div className={`p-8 ${game.result === 'W' ? 'bg-gradient-to-r from-green-500 to-green-600' : game.result === 'L' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'} text-white`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">vs {game.opponent}</h3>
                      <div className="text-right">
                        <div className="text-5xl font-bold">{game.result}</div>
                        <div className="text-2xl font-semibold">{game.score}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-base">
                      <div className="flex items-center space-x-3">
                        <FaCalendar className="w-5 h-5" />
                        <span>{game.day} - {game.date}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaClock className="w-5 h-5" />
                        <span>{game.time}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaBaseballBall className="w-5 h-5" />
                        <span>{game.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-hawks-navy mb-4 flex items-center">
                        <FaStar className="text-hawks-gold w-5 h-5 mr-3" />
                        Game Highlight
                      </h4>
                      <p className="text-gray-700 text-lg leading-relaxed">{game.highlight}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add Game Button */}
        <section className="py-12 px-4">
          <div className="container mx-auto text-center">
            <button
              onClick={addGame}
              className="bg-gradient-to-r from-hawks-gold to-yellow-400 text-hawks-navy px-12 py-6 rounded-2xl font-bold text-2xl hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-4 mx-auto"
            >
              <FaTrophy className="w-7 h-7" />
              <span>Add Game Result</span>
            </button>
          </div>
        </section>

        {/* Tournament Summary */}
        <section className="py-20 px-4 bg-white/95">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-hawks-navy mb-6">
                Tournament Summary
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our incredible journey through Cooperstown Dreams Park
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-white text-3xl font-bold">{totalGames}</span>
                </div>
                <h3 className="text-2xl font-semibold text-hawks-navy mb-3">Games Played</h3>
                <p className="text-gray-600 text-lg">Complete tournament record</p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-white text-3xl font-bold">{wins}</span>
                </div>
                <h3 className="text-2xl font-semibold text-hawks-navy mb-3">Victories</h3>
                <p className="text-gray-600 text-lg">Tournament wins</p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-white text-3xl font-bold">{losses}</span>
                </div>
                <h3 className="text-2xl font-semibold text-hawks-navy mb-3">Losses</h3>
                <p className="text-gray-600 text-lg">Tournament losses</p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-hawks-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-white text-3xl font-bold">{totalRunsScored}</span>
                </div>
                <h3 className="text-2xl font-semibold text-hawks-navy mb-3">Runs Scored</h3>
                <p className="text-gray-600 text-lg">Total offensive production</p>
              </div>
            </div>

            {/* Win Percentage */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-hawks-gold to-yellow-400 rounded-3xl p-8 inline-block shadow-2xl">
                <h3 className="text-3xl font-bold text-hawks-navy mb-3">
                  Win Percentage: {totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0}%
                </h3>
                <p className="text-hawks-navy font-bold text-xl">
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