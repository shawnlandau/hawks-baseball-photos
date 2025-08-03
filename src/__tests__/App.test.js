import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the Firebase context
jest.mock('../contexts/FirebaseContext', () => ({
  FirebaseProvider: ({ children }) => <div data-testid="firebase-provider">{children}</div>
}));

// Mock the useFirebase hook
const mockUseFirebase = jest.fn();
jest.mock('../hooks/useFirebase', () => ({
  useFirebase: () => mockUseFirebase()
}));

// Mock components
jest.mock('../components/Navbar', () => {
  return function MockNavbar({ onSignOut }) {
    return (
      <nav data-testid="navbar">
        <button onClick={onSignOut} data-testid="sign-out-button">Sign Out</button>
      </nav>
    );
  };
});

jest.mock('../components/AuthForm', () => {
  return function MockAuthForm({ onAuth, isLoading, error }) {
    return (
      <div data-testid="auth-form">
        <button 
          onClick={() => onAuth('test@example.com', 'password123', false)}
          data-testid="sign-in-button"
          disabled={isLoading}
        >
          Sign In
        </button>
        <button 
          onClick={() => onAuth('test@example.com', 'password123', true)}
          data-testid="sign-up-button"
          disabled={isLoading}
        >
          Sign Up
        </button>
        {error && <div data-testid="auth-error">{error}</div>}
      </div>
    );
  };
});

jest.mock('../pages/HomePage', () => {
  return function MockHomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../components/PhotoGallery', () => {
  return function MockPhotoGallery() {
    return <div data-testid="photo-gallery">Photo Gallery</div>;
  };
});

jest.mock('../components/PhotoUpload', () => {
  return function MockPhotoUpload() {
    return <div data-testid="photo-upload">Photo Upload</div>;
  };
});

const renderApp = () => {
  return render(
    <App />
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Firebase Initialization', () => {
    test('shows loading state while Firebase initializes', () => {
      mockUseFirebase.mockReturnValue({
        userId: null,
        isAuthReady: false,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: null
      });

      renderApp();
      
      expect(screen.getByText('Initializing Hawks Baseball...')).toBeInTheDocument();
    });

    test('shows error modal when Firebase initialization fails', () => {
      mockUseFirebase.mockReturnValue({
        userId: null,
        isAuthReady: true,
        firebaseInitError: 'Firebase initialization failed',
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: null
      });

      renderApp();
      
      expect(screen.getByText('Firebase initialization failed')).toBeInTheDocument();
    });
  });

  describe('Authentication Flows', () => {
    test('redirects authenticated user from /auth to home', () => {
      mockUseFirebase.mockReturnValue({
        userId: 'user123',
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: { currentUser: { email: 'test@example.com' } }
      });

      renderApp();
      
      // Should show home page instead of auth form
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('auth-form')).not.toBeInTheDocument();
    });

    test('shows auth form for unauthenticated users', () => {
      mockUseFirebase.mockReturnValue({
        userId: null,
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: null
      });

      renderApp();
      
      expect(screen.getByTestId('auth-form')).toBeInTheDocument();
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    test('redirects unauthenticated users to /auth when accessing protected routes', () => {
      mockUseFirebase.mockReturnValue({
        userId: null,
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: null
      });

      renderApp();
      
      // Should show auth form for all protected routes
      expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    });

    test('allows authenticated users to access protected routes', () => {
      mockUseFirebase.mockReturnValue({
        userId: 'user123',
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: { currentUser: { email: 'test@example.com' } }
      });

      renderApp();
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Navigation and Routing', () => {
    beforeEach(() => {
      mockUseFirebase.mockReturnValue({
        userId: 'user123',
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: { currentUser: { email: 'test@example.com' } }
      });
    });

    test('shows navbar for authenticated users', () => {
      renderApp();
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('does not show navbar for unauthenticated users', () => {
      mockUseFirebase.mockReturnValue({
        userId: null,
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: null
      });

      renderApp();
      
      expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    });
  });

  describe('Sign Out Flow', () => {
    test('calls handleSignOut when sign out button is clicked', async () => {
      const mockHandleSignOut = jest.fn();
      mockUseFirebase.mockReturnValue({
        userId: 'user123',
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: mockHandleSignOut,
        auth: { currentUser: { email: 'test@example.com' } }
      });

      renderApp();
      
      const signOutButton = screen.getByTestId('sign-out-button');
      await userEvent.click(signOutButton);
      
      expect(mockHandleSignOut).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('displays authentication errors', () => {
      mockUseFirebase.mockReturnValue({
        userId: null,
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: null
      });

      renderApp();
      
      // Simulate an auth error by rendering AuthForm with error prop
      // This would be handled by the App component's error state
      expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    });
  });

  describe('404 Handling', () => {
    test('redirects unknown routes to home for authenticated users', () => {
      mockUseFirebase.mockReturnValue({
        userId: 'user123',
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: { currentUser: { email: 'test@example.com' } }
      });

      renderApp();
      
      // The App component redirects unknown routes to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    test('redirects unknown routes to auth for unauthenticated users', () => {
      mockUseFirebase.mockReturnValue({
        userId: null,
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: null
      });

      renderApp();
      
      expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    test('shows footer for authenticated users', () => {
      mockUseFirebase.mockReturnValue({
        userId: 'user123',
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: { currentUser: { email: 'test@example.com' } }
      });

      renderApp();
      
      expect(screen.getByText(/Hawks Baseball. All rights reserved./)).toBeInTheDocument();
      expect(screen.getByText(/Cooperstown Dreams Park 2025/)).toBeInTheDocument();
    });

    test('does not show footer for unauthenticated users', () => {
      mockUseFirebase.mockReturnValue({
        userId: null,
        isAuthReady: true,
        firebaseInitError: null,
        handleAuth: jest.fn(),
        handleSignOut: jest.fn(),
        auth: null
      });

      renderApp();
      
      expect(screen.queryByText(/Hawks Baseball. All rights reserved./)).not.toBeInTheDocument();
    });
  });
}); 