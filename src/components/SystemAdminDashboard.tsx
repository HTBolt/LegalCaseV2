import React, { useState } from 'react';
import { 
  Users, Building, UserCheck, Shield, CheckCircle, XCircle, 
  AlertTriangle, Crown, Edit, Trash2, Plus, Filter, Star,
  Calendar, DollarSign, HardDrive
} from 'lucide-react';
import { User, LawFirm } from '../types';

interface SystemAdminDashboardProps {
  users: User[];
  firms: LawFirm[];
  currentUser: User;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: User['role']) => void;
  onDeleteUser: (userId: string) => void;
  onCreateFirm: (firmData: Partial<LawFirm>) => void;
  onUpdateFirm: (firmId: string, updates: Partial<LawFirm>) => void;
  onDeleteFirm: (firmId: string) => void;
}

const SystemAdminDashboard: React.FC<SystemAdminDashboardProps> = ({
  users,
  firms,
  currentUser,
  onApproveUser,
  onRejectUser,
  onUpdateUserRole,
  onDeleteUser,
  onCreateFirm,
  onUpdateFirm,
  onDeleteFirm
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'firms'>('overview');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingFirm, setEditingFirm] = useState<LawFirm | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFirmModal, setShowFirmModal] = useState(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');

  // Calculate statistics
  const totalUsers = users.length;
  const totalFirms = firms.length;
  const pendingUsers = users.filter(u => u.approvalStatus === 'pending').length;
  const paidSubscribers = users.filter(u => 
    ['Basic', 'Premium', 'Power'].includes(u.subscriptionCategory || '')
  ).length;

  // Get subscription status indicator
  const getSubscriptionIcon = (user: User) => {
    if (!['firm-admin', 'lawyer', 'intern'].includes(user.role)) {
      return null;
    }

    const category = user.subscriptionCategory;
    const isActive = user.subscriptionActive;

    const iconProps = "h-4 w-4 text-white";

    switch (category) {
      case 'Free':
        return (
          <div className="relative">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center" title={`Free Plan - ${isActive ? 'Active' : 'Inactive'}`}>
              <span className="text-xs font-bold text-white">F</span>
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
        );
      case 'Basic':
        return (
          <div className="relative">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center" title={`Basic Plan - ${isActive ? 'Active' : 'Inactive'}`}>
              <span className="text-xs font-bold text-white">B</span>
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
        );
      case 'Premium':
        return (
          <div className="relative">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center" title={`Premium Plan - ${isActive ? 'Active' : 'Inactive'}`}>
              <span className="text-xs font-bold text-white">P</span>
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
        );
      case 'Power':
        return (
          <div className="relative">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center" title={`Power Plan - ${isActive ? 'Active' : 'Inactive'}`}>
              <Star className="h-3 w-3 text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Filter users based on subscription type
  const filteredUsers = users.filter(user => {
    switch (subscriptionFilter) {
      case 'free':
        return user.subscriptionCategory === 'Free';
      case 'basic':
        return user.subscriptionCategory === 'Basic';
      case 'premium':
        return user.subscriptionCategory === 'Premium';
      case 'power':
        return user.subscriptionCategory === 'Power';
      case 'active':
        return user.subscriptionActive === true;
      case 'inactive':
        return user.subscriptionActive === false;
      case 'no-subscription':
        return !['firm-admin', 'lawyer', 'intern'].includes(user.role);
      default:
        return true; // 'all'
    }
  });

  const handleUserEdit = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleUserModalClose = () => {
    setEditingUser(null);
    setShowUserModal(false);
  };

  const handleUserUpdate = (updates: Partial<User>) => {
    if (editingUser) {
      // This would typically update via API call
      console.log('Updating user:', editingUser.id, updates);
      handleUserModalClose();
    }
  };

  const handleFirmEdit = (firm: LawFirm) => {
    setEditingFirm(firm);
    setShowFirmModal(true);
  };

  const handleFirmModalClose = () => {
    setEditingFirm(null);
    setShowFirmModal(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'system-admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'firm-admin':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lawyer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intern':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'client':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatStorage = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes;
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">System Administration</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage users, firms, and system settings</p>
            </div>
            <div className="overflow-x-auto">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'overview' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'users' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  User Management
                </button>
                <button
                  onClick={() => setActiveTab('firms')}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'firms' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Firm Management
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'overview' && (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 sm:p-3 rounded-lg">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 sm:p-3 rounded-lg">
                    <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Paid Subscribers</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{paidSubscribers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-purple-500 p-2 sm:p-3 rounded-lg">
                    <Building className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Law Firms</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalFirms}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-2 sm:p-3 rounded-lg">
                    <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{pendingUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                >
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Manage Users</p>
                </button>
                <button
                  onClick={() => setActiveTab('firms')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                >
                  <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Manage Firms</p>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('users');
                    setSubscriptionFilter('all');
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                >
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">System Settings</p>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <span className="text-sm text-gray-500">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} shown</span>
                </div>

                {/* Subscription Filter */}
                <div className="flex items-center space-x-3">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter by subscription:</span>
                  <select
                    value={subscriptionFilter}
                    onChange={(e) => setSubscriptionFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Users</option>
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="power">Power</option>
                    <option value="active">Active Subscriptions</option>
                    <option value="inactive">Inactive Subscriptions</option>
                    <option value="no-subscription">No Subscription</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          {getSubscriptionIcon(user)}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getApprovalColor(user.approvalStatus || 'approved')}`}>
                            {user.approvalStatus || 'approved'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        {user.firmId && (
                          <p className="text-xs text-gray-400">
                            Firm: {firms.find(f => f.id === user.firmId)?.name || 'Unknown'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUserEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Approvals Section */}
            {users.filter(u => u.approvalStatus === 'pending').length > 0 && (
              <div className="border-t border-gray-200 p-4 sm:p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                  Pending Approvals ({users.filter(u => u.approvalStatus === 'pending').length})
                </h4>
                <div className="space-y-3">
                  {users.filter(u => u.approvalStatus === 'pending').map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onApproveUser(user.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Approve user"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRejectUser(user.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Reject user"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'firms' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Law Firm Management</h3>
                <button
                  onClick={() => setShowFirmModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Firm</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {firms.map((firm) => {
                const firmAdmin = users.find(u => u.id === firm.adminId);
                const memberCount = firm.members.length;
                const pendingCount = firm.pendingApprovals.length;
                
                return (
                  <div key={firm.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{firm.name}</p>
                          <p className="text-sm text-gray-500 truncate">{firm.email}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                            {pendingCount > 0 && (
                              <span className="text-yellow-600">{pendingCount} pending</span>
                            )}
                            <span>Admin: {firmAdmin?.name || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleFirmEdit(firm)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit firm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteFirm(firm.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete firm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* User Edit Modal */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                <button
                  onClick={handleUserModalClose}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                    Basic Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      defaultValue={editingUser.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={editingUser.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      defaultValue={editingUser.role}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="system-admin">System Admin</option>
                      <option value="firm-admin">Firm Admin</option>
                      <option value="lawyer">Lawyer</option>
                      <option value="intern">Intern</option>
                      <option value="client">Client</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
                    <select
                      defaultValue={editingUser.approvalStatus || 'approved'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Right Column - Subscription Info */}
                {['firm-admin', 'lawyer', 'intern'].includes(editingUser.role) && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                      Subscription Management
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Active</label>
                      <select
                        defaultValue={editingUser.subscriptionActive ? 'true' : 'false'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Category</label>
                      <select
                        defaultValue={editingUser.subscriptionCategory || 'Free'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Free">Free</option>
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                        <option value="Power">Power</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        defaultValue={editingUser.subscriptionStartDate ? 
                          editingUser.subscriptionStartDate.toISOString().split('T')[0] : ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="date"
                        defaultValue={editingUser.subscriptionExpiryDate ? 
                          editingUser.subscriptionExpiryDate.toISOString().split('T')[0] : ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={editingUser.subscriptionAmountPaid || 0}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Storage Allocated (MB)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <HardDrive className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          defaultValue={editingUser.cumulativeStorageAllocated || 0}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Current allocation: {formatStorage(editingUser.cumulativeStorageAllocated || 0)}
                      </p>
                    </div>
                    
                    {/* Subscription Summary */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="text-sm font-medium text-blue-800 mb-2">Current Subscription</h5>
                      <div className="grid grid-cols-2 gap-3 text-xs text-blue-700">
                        <div>
                          <span className="font-medium">Plan:</span> {editingUser.subscriptionCategory || 'Free'}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {editingUser.subscriptionActive ? 'Active' : 'Inactive'}
                        </div>
                        <div>
                          <span className="font-medium">Paid:</span> {formatCurrency(editingUser.subscriptionAmountPaid || 0)}
                        </div>
                        <div>
                          <span className="font-medium">Storage:</span> {formatStorage(editingUser.cumulativeStorageAllocated || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleUserModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUserUpdate({})}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminDashboard;