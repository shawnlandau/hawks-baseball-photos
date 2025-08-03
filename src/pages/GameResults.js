import React, { useState } from 'react';
import { FaTrophy, FaCalendar, FaClock, FaBaseballBall, FaStar } from 'react-icons/fa';

const GameResults = () => {
  const [games, setGames] = useState([
    {
      id: 1,
      opponent: 'Bulldogs',
      date: 'July 30, 2025',
      time: '9:00 AM',
      location: 'Field 1',
      result: 'W',
      score: '12-2',
      highlight: 'Cole Thomas 3-run homer in opening ceremony game',
      players: ['Cole Thomas', 'Asher Joslin-White', 'Dylan Johnson']
    },
    {
      id: 2,
      opponent: 'Titans',
      date: 'July 31, 2025',
      time: '2:00 PM',
      location: 'Field 3',
      result: 'W',
      score: '8-3',
      highlight: 'Asher Joslin-White hits 2 doubles',
      players: ['Asher Joslin-White', 'Brian Aguilar', 'Jared Landau']
    },
    {
      id: 3,
      opponent: 'Marauders',
      date: 'August 1, 2025',
      time: '10:30 AM',
      location: 'Field 2',
      result: 'W',
      score: '15-0',
      highlight: 'Matthew Covington throws no-hitter',
      players: ['Matthew Covington', 'Ethan Heiss', 'Reed Kleamovich']
    },
    {
      id: 4,
      opponent: 'All Stars',
      date: 'August 2, 2025',
      time: '1:00 PM',
      location: 'Field 4',
      result: 'W',
      score: '7-6',
      highlight: 'Reed Kleamovich walk-off home run',
      players: ['Reed Kleamovich', 'Maxwell Millay', 'Thad Clark']
    },
    {
      id: 5,
      opponent: 'Titans',
      date: 'August 3, 2025',
      time: '3:00 PM',
      location: 'Championship Field',
      result: 'W',
      score: '6-4',
      highlight: 'Michael Woodruff game-winning catch',
      players: ['Hudson Brunton', 'Ashton McCarthy', 'Cole Thomas']
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
      players: []
    };
    setGames([...games, newGame]);
  };

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
            </div>
          </div>
        </section>

        {/* Game Results */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Tournament Games
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
                      <h3 className="text-2xl font-bold">vs {game.opponent}</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{game.result}</div>
                        <div className="text-lg">{game.score}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="w-4 h-4" />
                        <span>{game.date}</span>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">5</span>
                </div>
                <h3 className="text-xl font-semibold text-hawks-navy mb-2">Games Played</h3>
                <p className="text-gray-600">Complete tournament record</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-hawks-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-hawks-navy text-2xl font-bold">5</span>
                </div>
                <h3 className="text-xl font-semibold text-hawks-navy mb-2">Victories</h3>
                <p className="text-gray-600">Undefeated tournament run</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-hawks-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">48</span>
                </div>
                <h3 className="text-xl font-semibold text-hawks-navy mb-2">Runs Scored</h3>
                <p className="text-gray-600">Dominant offensive performance</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GameResults; 