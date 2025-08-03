import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaImages, FaUpload, FaTrophy, FaHeart, FaStar, FaComments, FaCamera } from 'react-icons/fa';
import PlayerCard from '../components/PlayerCard';
import MessageBoard from '../components/MessageBoard';
import ParentMessages from '../components/ParentMessages';
import EnhancedMemoryVault from '../components/EnhancedMemoryVault';
import { teamRoster, teamStats, tournamentHighlights } from '../data/teamRoster';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('memories');
  // eslint-disable-next-line no-unused-vars
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const features = [
    {
      icon: FaImages,
      title: 'Photo Gallery',
      description: 'Browse and relive every moment from our Cooperstown journey',
      color: 'bg-hawks-red',
      link: '/gallery'
    },
    {
      icon: FaUpload,
      title: 'Share Memories',
      description: 'Upload and share your favorite photos with the team',
      color: 'bg-hawks-navy',
      link: '/upload'
    },
    {
      icon: FaTrophy,
      title: 'Game Results',
      description: 'View all our tournament games, scores, and highlights',
      color: 'bg-hawks-red',
      link: '/results'
    }
  ];

  const values = [
    {
      icon: FaTrophy,
      title: 'Excellence',
      description: 'Striving for greatness on and off the field'
    },
    {
      icon: FaHeart,
      title: 'Sportsmanship',
      description: 'Playing with respect, integrity, and honor'
    },
    {
      icon: FaStar,
      title: 'Tradition',
      description: 'Honoring the legacy of America\'s pastime'
    }
  ];

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    // Navigate to gallery with player filter
    window.location.href = `/#/gallery?player=${player.id}`;
  };

  const handleDownloadAll = () => {
    // Implement bulk download functionality
    console.log('Downloading all photos...');
  };

  const tabs = [
    { id: 'memories', label: 'Memory Vault', icon: FaCamera },
    { id: 'messages', label: 'Messages', icon: FaComments }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="relative z-10">
        {/* 1. Meet the Hawks Section - Already at top */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Meet the Hawks
              </h2>
              <p className="text-xl text-white/95 max-w-3xl mx-auto">
                Our amazing players who made this Cooperstown journey unforgettable. 
                Tap any player to view their photos and memories.
              </p>
            </div>

            {/* Coach Cards - Both coaches above players */}
            <div className="flex justify-center gap-6 mb-12 animate-slide-up">
              <PlayerCard
                player={teamRoster[0]} // Head Coach
                onPlayerClick={handlePlayerClick}
              />
              <PlayerCard
                player={teamRoster[1]} // Assistant Coach
                onPlayerClick={handlePlayerClick}
              />
            </div>

            {/* Player Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {teamRoster.slice(2).map((player, index) => (
                <div 
                  key={player.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PlayerCard
                    player={player}
                    onPlayerClick={handlePlayerClick}
                  />
                </div>
              ))}
            </div>

            {/* Tournament Highlights */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Tournament Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournamentHighlights.map((game, index) => (
                  <div key={index} className="bg-white/25 rounded-lg p-4 animate-slide-up hover:bg-white/30 transition-colors duration-200" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="text-white font-semibold mb-2">{game.game}</div>
                    <div className="text-hawks-gold font-bold text-lg mb-1">{game.result}</div>
                    <div className="text-white/90 text-sm">{game.highlight}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Memory Vault Section - Light background */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-hawks-navy mb-4">
                Game Photos & Memories
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Relive every moment from our Cooperstown journey through photos and shared memories.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-8">
              {tabs.slice(1).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 mx-2 mb-2 ${
                      activeTab === tab.id
                        ? 'bg-hawks-red text-white shadow-lg'
                        : 'bg-white/25 text-hawks-navy hover:bg-white/35 hover:shadow-md border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {activeTab === 'memories' && (
                <EnhancedMemoryVault
                  photos={[]} // This would be populated with actual photos
                  onDownloadAll={handleDownloadAll}
                />
              )}

              {activeTab === 'messages' && (
                <MessageBoard />
              )}
            </div>
          </div>
        </section>

        {/* 3. Tournament Info Section - Dark background */}
        <section className="py-16 px-4 bg-gradient-to-r from-hawks-navy to-hawks-navy-dark">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Tournament Information
              </h2>
              <p className="text-xl text-white/95 max-w-3xl mx-auto">
                Everything you need to know about our Cooperstown Dreams Park experience.
              </p>
            </div>

            {/* Team Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12">
              <div className="bg-white/25 rounded-lg p-4 hover:bg-white/30 transition-colors duration-200">
                <div className="text-2xl font-bold text-white">{teamStats.record}</div>
                <div className="text-white/90 text-sm">Tournament Record</div>
              </div>
              <div className="bg-white/25 rounded-lg p-4 hover:bg-white/30 transition-colors duration-200">
                <div className="text-2xl font-bold text-white">{teamStats.runsScored}</div>
                <div className="text-white/90 text-sm">Runs Scored</div>
              </div>
              <div className="bg-white/25 rounded-lg p-4 hover:bg-white/30 transition-colors duration-200">
                <div className="text-2xl font-bold text-white">{teamStats.teamBattingAverage}</div>
                <div className="text-white/90 text-sm">Team Average</div>
              </div>
              <div className="bg-white/25 rounded-lg p-4 hover:bg-white/30 transition-colors duration-200">
                <div className="text-2xl font-bold text-white">{teamStats.teamERA}</div>
                <div className="text-white/90 text-sm">Team ERA</div>
              </div>
            </div>

            {/* Values Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-hawks-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Icon className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-white/95 text-lg">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Messages from Parents Section - Light background */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-hawks-navy mb-4">
                Messages from Parents
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Share your thoughts, memories, and messages with the team and families.
              </p>
            </div>

            {/* Messages Content */}
            <div className="max-w-4xl mx-auto">
              <ParentMessages />
            </div>
          </div>
        </section>

        {/* Quick Actions - Dark background */}
        <section className="py-16 px-4 bg-gradient-to-br from-hawks-navy to-hawks-navy-dark">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Quick Actions
              </h2>
              <p className="text-xl text-white/95 max-w-2xl mx-auto">
                Everything you need to stay connected with the team and preserve memories.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={index}
                    to={feature.link}
                    className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2 border border-gray-200 hover:border-hawks-red/30"
                  >
                    <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-hawks-navy mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">
                      {feature.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action - Light background */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-hawks-navy mb-6">
              Ready to Share Your Memories?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join the Hawks family and start capturing the moments that will last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/upload"
                className="bg-hawks-red text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-hawks-red-dark transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaUpload className="w-5 h-5" />
                <span>Upload Photos</span>
              </Link>
              <Link
                to="/results"
                className="bg-hawks-navy text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-hawks-navy-dark transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaTrophy className="w-5 h-5" />
                <span>View Results</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-hawks-navy text-white py-8 px-4">
          <div className="container mx-auto text-center">
            <p className="text-lg font-semibold mb-2">
              Hawks Baseball - Cooperstown Dreams Park 2025
            </p>
            <p className="text-white/90">
              Capturing memories, building character, and honoring the traditions of America's pastime.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage; 