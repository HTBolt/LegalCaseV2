import { User, Client, Case, Task, Milestone, TimelineEvent, Document, Note, LawFirm, LawyerPerformance, BillingEntry, ClientInvoice, MeetingRequest } from '../types';

export const mockLawFirms: LawFirm[] = [
  {
    id: '1',
    name: 'Johnson & Associates Legal Group',
    address: '123 Legal Plaza, Suite 500, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@johnsonlegal.com',
    website: 'www.johnsonlegal.com',
    foundedYear: 1995,
    adminId: '4', // Robert Johnson
    members: ['1', '2', '3', '4', '9'], // Sarah, Michael, Emily, Robert, Jennifer
    pendingApprovals: [],
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '2',
    name: 'Martinez & Partners LLP',
    address: '456 Corporate Drive, Suite 200, Los Angeles, CA 90210',
    phone: '+1 (555) 987-6543',
    email: 'contact@martinezpartners.com',
    website: 'www.martinezpartners.com',
    foundedYear: 2010,
    adminId: '5', // David Martinez
    members: ['5', '7', '10'], // David Martinez, James Wilson, Mark Rodriguez
    pendingApprovals: [],
    createdAt: new Date('2020-06-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '3',
    name: 'Thompson Legal Services',
    address: '789 Business Blvd, Suite 300, Chicago, IL 60601',
    phone: '+1 (555) 456-7890',
    email: 'info@thompsonlegal.com',
    foundedYear: 2015,
    adminId: '11', // Patricia Thompson (pure admin)
    members: ['6', '8', '11'], // Lisa Thompson (lawyer), Amanda Davis, Patricia Thompson
    pendingApprovals: [],
    createdAt: new Date('2021-03-15'),
    updatedAt: new Date('2024-11-15')
  }
];

// For backward compatibility
export const mockLawFirm: LawFirm = mockLawFirms[0];

export const mockUsers: User[] = [
  // System Admin
  {
    id: 'system-admin-1',
    name: 'System Administrator',
    email: 'admin@legalcasepro.com',
    role: 'system-admin',
    approvalStatus: 'approved',
    createdAt: new Date('2020-01-01'),
    lastLoginAt: new Date('2025-01-13')
  },
  // Johnson & Associates Legal Group
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@johnsonlegal.com',
    role: 'lawyer',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2020-02-01'),
    lastLoginAt: new Date('2025-01-14')
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@johnsonlegal.com',
    role: 'intern',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2023-09-01'),
    lastLoginAt: new Date('2025-01-14')
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@johnsonlegal.com',
    role: 'intern',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2023-09-01'),
    lastLoginAt: new Date('2025-01-13')
  },
  {
    id: '4',
    name: 'Robert Johnson', 
    email: 'robert.johnson@johnsonlegal.com',
    role: 'firm-admin',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2020-01-15'),
    lastLoginAt: new Date('2025-01-14')
  },
  {
    id: '9',
    name: 'Jennifer Walsh',
    email: 'jennifer.walsh@johnsonlegal.com',
    role: 'lawyer',
    firmId: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2021-05-01'),
    lastLoginAt: new Date('2025-01-14')
  },
  // Martinez & Partners LLP
  {
    id: '5',
    name: 'David Martinez',
    email: 'david.martinez@martinezpartners.com',
    role: 'lawyer', // This user will be treated as both lawyer and firm-admin
    firmId: '2',
    approvalStatus: 'approved',
    createdAt: new Date('2020-06-01'),
    lastLoginAt: new Date('2025-01-12')
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james.wilson@martinezpartners.com',
    role: 'intern',
    firmId: '2',
    approvalStatus: 'approved',
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2025-01-10')
  },
  {
    id: '10',
    name: 'Mark Rodriguez',
    email: 'mark.rodriguez@martinezpartners.com',
    role: 'lawyer',
    firmId: '2',
    approvalStatus: 'approved',
    createdAt: new Date('2022-03-01'),
    lastLoginAt: new Date('2025-01-13')
  },
  // Thompson Legal Services
  {
    id: '6',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@thompsonlegal.com',
    role: 'lawyer',
    firmId: '3',
    approvalStatus: 'approved',
    createdAt: new Date('2021-03-15'),
    lastLoginAt: new Date('2025-01-11')
  },
  {
    id: '8',
    name: 'Amanda Davis',
    email: 'amanda.davis@thompsonlegal.com',
    role: 'intern',
    firmId: '3',
    approvalStatus: 'approved',
    createdAt: new Date('2024-06-01'),
    lastLoginAt: new Date('2025-01-09')
  },
  {
    id: '11',
    name: 'Patricia Thompson',
    email: 'patricia.thompson@thompsonlegal.com',
    role: 'firm-admin',
    firmId: '3',
    approvalStatus: 'approved',
    createdAt: new Date('2021-03-15'),
    lastLoginAt: new Date('2025-01-12')
  },
  // Pending Approvals - Examples
  {
    id: 'pending-lawyer-1',
    name: 'Jennifer Smith',
    email: 'jennifer.smith@email.com',
    role: 'lawyer',
    firmId: '1',
    approvalStatus: 'pending',
    createdAt: new Date('2025-01-10')
  },
  {
    id: 'pending-intern-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@student.edu',
    role: 'intern',
    firmId: '2',
    approvalStatus: 'pending',
    createdAt: new Date('2025-01-12')
  },
  // Client users
  {
    id: 'client-1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'client',
    associatedLawyerIds: ['1'], // Associated with Sarah Johnson
    invitedBy: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2024-08-01'),
    lastLoginAt: new Date('2025-01-14')
  },
  {
    id: 'client-2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    role: 'client',
    associatedLawyerIds: ['1'], // Associated with Sarah Johnson
    invitedBy: '1',
    approvalStatus: 'approved',
    createdAt: new Date('2024-09-15'),
    lastLoginAt: new Date('2025-01-13')
  },
  {
    id: 'client-3',
    name: 'Robert Wilson',
    email: 'robert.wilson@email.com',
    role: 'client',
    associatedLawyerIds: ['6'], // Associated with Lisa Thompson
    invitedBy: '6',
    approvalStatus: 'approved',
    createdAt: new Date('2024-10-01'),
    lastLoginAt: new Date('2025-01-12')
  }
];

// Update pending approvals in firms
mockLawFirms[0].pendingApprovals = ['pending-lawyer-1'];
mockLawFirms[1].pendingApprovals = ['pending-intern-1'];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Industries',
    email: 'legal@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    company: 'TechCorp Industries'
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Residential St, Los Angeles, CA 90001'
  },
  {
    id: '3',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 456-7890',
    address: '789 Oak Street, Chicago, IL 60601'
  },
  {
    id: '4',
    name: 'GlobalTech Solutions',
    email: 'legal@globaltech.com',
    phone: '+1 (555) 234-5678',
    address: '456 Corporate Blvd, San Francisco, CA 94105',
    company: 'GlobalTech Solutions'
  },
  {
    id: '5',
    name: 'Jennifer Brown',
    email: 'jennifer.brown@email.com',
    phone: '+1 (555) 345-6789',
    address: '321 Maple Ave, Boston, MA 02101'
  },
  {
    id: '6',
    name: 'Robert Wilson',
    email: 'robert.wilson@email.com',
    phone: '+1 (555) 567-8901',
    address: '654 Pine St, Seattle, WA 98101'
  },
  {
    id: '7',
    name: 'MedCorp Healthcare',
    email: 'legal@medcorp.com',
    phone: '+1 (555) 678-9012',
    address: '789 Health Plaza, Miami, FL 33101',
    company: 'MedCorp Healthcare'
  }
];

