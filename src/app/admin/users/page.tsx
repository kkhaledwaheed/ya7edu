'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import { UserRole, UserStatus, User, VoucherDuration } from '@/lib/types';
import {
  Users,
  Search,
  Filter,
  Eye,
  Shield,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Ban,
  ArrowLeft,
  Clock,
  Sparkles,
  Ticket,
  MessageCircle,
  Plus,
  Check,
  X,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminUsersPage() {
  const router = useRouter();
  const {
    users,
    impersonateUser,
    toggleUserStatus,
    approveInstructorOnboarding,
    changeUserRole,
    currentUser,
    subscriptions,
    adminActivateSubscription,
    allSubjects,
    academicGrades,
    refreshLMSData,
    isLoadingLiveDb
  } = useLMS();

  useEffect(() => {
    refreshLMSData();
  }, []);

  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  // حالة نافذة تفعيل اشتراك طالب
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<VoucherDuration>('1_MONTH');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmittingActivation, setIsSubmittingActivation] = useState(false);

  const instructorsList = users.filter(u => u.role === 'INSTRUCTOR');
  const studentsList = users.filter(u => u.role === 'STUDENT');

  // طلبات الاشتراكات القادمة عبر واتساب بانتظار التأكيد
  const pendingWhatsAppSubs = subscriptions.filter(s => s.status === 'PENDING_ADMIN_PAYMENT');

  // تصفية المستخدمين
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    if (!matchesSearch) return false;

    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;

    return true;
  });

  const pendingOnboarding = users.filter(u => u.status === 'PENDING_APPROVAL');

  const handleImpersonate = (userId: string, role: UserRole) => {
    impersonateUser(userId);
    const dest = role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : '/student';
    router.push(dest);
  };

  const handleApproveInstructor = (userId: string, name: string) => {
    approveInstructorOnboarding(userId);
    setAlertNotice(`تمت الموافقة بنجاح على انضمام ${name} كمعلم معتمد على منصة YA7EDU!`);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // فتح نافذة تفعيل اشتراك لطالب محدد
  const handleOpenActivateModal = (student?: User) => {
    const targetStudent = student || studentsList[0] || null;
    setSelectedStudent(targetStudent);
    if (instructorsList.length > 0 && !selectedInstructorId) {
      setSelectedInstructorId(instructorsList[0].id);
    }
    if (allSubjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(allSubjects[0].id);
    }
    setPaymentNotes('تم استلام التحويل عبر فودافون كاش / انستاباي (01090138676)');
    setActivateModalOpen(true);
  };

  // تأكيد تفعيل الاشتراك وحفظه في السيرفر
  const handleConfirmActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedInstructorId || !selectedSubjectId) {
      alert('يرجى تحديد الطالب والمعلم والمادة الدراسية.');
      return;
    }

    setIsSubmittingActivation(true);
    const res = await adminActivateSubscription({
      studentId: selectedStudent.id,
      instructorId: selectedInstructorId,
      subjectId: selectedSubjectId,
      duration: selectedDuration,
      notes: paymentNotes
    });

    setIsSubmittingActivation(false);
    if (res.success) {
      setActivateModalOpen(false);
      setAlertNotice(`تم تفعيل اشتراك الطالب (${selectedStudent.name}) بنجاح! يمكنه الآن فتح كافة المحاضرات والمذكرات.`);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      alert(res.message);
    }
  };

  // تأكيد سريع لطلب واتساب معلق
  const handleQuickConfirmWhatsAppSub = async (sub: any) => {
    const student = users.find(u => u.id === sub.studentId);
    const duration = (sub.durationLabel?.includes('سنة') || sub.durationLabel?.includes('عام'))
      ? 'FULL_YEAR'
      : (sub.durationLabel?.includes('ترم') || sub.durationLabel?.includes('فصل'))
      ? 'FULL_TERM'
      : '1_MONTH';

    const res = await adminActivateSubscription({
      studentId: sub.studentId,
      instructorId: sub.instructorId,
      subjectId: sub.subjectId,
      duration: duration as VoucherDuration,
      notes: 'تأكيد فوري بعد استلام إيصال الواتساب'
    });

    if (res.success) {
      setAlertNotice(`تم تأكيد استلام تحويل الطالب (${student?.name || sub.instructorName}) وتفعيل اشتراكه بنجاح!`);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>إدارة الحسابات وصلاحيات المنصة والاشتراكات</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            إدارة المستخدمين وتفعيل الاشتراكات
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            متابعة حسابات المعلمين والطلاب، تفعيل اشتراكات الطلاب بعد استلام تحويل الواتساب، وتعيين الصلاحيات.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refreshLMSData()}
            disabled={isLoadingLiveDb}
            className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer disabled:opacity-50"
            title="تحديث قائمة الطلاب والمستخدمين مباشرة من قاعدة بيانات الـ VPS"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingLiveDb ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{isLoadingLiveDb ? 'جاري التحديث...' : 'تحديث البيانات'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenActivateModal()}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition hover:scale-105 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>تفعيل اشتراك جديد لطالب (تحويل واتساب)</span>
          </button>
        </div>
      </div>

      {alertNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{alertNotice}</span>
          </div>
          <button
            onClick={() => setAlertNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* قسم طلبات تفعيل اشتراكات الواتساب بانتظار التأكيد */}
      {/* ======================================================== */}
      {pendingWhatsAppSubs.length > 0 && (
        <div className="p-6 rounded-3xl bg-emerald-50/90 border border-emerald-300 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center ring-2 ring-emerald-200">
                <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  طلبات اشتراك عبر الواتساب بانتظار تأكيد الأدمن ({pendingWhatsAppSubs.length})
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  قام هؤلاء الطلاب بالتحويل إلى رقم الإدارة (01090138676). اضغط &quot;تأكيد وتفعيل الاشتراك&quot; بعد مراجعة إيصال التحويل.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingWhatsAppSubs.map(sub => {
              const student = users.find(u => u.id === sub.studentId);
              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs flex flex-col justify-between gap-3 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">
                        {student?.name || 'طالب مسجل'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {student?.phone || student?.email}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      بانتظار التحويل
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">المعلم:</span>
                      <span className="text-slate-900 font-bold">{sub.instructorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">المادة:</span>
                      <span className="text-blue-600 font-bold">{sub.subjectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">الباقة:</span>
                      <span className="text-emerald-700 font-bold">{sub.durationLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickConfirmWhatsAppSub(sub)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>تأكيد الدفع وتفعيل الاشتراك</span>
                    </button>

                    {student?.phone && (
                      <a
                        href={`https://wa.me/2${student.phone.replace(/^0+/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                        title="محادثة الطالب على واتساب"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructor Onboarding Approval Queue Section */}
      {pendingOnboarding.length > 0 && (
        <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              طلبات انضمام المعلمين الجدد ({pendingOnboarding.length} بانتظار الاعتماد)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOnboarding.map(applicant => (
              <div
                key={applicant.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={applicant.avatar} alt={applicant.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{applicant.name}</h3>
                    <p className="text-[11px] text-slate-500">{applicant.email}</p>
                    <p className="text-[10px] text-blue-700 mt-0.5">{applicant.headline}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleApproveInstructor(applicant.id, applicant.name)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition shrink-0 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>اعتماد المعلم</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، رقم الهاتف، أو البريد..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>الدور:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
            >
              <option value="ALL">جميع الأدوار</option>
              <option value="ADMIN">مسؤول (Admin)</option>
              <option value="INSTRUCTOR">معلم (Instructor)</option>
              <option value="STUDENT">طالب (Student)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>الحالة:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="ACTIVE">نشط (Active)</option>
              <option value="SUSPENDED">معلق (Suspended)</option>
              <option value="PENDING_APPROVAL">بانتظار الاعتماد</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users CRUD Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">المستخدم</th>
                <th className="py-3.5 px-4">الدور والصلاحية</th>
                <th className="py-3.5 px-4">حالة الحساب</th>
                <th className="py-3.5 px-4 text-center">الاشتراكات والتحويل</th>
                <th className="py-3.5 px-4">تاريخ الانضمام</th>
                <th className="py-3.5 px-4 text-center">معاينة الهوية</th>
                <th className="py-3.5 px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map(user => {
                const isCurrentUser = user.id === currentUser.id;
                const isStudent = user.role === 'STUDENT';
                const userActiveSubs = subscriptions.filter(s => s.studentId === user.id && s.status === 'ACTIVE');

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {user.name}
                            {isCurrentUser && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded font-mono font-bold">
                                أنت
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {user.phone ? `${user.phone} • ${user.email}` : user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        onChange={e => changeUserRole(user.id, e.target.value as UserRole)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-500"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="INSTRUCTOR">INSTRUCTOR</option>
                        <option value="STUDENT">STUDENT</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : user.status === 'SUSPENDED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-500'
                              : user.status === 'SUSPENDED'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span>{user.status === 'ACTIVE' ? 'نشط' : user.status === 'SUSPENDED' ? 'معلق' : 'قيد المراجعة'}</span>
                      </span>
                    </td>

                    {/* زر تفعيل اشتراك لطالب */}
                    <td className="py-3.5 px-4 text-center">
                      {isStudent ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenActivateModal(user)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                            title="تفعيل اشتراك مع مدرس بعد استلام تحويل الواتساب"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>تفعيل اشتراك</span>
                          </button>
                          {userActiveSubs.length > 0 && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                              {userActiveSubs.length} نشط
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {new Date(user.joinedAt).toLocaleDateString('ar-EG')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {!isCurrentUser ? (
                        <button
                          onClick={() => handleImpersonate(user.id, user.role)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
                          title="معاينة المنصة بهوية هذا المستخدم"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة الهوية</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">الجلسة الحالية</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-left">
                      {!isCurrentUser && (
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            user.status === 'ACTIVE'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'تعليق الحساب' : 'إعادة التفعيل'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* نافذة الأدمن لتفعيل اشتراك طالب بعد استلام تحويل الواتساب */}
      {/* ======================================================== */}
      {activateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans text-right" dir="rtl">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl relative overflow-hidden text-slate-900">
            <button
              type="button"
              onClick={() => setActivateModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pl-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center ring-2 ring-emerald-200">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  إدارة العمليات المالية للاشتراكات
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  تفعيل اشتراك طالب (تأكيد استلام تحويل الواتساب)
                </h2>
                <p className="text-xs text-slate-500">
                  يتم تفعيل الاشتراك مباشرة في قاعدة البيانات وإتاحة الفيديوهات والمذكرات فوراً للطالب.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmActivation} className="space-y-4 text-xs">
              {/* اختيار الطالب */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">الطالب المشترك</label>
                <select
                  value={selectedStudent?.id || ''}
                  onChange={e => {
                    const st = studentsList.find(s => s.id === e.target.value) || null;
                    setSelectedStudent(st);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  {studentsList.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.phone || st.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* اختيار المعلم */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">المعلم المعتمد</label>
                <select
                  value={selectedInstructorId}
                  onChange={e => setSelectedInstructorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  {instructorsList.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.headline || inst.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* اختيار المادة */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">المادة الدراسية</label>
                <select
                  value={selectedSubjectId}
                  onChange={e => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  {allSubjects.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.nameAr} ({sub.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* مدة الاشتراك والباقة */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">مدة وباقة الاشتراك</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDuration('1_MONTH')}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      selectedDuration === '1_MONTH'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>شهر واحد (180 ج.م)</div>
                    <span className="text-[10px] text-slate-500">30 يوماً</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDuration('FULL_TERM')}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      selectedDuration === 'FULL_TERM'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>الترم كاملاً (450 ج.م)</div>
                    <span className="text-[10px] text-slate-500">حتى امتحانات الترم</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDuration('FULL_YEAR')}
                    className={`col-span-2 p-2.5 rounded-xl border text-right transition ${
                      selectedDuration === 'FULL_YEAR'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>العام كاملاً VIP (800 ج.م)</div>
                    <span className="text-[10px] text-slate-500">يشمل مذكرات YA7EDU الحصرية والمراجعات</span>
                  </button>
                </div>
              </div>

              {/* ملاحظات التحويل */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">ملاحظات التحويل ورقم الإيصال</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  placeholder="مثال: تحويل فودافون كاش - إيصال رقم 98124 على 01090138676"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmittingActivation}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmittingActivation ? 'جاري تفعيل الاشتراك...' : 'تأكيد وحفظ الاشتراك في السيرفر'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivateModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
