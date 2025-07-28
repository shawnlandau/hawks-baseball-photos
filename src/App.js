import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { useFirebase } from './hooks/useFirebase';

// Components
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import PhotoGallery from './components/PhotoGallery';
import PhotoUpload from './components/PhotoUpload';

// Pages
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import MapPage from './pages/MapPage';

// Modal Component
const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <p className="text-gray-800 mb-4">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="w-full bg-hawks-red text-white py-2 px-4 rounded-lg hover:bg-hawks-red-dark transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { userId, isAuthReady } = useFirebase();
  
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Initializing app...</div>
      </div>
    );
  }
  
  return userId ? children : <Navigate to="/auth" replace />;
};

// Main App Component
const App = () => {
  const { userId, isAuthReady, firebaseInitError, handleAuth, handleSignOut, auth } = useFirebase();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (email, password, isSignUp, authMethod = 'email') => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      await handleAuth(email, password, isSignUp, authMethod);
    } catch (error) {
      console.error('Authentication error:', error);
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google sign-in was cancelled. Please try again.';
      }
      
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Display initialization error if present
  if (firebaseInitError) {
    return <Modal message={firebaseInitError} onClose={() => {}} />;
  }

  // Show loading while Firebase initializes
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing Hawks Baseball...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Global Styles */}
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
          `}
        </style>

        {/* Navigation */}
        {userId && <Navbar user={userId} auth={auth} onSignOut={handleSignOutClick} />}

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/auth" 
            element={
              !userId ? (
                <AuthForm 
                  onAuth={handleAuthSubmit} 
                  isLoading={isLoading} 
                  error={authError} 
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/gallery" 
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-8">
                  <PhotoGallery />
                </div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-8">
                  <PhotoUpload onUploadSuccess={() => {}} />
                </div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/schedule" 
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/map" 
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            } 
          />
          


          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Footer */}
        {userId && (
          <footer className="bg-hawks-navy text-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm font-semibold mb-2">
                &copy; {new Date().getFullYear()} Hawks Baseball. All rights reserved.
              </p>
              <p className="text-xs text-white/70">
                Cooperstown Dreams Park 2025 - Capturing memories, building character
              </p>
            </div>
          </footer>
        )}
      </div>
    </Router>
  );
};

// Root App with Firebase Provider
const RootApp = () => (
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
);

export default RootApp; 