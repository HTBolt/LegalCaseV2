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