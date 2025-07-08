import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin, AlertCircle, 
  Filter, Eye, EyeOff, Scale, CheckSquare, Users, X, ExternalLink,
  FileText, User
} from 'lucide-react';
import { Milestone, Task } from '../types';

interface CalendarViewProps {
  milestones: Milestone[];
  tasks?: Task[];
  compact?: boolean;
  onEventClick?: (event: Milestone | Task, type: 'milestone' | 'task') => void;
  onCaseSelect?: (caseId: string) => void;
}

type ViewMode = 'month' | 'week' | 'day';
type FilterMode = 'all' | 'court-only' | 'tasks-only';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  type: 'milestone' | 'task';
  category: string;
  location?: string;
  priority?: string;
  status?: string;
  caseId?: string;
  assignedTo?: string;
  data: Milestone | Task;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  milestones, 
  tasks = [], 
  compact = false, 
  onEventClick,
  onCaseSelect
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Generate consistent times for events based on their ID and type
  const generateEventTime = (eventId: string, eventType: string) => {
    const hash = eventId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Court appearances typically in morning/afternoon
    if (eventType === 'court-appearance') {
      const hours = [9, 10, 11, 14, 15, 16];
      const hour = hours[Math.abs(hash) % hours.length];
      const minutes = [0, 15, 30, 45];
      const minute = minutes[Math.abs(hash >> 4) % minutes.length];
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    
    // Tasks can be any time during business hours
    const hour = 8 + (Math.abs(hash) % 10); // 8 AM to 5 PM
    const minute = Math.abs(hash >> 8) % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  // Convert milestones and tasks to unified calendar events
  const calendarEvents: CalendarEvent[] = [
    ...milestones.map(milestone => ({
      id: milestone.id,
      title: milestone.title,
      date: milestone.date,
      time: generateEventTime(milestone.id, milestone.type),
      type: 'milestone' as const,
      category: milestone.type,
      location: milestone.location,
      status: milestone.status,
      caseId: milestone.caseId,
      data: milestone
    })),
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      date: task.dueDate,
      time: generateEventTime(task.id, task.type),
      type: 'task' as const,
      category: task.type,
      priority: task.priority,
      status: task.status,
      caseId: task.caseId,
      assignedTo: task.assignedTo.name,
      data: task
    }))
  ];

  // Filter events based on filter mode
  const filteredEvents = calendarEvents.filter(event => {
    switch (filterMode) {
      case 'court-only':
        return event.type === 'milestone' && event.category === 'court-appearance';
      case 'tasks-only':
        return event.type === 'task';
      default:
        return true;
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      switch (viewMode) {
        case 'month':
          newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
          break;
        case 'week':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
          break;
        case 'day':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1));
          break;
      }
      return newDate;
    });
  };

  const getEventIcon = (event: CalendarEvent) => {
    if (event.type === 'milestone') {
      switch (event.category) {
        case 'court-appearance':
          return <Scale className="h-4 w-4" />;
        case 'filing-deadline':
        case 'document-deadline':
          return <Clock className="h-4 w-4" />;
        case 'meeting':
          return <Users className="h-4 w-4" />;
        default:
          return <Calendar className="h-4 w-4" />;
      }
    } else {
      return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.type === 'milestone') {
      switch (event.category) {
        case 'court-appearance':
          return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
        case 'filing-deadline':
        case 'document-deadline':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
        case 'meeting':
          return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      }
    } else {
      switch (event.priority) {
        case 'high':
          return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
        case 'medium':
          return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
        case 'low':
          return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      }
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    if (onEventClick) {
      onEventClick(event.data, event.type);
    }
  };

  const handleViewCase = (caseId: string) => {
    if (onCaseSelect) {
      onCaseSelect(caseId);
    }
    setSelectedEvent(null);
  };

  // Consistent function to get events for any date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    }).sort((a, b) => a.time!.localeCompare(b.time!));
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getCurrentPeriodLabel = () => {
    switch (viewMode) {
      case 'month':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'week':
        const weekDates = getWeekDates(currentDate);
        const start = weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const end = weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `${start} - ${end}, ${currentDate.getFullYear()}`;
      case 'day':
        return formatDate(currentDate);
    }
  };

  // Event Detail Modal with enhanced links
  const EventDetailModal = () => {
    if (!selectedEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${getEventColor(selectedEvent).split(' ')[0]} ${getEventColor(selectedEvent).split(' ')[1]}`}>
                  {getEventIcon(selectedEvent)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(selectedEvent.date)}</span>
            </div>
            
            {selectedEvent.time && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatTime(selectedEvent.time)}</span>
              </div>
            )}
            
            {selectedEvent.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{selectedEvent.location}</span>
              </div>
            )}
            
            {selectedEvent.assignedTo && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Assigned to: {selectedEvent.assignedTo}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium text-gray-700">Type:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(selectedEvent)}`}>
                {selectedEvent.type === 'milestone' ? 'Court Event' : 'Task'}
              </span>
            </div>
            
            {selectedEvent.type === 'task' && selectedEvent.priority && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium text-gray-700">Priority:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedEvent.priority === 'high' ? 'bg-red-100 text-red-800' :
                  selectedEvent.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedEvent.priority}
                </span>
              </div>
            )}
            
            {selectedEvent.status && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="text-gray-600">{selectedEvent.status}</span>
              </div>
            )}
            
            {selectedEvent.type === 'task' && 'description' in selectedEvent.data && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-600 mt-1">{(selectedEvent.data as Task).description}</p>
              </div>
            )}
            
            {selectedEvent.type === 'milestone' && 'description' in selectedEvent.data && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-600 mt-1">{(selectedEvent.data as Milestone).description}</p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              {selectedEvent.caseId && onCaseSelect && (
                <button
                  onClick={() => handleViewCase(selectedEvent.caseId!)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Case Details</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
              
              {selectedEvent.type === 'task' && (
                <button
                  onClick={() => {
                    // In real app, this would navigate to task details
                    console.log('Navigate to task details:', selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>View Task Details</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (compact) {
    const next15Days = [];
    const today = new Date();
    
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayEvents = getEventsForDate(date);
      
      next15Days.push({
        date,
        events: dayEvents,
        isToday: i === 0
      });
    }
    
    return (
      <>
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
                    {day.events.length > 0 && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {day.events.length} event{day.events.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {day.events.length > 0 ? (
                    <div className="space-y-2">
                      {day.events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`w-full flex items-center space-x-2 p-2 rounded border transition-colors ${getEventColor(event)}`}
                        >
                          {getEventIcon(event)}
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <div className="flex items-center space-x-2 text-xs opacity-75">
                              {event.time && (
                                <span>{formatTime(event.time)}</span>
                              )}
                              {event.location && (
                                <span className="truncate">{event.location}</span>
                              )}
                            </div>
                          </div>
                        </button>
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
        <EventDetailModal />
      </>
    );
  }

  // Full calendar view
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          {/* Header with controls */}
          <div className="flex flex-col space-y-4 mb-6">
            {/* Navigation and view controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 min-w-0">
                  {getCurrentPeriodLabel()}
                </h2>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Today
                </button>
              </div>
              
              {/* View mode selector */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                      viewMode === mode 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Show:</span>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  {([
                    { key: 'all', label: 'All', icon: Eye },
                    { key: 'court-only', label: 'Court', icon: Scale },
                    { key: 'tasks-only', label: 'Tasks', icon: CheckSquare }
                  ] as const).map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setFilterMode(filter.key)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        filterMode === filter.key 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <filter.icon className="h-3 w-3" />
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} shown
              </div>
            </div>
          </div>

          {/* Calendar content based on view mode */}
          {viewMode === 'month' && (
            <MonthView 
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
              getEventColor={getEventColor}
              getEventIcon={getEventIcon}
              getEventsForDate={getEventsForDate}
            />
          )}
          
          {viewMode === 'week' && (
            <WeekView 
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
              getEventColor={getEventColor}
              getEventIcon={getEventIcon}
              formatTime={formatTime}
              getEventsForDate={getEventsForDate}
              getWeekDates={getWeekDates}
            />
          )}
          
          {viewMode === 'day' && (
            <DayView 
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
              getEventColor={getEventColor}
              getEventIcon={getEventIcon}
              formatTime={formatTime}
              getEventsForDate={getEventsForDate}
            />
          )}
        </div>
      </div>
      <EventDetailModal />
    </>
  );
};

// Month View Component
const MonthView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventColor: (event: CalendarEvent) => string;
  getEventIcon: (event: CalendarEvent) => React.ReactNode;
  getEventsForDate: (date: Date) => CalendarEvent[];
}> = ({ currentDate, events, onEventClick, getEventColor, getEventIcon, getEventsForDate }) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <>
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
          <div key={`empty-${index}`} className="h-20 sm:h-32 p-1"></div>
        ))}
        {days.map((day) => {
          const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayEvents = getEventsForDate(dayDate);
          const isToday = new Date().toDateString() === dayDate.toDateString();
          
          return (
            <div key={day} className={`h-20 sm:h-32 p-1 border border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
              <div className={`text-xs sm:text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'} mb-1`}>
                {day}
              </div>
              <div className="space-y-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className={`w-full text-xs p-1 rounded truncate transition-colors ${getEventColor(event)}`}
                    title={`${event.title} ${event.time ? `at ${event.time}` : ''} ${event.location ? `- ${event.location}` : ''}`}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="flex-shrink-0">{getEventIcon(event)}</span>
                      <span className="truncate">{event.title}</span>
                    </div>
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// Enhanced Week View Component with time display
const WeekView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventColor: (event: CalendarEvent) => string;
  getEventIcon: (event: CalendarEvent) => React.ReactNode;
  formatTime: (time: string) => string;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getWeekDates: (date: Date) => Date[];
}> = ({ currentDate, events, onEventClick, getEventColor, getEventIcon, formatTime, getEventsForDate, getWeekDates }) => {
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 sm:gap-4">
      {weekDates.map((date, index) => {
        const dayEvents = getEventsForDate(date);
        const isToday = new Date().toDateString() === date.toDateString();
        const courtEvents = dayEvents.filter(e => e.type === 'milestone' && e.category === 'court-appearance');
        const taskEvents = dayEvents.filter(e => e.type === 'task');
        
        return (
          <div key={index} className={`p-3 rounded-lg border ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`text-sm font-medium mb-3 ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
              <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-lg">{date.getDate()}</div>
              {isToday && <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full mt-1">Today</div>}
            </div>
            
            <div className="space-y-2">
              {/* Court Appearances */}
              {courtEvents.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-red-700 mb-1 flex items-center">
                    <Scale className="h-3 w-3 mr-1" />
                    Court ({courtEvents.length})
                  </div>
                  {courtEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`w-full text-xs p-2 rounded border transition-colors ${getEventColor(event)}`}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        {getEventIcon(event)}
                        <span className="truncate font-medium">{event.title}</span>
                      </div>
                      <div className="text-xs opacity-75 space-y-1">
                        {event.time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(event.time)}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="truncate">{event.location}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Tasks */}
              {taskEvents.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-green-700 mb-1 flex items-center">
                    <CheckSquare className="h-3 w-3 mr-1" />
                    Tasks ({taskEvents.length})
                  </div>
                  {taskEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`w-full text-xs p-2 rounded border transition-colors ${getEventColor(event)}`}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        {getEventIcon(event)}
                        <span className="truncate font-medium">{event.title}</span>
                      </div>
                      <div className="text-xs opacity-75 space-y-1">
                        {event.time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(event.time)}</span>
                          </div>
                        )}
                        {event.assignedTo && (
                          <div className="truncate">Assigned: {event.assignedTo}</div>
                        )}
                      </div>
                    </button>
                  ))}
                  {taskEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{taskEvents.length - 3} more tasks
                    </div>
                  )}
                </div>
              )}
              
              {dayEvents.length === 0 && (
                <div className="text-xs text-gray-500 italic">No events</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Enhanced Day View Component with side-by-side columns and time display
const DayView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventColor: (event: CalendarEvent) => string;
  getEventIcon: (event: CalendarEvent) => React.ReactNode;
  formatTime: (time: string) => string;
  getEventsForDate: (date: Date) => CalendarEvent[];
}> = ({ currentDate, events, onEventClick, getEventColor, getEventIcon, formatTime, getEventsForDate }) => {
  const dayEvents = getEventsForDate(currentDate);

  const courtEvents = dayEvents.filter(e => e.type === 'milestone' && e.category === 'court-appearance');
  const otherMilestones = dayEvents.filter(e => e.type === 'milestone' && e.category !== 'court-appearance');
  const taskEvents = dayEvents.filter(e => e.type === 'task');

  const allCourtEvents = [...courtEvents, ...otherMilestones];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Court Appearances & Legal Events Column */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <Scale className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Court & Legal Events</h3>
          <span className="text-sm text-gray-500">({allCourtEvents.length})</span>
        </div>
        
        {allCourtEvents.length === 0 ? (
          <div className="text-center py-8">
            <Scale className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No court events scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allCourtEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className={`w-full p-4 rounded-lg border transition-colors text-left ${getEventColor(event)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    
                    <div className="space-y-1 mt-2 text-sm opacity-75">
                      {event.time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{formatTime(event.time)}</span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Status: {event.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tasks Column */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <CheckSquare className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tasks Due</h3>
          <span className="text-sm text-gray-500">({taskEvents.length})</span>
        </div>
        
        {taskEvents.length === 0 ? (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No tasks due today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {taskEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className={`w-full p-4 rounded-lg border transition-colors text-left ${getEventColor(event)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.priority === 'high' ? 'bg-red-100 text-red-800' :
                        event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.priority} priority
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mt-2 text-sm opacity-75">
                      {event.time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">Due: {formatTime(event.time)}</span>
                        </div>
                      )}
                      
                      {event.assignedTo && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Assigned: {event.assignedTo}</span>
                        </div>
                      )}
                    </div>
                    
                    {'description' in event.data && (
                      <p className="text-sm opacity-75 mt-2 line-clamp-2">
                        {(event.data as Task).description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;