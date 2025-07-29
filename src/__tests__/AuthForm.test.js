import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '../components/AuthForm';

// Mock the onAuth function
const mockOnAuth = jest.fn();

const renderAuthForm = (props = {}) => {
  return render(
    <AuthForm 
      onAuth={mockOnAuth} 
      isLoading={false} 
      error="" 
      {...props} 
    />
  );
};

describe('AuthForm Component', () => {
  beforeEach(() => {
    mockOnAuth.mockClear();
  });

  describe('Initial Render', () => {
    test('renders sign in form by default', () => {
      renderAuthForm();
      
      expect(screen.getByText('Hawks Baseball')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
      expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    });

    test('shows sign up form when toggled', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const toggleButton = screen.getByText('Sign Up');
      await user.click(toggleButton);
      
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.queryByText(/forgot password/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows validation error for empty email', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const submitButton = screen.getByText('Sign In');
      await user.click(submitButton);
      
      expect(screen.getByText('Email address is required')).toBeInTheDocument();
    });

    test('shows validation error for invalid email format', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByText('Sign In');
      await user.click(submitButton);
      
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    test('shows validation error for weak password', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'weak');
      
      const submitButton = screen.getByText('Sign In');
      await user.click(submitButton);
      
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });

    test('shows validation error for password without required characters', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByText('Sign In');
      await user.click(submitButton);
      
      expect(screen.getByText('Password must contain uppercase, lowercase, and number')).toBeInTheDocument();
    });

    test('shows validation error for mismatched passwords in sign up', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      // Switch to sign up
      const toggleButton = screen.getByText('Sign Up');
      await user.click(toggleButton);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123');
      await user.type(confirmPasswordInput, 'DifferentPass123');
      
      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);
      
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    test('toggles password visibility', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByLabelText(/show password/i);
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('toggles confirm password visibility in sign up', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      // Switch to sign up
      const toggleButton = screen.getByText('Sign Up');
      await user.click(toggleButton);
      
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const toggleConfirmButton = screen.getByLabelText(/show password/i);
      
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      await user.click(toggleConfirmButton);
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Password Strength Indicator', () => {
    test('shows password strength indicator', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'weak');
      
      expect(screen.getByText('Password strength: Weak')).toBeInTheDocument();
    });

    test('updates password strength as user types', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'ValidPass123');
      
      expect(screen.getByText('Password strength: Strong')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('calls onAuth with correct parameters for sign in', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123');
      
      const submitButton = screen.getByText('Sign In');
      await user.click(submitButton);
      
      expect(mockOnAuth).toHaveBeenCalledWith('test@example.com', 'ValidPass123', false);
    });

    test('calls onAuth with correct parameters for sign up', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      // Switch to sign up
      const toggleButton = screen.getByText('Sign Up');
      await user.click(toggleButton);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123');
      await user.type(confirmPasswordInput, 'ValidPass123');
      
      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);
      
      expect(mockOnAuth).toHaveBeenCalledWith('test@example.com', 'ValidPass123', true);
    });

    test('calls onAuth with google method for Google sign in', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const googleButton = screen.getByText(/continue with google/i);
      await user.click(googleButton);
      
      expect(mockOnAuth).toHaveBeenCalledWith(null, null, false, 'google');
    });
  });

  describe('Loading State', () => {
    test('shows loading state when isLoading is true', () => {
      renderAuthForm({ isLoading: true });
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeDisabled();
      expect(screen.getByText(/continue with google/i)).toBeDisabled();
    });
  });

  describe('Error Display', () => {
    test('displays authentication error message', () => {
      const errorMessage = 'Authentication failed. Please try again.';
      renderAuthForm({ error: errorMessage });
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('displays validation errors', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const submitButton = screen.getByText('Sign In');
      await user.click(submitButton);
      
      expect(screen.getByText('Email address is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  describe('Forgot Password', () => {
    test('shows alert when forgot password is clicked', async () => {
      const user = userEvent.setup();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      renderAuthForm();
      
      const forgotPasswordButton = screen.getByText(/forgot password/i);
      await user.click(forgotPasswordButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Forgot password functionality will be implemented soon.');
      
      alertSpy.mockRestore();
    });
  });

  describe('Form Reset', () => {
    test('resets form when switching between sign in and sign up', async () => {
      const user = userEvent.setup();
      renderAuthForm();
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Switch to sign up
      const toggleButton = screen.getByText('Sign Up');
      await user.click(toggleButton);
      
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      renderAuthForm();
      
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/show password/i)).toBeInTheDocument();
    });

    test('has proper form labels', () => {
      renderAuthForm();
      
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });
}); 