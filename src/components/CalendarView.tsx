import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Milestone } from '../types';

interface CalendarViewProps {
  milestones: Milestone[];
  compact?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ milestones, compact = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getMilestonesForDate = (day: number) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return milestones.filter(milestone => {
      const milestoneDate = new Date(milestone.date);
      return milestoneDate.toDateString() === dateToCheck.toDateString();
    });
  };

  const getNext15Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayMilestones = milestones.filter(milestone => {
        const milestoneDate = new Date(milestone.date);
        return milestoneDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date,
        milestones: dayMilestones,
        isToday: i === 0
      });
    }
    
    return days;
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'court-appearance':
        return <Calendar className="h-4 w-4" />;
      case 'filing-deadline':
        return <Clock className="h-4 w-4" />;
      case 'document-deadline':
        return <Clock className="h-4 w-4" />;
      case 'meeting':
        return <MapPin className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getMilestoneColor = (type: string, priority?: string) => {
    switch (type) {
      case 'court-appearance':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'filing-deadline':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'document-deadline':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (compact) {
    const next15Days = getNext15Days();
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next 15 Days</h3>
          <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
            {next15Days.map((day, index) => (
              <div key={index} className={`p-3 rounded-lg border ${day.isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${day.isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                    {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {day.isToday && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Today</span>}
                  </span>
                  {day.milestones.length > 0 && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {day.milestones.length} event{day.milestones.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {day.milestones.length > 0 ? (
                  <div className="space-y-2">
                    {day.milestones.map((milestone) => (
                      <div key={milestone.id} className={`flex items-center space-x-2 p-2 rounded border ${getMilestoneColor(milestone.type)}`}>
                        {getMilestoneIcon(milestone.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{milestone.title}</p>
                          {milestone.location && (
                            <p className="text-xs opacity-75 truncate">{milestone.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No events scheduled</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full calendar view - Mobile optimized
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-16 sm:h-24 p-1"></div>
          ))}
          {days.map((day) => {
            const dayMilestones = getMilestonesForDate(day);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            
            return (
              <div key={day} className={`h-16 sm:h-24 p-1 border border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                <div className={`text-xs sm:text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'} mb-1`}>
                  {day}
                </div>
                <div className="space-y-1 overflow-hidden">
                  {dayMilestones.slice(0, 1).map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`text-xs p-1 rounded truncate ${getMilestoneColor(milestone.type)}`}
                      title={`${milestone.title} ${milestone.location ? `- ${milestone.location}` : ''}`}
                    >
                      <span className="hidden sm:inline">{milestone.title}</span>
                      <span className="sm:hidden">•</span>
                    </div>
                  ))}
                  {dayMilestones.length > 1 && (
                    <div className="text-xs text-gray-500">
                      <span className="hidden sm:inline">+{dayMilestones.length - 1} more</span>
                      <span className="sm:hidden">+{dayMilestones.length - 1}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;