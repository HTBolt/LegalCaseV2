import React, { useState, useEffect } from 'react';
import { X, Scale, User, Building, Calendar, AlertTriangle } from 'lucide-react';
import { Case, User as UserType, Client } from '../types';
import '../styles/common.css';

interface CaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: Partial<Case>) => void;
  currentUser: UserType;
  users: UserType[];
  clients: Client[];
  editingCase?: Case | null;
}

const CaseFormModal: React.FC<CaseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  users,
  clients,
  editingCase = null
}) => {
  const isEditing = !!editingCase;
  
  const [formData, setFormData] = useState({
    title: '',
    caseType: '',
    clientId: '',
    referredBy: '',
    assignedLawyerId: currentUser.id,
    supportingInternIds: [] as string[],
    status: 'active' as 'active' | 'pending' | 'closed' | 'on-hold',
    priority: 'medium' as 'high' | 'medium' | 'low',
    courtStage: '',
    nextHearingDate: '',
    judge: '',
    opposingCounselName: '',
    opposingCounselFirm: '',
    opposingCounselEmail: '',
    opposingCounselPhone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editingCase changes
  useEffect(() => {
    if (editingCase) {
      setFormData({
        title: editingCase.title,
        caseType: editingCase.caseType,
        clientId: editingCase.clientId,
        referredBy: editingCase.referredBy,
        assignedLawyerId: editingCase.assignedLawyer.id,
        supportingInternIds: editingCase.supportingInterns.map(intern => intern.id),
        status: editingCase.status,
        priority: editingCase.priority,
        courtStage: editingCase.courtStage,
        nextHearingDate: editingCase.nextHearingDate ? 
          editingCase.nextHearingDate.toISOString().split('T')[0] : '',
        judge: editingCase.judge || '',
        opposingCounselName: editingCase.opposingCounsel?.name || '',
        opposingCounselFirm: editingCase.opposingCounsel?.firm || '',
        opposingCounselEmail: editingCase.opposingCounsel?.email || '',
        opposingCounselPhone: editingCase.opposingCounsel?.phone || ''
      });
    } else {
      // Reset form for new case
      setFormData({
        title: '',
        caseType: '',
        clientId: '',
        referredBy: '',
        assignedLawyerId: currentUser.id,
        supportingInternIds: [],
        status: 'active',
        priority: 'medium',
        courtStage: '',
        nextHearingDate: '',
        judge: '',
        opposingCounselName: '',
        opposingCounselFirm: '',
        opposingCounselEmail: '',
        opposingCounselPhone: ''
      });
    }
    setErrors({});
  }, [editingCase, currentUser.id]);

  const caseTypes = [
    'Intellectual Property',
    'Personal Injury',
    'Employment Law',
    'Corporate Law',
    'Family Law',
    'Real Estate Law',
    'Healthcare Law',
    'Contract Law',
    'Criminal Law',
    'Immigration Law'
  ];

  const referralSources = [
    'Existing Client',
    'Referral Network',
    'Bar Association',
    'Online Search',
    'Advertisement',
    'Word of Mouth',
    'Other'
  ];

  // Get users that can be assigned as lawyers
  const availableLawyers = users.filter(user => 
    user.role === 'lawyer' || user.role === 'firm-admin'
  );

  // Get users that can be assigned as interns
  const availableInterns = users.filter(user => user.role === 'intern');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Case title is required';
    }

    if (!formData.caseType) {
      newErrors.caseType = 'Case type is required';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Client selection is required';
    }

    if (!formData.referredBy.trim()) {
      newErrors.referredBy = 'Referral source is required';
    }

    if (!formData.assignedLawyerId) {
      newErrors.assignedLawyerId = 'Assigned lawyer is required';
    }

    // For editing, additional fields are required
    if (isEditing) {
      if (!formData.courtStage.trim()) {
        newErrors.courtStage = 'Court stage is required';
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
      const selectedClient = clients.find(c => c.id === formData.clientId)!;
      const selectedLawyer = availableLawyers.find(l => l.id === formData.assignedLawyerId)!;
      const selectedInterns = availableInterns.filter(i => 
        formData.supportingInternIds.includes(i.id)
      );

      const caseData: Partial<Case> = {
        ...(isEditing && { id: editingCase.id }),
        title: formData.title.trim(),
        caseType: formData.caseType,
        clientId: formData.clientId,
        client: selectedClient,
        assignedLawyer: selectedLawyer,
        supportingInterns: selectedInterns,
        referredBy: formData.referredBy.trim(),
        status: formData.status,
        priority: formData.priority,
        courtStage: formData.courtStage.trim() || 'Initial Filing',
        nextHearingDate: formData.nextHearingDate ? 
          new Date(formData.nextHearingDate) : undefined,
        judge: formData.judge.trim() || undefined,
        opposingCounsel: (formData.opposingCounselName.trim() || 
                         formData.opposingCounselFirm.trim() ||
                         formData.opposingCounselEmail.trim() ||
                         formData.opposingCounselPhone.trim()) ? {
          name: formData.opposingCounselName.trim(),
          firm: formData.opposingCounselFirm.trim(),
          email: formData.opposingCounselEmail.trim(),
          phone: formData.opposingCounselPhone.trim()
        } : undefined,
        createdAt: isEditing ? editingCase.createdAt : new Date(),
        updatedAt: new Date()
      };

      await onSubmit(caseData);
      handleClose();
    } catch (error) {
      console.error('Error saving case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      caseType: '',
      clientId: '',
      referredBy: '',
      assignedLawyerId: currentUser.id,
      supportingInternIds: [],
      status: 'active',
      priority: 'medium',
      courtStage: '',
      nextHearingDate: '',
      judge: '',
      opposingCounselName: '',
      opposingCounselFirm: '',
      opposingCounselEmail: '',
      opposingCounselPhone: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInternToggle = (internId: string) => {
    setFormData(prev => ({
      ...prev,
      supportingInternIds: prev.supportingInternIds.includes(internId)
        ? prev.supportingInternIds.filter(id => id !== internId)
        : [...prev.supportingInternIds, internId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Case' : 'Create New Case'}
              </h2>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Update case details' : 'Add a new case to the system'}
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
            {/* Basic Information */}
            <div className="responsive-grid-2">
              {/* Case Title */}
              <div className="lg:col-span-2">
                <div className="form-group">
                  <label className="form-label required">Case Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="Enter case title"
                  />
                  {errors.title && <p className="form-error">{errors.title}</p>}
                </div>
              </div>

              {/* Case Type */}
              <div>
                <div className="form-group">
                  <label className="form-label required">Case Type</label>
                  <select
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                    className={`form-select ${errors.caseType ? 'error' : ''}`}
                  >
                    <option value="">Select case type</option>
                    {caseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.caseType && <p className="form-error">{errors.caseType}</p>}
                </div>
              </div>

              {/* Client */}
              <div>
                <div className="form-group">
                  <label className="form-label required">Client</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className={`form-select ${errors.clientId ? 'error' : ''}`}
                  >
                    <option value="">Select client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} {client.company && `(${client.company})`}
                      </option>
                    ))}
                  </select>
                  {errors.clientId && <p className="form-error">{errors.clientId}</p>}
                </div>
              </div>
            </div>

            {/* Assignment and Referral */}
            <div className="responsive-grid-2">
              {/* Referred By */}
              <div>
                <div className="form-group">
                  <label className="form-label required">Referred By</label>
                  <select
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                    className={`form-select ${errors.referredBy ? 'error' : ''}`}
                  >
                    <option value="">Select referral source</option>
                    {referralSources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                  {errors.referredBy && <p className="form-error">{errors.referredBy}</p>}
                </div>
              </div>

              {/* Assigned Lawyer */}
              <div>
                <div className="form-group">
                  <label className="form-label required">Assigned Lawyer</label>
                  <select
                    value={formData.assignedLawyerId}
                    onChange={(e) => setFormData({ ...formData, assignedLawyerId: e.target.value })}
                    className={`form-select ${errors.assignedLawyerId ? 'error' : ''}`}
                  >
                    <option value="">Select lawyer</option>
                    {availableLawyers.map(lawyer => (
                      <option key={lawyer.id} value={lawyer.id}>
                        {lawyer.name} ({lawyer.role})
                      </option>
                    ))}
                  </select>
                  {errors.assignedLawyerId && <p className="form-error">{errors.assignedLawyerId}</p>}
                </div>
              </div>
            </div>

            {/* Supporting Interns */}
            <div className="form-group">
              <label className="form-label">Supporting Interns</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableInterns.map(intern => (
                  <label key={intern.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.supportingInternIds.includes(intern.id)}
                      onChange={() => handleInternToggle(intern.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{intern.name}</span>
                  </label>
                ))}
              </div>
              {availableInterns.length === 0 && (
                <p className="text-sm text-gray-500">No interns available</p>
              )}
            </div>

            {/* Additional Details (shown for editing or optionally for new cases) */}
            {isEditing && (
              <>
                <div className="responsive-grid-2">
                  {/* Status */}
                  <div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="form-select"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="on-hold">On Hold</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="form-select"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="responsive-grid-2">
                  {/* Court Stage */}
                  <div>
                    <div className="form-group">
                      <label className="form-label required">Court Stage</label>
                      <input
                        type="text"
                        value={formData.courtStage}
                        onChange={(e) => setFormData({ ...formData, courtStage: e.target.value })}
                        className={`form-input ${errors.courtStage ? 'error' : ''}`}
                        placeholder="e.g., Discovery Phase, Pre-trial"
                      />
                      {errors.courtStage && <p className="form-error">{errors.courtStage}</p>}
                    </div>
                  </div>

                  {/* Next Hearing Date */}
                  <div>
                    <div className="form-group">
                      <label className="form-label">Next Hearing Date</label>
                      <input
                        type="date"
                        value={formData.nextHearingDate}
                        onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Judge */}
                <div className="form-group">
                  <label className="form-label">Presiding Judge</label>
                  <input
                    type="text"
                    value={formData.judge}
                    onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                    className="form-input"
                    placeholder="e.g., Hon. Patricia Williams"
                  />
                </div>

                {/* Opposing Counsel */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Opposing Counsel (Optional)
                  </h3>
                  <div className="responsive-grid-2">
                    <div className="form-group">
                      <label className="form-label">Attorney Name</label>
                      <input
                        type="text"
                        value={formData.opposingCounselName}
                        onChange={(e) => setFormData({ ...formData, opposingCounselName: e.target.value })}
                        className="form-input"
                        placeholder="Attorney name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Law Firm</label>
                      <input
                        type="text"
                        value={formData.opposingCounselFirm}
                        onChange={(e) => setFormData({ ...formData, opposingCounselFirm: e.target.value })}
                        className="form-input"
                        placeholder="Law firm name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={formData.opposingCounselEmail}
                        onChange={(e) => setFormData({ ...formData, opposingCounselEmail: e.target.value })}
                        className="form-input"
                        placeholder="email@lawfirm.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        value={formData.opposingCounselPhone}
                        onChange={(e) => setFormData({ ...formData, opposingCounselPhone: e.target.value })}
                        className="form-input"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
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
                  <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                isEditing ? 'Update Case' : 'Create Case'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseFormModal;