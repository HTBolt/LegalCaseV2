import React, { useState } from 'react';
import { Calendar, Clock, Users, FileText, AlertTriangle, CheckCircle, UserCheck } from 'lucide-react';
import { Case, Task, Milestone, User } from '../types';
import CalendarView from './CalendarView';
import TaskList from './TaskList';
import CaseList from './CaseList';
import TaskCreationModal from './TaskCreationModal';

interface DashboardProps {
  cases: Case[];
  tasks: Task[];
  milestones: Milestone[];
  currentUser: User;
  onCaseSelect: (caseId: string) => void;
  onTaskCreate?: (taskData: Partial<Task>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit?: (task: Task) => void;
  users?: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  cases, 
  tasks, 
  milestones, 
  currentUser, 
  onCaseSelect,
  onTaskCreate,
  onTaskUpdate,
  onTaskEdit,
  users = []
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'tasks'>('overview');
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Filter out completed tasks from dashboard view
  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const myTasks = activeTasks.filter(task => task.assignedTo.id === currentUser.id);
  const otherTasks = activeTasks.filter(task => task.assignedTo.id !== currentUser.id);
  
  const urgentTasks = myTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 3 && task.status !== 'completed';
  });

  const activeCases = cases.filter(c => c.status === 'active');
  const upcomingHearings = milestones.filter(m => m.type === 'court-appearance' && m.status === 'upcoming');

  // Handle stat tile clicks
  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'active-cases':
        // Stay on overview but scroll to cases section
        setActiveTab('overview');
        setTimeout(() => {
          const casesSection = document.getElementById('cases-section');
          casesSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'urgent-tasks':
        // Switch to tasks tab and highlight urgent tasks
        setActiveTab('tasks');
        setTimeout(() => {
          const urgentSection = document.getElementById('urgent-tasks-section');
          urgentSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'upcoming-hearings':
        // Switch to calendar tab
        setActiveTab('calendar');
        break;
      case 'team-tasks':
        // Switch to tasks tab and highlight team tasks
        setActiveTab('tasks');
        setTimeout(() => {
          const teamSection = document.getElementById('team-tasks-section');
          teamSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'completed-tasks':
        // Switch to tasks tab
        setActiveTab('tasks');
        break;
      case 'total-users':
        // For admin - could navigate to user management (placeholder for now)
        console.log('Navigate to user management');
        break;
    }
  };

  const handleTaskCreate = (taskData: Partial<Task>) => {
    if (onTaskCreate) {
      onTaskCreate(taskData);
    }
    setShowTaskModal(false);
  };

  const getRoleSpecificStats = () => {
    const baseStats = [
      {
        title: 'Active Cases',
        value: activeCases.length,
        icon: FileText,
        color: 'bg-blue-500',
        clickAction: 'active-cases',
        description: 'View all active cases'
      },
      {
        title: 'Urgent Tasks',
        value: urgentTasks.length,
        icon: AlertTriangle,
        color: 'bg-red-500',
        clickAction: 'urgent-tasks',
        description: 'Tasks due within 3 days'
      },
      {
        title: 'Upcoming Hearings',
        value: upcomingHearings.length,
        icon: Calendar,
        color: 'bg-green-500',
        clickAction: 'upcoming-hearings',
        description: 'View calendar'
      }
    ];

    // Add role-specific stat
    if (currentUser.role === 'lawyer') {
      baseStats.push({
        title: 'Team Tasks',
        value: otherTasks.length,
        icon: Users,
        color: 'bg-purple-500',
        clickAction: 'team-tasks',
        description: 'View team assignments'
      });
    } else if (currentUser.role === 'intern') {
      baseStats.push({
        title: 'Completed Tasks',
        value: myTasks.filter(t => t.status === 'completed').length,
        icon: CheckCircle,
        color: 'bg-yellow-500',
        clickAction: 'completed-tasks',
        description: 'View task history'
      });
    } else if (currentUser.role === 'admin') {
      baseStats.push({
        title: 'Total Users',
        value: 3, // This would come from user management in real app
        icon: UserCheck,
        color: 'bg-indigo-500',
        clickAction: 'total-users',
        description: 'Manage users'
      });
    }

    return baseStats;
  };

  const stats = getRoleSpecificStats();

  const getDashboardTitle = () => {
    switch (currentUser.role) {
      case 'lawyer':
        return 'Lawyer Dashboard';
      case 'intern':
        return 'Intern Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{getDashboardTitle()}</h1>
              <p className="text-gray-600 text-sm sm:text-base">Welcome back, {currentUser.name}</p>
            </div>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
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
                onClick={() => setActiveTab('calendar')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'calendar' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'tasks' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tasks
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid - Now clickable */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <button
                  key={index}
                  onClick={() => handleStatClick(stat.clickAction)}
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
                  title={stat.description}
                >
                  <div className="flex items-center">
                    <div className={`${stat.color} p-2 sm:p-3 rounded-lg group-hover:scale-105 transition-transform duration-200`}>
                      <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate group-hover:text-blue-600 transition-colors">
                        {stat.title}
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-xs text-blue-600 font-medium">Click to view →</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Main Content Grid - Mobile optimized */}
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Calendar Preview */}
              <div className="lg:col-span-2">
                <CalendarView 
                  milestones={milestones} 
                  tasks={tasks} 
                  compact={true} 
                  onCaseSelect={onCaseSelect}
                />
              </div>

              {/* Recent Cases */}
              <div className="space-y-6" id="cases-section">
                <CaseList 
                  cases={activeCases.slice(0, 5)} 
                  onCaseSelect={onCaseSelect}
                  title={currentUser.role === 'intern' ? 'Supporting Cases' : 'Active Cases'}
                  compact={true}
                />
              </div>
            </div>

            {/* Tasks Section - Mobile optimized */}
            <div className="mt-6 sm:mt-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
              <div id="urgent-tasks-section">
                <TaskList 
                  tasks={tasks.filter(task => task.assignedTo.id === currentUser.id).slice(0, 10)}
                  title="My Tasks"
                  showAssignee={false}
                  onAddTask={() => setShowTaskModal(true)}
                  onTaskUpdate={onTaskUpdate}
                  onTaskEdit={onTaskEdit}
                  currentUser={currentUser}
                />
              </div>
              {currentUser.role !== 'intern' && (
                <div id="team-tasks-section">
                  <TaskList 
                    tasks={tasks.filter(task => task.assignedTo.id !== currentUser.id).slice(0, 10)}
                    title="Team Tasks"
                    showAssignee={true}
                    onAddTask={() => setShowTaskModal(true)}
                    onTaskUpdate={onTaskUpdate}
                    onTaskEdit={onTaskEdit}
                    currentUser={currentUser}
                  />
                </div>
              )}
              {currentUser.role === 'intern' && (
                <TaskList 
                  tasks={tasks.filter(t => t.assignedBy.id !== currentUser.id).slice(0, 10)}
                  title="All Case Tasks"
                  showAssignee={true}
                  onAddTask={() => setShowTaskModal(true)}
                  onTaskUpdate={onTaskUpdate}
                  onTaskEdit={onTaskEdit}
                  currentUser={currentUser}
                />
              )}
            </div>
          </>
        )}

        {activeTab === 'calendar' && (
          <CalendarView 
            milestones={milestones} 
            tasks={tasks} 
            compact={false} 
            onCaseSelect={onCaseSelect}
          />
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            <div id="my-tasks-section">
              <TaskList 
                tasks={tasks.filter(task => task.assignedTo.id === currentUser.id)}
                title="My Tasks"
                showAssignee={false}
                onAddTask={() => setShowTaskModal(true)}
                onTaskUpdate={onTaskUpdate}
                onTaskEdit={onTaskEdit}
                currentUser={currentUser}
              />
            </div>
            {currentUser.role !== 'intern' && (
              <div id="team-tasks-section">
                <TaskList 
                  tasks={tasks.filter(task => task.assignedTo.id !== currentUser.id)}
                  title="Team Tasks"
                  showAssignee={true}
                  onAddTask={() => setShowTaskModal(true)}
                  onTaskUpdate={onTaskUpdate}
                  onTaskEdit={onTaskEdit}
                  currentUser={currentUser}
                />
              </div>
            )}
            {currentUser.role === 'intern' && (
              <TaskList 
                tasks={tasks.filter(t => t.assignedBy.id !== currentUser.id)}
                title="All Case Tasks"
                showAssignee={true}
                onAddTask={() => setShowTaskModal(true)}
                onTaskUpdate={onTaskUpdate}
                onTaskEdit={onTaskEdit}
                currentUser={currentUser}
              />
            )}
          </div>
        )}
      </div>
      
      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleTaskCreate}
        currentUser={currentUser}
        cases={cases}
        users={users}
      />
    </div>
  );
};

export default Dashboard;