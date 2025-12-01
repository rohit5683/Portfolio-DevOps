import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnimatedBackground from '../../components/layout/AnimatedBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [showMethodSelection, setShowMethodSelection] = useState(false);
  const [mfaMethod, setMfaMethod] = useState<'email' | 'totp'>('email');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (mfaRequired) {
        // Verify OTP
        const response = await api.post('/auth/verify-mfa', { tempToken, otp, method: mfaMethod });
        login(response.data.accessToken, response.data.refreshToken);
        navigate('/portal');
      } else {
        // Initial Login
        const response = await api.post('/auth/login', { email, password });
        
        if (response.data.mfaRequired) {
          setTempToken(response.data.tempToken);
          setShowMethodSelection(true); // Show method selection instead of going directly to OTP
          setError(''); // Clear any previous errors
        } else {
          login(response.data.accessToken, response.data.refreshToken);
          navigate('/portal');
        }
      }
    } catch (err) {
      setError(mfaRequired ? 'Invalid code' : 'Invalid credentials');
      console.error('Login failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelection = (method: 'email' | 'totp') => {
    setMfaMethod(method);
    setShowMethodSelection(false);
    setMfaRequired(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl mx-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          {mfaRequired ? 'Enter OTP' : 'Admin Login'}
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Login Form */}
          {!mfaRequired && !showMethodSelection ? (
            <>
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Enter Email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-12"
                    placeholder="Enter Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : showMethodSelection ? (
            /* Method Selection */
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white text-center mb-4">
                Choose Authentication Method
              </h3>
              <p className="text-gray-400 text-center text-sm mb-6">
                Select how you want to verify your identity
              </p>
              
              <button
                type="button"
                onClick={() => handleMethodSelection('email')}
                className="w-full p-6 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-blue-500 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold">Email Verification</p>
                    <p className="text-gray-400 text-sm">Receive code via email</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleMethodSelection('totp')}
                className="w-full p-6 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-green-500 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold">Google Authenticator</p>
                    <p className="text-gray-400 text-sm">Use authenticator app</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="otp">
                {mfaMethod === 'email' ? 'Email Verification Code' : 'Authenticator Code'}
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-center tracking-widest text-2xl"
                placeholder=""
                maxLength={6}
                required
                autoFocus
              />
              <p className="text-gray-400 text-xs mt-2 text-center">
                {mfaMethod === 'email' 
                  ? 'Check your email for the 6-digit code' 
                  : 'Enter the 6-digit code from Google Authenticator'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mfaRequired ? 'Verify OTP' : 'Sign In'}
          </button>
        </form>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
            <div className="relative">
              {/* Outer spinning ring */}
              <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              
              {/* Inner pulsing circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-pulse"></div>
              </div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-white font-semibold text-lg mb-1">
                {mfaRequired ? 'Verifying OTP...' : 'Sending OTP...'}
              </p>
              <p className="text-gray-300 text-sm">
                {mfaRequired ? 'Please wait' : 'Check your email in a moment'}
              </p>
            </div>
            
            {/* Animated dots */}
            <div className="flex gap-1 mt-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
