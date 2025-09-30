import React, { useState } from 'react';
import { Clock, User, AlertTriangle, CheckCircle, FileText, Search, Calendar, MapPin, Plus, Eye, Edit, RotateCcw, X } from 'lucide-react';
import { Task, User as UserType } from '../types';

interface TaskListProps {
  tasks: Task[];
  title: string;
  showAssignee?: boolean;
  onAddTask?: () => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit?: (task: Task) => void;
  currentUser?: UserType;
}

export interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onComplete?: (taskId: string) => void;
  onReopen?: (taskId: string) => void;
  currentUser?: UserType;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onComplete,
  onReopen,
  currentUser
}) => {
  if (!isOpen || !task) return null;

  const canModifyTask = currentUser && (
    currentUser.id === task.assignedTo.id || 
    currentUser.id === task.assignedBy.id ||
    currentUser.role === 'firm-admin'
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'filing':
        return <FileText className="h-5 w-5" />;
      case 'research':
        return <Search className="h-5 w-5" />;
      case 'court':
        return <Calendar className="h-5 w-5" />;
      case 'meeting':
        return <MapPin className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getPriorityColor(task.priority).split(' ')[0]} ${getPriorityColor(task.priority).split(' ')[1]}`}>
                {getTaskIcon(task.type)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority} priority
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned To</h4>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">{task.assignedTo.name}</span>
                <span className="text-xs text-gray-500">({task.assignedTo.role})</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Created By</h4>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">{task.assignedBy.name}</span>
                <span className="text-xs text-gray-500">({task.assignedBy.role})</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Due Date</h4>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">{formatDate(task.dueDate)}</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Created</h4>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">{task.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Completion Date */}
          {task.status === 'completed' && (task as any).completedAt && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Completed</h4>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-900">{formatDate((task as any).completedAt)}</span>
              </div>
            </div>
          )}

          {/* Client Visibility */}
          {task.isClientVisible && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Visible to Client</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {canModifyTask && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Task</span>
                </button>
              )}
              
              {task.status !== 'completed' && onComplete && (
                <button
                  onClick={() => onComplete(task.id)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark Complete</span>
                </button>
              )}
              
              {task.status === 'completed' && onReopen && (
                <button
                  onClick={() => onReopen(task.id)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reopen Task</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskList: React.FC<TaskListProps> = ({ 
  tasks = [], 
  title, 
  showAssignee = false, 
  onAddTask,
  onTaskUpdate,
  onTaskEdit,
  currentUser
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Separate completed and active tasks
  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const sortedActiveTasks = [...activeTasks].sort((a, b) => {
    // Sort by priority first, then by due date
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const sortedCompletedTasks = [...completedTasks].sort((a, b) => {
    // Sort completed tasks by completion date (most recent first)
    const aCompleted = (a as any).completedAt || a.dueDate;
    const bCompleted = (b as any).completedAt || b.dueDate;
    return new Date(bCompleted).getTime() - new Date(aCompleted).getTime();
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

  const canModifyTask = (task: Task) => {
    return currentUser && (
      currentUser.id === task.assignedTo.id || 
      currentUser.id === task.assignedBy.id ||
      currentUser.role === 'firm-admin'
    );
  };

  const handleTaskComplete = (taskId: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { 
        status: 'completed',
        completedAt: new Date()
      } as any);
    }
    setShowModal(false);
  };

  const handleTaskReopen = (taskId: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { 
        status: 'pending',
        completedAt: undefined
      } as any);
    }
    setShowModal(false);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    setShowModal(false);
    if (onTaskEdit) {
      onTaskEdit(task);
    }
  };

  const renderTaskItem = (task: Task, isCompleted = false) => {
    const daysUntil = getDaysUntilDue(task.dueDate);
    const isOverdue = daysUntil < 0 && task.status !== 'completed';
    const isUrgent = daysUntil <= 3 && daysUntil >= 0 && task.status !== 'completed';
    
    return (
      <div
        key={task.id}
        className={`p-3 sm:p-4 rounded-lg border ${
          isCompleted ? 'border-gray-200 bg-gray-50' :
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
              <h4 className={`text-sm font-medium truncate flex-1 ${isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>
                {task.title}
              </h4>
              {(isOverdue || isUrgent) && !isCompleted && (
                <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${isOverdue ? 'text-red-500' : 'text-yellow-500'}`} />
              )}
            </div>
            
            <p className={`text-sm mb-3 line-clamp-2 ${isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
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
            
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span className={`truncate ${isOverdue && !isCompleted ? 'text-red-600 font-medium' : isUrgent && !isCompleted ? 'text-yellow-600 font-medium' : ''}`}>
                  {isCompleted ? `Completed ${task.status === 'completed' && (task as any).completedAt ? (task as any).completedAt.toLocaleDateString() : ''}` : formatDueDate(task.dueDate)}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleViewTask(task)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                
                {canModifyTask(task) && onTaskEdit && (
                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit task"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                
                {canModifyTask(task) && onTaskUpdate && (
                  <>
                    {task.status !== 'completed' ? (
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Mark as completed"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleTaskReopen(task.id)}
                        className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Reopen task"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <span className="text-sm text-gray-500">
                {activeTasks.length} active{activeTasks.length !== 1 ? '' : ''} 
                {completedTasks.length > 0 && `, ${completedTasks.length} completed`}
              </span>
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
          
          {/* Active Tasks */}
          {sortedActiveTasks.length === 0 && completedTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No tasks available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Tasks Section */}
              {sortedActiveTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Active Tasks ({sortedActiveTasks.length})
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sortedActiveTasks.map((task) => renderTaskItem(task, false))}
                  </div>
                </div>
              )}
              
              {/* Completed Tasks Section */}
              {completedTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Completed Tasks ({completedTasks.length})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {sortedCompletedTasks.map((task) => renderTaskItem(task, true))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onEdit={handleEditTask}
        onComplete={handleTaskComplete}
        onReopen={handleTaskReopen}
        currentUser={currentUser}
      />
    </>
  );
};

export default TaskList;