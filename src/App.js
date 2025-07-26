import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, addDoc, onSnapshot, collection, serverTimestamp, deleteDoc, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/* global __firebase_config, __app_id */

// --- Firebase Context ---
const FirebaseContext = createContext(null);

const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [storage, setStorage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [firebaseInitError, setFirebaseInitError] = useState(''); // New state for Firebase initialization errors

  useEffect(() => {
    // Debug log for env variable
    console.log('DEBUG: process.env.REACT_APP_FIREBASE_CONFIG =', process.env.REACT_APP_FIREBASE_CONFIG);
    try {
      // Initialize Firebase App
      let configString = '{}';
      if (typeof __firebase_config !== 'undefined' && __firebase_config !== '') {
        configString = __firebase_config;
      } else if (
        typeof process !== 'undefined' &&
        typeof process.env !== 'undefined' &&
        typeof process.env.REACT_APP_FIREBASE_CONFIG !== 'undefined' &&
        process.env.REACT_APP_FIREBASE_CONFIG !== ''
      ) {
        configString = process.env.REACT_APP_FIREBASE_CONFIG;
      }
      
      console.log('DEBUG: Raw configString =', configString);
      
      let firebaseConfig;
      try {
        // First, try to parse as JSON
        firebaseConfig = typeof configString === 'string' ? JSON.parse(configString) : configString;
        
        // If the result is still a string, it might be double-encoded
        if (typeof firebaseConfig === 'string') {
          try {
            firebaseConfig = JSON.parse(firebaseConfig);
          } catch (doubleParseError) {
            console.error('DEBUG: Double parse failed:', doubleParseError);
            // If double parse fails, try to extract the config manually
            const match = configString.match(/\{.*\}/);
            if (match) {
              firebaseConfig = JSON.parse(match[0]);
            } else {
              throw new Error('Could not parse Firebase config');
            }
          }
        }
      } catch (e) {
        console.error('DEBUG: Config parsing error:', e);
        firebaseConfig = {};
      }
      
      console.log('DEBUG: Final firebaseConfig =', firebaseConfig, 'type:', typeof firebaseConfig);
      console.log('DEBUG: firebaseConfig keys =', Object.keys(firebaseConfig));
      console.log('DEBUG: firebaseConfig.projectId =', firebaseConfig.projectId);
      
      // Validate that we have a proper config
      if (!firebaseConfig || !firebaseConfig.projectId) {
        // Try to use a fallback config if available
        const fallbackConfig = {
          apiKey: "AIzaSyCouuChPSVEKmaxkw3f4r4-Xx-4vADiBWc",
          authDomain: "hawksbaseballphotos-5bb61.firebaseapp.com",
          projectId: "hawksbaseballphotos-5bb61",
          storageBucket: "hawksbaseballphotos-5bb61.appspot.com",
          messagingSenderId: "1090003594150",
          appId: "1:1090003594150:web:92ff02eb4fe204a67f7d67",
          measurementId: "G-RS15QL2HJ0"
        };
        console.log('DEBUG: Using fallback Firebase config');
        firebaseConfig = fallbackConfig;
      }
      
      try {
        // Debug log for projectId
        const initializedApp = initializeApp(firebaseConfig);
        setApp(initializedApp);

        // Initialize Firebase Services
        const firestoreDb = getFirestore(initializedApp);
        setDb(firestoreDb);
        const firebaseAuth = getAuth(initializedApp);
        setAuth(firebaseAuth);
        const firebaseStorage = getStorage(initializedApp);
        setStorage(firebaseStorage);

        // Set up auth state listener (no automatic anonymous sign-in)
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
          if (user) {
            setUserId(user.uid);
            console.log('DEBUG: User signed in:', user.uid);
          } else {
            setUserId(null);
            console.log('DEBUG: User signed out');
          }
          setIsAuthReady(true); // Auth state has been checked
        }, (error) => {
          console.error('AUTH STATE LISTENER ERROR:', error);
          setFirebaseInitError(`Auth state error: ${error.message}`);
          setIsAuthReady(true); // Mark as ready even on error
        });

        return () => unsubscribe();
      } catch (initError) {
        console.error('FIREBASE INITIALIZATION ERROR:', initError);
        setFirebaseInitError(`Firebase initialization failed: ${initError.message}`);
        setIsAuthReady(true);
        return;
      }
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      setFirebaseInitError(`Failed to initialize Firebase: ${error.message}. Please check your Firebase configuration.`);
      setIsAuthReady(true); // Mark as ready even on error to stop loading spinner
    }
  }, []); // Run only once on component mount

  return (
    <FirebaseContext.Provider value={{ app, db, auth, storage, userId, isAuthReady, firebaseInitError }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// --- Custom Hooks ---
const useFirebase = () => useContext(FirebaseContext);

// --- Components ---

// Modal component for messages/alerts
const Modal = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center rounded-xl">
        <p className="text-lg mb-4 text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow-md rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Authentication Component
const Auth = () => {
  const { auth, userId, isAuthReady } = useFirebase();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Local message for Auth component

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage(error.message);
    }
  };

  const handleSignOut = async () => {
    setMessage('');
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      setMessage(error.message);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <Modal message={message} onClose={() => setMessage('')} />
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
            <div className="text-center text-xs font-bold text-blue-900 w-full px-1">
              <div className="text-xs font-bold leading-tight mb-1">HAWKS</div>
              <div className="text-red-600 font-bold leading-tight mb-1">BASEBALL</div>
              <div className="relative mb-1">
                <div className="flex justify-center">
                  <div className="w-full h-1 bg-red-600"></div>
                </div>
                <div className="flex justify-center relative">
                  <div className="w-full h-1 bg-white border border-gray-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs">H</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-full h-1 bg-red-600"></div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
            Hawks Baseball Photo Gallery
          </h2>
          <p className="text-gray-600 text-sm">Sign in to upload and manage photos</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </p>
        {userId && (
          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm mb-2">Logged in as: <span className="font-mono text-xs bg-gray-200 p-1 rounded">{userId}</span></p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Photo Upload Component
const PhotoUpload = ({ onUploadSuccess }) => {
  const { db, storage, userId, isAuthReady } = useFirebase();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // Hawks Baseball Team Roster
  const players = [
    "Asher Joslin-White",
    "Ashton McCarthy", 
    "Brian Aguliar",
    "Cole Thomas",
    "Dylan Johnson",
    "Ethan Heiss",
    "Hudson Brunton",
    "Jared Landau",
    "Matthew Covington",
    "Maxwell Millay",
    "Michael Woodruff",
    "Reed Kleamovich",
    "Thad Clark"
  ];

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      // Check if it's an image file
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setMessage('');
      } else {
        setMessage('Please drop an image file (JPG, PNG, GIF, etc.)');
      }
    }
  };

  const togglePlayer = (playerName) => {
    setSelectedPlayers(prev => 
      prev.includes(playerName) 
        ? prev.filter(p => p !== playerName)
        : [...prev, playerName]
    );
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    
    if (!isAuthReady) {
      setMessage("Please wait for authentication to initialize.");
      return;
    }

    if (!userId) {
      setMessage("Please sign in to upload photos.");
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // Create a unique file name using timestamp and original name
      const fileName = `${Date.now()}_${file.name}`;
      // Get appId from environment for storage path
      const appId = typeof process.env.REACT_APP_APP_ID !== 'undefined' ? process.env.REACT_APP_APP_ID : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      const storageRef = ref(storage, `artifacts/${appId}/public/data/photos/${fileName}`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save photo metadata to Firestore
      const photosCollectionRef = collection(db, `artifacts/${appId}/public/data/photos`);
      await addDoc(photosCollectionRef, {
        url: downloadURL,
        fileName: fileName,
        caption: caption,
        taggedPlayers: selectedPlayers,
        uploadedBy: userId,
        timestamp: serverTimestamp(),
        likesCount: 0,
      });

      setMessage("🎉 Photo uploaded successfully!");
      setFile(null);
      setCaption('');
      setSelectedPlayers([]);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      if (error.message.includes('auth') || error.message.includes('permission')) {
        setMessage('Upload requires authentication. Please sign in to upload photos.');
      } else {
        setMessage(`Error uploading photo: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 sm:p-8">
      <Modal message={message} onClose={() => setMessage('')} />
      
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">📸 Upload a Photo</h3>
        <p className="text-gray-600 text-sm">Share your favorite moments from the tournament!</p>
      </div>

      <div className="space-y-6">
        {/* File Upload with Drag and Drop */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-semibold mb-2">📁 Select Photo</label>
          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-orange-300 bg-gray-50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              {isDragOver ? (
                <div className="space-y-2">
                  <div className="text-4xl">📸</div>
                  <p className="text-blue-600 font-semibold">Drop your photo here!</p>
                  <p className="text-blue-500 text-sm">Release to upload</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl">📁</div>
                  <div>
                    <p className="text-gray-600 font-medium">Drag & drop your photo here</p>
                    <p className="text-gray-500 text-sm mt-1">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
            
            {file && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <p className="text-green-700 text-sm font-medium">{file.name}</p>
                  <span className="text-green-500 text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-semibold mb-2">💬 Caption (Optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="What's happening in this photo?"
          />
        </div>

        {/* Player Tagging */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-semibold mb-2">🏷️ Tag Players</label>
          <button
            onClick={() => setShowPlayerSelector(!showPlayerSelector)}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl bg-orange-50 text-orange-700 font-medium hover:bg-orange-100 transition-all duration-200"
          >
            {selectedPlayers.length > 0 
              ? `Tagged ${selectedPlayers.length} player${selectedPlayers.length > 1 ? 's' : ''} 📋`
              : 'Select players to tag 📋'
            }
          </button>
          
          {showPlayerSelector && (
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {players.map((player) => (
                  <button
                    key={player}
                    onClick={() => togglePlayer(player)}
                    className={`p-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 tag-badge
                      ${selectedPlayers.includes(player)
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50'
                      }`}
                  >
                    {player}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedPlayers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedPlayers.map((player) => (
                <span key={player} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {player} 
                  <button
                    onClick={() => togglePlayer(player)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg transform hover:scale-105
            ${uploading || !file 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-orange-500/25'
            }`}
        >
          {uploading ? '⏳ Uploading...' : '🚀 Upload Photo'}
        </button>
      </div>
    </div>
  );
};

// Photo Gallery Component
const PhotoGallery = () => {
  const { db, storage, userId, isAuthReady } = useFirebase();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // Local message for PhotoGallery component
  const [selectedPhotos, setSelectedPhotos] = useState([]); // Array of selected photo IDs
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for deletion
  const [selectedPhotoForLightbox, setSelectedPhotoForLightbox] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!db || !isAuthReady) return;

    // Get appId from environment for Firestore path
    const appId = typeof process.env.REACT_APP_APP_ID !== 'undefined' ? process.env.REACT_APP_APP_ID : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    const photosCollectionRef = collection(db, `artifacts/${appId}/public/data/photos`);

    // Listen for real-time updates
    const unsubscribe = onSnapshot(photosCollectionRef, (snapshot) => {
      const fetchedPhotos = [];
      snapshot.forEach((doc) => {
        fetchedPhotos.push({ id: doc.id, ...doc.data() });
      });
      // Sort photos by timestamp in descending order (most recent first)
      fetchedPhotos.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
      setPhotos(fetchedPhotos);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching photos:", error);
      setMessage(`Error loading photos: ${error.message}`);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [db, isAuthReady]);

  // Handle photo selection
  const handlePhotoSelect = (photoId) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedPhotos([]);
  };

  // Handle delete selected photos
  const handleDeleteSelected = async () => {
    if (selectedPhotos.length === 0) return;

    if (!userId) {
      setMessage("Please sign in to delete photos.");
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedPhotos.length} photo${selectedPhotos.length > 1 ? 's' : ''}? This action cannot be undone.`;
    setMessage(confirmMessage);
    
    // Store the selected photos for deletion after confirmation
    const photosToDelete = selectedPhotos;
    
    // Clear selection immediately for better UX
    setSelectedPhotos([]);
    
    setIsDeleting(true);
    setMessage('');

    try {
      const appId = typeof process.env.REACT_APP_APP_ID !== 'undefined' ? process.env.REACT_APP_APP_ID : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      
      // Get the photos to delete
      const photosToDeleteData = photos.filter(photo => photosToDelete.includes(photo.id));
      
      // Delete each photo
      for (const photo of photosToDeleteData) {
        // Delete from Storage
        if (photo.fileName) {
          const storageRef = ref(storage, `artifacts/${appId}/public/data/photos/${photo.fileName}`);
          await deleteObject(storageRef);
        }
        
        // Delete from Firestore
        const photoDocRef = doc(db, `artifacts/${appId}/public/data/photos/${photo.id}`);
        await deleteDoc(photoDocRef);
      }

      setMessage(`Successfully deleted ${photosToDelete.length} photo${photosToDelete.length > 1 ? 's' : ''}!`);
    } catch (error) {
      console.error("Error deleting photos:", error);
      if (error.message.includes('auth') || error.message.includes('permission')) {
        setMessage('Delete requires authentication. Please sign in to delete photos.');
      } else {
        setMessage(`Error deleting photos: ${error.message}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle lightbox open
  const handlePhotoClick = (photo) => {
    setSelectedPhotoForLightbox(photo);
    setIsLightboxOpen(true);
  };

  // Handle lightbox close
  const handleLightboxClose = () => {
    setSelectedPhotoForLightbox(null);
    setIsLightboxOpen(false);
  };

  // Handle lightbox navigation
  const handleLightboxNavigate = (direction) => {
    if (!selectedPhotoForLightbox) return;
    
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhotoForLightbox.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex + 1;
      if (newIndex >= photos.length) newIndex = 0; // Wrap to first
    } else {
      newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = photos.length - 1; // Wrap to last
    }
    
    setSelectedPhotoForLightbox(photos[newIndex]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-xl font-semibold text-gray-700">Loading photos...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 sm:p-8">
      <Modal message={message} onClose={() => setMessage('')} />
      
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">📸 Hawks Baseball Gallery</h3>
        <p className="text-gray-600 text-sm">Check out all the amazing moments from the tournament!</p>
      </div>
      
      {/* Selection Controls */}
      {selectedPhotos.length > 0 && userId && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-orange-800 font-bold text-sm">
                🎯 {selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleClearSelection}
                className="text-orange-600 hover:text-orange-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-orange-100 transition-all duration-200"
              >
                ✨ Clear Selection
              </button>
            </div>
            <button
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                isDeleting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg'
              }`}
            >
              {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete Selected'}
            </button>
          </div>
        </div>
      )}
      
      {/* Authentication Notice */}
      {!userId && photos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-blue-600 text-xl">🔒</span>
            <div>
              <p className="text-blue-800 font-medium">Sign in to manage photos</p>
              <p className="text-blue-600 text-sm">You can view photos, but need to sign in to upload or delete.</p>
            </div>
          </div>
        </div>
      )}
      
      {photos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-gray-600 text-lg font-medium">No photos uploaded yet.</p>
          <p className="text-gray-500 text-sm mt-2">Be the first to share your favorite moments!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {photos.map((photo) => {
            const isSelected = selectedPhotos.includes(photo.id);
            return (
              <div 
                key={photo.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 relative cursor-pointer photo-card border-2 ${
                  isSelected ? 'border-orange-500 shadow-orange-500/25' : 'border-gray-100 hover:border-orange-200'
                }`}
              >
                {/* Selection Checkbox */}
                {userId && (
                  <div className="absolute top-3 left-3 z-10">
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                        isSelected 
                          ? 'bg-orange-500 border-orange-500 shadow-lg' 
                          : 'bg-white border-gray-300 hover:border-orange-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePhotoSelect(photo.id);
                      }}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                
                <img
                  src={photo.url}
                  alt={photo.caption || 'Hawks Baseball Photo'}
                  className="w-full h-48 sm:h-56 object-cover cursor-pointer"
                  loading="lazy"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePhotoClick(photo);
                  }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=Image+Error"; }}
                />
                <div className="p-4">
                  {photo.caption && (
                    <p className="text-gray-800 font-semibold text-sm mb-2 line-clamp-2">{photo.caption}</p>
                  )}
                  
                  {/* Player Tags */}
                  {photo.taggedPlayers && photo.taggedPlayers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {photo.taggedPlayers.slice(0, 3).map((player) => (
                        <span key={player} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          👤 {player}
                        </span>
                      ))}
                      {photo.taggedPlayers.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{photo.taggedPlayers.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">
                      👤 {photo.uploadedBy.substring(0, 8)}...
                    </span>
                    {photo.timestamp && (
                      <span>
                        📅 {new Date(photo.timestamp.toDate()).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Lightbox */}
      {isLightboxOpen && selectedPhotoForLightbox && (
        <Lightbox
          photo={selectedPhotoForLightbox}
          onClose={handleLightboxClose}
          onNavigate={handleLightboxNavigate}
          totalPhotos={photos.length}
        />
      )}
    </div>
  );
};

// Lightbox Component
const Lightbox = ({ photo, onClose, onNavigate, totalPhotos }) => {
  const { db, userId, isAuthReady } = useFirebase();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(photo.likesCount || 0);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Listen for comments
  useEffect(() => {
    if (!db || !isAuthReady || !photo) return;

    const appId = typeof process.env.REACT_APP_APP_ID !== 'undefined' ? process.env.REACT_APP_APP_ID : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    const commentsRef = collection(db, `artifacts/${appId}/public/data/photos/${photo.id}/comments`);

    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const fetchedComments = [];
      snapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });
      // Sort comments by timestamp (newest first)
      fetchedComments.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [db, isAuthReady, photo]);

  // Check if current user has liked the photo
  useEffect(() => {
    if (!db || !isAuthReady || !photo || !userId) return;

    const appId = typeof process.env.REACT_APP_APP_ID !== 'undefined' ? process.env.REACT_APP_APP_ID : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    const userLikeRef = doc(db, `artifacts/${appId}/public/data/photos/${photo.id}/likes/${userId}`);

    const unsubscribe = onSnapshot(userLikeRef, (doc) => {
      setIsLiked(doc.exists());
    });

    return () => unsubscribe();
  }, [db, isAuthReady, photo, userId]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!db || !userId || !photo) return;

    setIsLiking(true);
    try {
      const appId = typeof process.env.REACT_APP_APP_ID !== 'undefined' ? process.env.REACT_APP_APP_ID : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      const userLikeRef = doc(db, `artifacts/${appId}/public/data/photos/${photo.id}/likes/${userId}`);
      const photoRef = doc(db, `artifacts/${appId}/public/data/photos/${photo.id}`);

      if (isLiked) {
        // Unlike
        await deleteDoc(userLikeRef);
        await updateDoc(photoRef, { likesCount: increment(-1) });
        setLikesCount(prev => prev - 1);
      } else {
        // Like
        await setDoc(userLikeRef, { likedAt: serverTimestamp() });
        await updateDoc(photoRef, { likesCount: increment(1) });
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment posting
  const handlePostComment = async () => {
    if (!db || !userId || !photo || !newComment.trim()) return;

    setIsPostingComment(true);
    try {
      const appId = typeof process.env.REACT_APP_APP_ID !== 'undefined' ? process.env.REACT_APP_APP_ID : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      const commentsRef = collection(db, `artifacts/${appId}/public/data/photos/${photo.id}/comments`);
      
      await addDoc(commentsRef, {
        text: newComment.trim(),
        commentedBy: userId,
        timestamp: serverTimestamp(),
      });

      setNewComment('');
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsPostingComment(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.fileName || 'hawks-baseball-photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full overflow-y-auto bg-white rounded-lg shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={() => onNavigate('prev')}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => onNavigate('next')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Photo */}
        <div className="relative">
          <img
            src={photo.url}
            alt={photo.caption || 'Hawks Baseball Photo'}
            className="w-full h-auto max-h-96 object-contain"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/e2e8f0/64748b?text=Image+Error"; }}
          />
        </div>

        {/* Photo Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              {photo.caption && (
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{photo.caption}</h3>
              )}
              <p className="text-gray-600 text-sm">
                Uploaded by: <span className="font-mono">{photo.uploadedBy.substring(0, 8)}...</span>
                {photo.timestamp && (
                  <span className="ml-4">
                    On: {new Date(photo.timestamp.toDate()).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  isLiked 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <svg className={`w-5 h-5 ${isLiked ? 'text-white' : 'text-gray-600'}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likesCount}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Comments ({comments.length})</h4>
            
            {/* Comment Input */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
              />
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim() || isPostingComment}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  !newComment.trim() || isPostingComment
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isPostingComment ? 'Posting...' : 'Post'}
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {comment.commentedBy.substring(0, 8)}...
                      </span>
                      {comment.timestamp && (
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp.toDate()).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { auth, userId, isAuthReady, firebaseInitError } = useFirebase(); // Get firebaseInitError

  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' or 'upload'
  const [refreshGallery, setRefreshGallery] = useState(0); // State to trigger gallery refresh

  // Function to handle successful upload and trigger gallery refresh
  const handleUploadSuccess = () => {
    setRefreshGallery(prev => prev + 1); // Increment to force re-render of gallery
    setActiveTab('gallery'); // Switch to gallery view after upload
  };

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Initializing app...</div>
      </div>
    );
  }

  // Display initialization error if present
  if (firebaseInitError) {
    return <Modal message={firebaseInitError} onClose={() => {}} />; // No close action for critical init error
  }

  // If user is not logged in, show Auth component
  if (!userId) {
    return <Auth />;
  }

  // If user is logged in, show the main app content
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 relative">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .photo-card {
          transition: all 0.3s ease;
        }
        .photo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .tag-badge {
          transition: all 0.2s ease;
        }
        .tag-badge:hover {
          transform: scale(1.05);
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
        }
        `}
      </style>
      

      
      <div className="content-wrapper">
      <header className="bg-blue-900 text-white shadow-xl relative overflow-hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-3 sm:mb-0">
              {/* Hawks Baseball Logo */}
              <div className="w-20 h-20 mr-3 bg-white rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <div className="text-center text-xs font-bold text-blue-900 w-full px-1">
                  <div className="text-xs font-bold leading-tight mb-1">HAWKS</div>
                  <div className="text-red-600 font-bold leading-tight mb-1">BASEBALL</div>
                  <div className="relative mb-1">
                    <div className="flex justify-center">
                      <div className="w-full h-1.5 bg-red-600"></div>
                    </div>
                    <div className="flex justify-center relative">
                      <div className="w-full h-1.5 bg-white border border-gray-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs">H</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-full h-1.5 bg-red-600"></div>
                    </div>
                  </div>

                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-yellow-400">Hawks Baseball</h1>
                <p className="text-xs sm:text-sm text-gray-300 font-medium">Cooperstown 2025</p>
              </div>
            </div>
            <nav className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105
                  ${activeTab === 'gallery' ? 'bg-yellow-400 text-blue-900 shadow-lg' : 'bg-yellow-400 text-blue-900 hover:bg-yellow-300'}`}
              >
                📸 Gallery
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105
                  ${activeTab === 'upload' ? 'bg-gray-400 text-gray-800 shadow-lg' : 'bg-gray-400 text-gray-800 hover:bg-gray-300'}`}
              >
                ⬆️ Upload
              </button>
              <button
                onClick={() => signOut(auth)}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🚪 Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative">
        <div className="bg-white rounded-lg border-2 border-yellow-400 p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <span className="text-2xl">⚾</span>
              <h2 className="text-2xl font-bold text-gray-800">Hawks Baseball Photo Gallery</h2>
              <span className="text-2xl">⚾</span>
            </div>
            <p className="text-gray-600 text-sm">Cooperstown 2025 Memories</p>
          </div>
          <div className="relative z-10">
            {activeTab === 'gallery' && <PhotoGallery key={refreshGallery} />}
            {activeTab === 'upload' && <PhotoUpload onUploadSuccess={handleUploadSuccess} />}
          </div>
        </div>
      </main>

      <footer className="bg-red-700 text-white p-4 mt-8 border-t-4 border-yellow-400 relative overflow-hidden">
        <div className="container mx-auto text-center">
          <p className="text-sm font-semibold">&copy; {new Date().getFullYear()} Hawks Baseball. All rights reserved.</p>
          <p className="mt-1 text-xs text-yellow-200">Logged in as: <span className="font-mono bg-white/10 px-2 py-1 rounded">{userId}</span></p>
        </div>
      </footer>
      </div>
    </div>
  );
};

// Wrap the App with FirebaseProvider
const RootApp = () => (
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
);

export default RootApp; 