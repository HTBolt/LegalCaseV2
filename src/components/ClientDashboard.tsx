import React, { useState } from 'react';
import { 
  Calendar, Clock, FileText, User, Scale, Building, AlertTriangle, 
  CheckCircle, Search, Filter, DollarSign, Users, ChevronRight,
  Eye, Calendar as CalendarIcon, MapPin
} from 'lucide-react';
import { Case, Task, Milestone, ClientInvoice, MeetingRequest, User as UserType, LawFirm } from '../types';

interface ClientDashboardProps {
  clientCases: Case[];
  clientTasks: Task[];
  milestones: Milestone[];
  invoices: ClientInvoice[];
  meetingRequests: MeetingRequest[];
  currentUser: UserType;
  firms: LawFirm[];
  onCaseSelect: (caseId: string) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ 
  clientCases, 
  clientTasks,
  milestones,
  invoices,
  meetingRequests,
  currentUser,
  firms,
  onCaseSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    lawyerName: '',
    firmName: '',
    caseType: '',
    opponentName: '',
    caseStatus: 'active'
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  const getDaysUntilHearing = (date: Date) => {
    const today = new Date();
    const hearing = new Date(date);
    const diffTime = hearing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate statistics
  const openCases = clientCases.filter(c => c.status === 'active').length;
  const pendingTasks = clientTasks.filter(t => t.status !== 'completed' && t.isClientVisible).length;
  const upcomingMeetings = meetingRequests.filter(m => 
    m.status === 'approved' && new Date(m.actualDate || m.requestedDate) >= new Date()
  ).length;
  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Get unique filter options
  const uniqueLawyers = [...new Set(clientCases.map(c => c.assignedLawyer.name))];
  const uniqueFirms = [...new Set(clientCases.map(c => {
    const firm = firms.find(f => f.id === c.assignedLawyer.firmId);
    return firm ? firm.name : 'Unknown Firm';
  }))];
  const uniqueCaseTypes = [...new Set(clientCases.map(c => c.caseType))];
  const uniqueOpponents = [...new Set(clientCases.map(c => c.opposingParty).filter(Boolean))];

  // Filter and search cases
  const filteredCases = clientCases.filter(caseItem => {
    const matchesSearch = searchTerm === '' || 
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assignedLawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caseItem.opposingParty && caseItem.opposingParty.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLawyer = filters.lawyerName === '' || caseItem.assignedLawyer.name === filters.lawyerName;
    const matchesFirm = filters.firmName === '' || 
      firms.find(f => f.id === caseItem.assignedLawyer.firmId)?.name === filters.firmName;
    const matchesCaseType = filters.caseType === '' || caseItem.caseType === filters.caseType;
    const matchesOpponent = filters.opponentName === '' || caseItem.opposingParty === filters.opponentName;
    const matchesStatus = filters.caseStatus === '' || caseItem.status === filters.caseStatus;
    
    return matchesSearch && matchesLawyer && matchesFirm && matchesCaseType && matchesOpponent && matchesStatus;
  });

  // Sort cases by next hearing date (closest first)
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (!a.nextHearingDate && !b.nextHearingDate) return 0;
    if (!a.nextHearingDate) return 1;
    if (!b.nextHearingDate) return -1;
    return new Date(a.nextHearingDate).getTime() - new Date(b.nextHearingDate).getTime();
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      lawyerName: '',
      firmName: '',
      caseType: '',
      opponentName: '',
      caseStatus: 'active'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Cases</h1>
              <p className="text-gray-600 text-sm sm:text-base">Welcome back, {currentUser.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 sm:p-3 rounded-lg">
                <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Open Cases</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{openCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-2 sm:p-3 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-500 p-2 sm:p-3 rounded-lg">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{upcomingMeetings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-500 p-2 sm:p-3 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900">Your Legal Cases</h3>
                <span className="text-sm text-gray-500">{sortedCases.length} case{sortedCases.length !== 1 ? 's' : ''} found</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search cases by title, type, lawyer, or opponent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                  value={filters.firmName}
                  onChange={(e) => setFilters({...filters, firmName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Firms</option>
                  {uniqueFirms.map(firm => (
                    <option key={firm} value={firm}>{firm}</option>
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
                  value={filters.caseStatus}
                  onChange={(e) => setFilters({...filters, caseStatus: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                  <option value="on-hold">On Hold</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Cases List */}
          {sortedCases.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No cases found matching your criteria</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedCases.map((caseItem) => {
                const daysUntilHearing = caseItem.nextHearingDate ? getDaysUntilHearing(caseItem.nextHearingDate) : null;
                const isUrgent = daysUntilHearing !== null && daysUntilHearing <= 7 && daysUntilHearing >= 0;
                const firm = firms.find(f => f.id === caseItem.assignedLawyer.firmId);
                
                return (
                  <div
                    key={caseItem.id}
                    onClick={() => onCaseSelect(caseItem.id)}
                    className={`p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isUrgent ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
                            {caseItem.title}
                          </h4>
                          {isUrgent && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Scale className="h-3 w-3" />
                            <span>{caseItem.caseType}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{caseItem.assignedLawyer.name}</span>
                          </div>
                          {firm && (
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span className="truncate">{firm.name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                          {caseItem.opposingParty && (
                            <span className="text-xs text-gray-500">
                              vs. {caseItem.opposingParty}
                            </span>
                          )}
                        </div>
                        
                        {caseItem.nextHearingDate && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <CalendarIcon className="h-3 w-3" />
                            <span className="truncate">Next hearing: {formatDate(caseItem.nextHearingDate)}</span>
                            {daysUntilHearing !== null && (
                              <span className={`${isUrgent ? 'text-yellow-700 font-medium' : ''}`}>
                                ({daysUntilHearing === 0 ? 'Today' : 
                                  daysUntilHearing === 1 ? 'Tomorrow' : 
                                  `${daysUntilHearing} days`})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;