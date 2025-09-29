// Mock data for Legal Case Management Application

export interface SystemConfig {
  appName: string;
  appSubtitle: string;
  version: string;
}

export const systemConfig: SystemConfig = {
  appName: 'LegalCase Pro',
  appSubtitle: 'Professional Case Management System',
  version: '1.0.0'
};

import { 
  User, 
  Case, 
  Task, 
  Milestone, 
  TimelineEvent, 
  Document, 
  Note, 
  BillingEntry,
  ClientInvoice,
  MeetingRequest,
  LawFirm,
  LawyerPerformance,
  Client
} from '../types';

// Helper function to find user by ID
const findUserById = (users: User[], id: string): User => {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }
  return user;
};

// Helper function to find users by IDs
const findUsersByIds = (users: User[], ids: string[]): User[] => {
  return ids.map(id => findUserById(users, id));
};

// Mock Users
export const mockUsers: User[] = [
  // System Admin
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@legalcase.com',
    role: 'system-admin',
    approvalStatus: 'approved',
    createdAt: new Date('2020-01-01'),
    lastLoginAt: new Date('2025-01-14')
  },
  // Firm Admin & Lawyer
  {
    id: '2',
    name: 'Robert Johnson',
    email: 'robert.johnson@johnsonlegal.com',
    role: 'firm-admin',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2020-01-15'),
    lastLoginAt: new Date('2025-01-14')
  },
  // Lawyers
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@johnsonlegal.com',
    role: 'lawyer',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2021-03-10'),
    lastLoginAt: new Date('2025-01-14')
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael.brown@smithlaw.com',
    role: 'lawyer',
    firmId: '2',
    approvalStatus: 'approved',
    createdAt: new Date('2021-06-15'),
    lastLoginAt: new Date('2025-01-13')
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily.davis@johnsonlegal.com',
    role: 'lawyer',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2022-01-20'),
    lastLoginAt: new Date('2025-01-14')
  },
  // Interns
  {
    id: '6',
    name: 'David Martinez',
    email: 'david.martinez@johnsonlegal.com',
    role: 'intern',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2024-09-01'),
    lastLoginAt: new Date('2025-01-14')
  },
  {
    id: '7',
    name: 'Jessica Garcia',
    email: 'jessica.garcia@smithlaw.com',
    role: 'intern',
    firmId: '2',
    approvalStatus: 'approved',
    createdAt: new Date('2024-09-01'),
    lastLoginAt: new Date('2025-01-13')
  },
  {
    id: '8',
    name: 'Alex Thompson',
    email: 'alex.thompson@johnsonlegal.com',
    role: 'intern',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2024-08-15'),
    lastLoginAt: new Date('2025-01-14')
  },
  // Clients
  {
    id: '9',
    name: 'James Miller',
    email: 'james.miller@email.com',
    role: 'client',
    approvalStatus: 'approved',
    createdAt: new Date('2024-02-15'),
    lastLoginAt: new Date('2025-01-14')
  },
  {
    id: '10',
    name: 'Linda Anderson',
    email: 'linda.anderson@email.com',
    role: 'client',
    approvalStatus: 'approved',
    createdAt: new Date('2024-03-20'),
    lastLoginAt: new Date('2025-01-13')
  },
  {
    id: '11',
    name: 'Chris Taylor',
    email: 'chris.taylor@email.com',
    role: 'client',
    approvalStatus: 'approved',
    createdAt: new Date('2024-04-10'),
    lastLoginAt: new Date('2025-01-14')
  },
  // Pending Users
  {
    id: '12',
    name: 'Amanda White',
    email: 'amanda.white@email.com',
    role: 'lawyer',
    firmId: '1',
    approvalStatus: 'pending',
    createdAt: new Date('2025-01-10')
  },
  {
    id: '13',
    name: 'Mark Johnson',
    email: 'mark.johnson@email.com',
    role: 'intern',
    firmId: '2',
    approvalStatus: 'pending',
    createdAt: new Date('2025-01-12')
  }
];

// Mock Law Firms
export const mockLawFirms: LawFirm[] = [
  {
    id: '1',
    name: 'Johnson Legal Associates',
    address: '123 Legal Street, Downtown, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@johnsonlegal.com',
    website: 'www.johnsonlegal.com',
    foundedYear: 1995,
    adminId: '2', // Robert Johnson
    members: ['2', '3', '5', '6', '8'], // Robert, Sarah, Emily, David, Alex
    pendingApprovals: ['12'], // Amanda White pending
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2025-01-14')
  },
  {
    id: '2',
    name: 'Smith & Associates Law Firm',
    address: '456 Justice Ave, Legal District, NY 10002',
    phone: '+1 (555) 987-6543',
    email: 'contact@smithlaw.com',
    website: 'www.smithlaw.com',
    foundedYear: 2001,
    adminId: '4', // Michael Brown (serves as both lawyer and admin)
    members: ['4', '7'], // Michael, Jessica
    pendingApprovals: ['13'], // Mark Johnson pending
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2025-01-13')
  }
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'James Miller',
    email: 'james.miller@email.com',
    phone: '+1 (555) 111-2222',
    address: '789 Client St, Residential, NY 10003',
    company: 'Miller Industries'
  },
  {
    id: '2',
    name: 'Linda Anderson',
    email: 'linda.anderson@email.com',
    phone: '+1 (555) 333-4444',
    address: '321 Anderson Ave, Suburb, NY 10004'
  },
  {
    id: '3',
    name: 'Chris Taylor',
    email: 'chris.taylor@email.com',
    phone: '+1 (555) 555-6666',
    address: '654 Taylor Rd, Uptown, NY 10005',
    company: 'Taylor Tech Solutions'
  },
  {
    id: '4',
    name: 'Patricia Wilson',
    email: 'patricia.wilson@email.com',
    phone: '+1 (555) 777-8888',
    address: '987 Wilson Way, Downtown, NY 10006'
  },
  {
    id: '5',
    name: 'Daniel Moore',
    email: 'daniel.moore@email.com',
    phone: '+1 (555) 999-0000',
    address: '147 Moore Manor, Estate, NY 10007',
    company: 'Moore Enterprises'
  }
];

// Now create cases with proper ID-based assignments
export const mockCases: Case[] = [
  {
    id: '1',
    title: 'Miller Industries Patent Dispute',
    clientId: '1',
    client: mockClients.find(c => c.id === '1')!,
    assignedLawyer: findUserById(mockUsers, '2'), // Robert Johnson
    supportingInterns: findUsersByIds(mockUsers, ['6', '8']), // David Martinez, Alex Thompson
    caseType: 'Intellectual Property',
    status: 'active',
    priority: 'high',
    nextHearingDate: new Date('2025-01-25'),
    courtStage: 'Discovery Phase',
    referredBy: 'Existing Client',
    judge: 'Hon. Patricia Williams',
    opposingParty: 'TechCorp Solutions',
    opposingCounsel: {
      name: 'Amanda Richardson',
      firm: 'Richardson & Partners',
      email: 'a.richardson@richardsonlaw.com',
      phone: '+1 (555) 234-5678'
    },
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2025-01-14'),
    billableHours: 85,
    totalRevenue: 42500,
    courtLevel: 'district',
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '2',
    title: 'Anderson Personal Injury Case',
    clientId: '2',
    client: mockClients.find(c => c.id === '2')!,
    assignedLawyer: findUserById(mockUsers, '3'), // Sarah Wilson
    supportingInterns: findUsersByIds(mockUsers, ['6']), // David Martinez
    caseType: 'Personal Injury',
    status: 'active',
    priority: 'medium',
    nextHearingDate: new Date('2025-02-10'),
    courtStage: 'Pre-trial Motions',
    referredBy: 'Bar Association',
    judge: 'Hon. Michael Chen',
    opposingParty: 'Metro Insurance Co.',
    opposingCounsel: {
      name: 'Thomas Bradley',
      firm: 'Bradley Insurance Defense',
      email: 't.bradley@bradleylaw.com',
      phone: '+1 (555) 345-6789'
    },
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2025-01-13'),
    billableHours: 65,
    totalRevenue: 32500,
    courtLevel: 'superior',
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '3',
    title: 'Taylor Tech Employment Discrimination',
    clientId: '3',
    client: mockClients.find(c => c.id === '3')!,
    assignedLawyer: findUserById(mockUsers, '5'), // Emily Davis
    supportingInterns: findUsersByIds(mockUsers, ['8']), // Alex Thompson
    caseType: 'Employment Law',
    status: 'active',
    priority: 'high',
    nextHearingDate: new Date('2025-01-30'),
    courtStage: 'Initial Filing',
    referredBy: 'Online Search',
    judge: 'Hon. Jennifer Lopez',
    opposingParty: 'TechStart Inc.',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-14'),
    billableHours: 45,
    totalRevenue: 22500,
    courtLevel: 'district',
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '4',
    title: 'Wilson Estate Planning',
    clientId: '4',
    client: mockClients.find(c => c.id === '4')!,
    assignedLawyer: findUserById(mockUsers, '4'), // Michael Brown (from Smith & Associates)
    supportingInterns: findUsersByIds(mockUsers, ['7']), // Jessica Garcia
    caseType: 'Estate Planning',
    status: 'active',
    priority: 'low',
    nextHearingDate: new Date('2025-02-15'),
    courtStage: 'Document Preparation',
    referredBy: 'Referral Network',
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2025-01-12'),
    billableHours: 25,
    totalRevenue: 12500,
    courtLevel: 'district',
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '5',
    title: 'Moore Enterprises Contract Dispute',
    clientId: '5',
    client: mockClients.find(c => c.id === '5')!,
    assignedLawyer: findUserById(mockUsers, '2'), // Robert Johnson
    supportingInterns: findUsersByIds(mockUsers, ['6']), // David Martinez
    caseType: 'Contract Law',
    status: 'closed',
    priority: 'medium',
    courtStage: 'Settlement',
    referredBy: 'Existing Client',
    outcome: 'settled',
    closedAt: new Date('2024-12-20'),
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-12-20'),
    billableHours: 95,
    totalRevenue: 47500,
    courtLevel: 'superior',
    opposingCounselHistory: [],
    judgeHistory: []
  }
];

// Mock Tasks with ID-based assignments
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Prepare Discovery Documents',
    description: 'Compile and review all discovery documents for the Miller patent case. Focus on prior art search and patent claim analysis.',
    caseId: '1',
    assignedTo: findUserById(mockUsers, '6'), // David Martinez
    assignedBy: findUserById(mockUsers, '2'), // Robert Johnson
    dueDate: new Date('2025-01-20'),
    priority: 'high',
    status: 'in-progress',
    type: 'document',
    createdAt: new Date('2025-01-10'),
    isClientVisible: false
  },
  {
    id: '2',
    title: 'Court Filing Deadline',
    description: 'Submit motion for summary judgment in Anderson personal injury case. All supporting documents must be included.',
    caseId: '2',
    assignedTo: findUserById(mockUsers, '3'), // Sarah Wilson
    assignedBy: findUserById(mockUsers, '3'), // Sarah Wilson (self-assigned)
    dueDate: new Date('2025-01-18'),
    priority: 'high',
    status: 'pending',
    type: 'filing',
    createdAt: new Date('2025-01-12'),
    isClientVisible: false
  },
  {
    id: '3',
    title: 'Client Meeting Preparation',
    description: 'Prepare agenda and supporting materials for client meeting regarding employment discrimination case strategy.',
    caseId: '3',
    assignedTo: findUserById(mockUsers, '8'), // Alex Thompson
    assignedBy: findUserById(mockUsers, '5'), // Emily Davis
    dueDate: new Date('2025-01-22'),
    priority: 'medium',
    status: 'pending',
    type: 'meeting',
    createdAt: new Date('2025-01-14'),
    isClientVisible: true
  },
  {
    id: '4',
    title: 'Legal Research - Employment Law',
    description: 'Research recent precedents in employment discrimination cases similar to Taylor Tech case. Focus on constructive discharge claims.',
    caseId: '3',
    assignedTo: findUserById(mockUsers, '8'), // Alex Thompson
    assignedBy: findUserById(mockUsers, '5'), // Emily Davis
    dueDate: new Date('2025-01-25'),
    priority: 'medium',
    status: 'in-progress',
    type: 'research',
    createdAt: new Date('2025-01-11'),
    isClientVisible: false
  },
  {
    id: '5',
    title: 'Estate Document Review',
    description: 'Review and finalize will documents for Wilson estate planning case. Ensure all beneficiary information is accurate.',
    caseId: '4',
    assignedTo: findUserById(mockUsers, '7'), // Jessica Garcia
    assignedBy: findUserById(mockUsers, '4'), // Michael Brown
    dueDate: new Date('2025-01-28'),
    priority: 'low',
    status: 'pending',
    type: 'document',
    createdAt: new Date('2025-01-13'),
    isClientVisible: false
  },
  {
    id: '6',
    title: 'Patent Prior Art Analysis',
    description: 'Analyze prior art references to strengthen patent validity arguments in Miller Industries case.',
    caseId: '1',
    assignedTo: findUserById(mockUsers, '8'), // Alex Thompson
    assignedBy: findUserById(mockUsers, '2'), // Robert Johnson
    dueDate: new Date('2025-01-24'),
    priority: 'high',
    status: 'pending',
    type: 'research',
    createdAt: new Date('2025-01-10'),
    isClientVisible: false
  },
  {
    id: '7',
    title: 'Update Client on Case Progress',
    description: 'Prepare weekly case update for Anderson personal injury case. Include settlement negotiation progress.',
    caseId: '2',
    assignedTo: findUserById(mockUsers, '3'), // Sarah Wilson
    assignedBy: findUserById(mockUsers, '3'), // Sarah Wilson (self-assigned)
    dueDate: new Date('2025-01-17'),
    priority: 'medium',
    status: 'completed',
    type: 'other',
    createdAt: new Date('2025-01-09'),
    isClientVisible: true
  },
  {
    id: '8',
    title: 'Deposition Preparation',
    description: 'Prepare questions and strategy for opposing party deposition in Taylor Tech employment case.',
    caseId: '3',
    assignedTo: findUserById(mockUsers, '5'), // Emily Davis
    assignedBy: findUserById(mockUsers, '5'), // Emily Davis (self-assigned)
    dueDate: new Date('2025-01-29'),
    priority: 'high',
    status: 'in-progress',
    type: 'other',
    createdAt: new Date('2025-01-08'),
    isClientVisible: false
  }
];

// Mock Milestones
export const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Patent Hearing - Miller Industries',
    description: 'Court hearing for patent validity in Miller Industries case',
    caseId: '1',
    date: new Date('2025-01-25'),
    type: 'court-appearance',
    status: 'upcoming',
    location: 'Federal Court, Room 302'
  },
  {
    id: '2',
    title: 'Settlement Conference - Anderson Case',
    description: 'Mediation conference for personal injury settlement',
    caseId: '2',
    date: new Date('2025-02-10'),
    type: 'meeting',
    status: 'upcoming',
    location: 'Mediation Center, Suite 150'
  },
  {
    id: '3',
    title: 'Employment Discrimination Hearing',
    description: 'Initial hearing for Taylor Tech employment discrimination case',
    caseId: '3',
    date: new Date('2025-01-30'),
    type: 'court-appearance',
    status: 'upcoming',
    location: 'District Court, Room 201'
  },
  {
    id: '4',
    title: 'Estate Planning Meeting',
    description: 'Final review meeting for Wilson estate documents',
    caseId: '4',
    date: new Date('2025-02-15'),
    type: 'meeting',
    status: 'upcoming',
    location: 'Office Conference Room'
  }
];

// Mock Timeline Events
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    caseId: '1',
    title: 'Case Filed',
    description: 'Initial patent dispute case filed against TechCorp Solutions',
    date: new Date('2024-10-15'),
    type: 'case-event',
    category: 'Filing'
  },
  {
    id: '2',
    caseId: '1',
    title: 'Discovery Phase Began',
    description: 'Started discovery phase including document requests and depositions',
    date: new Date('2024-11-01'),
    type: 'case-event',
    category: 'Discovery'
  },
  {
    id: '3',
    caseId: '2',
    title: 'Personal Injury Claim Filed',
    description: 'Filed personal injury claim against Metro Insurance Co.',
    date: new Date('2024-09-20'),
    type: 'case-event',
    category: 'Filing'
  },
  {
    id: '4',
    caseId: '2',
    title: 'Medical Records Obtained',
    description: 'Successfully obtained all relevant medical records for injury claim',
    date: new Date('2024-10-15'),
    type: 'case-event',
    category: 'Discovery'
  },
  {
    id: '5',
    caseId: '3',
    title: 'Employment Discrimination Complaint',
    description: 'Filed EEOC complaint for employment discrimination',
    date: new Date('2024-12-01'),
    type: 'case-event',
    category: 'Filing'
  }
];

