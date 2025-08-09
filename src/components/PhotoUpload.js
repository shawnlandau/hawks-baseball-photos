import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTimes, FaCheck, FaExclamationTriangle, FaTag, FaSpinner } from 'react-icons/fa';
import { useFirebase } from '../hooks/useFirebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PhotoUpload = ({ onUploadSuccess }) => {
  const { db, storage, userId, auth } = useFirebase();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [formData, setFormData] = useState({
    caption: '',
    tags: [],
    album: ''
  });
  const fileInputRef = useRef(null);

  // Hawks team roster for tagging
  const hawksPlayers = [
    // Players
    'Asher Joslin-White', 'Ashton McCarthy', 'Brian Aguilar', 'Cole Thomas',
    'Dylan Johnson', 'Ethan Heiss', 'Hudson Brunton', 'Jared Landau',
    'Matthew Covington', 'Maxwell Millay', 'Reed Kleamovich',
    'Thad Clark',
    // Coaches
    'Mike Woodruff', 'Brian McCarthy'
  ];

  const albums = [
    'Day 1 - Opening Ceremonies',
    'Day 2 - Pool Play',
    'Day 3 - Pool Play',
    'Day 4 - Tournament Games',
    'Day 5 - Championship',
    'Team Photos',
    'Action Shots',
    'Celebration Moments',
    'Dreams Park Tour'
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        alert(`${file.name} is not an image file.`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });

    setSelectedFiles(validFiles);
    setUploadError('');
    setUploadSuccess(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onDrop(files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadFile = async (file, index) => {
    if (!db || !storage || !userId) {
      throw new Error('Firebase not initialized');
    }
    
    try {
      // Resize image if needed
      const resizedBlob = await resizeImage(file);
      const resizedFile = new File([resizedBlob], file.name, { type: 'image/jpeg' });
      
      // Create storage reference
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, `photos/${fileName}`);
      
      // Upload to Firebase Storage
      const uploadResult = await uploadBytes(storageRef, resizedFile);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      // Save to Firestore
      const photoData = {
        url: downloadURL,
        storagePath: `photos/${fileName}`, // Store the storage path for deletion
        caption: formData.caption,
        tags: formData.tags,
        album: formData.album,
        fileName: fileName,
        originalName: file.name,
        fileSize: resizedFile.size,
        uploadedBy: userId,
        userEmail: auth?.currentUser?.email || 'Unknown',
        timestamp: new Date(),
        likes: 0,
        likedBy: [],
        comments: []
      };
      
      const photosRef = collection(db, 'photos');
      await addDoc(photosRef, photoData);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one photo to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        setCurrentFileIndex(i);
        await uploadFile(selectedFiles[i], i);
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      setUploadSuccess(true);
      setSelectedFiles([]);
      setFormData({ caption: '', tags: [], album: '' });
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
        setUploadProgress(0);
        setCurrentFileIndex(0);
      }, 3000);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-hawks-navy mb-2">
          Share Your Memories
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Upload photos from our Cooperstown Dreams Park journey. Tag players, add captions, and organize by albums.
        </p>
      </div>

      {/* File Selection */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-hawks-navy mb-4">
          Select Photos
        </h3>
        
        {/* Drag & Drop Area with single CTA (consistent with VideoUpload) */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 ${
            isDragActive
              ? 'border-hawks-red bg-red-50'
              : 'border-gray-300 hover:border-hawks-red hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <FaCloudUploadAlt className="text-3xl sm:text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            {isDragActive ? 'Drop your photos here' : 'Drag & drop photos here'}
          </p>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            or tap to select files
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            Supports: JPG, PNG, GIF, WebP (Max 10MB each)
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect();
            }}
            className="bg-hawks-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-hawks-red-dark transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto min-h-[48px] w-full sm:w-auto"
          >
            <FaCloudUploadAlt className="w-4 h-4" />
            <span>Browse Files</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          multiple
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-hawks-navy mb-4">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity min-h-[32px] min-w-[32px] flex items-center justify-center"
                  aria-label="Remove file"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
                <div className="mt-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Fields */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200 space-y-4 sm:space-y-6">
          {/* Caption */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Describe this moment..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent resize-none min-h-[80px]"
              rows="3"
            />
          </div>

          {/* Album Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Album
            </label>
            <select
              value={formData.album}
              onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent min-h-[48px]"
            >
              <option value="">Select an album...</option>
              {albums.map(album => (
                <option key={album} value={album}>{album}</option>
              ))}
            </select>
          </div>

          {/* Player Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tag Players
            </label>
            <div className="flex flex-wrap gap-2">
              {hawksPlayers.map(player => (
                <button
                  key={player}
                  onClick={() => toggleTag(player)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] ${
                    formData.tags.includes(player)
                      ? 'bg-hawks-red text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaTag className="inline w-3 h-3 mr-1" />
                  {player}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Uploading {currentFileIndex + 1} of {selectedFiles.length}...
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-hawks-red h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{uploadError}</p>
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <FaCheck className="text-green-500 flex-shrink-0" />
              <p className="text-green-600 text-sm">Photos uploaded successfully!</p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-hawks-red text-white py-4 px-4 rounded-lg font-semibold hover:bg-hawks-red-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[48px]"
          >
            {uploading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="w-4 h-4" />
                <span>Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload; 