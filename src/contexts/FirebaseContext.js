import React, { useState, useEffect, createContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/* global __firebase_config */

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [storage, setStorage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [firebaseInitError, setFirebaseInitError] = useState('');

  useEffect(() => {
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
      
      let firebaseConfig;
      try {
        firebaseConfig = typeof configString === 'string' ? JSON.parse(configString) : configString;
        
        if (typeof firebaseConfig === 'string') {
          try {
            firebaseConfig = JSON.parse(firebaseConfig);
          } catch (doubleParseError) {
            const match = configString.match(/\{.*\}/);
            if (match) {
              firebaseConfig = JSON.parse(match[0]);
            } else {
              throw new Error('Could not parse Firebase config');
            }
          }
        }
      } catch (e) {
        firebaseConfig = {};
      }
      
      // Validate that we have a proper config
      if (!firebaseConfig || !firebaseConfig.projectId) {
        const fallbackConfig = {
          apiKey: "AIzaSyCouuChPSVEKmaxkw3f4r4-Xx-4vADiBWc",
          authDomain: "hawksbaseballphotos-5bb61.firebaseapp.com",
          projectId: "hawksbaseballphotos-5bb61",
          storageBucket: "hawksbaseballphotos-5bb61.appspot.com",
          messagingSenderId: "1090003594150",
          appId: "1:1090003594150:web:92ff02eb4fe204a67f7d67",
          measurementId: "G-RS15QL2HJ0"
        };
        firebaseConfig = fallbackConfig;
      }
      
      const initializedApp = initializeApp(firebaseConfig);
      setApp(initializedApp);

      // Initialize Firebase Services
      const firestoreDb = getFirestore(initializedApp);
      setDb(firestoreDb);
      const firebaseAuth = getAuth(initializedApp);
      setAuth(firebaseAuth);
      const firebaseStorage = getStorage(initializedApp);
      setStorage(firebaseStorage);

      // Set up auth state listener
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setFirebaseInitError('Failed to initialize Firebase. Please check your configuration.');
      setIsAuthReady(true);
    }
  }, []);

  const handleAuth = async (email, password, isSignUp, authMethod = 'email') => {
    try {
      if (authMethod === 'google') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    app,
    db,
    auth,
    storage,
    userId,
    isAuthReady,
    firebaseInitError,
    handleAuth,
    handleSignOut
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext }; 