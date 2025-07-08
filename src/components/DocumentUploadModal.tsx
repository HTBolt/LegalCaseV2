import React, { useState } from 'react';
import { X, Upload, FileText, Eye, EyeOff } from 'lucide-react';
import { Document, User } from '../types';
import '../styles/common.css';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (documentData: Partial<Document>) => void;
  caseId: string;
  currentUser: User;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  caseId,
  currentUser
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'other' as 'pleading' | 'evidence' | 'correspondence' | 'research' | 'other',
    isClientVisible: false,
    uploadDate: new Date().toISOString().split('T')[0]
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentCategories = [
    { value: 'pleading', label: 'Pleading' },
    { value: 'evidence', label: 'Evidence' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Document name is required';
    }

    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
    } else {
      // Validate file type (for demo, we'll accept common document types)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = 'Only PDF, Word documents, and text files are allowed';
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        newErrors.file = 'File size must be less than 10MB';
      }
    }

    if (!formData.uploadDate) {
      newErrors.uploadDate = 'Upload date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill document name if not already set
      if (!formData.name.trim()) {
        setFormData(prev => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, '') // Remove file extension
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, you would upload the file to a storage service
      // For this demo, we'll simulate the upload and create a document entry
      const documentData: Partial<Document> = {
        id: Date.now().toString(),
        caseId,
        name: formData.name.trim(),
        type: selectedFile!.type,
        size: selectedFile!.size,
        uploadedBy: currentUser,
        uploadedAt: new Date(formData.uploadDate),
        url: `#simulated-url-${Date.now()}`, // Simulated URL
        category: formData.category,
        isClientVisible: formData.isClientVisible
      };

      await onSubmit(documentData);
      handleClose();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: 'other',
      isClientVisible: false,
      uploadDate: new Date().toISOString().split('T')[0]
    });
    setSelectedFile(null);
    setErrors({});
    setIsSubmitting(false);
    onClose();
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
      <div className="modal-content max-w-2xl">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
              <p className="text-sm text-gray-600">Add a new document to the case</p>
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
            {/* File Upload */}
            <div className="form-group">
              <label className="form-label required">Select File</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, Word documents, or text files (max 10MB)
                    </p>
                  </div>
                </label>
              </div>
              
              {selectedFile && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-blue-700">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {errors.file && <p className="form-error">{errors.file}</p>}
            </div>

            {/* Document Name */}
            <div className="form-group">
              <label className="form-label required">Document Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter document name"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="responsive-grid-2">
              {/* Document Category */}
              <div className="form-group">
                <label className="form-label required">Document Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="form-select"
                >
                  {documentCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Date */}
              <div className="form-group">
                <label className="form-label required">Upload Date</label>
                <input
                  type="date"
                  value={formData.uploadDate}
                  onChange={(e) => setFormData({ ...formData, uploadDate: e.target.value })}
                  className={`form-input ${errors.uploadDate ? 'error' : ''}`}
                />
                {errors.uploadDate && <p className="form-error">{errors.uploadDate}</p>}
              </div>
            </div>

            {/* Client Visibility */}
            <div className="form-group">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="client-visible"
                  checked={formData.isClientVisible}
                  onChange={(e) => setFormData({ ...formData, isClientVisible: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="client-visible" className="flex items-center space-x-2 cursor-pointer">
                  {formData.isClientVisible ? (
                    <Eye className="h-4 w-4 text-blue-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    Make this document visible to the client
                  </span>
                </label>
              </div>
              <p className="form-help mt-2">
                When enabled, the client will be able to see and download this document from their dashboard
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
                  <span>Uploading...</span>
                </div>
              ) : (
                'Upload Document'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadModal;