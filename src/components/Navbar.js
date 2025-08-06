import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaImages, FaUpload, FaTrophy, FaBars, FaTimes } from 'react-icons/fa';
import UserAvatar from './UserAvatar';

const Navbar = ({ user, auth, onSignOut }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/gallery', label: 'Gallery', icon: FaImages },
    { path: '/upload', label: 'Upload', icon: FaUpload },
    { path: '/results', label: 'Game Results', icon: FaTrophy },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-hawks-navy shadow-xl relative overflow-hidden z-10">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-xl border-2 border-hawks-red transform group-hover:scale-105 transition-all duration-300 overflow-hidden">
              <img 
                src="/hawks-logo.jpg?v=1" 
                alt="Hawks Baseball Logo" 
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  console.log('Logo image failed to load:', e.target.src);
                  // Fallback to text if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
                onLoad={(e) => {
                  console.log('Logo image loaded successfully:', e.target.src);
                }}
              />
              <div className="text-center text-xs font-bold text-hawks-navy w-full px-1 hidden">
                <div className="text-xs font-bold leading-tight mb-1">HAWKS</div>
                <div className="text-hawks-red font-bold leading-tight mb-1">BASEBALL</div>
                <div className="relative mb-1">
                  <div className="flex justify-center">
                    <div className="w-full h-1 bg-hawks-red"></div>
                  </div>
                  <div className="flex justify-center relative">
                    <div className="w-full h-1 bg-white border border-gray-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-hawks-navy rounded-full flex items-center justify-center text-white font-bold text-xs">H</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full h-1 bg-hawks-red"></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Hawks Baseball
              </h1>
              <p className="text-sm sm:text-base text-hawks-gold font-medium">
                Cooperstown Dreams Park 2025
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-hawks-red to-red-600 text-white shadow-lg'
                      : 'text-white hover:bg-white/15 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {user && (
              <div className="flex items-center space-x-4 ml-4">
                <UserAvatar user={user} auth={auth} onSignOut={onSignOut} />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-white hover:bg-white/15 rounded-xl transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-3 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 flex items-center space-x-4 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-hawks-red to-red-600 text-white shadow-lg'
                        : 'text-white hover:bg-white/15'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {user && (
                <>
                  {/* User Avatar (Mobile) */}
                  <div className="px-4 py-3 border-b border-white/20">
                    <UserAvatar user={user} auth={auth} onSignOut={() => {
                      onSignOut();
                      setIsMobileMenuOpen(false);
                    }} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 