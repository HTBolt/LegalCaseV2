import React, { useState, useCallback } from 'react';
import { Upload, Link, FileText, Eye, EyeOff, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { User } from '../types';
import '../styles/common.css';

export interface FileUploadData {
  id: string;
  name: string;
  type: string;
  size: number | null;
  category: string;
  date: Date;
  isClientVisible?: boolean;
  uploadMode: 'file' | 'link';
  file?: File;
  url?: string;
}

interface FileUploadComponentProps {
  onFileSelect: (fileData: FileUploadData) => void;
  onRemove?: (fileId: string) => void;
  currentUser: User;
  // Configuration
  allowMultiple?: boolean;
  showCategory?: boolean;
  showClientVisibility?: boolean;
  showDate?: boolean;
  categoryOptions?: { value: string; label: string }[];
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  placeholder?: string;
  // Pre-selected files (for editing scenarios)
  selectedFiles?: FileUploadData[];
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onFileSelect,
  onRemove,
  currentUser,
  allowMultiple = false,
  showCategory = true,
  showClientVisibility = true,
  showDate = true,
  categoryOptions = [
    { value: 'pleading', label: 'Pleading' },
    { value: 'evidence', label: 'Evidence' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' }
  ],
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.txt'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  placeholder = 'Click to upload or drag and drop',
  selectedFiles = []
}) => {
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
  const [formData, setFormData] = useState({
    name: '',
    category: categoryOptions[0]?.value || 'other',
    date: new Date().toISOString().split('T')[0],
    isClientVisible: false,
    url: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  // Known cloud storage providers for validation
  const cloudStorageProviders = [
    'drive.google.com',
    'docs.google.com',
    'onedrive.live.com',
    '1drv.ms',
    'dropbox.com',
    'icloud.com',
    'box.com',
    'sharepoint.com'
  ];

  // Security: Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  // Validate URL format and cloud storage provider
  const validateUrl = (url: string): { isValid: boolean; error?: string } => {
    if (!url.trim()) {
      return { isValid: false, error: 'URL is required' };
    }

    try {
      const urlObj = new URL(url);
      
      // Security: Only allow HTTPS URLs
      if (urlObj.protocol !== 'https:') {
        return { isValid: false, error: 'Only HTTPS URLs are allowed for security' };
      }

      // Check if it's from a known cloud storage provider
      const isKnownProvider = cloudStorageProviders.some(provider => 
        urlObj.hostname.includes(provider) || urlObj.hostname.endsWith(provider)
      );

      if (!isKnownProvider) {
        return { 
          isValid: false, 
          error: 'Please use a link from a known cloud storage provider (Google Drive, OneDrive, Dropbox, iCloud, Box)' 
        };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Please enter a valid URL' };
    }
  };

  // Validate file upload
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      return { 
        isValid: false, 
        error: `Only ${acceptedFileTypes.join(', ')} files are allowed` 
      };
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      return { 
        isValid: false, 
        error: `File size must be less than ${maxSizeMB}MB` 
      };
    }

    return { isValid: true };
  };

  // Auto-detect file type from URL or file
  const getFileType = (file?: File, url?: string): string => {
    if (file) {
      return file.type;
    }
    
    if (url) {
      // Try to detect from URL extension
      const extension = url.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf':
          return 'application/pdf';
        case 'doc':
          return 'application/msword';
        case 'docx':
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'txt':
          return 'text/plain';
        default:
          return 'application/external-link';
      }
    }
    
    return 'application/external-link';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!sanitizeInput(formData.name)) {
      newErrors.name = 'File name is required';
    }

    if (uploadMode === 'file') {
      if (!selectedFile) {
        newErrors.file = 'Please select a file to upload';
      } else {
        const fileValidation = validateFile(selectedFile);
        if (!fileValidation.isValid) {
          newErrors.file = fileValidation.error!;
        }
      }
    } else {
      const urlValidation = validateUrl(formData.url);
      if (!urlValidation.isValid) {
        newErrors.url = urlValidation.error!;
      }
    }

    if (showDate && !formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const fileData: FileUploadData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: sanitizeInput(formData.name),
      type: getFileType(selectedFile, formData.url),
      size: uploadMode === 'file' ? (selectedFile?.size || 0) : null,
      category: formData.category,
      date: new Date(formData.date),
      isClientVisible: showClientVisibility ? formData.isClientVisible : undefined,
      uploadMode,
      file: uploadMode === 'file' ? selectedFile || undefined : undefined,
      url: uploadMode === 'link' ? sanitizeInput(formData.url) : undefined
    };

    onFileSelect(fileData);

    // Reset form
    setFormData({
      name: '',
      category: categoryOptions[0]?.value || 'other',
      date: new Date().toISOString().split('T')[0],
      isClientVisible: false,
      url: ''
    });
    setSelectedFile(null);
    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill name if not already set
      if (!formData.name.trim()) {
        setFormData(prev => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, '') // Remove file extension
        }));
      }
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    if (uploadMode !== 'file') return;
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      setSelectedFile(file);
      if (!formData.name.trim()) {
        setFormData(prev => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, '')
        }));
      }
    }
  }, [uploadMode, formData.name]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, url: '', name: '' }));
    setErrors({});
  };

  return (
    <div className="space-y-4">
      {/* Upload Mode Toggle */}
      <div className="form-group">
        <label className="form-label">File Source</label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={uploadMode === 'file'}
              onChange={() => {
                setUploadMode('file');
                clearSelection();
              }}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Upload File</span>
            </div>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={uploadMode === 'link'}
              onChange={() => {
                setUploadMode('link');
                clearSelection();
              }}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Link to File</span>
            </div>
          </label>
        </div>
      </div>

      {/* File Upload Section */}
      {uploadMode === 'file' && (
        <div className="form-group">
          <label className="form-label required">Select File</label>
          <div 
            className={`file-upload-area ${dragActive ? 'dragover' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept={acceptedFileTypes.join(',')}
              className="hidden"
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-900">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {acceptedFileTypes.join(', ')} files (max {Math.round(maxFileSize / (1024 * 1024))}MB)
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
                  onClick={clearSelection}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {errors.file && <p className="form-error">{errors.file}</p>}
        </div>
      )}

      {/* External Link Section */}
      {uploadMode === 'link' && (
        <div className="form-group">
          <label className="form-label required">File URL</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className={`form-input pl-10 ${errors.url ? 'error' : ''}`}
              placeholder="https://drive.google.com/file/d/..."
            />
          </div>
          {errors.url && <p className="form-error">{errors.url}</p>}
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Supported cloud storage providers:</p>
                <p className="text-xs">Google Drive, OneDrive, Dropbox, iCloud, Box, SharePoint</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Common Form Fields */}
      <div className="space-y-4">
        {/* File Name */}
        <div className="form-group">
          <label className="form-label required">
            {uploadMode === 'file' ? 'Document Name' : 'Link Name'}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder={uploadMode === 'file' ? 'Enter document name' : 'Enter a descriptive name for this link'}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          {showCategory && (
            <div className="form-group">
              <label className="form-label required">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          {showDate && (
            <div className="form-group">
              <label className="form-label required">
                {uploadMode === 'file' ? 'Upload Date' : 'Link Date'}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`form-input ${errors.date ? 'error' : ''}`}
              />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>
          )}
        </div>

        {/* Client Visibility */}
        {showClientVisibility && (
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
                  Make this {uploadMode === 'file' ? 'document' : 'link'} visible to the client
                </span>
              </label>
            </div>
            <p className="form-help mt-2">
              When enabled, the client will be able to see and access this {uploadMode === 'file' ? 'document' : 'link'} from their dashboard
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary"
          disabled={uploadMode === 'file' ? !selectedFile : !formData.url}
        >
          {uploadMode === 'file' ? 'Add File' : 'Add Link'}
        </button>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
          {selectedFiles.map((fileData) => (
            <div key={fileData.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {fileData.uploadMode === 'file' ? (
                    <FileText className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Link className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileData.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{fileData.category}</span>
                    {fileData.size !== null && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(fileData.size)}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{fileData.date.toLocaleDateString()}</span>
                    {fileData.isClientVisible && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600">Client Visible</span>
                      </>
                    )}
                  </div>
                </div>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(fileData.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Security Notice:</p>
            <p className="text-xs mt-1">
              Only HTTPS links from trusted cloud storage providers are accepted. 
              Ensure your files are properly shared with appropriate permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;