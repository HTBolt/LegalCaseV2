import React, { useState } from 'react';
import { 
  Calendar, Clock, FileText, User, Phone, Mail, MapPin, 
  Scale, Building, AlertTriangle, CheckCircle, Plus,
  MessageSquare, Download, Upload, Video, Send, ArrowLeft
} from 'lucide-react';
import { Case, Task, Milestone, TimelineEvent, Document, ClientInvoice, MeetingRequest, User as UserType } from '../types';

interface ClientCaseDetailsProps {
  clientCase: Case;
  clientTasks: Task[];
  milestones: Milestone[];
  timelineEvents: TimelineEvent[];
  preEngagementEvents: TimelineEvent[];
  documents: Document[];
  invoices: ClientInvoice[];
  meetingRequests: MeetingRequest[];
  currentUser: UserType;
  onBackToClientDashboard: () => void;
}

const ClientCaseDetails: React.FC<ClientCaseDetailsProps> = ({ 
  clientCase, 
  clientTasks,
  milestones,
  timelineEvents,
  preEngagementEvents,
  documents,
  invoices,
  meetingRequests,
  currentUser,
  onBackToClientDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'history' | 'documents' | 'invoices' | 'meetings'>('overview');
  const [newMeetingRequest, setNewMeetingRequest] = useState({
    requestedDate: '',
    preferredTime: '',
    purpose: ''
  });
  const [showMeetingForm, setShowMeetingForm] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on-hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
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

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMeetingRequest = () => {
    // In a real app, this would submit to an API
    console.log('Meeting request submitted:', newMeetingRequest);
    setNewMeetingRequest({ requestedDate: '', preferredTime: '', purpose: '' });
    setShowMeetingForm(false);
  };

  const upcomingMilestones = milestones
    .filter(m => new Date(m.date) >= new Date() && m.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const pendingInvoices = invoices.filter(i => i.status !== 'paid');
  const totalOutstanding = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'history', label: 'History' },
    { id: 'documents', label: 'Documents' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'meetings', label: 'Meetings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={onBackToClientDashboard}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to My Cases</span>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{clientCase.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                  <span>Case #{clientCase.id}</span>
                  <span>•</span>
                  <span>{clientCase.caseType}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(clientCase.status)}`}>
                    {clientCase.status}
                  </span>
                </div>
              </div>
              
              {clientCase.nextHearingDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="text-xs font-medium">Next Hearing</p>
                      <p className="text-sm">{formatDate(clientCase.nextHearingDate)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile-optimized tabs */}
            <div className="mt-4 overflow-x-auto">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Case Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Scale className="h-5 w-5 mr-2" />
                  Case Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Stage</label>
                    <p className="mt-1 text-sm text-gray-900">{clientCase.courtStage}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Case Type</label>
                    <p className="mt-1 text-sm text-gray-900">{clientCase.caseType}</p>
                  </div>
                  {clientCase.judge && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Assigned Judge</label>
                      <p className="mt-1 text-sm text-gray-900">{clientCase.judge}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Case Started</label>
                    <p className="mt-1 text-sm text-gray-900">{clientCase.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Your Tasks */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Your Action Items
                </h3>
                {clientTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No action items at this time</p>
                ) : (
                  <div className="space-y-3">
                    {clientTasks.map((task) => (
                      <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Due: {task.dueDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Opposing Counsel */}
              {clientCase.opposingCounsel && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Opposing Counsel
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Attorney</label>
                      <p className="mt-1 text-sm text-gray-900">{clientCase.opposingCounsel.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Law Firm</label>
                      <p className="mt-1 text-sm text-gray-900">{clientCase.opposingCounsel.firm}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Your Attorney */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Your Attorney
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{clientCase.assignedLawyer.name}</p>
                      <p className="text-xs text-gray-500">Lead Attorney</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{clientCase.assignedLawyer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </h3>
                {upcomingMilestones.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming events</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingMilestones.map((milestone) => (
                      <div key={milestone.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900">{milestone.title}</h4>
                        <p className="text-xs text-blue-700 mt-1">{formatDate(milestone.date)}</p>
                        {milestone.location && (
                          <div className="flex items-center space-x-1 mt-1 text-xs text-blue-600">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{milestone.location}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Outstanding Invoices */}
              {pendingInvoices.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    Outstanding Balance
                  </h3>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
                    <p className="text-sm text-gray-600">{pendingInvoices.length} unpaid invoice{pendingInvoices.length > 1 ? 's' : ''}</p>
                    <button className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Invoices
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Case Timeline</h3>
              <p className="text-sm text-gray-600 mt-1">Legal events since case began</p>
            </div>
            <div className="p-4 sm:p-6">
              {timelineEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No timeline events recorded</p>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {timelineEvents.map((event, index) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {index !== timelineEvents.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                              <Scale className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-sm text-gray-600">{event.description}</p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                {event.date.toLocaleDateString()}
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
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Case History</h3>
              <p className="text-sm text-gray-600 mt-1">Events before legal representation began</p>
            </div>
            <div className="p-4 sm:p-6">
              {preEngagementEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No historical events recorded</p>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {preEngagementEvents.map((event, index) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {index !== preEngagementEvents.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border-2 border-gray-300">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-sm text-gray-600">{event.description}</p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                {event.date.toLocaleDateString()}
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
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Case Documents</h3>
                  <p className="text-sm text-gray-600 mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''} available</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {documents.map((document) => (
                <div key={document.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded on {document.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors ml-3">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
              <p className="text-sm text-gray-600 mt-1">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total</p>
            </div>
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border self-start ${getInvoiceStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{invoice.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Date:</span>
                          <p className="text-gray-600">{invoice.date.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Due Date:</span>
                          <p className="text-gray-600">{invoice.dueDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Amount:</span>
                          <p className="text-gray-900 font-semibold">{formatCurrency(invoice.totalAmount)}</p>
                        </div>
                      </div>
                      {invoice.status === 'paid' && invoice.paidDate && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span>Paid on {invoice.paidDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="space-y-6">
            {/* Request New Meeting */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Request Meeting</h3>
                  <button
                    onClick={() => setShowMeetingForm(!showMeetingForm)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </button>
                </div>
              </div>
              
              {showMeetingForm && (
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                        <input
                          type="date"
                          value={newMeetingRequest.requestedDate}
                          onChange={(e) => setNewMeetingRequest({...newMeetingRequest, requestedDate: e.target.value})}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                        <select
                          value={newMeetingRequest.preferredTime}
                          onChange={(e) => setNewMeetingRequest({...newMeetingRequest, preferredTime: e.target.value})}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select time</option>
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Meeting</label>
                      <textarea
                        value={newMeetingRequest.purpose}
                        onChange={(e) => setNewMeetingRequest({...newMeetingRequest, purpose: e.target.value})}
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Please describe what you'd like to discuss..."
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => setShowMeetingForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleMeetingRequest}
                        disabled={!newMeetingRequest.requestedDate || !newMeetingRequest.preferredTime || !newMeetingRequest.purpose}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-4 w-4 mr-2 inline" />
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Meeting Requests History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Meeting History</h3>
                <p className="text-sm text-gray-600 mt-1">{meetingRequests.length} meeting request{meetingRequests.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="divide-y divide-gray-200">
                {meetingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No meeting requests yet</p>
                  </div>
                ) : (
                  meetingRequests.map((request) => (
                    <div key={request.id} className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              Meeting Request - {request.requestedDate.toLocaleDateString()}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border self-start ${getMeetingStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.purpose}</p>
                          <div className="text-xs text-gray-500">
                            <p>Requested: {request.preferredTime} on {request.requestedDate.toLocaleDateString()}</p>
                            <p>Submitted: {request.createdAt.toLocaleDateString()}</p>
                            {request.actualDate && (
                              <p>Scheduled: {request.actualDate.toLocaleDateString()}</p>
                            )}
                          </div>
                          {request.notes && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">{request.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCaseDetails;