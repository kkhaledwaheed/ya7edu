'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  UserStatus,
  PlatformValidityType,
  AcademicGradeId,
  AcademicGrade,
  Subject,
  VoucherCode,
  VoucherDuration,
  TeacherSubscription,
  InstructorContent,
  Chapter,
  LessonVideo,
  BookletItem,
  Course,
  CourseStatus,
  Enrollment,
  PayoutRequest,
  PlatformTransaction,
  AuditLogItem,
  PlatformConfig,
  InstructorExam,
  StudentExamAttempt,
  InstructorExamQuestion
} from '@/lib/types';
import {
  mockUsers,
  mockCourses,
  mockEnrollments,
  mockPayoutRequests,
  mockTransactions,
  mockAuditLogs,
  initialPlatformConfig,
  mockAcademicGrades,
  mockSubjects,
  mockVouchers,
  mockInstructorContents,
  mockSubscriptions,
  mockInstructorExams,
  mockStudentExamAttempts
} from '@/lib/mock-data';
import { getExamEndDeadlineMs, isExamResultEmbargoed } from '@/lib/exam-utils';


interface LMSContextType {
  currentUser: User;
  impersonatedByAdmin: boolean;
  switchRole: (role: UserRole) => void;
  impersonateUser: (userId: string) => void;
  stopImpersonating: () => void;
  loginUser: (user: User) => void;
  logout: () => void;
  isLoadingLiveDb: boolean;
  isLiveDbReady: boolean;
  refreshLMSData: () => Promise<void>;
  isHydrated: boolean;
  
  // Grade-Locked Student Architecture & Admin Grade Management
  studentGradeId: AcademicGradeId;
  setStudentGradeId: (gradeId: AcademicGradeId) => void;
  activeGradeDetails: AcademicGrade;
  gradeSubjects: Subject[];
  academicGrades: AcademicGrade[];
  allSubjects: Subject[];
  addGrade: (grade: { nameAr: string; nameEn?: string; stage?: string; description?: string }) => AcademicGrade;
  updateGrade: (id: string, updates: Partial<AcademicGrade>) => void;
  deleteGrade: (id: string) => void;
  addSubject: (subject: { nameAr: string; nameEn?: string; gradeId: string; icon?: string; color?: string; description?: string }) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Subscriptions & Voucher Engine
  subscriptions: TeacherSubscription[];
  vouchers: VoucherCode[];
  isSubscribedToInstructor: (instructorId: string, subjectId: string) => boolean;
  getSubscription: (instructorId: string, subjectId: string) => TeacherSubscription | undefined;
  subscribeWithPayment: (
    instructorId: string,
    subjectId: string,
    duration: VoucherDuration,
    method: 'CREDIT_CARD' | 'DIGITAL_WALLET'
  ) => TeacherSubscription;
  redeemVoucher: (code: string) => { success: boolean; message: string; subscription?: TeacherSubscription };
  adminActivateSubscription: (data: {
    studentId: string;
    instructorId: string;
    subjectId: string;
    duration: VoucherDuration;
    notes?: string;
  }) => Promise<{ success: boolean; message: string; subscription?: TeacherSubscription }>;
  generateVouchers: (
    instructorId: string,
    subjectId: string,
    gradeId: AcademicGradeId,
    duration: VoucherDuration,
    count: number,
    priceLabel?: string
  ) => VoucherCode[];

