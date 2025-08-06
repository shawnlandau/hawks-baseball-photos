import React from 'react';
import { FaUser } from 'react-icons/fa';

const UserAvatar = ({ user, auth, onSignOut }) => {
  const handleSignOut = () => {
    onSignOut();
  };

  const getUserInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = (email) => {
    if (!email) return 'User';
    return email.split('@')[0];
  };

  return (
    <div className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200 text-white">
      {/* Avatar Circle */}
      <div className="w-8 h-8 bg-hawks-red rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white/20">
        {getUserInitials(auth?.currentUser?.email)}
      </div>
      
      {/* User Info */}
      <div className="hidden sm:block text-left">
        <div className="text-xs font-medium text-white">
          {getUserDisplayName(auth?.currentUser?.email)}
        </div>
        <div className="text-xs text-white/70">
          {auth?.currentUser?.email}
        </div>
      </div>
      
      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 text-white hover:text-red-300 transition-colors duration-200"
        aria-label="Sign out"
      >
        <FaUser className="w-3 h-3" />
        <span className="text-xs">Sign Out</span>
      </button>
    </div>
  );
};

export default UserAvatar; 