import React, { useState } from 'react';
import { 
  Settings, Users, Building, CheckCircle, XCircle, Clock, 
  Plus, Edit, Trash2, Search, Filter, UserCheck, Shield,
  AlertCircle, Eye, Mail, Phone
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

  const pendingUsers = users.filter(u => u.approvalStatus === 'pending');
  const activeUsers = users.filter(u => u.approvalStatus === 'approved');
  const rejectedUsers = users.filter(u => u.approvalStatus === 'rejected');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.approvalStatus === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus && user.id !== currentUser.id;
  });

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
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{activeUsers.length}</p>
                  </div>
                </div>
              </div>

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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
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
                          <span>{user.email}</span>
                        </div>
                        {user.firmId && (
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{firms.find(f => f.id === user.firmId)?.name || 'Unknown Firm'}</span>
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
                        onClick={() => console.log('Edit user', user.id)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
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
                          onClick={() => onDeleteFirm(firm.id)}
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
    </div>
  );
};

export default SystemAdminDashboard;