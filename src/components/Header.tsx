import React, { useState } from 'react';
import { Scale, LogOut, User, Bell, Settings, Building, Menu, X, UserCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">LegalCase Pro</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Case Management System</p>
            </div>
          </div>

          {/* Desktop User Info and Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notifications - Hide for clients */}
            {currentUser.role !== 'client' && (
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
            )}

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {getRoleIcon(currentUser.role)}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(currentUser.role)}`}>
                    {getRoleDisplayName(currentUser.role)}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-2 py-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getRoleIcon(currentUser.role)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(currentUser.role)}`}>
                    {getRoleDisplayName(currentUser.role)}
                  </span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className={`grid ${currentUser.role === 'client' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 px-2`}>
                {currentUser.role !== 'client' && (
                  <button className="flex flex-col items-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="h-5 w-5 mb-1" />
                    <span className="text-xs">Notifications</span>
                  </button>
                )}
                <button className="flex flex-col items-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="h-5 w-5 mb-1" />
                  <span className="text-xs">Settings</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex flex-col items-center p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mb-1" />
                  <span className="text-xs">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;