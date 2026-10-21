import { TeacherSubscription } from '../types';

export const mockSubscriptions: TeacherSubscription[] = [
  {
    id: 'sub_1',
    studentId: 'user_stud_1',
    instructorId: 'inst_ahmed_samy',
    instructorName: 'Mr. Ahmed Samy',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subjectId: 'subj_g3_phys',
    subjectName: 'Physics (الفيزياء)',
    gradeId: 'grade_sec_3',
    activatedAt: '2024-02-15T10:00:00Z',
    expiresAt: '2027-12-31T23:59:59Z', // Active!
    durationLabel: '1 Month Access (كارت شهر)',
    paymentMethod: 'VOUCHER_CARD',
    voucherCodeUsed: 'YA7EDU-PHY-1M',
    status: 'ACTIVE'
  },
  {
    id: 'sub_2',
    studentId: 'user_stud_1',
    instructorId: 'inst_mohamed_abdel',
    instructorName: 'Mr. Mohamed Abdel Maqsoud',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subjectId: 'subj_g3_math',
    subjectName: 'Mathematics (الرياضيات)',
    gradeId: 'grade_sec_3',
    activatedAt: '2024-01-20T14:30:00Z',
    expiresAt: '2027-12-31T23:59:59Z', // Active!
    durationLabel: 'Full Term Access (اشتراك الترم الأول)',
    paymentMethod: 'CREDIT_CARD',
    status: 'ACTIVE'
  }
];
