import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, User, Users, Clock, MapPin, Phone, Mail, 
  FileText, Plus, MessageSquare, Scale, Building, AlertTriangle,
  CheckCircle, Download, ExternalLink, Edit, Save, X, History,
  DollarSign, Receipt, CreditCard, AlertCircle, TrendingUp, Search, Eye
} from 'lucide-react';
import { Case, TimelineEvent, Document, Note, BillingEntry, Task } from '../types';
import TaskCreationModal from './TaskCreationModal';
import TaskList from './TaskList';

interface CaseDetailsProps {
  caseData: Case;
  timelineEvents: TimelineEvent[];
  preEngagementEvents: TimelineEvent[];
  documents: Document[];
  notes: Note[];
  billingEntries: BillingEntry[];
  caseTasks?: Task[];
  onBack: () => void;
  onTaskCreate?: (taskData: Partial<any>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit?: (task: Task) => void;
  editingTask?: Task | null;
  showTaskModal?: boolean;
  onTaskModalClose?: () => void;
  currentUser?: any;
  users?: any[];
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ 
  caseData, 
  timelineEvents, 
  preEngagementEvents,
  documents, 
  notes, 
  billingEntries,
  onBack,
  caseTasks = [],
  onTaskCreate,
  onTaskUpdate,
  onTaskEdit,
  editingTask,
  showTaskModal = false,
  onTaskModalClose,
  currentUser,
  users = []
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'pre-engagement' | 'documents' | 'notes' | 'tasks' | 'billing'>('overview');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [localShowTaskModal, setLocalShowTaskModal] = useState(false);

  // Use prop showTaskModal if provided, otherwise use local state
  const isTaskModalOpen = showTaskModal || localShowTaskModal;
  
  const handleTaskModalClose = () => {
    if (onTaskModalClose) {
      onTaskModalClose();
    } else {
      setLocalShowTaskModal(false);
    }
  };

  const handleAddTask = () => {
    if (onTaskModalClose) {
      // If we have the prop handler, we're using external state
      onTaskModalClose(); // This will clear editingTask
      setTimeout(() => {
        setLocalShowTaskModal(true);
      }, 0);
    } else {
      setLocalShowTaskModal(true);
    }
  };

  const handleTaskCreate = (taskData: Partial<any>) => {
    if (onTaskCreate) {
      // Pre-populate with case information
      const enhancedTaskData = {
        ...taskData,
        caseId: caseData.id
      };
      onTaskCreate(enhancedTaskData);
    }
    handleTaskModalClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'case-event':
        return <Scale className="h-5 w-5 text-blue-600" />;
      case 'client-event':
        return <User className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDocumentIcon = (category: string) => {
    switch (category) {
      case 'pleading':
        return <Scale className="h-5 w-5 text-blue-600" />;
      case 'evidence':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'correspondence':
        return <Mail className="h-5 w-5 text-green-600" />;
      case 'research':
        return <FileText className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'disputed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBillingStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'sent':
        return <Mail className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const sortedTimelineEvents = [...timelineEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedPreEngagementEvents = [...preEngagementEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sortedBillingEntries = [...billingEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate billing summary
  const totalBilled = billingEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
  const totalPaid = billingEntries.filter(e => e.status === 'paid').reduce((sum, entry) => sum + entry.totalAmount, 0);
  const totalOutstanding = billingEntries.filter(e => e.status !== 'paid').reduce((sum, entry) => sum + entry.totalAmount, 0);
  const totalOverdue = billingEntries.filter(e => e.status === 'overdue').reduce((sum, entry) => sum + entry.totalAmount, 0);

  const renderTimeline = (events: TimelineEvent[], title: string, emptyMessage: string) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{events.length} event{events.length !== 1 ? 's' : ''} recorded</p>
      </div>
      <div className="p-4 sm:p-6">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {events.map((event, index) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {index !== events.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-gray-300">
                        {getTimelineIcon(event.type)}
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                            event.type === 'case-event' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {event.category}
                          </span>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500 flex-shrink-0">
                          <div className="hidden sm:block">{formatDate(event.date)}</div>
                          <div className="sm:hidden">{event.date.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'pre-engagement', label: 'History' },
    { id: 'documents', label: 'Docs' },
    { id: 'notes', label: 'Notes' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'billing', label: 'Billing' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile optimized */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-3 sm:py-4">
            <button
              onClick={onBack}
              className="mr-3 sm:mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{caseData.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                <span>Case #{caseData.id}</span>
                <span>•</span>
                <span className="truncate">{caseData.caseType}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  caseData.status === 'active' ? 'bg-green-100 text-green-800' : 
                  caseData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {caseData.status}
                </span>
              </div>
            </div>
            {onTaskCreate && currentUser && (
              <button
                onClick={handleAddTask}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-3"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            )}
          </div>
          
          {/* Mobile-optimized tabs */}
          <div className="overflow-x-auto">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-3 min-w-max">
              {tabs.map((tab) => (
                <button
                  onClick={handleAddTask}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.client.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900 truncate">{caseData.client.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.client.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.client.address}</p>
                  </div>
                </div>
              </div>

              {/* Case Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Scale className="h-5 w-5 mr-2" />
                  Case Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Case Type</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.caseType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Stage</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.courtStage}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Referred By</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.referredBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      caseData.priority === 'high' ? 'bg-red-100 text-red-800' :
                      caseData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {caseData.priority}
                    </span>
                  </div>
                  {caseData.nextHearingDate && (
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Next Hearing</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="hidden sm:inline">{formatDate(caseData.nextHearingDate)}</span>
                        <span className="sm:hidden">{caseData.nextHearingDate.toLocaleDateString()}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Opposing Counsel - Mobile optimized */}
              {caseData.opposingCounsel && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Opposing Counsel
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.opposingCounsel.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Firm</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.opposingCounsel.firm}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-sm text-gray-900 truncate">{caseData.opposingCounsel.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.opposingCounsel.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Mobile optimized */}
            <div className="space-y-6">
              {/* Judge Information */}
              {caseData.judge && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Scale className="h-5 w-5 mr-2" />
                    Judge
                  </h3>
                  <p className="text-sm text-gray-900">{caseData.judge}</p>
                </div>
              )}

              {/* Team */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Legal Team
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{caseData.assignedLawyer.name}</p>
                      <p className="text-xs text-gray-500">Lead Attorney</p>
                    </div>
                  </div>
                  {caseData.supportingInterns.map((intern) => (
                    <div key={intern.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{intern.name}</p>
                        <p className="text-xs text-gray-500">Intern</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Documents</span>
                    <span className="text-sm font-medium text-gray-900">{documents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Legal Events</span>
                    <span className="text-sm font-medium text-gray-900">{timelineEvents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Case History</span>
                    <span className="text-sm font-medium text-gray-900">{preEngagementEvents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Notes</span>
                    <span className="text-sm font-medium text-gray-900">{notes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Billing Entries</span>
                    <span className="text-sm font-medium text-gray-900">{billingEntries.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Active</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.ceil((new Date().getTime() - caseData.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && 
          renderTimeline(
            sortedTimelineEvents, 
            'Legal Timeline - Post Engagement', 
            'No legal events recorded since engagement'
          )
        }

        {activeTab === 'pre-engagement' && 
          renderTimeline(
            sortedPreEngagementEvents, 
            'Case History - Pre Engagement', 
            'No pre-engagement history available'
          )
        }

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Case Documents</h3>
                  <p className="text-sm text-gray-600 mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''} total</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {sortedDocuments.map((document) => (
                <div key={document.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        {getDocumentIcon(document.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            document.category === 'pleading' ? 'bg-blue-100 text-blue-800' :
                            document.category === 'evidence' ? 'bg-red-100 text-red-800' :
                            document.category === 'correspondence' ? 'bg-green-100 text-green-800' :
                            document.category === 'research' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {document.category}
                          </span>
                          <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Uploaded by {document.uploadedBy.name} on {document.uploadedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Case Notes</h3>
                <p className="text-sm text-gray-600 mt-1">{notes.length} note{notes.length !== 1 ? 's' : ''} total</p>
              </div>
            </div>
            
            {/* Add New Note - Mobile optimized */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-3">
                    <button
                      onClick={() => setNewNote('')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!newNote.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className="divide-y divide-gray-200">
              {sortedNotes.map((note) => (
                <div key={note.id} className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{note.author.name}</p>
                          <span className="text-xs text-gray-500">
                            {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}
                          </span>
                          {note.isPrivate && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Private
                            </span>
                          )}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors self-start sm:self-center">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Case Tasks</h3>
                  <p className="text-sm text-gray-600 mt-1">{caseTasks.length} task{caseTasks.length !== 1 ? 's' : ''} for this case</p>
                </div>
                {onTaskCreate && currentUser && (
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </button>
                )}
              </div>
            </div>
            
            {caseTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No tasks created for this case yet</p>
                {onTaskCreate && currentUser && (
                  <button
                    onClick={handleAddTask}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Task
                  </button>
                )}
              </div>
            ) : (
              <div>
                <TaskList 
                  tasks={caseTasks}
                  title="Case Tasks"
                  showAssignee={true}
                  onAddTask={handleAddTask}
                  onTaskUpdate={onTaskUpdate}
                  onTaskEdit={onTaskEdit}
                  currentUser={currentUser}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Billing Summary - Mobile optimized grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 sm:p-3 rounded-lg">
                    <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Billed</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(totalBilled)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 sm:p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Paid</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-2 sm:p-3 rounded-lg">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Outstanding</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="bg-red-500 p-2 sm:p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(totalOverdue)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History - Mobile optimized */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
                    <p className="text-sm text-gray-600 mt-1">{billingEntries.length} billing entr{billingEntries.length !== 1 ? 'ies' : 'y'}</p>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Billing Entry
                  </button>
                </div>
              </div>

              {billingEntries.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No billing entries recorded</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sortedBillingEntries.map((entry) => (
                    <div key={entry.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {entry.invoiceNumber || `Billing Entry ${entry.id}`}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border self-start ${getBillingStatusColor(entry.status)}`}>
                              <span className="mr-1">{getBillingStatusIcon(entry.status)}</span>
                              {entry.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{entry.description}</p>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Date:</span>
                              <p className="text-gray-600">{entry.date.toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Due Date:</span>
                              <p className="text-gray-600">{entry.dueDate.toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Total Hours:</span>
                              <p className="text-gray-600">{entry.totalHours}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Total Amount:</span>
                              <p className="text-gray-900 font-semibold">{formatCurrency(entry.totalAmount)}</p>
                            </div>
                          </div>

                          {/* Lawyer Hours */}
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Lawyer Hours</span>
                              </div>
                              <div className="text-sm text-blue-800">
                                {entry.lawyerHours} hrs × {formatCurrency(entry.lawyerRate)}/hr = {formatCurrency(entry.lawyerHours * entry.lawyerRate)}
                              </div>
                            </div>
                          </div>

                          {/* Intern Hours */}
                          {entry.internEntries.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {entry.internEntries.map((internEntry, index) => (
                                <div key={index} className="p-3 bg-green-50 rounded-lg">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4 text-green-600" />
                                      <span className="text-sm font-medium text-green-900">{internEntry.intern.name}</span>
                                    </div>
                                    <div className="text-sm text-green-800">
                                      {internEntry.hoursBilled} hrs × {formatCurrency(internEntry.rate)}/hr = {formatCurrency(internEntry.hoursBilled * internEntry.rate)}
                                      {internEntry.hoursWorked !== internEntry.hoursBilled && (
                                        <span className="ml-2 text-xs text-green-600">
                                          ({internEntry.hoursWorked} worked)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Payment Information */}
                          {entry.status === 'paid' && entry.paidDate && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Paid on {entry.paidDate.toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {entry.notes && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                              <p className="text-sm text-yellow-800">{entry.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-3">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Task Creation Modal */}
      {onTaskCreate && currentUser && (
        <TaskCreationModal
          isOpen={isTaskModalOpen}
          onClose={handleTaskModalClose}
          onSubmit={handleTaskCreate}
          currentUser={currentUser}
          cases={[caseData]} // Only show current case
          users={users}
          editingTask={editingTask}
        />
      )}
    </div>
  );
};

export default CaseDetails;