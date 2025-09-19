import React, { useState } from 'react';
import { 
  Calendar, Clock, FileText, User, Phone, Mail, MapPin, 
  Scale, Building, AlertTriangle, CheckCircle, Plus,
  MessageSquare, Download, Upload, Video, Send, Search,
  Filter, Eye, ChevronRight, Users, DollarSign
} from 'lucide-react';
import { Case, Task, Milestone, TimelineEvent, Document, ClientInvoice, MeetingRequest, User as UserType } from '../types';

interface ClientDashboardProps {
  clientCases: Case[];
  clientTasks: Task[];
  milestones: Milestone[];
  timelineEvents: TimelineEvent[];
  preEngagementEvents: TimelineEvent[];
  documents: Document[];
  invoices: ClientInvoice[];
  meetingRequests: MeetingRequest[];
  currentUser: UserType;
  onCaseSelect: (caseId: string) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ 
  clientCases, 
  clientTasks,
  milestones,
  timelineEvents,
  preEngagementEvents,
  documents,
  invoices,
  meetingRequests,
  currentUser,
  onCaseSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    lawyerName: '',
    lawFirmName: '',
    caseType: '',
    opponentName: '',
    status: 'active'
  });
  const [newMeetingRequest, setNewMeetingRequest] = useState({
    requestedDate: '',
    preferredTime: '',
    purpose: '',
    caseId: ''
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

  const handleMeetingRequest = () => {
    // In a real app, this would submit to an API
    console.log('Meeting request submitted:', newMeetingRequest);
    setNewMeetingRequest({ requestedDate: '', preferredTime: '', purpose: '', caseId: '' });
    setShowMeetingForm(false);
  };

  const clearFilters = () => {
    setFilters({
      lawyerName: '',
      lawFirmName: '',
      caseType: '',
      opponentName: '',
      status: 'active'
    });
    setSearchTerm('');
  };

  // Calculate dashboard stats
  const openCases = clientCases.filter(c => c.status === 'active').length;
  const pendingTasks = clientTasks.filter(t => t.status === 'pending').length;
  const upcomingMeetings = meetingRequests.filter(m => 
    m.status === 'approved' && m.actualDate && new Date(m.actualDate) >= new Date()
  ).length;
  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Get unique filter options
  const uniqueLawyers = [...new Set(clientCases.map(c => c.assignedLawyer.name))];
  const uniqueLawFirms = [...new Set(clientCases.map(c => {
    // In a real app, you'd have firm information in the case data
    return 'Law Firm'; // Placeholder - would need firm data
  }))];
  const uniqueCaseTypes = [...new Set(clientCases.map(c => c.caseType))];
  const uniqueOpponents = [...new Set(clientCases.map(c => c.opposingParty).filter(Boolean))];

  // Filter and search cases
  const filteredCases = clientCases.filter(caseItem => {
    const matchesSearch = !searchTerm || 
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assignedLawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caseItem.opposingParty && caseItem.opposingParty.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLawyer = !filters.lawyerName || caseItem.assignedLawyer.name === filters.lawyerName;
    const matchesCaseType = !filters.caseType || caseItem.caseType === filters.caseType;
    const matchesOpponent = !filters.opponentName || caseItem.opposingParty === filters.opponentName;
    const matchesStatus = !filters.status || caseItem.status === filters.status;
    
    return matchesSearch && matchesLawyer && matchesCaseType && matchesOpponent && matchesStatus;
  });

  // Sort cases by next hearing date (closest first)
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (!a.nextHearingDate && !b.nextHearingDate) return 0;
    if (!a.nextHearingDate) return 1;
    if (!b.nextHearingDate) return -1;
    return new Date(a.nextHearingDate).getTime() - new Date(b.nextHearingDate).getTime();
  });

  const getDaysUntilHearing = (date: Date) => {
    const today = new Date();
    const hearing = new Date(date);
    const diffTime = hearing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.name}</h1>
                <p className="text-gray-600">Manage your legal cases and stay updated on progress</p>
              </div>
              
              <button
                onClick={() => setShowMeetingForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Video className="h-4 w-4 mr-2" />
                Request Meeting
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">Open Cases</p>
                <p className="text-2xl font-bold text-gray-900">{openCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingMeetings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-500 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cases Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Cases</h3>
                <p className="text-sm text-gray-600 mt-1">{filteredCases.length} of {clientCases.length} cases shown</p>
              </div>
              
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
            
            {/* Search and Filters */}
            <div className="mt-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search cases by title, type, lawyer, or opponent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active Cases</option>
                  <option value="pending">Pending Cases</option>
                  <option value="closed">Closed Cases</option>
                  <option value="on-hold">On Hold Cases</option>
                </select>

                <select
                  value={filters.lawyerName}
                  onChange={(e) => setFilters({...filters, lawyerName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Lawyers</option>
                  {uniqueLawyers.map(lawyer => (
                    <option key={lawyer} value={lawyer}>{lawyer}</option>
                  ))}
                </select>

                <select
                  value={filters.caseType}
                  onChange={(e) => setFilters({...filters, caseType: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Case Types</option>
                  {uniqueCaseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  value={filters.opponentName}
                  onChange={(e) => setFilters({...filters, opponentName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Opponents</option>
                  {uniqueOpponents.map(opponent => (
                    <option key={opponent} value={opponent}>{opponent}</option>
                  ))}
                </select>

                <select
                  value={filters.lawFirmName}
                  onChange={(e) => setFilters({...filters, lawFirmName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Law Firms</option>
                  {uniqueLawFirms.map(firm => (
                    <option key={firm} value={firm}>{firm}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cases List */}
          <div className="divide-y divide-gray-200">
            {sortedCases.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No cases found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear filters to see all cases
                </button>
              </div>
            ) : (
              sortedCases.map((caseItem) => {
                const daysUntilHearing = caseItem.nextHearingDate ? getDaysUntilHearing(caseItem.nextHearingDate) : null;
                const isUrgent = daysUntilHearing !== null && daysUntilHearing <= 7 && daysUntilHearing >= 0;
                
                return (
                  <div
                    key={caseItem.id}
                    onClick={() => onCaseSelect(caseItem.id)}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isUrgent ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900 truncate">{caseItem.title}</h4>
                          {isUrgent && (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Case Type</label>
                            <p className="text-sm text-gray-900 mt-1">{caseItem.caseType}</p>
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lawyer</label>
                            <p className="text-sm text-gray-900 mt-1">{caseItem.assignedLawyer.name}</p>
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(caseItem.status)}`}>
                              {caseItem.status}
                            </span>
                          </div>
                          
                          {caseItem.opposingParty && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Opponent</label>
                              <p className="text-sm text-gray-900 mt-1">{caseItem.opposingParty}</p>
                            </div>
                          )}
                          
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Hearing</label>
                            {caseItem.nextHearingDate ? (
                              <div className="mt-1">
                                <p className="text-sm text-gray-900">{caseItem.nextHearingDate.toLocaleDateString()}</p>
                                {daysUntilHearing !== null && (
                                  <p className={`text-xs ${isUrgent ? 'text-yellow-700 font-medium' : 'text-gray-500'}`}>
                                    {daysUntilHearing === 0 ? 'Today' : 
                                     daysUntilHearing === 1 ? 'Tomorrow' : 
                                     daysUntilHearing > 0 ? `${daysUntilHearing} days` : 
                                     `${Math.abs(daysUntilHearing)} days ago`}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-1">Not scheduled</p>
                            )}
                          </div>
                        </div>

                        {/* Supporting Team */}
                        {caseItem.supportingInterns.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>Supporting team: {caseItem.supportingInterns.map(i => i.name).join(', ')}</span>
                          </div>
                        )}
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Meeting Request Modal */}
      {showMeetingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Request Meeting</h3>
                <button
                  onClick={() => setShowMeetingForm(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
                <select
                  value={newMeetingRequest.caseId}
                  onChange={(e) => setNewMeetingRequest({...newMeetingRequest, caseId: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a case</option>
                  {clientCases.filter(c => c.status === 'active').map(caseItem => (
                    <option key={caseItem.id} value={caseItem.id}>{caseItem.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={newMeetingRequest.requestedDate}
                    onChange={(e) => setNewMeetingRequest({...newMeetingRequest, requestedDate: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <select
                    value={newMeetingRequest.preferredTime}
                    onChange={(e) => setNewMeetingRequest({...newMeetingRequest, preferredTime: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
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
                  required
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={() => setShowMeetingForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMeetingRequest}
                  disabled={!newMeetingRequest.requestedDate || !newMeetingRequest.preferredTime || !newMeetingRequest.purpose || !newMeetingRequest.caseId}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4 mr-2 inline" />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;