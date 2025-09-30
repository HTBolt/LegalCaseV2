import React, { useState } from 'react';
import { 
  Building, DollarSign, Clock, Users, TrendingUp, Award, 
  FileText, Filter, Search, Calendar, MapPin, Scale,
  BarChart3, PieChart, Target, CheckCircle, XCircle,
  Handshake, AlertTriangle, User
} from 'lucide-react';
import { Case, Task, User as UserType, LawyerPerformance, LawFirm } from '../types';

interface FirmDashboardProps {
  cases: Case[];
  tasks: Task[];
  users: UserType[];
  lawyerPerformance: LawyerPerformance[];
  firmInfo: LawFirm;
  currentUser: UserType;
}

const FirmDashboard: React.FC<FirmDashboardProps> = ({ 
  cases = [], 
  tasks = [], 
  users = [], 
  lawyerPerformance = [],
  firmInfo = {} as LawFirm,
  currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'performance' | 'analytics'>('overview');
  const [caseFilters, setCaseFilters] = useState({
    lawyer: '',
    caseType: '',
    court: '',
    courtLevel: '',
    judge: '',
    outcome: '',
    status: 'closed'
  });

  // Filter data to only show current firm's information
  const firmUsers = users.filter(u => u.firmId === firmInfo.id);
  const firmLawyers = firmUsers.filter(u => u.role === 'lawyer' || u.role === 'firm-admin');
  const firmInterns = firmUsers.filter(u => u.role === 'intern');
  const firmCases = cases.filter(c => firmLawyers.some(lawyer => lawyer.id === c.assignedLawyer.id));
  const firmTasks = tasks.filter(t => firmUsers.some(user => user.id === t.assignedTo.id || user.id === t.assignedBy.id));
  const firmLawyerPerformance = lawyerPerformance.filter(p => firmLawyers.some(lawyer => lawyer.id === p.lawyerId));

  // Calculate firm-wide metrics
  const totalRevenue = firmCases.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
  const totalBillableHours = firmCases.reduce((sum, c) => sum + (c.billableHours || 0), 0);
  const activeCases = firmCases.filter(c => c.status === 'active').length;
  const closedCases = firmCases.filter(c => c.status === 'closed').length;
  const wonCases = firmCases.filter(c => c.outcome === 'won').length;
  const lostCases = firmCases.filter(c => c.outcome === 'lost').length;
  const settledCases = firmCases.filter(c => c.outcome === 'settled').length;
  const winRate = closedCases > 0 ? Math.round(((wonCases + settledCases) / closedCases) * 100) : 0;
  
  const lawyers = firmLawyers;
  const interns = firmInterns;
  const internTasks = firmTasks.filter(t => interns.some(i => i.id === t.assignedTo.id));

  // Filter closed cases based on criteria
  const filteredClosedCases = firmCases.filter(c => {
    if (c.status !== 'closed') return false;
    if (caseFilters.lawyer && c.assignedLawyer.id !== caseFilters.lawyer) return false;
    if (caseFilters.caseType && c.caseType !== caseFilters.caseType) return false;
    if (caseFilters.courtLevel && c.courtLevel !== caseFilters.courtLevel) return false;
    if (caseFilters.judge && c.judge !== caseFilters.judge) return false;
    if (caseFilters.outcome && c.outcome !== caseFilters.outcome) return false;
    return true;
  });

  // Get unique values for filters
  const uniqueCaseTypes = [...new Set(firmCases.map(c => c.caseType))];
  const uniqueCourtLevels = [...new Set(firmCases.map(c => c.courtLevel).filter(Boolean))];
  const uniqueJudges = [...new Set(firmCases.map(c => c.judge).filter(Boolean))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getOutcomeIcon = (outcome?: string) => {
    switch (outcome) {
      case 'won':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'lost':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'settled':
        return <Handshake className="h-4 w-4 text-blue-600" />;
      case 'dismissed':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'won':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'lost':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'settled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dismissed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'cases', label: 'Cases' },
    { id: 'performance', label: 'Performance' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Firm Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">{firmInfo.name}</p>
            </div>
            <div className="overflow-x-auto">
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
          <>
            {/* Key Metrics - Mobile optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 sm:p-3 rounded-lg">
                    <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 sm:p-3 rounded-lg">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Billable Hours</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalBillableHours.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-purple-500 p-2 sm:p-3 rounded-lg">
                    <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Active Cases</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{activeCases}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-2 sm:p-3 rounded-lg">
                    <Target className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Win Rate</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{winRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Overview - Mobile optimized */}
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Overview
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lawyers</span>
                      <span className="text-sm font-medium text-gray-900">{lawyers.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Interns</span>
                      <span className="text-sm font-medium text-gray-900">{interns.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Intern Tasks</span>
                      <span className="text-sm font-medium text-gray-900">{internTasks.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Cases per Lawyer</span>
                      <span className="text-sm font-medium text-gray-900">
                        {firmLawyers.length > 0 ? Math.round(firmCases.length / firmLawyers.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Hours per Case</span>
                      <span className="text-sm font-medium text-gray-900">
                        {firmCases.length > 0 ? Math.round(totalBillableHours / firmCases.length) : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Case Outcomes
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm text-gray-600">Won</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{wonCases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Handshake className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">Settled</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{settledCases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm text-gray-600">Lost</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{lostCases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{activeCases}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'cases' && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Completed Cases</h3>
                  <span className="text-sm text-gray-500">{filteredClosedCases.length} cases</span>
                </div>
                
                {/* Filters - Mobile optimized */}
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 sm:gap-4">
                  <select
                    value={caseFilters.lawyer}
                    onChange={(e) => setCaseFilters({...caseFilters, lawyer: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Lawyers</option>
                    {lawyers.map(lawyer => (
                      <option key={lawyer.id} value={lawyer.id}>{lawyer.name}</option>
                    ))}
                  </select>

                  <select
                    value={caseFilters.caseType}
                    onChange={(e) => setCaseFilters({...caseFilters, caseType: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Case Types</option>
                    {uniqueCaseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    value={caseFilters.courtLevel}
                    onChange={(e) => setCaseFilters({...caseFilters, courtLevel: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Court Levels</option>
                    {uniqueCourtLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>

                  <select
                    value={caseFilters.judge}
                    onChange={(e) => setCaseFilters({...caseFilters, judge: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Judges</option>
                    {uniqueJudges.map(judge => (
                      <option key={judge} value={judge}>{judge}</option>
                    ))}
                  </select>

                  <select
                    value={caseFilters.outcome}
                    onChange={(e) => setCaseFilters({...caseFilters, outcome: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Outcomes</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                    <option value="settled">Settled</option>
                    <option value="dismissed">Dismissed</option>
                  </select>

                  <button
                    onClick={() => setCaseFilters({
                      lawyer: '', caseType: '', court: '', courtLevel: '', judge: '', outcome: '', status: 'closed'
                    })}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredClosedCases.map((caseItem) => (
                  <div key={caseItem.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{caseItem.title}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border self-start ${getOutcomeColor(caseItem.outcome)}`}>
                            <span className="mr-1">{getOutcomeIcon(caseItem.outcome)}</span>
                            {caseItem.outcome || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Client:</span> <span className="truncate">{caseItem.client.name}</span>
                          </div>
                          <div>
                            <span className="font-medium">Lawyer:</span> {caseItem.assignedLawyer.name}
                          </div>
                          <div>
                            <span className="font-medium">Case Type:</span> {caseItem.caseType}
                          </div>
                          <div>
                            <span className="font-medium">Court Level:</span> {caseItem.courtLevel || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Judge:</span> {caseItem.judge || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Closed:</span> {caseItem.closedAt?.toLocaleDateString() || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Revenue:</span> {formatCurrency(caseItem.totalRevenue || 0)}
                          </div>
                          <div>
                            <span className="font-medium">Hours:</span> {caseItem.billableHours || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6 sm:space-y-8">
            {firmLawyerPerformance.map((performance) => (
              <div key={performance.lawyerId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{performance.lawyer.name}</h3>
                      <p className="text-sm text-gray-600">Senior Attorney</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{performance.totalCases}</div>
                      <div className="text-sm text-gray-600">Total Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(performance.totalRevenue)}</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{performance.billableHours}</div>
                      <div className="text-sm text-gray-600">Billable Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">{performance.winRate}%</div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-800">{performance.wonCases}</div>
                      <div className="text-sm text-green-600">Cases Won</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-800">{performance.settledCases}</div>
                      <div className="text-sm text-blue-600">Cases Settled</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-lg font-semibold text-red-800">{performance.lostCases}</div>
                      <div className="text-sm text-red-600">Cases Lost</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Revenue by Case Type
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {uniqueCaseTypes.filter(type => type).map(type => {
                    const typeRevenue = firmCases
                      .filter(c => c.caseType === type)
                      .reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
                    const percentage = totalRevenue > 0 ? Math.round((typeRevenue / totalRevenue) * 100) : 0;
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-900 truncate">{type}</span>
                            <span className="text-gray-600 ml-2">{formatCurrency(typeRevenue)} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Key Performance Indicators
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Revenue per Case</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(cases.length > 0 ? totalRevenue / cases.length : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Billable Hours per Case</span>
                    <span className="text-sm font-medium text-gray-900">
                      {cases.length > 0 ? Math.round(totalBillableHours / cases.length) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Hourly Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(totalBillableHours > 0 ? totalRevenue / totalBillableHours : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Case Closure Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {cases.length > 0 ? Math.round((closedCases / cases.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client Satisfaction (Win + Settle)</span>
                    <span className="text-sm font-medium text-gray-900">{winRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirmDashboard;