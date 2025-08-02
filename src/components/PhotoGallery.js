import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaDownload, FaHeart, FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaSpinner, FaCheck } from 'react-icons/fa';
import { useFirebase } from '../hooks/useFirebase';

const PhotoGallery = () => {
  const { storage, userId } = useFirebase();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'
  const [downloadingPhotos, setDownloadingPhotos] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const lightboxRef = useRef(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const storageRef = storage.ref();
        const result = await storageRef.listAll();
        const photoPromises = result.items.map(async (item) => {
          const url = await item.getDownloadURL();
          const metadata = await item.getMetadata();
          return {
            id: item.name,
            url,
            name: item.name,
            size: metadata.size,
            uploadedAt: metadata.timeCreated,
            contentType: metadata.contentType
          };
        });
        
        const photoList = await Promise.all(photoPromises);
        setPhotos(photoList.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storage) {
      fetchPhotos();
    }
  }, [storage]);

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedPhoto(null);
  };

  const navigateLightbox = useCallback((direction) => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
    setSelectedPhoto(photos[currentIndex]);
  }, [photos, currentIndex]);

  // Touch gesture handlers for mobile
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
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
  }, [lightboxOpen]);

  const downloadPhoto = async (photo) => {
    if (!userId) {
      alert('Please sign in to download photos.');
      return;
    }

    setDownloadingPhotos(prev => new Set(prev).add(photo.id));
    
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = photo.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success feedback
      setTimeout(() => {
        setDownloadingPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photo.id);
          return newSet;
        });
      }, 1000);
    } catch (error) {
      console.error('Error downloading photo:', error);
      alert('Failed to download photo. Please try again.');
      setDownloadingPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(photo.id);
        return newSet;
      });
    }
  };

  const togglePhotoSelection = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const downloadSelectedPhotos = async () => {
    const selectedPhotoList = photos.filter(photo => selectedPhotos.has(photo.id));
    
    for (const photo of selectedPhotoList) {
      await downloadPhoto(photo);
      // Add small delay to prevent browser blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const clearSelection = () => {
    setSelectedPhotos(new Set());
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Photo Gallery
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                {photos.length} photos • Capture the Hawks' Cooperstown memories
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-hawks-red text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'masonry' 
                      ? 'bg-hawks-red text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Masonry
                </button>
              </div>

              {/* Selection Controls */}
              {selectedPhotos.size > 0 && (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <span className="text-white text-sm">
                    {selectedPhotos.size} selected
                  </span>
                  <button
                    onClick={downloadSelectedPhotos}
                    className="bg-hawks-red text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-hawks-red-dark transition-colors flex items-center justify-center space-x-2 min-h-[48px]"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Download ({selectedPhotos.size})</span>
                  </button>
                  <button
                    onClick={clearSelection}
                    className="bg-gray-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors min-h-[48px]"
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
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/10 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Photos Yet</h3>
              <p className="text-white/70 text-sm mb-4">
                Be the first to share photos from the Hawks' Cooperstown journey!
              </p>
              <a
                href="/upload"
                className="inline-flex items-center justify-center space-x-2 bg-hawks-red text-white px-6 py-3 rounded-lg font-medium hover:bg-hawks-red-dark transition-colors min-h-[48px]"
              >
                <span>Upload Photos</span>
              </a>
            </div>
          </div>
        ) : (
          <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4'
          }`}>
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  viewMode === 'masonry' ? 'break-inside-avoid mb-4' : ''
                } ${
                  selectedPhotos.has(photo.id) ? 'ring-4 ring-hawks-red' : ''
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-square bg-gray-200">
                  <img
                    src={photo.url}
                    alt={`Hawks Baseball - ${photo.name}`}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openLightbox(photo, index)}
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 left-3">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.has(photo.id)}
                        onChange={() => togglePhotoSelection(photo.id)}
                        className="w-6 h-6 rounded border-2 border-white bg-white/20 checked:bg-hawks-red checked:border-hawks-red focus:ring-2 focus:ring-hawks-red focus:ring-offset-2"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPhoto(photo);
                        }}
                        disabled={downloadingPhotos.has(photo.id)}
                        className="w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-lg disabled:opacity-50 min-h-[48px]"
                        aria-label="Download photo"
                      >
                        {downloadingPhotos.has(photo.id) ? (
                          <FaSpinner className="w-4 h-4 animate-spin" />
                        ) : (
                          <FaDownload className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(photo, index);
                        }}
                        className="w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-lg min-h-[48px]"
                        aria-label="View full screen"
                      >
                        <FaExpand className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo Info */}
                <div className="p-3 bg-white">
                  <p className="text-sm text-gray-600 truncate" title={photo.name}>
                    {photo.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(photo.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
          ref={lightboxRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
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
              aria-label="Previous photo"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Next photo"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>

            {/* Photo */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={`Hawks Baseball - ${selectedPhoto.name}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Photo Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 rounded-b-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base sm:text-lg">
                      {selectedPhoto.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {(selectedPhoto.size / 1024 / 1024).toFixed(1)} MB • Photo {currentIndex + 1} of {photos.length}
                    </p>
                  </div>
                  <div className="flex space-x-2 sm:space-x-3">
                    <button
                      onClick={() => downloadPhoto(selectedPhoto)}
                      disabled={downloadingPhotos.has(selectedPhoto.id)}
                      className="bg-hawks-red hover:bg-hawks-red-dark text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 min-h-[48px] disabled:opacity-50"
                    >
                      {downloadingPhotos.has(selectedPhoto.id) ? (
                        <FaSpinner className="w-4 h-4 animate-spin" />
                      ) : (
                        <FaDownload className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery; 