// Mock Pre-engagement Events
export const mockPreEngagementEvents: TimelineEvent[] = [
  {
    id: '6',
    caseId: '1',
    title: 'Patent Application Filed',
    description: 'Client originally filed patent application with USPTO',
    date: new Date('2022-03-15'),
    type: 'client-event',
    category: 'Patent Filing'
  },
  {
    id: '7',
    caseId: '1',
    title: 'Patent Granted',
    description: 'USPTO granted patent to Miller Industries',
    date: new Date('2023-08-20'),
    type: 'client-event',
    category: 'Patent Grant'
  },
  {
    id: '8',
    caseId: '2',
    title: 'Workplace Incident',
    description: 'Original workplace accident that led to personal injury claim',
    date: new Date('2024-06-10'),
    type: 'client-event',
    category: 'Workplace Incident'
  },
  {
    id: '9',
    caseId: '3',
    title: 'Internal Complaint Filed',
    description: 'Client filed internal HR complaint before legal action',
    date: new Date('2024-09-15'),
    type: 'client-event',
    category: 'Internal Complaint'
  }
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: '1',
    caseId: '1',
    name: 'Patent Application Documents',
    type: 'application/pdf',
    size: 2045678,
    uploadedBy: findUserById(mockUsers, '2'), // Robert Johnson
    uploadedAt: new Date('2024-10-16'),
    url: '/documents/patent-app-miller.pdf',
    category: 'evidence',
    isClientVisible: true
  },
  {
    id: '2',
    caseId: '1',
    name: 'Prior Art Search Results',
    type: 'application/pdf',
    size: 1523456,
    uploadedBy: findUserById(mockUsers, '6'), // David Martinez
    uploadedAt: new Date('2024-11-02'),
    url: '/documents/prior-art-search.pdf',
    category: 'research',
    isClientVisible: false
  },
  {
    id: '3',
    caseId: '2',
    name: 'Medical Records',
    type: 'application/pdf',
    size: 3067890,
    uploadedBy: findUserById(mockUsers, '3'), // Sarah Wilson
    uploadedAt: new Date('2024-10-16'),
    url: '/documents/medical-records-anderson.pdf',
    category: 'evidence',
    isClientVisible: true
  },
  {
    id: '4',
    caseId: '2',
    name: 'Insurance Correspondence',
    type: 'application/pdf',
    size: 845123,
    uploadedBy: findUserById(mockUsers, '3'), // Sarah Wilson
    uploadedAt: new Date('2024-11-05'),
    url: '/documents/insurance-correspondence.pdf',
    category: 'correspondence',
    isClientVisible: false
  },
  {
    id: '5',
    caseId: '3',
    name: 'Employment Contract',
    type: 'application/pdf',
    size: 1234567,
    uploadedBy: findUserById(mockUsers, '5'), // Emily Davis
    uploadedAt: new Date('2024-12-02'),
    url: '/documents/employment-contract-taylor.pdf',
    category: 'evidence',
    isClientVisible: true
  }
];

// Mock Notes
export const mockNotes: Note[] = [
  {
    id: '1',
    caseId: '1',
    content: 'Client provided additional technical specifications that strengthen patent claims. Need to review with technical expert.',
    author: findUserById(mockUsers, '2'), // Robert Johnson
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
    isPrivate: false
  },
  {
    id: '2',
    caseId: '2',
    content: 'Insurance company showing willingness to negotiate. Client medical condition stable. Consider settlement range of $150K-$200K.',
    author: findUserById(mockUsers, '3'), // Sarah Wilson
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    isPrivate: true
  },
  {
    id: '3',
    caseId: '3',
    content: 'Client documented several instances of discriminatory behavior. Strong case for constructive discharge claim.',
    author: findUserById(mockUsers, '5'), // Emily Davis
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    isPrivate: false
  }
];

// Mock Billing Entries
export const mockBillingEntries: BillingEntry[] = [
  {
    id: '1',
    caseId: '1',
    date: new Date('2024-11-01'),
    description: 'Patent research and discovery document preparation - Miller Industries case',
    lawyerHours: 8.5,
    lawyerRate: 500,
    internEntries: [
      {
        intern: findUserById(mockUsers, '6'), // David Martinez
        hoursWorked: 12,
        hoursBilled: 10,
        rate: 150
      }
    ],
    totalHours: 18.5,
    totalAmount: 5750,
    dueDate: new Date('2024-12-01'),
    status: 'paid',
    invoiceNumber: 'INV-2024-001',
    paidDate: new Date('2024-11-28')
  },
  {
    id: '2',
    caseId: '2',
    date: new Date('2024-11-15'),
    description: 'Personal injury case preparation and client meetings - Anderson case',
    lawyerHours: 6.0,
    lawyerRate: 450,
    internEntries: [
      {
        intern: findUserById(mockUsers, '6'), // David Martinez
        hoursWorked: 8,
        hoursBilled: 6,
        rate: 150
      }
    ],
    totalHours: 12.0,
    totalAmount: 3600,
    dueDate: new Date('2024-12-15'),
    status: 'sent',
    invoiceNumber: 'INV-2024-002'
  },
  {
    id: '3',
    caseId: '3',
    date: new Date('2024-12-01'),
    description: 'Employment discrimination case initial preparation - Taylor Tech case',
    lawyerHours: 5.5,
    lawyerRate: 475,
    internEntries: [
      {
        intern: findUserById(mockUsers, '8'), // Alex Thompson
        hoursWorked: 6,
        hoursBilled: 5,
        rate: 150
      }
    ],
    totalHours: 10.5,
    totalAmount: 3362.50,
    dueDate: new Date('2025-01-01'),
    status: 'pending',
    invoiceNumber: 'INV-2024-003'
  }
];

// Mock Client Invoices
export const mockClientInvoices: ClientInvoice[] = [
  {
    id: '1',
    caseId: '1',
    date: new Date('2024-11-01'),
    description: 'Legal services for Patent Dispute - November 2024',
    totalAmount: 5750,
    dueDate: new Date('2024-12-01'),
    status: 'paid',
    invoiceNumber: 'INV-2024-001',
    paidDate: new Date('2024-11-28')
  },
  {
    id: '2',
    caseId: '2',
    date: new Date('2024-11-15'),
    description: 'Legal services for Personal Injury Case - November 2024',
    totalAmount: 3600,
    dueDate: new Date('2024-12-15'),
    status: 'sent',
    invoiceNumber: 'INV-2024-002'
  },
  {
    id: '3',
    caseId: '3',
    date: new Date('2024-12-01'),
    description: 'Legal services for Employment Discrimination - December 2024',
    totalAmount: 3362.50,
    dueDate: new Date('2025-01-01'),
    status: 'pending',
    invoiceNumber: 'INV-2024-003'
  }
];

// Mock Meeting Requests
export const mockMeetingRequests: MeetingRequest[] = [
  {
    id: '1',
    caseId: '1',
    clientId: '1',
    lawyerId: '2', // Robert Johnson
    requestedDate: new Date('2025-01-20'),
    preferredTime: '2:00 PM',
    purpose: 'Discuss patent hearing strategy and review discovery findings',
    status: 'approved',
    actualDate: new Date('2025-01-20'),
    createdAt: new Date('2025-01-10')
  },
  {
    id: '2',
    caseId: '2',
    clientId: '2',
    lawyerId: '3', // Sarah Wilson
    requestedDate: new Date('2025-01-18'),
    preferredTime: '10:00 AM',
    purpose: 'Review settlement offer from insurance company',
    status: 'approved',
    actualDate: new Date('2025-01-18'),
    createdAt: new Date('2025-01-12')
  },
  {
    id: '3',
    caseId: '3',
    clientId: '3',
    lawyerId: '5', // Emily Davis
    requestedDate: new Date('2025-01-25'),
    preferredTime: '3:00 PM',
    purpose: 'Prepare for employment discrimination hearing',
    status: 'pending',
    createdAt: new Date('2025-01-14')
  }
];

// Mock Law Firm (for single firm view)
export const mockLawFirm: LawFirm = mockLawFirms[0];

// Mock Lawyer Performance Data
export const mockLawyerPerformance: LawyerPerformance[] = [
  {
    lawyerId: '2',
    lawyer: findUserById(mockUsers, '2'), // Robert Johnson
    totalCases: 15,
    activeCases: 2,
    closedCases: 13,
    wonCases: 8,
    lostCases: 2,
    settledCases: 3,
    totalRevenue: 687500,
    billableHours: 1375,
    averageHourlyRate: 500,
    winRate: 85
  },
  {
    lawyerId: '3',
    lawyer: findUserById(mockUsers, '3'), // Sarah Wilson
    totalCases: 12,
    activeCases: 1,
    closedCases: 11,
    wonCases: 7,
    lostCases: 1,
    settledCases: 3,
    totalRevenue: 495000,
    billableHours: 1100,
    averageHourlyRate: 450,
    winRate: 91
  },
  {
    lawyerId: '5',
    lawyer: findUserById(mockUsers, '5'), // Emily Davis
    totalCases: 8,
    activeCases: 1,
    closedCases: 7,
    wonCases: 5,
    lostCases: 1,
    settledCases: 1,
    totalRevenue: 342500,
    billableHours: 725,
    averageHourlyRate: 475,
    winRate: 86
  },
  {
    lawyerId: '4',
    lawyer: findUserById(mockUsers, '4'), // Michael Brown
    totalCases: 10,
    activeCases: 1,
    closedCases: 9,
    wonCases: 6,
    lostCases: 2,
    settledCases: 1,
    totalRevenue: 425000,
    billableHours: 850,
    averageHourlyRate: 500,
    winRate: 78
  }
];