import React from 'react';
import { Calendar, Users, AlertTriangle, Clock, FileText, ChevronRight, Edit } from 'lucide-react';
import { Case, User } from '../types';

interface CaseListProps {
  cases: Case[];
  onCaseSelect: (caseId: string) => void;
  title?: string;
  compact?: boolean;
  onCaseEdit?: (case_: Case) => void;
  currentUser?: User;
}

const CaseList: React.FC<CaseListProps> = ({ 
  cases, 
  onCaseSelect, 
  title = "Cases", 
  compact = false,
  onCaseEdit,
  currentUser
}) => {
  const sortedCases = [...cases].sort((a, b) => {
    if (!a.nextHearingDate && !b.nextHearingDate) return 0;
    if (!a.nextHearingDate) return 1;
    if (!b.nextHearingDate) return -1;
    return new Date(a.nextHearingDate).getTime() - new Date(b.nextHearingDate).getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getDaysUntilHearing = (date: Date) => {
    const today = new Date();
    const hearing = new Date(date);
    const diffTime = hearing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const canEditCase = (caseItem: Case) => {
    return currentUser && (
      currentUser.role === 'firm-admin' ||
      (currentUser.role === 'lawyer' && caseItem.assignedLawyer.id === currentUser.id)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">{cases.length} case{cases.length !== 1 ? 's' : ''}</span>
        </div>
        
        {sortedCases.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No cases available</p>
          </div>
        ) : (
          <div className={`space-y-3 ${compact ? 'max-h-96 overflow-y-auto' : ''}`}>
            {sortedCases.map((caseItem) => {
              const daysUntilHearing = caseItem.nextHearingDate ? getDaysUntilHearing(caseItem.nextHearingDate) : null;
              const isUrgent = daysUntilHearing !== null && daysUntilHearing <= 7 && daysUntilHearing >= 0;
              
              return (
                <div
                  key={caseItem.id}
                  onClick={() => onCaseSelect(caseItem.id)}
                  className={`p-3 sm:p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                    isUrgent ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
                          {caseItem.title}
                        </h4>
                        {isUrgent && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-3 text-sm text-gray-600">
                        <span className="truncate">{caseItem.client.name}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">{caseItem.caseType}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority} priority
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        {caseItem.nextHearingDate && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span className="truncate">Next hearing: {formatDate(caseItem.nextHearingDate)}</span>
                            {daysUntilHearing !== null && (
                              <span className={`${isUrgent ? 'text-yellow-700 font-medium' : ''}`}>
                                ({daysUntilHearing === 0 ? 'Today' : 
                                  daysUntilHearing === 1 ? 'Tomorrow' : 
                                  `${daysUntilHearing} days`})
                              </span>
                        <div className="flex items-center justify-between mb-2">
                          </div>
                        )}
                        
                          <div className="flex items-center space-x-2">
                            {isUrgent && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            )}
                            {canEditCase(caseItem) && onCaseEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCaseEdit(caseItem);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit case"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {caseItem.supportingInterns.length > 0 && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Users className="h-3 w-3" />
                            <span>{caseItem.supportingInterns.length} intern{caseItem.supportingInterns.length > 1 ? 's' : ''} assigned</span>
                          </div>
                        )}
                      </div>
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
  );
};

export default CaseList;