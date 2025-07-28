import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const AuthForm = ({ onAuth, isLoading, error }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
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
    // TODO: Implement forgot password functionality
    alert('Forgot password functionality will be implemented soon.');
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
    <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red flex items-center justify-center p-4 sm:p-6">
      {/* Background pattern - hidden on small screens */}
      <div className="absolute inset-0 opacity-5 hidden sm:block">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-hawks-red mx-auto mb-4 sm:mb-6 overflow-hidden">
            <img 
              src="/hawks-logo.jpg" 
              alt="Hawks Baseball Team Logo" 
              className="w-full h-full object-contain p-2"
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Hawks Baseball
          </h1>
          <p className="text-hawks-gold font-medium text-sm sm:text-base">
            Cooperstown Dreams Park 2025
          </p>
          <p className="text-white/80 text-xs sm:text-sm mt-2 px-4">
            {isSignUp ? 'Create your account to share memories' : 'Sign in to view and share photos'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-hawks-red">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete={isSignUp ? "email" : "email"}
                  aria-describedby={validationErrors.email ? "email-error" : undefined}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent transition-colors text-base ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  required
                />
              </div>
              {validationErrors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  aria-describedby={validationErrors.password ? "password-error" : undefined}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent transition-colors text-base ${
                    validationErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                </button>
              </div>
              {validationErrors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1" role="alert">
                  {validationErrors.password}
                </p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded transition-colors ${
                          passwordStrength && passwordStrength.bgColor && level <= passwordStrength.strength
                            ? passwordStrength.bgColor
                            : 'bg-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${passwordStrength && passwordStrength.color ? passwordStrength.color : 'text-gray-500'}`}>
                    {passwordStrength && passwordStrength.label ? `Password strength: ${passwordStrength.label}` : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    aria-describedby={validationErrors.confirmPassword ? "confirm-password-error" : undefined}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent transition-colors text-base ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p id="confirm-password-error" className="text-red-500 text-sm mt-1" role="alert">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Forgot Password Link (Sign In Only) */}
            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-hawks-red hover:text-hawks-red-dark font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-hawks-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-hawks-red-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <FaUser className="w-4 h-4" aria-hidden="true" />
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>

            {/* Google Auth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base"
            >
              <FaGoogle className="w-4 h-4 text-red-500" aria-hidden="true" />
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
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
                className="ml-1 text-hawks-red font-semibold hover:underline transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-xs sm:text-sm px-4">
            Capture the Hawks' Cooperstown memories
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm; 