export const mockCases: Case[] = [
  // Sarah Johnson's cases
  {
    id: '1',
    title: 'TechCorp vs. DataSystems Patent Dispute',
    clientId: '1',
    client: mockClients[0],
    assignedLawyer: mockUsers[0],
    supportingInterns: [mockUsers[1]],
    caseType: 'Intellectual Property',
    status: 'active',
    priority: 'high',
    nextHearingDate: new Date('2025-07-03'),
    courtStage: 'Discovery Phase',
    referredBy: 'Existing Client',
    judge: 'Hon. Patricia Williams',
    courtLevel: 'district',
    opposingCounsel: {
      name: 'Robert Davis',
      firm: 'Davis & Associates',
      email: 'rdavis@davislaw.com',
      phone: '+1 (555) 234-5678'
    },
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2025-01-10'),
    billableHours: 145,
    totalRevenue: 72500,
    opposingCounselHistory: [
      {
        name: 'Robert Davis',
        firm: 'Davis & Associates',
        email: 'rdavis@davislaw.com',
        phone: '+1 (555) 234-5678',
        date: new Date('2024-08-15')
      }
    ],
    judgeHistory: [
      {
        name: 'Hon. Patricia Williams',
        date: new Date('2024-08-15')
      }
    ]
  },
  {
    id: '2',
    title: 'Smith Personal Injury Claim',
    clientId: '2',
    client: mockClients[1],
    assignedLawyer: mockUsers[0],
    supportingInterns: [mockUsers[2]],
    caseType: 'Personal Injury',
    status: 'active',
    priority: 'medium',
    nextHearingDate: new Date('2025-07-09'),
    courtStage: 'Pre-trial Motions',
    referredBy: 'Referral Network',
    judge: 'Hon. Mark Thompson',
    courtLevel: 'superior',
    opposingCounsel: {
      name: 'Lisa Martinez',
      firm: 'Martinez Legal Group',
      email: 'lmartinez@martinezlaw.com',
      phone: '+1 (555) 345-6789'
    },
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2025-01-08'),
    billableHours: 89,
    totalRevenue: 44500,
    opposingCounselHistory: [
      {
        name: 'Lisa Martinez',
        firm: 'Martinez Legal Group',
        email: 'lmartinez@martinezlaw.com',
        phone: '+1 (555) 345-6789',
        date: new Date('2024-09-01')
      }
    ],
    judgeHistory: [
      {
        name: 'Hon. Mark Thompson',
        date: new Date('2024-09-01')
      }
    ]
  },
  // Jennifer Walsh's cases (Lawyer at Johnson & Associates)
  {
    id: '13',
    title: 'Downtown Development Contract Review',
    clientId: '1',
    client: mockClients[0],
    assignedLawyer: mockUsers[4], // Jennifer Walsh (id: '9' in the array)
    supportingInterns: [mockUsers[1]], // Michael Chen
    caseType: 'Contract Law',
    status: 'active',
    priority: 'medium',
    nextHearingDate: new Date('2025-07-25'),
    courtStage: 'Contract Review',
    referredBy: 'Existing Client',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2025-01-12'),
    billableHours: 34,
    totalRevenue: 17000,
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '14',
    title: 'Metropolitan Housing Rights Case',
    clientId: '5',
    client: mockClients[4],
    assignedLawyer: mockUsers[4], // Jennifer Walsh
    supportingInterns: [mockUsers[2]], // Emily Rodriguez
    caseType: 'Real Estate Law',
    status: 'active',
    priority: 'high',
    nextHearingDate: new Date('2025-07-30'),
    courtStage: 'Preliminary Hearings',
    referredBy: 'Bar Association',
    judge: 'Hon. Rebecca Martinez',
    courtLevel: 'district',
    opposingCounsel: {
      name: 'Christopher Lee',
      firm: 'Lee & Associates',
      email: 'clee@leelaw.com',
      phone: '+1 (555) 678-9012'
    },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-13'),
    billableHours: 56,
    totalRevenue: 28000,
    opposingCounselHistory: [
      {
        name: 'Christopher Lee',
        firm: 'Lee & Associates', 
        email: 'clee@leelaw.com',
        phone: '+1 (555) 678-9012',
        date: new Date('2024-12-01')
      }
    ],
    judgeHistory: [
      {
        name: 'Hon. Rebecca Martinez',
        date: new Date('2024-12-01')
      }
    ]
  },
  {
    id: '3', 
    title: 'Garcia Employment Discrimination',
    clientId: '3',
    client: mockClients[2],
    assignedLawyer: mockUsers[0],
    supportingInterns: [mockUsers[1], mockUsers[2]],
    caseType: 'Employment Law',
    status: 'active',
    priority: 'high',
    nextHearingDate: new Date('2025-07-20'),
    courtStage: 'Mediation',
    referredBy: 'Bar Association',
    judge: 'Hon. Jennifer Lee',
    courtLevel: 'district',
    opposingCounsel: {
      name: 'Thomas Wilson',
      firm: 'Corporate Defense LLC',
      email: 'twilson@corpdefense.com',
      phone: '+1 (555) 567-8901'
    },
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2025-01-09'),
    billableHours: 67,
    totalRevenue: 33500,
    opposingCounselHistory: [
      {
        name: 'Thomas Wilson',
        firm: 'Corporate Defense LLC',
        email: 'twilson@corpdefense.com',
        phone: '+1 (555) 567-8901',
        date: new Date('2024-10-01')
      }
    ],
    judgeHistory: [
      {
        name: 'Hon. Jennifer Lee',
        date: new Date('2024-10-01')
      }
    ]
  },
  
  // David Martinez's cases
  {
    id: '4',
    title: 'GlobalTech Merger & Acquisition',
    clientId: '4',
    client: mockClients[3],
    assignedLawyer: mockUsers[4], // David Martinez
    supportingInterns: [mockUsers[6]],
    caseType: 'Corporate Law',
    status: 'active',
    priority: 'high',
    nextHearingDate: new Date('2025-07-15'),
    courtStage: 'Due Diligence',
    referredBy: 'Existing Client',
    judge: 'Hon. Michael Brown',
    courtLevel: 'superior',
    opposingCounsel: {
      name: 'Sarah Mitchell',
      firm: 'Mitchell & Partners',
      email: 'smitchell@mitchelllaw.com',
      phone: '+1 (555) 789-0123'
    },
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2025-01-12'),
    billableHours: 98,
    totalRevenue: 98000,
    opposingCounselHistory: [
      {
        name: 'Sarah Mitchell',
        firm: 'Mitchell & Partners',
        email: 'smitchell@mitchelllaw.com',
        phone: '+1 (555) 789-0123',
        date: new Date('2024-11-01')
      }
    ],
    judgeHistory: [
      {
        name: 'Hon. Michael Brown',
        date: new Date('2024-11-01')
      }
    ]
  },
  // Mark Rodriguez's cases (Lawyer at Martinez & Partners)
  {
    id: '15',
    title: 'Tech Startup IP Portfolio Review',
    clientId: '4',
    client: mockClients[3],
    assignedLawyer: mockUsers[9], // Mark Rodriguez (id: '10' but will be index 9)
    supportingInterns: [mockUsers[6]], // James Wilson
    caseType: 'Intellectual Property',
    status: 'active',
    priority: 'medium',
    nextHearingDate: new Date('2025-08-05'),
    courtStage: 'Portfolio Analysis',
    referredBy: 'Existing Client',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2025-01-14'),
    billableHours: 28,
    totalRevenue: 14000,
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '16',
    title: 'Employment Contract Negotiation',
    clientId: '5',
    client: mockClients[4],
    assignedLawyer: mockUsers[9], // Mark Rodriguez
    supportingInterns: [],
    caseType: 'Employment Law',
    status: 'active',
    priority: 'low',
    nextHearingDate: new Date('2025-08-10'),
    courtStage: 'Contract Finalization',
    referredBy: 'Referral Network',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-14'),
    billableHours: 15,
    totalRevenue: 7500,
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '5',
    title: 'Brown Family Custody Case',
    clientId: '5',
    client: mockClients[4],
    assignedLawyer: mockUsers[4], // David Martinez
    supportingInterns: [mockUsers[6]], // James Wilson (corrected index)
    caseType: 'Family Law',
    status: 'active',
    priority: 'medium',
    nextHearingDate: new Date('2025-07-12'),
    courtStage: 'Custody Evaluation',
    referredBy: 'Referral Network',
    judge: 'Hon. Susan Davis',
    courtLevel: 'district',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-11'),
    billableHours: 45,
    totalRevenue: 22500,
    opposingCounselHistory: [],
    judgeHistory: [
      {
        name: 'Hon. Susan Davis',
        date: new Date('2024-12-01')
      }
    ]
  },
  
  // Lisa Thompson's cases
  {
    id: '6',
    title: 'Wilson Real Estate Dispute',
    clientId: '6',
    client: mockClients[5],
    assignedLawyer: mockUsers[5], // Lisa Thompson
    supportingInterns: [mockUsers[7]], // Amanda Davis (id: '8' but index 7)
    caseType: 'Real Estate Law',
    status: 'active',
    priority: 'medium',
    nextHearingDate: new Date('2025-07-08'),
    courtStage: 'Discovery',
    referredBy: 'Bar Association',
    judge: 'Hon. Robert Garcia',
    courtLevel: 'district',
    opposingCounsel: {
      name: 'Kevin Johnson',
      firm: 'Johnson Real Estate Law',
      email: 'kjohnson@johnsonrelaw.com',
      phone: '+1 (555) 890-1234'
    },
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2025-01-13'),
    billableHours: 67,
    totalRevenue: 33500,
    opposingCounselHistory: [
      {
        name: 'Kevin Johnson',
        firm: 'Johnson Real Estate Law',
        email: 'kjohnson@johnsonrelaw.com',
        phone: '+1 (555) 890-1234',
        date: new Date('2024-10-15')
      }
    ],
    judgeHistory: [
      {
        name: 'Hon. Robert Garcia',
        date: new Date('2024-10-15')
      }
    ]
  },
  {
    id: '7',
    title: 'MedCorp Regulatory Compliance',
    clientId: '7',
    client: mockClients[6],
    assignedLawyer: mockUsers[5], // Lisa Thompson
    supportingInterns: [mockUsers[7]], // Amanda Davis
    caseType: 'Healthcare Law',
    status: 'active',
    priority: 'high',
    nextHearingDate: new Date('2025-07-18'),
    courtStage: 'Regulatory Review',
    referredBy: 'Existing Client',
    judge: 'Hon. Amanda Wilson',
    courtLevel: 'appellate',
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2025-01-14'),
    billableHours: 123,
    totalRevenue: 61500,
    opposingCounselHistory: [],
    judgeHistory: [
      {
        name: 'Hon. Amanda Wilson',
        date: new Date('2024-09-15')
      }
    ]
  },
  
  // Closed cases for analytics - distributed among lawyers
  {
    id: '8', 
    title: 'Anderson Contract Dispute',
    clientId: '1',
    client: mockClients[0],
    assignedLawyer: mockUsers[0], // Sarah Johnson
    supportingInterns: [mockUsers[1]],
    caseType: 'Contract Law',
    status: 'closed',
    priority: 'medium',
    courtStage: 'Settled',
    referredBy: 'Existing Client',
    judge: 'Hon. David Brown',
    courtLevel: 'district',
    outcome: 'settled',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-11-20'),
    closedAt: new Date('2024-11-20'),
    billableHours: 78,
    totalRevenue: 39000,
    opposingCounselHistory: [],
    judgeHistory: [
      {
        name: 'Hon. David Brown',
        date: new Date('2024-05-15')
      }
    ]
  },
  {
    id: '9',
    title: 'Thompson Family Law Case',
    clientId: '2',
    client: mockClients[1],
    assignedLawyer: mockUsers[4], // Jennifer Walsh
    supportingInterns: [],
    caseType: 'Family Law',
    status: 'closed',
    priority: 'low',
    courtStage: 'Final Judgment',
    referredBy: 'Referral Network',
    judge: 'Hon. Susan Miller',
    courtLevel: 'superior',
    outcome: 'won',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-09-15'),
    closedAt: new Date('2024-09-15'),
    billableHours: 45,
    totalRevenue: 22500,
    opposingCounselHistory: [],
    judgeHistory: [
      {
        name: 'Hon. Susan Miller',
        date: new Date('2024-03-10')
      }
    ]
  },
  {
    id: '10',
    title: 'Corporate Merger Review',
    clientId: '4',
    client: mockClients[3],
    assignedLawyer: mockUsers[4], // David Martinez
    supportingInterns: [mockUsers[6]], // James Wilson
    caseType: 'Corporate Law',
    status: 'closed',
    priority: 'high',
    courtStage: 'Completed',
    referredBy: 'Existing Client',
    outcome: 'won',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-06-30'),
    closedAt: new Date('2024-06-30'),
    billableHours: 156,
    totalRevenue: 156000,
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '11',
    title: 'IP Licensing Agreement Review',
    clientId: '7',
    client: mockClients[6],
    assignedLawyer: mockUsers[9], // Mark Rodriguez
    supportingInterns: [mockUsers[6]], // James Wilson
    caseType: 'Intellectual Property',
    status: 'closed',
    priority: 'medium',
    courtStage: 'Agreement Finalized',
    referredBy: 'Existing Client',
    outcome: 'won',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-08-15'),
    closedAt: new Date('2024-08-15'),
    billableHours: 89,
    totalRevenue: 89000,
    opposingCounselHistory: [],
    judgeHistory: []
  },
  {
    id: '12',
    title: 'Property Development Dispute',
    clientId: '6',
    client: mockClients[5],
    assignedLawyer: mockUsers[5], // Lisa Thompson
    supportingInterns: [mockUsers[7]], // Amanda Davis
    caseType: 'Real Estate Law',
    status: 'closed',
    priority: 'high',
    courtStage: 'Settlement Reached',
    referredBy: 'Bar Association',
    judge: 'Hon. Patricia Lee',
    courtLevel: 'superior',
    outcome: 'settled',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-10-30'),
    closedAt: new Date('2024-10-30'),
    billableHours: 112,
    totalRevenue: 56000,
    opposingCounselHistory: [],
    judgeHistory: [
      {
        name: 'Hon. Patricia Lee',
        date: new Date('2024-04-01')
      }
    ]
  },
  // Additional closed case for new lawyers
  {
    id: '17',
    title: 'Commercial Lease Dispute Resolution',
    clientId: '6',
    client: mockClients[5],
    assignedLawyer: mockUsers[4], // Jennifer Walsh
    supportingInterns: [mockUsers[1]], // Michael Chen
    caseType: 'Contract Law',
    status: 'closed',
    priority: 'medium',
    courtStage: 'Settlement Reached',
    referredBy: 'Bar Association',
    outcome: 'settled',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-12-15'),
    closedAt: new Date('2024-12-15'),
    billableHours: 67,
    totalRevenue: 33500,
    opposingCounselHistory: [],
    judgeHistory: []
  }
];

export const mockTasks: Task[] = [
  // Sarah Johnson's tasks
  {
    id: '1',
    title: 'File Motion for Summary Judgment',
    description: 'Prepare and file motion for summary judgment with supporting briefs',
    caseId: '1',
    assignedTo: mockUsers[0],
    assignedBy: mockUsers[0],
    dueDate: new Date('2025-06-29'),
    priority: 'high',
    status: 'in-progress',
    type: 'filing',
    createdAt: new Date('2025-01-05'),
    isClientVisible: false
  },
  {
    id: '2',
    title: 'Research Patent Precedents',
    description: 'Research similar patent dispute cases and precedents',
    caseId: '1',
    assignedTo: mockUsers[1],
    assignedBy: mockUsers[0],
    dueDate: new Date('2025-07-03'),
    priority: 'medium',
    status: 'pending',
    type: 'research',
    createdAt: new Date('2025-01-03'),
    isClientVisible: false
  },
  {
    id: '3',
    title: 'Prepare Witness Statements',
    description: 'Interview and prepare witness statements for the case',
    caseId: '2',
    assignedTo: mockUsers[0],
    assignedBy: mockUsers[0],
    dueDate: new Date('2025-07-05'),
    priority: 'high',
    status: 'pending',
    type: 'document',
    createdAt: new Date('2025-01-06'),
    isClientVisible: false
  },
  {
    id: '4',
    title: 'Draft Employment Contract Analysis',
    description: 'Analyze employment contract terms and conditions',
    caseId: '3',
    assignedTo: mockUsers[2],
    assignedBy: mockUsers[0],
    dueDate: new Date('2025-07-09'),
    priority: 'medium',
    status: 'in-progress',
    type: 'research',
    createdAt: new Date('2025-01-07'),
    isClientVisible: false
  },
  {
    id: '5',
    title: 'Prepare Mediation Brief',
    description: 'Prepare comprehensive brief for upcoming mediation session',
    caseId: '3',
    assignedTo: mockUsers[0],
    assignedBy: mockUsers[0],
    dueDate: new Date('2025-07-20'),
    priority: 'high',
    status: 'pending',
    type: 'document',
    createdAt: new Date('2025-01-08'),
    isClientVisible: false
  },
  
  // Jennifer Walsh's tasks (Lawyer at Johnson & Associates)
  {
    id: '13',
    title: 'Contract Terms Review',
    description: 'Review and analyze contract terms for development project',
    caseId: '13',
    assignedTo: mockUsers[4], // Jennifer Walsh
    assignedBy: mockUsers[4],
    dueDate: new Date('2025-07-25'),
    priority: 'medium',
    status: 'in-progress',
    type: 'document',
    createdAt: new Date('2025-01-12'),
    isClientVisible: false
  },
  {
    id: '14',
    title: 'Housing Rights Research',
    description: 'Research tenant rights and housing regulations',
    caseId: '14',
    assignedTo: mockUsers[2], // Emily Rodriguez
    assignedBy: mockUsers[4], // Jennifer Walsh
    dueDate: new Date('2025-07-28'),
    priority: 'high',
    status: 'pending',
    type: 'research',
    createdAt: new Date('2025-01-13'),
    isClientVisible: false
  },
  {
    id: '15',
    title: 'Tenant Interview Preparation',
    description: 'Prepare questions and schedule tenant interviews',
    caseId: '14',
    assignedTo: mockUsers[4], // Jennifer Walsh
    assignedBy: mockUsers[4],
    dueDate: new Date('2025-07-30'),
    priority: 'medium',
    status: 'pending',
    type: 'meeting',
    createdAt: new Date('2025-01-14'),
    isClientVisible: false
  },

  // Client-visible tasks for John Smith (Case 2)
  {
    id: 'client-1', 
    title: 'Provide Medical Records',
    description: 'Please provide all medical records related to your injury, including recent treatment reports',
    caseId: '2',
    assignedTo: mockUsers[8], // Client user
    assignedBy: mockUsers[0], // Sarah Johnson
    dueDate: new Date('2025-07-02'),
    priority: 'high',
    status: 'pending',
    type: 'document',
    createdAt: new Date('2025-01-15'),
    isClientVisible: true
  },
  {
    id: 'client-2',
    title: 'Review Settlement Proposal',
    description: 'Please review the settlement proposal from the insurance company and provide your feedback',
    caseId: '2',
    assignedTo: mockUsers[8], // Client user
    assignedBy: mockUsers[0], // Sarah Johnson
    dueDate: new Date('2025-07-08'),
    priority: 'medium',
    status: 'pending',
    type: 'other',
    createdAt: new Date('2025-01-18'),
    isClientVisible: true
  },
  
  // David Martinez's tasks
  {
    id: '6',
    title: 'Review Merger Documents',
    description: 'Comprehensive review of all merger and acquisition documents',
    caseId: '4',
    assignedTo: mockUsers[4],
    assignedBy: mockUsers[4],
    dueDate: new Date('2025-07-15'),
    priority: 'high',
    status: 'in-progress',
    type: 'document',
    createdAt: new Date('2025-01-10'),
    isClientVisible: false
  },
  {
    id: '7',
    title: 'Due Diligence Research',
    description: 'Conduct thorough due diligence research on target company',
    caseId: '4',
    assignedTo: mockUsers[6],
    assignedBy: mockUsers[4],
    dueDate: new Date('2025-07-12'),
    priority: 'high',
    status: 'pending',
    type: 'research',
    createdAt: new Date('2025-01-09'),
    isClientVisible: false
  },
  {
    id: '8',
    title: 'Custody Evaluation Preparation',
    description: 'Prepare documentation for child custody evaluation',
    caseId: '5',
    assignedTo: mockUsers[6], // James Wilson (corrected index)
    assignedBy: mockUsers[4],
    dueDate: new Date('2025-07-10'),
    priority: 'medium',
    status: 'in-progress',
    type: 'document',
    createdAt: new Date('2025-01-11'),
    isClientVisible: false
  },
  
  // Mark Rodriguez's tasks (Lawyer at Martinez & Partners)
  {
    id: '16',
    title: 'IP Portfolio Documentation',
    description: 'Document and organize intellectual property portfolio for startup',
    caseId: '15',
    assignedTo: mockUsers[9], // Mark Rodriguez
    assignedBy: mockUsers[9],
    dueDate: new Date('2025-08-05'),
    priority: 'medium',
    status: 'in-progress',
    type: 'document',
    createdAt: new Date('2025-01-15'),
    isClientVisible: false
  },
  {
    id: '17',
    title: 'Patent Search Analysis',
    description: 'Conduct comprehensive patent search for potential conflicts',
    caseId: '15',
    assignedTo: mockUsers[6], // James Wilson
    assignedBy: mockUsers[9], // Mark Rodriguez
    dueDate: new Date('2025-08-02'),
    priority: 'high',
    status: 'pending',
    type: 'research',
    createdAt: new Date('2025-01-16'),
    isClientVisible: false
  },
  {
    id: '18',
    title: 'Employment Contract Drafting',
    description: 'Draft employment contract with IP assignment clauses',
    caseId: '16',
    assignedTo: mockUsers[9], // Mark Rodriguez
    assignedBy: mockUsers[9],
    dueDate: new Date('2025-08-08'),
    priority: 'low',
    status: 'pending',
    type: 'document',
    createdAt: new Date('2025-01-17'),
    isClientVisible: false
  },

  // Lisa Thompson's tasks
  {
    id: '9',
    title: 'Property Title Research',
    description: 'Research property title history and potential issues',
    caseId: '6',
    assignedTo: mockUsers[7], // Amanda Davis (corrected index)
    assignedBy: mockUsers[5],
    dueDate: new Date('2025-07-08'),
    priority: 'medium',
    status: 'pending',
    type: 'research',
    createdAt: new Date('2025-01-12'),
    isClientVisible: false
  },
  {
    id: '10',
    title: 'Regulatory Compliance Review',
    description: 'Review healthcare regulations and compliance requirements',
    caseId: '7',
    assignedTo: mockUsers[5],
    assignedBy: mockUsers[5],
    dueDate: new Date('2025-07-18'),
    priority: 'high',
    status: 'in-progress',
    type: 'research',
    createdAt: new Date('2025-01-13'),
    isClientVisible: false
  },
  {
    id: '11',
    title: 'FDA Documentation Preparation',
    description: 'Prepare all required FDA documentation and submissions',
    caseId: '7',
    assignedTo: mockUsers[7], // Amanda Davis (corrected index)
    assignedBy: mockUsers[5],
    dueDate: new Date('2025-07-16'),
    priority: 'high',
    status: 'pending',
    type: 'filing',
    createdAt: new Date('2025-01-14'),
    isClientVisible: false
  },
  // Additional tasks for comprehensive data
  {
    id: '19',
    title: 'Healthcare Compliance Audit',
    description: 'Conduct comprehensive compliance audit for MedCorp',
    caseId: '7',
    assignedTo: mockUsers[5], // Lisa Thompson
    assignedBy: mockUsers[5],
    dueDate: new Date('2025-07-22'),
    priority: 'high',
    status: 'pending',
    type: 'research',
    createdAt: new Date('2025-01-18'),
    isClientVisible: false
  },
  {
    id: '20',
    title: 'Real Estate Documentation Review',
    description: 'Review all property documentation for Wilson case',
    caseId: '6',
    assignedTo: mockUsers[5], // Lisa Thompson
    assignedBy: mockUsers[5],
    dueDate: new Date('2025-07-06'),
    priority: 'medium',
    status: 'in-progress',
    type: 'document',
    createdAt: new Date('2025-01-19'),
    isClientVisible: false
  }
];

