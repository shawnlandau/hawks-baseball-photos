import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaHeart, FaComment, FaDownload, FaShare, FaCalendar, FaUser, FaTag, FaImages } from 'react-icons/fa';
import { useFirebase } from '../hooks/useFirebase';

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PhotoGallery = () => {
  const { db, storage, userId } = useFirebase();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  // Hawks team roster for tagging
  const hawksPlayers = [
    'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5',
    'Player 6', 'Player 7', 'Player 8', 'Player 9', 'Player 10',
    'Player 11', 'Player 12', 'Coach 1', 'Coach 2'
  ];

  useEffect(() => {
    const unsubscribe = db.collection('photos')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const photoData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPhotos(photoData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [db]);

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || photo.tags?.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.timestamp?.toDate() - a.timestamp?.toDate();
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      case 'comments':
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      default:
        return 0;
    }
  });

  const handlePhotoSelect = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedPhotos.size} selected photo(s)?`)) return;

    try {
      const deletePromises = Array.from(selectedPhotos).map(async (photoId) => {
        const photo = photos.find(p => p.id === photoId);
        if (photo) {
          // Delete from Storage
          const storageRef = storage.refFromURL(photo.url);
          await storageRef.delete();
          
          // Delete from Firestore
          await db.collection('photos').doc(photoId).delete();
        }
      });

      await Promise.all(deletePromises);
      setSelectedPhotos(new Set());
    } catch (error) {
      console.error('Error deleting photos:', error);
      alert('Error deleting photos. Please try again.');
    }
  };

  const handleLike = async (photoId) => {
    try {
      const photoRef = db.collection('photos').doc(photoId);
      const photo = photos.find(p => p.id === photoId);
      
      if (photo.likedBy?.includes(userId)) {
        // Unlike
        await photoRef.update({
          likes: (photo.likes || 1) - 1,
          likedBy: photo.likedBy.filter(id => id !== userId)
        });
      } else {
        // Like
        await photoRef.update({
          likes: (photo.likes || 0) + 1,
          likedBy: [...(photo.likedBy || []), userId]
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async (photoId, comment) => {
    try {
      const photoRef = db.collection('photos').doc(photoId);
      const photo = photos.find(p => p.id === photoId);
      const newComment = {
        id: Date.now().toString(),
        text: comment,
        userId: userId,
        timestamp: new Date()
      };
      
      await photoRef.update({
        comments: [...(photo.comments || []), newComment]
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hawks-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-hawks-navy mb-2">
              Photo Gallery
            </h2>
            <p className="text-gray-600">
              {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-hawks-navy text-white rounded-lg hover:bg-hawks-navy-dark transition-colors flex items-center space-x-2"
            >
              <FaFilter />
              <span>Filters</span>
            </button>

            {/* Bulk Actions */}
            {selectedPhotos.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <FaTimes />
                <span>Delete ({selectedPhotos.size})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filter by Tag */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Tag
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent"
                >
                  <option value="all">All Photos</option>
                  {hawksPlayers.map(player => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent"
                >
                  <option value="date">Date (Newest)</option>
                  <option value="likes">Most Liked</option>
                  <option value="comments">Most Commented</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                    setSortBy('date');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      {sortedPhotos.length === 0 ? (
        <div className="text-center py-12">
          <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos found</h3>
          <p className="text-gray-500">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to share a photo!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedPhotos.map((photo) => (
            <div
              key={photo.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-xl ${
                selectedPhotos.has(photo.id) ? 'border-hawks-red' : 'border-transparent'
              }`}
            >
              {/* Photo */}
              <div className="relative group">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Hawks Baseball photo'}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setLightboxPhoto(photo)}
                />
                
                {/* Selection Overlay */}
                {selectedPhotos.has(photo.id) && (
                  <div className="absolute inset-0 bg-hawks-red/20 flex items-center justify-center">
                    <div className="bg-hawks-red text-white rounded-full p-2">
                      <FaTimes className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePhotoSelect(photo.id)}
                    className="bg-white/90 text-gray-700 p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags Overlay */}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    {photo.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-hawks-red/90 text-white text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="bg-gray-800/90 text-white text-xs px-2 py-1 rounded-full">
                        +{photo.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Photo Info */}
              <div className="p-4">
                {photo.caption && (
                  <p className="text-gray-800 font-medium mb-2 line-clamp-2">
                    {photo.caption}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="w-3 h-3" />
                    <span>{formatDate(photo.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-3 h-3" />
                    <span>{photo.userEmail}</span>
                  </div>
                </div>

                {/* Interaction Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(photo.id)}
                      className={`flex items-center space-x-1 ${
                        photo.likedBy?.includes(userId) ? 'text-hawks-red' : 'text-gray-400'
                      } hover:text-hawks-red transition-colors`}
                    >
                      <FaHeart className="w-4 h-4" />
                      <span className="text-sm">{photo.likes || 0}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <FaComment className="w-4 h-4" />
                      <span className="text-sm">{photo.comments?.length || 0}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setLightboxPhoto(photo)}
                    className="text-hawks-navy hover:text-hawks-red transition-colors"
                  >
                    <FaShare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          onClose={() => setLightboxPhoto(null)}
          onLike={() => handleLike(lightboxPhoto.id)}
          onComment={(comment) => handleComment(lightboxPhoto.id, comment)}
          totalPhotos={sortedPhotos.length}
          currentIndex={sortedPhotos.findIndex(p => p.id === lightboxPhoto.id)}
          onNavigate={(direction) => {
            const currentIndex = sortedPhotos.findIndex(p => p.id === lightboxPhoto.id);
            const newIndex = direction === 'next' 
              ? (currentIndex + 1) % sortedPhotos.length
              : (currentIndex - 1 + sortedPhotos.length) % sortedPhotos.length;
            setLightboxPhoto(sortedPhotos[newIndex]);
          }}
        />
      )}
    </div>
  );
};

// Lightbox Component
const Lightbox = ({ photo, onClose, onLike, onComment, totalPhotos, currentIndex, onNavigate }) => {
  const [comment, setComment] = useState('');
  const { userId } = useFirebase();

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment.trim());
      setComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full w-full h-full flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={() => onNavigate('prev')}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
        >
          <FaTimes className="w-6 h-6 rotate-45" />
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
        >
          <FaTimes className="w-6 h-6 -rotate-45" />
        </button>

        {/* Photo */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={photo.url}
            alt={photo.caption || 'Hawks Baseball photo'}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Photo Info */}
        <div className="bg-white rounded-t-lg p-6 mt-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {photo.caption && (
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {photo.caption}
                </h3>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{photo.userEmail}</span>
                <span>{formatDate(photo.timestamp)}</span>
                <span>{currentIndex + 1} of {totalPhotos}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onLike}
                className={`flex items-center space-x-2 ${
                  photo.likedBy?.includes(userId) ? 'text-hawks-red' : 'text-gray-400'
                } hover:text-hawks-red transition-colors`}
              >
                <FaHeart className="w-5 h-5" />
                <span>{photo.likes || 0}</span>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaDownload className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {photo.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-hawks-red text-white text-sm px-3 py-1 rounded-full flex items-center space-x-1"
                >
                  <FaTag className="w-3 h-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Comments</h4>
            {photo.comments && photo.comments.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {photo.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{comment.userId}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No comments yet</p>
            )}

            {/* Add Comment */}
            <form onSubmit={handleCommentSubmit} className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="px-4 py-2 bg-hawks-red text-white rounded-lg hover:bg-hawks-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery; 