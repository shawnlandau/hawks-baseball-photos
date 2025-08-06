import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaImages, FaUpload, FaCalendar, FaComments, FaCamera, FaTrophy, FaUser, FaSearch, FaUserTie } from 'react-icons/fa';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import ParentMessages from '../components/ParentMessages';
import { teamRoster } from '../data/teamRoster';
import { useFirebase } from '../hooks/useFirebase';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('memories');
  const [latestPhotos, setLatestPhotos] = useState([]);
  const [uploadCount, setUploadCount] = useState(0);
  const [gameStats, setGameStats] = useState({ wins: 0, losses: 0, totalGames: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const { storage } = useFirebase();

  // Fetch latest photos for gallery preview
  useEffect(() => {
    const fetchLatestPhotos = async () => {
      if (!storage) return;
      
      try {
        const photosRef = ref(storage, 'photos');
        const photosResult = await listAll(photosRef);
        const photoPromises = photosResult.items.slice(0, 3).map(async (item) => {
          const url = await getDownloadURL(item);
          return { id: item.name, url };
        });
        
        const photos = await Promise.all(photoPromises);
        setLatestPhotos(photos);
      } catch (error) {
        console.error('Error fetching latest photos:', error);
      }
    };

    fetchLatestPhotos();
  }, [storage]);

  // Mock data for upload count and game stats
  useEffect(() => {
    setUploadCount(24); // Mock upload count
    setGameStats({ wins: 3, losses: 2, totalGames: 5 }); // Mock game stats
  }, []);

  const features = [
    {
      icon: FaImages,
      title: 'Photo Gallery',
      description: 'Browse and relive every moment from our Cooperstown journey',
      color: 'bg-hawks-red',
      link: '/gallery',
      preview: 'photos'
    },
    {
      icon: FaUpload,
      title: 'Share Memories',
      description: 'Upload and share your favorite photos with the team',
      color: 'bg-hawks-navy',
      link: '/upload',
      preview: 'uploads'
    },
    {
      icon: FaCalendar,
      title: 'Game Results',
      description: 'View all our tournament games, scores, and highlights',
      color: 'bg-hawks-red',
      link: '/results',
      preview: 'games'
    }
  ];

  const handlePlayerClick = (player) => {
    // Navigate to gallery with player filter
    window.location.href = `/#/gallery?player=${player.id}`;
  };

  const handlePlayerKeyDown = (e, player) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlayerClick(player);
    }
  };

  // Filter players based on search term
  const filteredPlayers = teamRoster.filter(player => {
    const searchLower = searchTerm.toLowerCase();
    return (
      player.name.toLowerCase().includes(searchLower) ||
      player.jerseyNumber.toString().includes(searchLower) ||
      player.position.toLowerCase().includes(searchLower)
    );
  });

  const tabs = [
    { id: 'memories', label: 'Memory Vault', icon: FaCamera },
    { id: 'messages', label: 'Messages', icon: FaComments }
  ];

  const renderPreview = (previewType) => {
    switch (previewType) {
      case 'photos':
        return (
          <div className="flex space-x-2 mb-4">
            {latestPhotos.length > 0 ? (
              latestPhotos.map((photo, index) => (
                <div key={photo.id} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <img 
                    src={photo.url} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))
            ) : (
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <FaImages className="text-gray-400 w-4 h-4" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'uploads':
        return (
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <FaUpload className="text-white w-6 h-6" />
            </div>
            <div className="ml-3 text-left">
              <div className="text-2xl font-bold text-white">{uploadCount}</div>
              <div className="text-white/80 text-xs">uploads</div>
            </div>
          </div>
        );
      
      case 'games':
        return (
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <FaTrophy className="text-white w-6 h-6" />
            </div>
            <div className="ml-3 text-left">
              <div className="text-2xl font-bold text-white">{gameStats.wins}-{gameStats.losses}</div>
              <div className="text-white/80 text-xs">record</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section with Quick Actions */}
        <section className="relative min-h-screen flex items-center justify-center px-4 scroll-mt-20" id="hero">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 bg-hawks-navy">
            <img 
              src="/players/TEAMPHOTO-2025-JULY 30-TEAM-40931-20251004-HAWKS BASEBALL-13.jpeg" 
              alt="Hawks Baseball Team - Cooperstown Dreams Park 2025" 
              className="w-full h-full object-contain object-center"
              loading="eager"
            />
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto text-center">
            {/* Welcome Message */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-white mb-12 border border-white/20 shadow-2xl max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/hawks-logo.jpg" 
                  alt="Hawks Baseball Logo" 
                  className="w-20 h-20 rounded-xl shadow-lg border-2 border-white/30 mr-6"
                  loading="lazy"
                />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-shadow">Welcome to Hawks Baseball</h1>
              </div>
              <p className="text-white/95 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed text-shadow">
                Cooperstown Dreams Park 2025 - Relive every moment of our incredible journey
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={index}
                    to={feature.link}
                    className="group bg-white/15 backdrop-blur-md rounded-2xl p-6 text-white hover:bg-white/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-white/20 shadow-xl hover:shadow-2xl block"
                  >
                    {/* Preview Element */}
                    {renderPreview(feature.preview)}
                    
                    {/* Icon and Title */}
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Compact Team Section */}
        <section className="py-12 px-4 bg-white/10 scroll-mt-20" id="team">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Meet the Team</h2>
              <p className="text-white/80 text-base">Tap any player to view their photos</p>
            </div>

            {/* Search/Filter Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search players by name, number, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              {searchTerm && (
                <p className="text-white/80 text-sm mt-2">
                  Showing {filteredPlayers.length} of {teamRoster.length} players
                </p>
              )}
            </div>

            {/* Coaches Row */}
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
                {filteredPlayers.filter(player => player.jerseyNumber === 'HC' || player.jerseyNumber === 'AC').map((player) => (
                  <div 
                    key={player.id}
                    tabIndex={0}
                    onClick={() => handlePlayerClick(player)}
                    onKeyDown={(e) => handlePlayerKeyDown(e, player)}
                    className="group relative transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-white rounded-2xl shadow-lg hover:shadow-2xl ring-1 ring-slate-300 hover:ring-slate-400"
                    role="button"
                    aria-label={`View photos for ${player.name} - ${player.jerseyNumber === 'HC' ? 'Head Coach' : 'Assistant Coach'}`}
                  >
                    <div className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 aspect-square border-slate-300 bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                            {player.photo ? (
                              <img
                                src={player.photo}
                                alt={`${player.name} headshot`}
                                className="w-full h-full rounded-full object-contain group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 hidden">
                              <FaUserTie className="text-white/80 text-xl" />
                            </div>
                          </div>
                          <div className="absolute -top-2 -right-2 bg-slate-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            {player.jerseyNumber}
                          </div>
                        </div>
                        <div className="w-full">
                          <h3 className="text-sm font-bold leading-tight break-words text-slate-700">
                            {player.name}
                          </h3>
                          <p className="text-xs font-medium text-slate-500">
                            {player.jerseyNumber === 'HC' ? 'Head Coach' : 'Assistant Coach'}
                          </p>
                        </div>
                      </div>
                      <div className="absolute inset-0 transition-opacity duration-300 rounded-2xl pointer-events-none bg-hawks-red/10 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Players Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {filteredPlayers.filter(player => player.jerseyNumber !== 'HC' && player.jerseyNumber !== 'AC').map((player, index) => (
                <div 
                  key={player.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div 
                    tabIndex={0}
                    onClick={() => handlePlayerClick(player)}
                    onKeyDown={(e) => handlePlayerKeyDown(e, player)}
                    className="group relative transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-gradient-to-br from-hawks-navy to-hawks-navy-dark rounded-2xl shadow-lg hover:shadow-2xl text-white"
                    role="button"
                    aria-label={`View photos for ${player.name} - Player #${player.jerseyNumber}`}
                  >
                    <div className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 aspect-square border-hawks-red bg-gradient-to-br from-hawks-red to-hawks-red-dark shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                            {player.photo ? (
                              <img
                                src={player.photo}
                                alt={`${player.name} headshot`}
                                className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-hawks-red to-hawks-red-dark hidden">
                              <FaUser className="text-white/80 text-xl" />
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          <h3 className="text-sm font-bold leading-tight break-words text-white">
                            {player.name}
                          </h3>
                          <p className="text-xs font-medium text-hawks-gold">
                            #{player.jerseyNumber}
                          </p>
                        </div>
                      </div>
                      <div className="absolute inset-0 transition-opacity duration-300 rounded-2xl pointer-events-none bg-white/15 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {filteredPlayers.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-white/80 text-lg">No players found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-white/90 hover:text-white underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Memory Vault Preview */}
        <section className="py-12 px-4 bg-gray-50 scroll-mt-20" id="memories">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-hawks-navy mb-3">Recent Memories</h2>
              <p className="text-gray-600 text-base">Latest photos and messages from our journey</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 mx-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-hawks-red to-red-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-hawks-navy hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-md'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Compact Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'memories' && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-100">
                    <FaCamera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Memory Vault</h3>
                    <p className="text-gray-500 text-base mb-6 leading-relaxed">
                      View and share photos from our Cooperstown journey
                    </p>
                    <Link
                      to="/gallery"
                      className="inline-flex items-center space-x-3 bg-gradient-to-r from-hawks-red to-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaImages className="w-5 h-5" />
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