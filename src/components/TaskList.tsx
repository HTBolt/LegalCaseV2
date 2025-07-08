import React from 'react';
import { Clock, User, AlertTriangle, CheckCircle, FileText, Search, Calendar, MapPin, Plus } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  title: string;
  showAssignee?: boolean;
  onAddTask?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title, showAssignee = false, onAddTask }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by priority first, then by due date
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'filing':
        return <FileText className="h-4 w-4" />;
      case 'research':
        return <Search className="h-4 w-4" />;
      case 'court':
        return <Calendar className="h-4 w-4" />;
      case 'meeting':
        return <MapPin className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: Date) => {
    const daysUntil = getDaysUntilDue(dueDate);
    const dateStr = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (daysUntil < 0) {
      return `${dateStr} (${Math.abs(daysUntil)} days overdue)`;
    } else if (daysUntil === 0) {
      return `${dateStr} (Due today)`;
    } else if (daysUntil === 1) {
      return `${dateStr} (Due tomorrow)`;
    } else {
      return `${dateStr} (${daysUntil} days)`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
          </div>
          {onAddTask && (
            <button
              onClick={onAddTask}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
              title="Add new task"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          )}
        </div>
        
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No tasks available</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedTasks.map((task) => {
              const daysUntil = getDaysUntilDue(task.dueDate);
              const isOverdue = daysUntil < 0 && task.status !== 'completed';
              const isUrgent = daysUntil <= 3 && daysUntil >= 0 && task.status !== 'completed';
              
              return (
                <div
                  key={task.id}
                  className={`p-3 sm:p-4 rounded-lg border ${
                    isOverdue ? 'border-red-200 bg-red-50' : 
                    isUrgent ? 'border-yellow-200 bg-yellow-50' : 
                    'border-gray-200 bg-white'
                  } hover:shadow-sm transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`p-1 rounded ${getPriorityColor(task.priority)}`}>
                          {getTaskIcon(task.type)}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
                          {task.title}
                        </h4>
                        {(isOverdue || isUrgent) && (
                          <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${isOverdue ? 'text-red-500' : 'text-yellow-500'}`} />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTaskStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        {showAssignee && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            <span className="truncate">{task.assignedTo.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span className={`truncate ${isOverdue ? 'text-red-600 font-medium' : isUrgent ? 'text-yellow-600 font-medium' : ''}`}>
                          {formatDueDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;