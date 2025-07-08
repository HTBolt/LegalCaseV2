import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Link } from 'lucide-react';
import { TimelineEvent } from '../types';
import '../styles/common.css';

interface TimelineEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Partial<TimelineEvent>) => void;
  caseId: string;
  eventType: 'timeline' | 'history';
  editingEvent?: TimelineEvent | null;
}

const TimelineEventModal: React.FC<TimelineEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  caseId,
  eventType,
  editingEvent = null
}) => {
  const isEditing = !!editingEvent;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        url: editingEvent.url || '',
        category: editingEvent.category,
        date: editingEvent.date.toISOString().split('T')[0]
      });
    } else {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        url: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [editingEvent]);

  const timelineCategories = [
    'Filing',
    'Procedural',
    'Discovery',
    'Motion',
    'Hearing',
    'Settlement',
    'Judgment',
    'Appeal',
    'Other'
  ];

  const historyCategories = [
    'Patent Filing',
    'Patent Grant',
    'Discovery',
    'Correspondence',
    'Negotiation',
    'Incident',
    'Medical',
    'Insurance',
    'Settlement',
    'Workplace Incident',
    'Internal Complaint',
    'Retaliation',
    'Termination',
    'Other'
  ];

  const categories = eventType === 'timeline' ? timelineCategories : historyCategories;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Event category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (formData.url && formData.url.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

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
      const eventData: Partial<TimelineEvent> = {
        ...(isEditing && { id: editingEvent.id }),
        caseId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: new Date(formData.date),
        type: eventType === 'timeline' ? 'case-event' : 'client-event',
        url: formData.url.trim() || undefined
      };

      await onSubmit(eventData);
      handleClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Event' : `Add ${eventType === 'timeline' ? 'Timeline' : 'History'} Event`}
              </h2>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Update event details' : `Add a new event to the case ${eventType}`}
              </p>
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
            {/* Event Title */}
            <div className="form-group">
              <label className="form-label required">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter event title"
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            {/* Event Description */}
            <div className="form-group">
              <label className="form-label required">Event Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Provide detailed description of the event"
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            <div className="responsive-grid-2">
              {/* Event Category */}
              <div className="form-group">
                <label className="form-label required">Event Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>

              {/* Event Date */}
              <div className="form-group">
                <label className="form-label required">Event Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`form-input ${errors.date ? 'error' : ''}`}
                />
                {errors.date && <p className="form-error">{errors.date}</p>}
              </div>
            </div>

            {/* Associated File URL */}
            <div className="form-group">
              <label className="form-label">Associated File URL (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className={`form-input pl-10 ${errors.url ? 'error' : ''}`}
                  placeholder="https://drive.google.com/file/..."
                />
              </div>
              {errors.url && <p className="form-error">{errors.url}</p>}
              <p className="form-help">
                Link to a file stored in cloud storage (Google Drive, Dropbox, etc.)
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
                  <span>{isEditing ? 'Updating...' : 'Adding...'}</span>
                </div>
              ) : (
                isEditing ? 'Update Event' : 'Add Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimelineEventModal;