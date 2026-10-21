import { VoucherCode } from '../types';

export const mockVouchers: VoucherCode[] = [
  {
    code: 'YA7EDU-PHY-1M',
    instructorId: 'inst_ahmed_samy',
    instructorName: 'Mr. Ahmed Samy (الفيزياء)',
    subjectId: 'subj_g3_phys',
    subjectName: 'Physics (الفيزياء)',
    gradeId: 'grade_sec_3',
    duration: '1_MONTH',
    durationLabelEn: '1 Month Access',
    durationLabelAr: 'اشتراك شهر واحد',
    status: 'AVAILABLE',
    expiresAt: '2027-12-31T23:59:59Z'
  },
  {
    code: 'YA7EDU-MATH-3M',
    instructorId: 'inst_mohamed_abdel',
    instructorName: 'Mr. Mohamed Abdel Maqsoud (الرياضيات)',
    subjectId: 'subj_g3_math',
    subjectName: 'Mathematics (الرياضيات)',
    gradeId: 'grade_sec_3',
    duration: '3_MONTHS',
    durationLabelEn: '3 Months Access',
    durationLabelAr: 'اشتراك 3 أشهر',
    status: 'AVAILABLE',
    expiresAt: '2027-12-31T23:59:59Z'
  },
  {
    code: 'YA7EDU-CHEM-TERM',
    instructorId: 'inst_ehab_chem',
    instructorName: 'Dr. Ehab El-Sayed (الكيمياء)',
    subjectId: 'subj_g3_chem',
    subjectName: 'Chemistry (الكيمياء)',
    gradeId: 'grade_sec_3',
    duration: 'FULL_TERM',
    durationLabelEn: 'Full Academic Term 1 Access',
    durationLabelAr: 'اشتراك الترم الأول كاملاً',
    status: 'AVAILABLE',
    expiresAt: '2027-12-31T23:59:59Z'
  },
  {
    code: 'YA7EDU-BIO-YEAR',
    instructorId: 'inst_nader_bio',
    instructorName: 'Dr. Nader El-Kholy (الأحياء)',
    subjectId: 'subj_g3_bio',
    subjectName: 'Biology (الأحياء)',
    gradeId: 'grade_sec_3',
    duration: 'FULL_YEAR',
    durationLabelEn: 'Full Academic Year VIP Access',
    durationLabelAr: 'اشتراك العام الدراسي كاملاً',
    status: 'AVAILABLE',
    expiresAt: '2027-12-31T23:59:59Z'
  },
  {
    code: 'YA7EDU-ARA-VIP',
    instructorId: 'inst_reda_farouk',
    instructorName: 'Mr. Reda El-Farouk (اللغة العربية)',
    subjectId: 'subj_g3_arabic',
    subjectName: 'Arabic (اللغة العربية)',
    gradeId: 'grade_sec_3',
    duration: 'FULL_YEAR',
    durationLabelEn: 'Full Academic Year VIP Access',
    durationLabelAr: 'اشتراك العام الدراسي كاملاً',
    status: 'AVAILABLE',
    expiresAt: '2027-12-31T23:59:59Z'
  },
  {
    code: 'EXPIRED-CARD-2023',
    instructorId: 'inst_ahmed_samy',
    instructorName: 'Mr. Ahmed Samy',
    subjectId: 'subj_g3_phys',
    subjectName: 'Physics',
    gradeId: 'grade_sec_3',
    duration: '1_MONTH',
    durationLabelEn: '1 Month Access (Expired)',
    durationLabelAr: 'كارت منتهي الصلاحية',
    status: 'EXPIRED',
    expiresAt: '2023-01-01T00:00:00Z'
  },
  {
    code: 'ALREADY-USED-999',
    instructorId: 'inst_mohamed_abdel',
    instructorName: 'Mr. Mohamed Abdel Maqsoud',
    subjectId: 'subj_g3_math',
    subjectName: 'Mathematics',
    gradeId: 'grade_sec_3',
    duration: 'FULL_TERM',
    durationLabelEn: 'Full Term Access (Already Used)',
    durationLabelAr: 'كارت مستخدم مسبقاً',
    status: 'REDEEMED',
    redeemedByUserId: 'user_stud_2',
    redeemedAt: '2024-01-10T12:00:00Z',
    expiresAt: '2027-12-31T23:59:59Z'
  }
];
