import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { useFirebase } from './hooks/useFirebase';

// Components
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import PhotoGallery from './components/PhotoGallery';
import VideoUpload from './components/VideoUpload';
import UploadPage from './components/UploadPage';

// Pages
import HomePage from './pages/HomePage';
import GameResults from './pages/GameResults';

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
  const { userId, isAuthReady, firebaseInitError, handleAuth, handleSignOut, handleForgotPassword, auth } = useFirebase();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (email, password, isSignUp, authMethod = 'email') => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      if (authMethod === 'forgot-password') {
        // Handle forgot password
        await handleForgotPassword(email);
      } else {
        await handleAuth(email, password, isSignUp, authMethod);
      }
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
      throw error; // Re-throw for the AuthForm to handle
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
    <Router future={{ v7_startTransition: true }}>
      <div className="min-h-screen bg-gray-50">
        {/* Global Styles */}
        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          .photo-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .photo-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          .tag-badge {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .tag-badge:hover {
            transform: scale(1.1);
          }
          .animate-fade-in {
            animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-up {
            animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-bounce-gentle {
            animation: bounceGentle 3s ease-in-out infinite;
          }
          @keyframes bounceGentle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-pulse-slow {
            animation: pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulseSlow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
          .backdrop-blur-md {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          .shadow-2xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.3);
          }
          .gradient-text {
            background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .focus-ring {
            transition: all 0.2s ease-in-out;
          }
          .focus-ring:focus {
            outline: none;
            ring: 4px;
            ring-color: #dc2626;
            ring-offset: 2px;
          }
          .text-shadow {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .border-gradient {
            border: 2px solid;
            border-image: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%) 1;
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
                <UploadPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/upload-video" 
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-8">
                  <VideoUpload onUploadSuccess={() => {}} />
                </div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <GameResults />
              </ProtectedRoute>
            } 
          />
          


          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Footer - REMOVED */}
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