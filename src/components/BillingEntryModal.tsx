import React, { useState } from 'react';
import { X, DollarSign, User, Plus, Trash2 } from 'lucide-react';
import { BillingEntry, User as UserType } from '../types';
import '../styles/common.css';

interface BillingEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (billingData: Partial<BillingEntry>) => void;
  caseId: string;
  currentUser: UserType;
  users: UserType[];
}

interface InternEntry {
  internId: string;
  hoursWorked: number;
  hoursBilled: number;
  rate: number;
}

const BillingEntryModal: React.FC<BillingEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  caseId,
  currentUser,
  users
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    lawyerHours: 0,
    lawyerRate: 500,
    totalHours: 0,
    totalAmount: 0,
    dueDate: '',
    status: 'pending' as 'pending' | 'sent' | 'paid' | 'overdue' | 'disputed',
    invoiceNumber: '',
    paidDate: '',
    notes: ''
  });

  const [internEntries, setInternEntries] = useState<InternEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available interns
  const availableInterns = users.filter(user => user.role === 'intern');

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'disputed', label: 'Disputed' }
  ];

  // Calculate totals whenever form data or intern entries change
  React.useEffect(() => {
    const lawyerTotal = formData.lawyerHours * formData.lawyerRate;
    const internTotal = internEntries.reduce((sum, entry) => 
      sum + (entry.hoursBilled * entry.rate), 0
    );
    const totalHours = formData.lawyerHours + internEntries.reduce((sum, entry) => 
      sum + entry.hoursBilled, 0
    );
    const totalAmount = lawyerTotal + internTotal;

    setFormData(prev => ({
      ...prev,
      totalHours,
      totalAmount
    }));
  }, [formData.lawyerHours, formData.lawyerRate, internEntries]);

  // Auto-set due date to 30 days from billing date
  React.useEffect(() => {
    if (formData.date) {
      const billingDate = new Date(formData.date);
      const dueDate = new Date(billingDate);
      dueDate.setDate(dueDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.date]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Billing date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.lawyerHours < 0) {
      newErrors.lawyerHours = 'Lawyer hours cannot be negative';
    }

    if (formData.lawyerRate <= 0) {
      newErrors.lawyerRate = 'Lawyer rate must be greater than 0';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.status === 'paid' && !formData.paidDate) {
      newErrors.paidDate = 'Paid date is required when status is paid';
    }

    // Validate intern entries
    internEntries.forEach((entry, index) => {
      if (!entry.internId) {
        newErrors[`intern_${index}_id`] = 'Intern selection is required';
      }
      if (entry.hoursWorked < 0) {
        newErrors[`intern_${index}_worked`] = 'Hours worked cannot be negative';
      }
      if (entry.hoursBilled < 0) {
        newErrors[`intern_${index}_billed`] = 'Hours billed cannot be negative';
      }
      if (entry.hoursBilled > entry.hoursWorked) {
        newErrors[`intern_${index}_billed`] = 'Hours billed cannot exceed hours worked';
      }
      if (entry.rate <= 0) {
        newErrors[`intern_${index}_rate`] = 'Rate must be greater than 0';
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
      const billingData: Partial<BillingEntry> = {
        id: Date.now().toString(),
        caseId,
        date: new Date(formData.date),
        description: formData.description.trim(),
        lawyerHours: formData.lawyerHours,
        lawyerRate: formData.lawyerRate,
        internEntries: internEntries.map(entry => ({
          intern: availableInterns.find(intern => intern.id === entry.internId)!,
          hoursWorked: entry.hoursWorked,
          hoursBilled: entry.hoursBilled,
          rate: entry.rate
        })),
        totalHours: formData.totalHours,
        totalAmount: formData.totalAmount,
        dueDate: new Date(formData.dueDate),
        status: formData.status,
        invoiceNumber: formData.invoiceNumber.trim() || undefined,
        paidDate: formData.paidDate ? new Date(formData.paidDate) : undefined,
        notes: formData.notes.trim() || undefined
      };

      await onSubmit(billingData);
      handleClose();
    } catch (error) {
      console.error('Error saving billing entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      lawyerHours: 0,
      lawyerRate: 500,
      totalHours: 0,
      totalAmount: 0,
      dueDate: '',
      status: 'pending',
      invoiceNumber: '',
      paidDate: '',
      notes: ''
    });
    setInternEntries([]);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const addInternEntry = () => {
    setInternEntries(prev => [...prev, {
      internId: '',
      hoursWorked: 0,
      hoursBilled: 0,
      rate: 150
    }]);
  };

  const removeInternEntry = (index: number) => {
    setInternEntries(prev => prev.filter((_, i) => i !== index));
  };

  const updateInternEntry = (index: number, field: keyof InternEntry, value: string | number) => {
    setInternEntries(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add Billing Entry</h2>
              <p className="text-sm text-gray-600">Create a new billing entry for the case</p>
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
              {/* Billing Date */}
              <div className="form-group">
                <label className="form-label required">Billing Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`form-input ${errors.date ? 'error' : ''}`}
                />
                {errors.date && <p className="form-error">{errors.date}</p>}
              </div>

              {/* Due Date */}
              <div className="form-group">
                <label className="form-label required">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`form-input ${errors.dueDate ? 'error' : ''}`}
                />
                {errors.dueDate && <p className="form-error">{errors.dueDate}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label required">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe the work performed during this billing period"
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            {/* Lawyer Hours and Rate */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Lawyer Time
              </h3>
              <div className="responsive-grid-2">
                <div className="form-group">
                  <label className="form-label">Hours Worked</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={formData.lawyerHours}
                    onChange={(e) => setFormData({ ...formData, lawyerHours: parseFloat(e.target.value) || 0 })}
                    className={`form-input ${errors.lawyerHours ? 'error' : ''}`}
                  />
                  {errors.lawyerHours && <p className="form-error">{errors.lawyerHours}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Hourly Rate</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.lawyerRate}
                      onChange={(e) => setFormData({ ...formData, lawyerRate: parseFloat(e.target.value) || 0 })}
                      className={`form-input pl-8 ${errors.lawyerRate ? 'error' : ''}`}
                    />
                  </div>
                  {errors.lawyerRate && <p className="form-error">{errors.lawyerRate}</p>}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Lawyer Total: {formatCurrency(formData.lawyerHours * formData.lawyerRate)}
                </p>
              </div>
            </div>

            {/* Intern Entries */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Intern Time
                </h3>
                <button
                  type="button"
                  onClick={addInternEntry}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Intern</span>
                </button>
              </div>

              {internEntries.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No intern time entries</p>
                  <p className="text-xs text-gray-400">Click "Add Intern" to include intern hours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {internEntries.map((entry, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Intern Entry {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeInternEntry(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="form-group">
                          <label className="form-label">Intern</label>
                          <select
                            value={entry.internId}
                            onChange={(e) => updateInternEntry(index, 'internId', e.target.value)}
                            className={`form-select ${errors[`intern_${index}_id`] ? 'error' : ''}`}
                          >
                            <option value="">Select intern</option>
                            {availableInterns.map(intern => (
                              <option key={intern.id} value={intern.id}>{intern.name}</option>
                            ))}
                          </select>
                          {errors[`intern_${index}_id`] && (
                            <p className="form-error">{errors[`intern_${index}_id`]}</p>
                          )}
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Hours Worked</label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={entry.hoursWorked}
                            onChange={(e) => updateInternEntry(index, 'hoursWorked', parseFloat(e.target.value) || 0)}
                            className={`form-input ${errors[`intern_${index}_worked`] ? 'error' : ''}`}
                          />
                          {errors[`intern_${index}_worked`] && (
                            <p className="form-error">{errors[`intern_${index}_worked`]}</p>
                          )}
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Hours Billed</label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={entry.hoursBilled}
                            onChange={(e) => updateInternEntry(index, 'hoursBilled', parseFloat(e.target.value) || 0)}
                            className={`form-input ${errors[`intern_${index}_billed`] ? 'error' : ''}`}
                          />
                          {errors[`intern_${index}_billed`] && (
                            <p className="form-error">{errors[`intern_${index}_billed`]}</p>
                          )}
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Rate</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-3 w-3 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={entry.rate}
                              onChange={(e) => updateInternEntry(index, 'rate', parseFloat(e.target.value) || 0)}
                              className={`form-input pl-7 ${errors[`intern_${index}_rate`] ? 'error' : ''}`}
                            />
                          </div>
                          {errors[`intern_${index}_rate`] && (
                            <p className="form-error">{errors[`intern_${index}_rate`]}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 p-2 bg-green-50 rounded">
                        <p className="text-sm text-green-800">
                          Intern Total: {formatCurrency(entry.hoursBilled * entry.rate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Billing Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Billing Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Hours:</span>
                  <span className="font-medium">{formData.totalHours}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(formData.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Status and Payment Information */}
            <div className="responsive-grid-2">
              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="form-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Invoice Number */}
              <div className="form-group">
                <label className="form-label">Invoice Number (Optional)</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="form-input"
                  placeholder="INV-2025-001"
                />
              </div>
            </div>

            {/* Paid Date (only show if status is paid) */}
            {formData.status === 'paid' && (
              <div className="form-group">
                <label className="form-label required">Paid Date</label>
                <input
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                  className={`form-input ${errors.paidDate ? 'error' : ''}`}
                />
                {errors.paidDate && <p className="form-error">{errors.paidDate}</p>}
              </div>
            )}

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="form-textarea"
                placeholder="Additional notes about this billing entry"
              />
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
                'Create Billing Entry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingEntryModal;