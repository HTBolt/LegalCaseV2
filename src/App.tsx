import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FirmDashboard from './components/FirmDashboard';
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
  mockBillingEntries
} from './data/mockData';
import { User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'case-details'>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

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

  // Filter data based on user role and permissions
  const getFilteredData = () => {
    if (!currentUser) return { cases: [], tasks: [], milestones: [] };

    switch (currentUser.role) {
      case 'lawyer':
        // Lawyers see all cases they're assigned to
        const lawyerCases = mockCases.filter(c => c.assignedLawyer.id === currentUser.id);
        const lawyerTasks = mockTasks.filter(t => 
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
        const internTasks = mockTasks.filter(t => 
          t.assignedTo.id === currentUser.id ||
          internCases.some(c => c.id === t.caseId)
        );
        const internMilestones = mockMilestones.filter(m => 
          internCases.some(c => c.id === m.caseId)
        );
        return { cases: internCases, tasks: internTasks, milestones: internMilestones };

      case 'admin':
      case 'firm-admin':
        // Admins and firm admins see everything
        return { cases: mockCases, tasks: mockTasks, milestones: mockMilestones };

      default:
        return { cases: [], tasks: [], milestones: [] };
    }
  };

  // If not logged in, show login form
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} users={mockUsers} />;
  }

  const { cases, tasks, milestones } = getFilteredData();
  const selectedCase = selectedCaseId ? cases.find(c => c.id === selectedCaseId) : null;
  const caseTimelineEvents = selectedCaseId ? mockTimelineEvents.filter(e => e.caseId === selectedCaseId) : [];
  const preEngagementEvents = selectedCaseId ? mockPreEngagementEvents.filter(e => e.caseId === selectedCaseId) : [];
  const caseDocuments = selectedCaseId ? mockDocuments.filter(d => d.caseId === selectedCaseId) : [];
  const caseNotes = selectedCaseId ? mockNotes.filter(n => n.caseId === selectedCaseId) : [];
  const caseBillingEntries = selectedCaseId ? mockBillingEntries.filter(b => b.caseId === selectedCaseId) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      {currentView === 'dashboard' && currentUser.role === 'firm-admin' && (
        <FirmDashboard
          cases={mockCases}
          tasks={mockTasks}
          users={mockUsers}
          lawyerPerformance={mockLawyerPerformance}
          firmInfo={mockLawFirm}
          currentUser={currentUser}
        />
      )}
      
      {currentView === 'dashboard' && currentUser.role !== 'firm-admin' && (
        <Dashboard
          cases={cases}
          tasks={tasks}
          milestones={milestones}
          currentUser={currentUser}
          onCaseSelect={handleCaseSelect}
        />
      )}
      
      {currentView === 'case-details' && selectedCase && (
        <CaseDetails
          caseData={selectedCase}
          timelineEvents={caseTimelineEvents}
          preEngagementEvents={preEngagementEvents}
          documents={caseDocuments}
          notes={caseNotes}
          billingEntries={caseBillingEntries}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;