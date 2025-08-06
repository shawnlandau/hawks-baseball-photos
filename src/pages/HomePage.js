import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaImages, FaUpload, FaTrophy, FaComments, FaCamera } from 'react-icons/fa';
import PlayerCard from '../components/PlayerCard';
import ParentMessages from '../components/ParentMessages';
import { teamRoster } from '../data/teamRoster';

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

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    // Navigate to gallery with player filter
    window.location.href = `/#/gallery?player=${player.id}`;
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
        {/* Hero Section with Quick Actions */}
        <section className="py-6 px-4">
          <div className="container mx-auto">
            {/* Welcome Message with Logo Background */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white mb-6 text-center overflow-hidden">
              {/* Background Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <img 
                  src="/hawks-logo.jpg" 
                  alt="Hawks Logo Background" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <img 
                    src="/hawks-logo.jpg" 
                    alt="Hawks Baseball Logo" 
                    className="w-12 h-12 rounded-lg shadow-lg border-2 border-white/20 mr-3"
                  />
                  <h1 className="text-2xl sm:text-3xl font-bold">Welcome to Hawks Baseball</h1>
                </div>
                <p className="text-white/90 text-sm sm:text-base">Cooperstown Dreams Park 2025 - Relive every moment of our incredible journey</p>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={index}
                    to={feature.link}
                    className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white hover:bg-white/20 transition-all duration-200 transform hover:-translate-y-1 border border-white/20"
                  >
                    <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="text-white text-lg" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {feature.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Compact Team Section */}
        <section className="py-6 px-4 bg-white/5">
          <div className="container mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white mb-1">Meet the Team</h2>
              <p className="text-white/80 text-xs">Tap any player to view their photos</p>
            </div>

            {/* Coaches Row */}
            <div className="flex justify-center mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                <PlayerCard
                  player={teamRoster[0]} // Head Coach
                  onPlayerClick={handlePlayerClick}
                />
                <PlayerCard
                  player={teamRoster[1]} // Assistant Coach
                  onPlayerClick={handlePlayerClick}
                />
              </div>
            </div>

            {/* Players Grid - 2 rows of 6 */}
            <div className="grid grid-cols-6 gap-2 max-w-4xl mx-auto">
              {teamRoster.slice(2).map((player, index) => (
                <div 
                  key={player.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <PlayerCard
                    player={player}
                    onPlayerClick={handlePlayerClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Memory Vault Preview */}
        <section className="py-6 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-hawks-navy mb-1">Recent Memories</h2>
              <p className="text-gray-600 text-xs">Latest photos and messages from our journey</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 mx-1 ${
                      activeTab === tab.id
                        ? 'bg-hawks-red text-white shadow-lg'
                        : 'bg-white text-hawks-navy hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Compact Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'memories' && (
                <div className="text-center py-8">
                  <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto">
                    <FaCamera className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Memory Vault</h3>
                    <p className="text-gray-500 text-xs mb-3">
                      View and share photos from our Cooperstown journey
                    </p>
                    <Link
                      to="/gallery"
                      className="inline-flex items-center space-x-2 bg-hawks-red text-white px-3 py-2 rounded-lg font-medium hover:bg-hawks-red-dark transition-colors text-sm"
                    >
                      <FaImages className="w-3 h-3" />
                      <span>View Gallery</span>
                    </Link>
                  </div>
                </div>
              )}

                              {activeTab === 'messages' && (
                  <ParentMessages />
                )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-hawks-navy text-white py-4 px-4">
          <div className="container mx-auto text-center">
            <p className="text-sm font-semibold mb-1">
              Hawks Baseball - Cooperstown Dreams Park 2025
            </p>
            <p className="text-white/70 text-xs">
              Capturing memories, building character, and honoring the traditions of America's pastime.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage; 