  // Admin Instructor Management
  createInstructor: (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    assignedGradeIds: AcademicGradeId[];
    assignedSubjectIds: string[];
    validityType: PlatformValidityType;
    validityDurationLabel: string;
    validityExpiresAt?: string;
  }) => User;
  updateInstructorSubscription: (
    instructorId: string,
    updates: {
      validityType?: PlatformValidityType;
      validityDurationLabel?: string;
      validityExpiresAt?: string;
      assignedGradeIds?: AcademicGradeId[];
      assignedSubjectIds?: string[];
      status?: UserStatus;
    }
  ) => void;

  // 4-Tab Instructor Content & Course Player State
  instructorContents: InstructorContent[];
  getInstructorContent: (instructorId: string, subjectId: string) => InstructorContent | undefined;
  toggleLessonProgress: (contentId: string, lessonId: string) => void;
  addChapter: (contentId: string, titleEn: string, titleAr: string) => void;
  addLessonToChapter: (contentId: string, chapterId: string, lesson: Partial<LessonVideo>) => void;
  deleteLessonFromChapter: (contentId: string, chapterId: string, lessonId: string) => void;
  addBookletItem: (contentId: string, item: Partial<BookletItem>) => void;
  deleteBookletItem: (contentId: string, itemId: string) => void;

  // Instructor Exams & Embargoed Submissions
  instructorExams: InstructorExam[];
  studentExamAttempts: StudentExamAttempt[];
  createInstructorExam: (examData: Omit<InstructorExam, 'id' | 'createdAt'>) => InstructorExam;
  updateInstructorExam: (examId: string, updates: Partial<InstructorExam>) => void;
  deleteInstructorExam: (examId: string) => void;
  startExamAttempt: (examId: string) => StudentExamAttempt;
  submitExamAttempt: (attemptId: string, answers: Record<string, number>) => StudentExamAttempt;
  unlockExamAttempt: (attemptId: string) => void;
  getExamAttempt: (examId: string, studentId?: string) => StudentExamAttempt | undefined;
  getExamSubmissions: (examId: string) => StudentExamAttempt[];

  // Global collections
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  payoutRequests: PayoutRequest[];
  transactions: PlatformTransaction[];
  auditLogs: AuditLogItem[];
  platformConfig: PlatformConfig;

  // Actions
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
  submitQuiz: (courseId: string, lessonId: string, scorePercent: number) => { passed: boolean; score: number };
  updateCourseStatus: (courseId: string, status: CourseStatus, rejectionReason?: string) => void;
  saveCourse: (course: Partial<Course> & { id?: string }) => Course;
  toggleUserStatus: (userId: string) => void;
  approveInstructorOnboarding: (userId: string) => void;
  changeUserRole: (userId: string, role: UserRole) => void;
  approvePayout: (payoutId: string) => void;
  rejectPayout: (payoutId: string) => void;
  requestInstructorPayout: (amount: number, method: string, account: string) => void;
  updatePlatformConfig: (config: Partial<PlatformConfig>) => void;
  replyToReview: (courseId: string, reviewId: string, replyText: string) => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export function LMSProvider({ children }: { children: React.ReactNode }) {
  // Current user state (consistently initialized for SSR, hydrated from localStorage in useEffect)
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [impersonatedByAdmin, setImpersonatedByAdmin] = useState(false);
  const [isLoadingLiveDb, setIsLoadingLiveDb] = useState(true);
  const [isLiveDbReady, setIsLiveDbReady] = useState(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Grade-Locked Student Architecture (Grade 3 Secondary Thanawya Amma by default)
  const [studentGradeId, setStudentGradeIdState] = useState<AcademicGradeId>('grade_sec_3');

  // Subscriptions & Vouchers
  const [subscriptions, setSubscriptions] = useState<TeacherSubscription[]>(mockSubscriptions);
  const [vouchers, setVouchers] = useState<VoucherCode[]>(mockVouchers);
  const [instructorContents, setInstructorContents] = useState<InstructorContent[]>(mockInstructorContents);
  const [instructorExams, setInstructorExams] = useState<InstructorExam[]>(mockInstructorExams);
  const [studentExamAttempts, setStudentExamAttempts] = useState<StudentExamAttempt[]>(mockStudentExamAttempts);

  // Standard platform collections
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(mockPayoutRequests);
  const [transactions, setTransactions] = useState<PlatformTransaction[]>(mockTransactions);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(initialPlatformConfig);

  // Dynamic Academic Grades & Subjects (Admin controllable)
  const [academicGrades, setAcademicGrades] = useState<AcademicGrade[]>(mockAcademicGrades);
  const [allSubjects, setAllSubjects] = useState<Subject[]>(mockSubjects);

  // Hydrate user session, grades, and subjects from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ya7edu_session_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          if (parsed.gradeId) {
            setStudentGradeIdState(parsed.gradeId);
          }
        }
      }
      const storedGrades = localStorage.getItem('ya7edu_academic_grades');
      if (storedGrades) {
        const parsedGrades = JSON.parse(storedGrades);
        if (Array.isArray(parsedGrades) && parsedGrades.length > 0) {
          setAcademicGrades(parsedGrades);
        }
      }
      const storedSubjects = localStorage.getItem('ya7edu_all_subjects');
      if (storedSubjects) {
        const parsedSubjects = JSON.parse(storedSubjects);
        if (Array.isArray(parsedSubjects) && parsedSubjects.length > 0) {
          setAllSubjects(parsedSubjects);
        }
      }
    } catch (e) {
      console.warn('LMS Context localStorage hydration error:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Fetch live data directly from VPS MySQL via Next.js bootstrap API
  const refreshLMSData = async () => {
    try {
      setIsLoadingLiveDb(true);
      const res = await fetch(`/api/lms/bootstrap?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.grades?.length) setAcademicGrades(data.grades);
          if (data.subjects?.length) setAllSubjects(data.subjects);
          if (data.users?.length) {
            setUsers(data.users);
            // Refresh active session profile if user is logged in
            const storedUserStr = localStorage.getItem('ya7edu_session_user');
            if (storedUserStr) {
              const storedUser = JSON.parse(storedUserStr);
              const matched = data.users.find((u: User) => u.id === storedUser.id || u.email === storedUser.email);
              if (matched) {
                setCurrentUser(matched);
                localStorage.setItem('ya7edu_session_user', JSON.stringify(matched));
              } else {
                setCurrentUser(storedUser);
              }
            }
          }
          if (data.instructorContents) setInstructorContents(data.instructorContents);
          if (data.vouchers) setVouchers(data.vouchers);
          if (data.instructorExams) setInstructorExams(data.instructorExams);
          if (data.subscriptions) setSubscriptions(data.subscriptions);
          if (data.courses && data.courses.length > 0) setCourses(data.courses);
          if (data.payoutRequests) setPayoutRequests(data.payoutRequests);
          if (data.platformConfig) setPlatformConfig(data.platformConfig);
        }
      }
    } catch (err) {
      console.warn('LMS live DB bootstrap notice:', err);
    } finally {
      setIsLoadingLiveDb(false);
      setIsLiveDbReady(true);
    }
  };

  useEffect(() => {
    refreshLMSData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ya7edu_academic_grades', JSON.stringify(academicGrades));
    } catch {}
  }, [academicGrades]);

  useEffect(() => {
    try {
      localStorage.setItem('ya7edu_all_subjects', JSON.stringify(allSubjects));
    } catch {}
  }, [allSubjects]);

  // Sync grade with localStorage or profile
  useEffect(() => {
    try {
      const storedGrade = localStorage.getItem('ya7edu_student_grade') as AcademicGradeId;
      if (storedGrade) {
        setStudentGradeIdState(storedGrade);
      }
    } catch {}
  }, []);

  const loginUser = (user: User) => {
    setCurrentUser(user);
    setUsers(prev => {
      const exists = prev.some(u => u.id === user.id || u.email === user.email);
      if (!exists) return [user, ...prev];
      return prev.map(u => (u.id === user.id ? user : u));
    });
    try {
      localStorage.setItem('ya7edu_session_user', JSON.stringify(user));
      if (user.gradeId) {
        setStudentGradeIdState(user.gradeId as AcademicGradeId);
        localStorage.setItem('ya7edu_student_grade', user.gradeId);
      }
    } catch {}
  };

  const logout = () => {
    try {
      localStorage.removeItem('ya7edu_session_user');
    } catch {}
    const defaultStudent = users.find(u => u.role === 'STUDENT') || mockUsers[4];
    setCurrentUser(defaultStudent);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const setStudentGradeId = (gradeId: AcademicGradeId) => {
    setStudentGradeIdState(gradeId);
    try {
      localStorage.setItem('ya7edu_student_grade', gradeId);
    } catch {}
    // Update current user profile if student
    if (currentUser.role === 'STUDENT') {
      setCurrentUser(prev => ({ ...prev, gradeId }));
      setUsers(prev => prev.map(u => (u.id === currentUser.id ? { ...u, gradeId } : u)));
    }
  };

  const activeGradeDetails =
    academicGrades.find(g => g.id === studentGradeId) || academicGrades[0] || mockAcademicGrades[0];
  const gradeSubjects = allSubjects.filter(s => s.gradeId === studentGradeId);

  const addGrade = (newGrade: { nameAr: string; nameEn?: string; stage?: string; description?: string }): AcademicGrade => {
    const id = `grade_sec_${Date.now()}`;
    const grade: AcademicGrade = {
      id,
      nameAr: newGrade.nameAr,
      nameEn: newGrade.nameEn || newGrade.nameAr,
      stage: newGrade.stage || 'المرحلة الدراسية',
      description: newGrade.description || 'مقررات ومناهج تعليمية معتمدة'
    };
    setAcademicGrades(prev => [...prev, grade]);
    logAudit('CREATE_GRADE', `إضافة صف دراسي جديد: ${grade.nameAr}`);

    fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGrade)
    }).then(r => r.json()).then(data => {
      if (data.success && data.grade) {
        setAcademicGrades(prev => prev.map(g => g.id === id ? data.grade : g));
      }
    }).catch(err => console.error('Failed to persist grade to VPS:', err));

    return grade;
  };

  const updateGrade = (id: string, updates: Partial<AcademicGrade>) => {
    setAcademicGrades(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
    logAudit('UPDATE_GRADE', `تعديل بيانات الصف الدراسي: ${id}`);

    fetch('/api/grades', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    }).catch(err => console.error('Failed to update grade on VPS:', err));
  };

  const deleteGrade = (id: string) => {
    setAcademicGrades(prev => prev.filter(g => g.id !== id));
    setAllSubjects(prev => prev.filter(s => s.gradeId !== id));
    logAudit('DELETE_GRADE', `حذف الصف الدراسي وكافة مواده المرتبطة: ${id}`);

    fetch(`/api/grades?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(err => console.error('Failed to delete grade from VPS:', err));
  };

  const addSubject = (newSubject: {
    nameAr: string;
    nameEn?: string;
    gradeId: string;
    icon?: string;
    color?: string;
    description?: string;
  }): Subject => {
    const id = `subj_${Date.now()}`;
    const subject: Subject = {
      id,
      nameAr: newSubject.nameAr,
      nameEn: newSubject.nameEn || newSubject.nameAr,
      gradeId: newSubject.gradeId,
      icon: newSubject.icon || 'BookOpen',
      color: newSubject.color || '#6366f1',
      description: newSubject.description || 'محتوى ومذكرات تعليمية شاملة'
    };
    setAllSubjects(prev => [...prev, subject]);
    logAudit('CREATE_SUBJECT', `إضافة مادة جديدة: ${subject.nameAr}`);

    fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubject)
    }).then(r => r.json()).then(data => {
      if (data.success && data.subject) {
        setAllSubjects(prev => prev.map(s => s.id === id ? data.subject : s));
      }
    }).catch(err => console.error('Failed to persist subject to VPS:', err));

    return subject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setAllSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAudit('UPDATE_SUBJECT', `تعديل المادة الدراسية: ${id}`);

    fetch('/api/subjects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    }).catch(err => console.error('Failed to update subject on VPS:', err));
  };

  const deleteSubject = (id: string) => {
    setAllSubjects(prev => prev.filter(s => s.id !== id));
    logAudit('DELETE_SUBJECT', `حذف المادة الدراسية: ${id}`);

    fetch(`/api/subjects?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(err => console.error('Failed to delete subject from VPS:', err));
  };

  const logAudit = (action: string, details: string, actorName = currentUser.name, actorRole = currentUser.role) => {
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      actorName,
      actorRole,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    setImpersonatedByAdmin(false);
    let target = users.find(u => u.role === role && u.status === 'ACTIVE');
    if (!target) target = mockUsers.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      if (target.gradeId) {
        setStudentGradeIdState(target.gradeId);
      }
    }
  };

  const impersonateUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setImpersonatedByAdmin(true);
      if (target.gradeId) setStudentGradeIdState(target.gradeId);
      logAudit('ADMIN_IMPERSONATION', `Admin impersonated user: ${target.name} (${target.email})`);
    }
  };

  const stopImpersonating = () => {
    const admin = users.find(u => u.role === 'ADMIN') || mockUsers[0];
    setCurrentUser(admin);
    setImpersonatedByAdmin(false);
    logAudit('IMPERSONATION_ENDED', `Admin returned to active session as ${admin.name}`);
  };

  // Subscriptions logic
  const isSubscribedToInstructor = (instructorId: string, subjectId: string) => {
    return subscriptions.some(
      s =>
        s.studentId === currentUser.id &&
        s.instructorId === instructorId &&
        s.subjectId === subjectId &&
        s.status === 'ACTIVE'
    );
  };

  const getSubscription = (instructorId: string, subjectId: string) => {
    return subscriptions.find(
      s =>
        s.studentId === currentUser.id &&
        s.instructorId === instructorId &&
        s.subjectId === subjectId &&
        s.status === 'ACTIVE'
    );
  };

  const subscribeWithPayment = (
    instructorId: string,
    subjectId: string,
    duration: VoucherDuration,
    method: 'CREDIT_CARD' | 'DIGITAL_WALLET'
  ) => {
    const content = instructorContents.find(c => c.instructorId === instructorId && c.subjectId === subjectId);
    const durationMap: Record<VoucherDuration, { days: number; label: string }> = {
      '1_MONTH': { days: 30, label: '1 Month Access (اشتراك شهر)' },
      '3_MONTHS': { days: 90, label: '3 Months Access (اشتراك 3 أشهر)' },
      'FULL_TERM': { days: 120, label: 'Full Term Access (اشتراك الترم كاملاً)' },
      'FULL_YEAR': { days: 300, label: 'Full Academic Year Access (اشتراك العام كاملاً)' },
    };

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + durationMap[duration].days);

    const newSub: TeacherSubscription = {
      id: `sub_${Date.now()}`,
      studentId: currentUser.id,
      instructorId,
      instructorName: content?.instructorName || 'Teacher',
      instructorAvatar: content?.instructorAvatar || currentUser.avatar,
      subjectId,
      subjectName: content?.subjectName || 'Subject',
      gradeId: studentGradeId,
      activatedAt: new Date().toISOString(),
      expiresAt: expDate.toISOString(),
      durationLabel: durationMap[duration].label,
      paymentMethod: method,
      status: 'ACTIVE'
    };

    setSubscriptions(prev => [newSub, ...prev]);

    fetch('/api/subscriptions/admin-activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: currentUser.id,
        instructorId,
        subjectId,
        duration,
        paymentMethod: method,
        notes: 'Online direct card / wallet subscription'
      })
    }).catch(err => console.error('Direct subscription persist error:', err));

    logAudit(
      'DIRECT_SUBSCRIPTION_PURCHASED',
      `Student ${currentUser.name} purchased ${durationMap[duration].label} for ${newSub.instructorName} via ${method}`
    );
    return newSub;
  };

  // Scratch Card Voucher Redemption Engine
  const redeemVoucher = (inputCode: string) => {
    const cleanCode = inputCode.trim().toUpperCase();
    const targetVoucher = vouchers.find(v => v.code.toUpperCase() === cleanCode);

    if (!targetVoucher) {
      return { success: false, message: 'Invalid voucher code. Please check the code on your card.' };
    }

    if (targetVoucher.status === 'EXPIRED' || new Date(targetVoucher.expiresAt) < new Date()) {
      return { success: false, message: 'This scratch card code has expired.' };
    }

    if (targetVoucher.status === 'REDEEMED') {
      return { success: false, message: 'This scratch card has already been redeemed.' };
    }

    // Valid voucher! Create subscription
    const durationMap: Record<VoucherDuration, { days: number; label: string }> = {
      '1_MONTH': { days: 30, label: '1 Month Access (كارت شهر)' },
      '3_MONTHS': { days: 90, label: '3 Months Access (كارت 3 أشهر)' },
      'FULL_TERM': { days: 120, label: 'Full Term Access (كارت الترم كاملاً)' },
      'FULL_YEAR': { days: 300, label: 'Full Academic Year Access (كارت العام كاملاً)' },
    };

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + durationMap[targetVoucher.duration].days);

    const newSub: TeacherSubscription = {
      id: `sub_vch_${Date.now()}`,
      studentId: currentUser.id,
      instructorId: targetVoucher.instructorId,
      instructorName: targetVoucher.instructorName,
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      subjectId: targetVoucher.subjectId,
      subjectName: targetVoucher.subjectName,
      gradeId: targetVoucher.gradeId,
      activatedAt: new Date().toISOString(),
      expiresAt: expDate.toISOString(),
      durationLabel: durationMap[targetVoucher.duration].label,
      paymentMethod: 'VOUCHER_CARD',
      voucherCodeUsed: targetVoucher.code,
      status: 'ACTIVE'
    };

    // Update voucher status
    setVouchers(prev =>
      prev.map(v =>
        v.code.toUpperCase() === cleanCode
          ? { ...v, status: 'REDEEMED', redeemedByUserId: currentUser.id, redeemedAt: new Date().toISOString() }
          : v
      )
    );

    // Save subscription
    setSubscriptions(prev => [newSub, ...prev]);

    // Dispatch background sync to VPS MySQL database
    fetch('/api/vouchers/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        studentId: currentUser.id,
        instructorId: targetVoucher.instructorId,
        subjectId: targetVoucher.subjectId
      })
    }).catch(err => console.warn('VPS voucher sync notice:', err));

    logAudit(
      'VOUCHER_REDEEMED',
      `Student ${currentUser.name} redeemed scratch card ${targetVoucher.code} for ${targetVoucher.instructorName} (${targetVoucher.durationLabelEn})`
    );

    return {
      success: true,
      message: `Card redeemed successfully! Unlocked ${targetVoucher.durationLabelAr} with ${targetVoucher.instructorName}.`,
      subscription: newSub
    };
  };

  const adminActivateSubscription = async (data: {
    studentId: string;
    instructorId: string;
    subjectId: string;
    duration: VoucherDuration;
    notes?: string;
  }) => {
    try {
      const res = await fetch('/api/subscriptions/admin-activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success && result.subscription) {
        setSubscriptions(prev => {
          const filtered = prev.filter(s => s.id !== result.subscription.id);
          return [result.subscription, ...filtered];
        });
        logAudit(
          'ADMIN_ACTIVATED_SUBSCRIPTION',
          `Admin activated subscription for student ${result.subscription.studentId} with ${result.subscription.instructorName} (${result.subscription.durationLabel})`
        );
        return { success: true, message: result.message, subscription: result.subscription };
      }
      return { success: false, message: result.error || 'تعذر تفعيل الاشتراك' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // Admin Batch Voucher Generator
  const generateVouchers = (
    instructorId: string,
    subjectId: string,
    gradeId: AcademicGradeId,
    duration: VoucherDuration,
    count: number,
    priceLabel?: string
  ) => {
    const instructor = users.find(u => u.id === instructorId) || mockUsers[1];
    const subject = mockSubjects.find(s => s.id === subjectId) || mockSubjects[0];

    const durationLabels: Record<VoucherDuration, { en: string; ar: string; tag: string }> = {
      '1_MONTH': { en: '1 Month Access', ar: 'اشتراك شهر واحد', tag: '1M' },
      '3_MONTHS': { en: '3 Months Access', ar: 'اشتراك 3 أشهر', tag: '3M' },
      'FULL_TERM': { en: 'Full Academic Term Access', ar: 'اشتراك الترم كاملاً', tag: 'TERM' },
      'FULL_YEAR': { en: 'Full Academic Year Access', ar: 'اشتراك العام كاملاً', tag: 'YEAR' },
    };

    const newBatch: VoucherCode[] = [];
    const batchId = `BATCH-${Date.now().toString().slice(-6)}`;
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 2); // 2 years expiration

    for (let i = 0; i < count; i++) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const randomChar = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `YA7-${durationLabels[duration].tag}-${randomSuffix}-${randomChar}`;
      newBatch.push({
        code,
        instructorId,
        instructorName: instructor.name,
        subjectId,
        subjectName: subject.nameAr,
        gradeId,
        duration,
        durationLabelEn: durationLabels[duration].en,
        durationLabelAr: durationLabels[duration].ar,
        priceLabel: priceLabel || '150 ج.م',
        batchId,
        status: 'AVAILABLE',
        expiresAt: expDate.toISOString()
      });
    }

    setVouchers(prev => [...newBatch, ...prev]);

    // Dispatch background creation to VPS MySQL database
    fetch('/api/vouchers/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instructorId,
        subjectId,
        gradeId,
        duration,
        count,
        priceLabel: priceLabel || '150 ج.م'
      })
    }).catch(err => console.warn('VPS voucher generate notice:', err));

    logAudit('VOUCHERS_GENERATED', `Admin generated batch of ${count} voucher cards (${duration}, ${priceLabel || '150 ج.م'}) for ${instructor.name}`);
    return newBatch;
  };

  // Admin Instructor Creation & Subscription Engine
  const createInstructor = (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    assignedGradeIds: AcademicGradeId[];
    assignedSubjectIds: string[];
    validityType: PlatformValidityType;
    validityDurationLabel: string;
    validityExpiresAt?: string;
  }) => {
    const newId = `inst_${Date.now()}`;
    const avatarList = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    ];
    const randomAvatar = avatarList[Math.floor(Math.random() * avatarList.length)];

    const newUser: User = {
      id: newId,
      name: data.name,
      email: data.email,
      phone: data.phone || '01000000000',
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      avatar: randomAvatar,
      headline: `معلم معتمد على منصة YA7EDU`,
      bio: `معلم معتمد لمناهج الثانوية العامة.`,
      assignedGradeIds: data.assignedGradeIds,
      assignedSubjectIds: data.assignedSubjectIds,
      validityType: data.validityType,
      validityDurationLabel: data.validityDurationLabel,
      validityExpiresAt: data.validityExpiresAt,
      joinedAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);

    // Create primary content record for their first subject
    const primarySubjectId = data.assignedSubjectIds[0] || 'subj_g3_phys';
    const primarySubject = mockSubjects.find(s => s.id === primarySubjectId) || mockSubjects[0];
    const primaryGrade = data.assignedGradeIds[0] || 'grade_sec_3';

    const newContent: InstructorContent = {
      id: `content_${newId}`,
      instructorId: newId,
      instructorName: data.name,
      instructorTitle: `معلم مادة ${primarySubject.nameAr}`,
      instructorAvatar: randomAvatar,
      subjectId: primarySubjectId,
      subjectName: primarySubject.nameAr,
      gradeId: primaryGrade,
      term: 'Full Year',
      priceMonthly: 180,
      priceTerm: 450,
      priceYear: 800,
      rating: 5.0,
      totalSubscribers: 0,
      bioAr: `المحتوى المعتمد للأستاذ ${data.name} على منصة YA7EDU.`,
      chapters: [
        {
          id: `chap_${Date.now()}_1`,
          chapterNumber: 1,
          titleEn: 'Chapter 1: Fundamentals',
          titleAr: 'الباب الأول: التأسيس والمفاهيم الأولية',
          lessons: [
            {
              id: `les_${Date.now()}_1`,
              order: 1,
              titleEn: 'Lecture 1: Introduction (Free Preview 1)',
              titleAr: 'المحاضرة 1: مقدمة شاملة وتأسيس (معاينة مجانية 1 من 2)',
              durationMinutes: 40,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              isCompleted: false,
              isFree: true
            },
            {
              id: `les_${Date.now()}_2`,
              order: 2,
              titleEn: 'Lecture 2: Core Applications (Free Preview 2)',
              titleAr: 'المحاضرة 2: القوانين والتطبيقات الهامة (معاينة مجانية 2 من 2)',
              durationMinutes: 55,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              isCompleted: false,
              isFree: true
            },
            {
              id: `les_${Date.now()}_3`,
              order: 3,
              titleEn: 'Lecture 3: Advanced Exercises (Subscription Required)',
              titleAr: 'المحاضرة 3: حل المسائل والأفكار العليا (يتطلب اشتراك)',
              durationMinutes: 60,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              isCompleted: false,
              isFree: false
            }
          ]
        }
      ],
      booklets: [
        {
          id: `bkt_${Date.now()}_1`,
          titleEn: 'Lecture Booklet & Homework',
          titleAr: 'مذكرة شرح الباب الأول والواجبات',
          pageCount: 32,
          fileSize: '4.1 MB',
          downloadUrl: '#',
          type: 'BOOKLET',
          uploadDate: new Date().toISOString(),
          isFree: true
        }
      ],
      revisions: [
        {
          id: `rev_${Date.now()}_1`,
          titleEn: 'Exam Night Review Sheet',
          titleAr: 'مذكرة ليلة الامتحان والمراجعة الشاملة',
          pageCount: 45,
          fileSize: '5.8 MB',
          downloadUrl: '#',
          type: 'REVISION',
          uploadDate: new Date().toISOString(),
          isFree: false
        }
      ],
      ya7eduBooklets: [
        {
          id: `ya7_${Date.now()}_1`,
          titleEn: 'YA7EDU Exclusive Compendium',
          titleAr: 'مذكرة YA7EDU الذهبية الحصرية لأسئلة بنك المعرفة',
          pageCount: 50,
          fileSize: '6.5 MB',
          downloadUrl: '#',
          type: 'YA7EDU_EXCLUSIVE',
          uploadDate: new Date().toISOString(),
          isExclusive: true,
          isFree: false
        }
      ]
    };

    setInstructorContents(prev => [newContent, ...prev]);

    fetch('/api/admin/instructors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()).then(res => {
      if (res.success && res.instructor) {
        setUsers(prev => prev.map(u => u.id === newId ? res.instructor : u));
        if (res.content) {
          setInstructorContents(prev => prev.map(c => c.id === newContent.id ? res.content : c));
        }
      }
    }).catch(err => console.error('Failed to persist instructor to VPS:', err));

    logAudit(
      'INSTRUCTOR_CREATED_BY_ADMIN',
      `Admin created instructor ${data.name} with validity ${data.validityDurationLabel} (${data.validityType})`
    );

    return newUser;
  };

  const updateInstructorSubscription = (
    instructorId: string,
    updates: {
      validityType?: PlatformValidityType;
      validityDurationLabel?: string;
      validityExpiresAt?: string;
      assignedGradeIds?: AcademicGradeId[];
      assignedSubjectIds?: string[];
      status?: UserStatus;
    }
  ) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === instructorId) {
          const updated = { ...u, ...updates };
          return updated;
        }
        return u;
      })
    );

    fetch('/api/admin/instructors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instructorId, ...updates })
    }).catch(err => console.error('Failed to update instructor validity in VPS:', err));

    logAudit(
      'INSTRUCTOR_SUBSCRIPTION_UPDATED',
      `Admin updated subscription/validity for instructor ${instructorId}: ${updates.validityDurationLabel || updates.status}`
    );
  };

  // 4-Tab Content state management
  const getInstructorContent = (instructorId: string, subjectId: string) => {
    return instructorContents.find(
      c => c.instructorId === instructorId && (c.subjectId === subjectId || subjectId === '')
    ) || instructorContents[0];
  };

  const toggleLessonProgress = (contentId: string, lessonId: string) => {
    setInstructorContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          return {
            ...c,
            chapters: c.chapters.map(chap => ({
              ...chap,
              lessons: chap.lessons.map(les =>
                les.id === lessonId ? { ...les, isCompleted: !les.isCompleted } : les
              )
            }))
          };
        }
        return c;
      })
    );
  };

  const addChapter = async (contentId: string, titleEn: string, titleAr: string) => {
    const tempId = `chap_${Date.now()}`;
    const newChap: Chapter = {
      id: tempId,
      chapterNumber: 99,
      titleEn: titleEn || titleAr,
      titleAr,
      lessons: []
    };

    setInstructorContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          return { ...c, chapters: [...c.chapters, { ...newChap, chapterNumber: c.chapters.length + 1 }] };
        }
        return c;
      })
    );

    try {
      const res = await fetch('/api/instructor/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_CHAPTER',
          contentId,
          titleAr,
          titleEn
        })
      });
      const data = await res.json();
      if (data.success && data.chapter) {
        setInstructorContents(prev =>
          prev.map(c => {
            if (c.id === contentId) {
              return {
                ...c,
                chapters: c.chapters.map(ch => (ch.id === tempId ? { ...ch, id: data.chapter.id } : ch))
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error('Failed to persist chapter to VPS:', err);
    }

    logAudit('CHAPTER_ADDED', `Instructor added new chapter: ${titleEn} (${titleAr})`);
  };

  const addLessonToChapter = async (contentId: string, chapterId: string, lessonData: Partial<LessonVideo>) => {
    const tempId = `les_${Date.now()}`;
    const newLesson: LessonVideo = {
      id: tempId,
      titleEn: lessonData.titleEn || 'New Lecture',
      titleAr: lessonData.titleAr || 'محاضرة جديدة',
      durationMinutes: lessonData.durationMinutes || 45,
      videoUrl: lessonData.videoUrl || '',
      order: 99,
      notes: lessonData.notes,
      isFree: Boolean(lessonData.isFree)
    };

    // Optimistic local update
    setInstructorContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          return {
            ...c,
            chapters: c.chapters.map(chap => {
              if (chap.id === chapterId) {
                return { ...chap, lessons: [...chap.lessons, { ...newLesson, order: chap.lessons.length + 1 }] };
              }
              return chap;
            })
          };
        }
        return c;
      })
    );

    // Persist to VPS database
    try {
      const res = await fetch('/api/instructor/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_LESSON',
          contentId,
          chapterId,
          lesson: {
            titleAr: lessonData.titleAr,
            titleEn: lessonData.titleEn,
            durationMinutes: lessonData.durationMinutes,
            videoUrl: lessonData.videoUrl,
            isFree: lessonData.isFree,
            notes: lessonData.notes
          }
        })
      });
      const data = await res.json();
      if (data.success && data.lesson) {
        setInstructorContents(prev =>
          prev.map(c => {
            if (c.id === contentId) {
              return {
                ...c,
                chapters: c.chapters.map(chap => {
                  if (chap.id === chapterId) {
                    return {
                      ...chap,
                      lessons: chap.lessons.map(l => (l.id === tempId ? { ...l, id: data.lesson.id } : l))
                    };
                  }
                  return chap;
                })
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error('Failed to persist lesson to VPS:', err);
    }
  };

  const deleteLessonFromChapter = async (contentId: string, chapterId: string, lessonId: string) => {
    setInstructorContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          return {
            ...c,
            chapters: c.chapters.map(chap => {
              if (chap.id === chapterId) {
                return {
                  ...chap,
                  lessons: chap.lessons.filter(l => l.id !== lessonId)
                };
              }
              return chap;
            })
          };
        }
        return c;
      })
    );

    try {
      await fetch('/api/instructor/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE_LESSON',
          lessonId
        })
      });
    } catch (err) {
      console.error('Failed to delete lesson from VPS:', err);
    }
  };

  const addBookletItem = async (contentId: string, itemData: Partial<BookletItem>) => {
    const tempId = `bk_${Date.now()}`;
    const newItem: BookletItem = {
      id: tempId,
      titleEn: itemData.titleEn || 'New Material',
      titleAr: itemData.titleAr || 'ملف جديد',
      chapterTitle: itemData.chapterTitle,
      pageCount: itemData.pageCount || (itemData.format === 'INTERACTIVE_PRACTICE' ? itemData.questions?.length || 10 : 20),
      fileSize: itemData.fileSize || (itemData.format === 'VIDEO' ? '75 MB' : '3.5 MB'),
      downloadUrl: itemData.downloadUrl || '#',
      type: itemData.type || 'BOOKLET',
      uploadDate: new Date().toISOString().split('T')[0],
      isExclusive: itemData.isExclusive,
      isFree: itemData.isFree,
      format: itemData.format || 'PDF',
      questions: itemData.questions,
      videoUrl: itemData.videoUrl,
      durationMinutes: itemData.durationMinutes
    };

    setInstructorContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          if (newItem.type === 'BOOKLET') {
            return { ...c, booklets: [...c.booklets, newItem] };
          } else if (newItem.type === 'REVISION') {
            return { ...c, revisions: [...c.revisions, newItem] };
          } else {
            return { ...c, ya7eduBooklets: [...c.ya7eduBooklets, newItem] };
          }
        }
        return c;
      })
    );

    try {
      const res = await fetch('/api/instructor/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_BOOKLET',
          contentId,
          item: itemData
        })
      });
      const data = await res.json();
      if (data.success && data.item) {
        setInstructorContents(prev =>
          prev.map(c => {
            if (c.id === contentId) {
              const swapId = (list: BookletItem[]) =>
                list.map(b => (b.id === tempId ? { ...b, id: data.item.id } : b));
              return {
                ...c,
                booklets: swapId(c.booklets),
                revisions: swapId(c.revisions),
                ya7eduBooklets: swapId(c.ya7eduBooklets)
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error('Failed to persist booklet to VPS:', err);
    }
  };

  const deleteBookletItem = async (contentId: string, itemId: string) => {
    setInstructorContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          return {
            ...c,
            booklets: c.booklets.filter(b => b.id !== itemId),
            revisions: c.revisions.filter(r => r.id !== itemId),
            ya7eduBooklets: c.ya7eduBooklets.filter(y => y.id !== itemId)
          };
        }
        return c;
      })
    );

    try {
      await fetch('/api/instructor/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE_BOOKLET',
          itemId
        })
      });
    } catch (err) {
      console.error('Failed to delete booklet from VPS:', err);
    }
  };

  // Instructor Exams Management & Embargo Logic
  const createInstructorExam = (examData: Omit<InstructorExam, 'id' | 'createdAt'>): InstructorExam => {
    const tempId = `exam_${Date.now()}`;
    const newExam: InstructorExam = {
      ...examData,
      id: tempId,
      createdAt: new Date().toISOString()
    };
    setInstructorExams(prev => [newExam, ...prev]);
    setInstructorContents(prev =>
      prev.map(c => {
        if (c.instructorId === examData.instructorId) {
          return {
            ...c,
            exams: [newExam, ...(c.exams || [])]
          };
        }
        return c;
      })
    );

    // Persist to VPS database
    fetch('/api/instructor/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_EXAM',
        exam: examData
      })
    }).then(r => r.json()).then(data => {
      if (data.success && data.examId) {
        setInstructorExams(prev =>
          prev.map(ex => (ex.id === tempId ? { ...ex, id: data.examId } : ex))
        );
      }
    }).catch(err => {
      console.error('Failed to persist exam to VPS:', err);
    });

    logAudit(
      'EXAM_CREATED',
      `Instructor ${examData.instructorName} created exam: ${examData.title} (${examData.durationMinutes} min, Hide result: ${examData.hideResultUntilDurationEnds ? 'Yes' : 'No'})`
    );
    return newExam;
  };

  const updateInstructorExam = (examId: string, updates: Partial<InstructorExam>) => {
    setInstructorExams(prev =>
      prev.map(ex => (ex.id === examId ? { ...ex, ...updates } : ex))
    );
    setInstructorContents(prev =>
      prev.map(c => ({
        ...c,
        exams: c.exams?.map(ex => (ex.id === examId ? { ...ex, ...updates } : ex))
      }))
    );
    logAudit('EXAM_UPDATED', `Exam ${examId} updated`);
  };

  const deleteInstructorExam = (examId: string) => {
    setInstructorExams(prev => prev.filter(ex => ex.id !== examId));
    setInstructorContents(prev =>
      prev.map(c => ({
        ...c,
        exams: c.exams?.filter(ex => ex.id !== examId)
      }))
    );
    logAudit('EXAM_DELETED', `Exam ${examId} deleted`);

    fetch('/api/instructor/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DELETE_EXAM', examId })
    }).catch(err => console.error('Failed to delete exam from VPS:', err));
  };

  const startExamAttempt = (examId: string): StudentExamAttempt => {
    const existing = studentExamAttempts.find(
      a => a.examId === examId && a.studentId === currentUser.id
    );
    if (existing) return existing;

    const newAttempt: StudentExamAttempt = {
      id: `att_${Date.now()}`,
      examId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      startedAt: new Date().toISOString(),
      answers: {},
      scorePercent: 0,
      totalScore: 0,
      maxScore: 0,
      passed: false,
      isUnlocked: false
    };

    setStudentExamAttempts(prev => [newAttempt, ...prev]);
    return newAttempt;
  };

  const submitExamAttempt = (attemptId: string, answers: Record<string, number>): StudentExamAttempt => {
    const attempt = studentExamAttempts.find(a => a.id === attemptId);
    const exam = instructorExams.find(e => e.id === attempt?.examId);

    if (!attempt || !exam) {
      throw new Error('Attempt or Exam not found');
    }

    const now = new Date();
    let totalScore = 0;
    const maxScore = exam.totalMarks;

    exam.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) {
        totalScore += q.marks;
      }
    });

    const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = scorePercent >= exam.passingPercent;

    // Check embargo rule:
    // The result remains hidden until the official end date and time of the exam expires.
    const deadlineMs = getExamEndDeadlineMs(exam, attempt.startedAt);
    const isDeadlinePassed = now.getTime() >= deadlineMs;
    const isUnlocked = isDeadlinePassed;


    const updatedAttempt: StudentExamAttempt = {
      ...attempt,
      submittedAt: now.toISOString(),
      answers,
      totalScore,
      maxScore,
      scorePercent,
      passed,
      isUnlocked
    };

    setStudentExamAttempts(prev =>
      prev.map(a => (a.id === attemptId ? updatedAttempt : a))
    );

    fetch('/api/exams/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        examId: exam.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        answers,
        totalScore,
        maxScore,
        scorePercent,
        passed,
        isUnlocked
      })
    }).catch(err => console.error('Failed to submit exam attempt to VPS:', err));

    logAudit(
      'EXAM_SUBMITTED',
      `Student ${currentUser.name} submitted exam ${exam.title} (${scorePercent}% - Result Unlocked: ${isUnlocked ? 'Yes' : 'Hidden until time ends'})`
    );

    return updatedAttempt;
  };

  const unlockExamAttempt = (attemptId: string) => {
    setStudentExamAttempts(prev =>
      prev.map(a => (a.id === attemptId ? { ...a, isUnlocked: true } : a))
    );
    logAudit('EXAM_RESULT_UNLOCKED', `Exam attempt ${attemptId} results revealed`);
  };

  const getExamAttempt = (examId: string, studentId = currentUser.id) => {
    return studentExamAttempts.find(
      a => a.examId === examId && a.studentId === studentId
    );
  };

  const getExamSubmissions = (examId: string) => {
    return studentExamAttempts.filter(a => a.examId === examId);
  };

  // Backwards compatibility handlers
  const toggleLessonComplete = (courseId: string, lessonId: string) => {
    toggleLessonProgress(courseId, lessonId);
  };

  const submitQuiz = (courseId: string, lessonId: string, scorePercent: number) => {
    const passed = scorePercent >= 80;
    if (passed) toggleLessonComplete(courseId, lessonId);
    return { passed, score: scorePercent };
  };

  const updateCourseStatus = (courseId: string, status: CourseStatus, rejectionReason?: string) => {
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, status, rejectionReason } : c))
    );

    fetch('/api/admin/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, status, rejectionReason })
    }).catch(err => console.error('Failed to update course status on VPS:', err));
  };

  const saveCourse = (courseData: Partial<Course> & { id?: string }) => {
    const target = courses[0];
    return target;
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u))
    );
  };

  const approveInstructorOnboarding = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: 'INSTRUCTOR', status: 'ACTIVE' } : u))
    );
  };

  const changeUserRole = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role } : u)));
  };

  const approvePayout = (payoutId: string) => {
    setPayoutRequests(prev =>
      prev.map(p => (p.id === payoutId ? { ...p, status: 'PAID' } : p))
    );

    fetch('/api/instructor/payouts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: payoutId, status: 'PAID' })
    }).catch(err => console.error('Failed to approve payout on VPS:', err));
  };

  const rejectPayout = (payoutId: string) => {
    setPayoutRequests(prev =>
      prev.map(p => (p.id === payoutId ? { ...p, status: 'REJECTED' } : p))
    );

    fetch('/api/instructor/payouts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: payoutId, status: 'REJECTED' })
    }).catch(err => console.error('Failed to reject payout on VPS:', err));
  };

  const requestInstructorPayout = (amount: number, method: string, account: string) => {
    const tempId = `pay_${Date.now()}`;
    const newPayout: PayoutRequest = {
      id: tempId,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      instructorAvatar: currentUser.avatar,
      amount,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      payoutMethod: method,
      accountDetails: account
    };
    setPayoutRequests(prev => [newPayout, ...prev]);

    fetch('/api/instructor/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instructorId: currentUser.id,
        amount,
        method,
        account
      })
    }).then(r => r.json()).then(data => {
      if (data.success && data.payout) {
        setPayoutRequests(prev => prev.map(p => p.id === tempId ? data.payout : p));
      }
    }).catch(err => console.error('Failed to persist payout request on VPS:', err));
  };

  const updatePlatformConfig = (newConfig: Partial<PlatformConfig>) => {
    const updated = { ...platformConfig, ...newConfig };
    setPlatformConfig(updated);

    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(err => console.error('Failed to persist platform settings to VPS:', err));
  };

  const replyToReview = () => {};

  return (
    <LMSContext.Provider
      value={{
        currentUser,
        isHydrated,
        isLiveDbReady,
        impersonatedByAdmin,
        switchRole,
        impersonateUser,
        stopImpersonating,
        loginUser,
        logout,
        isLoadingLiveDb,
        refreshLMSData,
        studentGradeId,
        setStudentGradeId,
        activeGradeDetails,
        gradeSubjects,
        academicGrades,
        allSubjects,
        addGrade,
        updateGrade,
        deleteGrade,
        addSubject,
        updateSubject,
        deleteSubject,
        subscriptions,
        vouchers,
        isSubscribedToInstructor,
        getSubscription,
        subscribeWithPayment,
        redeemVoucher,
        adminActivateSubscription,
        generateVouchers,
        createInstructor,
        updateInstructorSubscription,
        instructorContents,
        getInstructorContent,
        toggleLessonProgress,
        addChapter,
        addLessonToChapter,
        deleteLessonFromChapter,
        addBookletItem,
        deleteBookletItem,
        instructorExams,
        studentExamAttempts,
        createInstructorExam,
        updateInstructorExam,
        deleteInstructorExam,
        startExamAttempt,
        submitExamAttempt,
        unlockExamAttempt,
        getExamAttempt,
        getExamSubmissions,
        users,
        courses,
        enrollments,
        payoutRequests,
        transactions,
        auditLogs,
        platformConfig,
        toggleLessonComplete,
        submitQuiz,
        updateCourseStatus,
        saveCourse,
        toggleUserStatus,
        approveInstructorOnboarding,
        changeUserRole,
        approvePayout,
        rejectPayout,
        requestInstructorPayout,
        updatePlatformConfig,
        replyToReview
      }}
    >
      {children}
    </LMSContext.Provider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (!context) throw new Error('useLMS must be used within an LMSProvider');
  return context;
}
