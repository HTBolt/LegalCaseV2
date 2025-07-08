import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FirmDashboard from './components/FirmDashboard';
import ClientDashboard from './components/ClientDashboard';
import CaseDetails from './components/CaseDetails';
import { 
  mockUsers, 
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
import { User, Task, Case, TimelineEvent, Document, BillingEntry } from './types';
import CaseFormModal from './components/CaseFormModal';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'case-details'>('dashboard');
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
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedCaseId(null);
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView('case-details');
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

  // Filter data based on user role and permissions
  const getFilteredData = () => {
    if (!currentUser) return { cases: [], tasks: [], milestones: [] };

    switch (currentUser.role) {
      case 'lawyer':
        // Lawyers see all cases they're assigned to
        const lawyerCases = cases.filter(c => c.assignedLawyer.id === currentUser.id);
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
          t.assignedTo.id === currentUser.id && t.isClientVisible
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
    return <LoginForm onLogin={handleLogin} users={mockUsers} />;
  }

  console.log('=== APP: Rendering with showTaskModal:', showTaskModal, 'editingTask:', editingTask?.id);

  const { cases: filteredCases, tasks: filteredTasks, milestones } = getFilteredData();
  const selectedCase = selectedCaseId ? filteredCases.find(c => c.id === selectedCaseId) : null;
  const caseTimelineEvents = selectedCaseId ? timelineEvents.filter(e => e.caseId === selectedCaseId) : [];
  const casePreEngagementEvents = selectedCaseId ? preEngagementEvents.filter(e => e.caseId === selectedCaseId) : [];
  const caseDocuments = selectedCaseId ? documents.filter(d => d.caseId === selectedCaseId) : [];
  const caseNotes = selectedCaseId ? mockNotes.filter(n => n.caseId === selectedCaseId) : [];
  const caseBillingEntries = selectedCaseId ? billingEntries.filter(b => b.caseId === selectedCaseId) : [];
  const caseTasks = selectedCaseId ? filteredTasks.filter(t => t.caseId === selectedCaseId) : [];

  // Client-specific data
  const clientCase = currentUser.role === 'client' ? filteredCases[0] : null;
  const clientInvoices = currentUser.role === 'client' && clientCase ? 
    mockClientInvoices.filter(i => i.caseId === clientCase.id) : [];
  const clientMeetingRequests = currentUser.role === 'client' && clientCase ? 
    mockMeetingRequests.filter(m => m.caseId === clientCase.id) : [];
  const clientDocuments = currentUser.role === 'client' && clientCase ? 
    documents.filter(d => d.caseId === clientCase.id && d.isClientVisible) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      {/* Client Dashboard */}
      {currentUser.role === 'client' && clientCase && (
        <ClientDashboard
          clientCase={clientCase}
          clientTasks={filteredTasks}
          milestones={milestones}
          timelineEvents={caseTimelineEvents}
          preEngagementEvents={casePreEngagementEvents}
          documents={clientDocuments}
          invoices={clientInvoices}
          meetingRequests={clientMeetingRequests}
          currentUser={currentUser}
        />
      )}
      
      {/* Firm Admin Dashboard */}
      {currentView === 'dashboard' && currentUser.role === 'firm-admin' && (
        <FirmDashboard
          cases={cases}
          tasks={tasks}
          users={mockUsers}
          lawyerPerformance={mockLawyerPerformance}
          firmInfo={mockLawFirm}
          currentUser={currentUser}
          onCaseCreate={handleCaseCreate}
          onCaseEdit={handleCaseEdit}
        />
      )}
      
      {/* Regular User Dashboard */}
      {currentView === 'dashboard' && currentUser.role !== 'firm-admin' && currentUser.role !== 'client' && (
        <Dashboard
          cases={filteredCases}
          tasks={filteredTasks}
          milestones={milestones}
          currentUser={currentUser}
          onCaseSelect={handleCaseSelect}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleTaskEdit}
          users={mockUsers}
          editingTask={editingTask}
          showTaskModal={showTaskModal}
          onTaskModalClose={handleTaskModalClose}
        />
      )}
      
      {/* Case Details */}
      {currentView === 'case-details' && selectedCase && currentUser.role !== 'client' && (
        <CaseDetails
          caseData={selectedCase}
          timelineEvents={caseTimelineEvents}
          preEngagementEvents={casePreEngagementEvents}
          documents={caseDocuments}
          notes={caseNotes}
          billingEntries={caseBillingEntries}
          caseTasks={caseTasks}
          onBack={handleBackToDashboard}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleTaskEdit}
          currentUser={currentUser}
          users={mockUsers}
          editingTask={editingTask}
          showTaskModal={showTaskModal}
          onTaskModalClose={handleTaskModalClose}
          onTimelineEventCreate={handleTimelineEventCreate}
          onTimelineEventDelete={handleTimelineEventDelete}
          onDocumentUpload={handleDocumentUpload}
          onBillingEntryCreate={handleBillingEntryCreate}
        />
      )}
      
      {/* Case Creation/Editing Modal */}
      <CaseFormModal
        isOpen={showCaseModal}
        onClose={handleCaseModalClose}
        onSubmit={editingCase ? handleCaseUpdate : handleCaseCreate}
        currentUser={currentUser}
        users={mockUsers}
        clients={mockClients}
        editingCase={editingCase}
      />
    </div>
  );
}

export default App;