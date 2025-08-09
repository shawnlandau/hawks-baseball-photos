import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaDownload, FaHeart, FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaSpinner, FaFilter, FaPlus, FaCamera, FaVideo, FaTrash, FaTag } from 'react-icons/fa';
import { ref, deleteObject } from 'firebase/storage';
import { doc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '../hooks/useFirebase';
import { teamRoster } from '../data/teamRoster';
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';

const PhotoGallery = () => {
  const { storage, db, userId, auth } = useFirebase();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'
  const [downloadingPhotos, setDownloadingPhotos] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerFilter, setShowPlayerFilter] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mediaType, setMediaType] = useState('all'); // 'all', 'photos', 'videos'
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [deletingPhotos, setDeletingPhotos] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const lightboxRef = useRef(null);
  const imageRef = useRef(null);
  const playerFilterRef = useRef(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        // Fetch photos from Firestore to get metadata including tags
        const photosQuery = query(collection(db, 'photos'), orderBy('timestamp', 'desc'));
        const photosSnapshot = await getDocs(photosQuery);
        const photoList = photosSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            url: data.url,
            name: data.originalName || data.fileName || 'Unknown',
            size: data.fileSize || 0,
            uploadedAt: data.timestamp?.toDate?.() || new Date(),
            contentType: 'image/jpeg',
            type: 'photo',
            tags: data.tags || [],
            caption: data.caption || '',
            album: data.album || '',
            uploadedBy: data.uploadedBy || '',
            userEmail: data.userEmail || '',
            storagePath: data.storagePath || `photos/${data.fileName}`
          };
        });
        
        // Fetch videos from Firestore (if videos collection exists)
        let videoList = [];
        try {
          const videosQuery = query(collection(db, 'videos'), orderBy('timestamp', 'desc'));
          const videosSnapshot = await getDocs(videosQuery);
          videoList = videosSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              url: data.url,
              name: data.originalName || data.fileName || 'Unknown',
              size: data.fileSize || 0,
              uploadedAt: data.timestamp?.toDate?.() || new Date(),
              contentType: 'video/mp4',
              type: 'video',
              tags: data.tags || [],
              caption: data.caption || '',
              album: data.album || '',
              uploadedBy: data.uploadedBy || '',
              userEmail: data.userEmail || '',
              storagePath: data.storagePath || `videos/${data.fileName}`
            };
          });
        } catch (videoError) {
          console.log('No videos collection found or error fetching videos:', videoError);
        }
        
        console.log('Fetched photos:', photoList);
        console.log('Fetched videos:', videoList);
        setPhotos(photoList);
        setVideos(videoList);
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };

    if (db && storage) {
      fetchMedia();
    }
  }, [db, storage]);

  const getAllMedia = useCallback(() => {
    const allMedia = [...photos, ...videos];
    return allMedia.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }, [photos, videos]);

  const getFilteredMedia = useCallback(() => {
    let media = getAllMedia();
    
    if (mediaType === 'photos') {
      media = photos;
    } else if (mediaType === 'videos') {
      media = videos;
    }
    
    if (selectedPlayer) {
      const normalize = (val) => (val || '').toString().trim().toLowerCase();
      const selectedName = normalize(selectedPlayer.name);

      const matchesPlayer = (item) => {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const normalizedTags = tags.map(normalize);
        return normalizedTags.some((tag) => tag === selectedName || tag.includes(selectedName) || selectedName.includes(tag));
      };

      media = media.filter(matchesPlayer);
    }
    
    return media;
  }, [photos, videos, mediaType, selectedPlayer, getAllMedia]);

  const openLightbox = (media, index) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
    setLightboxOpen(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setSelectedMedia(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const navigateLightbox = useCallback((direction) => {
    const filteredMedia = getFilteredMedia();
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % filteredMedia.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + filteredMedia.length) % filteredMedia.length);
    }
    setSelectedMedia(filteredMedia[currentIndex]);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, getFilteredMedia]);

  // Enhanced touch gesture handlers for mobile with pinch-to-zoom
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      // Single touch for swipe navigation
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    } else if (e.touches.length === 2) {
      // Two finger touch for pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setTouchStart(distance);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 1) {
      setTouchEnd(e.targetTouches[0].clientX);
    } else if (e.touches.length === 2) {
      // Handle pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (touchStart) {
        const scaleChange = distance / touchStart;
        const newScale = Math.max(0.5, Math.min(3, scale * scaleChange));
        setScale(newScale);
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      navigateLightbox('next');
    } else if (isRightSwipe) {
      navigateLightbox('prev');
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleKeyPress = useCallback((e) => {
    if (!lightboxOpen) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        navigateLightbox('next');
        break;
      case 'ArrowLeft':
        navigateLightbox('prev');
        break;
      default:
        break;
    }
  }, [lightboxOpen, navigateLightbox, closeLightbox]);

  const downloadMedia = async (media) => {
    if (!userId) {
      alert('Please sign in to download media.');
      return;
    }

    setDownloadingPhotos(prev => new Set(prev).add(media.id));
    
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = media.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success feedback
      setTimeout(() => {
        setDownloadingPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(media.id);
          return newSet;
        });
      }, 1000);
    } catch (error) {
      console.error('Error downloading media:', error);
      alert('Failed to download media. Please try again.');
      setDownloadingPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(media.id);
        return newSet;
      });
    }
  };

  const togglePhotoSelection = (mediaId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(mediaId)) {
      newSelected.delete(mediaId);
    } else {
      newSelected.add(mediaId);
    }
    setSelectedPhotos(newSelected);
  };

  const downloadSelectedPhotos = async () => {
    const selectedMediaList = getFilteredMedia().filter(media => selectedPhotos.has(media.id));
    
    for (const media of selectedMediaList) {
      await downloadMedia(media);
      // Add small delay to prevent browser blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const clearSelection = () => {
    setSelectedPhotos(new Set());
  };

  // Player filtering functionality
  const handlePlayerFilter = (player) => {
    setSelectedPlayer(player);
    setShowPlayerFilter(false);
  };

  const clearPlayerFilter = () => {
    setSelectedPlayer(null);
  };

  const downloadAllPlayerMedia = async () => {
    if (!userId) {
      alert('Please sign in to download media.');
      return;
    }

    if (!selectedPlayer) {
      alert('Please select a player first.');
      return;
    }

    const playerMedia = getFilteredMedia().filter(media => 
      media.tags && media.tags.includes(selectedPlayer.name)
    );

    if (playerMedia.length === 0) {
      alert(`No media found for ${selectedPlayer.name}.`);
      return;
    }

    setDownloadingPhotos(prev => new Set([...prev, 'bulk']));
    
    try {
      for (const media of playerMedia) {
        await downloadMedia(media);
        // Add small delay to prevent browser blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error downloading player media:', error);
      alert('Failed to download some media. Please try again.');
    } finally {
      setDownloadingPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete('bulk');
        return newSet;
      });
    }
  };

  // Delete media function
  const deleteMedia = async (media) => {
    if (!userId) {
      alert('Please sign in to delete media.');
      return;
    }

    // Check if user is admin or the owner of the media
    const isAdmin = auth?.currentUser?.email === 'shawnjl@outlook.com';
    const isOwner = media.uploadedBy === userId;
    
    if (!isAdmin && !isOwner) {
      alert('You can only delete your own media.');
      return;
    }

    setDeletingPhotos(prev => new Set([...prev, media.id]));
    
    try {
      // Delete from Firebase Storage using the storagePath (best-effort)
      let storageDeleteError = null;
      if (media.storagePath) {
        try {
          const storageRef = ref(storage, media.storagePath);
          await deleteObject(storageRef);
        } catch (err) {
          storageDeleteError = err;
          console.warn('Storage delete failed, proceeding to delete Firestore doc:', err);
        }
      } else {
        console.warn('No storagePath on media; skipping storage delete and proceeding to Firestore doc delete.');
      }

      // Always attempt to delete Firestore doc, even if storage delete failed
      if (db) {
        const collectionName = media.type === 'photo' ? 'photos' : 'videos';
        const docRef = doc(db, collectionName, media.id);
        try {
          await deleteDoc(docRef);
        } catch (firestoreErr) {
          // If Firestore delete fails, surface this to user, as this is the source of truth for the UI
          throw firestoreErr;
        }
      }
      
      // Remove from local state
      if (media.type === 'photo') {
        setPhotos(prev => prev.filter(p => p.id !== media.id));
      } else {
        setVideos(prev => prev.filter(v => v.id !== media.id));
      }
      
      // Close lightbox if the deleted media was being viewed
      if (lightboxOpen && selectedMedia && selectedMedia.id === media.id) {
        closeLightbox();
      }
      
      if (storageDeleteError) {
        alert('Media removed from gallery. The file could not be removed from storage automatically and may require manual cleanup.');
      } else {
        alert('Media deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete media. Please try again.');
    } finally {
      setDeletingPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(media.id);
        return newSet;
      });
    }
  };

  // Confirm delete dialog
  const confirmDelete = (media) => {
    setMediaToDelete(media);
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (mediaToDelete) {
      await deleteMedia(mediaToDelete);
      setShowDeleteConfirm(false);
      setMediaToDelete(null);
    }
  };

  // Cancel delete confirmation
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setMediaToDelete(null);
  };

  // Filter media based on selected player and media type
  const filteredMedia = getFilteredMedia();

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Handle click outside to close player filter
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (playerFilterRef.current && !playerFilterRef.current.contains(event.target)) {
        setShowPlayerFilter(false);
      }
    };

    if (showPlayerFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPlayerFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red">
      {/* Header */}
      <div className="bg-white/15 backdrop-blur-md border-b border-white/20 shadow-xl relative">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                Media Gallery
              </h1>
              <p className="text-white/90 text-lg sm:text-xl">
                {selectedPlayer 
                  ? `${selectedPlayer.name}'s Media (${filteredMedia.length})` 
                  : `${getAllMedia().length} items • Capture the Hawks' Cooperstown memories`
                }
              </p>
              
              {/* Debug Info - Remove this after testing */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-black/20 rounded-lg text-xs text-white/80">
                  <div>Photos: {photos.length} | Videos: {videos.length}</div>
                  <div>Photos with tags: {photos.filter(p => p.tags && p.tags.length > 0).length}</div>
                  <div>Videos with tags: {videos.filter(v => v.tags && v.tags.length > 0).length}</div>
                  {selectedPlayer && (
                    <div>Filtering by: {selectedPlayer.name}</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Media Type Filter */}
              <div className="flex bg-white/15 rounded-xl p-1 shadow-lg">
                <button
                  onClick={() => setMediaType('all')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mediaType === 'all' 
                      ? 'bg-gradient-to-r from-hawks-red to-red-600 text-white shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMediaType('photos')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mediaType === 'photos' 
                      ? 'bg-gradient-to-r from-hawks-red to-red-600 text-white shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setMediaType('videos')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mediaType === 'videos' 
                      ? 'bg-gradient-to-r from-hawks-red to-red-600 text-white shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Videos
                </button>
              </div>

              {/* Player Filter */}
              <div className="relative" ref={playerFilterRef}>
                <button
                  onClick={() => {
                    if (!showPlayerFilter && playerFilterRef.current) {
                      const rect = playerFilterRef.current.getBoundingClientRect();
                      setDropdownPosition({
                        top: rect.bottom + window.scrollY + 12,
                        left: rect.right - 250 // 250px is min-width of dropdown
                      });
                    }
                    setShowPlayerFilter(!showPlayerFilter);
                  }}
                  className="flex items-center space-x-3 bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 min-h-[52px] shadow-lg"
                >
                  <FaFilter className="w-5 h-5" />
                  <span className="hidden sm:inline font-semibold">Filter by Player</span>
                </button>
                
                {showPlayerFilter && createPortal(
                  <div 
                    className="fixed z-[9999] bg-white rounded-2xl shadow-2xl min-w-[250px] max-h-[400px] overflow-y-auto border border-gray-100"
                    style={{
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      maxHeight: '400px'
                    }}
                  >
                    <div className="p-3">
                      <button
                        onClick={clearPlayerFilter}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 text-sm font-semibold transition-colors"
                      >
                        All Media
                      </button>
                      {teamRoster.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => handlePlayerFilter(player)}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 text-sm transition-colors"
                        >
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-xs text-gray-500">{player.position}</div>
                        </button>
                      ))}
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Download All for Player */}
              {selectedPlayer && userId && (
                <button
                  onClick={downloadAllPlayerMedia}
                  disabled={downloadingPhotos.has('bulk')}
                  className="flex items-center space-x-3 bg-gradient-to-r from-hawks-red to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 min-h-[52px] shadow-lg"
                >
                  {downloadingPhotos.has('bulk') ? (
                    <FaSpinner className="w-5 h-5 animate-spin" />
                  ) : (
                    <FaDownload className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline font-semibold">Download All</span>
                </button>
              )}

              {/* View Mode Toggle */}
              <div className="flex bg-white/15 rounded-xl p-1 shadow-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-hawks-red to-red-600 text-white shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    viewMode === 'masonry' 
                      ? 'bg-gradient-to-r from-hawks-red to-red-600 text-white shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Masonry
                </button>
              </div>

              {/* Selection Controls */}
              {selectedPhotos.size > 0 && (
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <span className="text-white text-base font-semibold">
                    {selectedPhotos.size} selected
                  </span>
                  <button
                    onClick={downloadSelectedPhotos}
                    className="bg-gradient-to-r from-hawks-red to-red-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center space-x-3 min-h-[52px] shadow-lg"
                  >
                    <FaDownload className="w-5 h-5" />
                    <span>Download ({selectedPhotos.size})</span>
                  </button>
                  <button
                    onClick={clearSelection}
                    className="bg-gray-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all duration-200 min-h-[52px] shadow-lg"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {filteredMedia.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 sm:p-12 max-w-lg mx-auto border border-white/20 shadow-2xl">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeart className="w-10 h-10 text-white/60" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {selectedPlayer ? `No Media for ${selectedPlayer.name}` : 'No Media Yet'}
              </h3>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                {selectedPlayer 
                  ? `No photos or videos tagged with ${selectedPlayer.name} yet. Upload some media and tag them!`
                  : 'Be the first to share photos and videos from the Hawks\' Cooperstown journey!'
                }
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-hawks-red to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[56px]"
              >
                <FaCamera className="w-6 h-6" />
                <span>Upload Media</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' 
              : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4'
          }`}>
            {filteredMedia.map((media, index) => (
              <div
                key={media.id}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''
                } ${
                  selectedPhotos.has(media.id) ? 'ring-4 ring-hawks-red' : ''
                }`}
              >
                {/* Media */}
                <div className="relative aspect-square bg-gray-200">
                  {media.type === 'video' ? (
                    <VideoPlayer
                      src={media.url}
                      className="w-full h-full"
                      title={media.name}
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt={`Hawks Baseball - ${media.name}`}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => openLightbox(media, index)}
                      loading="lazy"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                    {/* Media Type Badge */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {media.type === 'video' ? (
                        <div className="bg-gradient-to-r from-hawks-red to-red-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center space-x-2">
                          <FaVideo className="w-3 h-3" />
                          <span>VIDEO</span>
                        </div>
                      ) : (
                        <div className="bg-white/95 text-hawks-navy text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center space-x-2">
                          <FaCamera className="w-3 h-3" />
                          <span>PHOTO</span>
                        </div>
                      )}
                      
                      {/* Tags Indicator */}
                      {media.tags && media.tags.length > 0 && (
                        <div className="bg-hawks-navy/90 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center space-x-2">
                          <FaTag className="w-3 h-3" />
                          <span>{media.tags.length} TAG{media.tags.length !== 1 ? 'S' : ''}</span>
                        </div>
                      )}
                    </div>

                    {/* Selection Checkbox */}
                    <div className="absolute top-4 right-4">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.has(media.id)}
                        onChange={() => togglePhotoSelection(media.id)}
                        className="w-7 h-7 rounded border-2 border-white bg-white/20 checked:bg-hawks-red checked:border-hawks-red focus:ring-4 focus:ring-hawks-red focus:ring-offset-2 transition-all duration-200"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadMedia(media);
                        }}
                        disabled={downloadingPhotos.has(media.id)}
                        className="w-14 h-14 bg-white/95 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg disabled:opacity-50 min-h-[56px] min-w-[56px]"
                        aria-label="Download media"
                      >
                        {downloadingPhotos.has(media.id) ? (
                          <FaSpinner className="w-5 h-5 animate-spin" />
                        ) : (
                          <FaDownload className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(media, index);
                        }}
                        className="w-14 h-14 bg-white/95 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg min-h-[56px] min-w-[56px]"
                        aria-label="View full screen"
                      >
                        <FaExpand className="w-5 h-5" />
                      </button>
                      
                      {/* Delete Button - Only show for owners or admin */}
                      {(auth?.currentUser?.email === 'shawnjl@outlook.com' || media.uploadedBy === userId) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(media);
                          }}
                          disabled={deletingPhotos.has(media.id)}
                          className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg disabled:opacity-50 min-h-[56px] min-w-[56px]"
                          aria-label="Delete media"
                        >
                          {deletingPhotos.has(media.id) ? (
                            <FaSpinner className="w-5 h-5 animate-spin" />
                          ) : (
                            <FaTrash className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Media Info */}
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-700 truncate font-medium" title={media.name}>
                    {(() => {
                      // Prefer caption, else a cleaned-up name without uid/timestamp prefixes
                      const label = (media.caption || '').trim();
                      if (label) return label;
                      const raw = (media.name || '').toString();
                      const cleaned = raw.replace(/^[^_]+_\d{10,14}_\d+_/,'');
                      return cleaned || 'Untitled';
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(media.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Upload */}
      <Link
        to="/upload"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-hawks-red to-red-600 text-white w-20 h-20 rounded-full shadow-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-40 min-h-[80px] min-w-[80px]"
        aria-label="Upload media"
      >
        <FaPlus className="w-8 h-8" />
      </Link>

      {/* Enhanced Lightbox with Video Support */}
      {lightboxOpen && selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
          ref={lightboxRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Close lightbox"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Previous media"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Next media"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>

            {/* Media */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {selectedMedia.type === 'video' ? (
                <VideoPlayer
                  src={selectedMedia.url}
                  className="max-w-full max-h-full"
                  title={selectedMedia.name}
                />
              ) : (
                <img
                  ref={imageRef}
                  src={selectedMedia.url}
                  alt={`Hawks Baseball - ${selectedMedia.name}`}
                  className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-200"
                  style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    cursor: scale > 1 ? 'grab' : 'default'
                  }}
                  draggable={scale > 1}
                />
              )}
              
              {/* Media Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 rounded-b-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base sm:text-lg">
                      {selectedMedia.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {(selectedMedia.size / 1024 / 1024).toFixed(1)} MB • {selectedMedia.type === 'video' ? 'Video' : 'Photo'} {currentIndex + 1} of {filteredMedia.length}
                    </p>
                  </div>
                  <div className="flex space-x-2 sm:space-x-3">
                    <button
                      onClick={() => downloadMedia(selectedMedia)}
                      disabled={downloadingPhotos.has(selectedMedia.id)}
                      className="bg-hawks-red hover:bg-hawks-red-dark text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 min-h-[48px] disabled:opacity-50"
                    >
                      {downloadingPhotos.has(selectedMedia.id) ? (
                        <FaSpinner className="w-4 h-4 animate-spin" />
                      ) : (
                        <FaDownload className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    
                    {/* Delete Button - Only show for owners or admin */}
                    {(auth?.currentUser?.email === 'shawnjl@outlook.com' || selectedMedia.uploadedBy === userId) && (
                      <button
                        onClick={() => confirmDelete(selectedMedia)}
                        disabled={deletingPhotos.has(selectedMedia.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 min-h-[48px] disabled:opacity-50"
                      >
                        {deletingPhotos.has(selectedMedia.id) ? (
                          <FaSpinner className="w-4 h-4 animate-spin" />
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && mediaToDelete && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete {mediaToDelete.type === 'video' ? 'Video' : 'Photo'}?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{mediaToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingPhotos.has(mediaToDelete.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deletingPhotos.has(mediaToDelete.id) ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery; 