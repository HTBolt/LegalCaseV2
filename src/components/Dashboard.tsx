import React, { useState } from 'react';
import { Calendar, Clock, Users, FileText, AlertTriangle, CheckCircle, UserCheck } from 'lucide-react';
import { Case, Task, Milestone, User } from '../types';
import CalendarView from './CalendarView';
import TaskList from './TaskList';
import CaseList from './CaseList';

interface DashboardProps {
  cases: Case[];
  tasks: Task[];
  milestones: Milestone[];
  currentUser: User;
  onCaseSelect: (caseId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  cases, 
  tasks, 
  milestones, 
  currentUser, 
  onCaseSelect 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'tasks'>('overview');

  const myTasks = tasks.filter(task => task.assignedTo.id === currentUser.id);
  const otherTasks = tasks.filter(task => task.assignedTo.id !== currentUser.id);
  
  const urgentTasks = myTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 3 && task.status !== 'completed';
  });

  const getRoleSpecificStats = () => {
    const baseStats = [
      {
        title: 'Active Cases',
        value: cases.filter(c => c.status === 'active').length,
        icon: FileText,
        color: 'bg-blue-500'
      },
      {
        title: 'Urgent Tasks',
        value: urgentTasks.length,
        icon: AlertTriangle,
        color: 'bg-red-500'
      },
      {
        title: 'Upcoming Hearings',
        value: milestones.filter(m => m.type === 'court-appearance' && m.status === 'upcoming').length,
        icon: Calendar,
        color: 'bg-green-500'
      }
    ];

    // Add role-specific stat
    if (currentUser.role === 'lawyer') {
      baseStats.push({
        title: 'Team Tasks',
        value: otherTasks.length,
        icon: Users,
        color: 'bg-purple-500'
      });
    } else if (currentUser.role === 'intern') {
      baseStats.push({
        title: 'Completed Tasks',
        value: myTasks.filter(t => t.status === 'completed').length,
        icon: CheckCircle,
        color: 'bg-yellow-500'
      });
    } else if (currentUser.role === 'admin') {
      baseStats.push({
        title: 'Total Users',
        value: 3, // This would come from user management in real app
        icon: UserCheck,
        color: 'bg-indigo-500'
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
            {/* Stats Grid - Mobile optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                      <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid - Mobile optimized */}
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Calendar Preview */}
              <div className="lg:col-span-2">
                <CalendarView milestones={milestones} compact={true} />
              </div>

              {/* Recent Cases */}
              <div className="space-y-6">
                <CaseList 
                  cases={cases.slice(0, 5)} 
                  onCaseSelect={onCaseSelect}
                  title={currentUser.role === 'intern' ? 'Supporting Cases' : 'Recent Cases'}
                  compact={true}
                />
              </div>
            </div>

            {/* Tasks Section - Mobile optimized */}
            <div className="mt-6 sm:mt-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
              <TaskList 
                tasks={myTasks.slice(0, 10)}
                title="My Tasks"
                showAssignee={false}
              />
              {currentUser.role !== 'intern' && (
                <TaskList 
                  tasks={otherTasks.slice(0, 10)}
                  title="Team Tasks"
                  showAssignee={true}
                />
              )}
              {currentUser.role === 'intern' && (
                <TaskList 
                  tasks={tasks.filter(t => t.assignedBy.id !== currentUser.id).slice(0, 10)}
                  title="All Case Tasks"
                  showAssignee={true}
                />
              )}
            </div>
          </>
        )}

        {activeTab === 'calendar' && (
          <CalendarView milestones={milestones} compact={false} />
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            <TaskList 
              tasks={myTasks}
              title="My Tasks"
              showAssignee={false}
            />
            {currentUser.role !== 'intern' && (
              <TaskList 
                tasks={otherTasks}
                title="Team Tasks"
                showAssignee={true}
              />
            )}
            {currentUser.role === 'intern' && (
              <TaskList 
                tasks={tasks.filter(t => t.assignedBy.id !== currentUser.id)}
                title="All Case Tasks"
                showAssignee={true}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;