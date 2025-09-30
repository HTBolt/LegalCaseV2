import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Document, User } from '../types';
import FileUploadComponent, { FileUploadData } from './FileUploadComponent';
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
  const [selectedFiles, setSelectedFiles] = useState<FileUploadData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentCategories = [
    { value: 'pleading', label: 'Pleading' },
    { value: 'evidence', label: 'Evidence' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please add at least one file or link');
      return;
    }

    setIsSubmitting(true);

    try {
      // Process each selected file/link
      for (const fileData of selectedFiles) {
        const documentData: Partial<Document> = {
          id: fileData.id,
          caseId,
          name: fileData.name,
          type: fileData.type,
          size: fileData.size || 0,
          uploadedBy: currentUser,
          uploadedAt: fileData.date,
          url: fileData.uploadMode === 'link' ? fileData.url! : `#simulated-url-${fileData.id}`,
          category: fileData.category as 'pleading' | 'evidence' | 'correspondence' | 'research' | 'other',
          isClientVisible: fileData.isClientVisible
        };

        await onSubmit(documentData);
      }
      handleClose();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setIsSubmitting(false);
    onClose();
  };

  const handleFileSelect = (fileData: FileUploadData) => {
    setSelectedFiles(prev => [...prev, fileData]);
  };

  const handleFileRemove = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
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
        <div className="modal-body">
          <div className="p-6">
            <FileUploadComponent
              onFileSelect={handleFileSelect}
              onRemove={handleFileRemove}
              currentUser={currentUser}
              allowMultiple={true}
              showCategory={true}
              showClientVisibility={true}
              showDate={true}
              categoryOptions={documentCategories}
              acceptedFileTypes={['.pdf', '.doc', '.docx', '.txt']}
              maxFileSize={10 * 1024 * 1024}
              placeholder="Click to upload or drag and drop"
              selectedFiles={selectedFiles}
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
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedFiles.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="spinner h-4 w-4 border-white"></div>
                <span>Adding Documents...</span>
              </div>
            ) : (
              `Add ${selectedFiles.length} Document${selectedFiles.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;