export const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Summary Judgment Hearing',
    description: 'Court hearing for motion for summary judgment',
    caseId: '1',
    date: new Date('2025-07-03'),
    type: 'court-appearance',
    status: 'upcoming',
    location: 'Courtroom 3A, District Court'
  },
  {
    id: '2',
    title: 'Discovery Deadline',
    description: 'Final deadline for discovery submissions',
    caseId: '1',
    date: new Date('2025-06-29'),
    type: 'filing-deadline',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Mediation Session',
    description: 'Court-ordered mediation session',
    caseId: '2',
    date: new Date('2025-07-09'),
    type: 'meeting',
    status: 'upcoming',
    location: 'Mediation Center, Downtown'
  },
  {
    id: '4',
    title: 'Employment Mediation',
    description: 'Mediation session for employment discrimination case',
    caseId: '3',
    date: new Date('2025-07-20'),
    type: 'meeting',
    status: 'upcoming',
    location: 'Labor Relations Board'
  },
  {
    id: '5',
    title: 'Expert Witness Deposition',
    description: 'Deposition of technical expert witness',
    caseId: '1',
    date: new Date('2025-07-05'),
    type: 'meeting',
    status: 'upcoming',
    location: 'Law Office Conference Room'
  },
  {
    id: '6',
    title: 'Medical Records Filing',
    description: 'Deadline to file medical records and reports',
    caseId: '2',
    date: new Date('2025-07-05'),
    type: 'document-deadline',
    status: 'upcoming'
  },
  {
    id: '7',
    title: 'Pre-trial Conference',
    description: 'Pre-trial conference with judge',
    caseId: '2',
    date: new Date('2025-07-09'),
    type: 'court-appearance',
    status: 'upcoming',
    location: 'Courtroom 5B, Superior Court'
  },
  {
    id: '8',
    title: 'EEOC Response Deadline',
    description: 'Deadline to respond to EEOC findings',
    caseId: '3',
    date: new Date('2025-06-29'),
    type: 'filing-deadline',
    status: 'upcoming'
  },
  {
    id: '9',
    title: 'Client Meeting',
    description: 'Strategy meeting with TechCorp executives',
    caseId: '1',
    date: new Date('2025-07-03'),
    type: 'meeting',
    status: 'upcoming',
    location: 'TechCorp Headquarters'
  },
  {
    id: '10',
    title: 'Settlement Conference',
    description: 'Court-ordered settlement conference',
    caseId: '3',
    date: new Date('2025-07-20'),
    type: 'court-appearance',
    status: 'upcoming',
    location: 'Courtroom 2C, Federal Court'
  },
  
  // Jennifer Walsh's case milestones
  {
    id: '15',
    title: 'Contract Review Meeting',
    description: 'Final contract review meeting with development team',
    caseId: '13',
    date: new Date('2025-07-25'),
    type: 'meeting',
    status: 'upcoming',
    location: 'TechCorp Conference Room'
  },
  {
    id: '16',
    title: 'Housing Rights Hearing',
    description: 'Preliminary hearing for housing rights case',
    caseId: '14',
    date: new Date('2025-07-30'),
    type: 'court-appearance',
    status: 'upcoming',
    location: 'Housing Court, Courtroom 1A'
  },

  // David Martinez's case milestones (Lawyer + Firm Admin)
  {
    id: '11',
    title: 'Merger Closing Meeting',
    description: 'Final closing meeting for merger transaction',
    caseId: '4',
    date: new Date('2025-07-15'),
    type: 'meeting',
    status: 'upcoming',
    location: 'GlobalTech Headquarters'
  },
  {
    id: '12',
    title: 'Custody Hearing',
    description: 'Child custody hearing',
    caseId: '5',
    date: new Date('2025-07-12'),
    type: 'court-appearance',
    status: 'upcoming',
    location: 'Family Court, Courtroom 2A'
  },

  // Mark Rodriguez's case milestones
  {
    id: '17',
    title: 'IP Portfolio Review Meeting',
    description: 'Review intellectual property portfolio with startup executives',
    caseId: '15',
    date: new Date('2025-08-05'),
    type: 'meeting',
    status: 'upcoming',
    location: 'Startup Headquarters'
  },
  {
    id: '18',
    title: 'Employment Contract Finalization',
    description: 'Finalize employment contract terms',
    caseId: '16',
    date: new Date('2025-08-10'),
    type: 'meeting',
    status: 'upcoming',
    location: 'Martinez & Partners Office'
  },

  // Lisa Thompson's case milestones
  {
    id: '13',
    title: 'Property Inspection',
    description: 'Court-ordered property inspection',
    caseId: '6',
    date: new Date('2025-07-08'),
    type: 'meeting',
    status: 'upcoming',
    location: '654 Pine St, Seattle, WA'
  },
  {
    id: '14',
    title: 'FDA Compliance Review',
    description: 'FDA regulatory compliance review meeting',
    caseId: '7',
    date: new Date('2025-07-18'),
    type: 'meeting',
    status: 'upcoming',
    location: 'FDA Regional Office'
  }
];

export const mockTimelineEvents: TimelineEvent[] = [
  // Post-engagement events (after lawyer was hired)
  {
    id: '1',
    caseId: '1',
    title: 'Case Filed',
    description: 'Initial complaint filed with the court',
    date: new Date('2024-08-15'),
    type: 'case-event',
    category: 'Filing'
  },
  {
    id: '2',
    caseId: '1',
    title: 'Defendant Response',
    description: 'Defendant filed answer to complaint',
    date: new Date('2024-09-15'),
    type: 'case-event',
    category: 'Filing'
  },
  {
    id: '3',
    caseId: '1',
    title: 'Discovery Commenced',
    description: 'Discovery phase officially began',
    date: new Date('2024-10-01'),
    type: 'case-event',
    category: 'Procedural'
  },
  {
    id: '4',
    caseId: '2',
    title: 'Personal Injury Claim Filed',
    description: 'Filed personal injury claim with insurance company',
    date: new Date('2024-09-01'),
    type: 'case-event',
    category: 'Filing'
  },
  {
    id: '5',
    caseId: '3',
    title: 'EEOC Complaint Filed',
    description: 'Filed discrimination complaint with EEOC',
    date: new Date('2024-10-01'),
    type: 'case-event',
    category: 'Filing'
  }
];

// Pre-engagement timeline events (client's history before hiring lawyer)
export const mockPreEngagementEvents: TimelineEvent[] = [
  // TechCorp case pre-engagement events
  {
    id: 'pre-1',
    caseId: '1',
    title: 'Patent Application Filed',
    description: 'TechCorp filed original patent application for the disputed technology',
    date: new Date('2022-03-15'),
    type: 'client-event',
    category: 'Patent Filing',
    url: 'https://drive.google.com/file/d/example-patent-application'
  },
  {
    id: 'pre-2',
    caseId: '1',
    title: 'Patent Granted',
    description: 'USPTO granted patent to TechCorp after examination',
    date: new Date('2023-01-20'),
    type: 'client-event',
    category: 'Patent Grant',
    url: 'https://drive.google.com/file/d/example-patent-grant'
  },
  {
    id: 'pre-3',
    caseId: '1',
    title: 'Infringement Discovered',
    description: 'TechCorp discovered DataSystems was using patented technology without license',
    date: new Date('2024-05-10'),
    type: 'client-event',
    category: 'Discovery'
  },
  {
    id: 'pre-4',
    caseId: '1',
    title: 'Cease and Desist Sent',
    description: 'TechCorp sent cease and desist letter to DataSystems',
    date: new Date('2024-06-01'),
    type: 'client-event',
    category: 'Correspondence'
  },
  {
    id: 'pre-5',
    caseId: '1',
    title: 'Settlement Negotiations Failed',
    description: 'DataSystems rejected settlement offer and disputed patent validity',
    date: new Date('2024-07-15'),
    type: 'client-event',
    category: 'Negotiation'
  },
  
  // Personal injury case pre-engagement events
  {
    id: 'pre-6',
    caseId: '2',
    title: 'Accident Occurred',
    description: 'Motor vehicle accident at intersection of Main St and Oak Ave',
    date: new Date('2024-06-15'),
    type: 'client-event',
    category: 'Incident'
  },
  {
    id: 'pre-7',
    caseId: '2',
    title: 'Emergency Medical Treatment',
    description: 'Client transported to hospital and treated for injuries',
    date: new Date('2024-06-15'),
    type: 'client-event',
    category: 'Medical'
  },
  {
    id: 'pre-8',
    caseId: '2',
    title: 'Insurance Claim Filed',
    description: 'Client filed claim with opposing party\'s insurance company',
    date: new Date('2024-06-20'),
    type: 'client-event',
    category: 'Insurance'
  },
  {
    id: 'pre-9',
    caseId: '2',
    title: 'Settlement Offer Received',
    description: 'Insurance company offered inadequate settlement amount',
    date: new Date('2024-08-10'),
    type: 'client-event',
    category: 'Settlement'
  },
  
  // Employment discrimination case pre-engagement events
  {
    id: 'pre-10',
    caseId: '3',
    title: 'Discriminatory Treatment Began',
    description: 'Client experienced workplace discrimination based on gender',
    date: new Date('2024-01-15'),
    type: 'client-event',
    category: 'Workplace Incident'
  },
  {
    id: 'pre-11',
    caseId: '3',
    title: 'HR Complaint Filed',
    description: 'Client filed formal complaint with Human Resources department',
    date: new Date('2024-03-01'),
    type: 'client-event',
    category: 'Internal Complaint'
  },
  {
    id: 'pre-12',
    caseId: '3',
    title: 'Retaliation Occurred',
    description: 'Client faced retaliation after filing HR complaint',
    date: new Date('2024-04-15'),
    type: 'client-event',
    category: 'Retaliation'
  },
  {
    id: 'pre-13',
    caseId: '3',
    title: 'Wrongful Termination',
    description: 'Client was terminated in apparent retaliation for discrimination complaint',
    date: new Date('2024-08-30'),
    type: 'client-event',
    category: 'Termination'
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    caseId: '1',
    name: 'Initial Complaint.pdf',
    type: 'application/pdf',
    size: 245760,
    uploadedBy: mockUsers[0],
    uploadedAt: new Date('2024-08-15'),
    url: '#',
    category: 'pleading',
    isClientVisible: false
  },
  {
    id: '2',
    caseId: '1',
    name: 'Patent Documentation.pdf',
    type: 'application/pdf',
    size: 512000,
    uploadedBy: mockUsers[1],
    uploadedAt: new Date('2024-09-01'),
    url: '#',
    category: 'evidence',
    isClientVisible: false
  },
  {
    id: '3',
    caseId: '2',
    name: 'Medical Records.pdf',
    type: 'application/pdf',
    size: 1024000,
    uploadedBy: mockUsers[0],
    uploadedAt: new Date('2024-09-05'),
    url: '#',
    category: 'evidence',
    isClientVisible: true
  },
  {
    id: '4',
    caseId: '3',
    name: 'Employment Contract.pdf',
    type: 'application/pdf',
    size: 156000,
    uploadedBy: mockUsers[2],
    uploadedAt: new Date('2024-10-05'),
    url: '#',
    category: 'evidence',
    isClientVisible: false
  },
  {
    id: '5',
    caseId: '2',
    name: 'Accident Report.pdf',
    type: 'application/pdf',
    size: 324000,
    uploadedBy: mockUsers[0],
    uploadedAt: new Date('2024-09-10'),
    url: '#',
    category: 'evidence',
    isClientVisible: true
  },
  {
    id: '6',
    caseId: '2',
    name: 'Insurance Correspondence.pdf',
    type: 'application/pdf',
    size: 128000,
    uploadedBy: mockUsers[0],
    uploadedAt: new Date('2024-10-15'),
    url: '#',
    category: 'correspondence',
    isClientVisible: true
  }
];

export const mockNotes: Note[] = [
  {
    id: '1',
    caseId: '1',
    content: 'Client confirmed they have additional patent documentation that could strengthen our position. Need to schedule meeting to review.',
    author: mockUsers[0],
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08'),
    isPrivate: false
  },
  {
    id: '2',
    caseId: '1',
    content: 'Research indicates strong precedent in favor of our client based on Thompson v. InnovateTech (2019).',
    author: mockUsers[1],
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-06'),
    isPrivate: false
  },
  {
    id: '3',
    caseId: '2',
    content: 'Medical expert confirms long-term impact of injuries. This strengthens our damages claim significantly.',
    author: mockUsers[0],
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-07'),
    isPrivate: true
  },
  {
    id: '4',
    caseId: '3',
    content: 'Client provided additional witnesses who can testify to discriminatory behavior. Need to interview them.',
    author: mockUsers[0],
    createdAt: new Date('2025-01-09'),
    updatedAt: new Date('2025-01-09'),
    isPrivate: false
  }
];

// Client invoices (simplified view for clients)
export const mockClientInvoices: ClientInvoice[] = [
  {
    id: 'inv-client-1',
    caseId: '2',
    date: new Date('2024-09-30'),
    description: 'Legal services for personal injury case - September 2024',
    totalAmount: 4900,
    dueDate: new Date('2024-10-30'),
    status: 'paid',
    invoiceNumber: 'INV-2024-005',
    paidDate: new Date('2024-10-25')
  },
  {
    id: 'inv-client-2',
    caseId: '2',
    date: new Date('2024-10-31'),
    description: 'Legal services for personal injury case - October 2024',
    totalAmount: 7200,
    dueDate: new Date('2024-11-30'),
    status: 'paid',
    invoiceNumber: 'INV-2024-006',
    paidDate: new Date('2024-11-28')
  },
  {
    id: 'inv-client-3',
    caseId: '2',
    date: new Date('2024-11-30'),
    description: 'Legal services for personal injury case - November 2024',
    totalAmount: 5750,
    dueDate: new Date('2024-12-30'),
    status: 'overdue',
    invoiceNumber: 'INV-2024-007'
  },
  {
    id: 'inv-client-4',
    caseId: '2',
    date: new Date('2024-12-31'),
    description: 'Legal services for personal injury case - December 2024',
    totalAmount: 6550,
    dueDate: new Date('2025-01-30'),
    status: 'sent',
    invoiceNumber: 'INV-2025-002'
  }
];

// Meeting requests
export const mockMeetingRequests: MeetingRequest[] = [
  {
    id: 'meet-1',
    caseId: '2',
    clientId: '2',
    lawyerId: '1',
    requestedDate: new Date('2025-01-25'),
    preferredTime: '2:00 PM',
    purpose: 'Discuss settlement offer from insurance company and next steps',
    status: 'approved',
    actualDate: new Date('2025-01-25'),
    notes: 'Meeting confirmed for 2:00 PM in our office. Please bring all recent medical reports.',
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'meet-2',
    caseId: '2',
    clientId: '2',
    lawyerId: '1',
    requestedDate: new Date('2025-02-05'),
    preferredTime: '10:00 AM',
    purpose: 'Review medical expert report and prepare for mediation',
    status: 'pending',
    createdAt: new Date('2025-01-20')
  },
  {
    id: 'meet-3',
    caseId: '2',
    clientId: '2',
    lawyerId: '1',
    requestedDate: new Date('2024-12-15'),
    preferredTime: '3:00 PM',
    purpose: 'Initial case strategy discussion and document review',
    status: 'completed',
    actualDate: new Date('2024-12-15'),
    notes: 'Productive meeting. Client provided additional documentation and we outlined case strategy.',
    createdAt: new Date('2024-12-10')
  }
];

// Comprehensive billing entries - majority for Sarah Johnson's cases
export const mockBillingEntries: BillingEntry[] = [
  // Sarah Johnson's TechCorp Patent Case (Case 1) - Multiple billing entries
  {
    id: 'bill-1',
    caseId: '1',
    date: new Date('2024-08-30'),
    description: 'Initial case analysis, client consultation, and complaint drafting',
    lawyerHours: 12,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[1], // Michael Chen
        hoursWorked: 8,
        hoursBilled: 8,
        rate: 150
      }
    ],
    totalHours: 20,
    totalAmount: 7200,
    dueDate: new Date('2024-09-29'),
    status: 'paid',
    invoiceNumber: 'INV-2024-001',
    paidDate: new Date('2024-09-25'),
    notes: 'Initial retainer payment received'
  },
  {
    id: 'bill-2',
    caseId: '1',
    date: new Date('2024-09-30'),
    description: 'Discovery planning, document review, and expert witness consultation',
    lawyerHours: 15,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[1], // Michael Chen
        hoursWorked: 12,
        hoursBilled: 10,
        rate: 150
      }
    ],
    totalHours: 25,
    totalAmount: 9000,
    dueDate: new Date('2024-10-30'),
    status: 'paid',
    invoiceNumber: 'INV-2024-002',
    paidDate: new Date('2024-10-28'),
    notes: 'Patent research completed ahead of schedule'
  },
  {
    id: 'bill-3',
    caseId: '1',
    date: new Date('2024-10-31'),
    description: 'Deposition preparation, witness interviews, and motion drafting',
    lawyerHours: 18,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[1], // Michael Chen
        hoursWorked: 15,
        hoursBilled: 15,
        rate: 150
      }
    ],
    totalHours: 33,
    totalAmount: 11250,
    dueDate: new Date('2024-11-30'),
    status: 'paid',
    invoiceNumber: 'INV-2024-003',
    paidDate: new Date('2024-11-20'),
    notes: 'Complex technical analysis required additional time'
  },
  {
    id: 'bill-4',
    caseId: '1',
    date: new Date('2024-11-30'),
    description: 'Court appearances, settlement negotiations, and case strategy revision',
    lawyerHours: 14,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[1], // Michael Chen
        hoursWorked: 6,
        hoursBilled: 6,
        rate: 150
      }
    ],
    totalHours: 20,
    totalAmount: 7900,
    dueDate: new Date('2024-12-30'),
    status: 'sent',
    invoiceNumber: 'INV-2024-004',
    notes: 'Settlement discussions ongoing'
  },
  {
    id: 'bill-5',
    caseId: '1',
    date: new Date('2024-12-31'),
    description: 'Year-end case review, discovery responses, and trial preparation',
    lawyerHours: 16,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[1], // Michael Chen
        hoursWorked: 10,
        hoursBilled: 10,
        rate: 150
      }
    ],
    totalHours: 26,
    totalAmount: 9500,
    dueDate: new Date('2025-01-30'),
    status: 'pending',
    invoiceNumber: 'INV-2025-001',
    notes: 'Preparing for summary judgment motion'
  },

  // Sarah Johnson's Personal Injury Case (Case 2) - Multiple billing entries
  {
    id: 'bill-6',
    caseId: '2',
    date: new Date('2024-09-15'),
    description: 'Initial client consultation, medical records review, and case evaluation',
    lawyerHours: 8,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[2], // Emily Rodriguez
        hoursWorked: 6,
        hoursBilled: 6,
        rate: 150
      }
    ],
    totalHours: 14,
    totalAmount: 4900,
    dueDate: new Date('2024-10-15'),
    status: 'paid',
    invoiceNumber: 'INV-2024-005',
    paidDate: new Date('2024-10-10'),
    notes: 'Contingency fee arrangement - 33% of settlement'
  },
  {
    id: 'bill-7',
    caseId: '2',
    date: new Date('2024-10-31'),
    description: 'Insurance negotiations, expert medical consultation, and damage assessment',
    lawyerHours: 12,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[2], // Emily Rodriguez
        hoursWorked: 8,
        hoursBilled: 8,
        rate: 150
      }
    ],
    totalHours: 20,
    totalAmount: 7200,
    dueDate: new Date('2024-11-30'),
    status: 'paid',
    invoiceNumber: 'INV-2024-006',
    paidDate: new Date('2024-11-25'),
    notes: 'Medical expert confirms long-term disability'
  },
  {
    id: 'bill-8',
    caseId: '2',
    date: new Date('2024-11-30'),
    description: 'Litigation preparation, witness statements, and settlement discussions',
    lawyerHours: 10,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[2], // Emily Rodriguez
        hoursWorked: 5,
        hoursBilled: 5,
        rate: 150
      }
    ],
    totalHours: 15,
    totalAmount: 5750,
    dueDate: new Date('2024-12-30'),
    status: 'overdue',
    invoiceNumber: 'INV-2024-007',
    notes: 'Payment delayed due to insurance dispute'
  },
  {
    id: 'bill-9',
    caseId: '2',
    date: new Date('2024-12-31'),
    description: 'Pre-trial motions, discovery completion, and mediation preparation',
    lawyerHours: 11,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[2], // Emily Rodriguez
        hoursWorked: 7,
        hoursBilled: 7,
        rate: 150
      }
    ],
    totalHours: 18,
    totalAmount: 6550,
    dueDate: new Date('2025-01-30'),
    status: 'sent',
    invoiceNumber: 'INV-2025-002',
    notes: 'Mediation scheduled for next month'
  },

  // Sarah Johnson's Employment Discrimination Case (Case 3) - Multiple billing entries
  {
    id: 'bill-10',
    caseId: '3',
    date: new Date('2024-10-15'),
    description: 'EEOC complaint filing, client interviews, and evidence gathering',
    lawyerHours: 9,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[1], // Michael Chen
        hoursWorked: 4,
        hoursBilled: 4,
        rate: 150
      },
      {
        intern: mockUsers[2], // Emily Rodriguez
        hoursWorked: 5,
        hoursBilled: 5,
        rate: 150
      }
    ],
    totalHours: 18,
    totalAmount: 5850,
    dueDate: new Date('2024-11-15'),
    status: 'paid',
    invoiceNumber: 'INV-2024-008',
    paidDate: new Date('2024-11-12'),
    notes: 'Strong discrimination case with multiple witnesses'
  },
  {
    id: 'bill-11',
    caseId: '3',
    date: new Date('2024-11-30'),
    description: 'Witness depositions, employment law research, and strategy development',
    lawyerHours: 13,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[1], // Michael Chen
        hoursWorked: 8,
        hoursBilled: 8,
        rate: 150
      },
      {
        intern: mockUsers[2], // Emily Rodriguez
        hoursWorked: 6,
        hoursBilled: 6,
        rate: 150
      }
    ],
    totalHours: 27,
    totalAmount: 8600,
    dueDate: new Date('2024-12-30'),
    status: 'paid',
    invoiceNumber: 'INV-2024-009',
    paidDate: new Date('2024-12-28'),
    notes: 'Depositions revealed additional evidence of retaliation'
  },
  {
    id: 'bill-12',
    caseId: '3',
    date: new Date('2024-12-31'),
    description: 'Mediation preparation, settlement analysis, and client counseling',
    lawyerHours: 8,
    lawyerRate: 500,
    internEntries: [
      {
        intern: mockUsers[1], // Michael Chen
        hoursWorked: 3,
        hoursBilled: 3,
        rate: 150
      },
      {
        intern: mockUsers[2], // Emily Rodriguez
        hoursWorked: 4,
        hoursBilled: 4,
        rate: 150
      }
    ],
    totalHours: 15,
    totalAmount: 5050,
    dueDate: new Date('2025-01-30'),
    status: 'pending',
    invoiceNumber: 'INV-2025-003',
    notes: 'Preparing for court-ordered mediation'
  },

  // Sarah Johnson's Closed Cases - Billing History
  {
    id: 'bill-13',
    caseId: '8', // Anderson Contract Dispute (Closed)
    date: new Date('2024-06-30'),
  }
]
// Generate comprehensive lawyer performance data
export const mockLawyerPerformance: LawyerPerformance[] = [
  {
    lawyerId: '1',
    lawyer: mockUsers[0], // Sarah Johnson
    totalCases: 4,
    activeCases: 3,
    closedCases: 1,
    wonCases: 1,
    lostCases: 0,
    settledCases: 0,
    totalRevenue: 189000, // Active cases: 150,000 + Closed: 39,000
    billableHours: 379, // Active: 301 + Closed: 78
    averageHourlyRate: 500,
    winRate: 100 // 2 favorable outcomes out of 2 decided cases
  },
  {
    lawyerId: '5',
    lawyer: mockUsers[4], // David Martinez
    totalCases: 4,
    activeCases: 2,
    closedCases: 1,
    wonCases: 2,
    lostCases: 0,
    settledCases: 0,
    totalRevenue: 151000, // Active: 95,000 + Closed: 56,000
    billableHours: 302, // Active: 190 + Closed: 112
    averageHourlyRate: 500,
    winRate: 100 // 1 settled out of 1 decided case
  },
  {
    lawyerId: '9',
    lawyer: mockUsers[4], // Jennifer Walsh - Lawyer
    totalCases: 3,
    activeCases: 2,
    closedCases: 1,
    wonCases: 0,
    lostCases: 0,
    settledCases: 1,
    totalRevenue: 78000, // Active: 45,000 + Closed: 33,500
    billableHours: 157, // Active: 90 + Closed: 67
    averageHourlyRate: 500,
    winRate: 100 // 1 settled out of 1 decided case
  },
  {
    lawyerId: '10',
    lawyer: mockUsers[9], // Mark Rodriguez - Lawyer
    totalCases: 3,
    activeCases: 2,
    closedCases: 1,
    wonCases: 1,
    lostCases: 0,
    settledCases: 0,
    totalRevenue: 110500, // Active: 21,500 + Closed: 89,000
    billableHours: 132, // Active: 43 + Closed: 89
    averageHourlyRate: 500,
    winRate: 100, // 1 won out of 1 decided case
    totalCases: 3,
  }
  {
    lawyerId: '6',
    lawyer: mockUsers[5], // Lisa Thompson
    totalCases: 4,
    activeCases: 2,
    closedCases: 1,
    wonCases: 1,
    lostCases: 0,
    settledCases: 1,
    totalRevenue: 276500, // Active: 120,500 + Closed: 156,000
    billableHours: 299, // Active: 143 + Closed: 156
    averageHourlyRate: 500,
    winRate: 100 // 2 favorable outcomes out of 2 decided cases
  }
];
    totalCases: 3,