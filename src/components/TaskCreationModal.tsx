import React, { useState } from 'react';
import { 
  X, Calendar, Clock, User, FileText, AlertTriangle, 
  Scale, CheckSquare, Upload, Link, Plus, Trash2
} from 'lucide-react';
import { User as UserType, Case, Task } from '../types';

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
    priority: 'medium' as 'high' | 'medium' | 'low',
    taskType: 'generic' as 'court-appearance' | 'generic',
    caseId: '',
    genericCategory: '',
    assignedToId: currentUser.id,
    status: 'pending' as 'pending' | 'completed'
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const taskData: Partial<Task> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: new Date(`${formData.dueDate}T${formData.dueTime}`),
        priority: formData.priority,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Title */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.title ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter task title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, taskType: 'generic' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.taskType === 'generic'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckSquare className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Generic Task</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, taskType: 'court-appearance' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.taskType === 'court-appearance'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Scale className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Court Appearance</span>
                  </button>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : ''
                }`}
                placeholder="Provide detailed description of the task"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date and Time */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Start Date & Time (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.startDate ? 'border-red-300' : ''
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
              </div>

              {/* Due Date and Time */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Due Date & Time *
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.dueDate ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={formData.dueTime}
                      onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                      className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.dueTime ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.dueTime && <p className="mt-1 text-xs text-red-600">{errors.dueTime}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Case Association and Assignment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Case Association */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Association {formData.taskType === 'court-appearance' && '*'}
                </label>
                <select
                  value={formData.caseId}
                  onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.caseId ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a case (optional)</option>
                  {accessibleCases.map(case_ => (
                    <option key={case_.id} value={case_.id}>
                      {case_.title} - {case_.client.name}
                    </option>
                  ))}
                </select>
                {errors.caseId && <p className="mt-1 text-sm text-red-600">{errors.caseId}</p>}
              </div>

              {/* Generic Category (only if no case selected and generic task) */}
              {formData.taskType === 'generic' && !formData.caseId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generic Category *
                  </label>
                  <input
                    type="text"
                    value={formData.genericCategory}
                    onChange={(e) => setFormData({ ...formData, genericCategory: e.target.value })}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.genericCategory ? 'border-red-300' : ''
                    }`}
                    placeholder="e.g., Administrative, Research, Training"
                  />
                  {errors.genericCategory && <p className="mt-1 text-sm text-red-600">{errors.genericCategory}</p>}
                </div>
              )}

              {/* Assignee */}
              <div className={formData.taskType === 'generic' && !formData.caseId ? '' : 'lg:col-start-2'}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To *
                </label>
                <select
                  value={formData.assignedToId}
                  onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

            {/* Task Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Status
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'pending' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.status === 'pending'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Clock className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Pending</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'completed' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.status === 'completed'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CheckSquare className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Completed</span>
                </button>
              </div>
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                File Attachments
              </label>
              
              {/* Upload Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Upload PDF</span>
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
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Link className="h-4 w-4" />
                  <span>Add Link</span>
                </button>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="space-y-3">
                  {attachments.map((attachment, index) => (
                    <div key={attachment.id} className="p-3 border border-gray-200 rounded-lg">
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
                              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <input
                              type="url"
                              placeholder="https://..."
                              value={attachment.url || ''}
                              onChange={(e) => updateAttachment(attachment.id, { url: e.target.value })}
                              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}
                      {errors[`attachment_${index}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`attachment_${index}`]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Upload PDF files (max 10MB) or add links to files stored on Google Drive or other cloud storage.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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