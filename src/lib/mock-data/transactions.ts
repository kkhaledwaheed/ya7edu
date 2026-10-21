import { PayoutRequest, PlatformTransaction, AuditLogItem, PlatformConfig } from '../types';

export const mockPayoutRequests: PayoutRequest[] = [
  {
    id: 'pay_1',
    instructorId: 'user_inst_1',
    instructorName: 'Dr. Marcus Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    amount: 4250.00,
    status: 'PENDING',
    requestedAt: '2024-03-01T08:30:00Z',
    payoutMethod: 'Stripe Connect (US Express)',
    accountDetails: 'acct_1Nsk99238910xxxx',
    notes: 'Q1 automated payout balance for AI Course.'
  },
  {
    id: 'pay_2',
    instructorId: 'user_inst_2',
    instructorName: 'Sarah Jenkins',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    amount: 1850.00,
    status: 'PENDING',
    requestedAt: '2024-03-02T14:10:00Z',
    payoutMethod: 'Wise Business Transfer',
    accountDetails: 'iban_GB29NWBK601613xxxx',
    notes: 'February DevOps Bootcamp cohort payouts.'
  },
  {
    id: 'pay_3',
    instructorId: 'user_inst_1',
    instructorName: 'Dr. Marcus Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    amount: 12400.00,
    status: 'PAID',
    requestedAt: '2024-02-01T09:00:00Z',
    processedAt: '2024-02-02T11:20:00Z',
    payoutMethod: 'Stripe Connect',
    accountDetails: 'acct_1Nsk99238910xxxx',
    notes: 'Settled successfully via Stripe Transfer #tr_99182312'
  }
];

export const mockTransactions: PlatformTransaction[] = [
  {
    id: 'tx_101',
    studentId: 'user_stud_1',
    studentName: 'Sophia Rodriguez',
    courseId: 'course_ai_arch',
    courseTitle: 'Autonomous AI & Multi-Agent Systems',
    amount: 149.99,
    platformFee: 22.50,
    instructorCut: 127.49,
    status: 'COMPLETED',
    date: '2024-02-28T19:42:00Z'
  },
  {
    id: 'tx_102',
    studentId: 'user_stud_2',
    studentName: 'David Kim',
    courseId: 'course_nextjs_enterprise',
    courseTitle: 'Enterprise Next.js 15 Masterclass',
    amount: 119.99,
    platformFee: 18.00,
    instructorCut: 101.99,
    status: 'COMPLETED',
    date: '2024-02-27T14:12:00Z'
  },
  {
    id: 'tx_103',
    studentId: 'user_stud_3',
    studentName: 'Liam Patel',
    courseId: 'course_devops_k8s',
    courseTitle: 'Kubernetes & Cloud-Native DevOps Bootcamp',
    amount: 139.99,
    platformFee: 21.00,
    instructorCut: 118.99,
    status: 'COMPLETED',
    date: '2024-02-25T11:05:00Z'
  }
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: 'log_1',
    actorName: 'Elena Vance',
    actorRole: 'ADMIN',
    action: 'PAYOUT_APPROVED',
    details: 'Approved payout #pay_3 for Dr. Marcus Chen ($12,400.00)',
    timestamp: '2024-02-02T11:20:00Z'
  },
  {
    id: 'log_2',
    actorName: 'Elena Vance',
    actorRole: 'ADMIN',
    action: 'COURSE_APPROVED',
    details: 'Approved course "Enterprise Next.js 15 Masterclass" for publishing',
    timestamp: '2024-01-20T14:00:00Z'
  },
  {
    id: 'log_3',
    actorName: 'Elena Vance',
    actorRole: 'ADMIN',
    action: 'USER_SUSPENDED',
    details: 'Suspended account user_suspended for content scraping flags',
    timestamp: '2024-01-18T16:30:00Z'
  },
  {
    id: 'log_4',
    actorName: 'Dr. Marcus Chen',
    actorRole: 'INSTRUCTOR',
    action: 'COURSE_CREATED',
    details: 'Created draft course "Practical Quantum Computing with Qiskit"',
    timestamp: '2024-03-05T09:00:00Z'
  }
];

export const initialPlatformConfig: PlatformConfig = {
  commissionRate: 15,
  minPayoutThreshold: 50,
  bannerText: '🚀 Spring Enrollment Festival: All Pro certifications include lifetime community access!',
  bannerEnabled: true,
  maintenanceMode: false
};
