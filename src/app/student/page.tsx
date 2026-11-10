'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import {
  GraduationCap,
  Sparkles,
  Ticket,
  Clock,
  Play,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Star,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
  BookOpen,
  Award
} from 'lucide-react';
import { SubscriptionModal } from '@/components/subscription/subscription-modal';

export default function StudentDashboardPage() {
  const {
    currentUser,
    activeGradeDetails,
    gradeSubjects,
    subscriptions,
    instructorContents,
    isSubscribedToInstructor
  } = useLMS();

  // Selected subject in discovery flow
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(gradeSubjects[0]?.id || 'subj_g3_phys');
  const [mountedTime, setMountedTime] = useState<number | null>(null);

  useEffect(() => {
    setMountedTime(Date.now());
  }, []);
  
  // Subscription modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInstructorForSub, setSelectedInstructorForSub] = useState<{
    instructorId: string;
    instructorName: string;
    instructorAvatar: string;
    subjectId: string;
    subjectName: string;
  } | null>(null);

  // Active student subscriptions
  const activeSubs = subscriptions.filter(s => s.studentId === currentUser.id && s.status === 'ACTIVE');

  // Available instructors teaching the selected subject
  const currentSubject = gradeSubjects.find(s => s.id === selectedSubjectId) || gradeSubjects[0];
  const instructorsForSubject = instructorContents.filter(
    c => c.subjectId === currentSubject?.id || c.subjectName?.includes(currentSubject?.nameEn || '')
  );

  const handleOpenSubscribe = (instructor: typeof instructorContents[0]) => {
    setSelectedInstructorForSub({
      instructorId: instructor.instructorId,
      instructorName: instructor.instructorName,
      instructorAvatar: instructor.instructorAvatar,
      subjectId: currentSubject.id,
      subjectName: currentSubject.nameAr + ' (' + currentSubject.nameEn + ')'
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 font-sans pb-12 text-right" dir="rtl">
      {/* Grade-Locked Student Header Banner (White & Blue) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold font-mono">
              <GraduationCap className="w-4 h-4 text-blue-200" />
              <span>{activeGradeDetails.nameAr} &bull; {activeGradeDetails.nameEn}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              أهلاً بك، {currentUser.name}! 🌟
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              تم تخصيص المنصة والمناهج لمرحلتك الدراسية. اختر المادة والمدرس واستمتع بتجربة دراسية متكاملة مع مذكرات YA7EDU الحصرية وحصص المعاينة المجانية.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-5 py-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-200 flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black font-mono text-white leading-tight">{activeSubs.length}</div>
                <div className="text-[11px] text-blue-100 font-medium">مدرسين مفعلين</div>
              </div>
            </div>

            <div className="px-5 py-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-sky-400/20 text-sky-200 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black font-mono text-white leading-tight">{gradeSubjects.length}</div>
                <div className="text-[11px] text-blue-100 font-medium">مواد متاحة لمرحلتك</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action: Redeem Scratch Card Voucher Banner */}
      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 ring-2 ring-amber-200">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>كارت شحن المنصة الورقي المعتمد</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.2 rounded-full font-mono font-bold">PIN</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              هل تمتلك كود كارت من السنتر أو المكتبة؟
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              اشحن كارت المحاضرات أو كارت الشهر الآن لفتح المحتوى فوراً بضغطة زر.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedInstructorForSub({
              instructorId: 'inst_ahmed_samy',
              instructorName: 'الأستاذ أحمد سامي',
              instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              subjectId: 'subj_g3_phys',
              subjectName: 'الفيزياء'
            });
            setModalOpen(true);
          }}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition shrink-0 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>شحن كود الكارت الآن</span>
        </button>
      </div>

      {/* Active Teacher Subscriptions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">اشتراكاتك النشطة مع المدرسين ({activeSubs.length})</h2>
          </div>
          <Link
            href="/student/subscriptions"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>عرض تفاصيل الاشتراكات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeSubs.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white text-center border border-slate-200 shadow-2xs space-y-3">
            <Ticket className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">لا توجد اشتراكات نشطة حالياً</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              تصفح مواد مرحلتك الدراسية بالأسفل واختر معلمك المفضل للاشتراك أو تجربة المعاينة المجانية.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeSubs.map(sub => {
              const expDate = new Date(sub.expiresAt);
              const daysRemaining = mountedTime
                ? Math.max(0, Math.ceil((expDate.getTime() - mountedTime) / (1000 * 3600 * 24)))
                : 30;

              return (
                <div
                  key={sub.id}
                  className="rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 p-5 flex flex-col justify-between transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        اشتراك نشط ومفعل
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>متبقي {daysRemaining} يوم</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <img
                        src={sub.instructorAvatar}
                        alt={sub.instructorName}
                        className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-200"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {sub.instructorName}
                        </h3>
                        <p className="text-xs text-blue-600 font-semibold">{sub.subjectName}</p>
                      </div>
                    </div>

                    <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">نوع الباقة:</span>
                      <span className="font-semibold text-slate-900">{sub.durationLabel}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100">
                    <Link
                      href={`/student/player?instructorId=${sub.instructorId}&subjectId=${sub.subjectId}`}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition hover:scale-[1.02]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>دخول منصة المحاضرات والمذكرات</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grade-Locked Subject Catalog & Instructor Selection Flow */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>كتالوج المواد المعتمدة لـ {activeGradeDetails.nameAr}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            اختر المادة واستكشف أفضل المدرسين المعتمدين
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            اختر المادة لعرض كبار المعلمين، تصفح المحتوى، والاستفادة من حصص المعاينة المجانية.
          </p>
        </div>

        {/* Subjects Horizontal Grid for Current Grade */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gradeSubjects.map(subj => {
            const isSelected = selectedSubjectId === subj.id;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-102 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-5 h-5" style={{ color: isSelected ? '#ffffff' : subj.color }} />
                </div>
                <div className="text-xs font-bold leading-tight">{subj.nameAr}</div>
                <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{subj.nameEn}</div>
              </button>
            );
          })}
        </div>

        {/* Available Instructors for Selected Subject */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>مدرسو {currentSubject?.nameAr} المتاحون</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">{instructorsForSubject.length} معلم معتمد</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorsForSubject.map(instructor => {
              const subscribed = isSubscribedToInstructor(instructor.instructorId, currentSubject.id);

              return (
                <div
                  key={instructor.id}
                  className="rounded-3xl bg-white border border-slate-200 hover:border-blue-400 p-6 flex flex-col justify-between transition-all duration-300 group shadow-xs hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{instructor.rating}</span>
                        <span className="text-slate-400 font-normal">({instructor.totalSubscribers} طالب)</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {instructor.term}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <img
                        src={instructor.instructorAvatar}
                        alt={instructor.instructorName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-400 transition"
                      />
                      <div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {instructor.instructorName}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{instructor.instructorTitle}</p>
                      </div>
                    </div>

                    {/* Free Preview Guarantee Tag */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold my-3">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>معاينة مجانية: متاح أول فيديوهين شرح كاملين مجاناً</span>
                    </div>

                    {/* Content highlights */}
                    <div className="grid grid-cols-2 gap-2 my-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">الأبواب والفصول</span>
                        <span className="font-bold text-slate-900">{instructor.chapters.length} أبواب دراسية</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">المذكرات والمراجعات</span>
                        <span className="font-bold text-slate-900">
                          {instructor.booklets.length + instructor.revisions.length} كراسات PDF
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    {subscribed ? (
                      <Link
                        href={`/student/player?instructorId=${instructor.instructorId}&subjectId=${currentSubject.id}`}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>أنت مشترك بالفعل &bull; افتح المحاضرات</span>
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 block">سعر الاشتراك</span>
                            <span className="text-base font-mono font-extrabold text-blue-600">
                              {instructor.priceMonthly} ج.م <span className="text-xs font-normal text-slate-500">/شهر</span>
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Play className="w-3 h-3 fill-emerald-600" />
                            <span>2 فيديو مجاناً</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/student/player?instructorId=${instructor.instructorId}&subjectId=${currentSubject.id}`}
                            className="py-2.5 rounded-xl bg-white hover:bg-blue-50 border border-blue-300 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                            <span>معاينة فيديوهين</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenSubscribe(instructor)}
                            className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition hover:scale-105 active:scale-95"
                          >
                            <Ticket className="w-3.5 h-3.5 text-white" />
                            <span>اشتراك / كارت</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscription & Voucher Modal */}
      {modalOpen && selectedInstructorForSub && (
        <SubscriptionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          instructorId={selectedInstructorForSub.instructorId}
          instructorName={selectedInstructorForSub.instructorName}
          instructorAvatar={selectedInstructorForSub.instructorAvatar}
          subjectId={selectedInstructorForSub.subjectId}
          subjectName={selectedInstructorForSub.subjectName}
        />
      )}
    </div>
  );
}
