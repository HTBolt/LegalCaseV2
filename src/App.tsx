import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import SystemAdminDashboard from './components/SystemAdminDashboard';
import FirmManagement from './components/FirmManagement';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FirmDashboard from './components/FirmDashboard';
import ClientDashboard from './components/ClientDashboard';
import ClientCaseDetails from './components/ClientCaseDetails';
import CaseDetails from './components/CaseDetails';
import { 
  mockUsers,
  mockLawFirms,
  mockCases, 
  mockTasks, 
  mockMilestones,
  mockTimelineEvents,
  mockPreEngagementEvents,
  mockDocuments,
  mockNotes,
  mockLawyerPerformance,
  mockLawFirm,
  mockBillingEntries,
  mockClientInvoices,
  mockMeetingRequests,
  mockClients
} from './data/mockData';
import { User, Task, Case, TimelineEvent, Document, BillingEntry, LawFirm, SignupData, AuthState } from './types';
import CaseFormModal from './components/CaseFormModal';
import { Clock } from 'lucide-react';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    currentUser: null,
    currentScreen: 'login',
    selectedFirm: undefined
  });
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [users, setUsers] = useState(mockUsers);
  const [firms, setFirms] = useState(mockLawFirms);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'case-details' | 'firm-dashboard' | 'firm-management' | 'client-case-details'>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [cases, setCases] = useState(mockCases);
  const [timelineEvents, setTimelineEvents] = useState(mockTimelineEvents);
  const [preEngagementEvents, setPreEngagementEvents] = useState(mockPreEngagementEvents);
  const [documents, setDocuments] = useState(mockDocuments);
  const [billingEntries, setBillingEntries] = useState(mockBillingEntries);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const handleLogin = (user: User) => {
    if (user.approvalStatus === 'pending') {
      setPendingUser(user);
      setAuthState(prev => ({ ...prev, currentScreen: 'pending-approval' }));
      return;
    }
    
    if (user.approvalStatus === 'rejected') {
      return; // Should be handled in AuthScreen
    }
    
    setCurrentUser(user);
    // Set initial view based on user role
    const initialView = user.role === 'client' ? 'dashboard' : 'dashboard';
    setCurrentView(initialView);
    setAuthState(prev => ({ ...prev, currentUser: user, currentScreen: 'dashboard' }));
  };

  const handleSignup = (signupData: SignupData) => {
    const newUserId = Date.now().toString();
    
    let newFirmId = signupData.firmId;
    
    // If creating a new firm, create it first
    if (signupData.role === 'lawyer' && signupData.newFirmName) {
      const newFirm: LawFirm = {
        id: Date.now().toString(),
        name: signupData.newFirmName,
        address: signupData.newFirmAddress || '',
        phone: signupData.newFirmPhone || '',
        email: signupData.newFirmEmail || signupData.email,
        adminId: newUserId,
        members: [newUserId],
        pendingApprovals: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setFirms(prev => [...prev, newFirm]);
      newFirmId = newFirm.id;
    }
    
    const newUser: User = {
      id: newUserId,
      name: signupData.name,
      email: signupData.email,
      role: signupData.role === 'lawyer' && signupData.newFirmName ? 'firm-admin' : signupData.role,
      firmId: newFirmId,
      approvalStatus: signupData.role === 'lawyer' && signupData.newFirmName ? 'approved' : 'pending',
      createdAt: new Date()
    };
    
    setUsers(prev => [...prev, newUser]);
    
    // If joining existing firm, add to pending approvals
    if (newFirmId && !signupData.newFirmName) {
      setFirms(prev => prev.map(firm => 
        firm.id === newFirmId 
          ? { ...firm, pendingApprovals: [...firm.pendingApprovals, newUserId] }
          : firm
      ));
    }
    
    setPendingUser(newUser);
    setAuthState(prev => ({ ...prev, currentScreen: 'pending-approval' }));
  };

  const handleScreenChange = (screen: AuthState['currentScreen']) => {
    setAuthState(prev => ({ ...prev, currentScreen: screen }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedCaseId(null);
    setAuthState(prev => ({ ...prev, currentUser: null, currentScreen: 'login' }));
    setPendingUser(null);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as 'dashboard' | 'case-details' | 'firm-dashboard' | 'firm-management' | 'client-case-details');
    // Reset case selection when changing views
    if (view !== 'case-details' && view !== 'client-case-details') {
      setSelectedCaseId(null);
    }
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    if (currentUser?.role === 'client') {
      setCurrentView('client-case-details');
    } else {
      setCurrentView('case-details');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCaseId(null);
  };

  const handleTaskCreate = (taskData: Partial<Task>) => {
    console.log('=== PARENT: handleTaskCreate called ===');
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title!,
      description: taskData.description!,
      caseId: taskData.caseId!,
      assignedTo: taskData.assignedTo!,
      assignedBy: taskData.assignedBy!,
      dueDate: taskData.dueDate!,
      priority: taskData.priority!,
      status: taskData.status!,
      type: taskData.type!,
      createdAt: taskData.createdAt!,
      isClientVisible: taskData.isClientVisible
    };
    
    setTasks(prev => [...prev, newTask]);
    console.log('=== PARENT: New task created, about to close modal ===');
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleTaskEdit = (task: Task) => {
    console.log('=== PARENT: handleTaskEdit called with task:', task.id);
    setEditingTask(task);
    setShowTaskModal(true);
    console.log('=== PARENT: setEditingTask and setShowTaskModal(true) called ===');
  };

  const handleTaskModalClose = () => {
    console.log('=== PARENT: handleTaskModalClose called ===');
    console.log('=== PARENT: Current showTaskModal state:', showTaskModal);
    setShowTaskModal(false);
    setEditingTask(null);
    console.log('=== PARENT: Set showTaskModal to false and cleared editingTask ===');
  };

  const handleCaseCreate = (caseData: Partial<Case>) => {
    const newCase: Case = {
      id: Date.now().toString(),
      title: caseData.title!,
      clientId: caseData.clientId!,
      client: caseData.client!,
      assignedLawyer: caseData.assignedLawyer!,
      supportingInterns: caseData.supportingInterns || [],
      caseType: caseData.caseType!,
      status: caseData.status || 'active',
      priority: caseData.priority || 'medium',
      nextHearingDate: caseData.nextHearingDate,
      courtStage: caseData.courtStage || 'Initial Filing',
      referredBy: caseData.referredBy!,
      judge: caseData.judge,
      opposingCounsel: caseData.opposingCounsel,
      createdAt: new Date(),
      updatedAt: new Date(),
      opposingCounselHistory: [],
      judgeHistory: []
    };
    
    setCases(prev => [...prev, newCase]);
  };

  const handleCaseUpdate = (caseData: Partial<Case>) => {
    setCases(prev => prev.map(case_ => 
      case_.id === caseData.id ? { ...case_, ...caseData, updatedAt: new Date() } : case_
    ));
  };

  const handleCaseEdit = (case_: Case) => {
    setEditingCase(case_);
    setShowCaseModal(true);
  };

  const handleCaseModalClose = () => {
    setShowCaseModal(false);
    setEditingCase(null);
  };

  const handleTimelineEventCreate = (eventData: Partial<TimelineEvent>) => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      caseId: eventData.caseId!,
      title: eventData.title!,
      description: eventData.description!,
      date: eventData.date!,
      type: eventData.type!,
      category: eventData.category!,
      url: eventData.url
    };
    
    if (eventData.type === 'case-event') {
      setTimelineEvents(prev => [...prev, newEvent]);
    } else {
      setPreEngagementEvents(prev => [...prev, newEvent]);
    }
  };

  const handleTimelineEventDelete = (eventId: string, eventType: 'timeline' | 'history') => {
    if (eventType === 'timeline') {
      setTimelineEvents(prev => prev.filter(event => event.id !== eventId));
    } else {
      setPreEngagementEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const handleDocumentUpload = (documentData: Partial<Document>) => {
    const newDocument: Document = {
      id: documentData.id!,
      caseId: documentData.caseId!,
      name: documentData.name!,
      type: documentData.type!,
      size: documentData.size!,
      uploadedBy: documentData.uploadedBy!,
      uploadedAt: documentData.uploadedAt!,
      url: documentData.url!,
      category: documentData.category!,
      isClientVisible: documentData.isClientVisible
    };
    
    setDocuments(prev => [...prev, newDocument]);
  };

  const handleBillingEntryCreate = (billingData: Partial<BillingEntry>) => {
    const newBillingEntry: BillingEntry = {
      id: billingData.id!,
      caseId: billingData.caseId!,
      date: billingData.date!,
      description: billingData.description!,
      lawyerHours: billingData.lawyerHours!,
      lawyerRate: billingData.lawyerRate!,
      internEntries: billingData.internEntries || [],
      totalHours: billingData.totalHours!,
      totalAmount: billingData.totalAmount!,
      dueDate: billingData.dueDate!,
      status: billingData.status!,
      invoiceNumber: billingData.invoiceNumber,
      paidDate: billingData.paidDate,
      notes: billingData.notes
    };
    
    setBillingEntries(prev => [...prev, newBillingEntry]);
  };

  // User management handlers
  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, approvalStatus: 'approved' } : user
    ));
    
    // If user is being approved to join a firm, add them to firm members
    const user = users.find(u => u.id === userId);
    if (user && user.firmId) {
      setFirms(prev => prev.map(firm => 
        firm.id === user.firmId 
          ? { 
              ...firm, 
              members: [...firm.members, userId],
              pendingApprovals: firm.pendingApprovals.filter(id => id !== userId)
            }
          : firm
      ));
    }
  };

  const handleRejectUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, approvalStatus: 'rejected' } : user
    ));
    
    // Remove from firm's pending approvals
    const user = users.find(u => u.id === userId);
    if (user && user.firmId) {
      setFirms(prev => prev.map(firm => 
        firm.id === user.firmId 
          ? { 
              ...firm, 
              pendingApprovals: firm.pendingApprovals.filter(id => id !== userId)
            }
          : firm
      ));
    }
  };

  const handleUpdateUserRole = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    
    // If promoting to firm-admin, update firm's adminId
    if (newRole === 'firm-admin') {
      const user = users.find(u => u.id === userId);
      if (user && user.firmId) {
        setFirms(prev => prev.map(firm => 
          firm.id === user.firmId ? { ...firm, adminId: userId } : firm
        ));
      }
    }
  };

  const handleDeleteUser = (userId: string) => {
    // Remove user from users array
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Remove user from all firms
    setFirms(prev => prev.map(firm => ({
      ...firm,
      members: firm.members.filter(id => id !== userId),
      pendingApprovals: firm.pendingApprovals.filter(id => id !== userId),
      adminId: firm.adminId === userId ? firm.members.find(id => id !== userId) || '' : firm.adminId
    })));
  };

  // Firm management handlers
  const handleCreateFirm = (firmData: Partial<LawFirm>) => {
    const newFirm: LawFirm = {
      id: Date.now().toString(),
      name: firmData.name!,
      address: firmData.address || '',
      phone: firmData.phone || '',
      email: firmData.email!,
      adminId: firmData.adminId!,
      members: [firmData.adminId!],
      pendingApprovals: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFirms(prev => [...prev, newFirm]);
  };

  const handleUpdateFirm = (firmId: string, updates: Partial<LawFirm>) => {
    setFirms(prev => prev.map(firm => 
      firm.id === firmId 
        ? { ...firm, ...updates, updatedAt: new Date() }
        : firm
    ));
  };

  const handleDeleteFirm = (firmId: string) => {
    // Remove firm
    setFirms(prev => prev.filter(firm => firm.id !== firmId));
    
    // Update users who belonged to this firm
    setUsers(prev => prev.map(user => 
      user.firmId === firmId 
        ? { ...user, firmId: undefined, approvalStatus: 'pending' }
        : user
    ));
  };

  const handleRemoveUserFromFirm = (userId: string, firmId: string) => {
    // Remove user from firm
    setFirms(prev => prev.map(firm => 
      firm.id === firmId 
        ? { 
            ...firm, 
            members: firm.members.filter(id => id !== userId),
            pendingApprovals: firm.pendingApprovals.filter(id => id !== userId)
          }
        : firm
    ));
    
    // Update user's firm association
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, firmId: undefined, approvalStatus: 'pending' }
        : user
    ));
  };

  const handleInviteUser = (email: string, role: User['role'], firmId: string) => {
    const newUserId = Date.now().toString();
    const newUser: User = {
      id: newUserId,
      name: `Invited ${role}`,
      email,
      role,
      firmId,
      approvalStatus: 'pending',
      createdAt: new Date()
    };
    
    setUsers(prev => [...prev, newUser]);
    
    // Add to firm's pending approvals
    setFirms(prev => prev.map(firm => 
      firm.id === firmId 
        ? { ...firm, pendingApprovals: [...firm.pendingApprovals, newUserId] }
        : firm
    ));
  };

  const handleTransferAdminRole = (currentAdminId: string, newAdminId: string, firmId: string) => {
    // Update firm's admin
    setFirms(prev => prev.map(firm => 
      firm.id === firmId ? { ...firm, adminId: newAdminId } : firm
    ));
    
    // Update user roles
    setUsers(prev => prev.map(user => {
      if (user.id === currentAdminId) {
        return { ...user, role: 'lawyer' };
      }
      if (user.id === newAdminId) {
        return { ...user, role: 'firm-admin' };
      }
      return user;
    }));
  };

  // Filter data based on user role and permissions
  const getFilteredData = () => {
    if (!currentUser) return { cases: [], tasks: [], milestones: [] };

    switch (currentUser.role) {
      case 'lawyer':
        // Lawyers see all cases they're assigned to
        const lawyerCases = cases.filter(c => c.assignedLawyer && c.assignedLawyer.id === currentUser.id);
        const lawyerTasks = tasks.filter(t => 
          t.assignedTo.id === currentUser.id || 
          t.assignedBy.id === currentUser.id ||
          lawyerCases.some(c => c.id === t.caseId)
        );
        const lawyerMilestones = mockMilestones.filter(m => 
          lawyerCases.some(c => c.id === m.caseId)
        );
        return { cases: lawyerCases, tasks: lawyerTasks, milestones: lawyerMilestones };

      case 'intern':
        // Interns see cases they're supporting and their assigned tasks
        const internCases = cases.filter(c => 
          c.supportingInterns.some(intern => intern.id === currentUser.id)
        );
        const internTasks = tasks.filter(t => 
          t.assignedTo.id === currentUser.id ||
          internCases.some(c => c.id === t.caseId)
        );
        const internMilestones = mockMilestones.filter(m => 
          internCases.some(c => c.id === m.caseId)
        );
        return { cases: internCases, tasks: internTasks, milestones: internMilestones };

      case 'client':
        // Clients see only their own case
        const clientCases = cases.filter(c => c.client.email === currentUser.email);
        const clientTasks = tasks.filter(t => 
          clientCases.some(c => c.id === t.caseId) && t.isClientVisible
        );
        const clientMilestones = mockMilestones.filter(m => 
          clientCases.some(c => c.id === m.caseId)
        );
        return { cases: clientCases, tasks: clientTasks, milestones: clientMilestones };

      case 'admin':
      case 'firm-admin':
        // Admins and firm admins see everything
        return { cases: cases, tasks: tasks, milestones: mockMilestones };

      default:
        return { cases: [], tasks: [], milestones: [] };
    }
  };

  // If not logged in, show login form
  if (!currentUser) {
    console.log('=== APP: No current user, showing login form ===');
    return (
      <AuthScreen
        currentScreen={authState.currentScreen}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onScreenChange={handleScreenChange}
        users={users}
        firms={firms}
        pendingUser={pendingUser}
      />
    );
  }

  console.log('=== APP: Rendering with showTaskModal:', showTaskModal, 'editingTask:', editingTask?.id);

  // System Admin Dashboard
  if (currentUser.role === 'system-admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        <SystemAdminDashboard
          users={users}
          firms={firms}
          currentUser={currentUser}
          onApproveUser={handleApproveUser}
          onRejectUser={handleRejectUser}
          onUpdateUserRole={handleUpdateUserRole}
          onDeleteUser={handleDeleteUser}
          onCreateFirm={handleCreateFirm}
          onUpdateFirm={handleUpdateFirm}
          onDeleteFirm={handleDeleteFirm}
        />
      </div>
    );
  }

  const { cases: filteredCases, tasks: filteredTasks, milestones } = getFilteredData();
  const selectedCase = selectedCaseId ? filteredCases.find(c => c.id === selectedCaseId) : null;
  const caseTimelineEvents = selectedCaseId ? timelineEvents.filter(e => e.caseId === selectedCaseId) : [];
  const casePreEngagementEvents = selectedCaseId ? preEngagementEvents.filter(e => e.caseId === selectedCaseId) : [];
  const caseDocuments = selectedCaseId ? documents.filter(d => d.caseId === selectedCaseId) : [];
  const caseNotes = selectedCaseId ? mockNotes.filter(n => n.caseId === selectedCaseId) : [];
  const caseBillingEntries = selectedCaseId ? billingEntries.filter(b => b.caseId === selectedCaseId) : [];
  const caseTasks = selectedCaseId ? filteredTasks.filter(t => t.caseId === selectedCaseId) : [];

  // Get current user's firm for firm management
  const currentFirm = currentUser.firmId ? firms.find(f => f.id === currentUser.firmId) : null;
  
  // Check if current user has firm admin privileges
  const isFirmAdmin = currentUser.role === 'firm-admin' || 
    (currentFirm && currentFirm.adminId === currentUser.id);
  
  // Check if user's approval status is still pending
  const isApproved = currentUser.approvalStatus === 'approved';
  
  // Client-specific data - now for multiple cases
  const clientInvoices = currentUser.role === 'client' ? 
    mockClientInvoices.filter(i => filteredCases.some(c => c.id === i.caseId)) : [];
  const clientMeetingRequests = currentUser.role === 'client' ? 
    mockMeetingRequests.filter(m => filteredCases.some(c => c.id === m.caseId)) : [];
  
  // For selected case details
  const selectedCaseInvoices = selectedCase ? 
    mockClientInvoices.filter(i => i.caseId === selectedCase.id) : [];
  const selectedCaseMeetingRequests = selectedCase ? 
    mockMeetingRequests.filter(m => m.caseId === selectedCase.id) : [];
  const selectedCaseDocuments = selectedCase ? 
    documents.filter(d => d.caseId === selectedCase.id && d.isClientVisible) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout}
      />
      
      {/* Approval Pending Message */}
      {!isApproved && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">
                Your account is pending approval. Limited functionality is available until approved.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Client Dashboard */}
      {currentUser.role === 'client' && isApproved && currentView === 'dashboard' && (
        <ClientDashboard
          clientCases={filteredCases}
          currentUser={currentUser}
          clientTasks={filteredTasks}
          milestones={milestones}
          invoices={clientInvoices}
          meetingRequests={clientMeetingRequests}
          firms={firms}
          onCaseSelect={handleCaseSelect}
        />
      )}
      
      {/* Client Case Details */}
      {currentUser.role === 'client' && isApproved && currentView === 'client-case-details' && selectedCase && (
        <ClientCaseDetails
          clientCase={selectedCase}
          currentUser={currentUser}
          clientTasks={caseTasks}
          milestones={milestones.filter(m => m.caseId === selectedCase.id)}
          timelineEvents={caseTimelineEvents}
          preEngagementEvents={casePreEngagementEvents}
          documents={selectedCaseDocuments}
          invoices={selectedCaseInvoices}
          meetingRequests={selectedCaseMeetingRequests}
          onBackToClientDashboard={handleBackToDashboard}
        />
      )}
      
      {/* Firm Admin Dashboard */}
      {currentView === 'dashboard' && isFirmAdmin && isApproved && (
        <Dashboard
          cases={filteredCases}
          tasks={filteredTasks}
          milestones={milestones}
          currentUser={currentUser}
          onCaseSelect={handleCaseSelect}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleTaskEdit}
          users={users}
          editingTask={editingTask}
          showTaskModal={showTaskModal}
          onTaskModalClose={handleTaskModalClose}
          onCaseCreate={handleCaseCreate}
          onCaseEdit={handleCaseEdit}
          onNewCaseClick={() => setShowCaseModal(true)}
          allCases={cases}
          allTasks={tasks}
          allUsers={users}
          lawyerPerformance={mockLawyerPerformance}
          firmInfo={currentFirm || mockLawFirm}
          onApproveUser={handleApproveUser}
          onRejectUser={handleRejectUser}
          onUpdateUserRole={handleUpdateUserRole}
          onRemoveUser={(userId) => handleRemoveUserFromFirm(userId, currentUser.firmId!)}
          onInviteUser={(email, role) => handleInviteUser(email, role, currentUser.firmId!)}
          onTransferAdminRole={(newAdminId) => handleTransferAdminRole(currentUser.id, newAdminId, currentUser.firmId!)}
          isFirmAdmin={isFirmAdmin}
        />
      )}
      
      {/* Regular User Dashboard */}
      {currentView === 'dashboard' && currentUser.role !== 'client' && !isFirmAdmin && isApproved && (
        <Dashboard
          cases={filteredCases}
          tasks={filteredTasks}
          milestones={milestones}
          currentUser={currentUser}
          onCaseSelect={handleCaseSelect}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleTaskEdit}
          users={users}
          editingTask={editingTask}
          showTaskModal={showTaskModal}
          onTaskModalClose={handleTaskModalClose}
          onCaseCreate={handleCaseCreate}
          onCaseEdit={handleCaseEdit}
          onNewCaseClick={() => setShowCaseModal(true)}
        />
      )}
      
      {/* Pending/Limited Access Dashboard */}
      {!isApproved && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Pending Approval</h2>
            <p className="text-gray-600 mb-6">
              Your account is awaiting approval from the firm administrator or system admin. 
              You'll receive an email notification once your access is approved.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Account Details:</h3>
              <div className="text-left space-y-1 text-sm text-yellow-700">
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> {currentUser.role}</p>
                {currentUser.firmId && (
                  <p><strong>Firm:</strong> {firms.find(f => f.id === currentUser.firmId)?.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Case Details */}
      {currentView === 'case-details' && selectedCase && currentUser.role !== 'client' && isApproved && (
        <CaseDetails
          caseData={selectedCase}
          timelineEvents={caseTimelineEvents}
          preEngagementEvents={casePreEngagementEvents}
          documents={caseDocuments}
          notes={caseNotes}
          billingEntries={caseBillingEntries}
          tasks={filteredTasks}
          milestones={milestones}
          currentUser={currentUser}
          onCaseSelect={handleCaseSelect}
          onBackToDashboard={handleBackToDashboard}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleTaskEdit}
          onTimelineEventCreate={handleTimelineEventCreate}
          onTimelineEventDelete={handleTimelineEventDelete}
          onDocumentUpload={handleDocumentUpload}
          onBillingEntryCreate={handleBillingEntryCreate}
          users={users}
          editingTask={editingTask}
          showTaskModal={showTaskModal}
          onTaskModalClose={handleTaskModalClose}
        />
      )}
      
      {/* Case Creation/Editing Modal */}
      {isApproved && (
        <CaseFormModal
          isOpen={showCaseModal}
          onClose={handleCaseModalClose}
          onSubmit={editingCase ? handleCaseUpdate : handleCaseCreate}
          currentUser={currentUser}
          users={users}
          clients={mockClients}
          editingCase={editingCase}
        />
      )}
    </div>
  );
}

export default App;