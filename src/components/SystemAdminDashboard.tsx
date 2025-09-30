import React, { useState } from 'react';
import { Settings, Users, Building, CheckCircle, XCircle, Clock, Plus, CreditCard as Edit, Trash2, Search, Filter, UserCheck, Shield, AlertCircle, Eye, Mail, Phone, Lock } from 'lucide-react';
import { User, LawFirm } from '../types';
import { systemConfig } from '../data/mockData';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  firms: LawFirm[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  firms,
  onUpdateUser,
  onApproveUser,
  onRejectUser
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    isDisabled: false,
    subscriptionActive: false,
    subscriptionCategory: 'Free' as 'Free' | 'Basic' | 'Premium' | 'Power',
    subscriptionStartDate: '',
    subscriptionExpiryDate: '',
    subscriptionAmountPaid: 0,
    cumulativeStorageAllocated: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: (user as any).phone || '',
        isDisabled: user.approvalStatus === 'disabled',
        subscriptionActive: user.subscriptionActive || false,
        subscriptionCategory: user.subscriptionCategory || 'Free',
        subscriptionStartDate: user.subscriptionStartDate ? 
          user.subscriptionStartDate.toISOString().split('T')[0] : '',
        subscriptionExpiryDate: user.subscriptionExpiryDate ? 
          user.subscriptionExpiryDate.toISOString().split('T')[0] : '',
        subscriptionAmountPaid: user.subscriptionAmountPaid || 0,
        cumulativeStorageAllocated: user.cumulativeStorageAllocated || 0
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updates: Partial<User> = {
        name: formData.name.trim(),
        ...(formData.phone && { phone: formData.phone.trim() }),
        approvalStatus: formData.isDisabled ? 'disabled' : user.approvalStatus === 'disabled' ? 'approved' : user.approvalStatus,
        // Only add subscription fields for legal professionals
        ...(user.role !== 'client' && user.role !== 'system-admin' && {
          subscriptionActive: formData.subscriptionActive,
          subscriptionCategory: formData.subscriptionCategory,
          subscriptionStartDate: formData.subscriptionStartDate ? new Date(formData.subscriptionStartDate) : undefined,
          subscriptionExpiryDate: formData.subscriptionExpiryDate ? new Date(formData.subscriptionExpiryDate) : undefined,
          subscriptionAmountPaid: formData.subscriptionAmountPaid,
          cumulativeStorageAllocated: formData.cumulativeStorageAllocated
        })
      };

      onUpdateUser(user.id, updates);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = () => {
    // In a real app, this would trigger a password reset email
    alert('Password reset email sent to user');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatStorage = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  const hasSubscriptionFields = user.role !== 'client' && user.role !== 'system-admin';
  const userFirm = user.firmId ? firms.find(f => f.id === user.firmId) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* User Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <UserCheck className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Role:</span>
              <span className="capitalize">{user.role.replace('-', ' ')}</span>
            </div>
            {userFirm && (
              <div className="flex items-center space-x-2 text-sm">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Firm:</span>
                <span>{userFirm.name}</span>
              </div>
            )}
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                Basic Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="disabled"
                  checked={formData.isDisabled}
                  onChange={(e) => setFormData({ ...formData, isDisabled: e.target.checked })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="disabled" className="text-sm font-medium text-gray-700">
                  Disable user access
                </label>
              </div>
            </div>

            {/* Subscription Fields */}
            {hasSubscriptionFields && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                  Subscription Management
                </h4>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="subscriptionActive"
                    checked={formData.subscriptionActive}
                    onChange={(e) => setFormData({ ...formData, subscriptionActive: e.target.checked })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="subscriptionActive" className="text-sm font-medium text-gray-700">
                    Subscription Active
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Category
                  </label>
                  <select
                    value={formData.subscriptionCategory}
                    onChange={(e) => setFormData({ ...formData, subscriptionCategory: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Free">Free</option>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Power">Power</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.subscriptionStartDate}
                      onChange={(e) => setFormData({ ...formData, subscriptionStartDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.subscriptionExpiryDate}
                      onChange={(e) => setFormData({ ...formData, subscriptionExpiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.subscriptionAmountPaid}
                      onChange={(e) => setFormData({ ...formData, subscriptionAmountPaid: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Allocated (MB)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cumulativeStorageAllocated}
                    onChange={(e) => setFormData({ ...formData, cumulativeStorageAllocated: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formatStorage(formData.cumulativeStorageAllocated)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Subscription Summary */}
          {hasSubscriptionFields && (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Subscription Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Status:</span>
                    <span className={`ml-2 font-medium ${formData.subscriptionActive ? 'text-green-700' : 'text-red-700'}`}>
                      {formData.subscriptionActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Plan:</span>
                    <span className="ml-2 font-medium text-blue-900">{formData.subscriptionCategory}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Paid:</span>
                    <span className="ml-2 font-medium text-blue-900">{formatCurrency(formData.subscriptionAmountPaid)}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Storage:</span>
                    <span className="ml-2 font-medium text-blue-900">{formatStorage(formData.cumulativeStorageAllocated)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Reset */}
          <div className="border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleResetPassword}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <Lock className="h-4 w-4" />
              <span>Send Password Reset Email</span>
            </button>
          </div>

          {/* Approval Actions */}
          {user.approvalStatus === 'pending' && (
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">User Approval</p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    onApproveUser(user.id);
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve User</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRejectUser(user.id);
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject User</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SystemAdminDashboardProps {
  users: User[];
  firms: LawFirm[];
  currentUser: User;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: User['role']) => void;
  onDeleteUser: (userId: string) => void;
  onCreateFirm: (firmData: Partial<LawFirm>) => void;
  onUpdateFirm: (firmId: string, firmData: Partial<LawFirm>) => void;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'firms' | 'approvals'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [firmFilter, setFirmFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    firmName: '',
    autoApprove: false
  });
  const [showFirmDropdown, setShowFirmDropdown] = useState(false);
  const [filteredFirms, setFilteredFirms] = useState<LawFirm[]>([]);

  const pendingUsers = users.filter(u => u.approvalStatus === 'pending');
  const lawyers = users.filter(u => u.role === 'lawyer' || u.role === 'firm-admin');
  const rejectedUsers = users.filter(u => u.approvalStatus === 'rejected');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.approvalStatus === statusFilter;
    const matchesFirm = firmFilter === 'all' || user.firmId === firmFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesFirm && user.id !== currentUser.id;
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
    setShowEditModal(false);
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    onUpdateUserRole(userId, updates.role || users.find(u => u.id === userId)?.role || 'client');
    // In a real app, this would be a more comprehensive update function
    console.log('Updating user:', userId, updates);
  };

  const handleFirmInputChange = (value: string) => {
    setNewUserForm({ ...newUserForm, firmName: value });
    
    if (value.length >= 3) {
      const filtered = firms.filter(firm => 
        firm.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFirms(filtered);
      setShowFirmDropdown(true);
    } else {
      setShowFirmDropdown(false);
      setFilteredFirms([]);
    }
  };

  const handleFirmSelect = (firmName: string) => {
    setNewUserForm({ ...newUserForm, firmName });
    setShowFirmDropdown(false);
    setFilteredFirms([]);
  };

  const handleAddUserModalClose = () => {
    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: '',
      firmName: '',
      autoApprove: false
    });
    setShowFirmDropdown(false);
    setFilteredFirms([]);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'system-admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'lawyer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'firm-admin':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'intern':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'client':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'disabled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'firms', label: 'Law Firms', icon: Building },
    { id: 'approvals', label: 'Approvals', icon: Clock, badge: pendingUsers.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">System Administration</h1>
                <p className="text-gray-600 text-sm">Manage users, firms, and system settings</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2 inline" />
                    {tab.label}
                    {tab.badge && tab.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'overview' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-2 sm:p-3 rounded-lg">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{pendingUsers.length}</p>
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
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{firms.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 sm:p-3 rounded-lg">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 sm:p-3 rounded-lg">
                    <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Subscribers</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{lawyers.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {pendingUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name} requested {user.role} access
                          </p>
                          <p className="text-xs text-gray-600">
                            {user.firmId ? `to ${firms.find(f => f.id === user.firmId)?.name}` : 'New firm creation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onApproveUser(user.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRejectUser(user.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No pending approvals</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Add New User"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>

                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="lawyer">Lawyers</option>
                  <option value="firm-admin">Firm Admins</option>
                  <option value="intern">Interns</option>
                  <option value="client">Clients</option>
                </select>

                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="disabled">Disabled</option>
                </select>

                <select 
                  value={firmFilter}
                  onChange={(e) => setFirmFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Firms</option>
                  {firms.map((firm) => (
                    <option key={firm.id} value={firm.id}>
                      {firm.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.approvalStatus)}`}>
                          {user.approvalStatus || 'unknown'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.firmId && (
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span className="truncate">{firms.find(f => f.id === user.firmId)?.name || 'Unknown Firm'}</span>
                          </div>
                        )}
                        {user.createdAt && (
                          <div>
                            Joined: {user.createdAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {user.approvalStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => onApproveUser(user.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Approve user"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onRejectUser(user.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Reject user"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
                            onDeleteUser(user.id);
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No users found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'firms' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Law Firms Management</h3>
                <button
                  onClick={() => console.log('Add new firm')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Firm</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {firms.map((firm) => {
                const firmAdmin = users.find(u => u.id === firm.adminId);
                const firmMembers = users.filter(u => firm.members.includes(u.id));
                const pendingApprovals = users.filter(u => firm.pendingApprovals.includes(u.id));
                
                return (
                  <div key={firm.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <h4 className="text-lg font-medium text-gray-900">{firm.name}</h4>
                          {pendingApprovals.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {pendingApprovals.length} pending
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Admin:</span> {firmAdmin?.name || 'Unknown'}
                          </div>
                          <div>
                            <span className="font-medium">Members:</span> {firmMembers.length}
                          </div>
                          <div>
                            <span className="font-medium">Founded:</span> {firm.foundedYear || 'Unknown'}
                          </div>
                          <div className="sm:col-span-2 lg:col-span-3">
                            <span className="font-medium">Address:</span> {firm.address}
                          </div>
                        </div>

                        {pendingApprovals.length > 0 && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm font-medium text-yellow-800 mb-2">Pending Approvals:</p>
                            <div className="space-y-2">
                              {pendingApprovals.map(user => (
                                <div key={user.id} className="flex items-center justify-between text-sm">
                                  <span>{user.name} ({user.role})</span>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => onApproveUser(user.id)}
                                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                                      title="Approve"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => onRejectUser(user.id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                      title="Reject"
                                    >
                                      <XCircle className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => console.log('Edit firm', firm.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Edit firm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${firm.name}? This will affect all associated users.`)) {
                              onDeleteFirm(firm.id);
                            }
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
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

        {activeTab === 'approvals' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
              <p className="text-sm text-gray-600 mt-1">{pendingUsers.length} users awaiting approval</p>
            </div>

            <div className="divide-y divide-gray-200">
              {pendingUsers.map((user) => {
                const firm = user.firmId ? firms.find(f => f.id === user.firmId) : null;
                
                return (
                  <div key={user.id} className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          {firm && (
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>Requesting access to {firm.name}</span>
                            </div>
                          )}
                          {user.createdAt && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Submitted {user.createdAt.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        <button
                          onClick={() => onApproveUser(user.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onRejectUser(user.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {pendingUsers.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-500">No pending approvals</p>
                  <p className="text-sm text-gray-400 mt-1">All users have been processed</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Edit User Modal */}
      <EditUserModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        user={editingUser}
        firms={firms}
        onUpdateUser={handleUpdateUser}
        onApproveUser={onApproveUser}
        onRejectUser={onRejectUser}
      />
      
      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                </div>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter user's full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="user@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select 
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="firm-admin">Firm Admin</option>
                    <option value="intern">Intern</option>
                    <option value="client">Client</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Law Firm
                  </label>
                  <input
                    type="text"
                    value={newUserForm.firmName}
                    onChange={(e) => handleFirmInputChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type to search for existing firms..."
                  />
                  {showFirmDropdown && filteredFirms.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredFirms.map((firm) => (
                        <button
                          key={firm.id}
                          type="button"
                          onClick={() => handleFirmSelect(firm.name)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          {firm.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="autoApprove"
                    checked={newUserForm.autoApprove}
                    onChange={(e) => setNewUserForm({ ...newUserForm, autoApprove: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="autoApprove" className="text-sm font-medium text-gray-700">
                    Auto-approve user (skip approval process)
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleAddUserModalClose}
                    className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminDashboard;