import React, { useState } from 'react';
import { 
  Users, CheckCircle, XCircle, Clock, Plus, Edit, Trash2, 
  Mail, User, Building, AlertCircle, Crown, UserCheck
} from 'lucide-react';
import { User as UserType, LawFirm } from '../types';

interface FirmManagementProps {
  currentFirm: LawFirm;
  users: UserType[];
  currentUser: UserType;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: UserType['role']) => void;
  onRemoveUser: (userId: string) => void;
  onInviteUser: (email: string, role: UserType['role']) => void;
  onTransferAdminRole: (newAdminId: string) => void;
}

const FirmManagement: React.FC<FirmManagementProps> = ({
  currentFirm,
  users,
  currentUser,
  onApproveUser,
  onRejectUser,
  onUpdateUserRole,
  onRemoveUser,
  onInviteUser,
  onTransferAdminRole
}) => {
  const [activeSection, setActiveSection] = useState<'members' | 'pending' | 'invite'>('members');
  const [inviteData, setInviteData] = useState({ email: '', role: 'lawyer' as UserType['role'] });
  const [showTransferAdmin, setShowTransferAdmin] = useState(false);

  const firmMembers = users.filter(u => 
    currentFirm.members.includes(u.id) && u.approvalStatus === 'approved'
  );
  const pendingApprovals = users.filter(u => 
    currentFirm.pendingApprovals.includes(u.id) && u.approvalStatus === 'pending'
  );
  const eligibleForAdmin = firmMembers.filter(u => 
    u.role === 'lawyer' && u.id !== currentUser.id
  );

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteData.email.trim()) {
      onInviteUser(inviteData.email.trim(), inviteData.role);
      setInviteData({ email: '', role: 'lawyer' });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'firm-admin':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lawyer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intern':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canManageUser = (targetUser: UserType) => {
    // Firm admin can manage all users except other firm admins
    return currentUser.role === 'firm-admin' && targetUser.role !== 'firm-admin' && targetUser.id !== currentUser.id;
  };

  const sections = [
    { id: 'members', label: 'Team Members', count: firmMembers.length },
    { id: 'pending', label: 'Pending Approval', count: pendingApprovals.length },
    { id: 'invite', label: 'Invite User', count: null }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Firm Management</h3>
              <p className="text-sm text-gray-600">{currentFirm.name}</p>
            </div>
          </div>
          
          {currentUser.role === 'firm-admin' && eligibleForAdmin.length > 0 && (
            <button
              onClick={() => setShowTransferAdmin(true)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
            >
              <Crown className="h-4 w-4" />
              <span>Transfer Admin</span>
            </button>
          )}
        </div>
        
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                activeSection === section.id 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {section.label}
              {section.count !== null && section.count > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-1">
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Team Members */}
        {activeSection === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Team Members ({firmMembers.length})</h4>
            </div>
            
            {firmMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No team members yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {firmMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                            {member.role === 'firm-admin' ? 'Admin' : member.role}
                          </span>
                          {member.id === currentUser.id && (
                            <span className="text-xs text-blue-600 font-medium">(You)</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                        {member.lastLoginAt && (
                          <p className="text-xs text-gray-400">
                            Last active: {member.lastLoginAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {canManageUser(member) && (
                      <div className="flex items-center space-x-1 ml-3">
                        <select
                          value={member.role}
                          onChange={(e) => onUpdateUserRole(member.id, e.target.value as UserType['role'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="lawyer">Lawyer</option>
                          <option value="intern">Intern</option>
                        </select>
                        <button
                          onClick={() => onRemoveUser(member.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Remove from firm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Approvals */}
        {activeSection === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Pending Approvals ({pendingApprovals.length})</h4>
            </div>
            
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending approvals</p>
                <p className="text-sm text-gray-400 mt-1">All requests have been processed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((user) => (
                  <div key={user.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{user.email}</span>
                            </div>
                            {user.createdAt && (
                              <p>Applied: {user.createdAt.toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => onApproveUser(user.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onRejectUser(user.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Invite User */}
        {activeSection === 'invite' && currentUser.role === 'firm-admin' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Invite New Team Member</h4>
            
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as UserType['role'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lawyer">Lawyer</option>
                  <option value="intern">Legal Intern</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Invitation Process:</p>
                    <ul className="mt-1 space-y-1 text-sm">
                      <li>• User will receive an email invitation to join your firm</li>
                      <li>• They must create an account and request access</li>
                      <li>• You'll need to approve their request before they can access the system</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Invitation
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Transfer Admin Modal */}
      {showTransferAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Transfer Admin Role</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Select a lawyer to transfer the firm admin role to. This action cannot be undone.
              </p>
              
              <div className="space-y-3 mb-6">
                {eligibleForAdmin.map((lawyer) => (
                  <button
                    key={lawyer.id}
                    onClick={() => {
                      onTransferAdminRole(lawyer.id);
                      setShowTransferAdmin(false);
                    }}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{lawyer.name}</p>
                        <p className="text-sm text-gray-600">{lawyer.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTransferAdmin(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmManagement;