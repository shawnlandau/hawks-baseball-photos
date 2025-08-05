import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaVideo, FaTimes, FaCheck, FaExclamationTriangle, FaTag, FaSpinner, FaPlay, FaUpload } from 'react-icons/fa';
import { useFirebase } from '../hooks/useFirebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const VideoUpload = ({ onUploadSuccess }) => {
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
    'Asher Joslin-White', 'Ashton McCarthy', 'Brian Aguliar', 'Cole Thomas',
    'Dylan Johnson', 'Ethan Heiss', 'Hudson Brunton', 'Jared Landau',
    'Matthew Covington', 'Maxwell Millay', 'Michael Woodruff', 'Reed Kleamovich',
    'Thad Clark',
    // Coach
    'Mike Woodruff'
  ];

  const albums = [
    'Day 1 - Opening Ceremonies',
    'Day 2 - Pool Play',
    'Day 3 - Pool Play',
    'Day 4 - Tournament Games',
    'Day 5 - Championship',
    'Team Videos',
    'Action Shots',
    'Celebration Moments',
    'Dreams Park Tour'
  ];

  const validateVideo = (file) => {
    // Check file type
    const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: `${file.name} is not a supported video format. Please use MP4, MOV, or AVI.` };
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return { valid: false, error: `${file.name} is too large. Maximum size is 50MB.` };
    }

    return { valid: true };
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        if (duration > 60) {
          resolve({ valid: false, error: `${file.name} is too long. Maximum duration is 60 seconds.` });
        } else {
          resolve({ valid: true, duration });
        }
      };
      
      video.onerror = () => {
        resolve({ valid: false, error: `Could not read video duration for ${file.name}.` });
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log('VideoUpload: Files dropped:', acceptedFiles.length);
    setUploadError('');
    setUploadSuccess(false);
    
    const validFiles = [];
    
    for (const file of acceptedFiles) {
      console.log('VideoUpload: Processing file:', file.name, file.type, file.size);
      
      // Basic validation
      const basicValidation = validateVideo(file);
      if (!basicValidation.valid) {
        console.log('VideoUpload: File validation failed:', basicValidation.error);
        alert(basicValidation.error);
        continue;
      }
      
      // Duration validation
      const durationValidation = await checkVideoDuration(file);
      if (!durationValidation.valid) {
        console.log('VideoUpload: Duration validation failed:', durationValidation.error);
        alert(durationValidation.error);
        continue;
      }
      
      console.log('VideoUpload: File validated successfully');
      validFiles.push(file);
    }

    console.log('VideoUpload: Valid files:', validFiles.length);
    setSelectedFiles(validFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
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

  const uploadFile = async (file, index) => {
    console.log('VideoUpload: Starting upload for file:', file.name, 'index:', index);
    
    if (!db || !storage || !userId) {
      console.error('VideoUpload: Firebase not initialized');
      throw new Error('Firebase not initialized');
    }
    
    try {
      // Create storage reference
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, `videos/${fileName}`);
      
      console.log('VideoUpload: Uploading to storage path:', `videos/${fileName}`);
      
      // Upload to Firebase Storage
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('VideoUpload: File uploaded to storage successfully');
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('VideoUpload: Got download URL:', downloadURL);
      
      // Save to Firestore
      const videoData = {
        url: downloadURL,
        storagePath: `videos/${fileName}`,
        caption: formData.caption,
        tags: formData.tags,
        album: formData.album,
        fileName: fileName,
        originalName: file.name,
        fileSize: file.size,
        uploadedBy: userId,
        userEmail: auth?.currentUser?.email || 'Unknown',
        timestamp: new Date(),
        type: 'video',
        likes: 0,
        likedBy: [],
        comments: []
      };
      
      console.log('VideoUpload: Saving to Firestore:', videoData);
      const videosRef = collection(db, 'videos');
      await addDoc(videosRef, videoData);
      console.log('VideoUpload: Video data saved to Firestore successfully');
      
      return downloadURL;
    } catch (error) {
      console.error('VideoUpload: Error uploading video:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one video to upload.');
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
          Share Team Videos
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Upload videos from our Cooperstown Dreams Park journey. Tag players, add captions, and organize by albums.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 ${
            isDragActive
              ? 'border-hawks-red bg-red-50'
              : 'border-gray-300 hover:border-hawks-red hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <FaVideo className="text-3xl sm:text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            {isDragActive ? 'Drop your videos here' : 'Drag & drop videos here'}
          </p>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            or tap to select files
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            Supports: MP4, MOV, AVI (Max 50MB, 60 seconds each)
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect();
            }}
            className="bg-hawks-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-hawks-red-dark transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto min-h-[48px] w-full sm:w-auto"
          >
            <FaUpload className="w-4 h-4" />
            <span>Browse Videos</span>
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInputChange}
        className="hidden"
        multiple
      />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-hawks-navy mb-4">
            Selected Videos ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <FaPlay className="text-white text-2xl" />
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity min-h-[32px] min-w-[32px] flex items-center justify-center"
                  aria-label="Remove video"
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
              <p className="text-green-600 text-sm">Videos uploaded successfully!</p>
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
                <FaVideo className="w-4 h-4" />
                <span>Upload {selectedFiles.length} Video{selectedFiles.length !== 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload; 