import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const AuthForm = ({ onAuth, isLoading, error }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation (for sign up)
    if (isSignUp && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onAuth(formData.email, formData.password, isSignUp);
  };

  const handleGoogleAuth = () => {
    onAuth(null, null, false, 'google');
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setForgotPasswordEmail(formData.email);
    setForgotPasswordError('');
    setForgotPasswordSuccess(false);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail || !/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setForgotPasswordError('Please enter a valid email address');
      return;
    }

    setIsForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      // Call the forgot password function from the parent component
      await onAuth(forgotPasswordEmail, null, false, 'forgot-password');
      setForgotPasswordSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      setForgotPasswordError(errorMessage);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordError('');
    setForgotPasswordSuccess(false);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '', percentage: 0 };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-green-600'];
    const bgColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    
    return {
      strength: Math.min(strength, 5),
      label: labels[strength],
      color: colors[strength],
      bgColor: bgColors[strength],
      percentage: (strength / 5) * 100
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-30"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white rounded-full flex items-center justify-center shadow-xl mx-auto mb-6 overflow-hidden border-4 border-hawks-red/20">
            <img 
              src="/hawks-logo.jpg" 
              alt="Hawks Baseball Team Logo - Cooperstown Dreams Park 2025" 
              className="w-full h-full object-contain p-3"
              loading="lazy"
              onError={(e) => {
                console.log('Hawks logo failed to load, using fallback');
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="text-center text-xs font-bold text-hawks-navy w-full px-1 hidden">
              <div className="text-xs font-bold leading-tight mb-1">HAWKS</div>
              <div className="text-hawks-red font-bold leading-tight mb-1">BASEBALL</div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Hawks Baseball
          </h1>
          <p className="text-gray-600 font-medium text-base sm:text-lg">
            Cooperstown Dreams Park 2025
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete={isSignUp ? "email" : "email"}
                  aria-describedby={validationErrors.email ? "email-error" : undefined}
                  aria-invalid={validationErrors.email ? "true" : "false"}
                  className={`w-full pl-12 pr-4 h-14 border-2 rounded-xl focus:ring-4 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base ${
                    validationErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  required
                />
              </div>
              {validationErrors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-2 font-medium" role="alert">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  aria-describedby={validationErrors.password ? "password-error" : undefined}
                  aria-invalid={validationErrors.password ? "true" : "false"}
                  className={`w-full pl-12 pr-14 h-14 border-2 rounded-xl focus:ring-4 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base ${
                    validationErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                </button>
              </div>
              {validationErrors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-2 font-medium" role="alert">
                  {validationErrors.password}
                </p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength && passwordStrength.bgColor && level <= passwordStrength.strength
                            ? passwordStrength.bgColor
                            : 'bg-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-2 font-medium ${passwordStrength && passwordStrength.color ? passwordStrength.color : 'text-gray-500'}`}>
                    {passwordStrength && passwordStrength.label ? `Password strength: ${passwordStrength.label}` : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    aria-describedby={validationErrors.confirmPassword ? "confirm-password-error" : undefined}
                    aria-invalid={validationErrors.confirmPassword ? "true" : "false"}
                    className={`w-full pl-12 pr-14 h-14 border-2 rounded-xl focus:ring-4 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base ${
                      validationErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p id="confirm-password-error" className="text-red-500 text-sm mt-2 font-medium" role="alert">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Remember Me Checkbox (Sign In Only) */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-5 w-5"
                  />
                  <span className="ml-3 text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4" role="alert">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-base h-14 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" aria-hidden="true"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <FaUser className="w-5 h-5" aria-hidden="true" />
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>

            {/* Google Auth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-base h-14 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Sign in with Google"
            >
              <FaGoogle className="w-5 h-5 text-red-500" aria-hidden="true" />
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-base">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFormData({ email: '', password: '', confirmPassword: '' });
                  setValidationErrors({});
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="ml-2 text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {forgotPasswordSuccess ? (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-600 text-sm">
                      ✅ Password reset email sent! Check your inbox and follow the link to reset your password.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToSignIn}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors h-12"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        type="email"
                        id="forgot-email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="w-full pl-10 pr-4 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500 transition-colors text-base"
                        placeholder="Enter your email address"
                        disabled={isForgotPasswordLoading}
                        required
                      />
                    </div>
                  </div>

                  {forgotPasswordError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                      <p className="text-red-600 text-sm">{forgotPasswordError}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleBackToSignIn}
                      disabled={isForgotPasswordLoading}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotPasswordLoading}
                      className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 h-12"
                    >
                      {isForgotPasswordLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Reset Link</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-4">
            Capture the Hawks' Cooperstown memories
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <button 
              type="button" 
              className="hover:text-gray-600 transition-colors"
              onClick={() => window.open('/privacy-policy', '_blank')}
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              type="button" 
              className="hover:text-gray-600 transition-colors"
              onClick={() => window.open('/terms-of-service', '_blank')}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm; 