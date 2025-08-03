import React, { useState } from 'react';
import { FaHeart, FaSmile, FaThumbsUp, FaDownload, FaCalendar, FaUser, FaComment, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MemoryVault = ({ photos = [], onDownloadAll }) => {

  const [reactions, setReactions] = useState({});
  const [comments, setComments] = useState({});

  const addReaction = (photoId, reaction) => {
    setReactions(prev => ({
      ...prev,
      [photoId]: [...(prev[photoId] || []), reaction]
    }));
  };

  const addComment = (photoId, comment) => {
    if (comment.trim()) {
      setComments(prev => ({
        ...prev,
        [photoId]: [...(prev[photoId] || []), {
          id: Date.now(),
          text: comment,
          author: 'Parent',
          timestamp: new Date()
        }]
      }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 relative">
        <div className="bg-white/10 rounded-2xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="w-8 h-8 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Memory Vault Empty</h3>
          <p className="text-white/70 text-sm mb-4">
            Share photos to start building our team's memory wall!
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center space-x-2 bg-hawks-red text-white px-6 py-3 rounded-lg font-medium hover:bg-hawks-red-dark transition-colors min-h-[48px]"
          >
            <FaPlus className="w-4 h-4" />
            <span>Upload Photos</span>
          </Link>
        </div>

        {/* Floating Action Button */}
        <Link
          to="/upload"
          className="fixed bottom-6 right-6 bg-hawks-red text-white w-16 h-16 rounded-full shadow-lg hover:bg-hawks-red-dark transition-all duration-200 transform hover:scale-110 flex items-center justify-center z-40 min-h-[64px] min-w-[64px]"
          aria-label="Upload photos"
        >
          <FaPlus className="w-6 h-6" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Memory Vault
            </h2>
            <p className="text-white/80 text-sm sm:text-base">
              Our team's journey through photos, memories, and moments that will last forever
            </p>
          </div>
          
          {onDownloadAll && (
            <button
              onClick={onDownloadAll}
              className="bg-hawks-red text-white px-6 py-3 rounded-lg font-medium hover:bg-hawks-red-dark transition-colors flex items-center space-x-2 min-h-[48px]"
            >
              <FaDownload className="w-4 h-4" />
              <span>Download All Photos</span>
            </button>
          )}
        </div>
      </div>

      {/* Photo Timeline */}
      <div className="space-y-6">
        {photos.map((photo, index) => (
          <div key={photo.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Photo */}
            <div className="relative">
              <img
                src={photo.url}
                alt={photo.caption || 'Team memory'}
                className="w-full h-64 sm:h-80 object-cover"
              />
              
              {/* Photo Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(photo.uploadedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-4 h-4" />
                    <span className="text-sm">{photo.userEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Details */}
            <div className="p-4 space-y-4">
              {/* Caption */}
              {photo.caption && (
                <p className="text-gray-800 text-sm sm:text-base">
                  {photo.caption}
                </p>
              )}

              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-hawks-red/10 text-hawks-red px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Reactions */}
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => addReaction(photo.id, '❤️')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Add heart reaction"
                  >
                    <FaHeart className="w-4 h-4 text-red-500" />
                  </button>
                  <button
                    onClick={() => addReaction(photo.id, '😊')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Add smile reaction"
                  >
                    <FaSmile className="w-4 h-4 text-yellow-500" />
                  </button>
                  <button
                    onClick={() => addReaction(photo.id, '👍')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Add thumbs up reaction"
                  >
                    <FaThumbsUp className="w-4 h-4 text-blue-500" />
                  </button>
                </div>

                {/* Reaction Count */}
                {reactions[photo.id] && reactions[photo.id].length > 0 && (
                  <div className="flex space-x-1">
                    {reactions[photo.id].map((reaction, reactionIndex) => (
                      <span key={reactionIndex} className="text-lg">
                        {reaction}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="space-y-3">
                {comments[photo.id] && comments[photo.id].length > 0 && (
                  <div className="space-y-2">
                    {comments[photo.id].map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-gray-700">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a memory or comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent text-sm min-h-[40px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addComment(photo.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      addComment(photo.id, input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-hawks-red text-white rounded-lg hover:bg-hawks-red-dark transition-colors flex items-center space-x-1 min-h-[40px]"
                  >
                    <FaComment className="w-3 h-3" />
                    <span className="text-sm">Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <Link
        to="/upload"
        className="fixed bottom-6 right-6 bg-hawks-red text-white w-16 h-16 rounded-full shadow-lg hover:bg-hawks-red-dark transition-all duration-200 transform hover:scale-110 flex items-center justify-center z-40 min-h-[64px] min-w-[64px]"
        aria-label="Upload photos"
      >
        <FaPlus className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default MemoryVault; 