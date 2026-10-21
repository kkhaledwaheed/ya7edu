export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';

export type AcademicGradeId = string;

export interface AcademicGrade {
  id: AcademicGradeId;
  nameEn: string;
  nameAr: string;
  stage: string;
  description: string;
}

export interface Subject {
  id: string;
  nameEn: string;
  nameAr: string;
  gradeId: AcademicGradeId;
  icon: string;
  color: string;
  description: string;
}

export type VoucherDuration = '1_MONTH' | '3_MONTHS' | 'FULL_TERM' | 'FULL_YEAR';
export type VoucherStatus = 'AVAILABLE' | 'REDEEMED' | 'EXPIRED';

export type PlatformValidityType = 'LIFETIME' | 'TIME_LIMITED';

export interface VoucherCode {
  code: string;
  instructorId: string;
  instructorName: string;
  subjectId: string;
  subjectName: string;
  gradeId: AcademicGradeId;
  duration: VoucherDuration;
  durationLabelEn: string;
  durationLabelAr: string;
  priceLabel?: string; // e.g. '150 ج.م'
  batchId?: string;
  status: VoucherStatus;
  redeemedByUserId?: string;
  redeemedByStudentName?: string;
  redeemedAt?: string;
  expiresAt: string;
}

export interface TeacherSubscription {
  id: string;
  studentId: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  subjectId: string;
  subjectName: string;
  gradeId: AcademicGradeId;
  activatedAt: string;
  expiresAt: string;
  durationLabel: string;
  paymentMethod: 'VOUCHER_CARD' | 'CREDIT_CARD' | 'DIGITAL_WALLET';
  voucherCodeUsed?: string;
  status: 'ACTIVE' | 'EXPIRED';
}

export interface LessonVideo {
  id: string;
  titleEn: string;
  titleAr: string;
  durationMinutes: number;
  videoUrl: string;
  order: number;
  isCompleted?: boolean;
  isFree?: boolean; // محتوى تجريبي مجاني متاح للمعاينة بدون اشتراك
  notes?: string;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  titleEn: string;
  titleAr: string;
  description?: string;
  lessons: LessonVideo[];
}

export interface BookletQuestion {
  id: string;
  questionAr: string;
  options: string[];
  correctIndex: number;
  explanationAr: string;
}

export interface BookletItem {
  id: string;
  titleEn: string;
  titleAr: string;
  chapterTitle?: string;
  pageCount?: number;
  fileSize?: string;
  downloadUrl?: string;
  type: 'BOOKLET' | 'REVISION' | 'YA7EDU_EXCLUSIVE';
  uploadDate: string;
  isExclusive?: boolean;
  isFree?: boolean; // مذكرة أو تدريب أو فيديو تجريبي مجاني
  format?: 'PDF' | 'INTERACTIVE_PRACTICE' | 'VIDEO';
  questions?: BookletQuestion[]; // للتدريبات التفاعلية مع تصحيح وشرح فوري
  videoUrl?: string; // لفيديوهات المراجعة (ملف أو يوتيوب)
  durationMinutes?: number;
}

export interface InstructorContent {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  subjectId: string;
  subjectName: string;
  gradeId: AcademicGradeId;
  term: 'Term 1' | 'Term 2' | 'Full Year';
  priceMonthly: number;
  priceTerm: number;
  priceYear: number;
  rating: number;
  totalSubscribers: number;
  bioAr?: string;
  chapters: Chapter[];
  booklets: BookletItem[];         // Tab 2: قسم المذكرات
  revisions: BookletItem[];        // Tab 3: قسم المراجعات وليالي الامتحان
  ya7eduBooklets: BookletItem[];   // Tab 4: قسم مذكرات YA7EDU الحصرية
  exams?: InstructorExam[];        // Tab 5: قسم الامتحانات والاختبارات التقييمية
}

export interface InstructorExamQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  marks: number;
}

export interface InstructorExam {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;
  subjectId: string;
  subjectName: string;
  gradeId: AcademicGradeId;
  title: string;
  description: string;
  durationMinutes: number; // مدة الامتحان بالدقائق
  startDate?: string; // تاريخ بداية الامتحان (YYYY-MM-DD)
  startTime?: string; // ساعة بداية الامتحان (HH:mm)
  endDate?: string; // تاريخ نهاية الامتحان (YYYY-MM-DD)
  endTime?: string; // ساعة نهاية الامتحان (HH:mm)
  passingPercent: number; // نسبة النجاح المئوية (e.g. 60%)
  totalMarks: number;
  questions: InstructorExamQuestion[];
  isPublished: boolean;
  hideResultUntilDurationEnds: boolean; // حجب النتيجة ونموذج الإجابة حتى انتهاء الوقت الكلي للامتحان
  createdAt: string;
}

export interface StudentExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string; // ISO string وقت بدء الامتحان
  submittedAt?: string; // ISO string وقت تسليم الطالب
  answers: Record<string, number>; // questionId -> chosen option index
  scorePercent: number;
  totalScore: number;
  maxScore: number;
  passed: boolean;
  isUnlocked: boolean; // true إذا انتهت مدة الامتحان أو تم فك الحجب
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  headline?: string;
  bio?: string;
  gradeId?: AcademicGradeId;
  assignedGradeIds?: AcademicGradeId[];
  assignedSubjectIds?: string[];
  validityType?: PlatformValidityType;
  validityDurationLabel?: string;
  validityExpiresAt?: string;
  joinedAt: string;
}

// Full Platform Course Models
export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface ResourceItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl: string;
  isPreview?: boolean;
  notes?: string;
  resources?: ResourceItem[];
  quiz?: Quiz;
  completed?: boolean;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  instructorReply?: string;
  instructorReplyAt?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  previewVideoUrl: string;
  price: number;
  discountPrice?: number;
  level: CourseLevel;
  category: string;
  status: CourseStatus;
  rejectionReason?: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  instructorTitle: string;
  sections: Section[];
  reviews: CourseReview[];
  averageRating: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  enrolledAt: string;
  completedAt?: string;
  certificateId?: string;
}

export interface PayoutRequest {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  requestedAt: string;
  processedAt?: string;
  payoutMethod: string;
  method?: string;
  accountDetails: string;
  notes?: string;
}

export interface PlatformTransaction {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  platformFee: number;
  instructorCut: number;
  status: 'COMPLETED' | 'REFUNDED' | 'PENDING';
  date: string;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  performedBy?: string;
  actorRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface PlatformConfig {
  commissionRate: number;
  minPayoutThreshold: number;
  bannerText: string;
  bannerEnabled: boolean;
  maintenanceMode?: boolean;
}
