export interface User {
  id: string;
  name: string;
  email: string;
  role: 'lawyer' | 'intern' | 'admin' | 'firm-admin' | 'client';
  firmId?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
}

export interface Case {
  id: string;
  title: string;
  clientId: string;
  client: Client;
  assignedLawyer: User;
  supportingInterns: User[];
  caseType: string;
  status: 'active' | 'pending' | 'closed' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  nextHearingDate?: Date;
  courtStage: string;
  referredBy: string;
  judge?: string;
  opposingCounsel?: {
    name: string;
    firm: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
  outcome?: 'won' | 'lost' | 'settled' | 'dismissed';
  closedAt?: Date;
  billableHours?: number;
  totalRevenue?: number;
  courtLevel?: 'district' | 'superior' | 'appellate' | 'supreme';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  caseId: string;
  assignedTo: User;
  assignedBy: User;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  type: 'filing' | 'research' | 'meeting' | 'court' | 'document' | 'other';
  createdAt: Date;
  isClientVisible?: boolean; // New field to determine if client can see this task
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  caseId: string;
  date: Date;
  type: 'court-appearance' | 'filing-deadline' | 'document-deadline' | 'meeting' | 'hearing';
  status: 'upcoming' | 'completed' | 'missed';
  location?: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  title: string;
  description: string;
  date: Date;
  type: 'case-event' | 'client-event';
  category: string;
  documents?: string[];
}

export interface Document {
  id: string;
  caseId: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
  url: string;
  category: 'pleading' | 'evidence' | 'correspondence' | 'research' | 'other';
  isClientVisible?: boolean; // New field to determine if client can see this document
}

export interface Note {
  id: string;
  caseId: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
}

export interface BillingEntry {
  id: string;
  caseId: string;
  date: Date;
  description: string;
  lawyerHours: number;
  lawyerRate: number;
  internEntries: {
    intern: User;
    hoursWorked: number;
    hoursBilled: number;
    rate: number;
  }[];
  totalHours: number;
  totalAmount: number;
  dueDate: Date;
  status: 'pending' | 'sent' | 'paid' | 'overdue' | 'disputed';
  invoiceNumber?: string;
  paidDate?: Date;
  notes?: string;
}

export interface ClientInvoice {
  id: string;
  caseId: string;
  date: Date;
  description: string;
  totalAmount: number;
  dueDate: Date;
  status: 'pending' | 'sent' | 'paid' | 'overdue' | 'disputed';
  invoiceNumber: string;
  paidDate?: Date;
}

export interface MeetingRequest {
  id: string;
  caseId: string;
  clientId: string;
  lawyerId: string;
  requestedDate: Date;
  preferredTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'declined' | 'completed';
  actualDate?: Date;
  notes?: string;
  createdAt: Date;
}

export interface LawFirm {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  foundedYear?: number;
}

export interface LawyerPerformance {
  lawyerId: string;
  lawyer: User;
  totalCases: number;
  activeCases: number;
  closedCases: number;
  wonCases: number;
  lostCases: number;
  settledCases: number;
  totalRevenue: number;
  billableHours: number;
  averageHourlyRate: number;
  winRate: number;
}