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
  mockMeetingRequests
} from './data/mockData';
import { User, Task } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'case-details'>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [tasks, setTasks] = useState(mockTasks);

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
  };

  // Filter data based on user role and permissions
  const getFilteredData = () => {
    if (!currentUser) return { cases: [], tasks: [], milestones: [] };

    switch (currentUser.role) {
      case 'lawyer':
        // Lawyers see all cases they're assigned to
        const lawyerCases = mockCases.filter(c => c.assignedLawyer.id === currentUser.id);
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
        const internCases = mockCases.filter(c => 
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
        const clientCases = mockCases.filter(c => c.client.email === currentUser.email);
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
        return { cases: mockCases, tasks: tasks, milestones: mockMilestones };

      default:
        return { cases: [], tasks: [], milestones: [] };
    }
  };

  // If not logged in, show login form
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} users={mockUsers} />;
  }

  const { cases, tasks: filteredTasks, milestones } = getFilteredData();
  const selectedCase = selectedCaseId ? cases.find(c => c.id === selectedCaseId) : null;
  const caseTimelineEvents = selectedCaseId ? mockTimelineEvents.filter(e => e.caseId === selectedCaseId) : [];
  const preEngagementEvents = selectedCaseId ? mockPreEngagementEvents.filter(e => e.caseId === selectedCaseId) : [];
  const caseDocuments = selectedCaseId ? mockDocuments.filter(d => d.caseId === selectedCaseId) : [];
  const caseNotes = selectedCaseId ? mockNotes.filter(n => n.caseId === selectedCaseId) : [];
  const caseBillingEntries = selectedCaseId ? mockBillingEntries.filter(b => b.caseId === selectedCaseId) : [];
  const caseTasks = selectedCaseId ? filteredTasks.filter(t => t.caseId === selectedCaseId) : [];

  // Client-specific data
  const clientCase = currentUser.role === 'client' ? cases[0] : null;
  const clientInvoices = currentUser.role === 'client' && clientCase ? 
    mockClientInvoices.filter(i => i.caseId === clientCase.id) : [];
  const clientMeetingRequests = currentUser.role === 'client' && clientCase ? 
    mockMeetingRequests.filter(m => m.caseId === clientCase.id) : [];
  const clientDocuments = currentUser.role === 'client' && clientCase ? 
    mockDocuments.filter(d => d.caseId === clientCase.id && d.isClientVisible) : [];

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
          preEngagementEvents={preEngagementEvents}
          documents={clientDocuments}
          invoices={clientInvoices}
          meetingRequests={clientMeetingRequests}
          currentUser={currentUser}
        />
      )}
      
      {/* Firm Admin Dashboard */}
      {currentView === 'dashboard' && currentUser.role === 'firm-admin' && (
        <FirmDashboard
          cases={mockCases}
          tasks={tasks}
          users={mockUsers}
          lawyerPerformance={mockLawyerPerformance}
          firmInfo={mockLawFirm}
          currentUser={currentUser}
        />
      )}
      
      {/* Regular User Dashboard */}
      {currentView === 'dashboard' && currentUser.role !== 'firm-admin' && currentUser.role !== 'client' && (
        <Dashboard
          cases={cases}
          tasks={filteredTasks}
          milestones={milestones}
          currentUser={currentUser}
          onCaseSelect={handleCaseSelect}
          onTaskCreate={handleTaskCreate}
          users={mockUsers}
        />
      )}
      
      {/* Case Details */}
      {currentView === 'case-details' && selectedCase && currentUser.role !== 'client' && (
        <CaseDetails
          caseData={selectedCase}
          timelineEvents={caseTimelineEvents}
          preEngagementEvents={preEngagementEvents}
          documents={caseDocuments}
          notes={caseNotes}
          billingEntries={caseBillingEntries}
          caseTasks={caseTasks}
          onBack={handleBackToDashboard}
          onTaskCreate={handleTaskCreate}
          currentUser={currentUser}
          users={mockUsers}
        />
      )}
    </div>
  );
}

export default App;