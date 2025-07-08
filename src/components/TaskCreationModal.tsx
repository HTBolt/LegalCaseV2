import React, { useState } from 'react';
import { 
  X, Calendar, Clock, User, FileText, AlertTriangle, 
  Scale, CheckSquare, Upload, Link, Plus, Trash2
} from 'lucide-react';
import { User as UserType, Case, Task } from '../types';
import '../styles/common.css';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => void;
  currentUser: UserType;
  cases: Case[];
  users: UserType[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: 'file' | 'link';
  file?: File;
  url?: string;
  size?: number;
}

type PriorityLevel = 'on-hold' | 'low' | 'medium' | 'high' | 'urgent';

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  cases,
  users
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium' as PriorityLevel,
    taskType: 'generic' as 'court-appearance' | 'generic',
    caseId: '',
    genericCategory: '',
    assignedToId: currentUser.id,
    status: 'pending' as 'pending' | 'completed'
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Priority configuration
  const priorityOptions: { value: PriorityLevel; label: string; color: string }[] = [
    { value: 'on-hold', label: 'On Hold', color: '#6b7280' },
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'urgent', label: 'Urgent', color: '#7c2d12' }
  ];

  const getPriorityIndex = (priority: PriorityLevel): number => {
    return priorityOptions.findIndex(p => p.value === priority);
  };

  const getPriorityFromIndex = (index: number): PriorityLevel => {
    return priorityOptions[index]?.value || 'medium';
  };

  const getCurrentPriorityConfig = () => {
    return priorityOptions.find(p => p.value === formData.priority) || priorityOptions[2];
  };

  // Get users that current user can assign tasks to
  const getAssignableUsers = () => {
    const assignableUsers = [currentUser]; // Can always assign to self
    
    switch (currentUser.role) {
      case 'firm-admin':
        // Firm admin can assign to everyone
        return users;
      case 'lawyer':
        // Lawyers can assign to themselves, their interns, and clients
        return users.filter(user => 
          user.id === currentUser.id || 
          user.role === 'intern' || 
          user.role === 'client'
        );
      case 'intern':
        // Interns can assign to themselves and clients
        return users.filter(user => 
          user.id === currentUser.id || 
          user.role === 'client'
        );
      case 'client':
        // Clients can only assign to themselves
        return [currentUser];
      default:
        return assignableUsers;
    }
  };

  // Get cases accessible to current user
  const getAccessibleCases = () => {
    switch (currentUser.role) {
      case 'firm-admin':
        return cases;
      case 'lawyer':
        return cases.filter(c => c.assignedLawyer.id === currentUser.id);
      case 'intern':
        return cases.filter(c => 
          c.supportingInterns.some(intern => intern.id === currentUser.id)
        );
      case 'client':
        return cases.filter(c => c.client.email === currentUser.email);
      default:
        return [];
    }
  };

  const assignableUsers = getAssignableUsers();
  const accessibleCases = getAccessibleCases();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.dueTime) {
      newErrors.dueTime = 'Due time is required';
    }

    if (formData.startDate && formData.dueDate) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      
      if (startDateTime >= dueDateTime) {
        newErrors.startDate = 'Start date must be before due date';
      }
    }

    if (formData.taskType === 'court-appearance' && !formData.caseId) {
      newErrors.caseId = 'Case association is required for court appearances';
    }

    if (formData.taskType === 'generic' && !formData.caseId && !formData.genericCategory.trim()) {
      newErrors.genericCategory = 'Generic category is required when not associated with a case';
    }

    // Validate file attachments
    attachments.forEach((attachment, index) => {
      if (attachment.type === 'file' && attachment.file) {
        if (attachment.file.size > 10 * 1024 * 1024) { // 10MB
          newErrors[`attachment_${index}`] = 'File size must be less than 10MB';
        }
        if (attachment.file.type !== 'application/pdf') {
          newErrors[`attachment_${index}`] = 'Only PDF files are allowed';
        }
      }
      if (attachment.type === 'link' && attachment.url) {
        try {
          new URL(attachment.url);
        } catch {
          newErrors[`attachment_${index}`] = 'Please enter a valid URL';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert priority to the original format for compatibility
      const legacyPriority = formData.priority === 'urgent' ? 'high' : 
                           formData.priority === 'on-hold' ? 'low' : 
                           formData.priority as 'high' | 'medium' | 'low';

      const taskData: Partial<Task> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: new Date(`${formData.dueDate}T${formData.dueTime}`),
        priority: legacyPriority,
        status: formData.status,
        type: formData.taskType === 'court-appearance' ? 'court' : 'other',
        caseId: formData.caseId || undefined,
        assignedTo: assignableUsers.find(u => u.id === formData.assignedToId)!,
        assignedBy: currentUser,
        createdAt: new Date(),
        isClientVisible: formData.assignedToId !== currentUser.id && 
                        assignableUsers.find(u => u.id === formData.assignedToId)?.role === 'client'
      };

      // Add start date if provided
      if (formData.startDate && formData.startTime) {
        // Store start date in a custom field (would need to extend Task type in real app)
        (taskData as any).startDate = new Date(`${formData.startDate}T${formData.startTime}`);
      }

      // Add generic category if applicable
      if (formData.taskType === 'generic' && !formData.caseId && formData.genericCategory) {
        (taskData as any).genericCategory = formData.genericCategory.trim();
      }

      // Add attachments (in real app, these would be uploaded to storage)
      if (attachments.length > 0) {
        (taskData as any).attachments = attachments;
      }

      // Store the detailed priority for internal use
      (taskData as any).detailedPriority = formData.priority;

      await onSubmit(taskData);
      handleClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      dueDate: '',
      dueTime: '',
      priority: 'medium',
      taskType: 'generic',
      caseId: '',
      genericCategory: '',
      assignedToId: currentUser.id,
      status: 'pending'
    });
    setAttachments([]);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const newAttachment: FileAttachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'file',
        file,
        size: file.size
      };
      setAttachments(prev => [...prev, newAttachment]);
    });
    
    // Reset input
    e.target.value = '';
  };

  const addLinkAttachment = () => {
    const newAttachment: FileAttachment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: '',
      type: 'link',
      url: ''
    };
    setAttachments(prev => [...prev, newAttachment]);
  };

  const updateAttachment = (id: string, updates: Partial<FileAttachment>) => {
    setAttachments(prev => prev.map(att => 
      att.id === id ? { ...att, ...updates } : att
    ));
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
              <p className="text-sm text-gray-600">Add a new task or court appearance</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="responsive-grid-2">
              {/* Task Title */}
              <div className="lg:col-span-2">
                <div className="form-group">
                  <label className="form-label required">Task Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="Enter task title"
                  />
                  {errors.title && <p className="form-error">{errors.title}</p>}
                </div>
              </div>

              {/* Task Type */}
              <div>
                <div className="form-group">
                  <label className="form-label required">Task Type</label>
                  <div className="toggle-group grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, taskType: 'generic' })}
                      className={`toggle-button ${formData.taskType === 'generic' ? 'active' : ''}`}
                    >
                      <CheckSquare className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Generic Task</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, taskType: 'court-appearance' })}
                      className={`toggle-button ${formData.taskType === 'court-appearance' ? 'active' : ''}`}
                    >
                      <Scale className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Court Appearance</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Priority Slider */}
              <div>
                <div className="form-group">
                  <label className="form-label required">Priority</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        value={getPriorityIndex(formData.priority)}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          priority: getPriorityFromIndex(parseInt(e.target.value)) 
                        })}
                        className="priority-slider w-full h-2 appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, 
                            #6b7280 0%, #6b7280 20%, 
                            #10b981 20%, #10b981 40%, 
                            #f59e0b 40%, #f59e0b 60%, 
                            #ef4444 60%, #ef4444 80%, 
                            #7c2d12 80%, #7c2d12 100%)`
                        }}
                      />
                    </div>
                    <div className="priority-labels">
                      {priorityOptions.map((option, index) => (
                        <span 
                          key={option.value}
                          className={`priority-label ${formData.priority === option.value ? 'active' : ''}`}
                          style={{ 
                            color: formData.priority === option.value ? option.color : undefined 
                          }}
                        >
                          {option.label}
                        </span>
                      ))}
                    </div>
                    <div className="text-center">
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                        style={{ 
                          backgroundColor: getCurrentPriorityConfig().color + '20',
                          borderColor: getCurrentPriorityConfig().color + '40',
                          color: getCurrentPriorityConfig().color
                        }}
                      >
                        {getCurrentPriorityConfig().label} Priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label required">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Provide detailed description of the task"
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            {/* Date and Time */}
            <div className="responsive-grid-2">
              {/* Start Date and Time */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Start Date & Time (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`form-input ${errors.startDate ? 'error' : ''}`}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                {errors.startDate && <p className="form-error">{errors.startDate}</p>}
              </div>

              {/* Due Date and Time */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Due Date & Time *
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={`form-input ${errors.dueDate ? 'error' : ''}`}
                    />
                    {errors.dueDate && <p className="form-error">{errors.dueDate}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      value={formData.dueTime}
                      onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                      className={`form-input ${errors.dueTime ? 'error' : ''}`}
                    />
                    {errors.dueTime && <p className="form-error">{errors.dueTime}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Case Association and Assignment */}
            <div className="responsive-grid-2">
              {/* Case Association */}
              <div className="form-group">
                <label className="form-label">
                  Case Association {formData.taskType === 'court-appearance' && '*'}
                </label>
                <select
                  value={formData.caseId}
                  onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                  className={`form-select ${errors.caseId ? 'error' : ''}`}
                >
                  <option value="">Select a case (optional)</option>
                  {accessibleCases.map(case_ => (
                    <option key={case_.id} value={case_.id}>
                      {case_.title} - {case_.client.name}
                    </option>
                  ))}
                </select>
                {errors.caseId && <p className="form-error">{errors.caseId}</p>}
              </div>

              {/* Generic Category (only if no case selected and generic task) */}
              {formData.taskType === 'generic' && !formData.caseId && (
                <div className="form-group">
                  <label className="form-label required">Generic Category</label>
                  <input
                    type="text"
                    value={formData.genericCategory}
                    onChange={(e) => setFormData({ ...formData, genericCategory: e.target.value })}
                    className={`form-input ${errors.genericCategory ? 'error' : ''}`}
                    placeholder="e.g., Administrative, Research, Training"
                  />
                  {errors.genericCategory && <p className="form-error">{errors.genericCategory}</p>}
                </div>
              )}

              {/* Assignee */}
              <div className={formData.taskType === 'generic' && !formData.caseId ? '' : 'lg:col-start-2'}>
                <div className="form-group">
                  <label className="form-label required">Assign To</label>
                  <select
                    value={formData.assignedToId}
                    onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                    className="form-select"
                  >
                    {assignableUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                        {user.id === currentUser.id && ' - Me'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Task Status */}
            <div className="form-group">
              <label className="form-label">Task Status</label>
              <div className="toggle-group grid-cols-2 max-w-md">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'pending' })}
                  className={`toggle-button ${formData.status === 'pending' ? 'active' : ''}`}
                >
                  <Clock className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Pending</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'completed' })}
                  className={`toggle-button ${formData.status === 'completed' ? 'active' : ''}`}
                >
                  <CheckSquare className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Completed</span>
                </button>
              </div>
            </div>

            {/* File Attachments */}
            <div className="form-group">
              <label className="form-label">File Attachments</label>
              
              {/* Upload Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <label className="btn-primary cursor-pointer">
                  <Upload className="h-4 w-4 mr-2 inline" />
                  Upload PDF
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={addLinkAttachment}
                  className="btn-success"
                >
                  <Link className="h-4 w-4 mr-2 inline" />
                  Add Link
                </button>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="space-y-3">
                  {attachments.map((attachment, index) => (
                    <div key={attachment.id} className="attachment-item">
                      {attachment.type === 'file' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                              {attachment.size && (
                                <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Link className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium text-gray-900">Link Attachment</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(attachment.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Link name"
                              value={attachment.name}
                              onChange={(e) => updateAttachment(attachment.id, { name: e.target.value })}
                              className="form-input text-sm"
                            />
                            <input
                              type="url"
                              placeholder="https://..."
                              value={attachment.url || ''}
                              onChange={(e) => updateAttachment(attachment.id, { url: e.target.value })}
                              className="form-input text-sm"
                            />
                          </div>
                        </div>
                      )}
                      {errors[`attachment_${index}`] && (
                        <p className="form-error mt-1">{errors[`attachment_${index}`]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <p className="form-help mt-2">
                Upload PDF files (max 10MB) or add links to files stored on Google Drive or other cloud storage.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner h-4 w-4 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;