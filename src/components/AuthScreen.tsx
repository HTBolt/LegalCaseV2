import React, { useState } from 'react';
import { Scale, User, Building, ArrowLeft, Eye, EyeOff, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { User as UserType, LawFirm, SignupData } from '../types';
import { systemConfig } from '../data/mockData';

interface AuthScreenProps {
  onLogin: (user: UserType) => void;
  onSignup: (signupData: SignupData) => void;
  users: UserType[];
  firms: LawFirm[];
  currentScreen: 'login' | 'signup-choice' | 'signup-lawyer' | 'signup-intern' | 'pending-approval';
  onScreenChange: (screen: 'login' | 'signup-choice' | 'signup-lawyer' | 'signup-intern') => void;
  pendingUser?: UserType | null;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onLogin, 
  onSignup, 
  users, 
  firms, 
  currentScreen,
  onScreenChange,
  pendingUser
}) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    email: '',
    role: 'lawyer',
    firmId: '',
    newFirmName: '',
    newFirmAddress: '',
    newFirmPhone: '',
    newFirmEmail: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingNewFirm, setIsCreatingNewFirm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = users.find(u => u.email.toLowerCase() === loginData.email.toLowerCase());
    
    if (!user) {
      setError('Invalid email or password');
      setIsLoading(false);
      return;
    }

    if (user.approvalStatus === 'pending') {
      setError('Your account is pending approval. Please wait for admin approval.');
      setIsLoading(false);
      return;
    }

    if (user.approvalStatus === 'rejected') {
      setError('Your account has been rejected. Please contact support.');
      setIsLoading(false);
      return;
    }

    onLogin(user);
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!signupData.name.trim()) {
      setError('Name is required');
      setIsLoading(false);
      return;
    }

    if (!signupData.email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (users.find(u => u.email.toLowerCase() === signupData.email.toLowerCase())) {
      setError('User with this email already exists');
      setIsLoading(false);
      return;
    }

    if (isCreatingNewFirm && signupData.role === 'lawyer') {
      if (!signupData.newFirmName?.trim()) {
        setError('Firm name is required');
        setIsLoading(false);
        return;
      }
    } else if (!signupData.firmId) {
      setError('Please select a law firm');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSignup(signupData);
    setIsLoading(false);
  };

  const handleDemoLogin = (user: UserType) => {
    setLoginData({ email: user.email, password: 'demo123' });
    onLogin(user);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'system-admin':
        return 'bg-red-100 text-red-800';
      case 'lawyer':
        return 'bg-blue-100 text-blue-800';
      case 'firm-admin':
        return 'bg-orange-100 text-orange-800';
      case 'intern':
        return 'bg-green-100 text-green-800';
      case 'client':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'system-admin':
        return '🔧';
      case 'firm-admin':
        return '👑';
      case 'lawyer':
        return '⚖️';
      case 'intern':
        return '🎓';
      case 'client':
        return '👤';
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'system-admin':
        return 'System Admin';
      case 'firm-admin':
        return 'Firm Admin';
      case 'lawyer':
        return 'Lawyer';
      case 'intern':
        return 'Intern';
      case 'client':
        return 'Client';
      default:
        return role;
    }
  };

  if (currentScreen === 'pending-approval' && pendingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
            <p className="text-gray-600 mb-6">
              Thank you for signing up, <strong>{pendingUser.name}</strong>! Your account is currently pending approval.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  {pendingUser.role === 'lawyer' && isCreatingNewFirm ? (
                    <p>Your lawyer account and new law firm registration will be reviewed by our system administrators.</p>
                  ) : (
                    <p>Your {getRoleDisplayName(pendingUser.role).toLowerCase()} account will be reviewed by the law firm administrators.</p>
                  )}
                  <p className="mt-2 font-medium">You'll receive an email notification once your account is approved.</p>
                </div>
              </div>
            </div>

            <div className="text-left space-y-2 text-sm text-gray-600 mb-6">
              <p><strong>Email:</strong> {pendingUser.email}</p>
              <p><strong>Role:</strong> {getRoleDisplayName(pendingUser.role)}</p>
              {pendingUser.firmId && (
                <p><strong>Law Firm:</strong> {firms.find(f => f.id === pendingUser.firmId)?.name}</p>
              )}
            </div>
            
            <button
              onClick={() => onScreenChange('login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
            {systemConfig.appName}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {currentScreen === 'login' && 'Sign in to your account'}
            {currentScreen === 'signup-choice' && 'Choose your account type'}
            {currentScreen === 'signup-lawyer' && 'Create lawyer account'}
            {currentScreen === 'signup-intern' && 'Create intern account'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Back Button */}
          {currentScreen !== 'login' && (
            <button
              onClick={() => {
                if (currentScreen === 'signup-choice') onScreenChange('login');
                else onScreenChange('signup-choice');
              }}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}

          {/* Login Form */}
          {currentScreen === 'login' && (
            <>
              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Demo Login Options</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                  {users.filter(u => u.approvalStatus === 'approved').map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleDemoLogin(user)}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="text-lg">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getRoleColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => onScreenChange('signup-choice')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </>
          )}

          {/* Signup Choice */}
          {currentScreen === 'signup-choice' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center mb-6">Choose Your Role</h3>
              
              <button
                onClick={() => onScreenChange('signup-lawyer')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚖️</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Lawyer</h4>
                    <p className="text-sm text-gray-600">Create or join a law firm as a practicing attorney</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onScreenChange('signup-intern')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎓</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Legal Intern</h4>
                    <p className="text-sm text-gray-600">Join an existing law firm as a legal intern</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Lawyer Signup */}
          {currentScreen === 'signup-lawyer' && (
            <form className="space-y-5" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Law Firm *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!isCreatingNewFirm}
                      onChange={() => setIsCreatingNewFirm(false)}
                      className="mr-2"
                    />
                    <span className="text-sm">Join existing law firm</span>
                  </label>
                  
                  {!isCreatingNewFirm && (
                    <select
                      value={signupData.firmId}
                      onChange={(e) => setSignupData({ ...signupData, firmId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                      required
                    >
                      <option value="">Select a law firm</option>
                      {firms.map(firm => (
                        <option key={firm.id} value={firm.id}>{firm.name}</option>
                      ))}
                    </select>
                  )}

                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={isCreatingNewFirm}
                      onChange={() => setIsCreatingNewFirm(true)}
                      className="mr-2"
                    />
                    <span className="text-sm">Create new law firm</span>
                  </label>

                  {isCreatingNewFirm && (
                    <div className="ml-6 space-y-3">
                      <input
                        type="text"
                        value={signupData.newFirmName}
                        onChange={(e) => setSignupData({ ...signupData, newFirmName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Law firm name *"
                        required={isCreatingNewFirm}
                      />
                      <input
                        type="text"
                        value={signupData.newFirmAddress}
                        onChange={(e) => setSignupData({ ...signupData, newFirmAddress: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Address"
                      />
                      <input
                        type="tel"
                        value={signupData.newFirmPhone}
                        onChange={(e) => setSignupData({ ...signupData, newFirmPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Phone number"
                      />
                      <input
                        type="email"
                        value={signupData.newFirmEmail}
                        onChange={(e) => setSignupData({ ...signupData, newFirmEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Firm email"
                      />
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Lawyer Account'
                )}
              </button>
            </form>
          )}

          {/* Intern Signup */}
          {currentScreen === 'signup-intern' && (
            <form className="space-y-5" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Law Firm *
                </label>
                <select
                  value={signupData.firmId}
                  onChange={(e) => setSignupData({ ...signupData, firmId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a law firm</option>
                  {firms.map(firm => (
                    <option key={firm.id} value={firm.id}>{firm.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  As an intern, you must join an existing law firm
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Intern Account'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;