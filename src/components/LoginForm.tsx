import React, { useState } from 'react';
import { Scale, User, Lock, Eye, EyeOff, Building, UserCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
  users: UserType[];
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      setError('Invalid email or password');
      setIsLoading(false);
      return;
    }

    // For demo purposes, accept any password
    onLogin(user);
    setIsLoading(false);
  };

  const handleDemoLogin = (user: UserType) => {
    setEmail(user.email);
    setPassword('demo123');
    onLogin(user);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'lawyer':
        return 'bg-blue-100 text-blue-800';
      case 'intern':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'firm-admin':
        return 'bg-orange-100 text-orange-800';
      case 'client':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'firm-admin':
        return <Building className="h-4 w-4" />;
      case 'client':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'firm-admin':
        return 'Firm Admin';
      case 'lawyer':
        return 'Lawyer';
      case 'intern':
        return 'Intern';
      case 'admin':
        return 'Admin';
      case 'client':
        return 'Client';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header - Optimized for mobile */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
            Legal Case Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form - Mobile optimized */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

          {/* Demo Login Options - Mobile optimized */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Login Options</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user)}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
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

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Click any demo user above or use their email with any password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;