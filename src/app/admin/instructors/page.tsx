'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import { User, AcademicGradeId, PlatformValidityType, UserStatus } from '@/lib/types';
import { mockAcademicGrades, mockSubjects } from '@/lib/mock-data/grades-subjects';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Edit3,
  RotateCcw,
  Ban,
  UserCheck,
  X,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminInstructorsPage() {
  const router = useRouter();
  const {
    users,
    createInstructor,
    updateInstructorSubscription,
    impersonateUser,
    academicGrades,
    allSubjects
  } = useLMS();

  // تصفية المعلمين فقط
  const instructors = users.filter(u => u.role === 'INSTRUCTOR');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValidity, setFilterValidity] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // حالة نافذة إضافة معلم جديد
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('Password@123');
  const [newPhone, setNewPhone] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<AcademicGradeId[]>(['grade_sec_3']);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['subj_g3_phys']);
  const [newValidityType, setNewValidityType] = useState<PlatformValidityType>('TIME_LIMITED');
  const [newDurationPreset, setNewDurationPreset] = useState<'1_MONTH' | 'FULL_TERM' | 'FULL_YEAR' | 'CUSTOM'>('FULL_YEAR');
  const [newCustomDate, setNewCustomDate] = useState('2027-06-30');

  // حالة نافذة تمديد/تعديل اشتراك المعلم
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInstructorForEdit, setSelectedInstructorForEdit] = useState<User | null>(null);
  const [editValidityType, setEditValidityType] = useState<PlatformValidityType>('TIME_LIMITED');
  const [editDurationPreset, setEditDurationPreset] = useState<'1_MONTH' | 'FULL_TERM' | 'FULL_YEAR' | 'LIFETIME' | 'CUSTOM'>('FULL_TERM');
  const [editCustomDate, setEditCustomDate] = useState('2027-06-30');
  const [editGrades, setEditGrades] = useState<AcademicGradeId[]>([]);
  const [editSubjects, setEditSubjects] = useState<string[]>([]);

  const [mountedTime, setMountedTime] = useState<number | null>(null);

  useEffect(() => {
    setMountedTime(Date.now());
  }, []);

  // دوال التحقق من الصلاحية
  const isInstructorExpired = (instructor: User) => {
    if (instructor.validityType === 'LIFETIME') return false;
    if (!instructor.validityExpiresAt) return false;
    if (!mountedTime) return false;
    return new Date(instructor.validityExpiresAt).getTime() < mountedTime;
  };

  const getRemainingDays = (instructor: User) => {
    if (instructor.validityType === 'LIFETIME') return null;
    if (!instructor.validityExpiresAt) return null;
    if (!mountedTime) return null;
    const diff = new Date(instructor.validityExpiresAt).getTime() - mountedTime;
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  // تصفية القائمة
  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst.phone || '').includes(searchQuery);
    if (!matchesSearch) return false;

    if (filterValidity === 'LIFETIME' && inst.validityType !== 'LIFETIME') return false;
    if (filterValidity === 'EXPIRED' && !isInstructorExpired(inst)) return false;
    if (filterValidity === 'ACTIVE' && (isInstructorExpired(inst) || inst.status !== 'ACTIVE')) return false;

    return true;
  });

  // إضافة معلم جديد
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      alert('يرجى ملء اسم المعلم والبريد الإلكتروني.');
      return;
    }

    let validityLabel = 'مفتوح مدى الحياة';
    let expiresAt: string | undefined = undefined;

    if (newValidityType === 'TIME_LIMITED') {
      const targetDate = new Date();
      if (newDurationPreset === '1_MONTH') {
        targetDate.setDate(targetDate.getDate() + 30);
        validityLabel = 'شهر واحد';
      } else if (newDurationPreset === 'FULL_TERM') {
        targetDate.setDate(targetDate.getDate() + 120);
        validityLabel = 'فصل دراسي (ترم)';
      } else if (newDurationPreset === 'FULL_YEAR') {
        targetDate.setDate(targetDate.getDate() + 365);
        validityLabel = 'سنة دراسية كاملة';
      } else {
        targetDate.setTime(new Date(newCustomDate).getTime());
        validityLabel = `محدد حتى ${new Date(newCustomDate).toLocaleDateString('ar-EG')}`;
      }
      expiresAt = targetDate.toISOString();
    }

    createInstructor({
      name: newName,
      email: newEmail,
      phone: newPhone,
      password: newPassword,
      assignedGradeIds: selectedGrades,
      assignedSubjectIds: selectedSubjects,
      validityType: newValidityType,
      validityDurationLabel: validityLabel,
      validityExpiresAt: expiresAt
    });

    setCreateModalOpen(false);
    setNotification(`تم إنشاء وتفعيل حساب المعلم "${newName}" بنجاح وتخصيص الصلاحيات المطلوبة!`);
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });

    // إعادة تعيين الحقول
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  // فتح نافذة تعديل وتمديد الصلاحية
  const handleOpenEdit = (inst: User) => {
    setSelectedInstructorForEdit(inst);
    setEditValidityType(inst.validityType || 'TIME_LIMITED');
    setEditGrades(inst.assignedGradeIds || ['grade_sec_3']);
    setEditSubjects(inst.assignedSubjectIds || ['subj_g3_phys']);
    setEditCustomDate(
      inst.validityExpiresAt ? new Date(inst.validityExpiresAt).toISOString().split('T')[0] : '2027-06-30'
    );
    setEditModalOpen(true);
  };

  // حفظ التعديلات والتمديد
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstructorForEdit) return;

    let validityLabel = 'مفتوح مدى الحياة';
    let expiresAt: string | undefined = undefined;

    if (editValidityType === 'TIME_LIMITED') {
      const targetDate = new Date();
      if (editDurationPreset === '1_MONTH') {
        targetDate.setDate(targetDate.getDate() + 30);
        validityLabel = 'شهر واحد';
      } else if (editDurationPreset === 'FULL_TERM') {
        targetDate.setDate(targetDate.getDate() + 120);
        validityLabel = 'فصل دراسي (ترم)';
      } else if (editDurationPreset === 'FULL_YEAR') {
        targetDate.setDate(targetDate.getDate() + 365);
        validityLabel = 'سنة دراسية كاملة';
      } else {
        targetDate.setTime(new Date(editCustomDate).getTime());
        validityLabel = `محدد حتى ${new Date(editCustomDate).toLocaleDateString('ar-EG')}`;
      }
      expiresAt = targetDate.toISOString();
    }

    updateInstructorSubscription(selectedInstructorForEdit.id, {
      validityType: editValidityType,
      validityDurationLabel: validityLabel,
      validityExpiresAt: expiresAt,
      assignedGradeIds: editGrades,
      assignedSubjectIds: editSubjects,
      status: 'ACTIVE' // إعادة التنشيط في حال كان منتهي الصلاحية
    });

    setEditModalOpen(false);
    setNotification(`تم تحديث وتمديد اشتراك وصلاحيات المعلم "${selectedInstructorForEdit.name}" بنجاح!`);
    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
  };

  // إيقاف مؤقت أو إعادة تفعيل المعلم
  const handleToggleStatus = (inst: User) => {
    const nextStatus: UserStatus = inst.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateInstructorSubscription(inst.id, { status: nextStatus });
    setNotification(
      nextStatus === 'SUSPENDED'
        ? `تم إيقاف حساب المعلم "${inst.name}" مؤقتاً.`
        : `تم إعادة تفعيل حساب المعلم "${inst.name}".`
    );
  };

  // تسجيل الدخول كمعلم (انتحال الهوية)
  const handleImpersonate = (inst: User) => {
    impersonateUser(inst.id);
    router.push('/instructor');
  };

  return (
    <div className="space-y-8 font-sans text-right">
      {/* رأس الصفحة والإجراءات */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>حوكمة المعلمين وإدارة اشتراكات المنصة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            إنشاء وإدارة اشتراكات المعلمين
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            التسجيل المباشر للمعلمين محظور للعامة ومحصور بالإدارة؛ أنشئ حسابات المدرسين، حدد المواد والصفوف المسندة، واضبط فترات الصلاحية (مفتوح مدى الحياة أو محدد المدة).
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة معلم جديد وتحديد الصلاحية</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            إغلاق
          </button>
        </div>
      )}

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">إجمالي المعلمين المعتمدين</div>
          <div className="text-2xl font-extrabold text-white mt-1">{instructors.length} معلم</div>
          <div className="text-[11px] text-cyan-400 mt-0.5">حصرياً عبر الإدارة</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">اشتراكات مدى الحياة</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {instructors.filter(i => i.validityType === 'LIFETIME').length}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">صلاحية دائمة بدون انتهاء</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">اشتراكات محددة المدة</div>
          <div className="text-2xl font-extrabold text-cyan-300 mt-1">
            {instructors.filter(i => i.validityType === 'TIME_LIMITED' && !isInstructorExpired(i)).length}
          </div>
          <div className="text-[11px] text-cyan-300/80 mt-0.5">تجديد فصلي وسنوي</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-gray-800">
          <div className="text-xs text-gray-400">منتهي الصلاحية / معلق</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">
            {instructors.filter(i => isInstructorExpired(i) || i.status === 'SUSPENDED').length}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-0.5">يتطلب تمديد أو مراجعة</div>
        </div>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="p-4 rounded-2xl glass-card border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Filter className="w-3.5 h-3.5" />
          <span>تصفية الصلاحية:</span>
          <select
            value={filterValidity}
            onChange={e => setFilterValidity(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">جميع المعلمين</option>
            <option value="ACTIVE">نشط وساري الصلاحية</option>
            <option value="LIFETIME">مفتوح مدى الحياة فقط</option>
            <option value="EXPIRED">منتهي الصلاحية</option>
          </select>
        </div>
      </div>

      {/* جدول المعلمين وصلاحياتهم */}
      <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">المعلم</th>
                <th className="py-3.5 px-4">المواد المسندة</th>
                <th className="py-3.5 px-4">الصفوف الدراسية</th>
                <th className="py-3.5 px-4">نوع الصلاحية</th>
                <th className="py-3.5 px-4">حالة الحساب وتاريخ الانتهاء</th>
                <th className="py-3.5 px-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredInstructors.map(inst => {
                const isLifetime = inst.validityType === 'LIFETIME';
                const isExpired = isInstructorExpired(inst);
                const remaining = getRemainingDays(inst);
                const isSuspended = inst.status === 'SUSPENDED';

                return (
                  <tr key={inst.id} className="hover:bg-gray-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inst.avatar}
                          alt={inst.name}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-gray-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{inst.name}</span>
                            {isSuspended && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                                موقوف
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                            <span className="font-mono">{inst.email}</span>
                            {inst.phone && (
                              <span className="text-cyan-400 font-mono flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{inst.phone}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {inst.assignedSubjectIds && inst.assignedSubjectIds.length > 0 ? (
                          inst.assignedSubjectIds.map(subId => {
                            const sub = mockSubjects.find(s => s.id === subId);
                            return (
                              <span
                                key={subId}
                                className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                              >
                                {sub?.nameAr || subId}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-gray-500">الفيزياء</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {inst.assignedGradeIds && inst.assignedGradeIds.length > 0 ? (
                          inst.assignedGradeIds.map(gid => (
                            <span
                              key={gid}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700"
                            >
                              {gid === 'grade_sec_3'
                                ? '3 ثانوي'
                                : gid === 'grade_sec_2'
                                ? '2 ثانوي'
                                : '1 ثانوي'}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">الصف الثالث</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isLifetime ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>دائم (مدى الحياة)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{inst.validityDurationLabel || 'محدد المدة'}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isLifetime ? (
                        <div>
                          <span className="text-xs text-emerald-400 font-bold block">نشط دائم (مدى الحياة)</span>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                            مشترك منذ: {Math.max(1, Math.floor(((mountedTime || new Date(inst.joinedAt || '2023-01-01').getTime()) - new Date(inst.joinedAt || '2023-01-01').getTime()) / (1000 * 3600 * 24 * 30)))} شهر
                          </span>
                        </div>
                      ) : isExpired ? (
                        <div>
                          <div className="text-rose-400 font-bold text-xs flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>منتهي الصلاحية</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                            كان مشتركاً منذ {Math.max(1, Math.floor(((mountedTime || new Date(inst.joinedAt || '2023-01-01').getTime()) - new Date(inst.joinedAt || '2023-01-01').getTime()) / (1000 * 3600 * 24 * 30)))} شهر
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            <span>
                              ينتهي في: {inst.validityExpiresAt
                                ? new Date(inst.validityExpiresAt).toLocaleDateString('ar-EG')
                                : 'محدد'}
                            </span>
                          </div>
                          {remaining !== null && (
                            <div className="text-[11px] text-amber-300 font-mono font-bold mt-0.5">
                              متبقي: {remaining} يوم
                            </div>
                          )}
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                            مشترك منذ: {Math.max(1, Math.floor(((mountedTime || new Date(inst.joinedAt || '2023-01-01').getTime()) - new Date(inst.joinedAt || '2023-01-01').getTime()) / (1000 * 3600 * 24 * 30)))} شهر
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(inst)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-bold transition flex items-center gap-1"
                          title="تمديد أو تعديل الصلاحية"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>تجديد/تعديل</span>
                        </button>

                        <button
                          onClick={() => handleToggleStatus(inst)}
                          className={`p-1.5 rounded-lg border text-[11px] transition ${
                            isSuspended
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                          }`}
                          title={isSuspended ? 'إعادة التفعيل' : 'إيقاف مؤقت'}
                        >
                          {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleImpersonate(inst)}
                          className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-cyan-600 text-gray-300 hover:text-white text-[11px] font-bold transition"
                          title="تسجيل الدخول كمعلم"
                        >
                          <span>دخول كمعلم</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة إنشاء معلم جديد (Admin Only) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl glass-card border border-cyan-500/40 p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pl-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">إضافة معلم جديد وتحديد مدة الاشتراك</h2>
                <p className="text-xs text-gray-400">التسجيل محصور بالإدارة؛ لن يتمكن المعلم من الدخول إلا بالبيانات التي تنشئها هنا.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">اسم المعلم بالكامل *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="مثال: الأستاذ طارق علام"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">البريد الإلكتروني المهني *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="tarek.allam@ya7edu.com"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">رقم الهاتف / الواتساب</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">كلمة المرور الابتدائية *</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* الصفوف الدراسية المسندة */}
              <div>
                <label className="text-gray-300 font-semibold block mb-1.5">
                  الصفوف الدراسية المصرح للمعلم بالتدريس لها:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(academicGrades || mockAcademicGrades).map(g => {
                    const isChecked = selectedGrades.includes(g.id as AcademicGradeId);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => {
                          if (isChecked) {
                            if (selectedGrades.length > 1) {
                              setSelectedGrades(selectedGrades.filter(x => x !== g.id));
                            }
                          } else {
                            setSelectedGrades([...selectedGrades, g.id as AcademicGradeId]);
                          }
                        }}
                        className={`p-2 rounded-xl border text-center transition font-bold ${
                          isChecked
                            ? 'bg-cyan-500/20 border-cyan-400 text-white'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {g.nameAr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* المواد المسندة */}
              <div>
                <label className="text-gray-300 font-semibold block mb-1.5">المواد التخصصية المسندة للمعلم:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(allSubjects || mockSubjects).map(sub => {
                    const isChecked = selectedSubjects.includes(sub.id);
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => {
                          if (isChecked) {
                            if (selectedSubjects.length > 1) {
                              setSelectedSubjects(selectedSubjects.filter(s => s !== sub.id));
                            }
                          } else {
                            setSelectedSubjects([...selectedSubjects, sub.id]);
                          }
                        }}
                        className={`p-2 rounded-xl border text-center transition font-semibold ${
                          isChecked
                            ? 'bg-indigo-600/30 border-indigo-400 text-white'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {sub.nameAr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* نوع وصلاحية اشتراك المعلم في المنصة */}
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
                <label className="text-white font-bold block">
                  صلاحية حساب المعلم على منصة YA7EDU:
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewValidityType('LIFETIME')}
                    className={`p-3 rounded-xl border text-right transition ${
                      newValidityType === 'LIFETIME'
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>مفتوح مدى الحياة</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">صلاحية غير مقيدة بتاريخ انتهاء</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewValidityType('TIME_LIMITED')}
                    className={`p-3 rounded-xl border text-right transition ${
                      newValidityType === 'TIME_LIMITED'
                        ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>محدد المدة (اشتراك ساري)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">شهر / ترم / سنة دراسية</div>
                  </button>
                </div>

                {newValidityType === 'TIME_LIMITED' && (
                  <div className="pt-2 border-t border-gray-800/80 space-y-2">
                    <label className="text-gray-300 font-semibold block text-[11px]">مدة الصلاحية الابتدائية:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: '1_MONTH', label: 'شهر' },
                        { id: 'FULL_TERM', label: 'ترم كامل' },
                        { id: 'FULL_YEAR', label: 'سنة دراسية' },
                        { id: 'CUSTOM', label: 'تاريخ مخصص' }
                      ].map(item => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setNewDurationPreset(item.id as any)}
                          className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition ${
                            newDurationPreset === item.id
                              ? 'bg-cyan-500 text-gray-950 shadow-md'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {newDurationPreset === 'CUSTOM' && (
                      <div className="pt-2">
                        <label className="text-gray-400 text-[10px] block mb-1">حدد تاريخ انتهاء الصلاحية:</label>
                        <input
                          type="date"
                          value={newCustomDate}
                          onChange={e => setNewCustomDate(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-bold hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-cyan-600/30"
                >
                  إنشاء حساب المعلم واعتماده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تعديل وتمديد الصلاحية للمعلم (Edit / Renew) */}
      {editModalOpen && selectedInstructorForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl glass-card border border-indigo-500/40 p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pl-8">
              <img
                src={selectedInstructorForEdit.avatar}
                alt={selectedInstructorForEdit.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0"
              />
              <div>
                <h2 className="text-base font-extrabold text-white">
                  تجديد صلاحية وتعديل اشتراك: {selectedInstructorForEdit.name}
                </h2>
                <p className="text-xs text-gray-400 font-mono">{selectedInstructorForEdit.email}</p>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
                <label className="text-white font-bold block">اختر نوع الصلاحية المحدثة:</label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditValidityType('LIFETIME')}
                    className={`p-3 rounded-xl border text-right transition ${
                      editValidityType === 'LIFETIME'
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ترقية لمدى الحياة</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">بدون تاريخ انتهاء</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditValidityType('TIME_LIMITED')}
                    className={`p-3 rounded-xl border text-right transition ${
                      editValidityType === 'TIME_LIMITED'
                        ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>تمديد محدد المدة</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">إضافة شهر / ترم / سنة</div>
                  </button>
                </div>

                {editValidityType === 'TIME_LIMITED' && (
                  <div className="pt-2 border-t border-gray-800/80 space-y-2">
                    <label className="text-gray-300 font-semibold block text-[11px]">فترة التمديد:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: '1_MONTH', label: '+ شهر' },
                        { id: 'FULL_TERM', label: '+ ترم' },
                        { id: 'FULL_YEAR', label: '+ سنة' },
                        { id: 'CUSTOM', label: 'تاريخ مخصص' }
                      ].map(item => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setEditDurationPreset(item.id as any)}
                          className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition ${
                            editDurationPreset === item.id
                              ? 'bg-cyan-500 text-gray-950 shadow-md'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {editDurationPreset === 'CUSTOM' && (
                      <div className="pt-2">
                        <label className="text-gray-400 text-[10px] block mb-1">حدد تاريخ الانتهاء الجديد:</label>
                        <input
                          type="date"
                          value={editCustomDate}
                          onChange={e => setEditCustomDate(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* تعديل الصفوف */}
              <div>
                <label className="text-gray-300 font-semibold block mb-1.5">الصفوف الدراسية المصرحة:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(academicGrades || mockAcademicGrades).map(g => {
                    const isChecked = editGrades.includes(g.id as AcademicGradeId);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => {
                          if (isChecked) {
                            if (editGrades.length > 1) {
                              setEditGrades(editGrades.filter(x => x !== g.id));
                            }
                          } else {
                            setEditGrades([...editGrades, g.id as AcademicGradeId]);
                          }
                        }}
                        className={`p-2 rounded-xl border text-center transition font-bold ${
                          isChecked
                            ? 'bg-cyan-500/20 border-cyan-400 text-white'
                            : 'bg-gray-900 border-gray-800 text-gray-400'
                        }`}
                      >
                        {g.nameAr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* رقم الواتساب المعتمد لتجديد الاشتراكات */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>خط واتساب التجديد المعتمد للمنصة:</span>
                  <strong className="font-mono text-white text-xs">01090138676</strong>
                </div>
                <a
                  href={`https://wa.me/201090138676?text=${encodeURIComponent(`تجديد اشتراك المعلم: ${selectedInstructorForEdit.name} (${selectedInstructorForEdit.email})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>فتح محادثة واتساب</span>
                </a>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-bold hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  حفظ وتطبيق التمديد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
