'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import {
  GraduationCap,
  Sparkles,
  Ticket,
  Clock,
  Play,
  ArrowRight,
  UserCheck,
  Star,
  CheckCircle2,
  Lock,
  Layers,
  FileText
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
    c => c.subjectId === currentSubject.id || c.subjectName.includes(currentSubject.nameEn)
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
    <div className="space-y-8 font-sans">
      {/* Grade-Locked Student Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-3 font-mono">
              <GraduationCap className="w-4 h-4" />
              <span>{activeGradeDetails.nameAr} &bull; {activeGradeDetails.nameEn}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              أهلاً بك، {currentUser.name}! 🌟
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
              تم تخصيص المنصة والمناهج تلقائياً لمرحلتك الدراسية. اختر المادة والمدرس واستمتع بتجربة دراسية متكاملة مع مذكرات YA7EDU الحصرية.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-gray-900/80 border border-amber-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-tight">{activeSubs.length} اشتراكات</div>
                <div className="text-[11px] text-gray-400">مدرسين مفعلين</div>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-gray-900/80 border border-cyan-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-tight">{gradeSubjects.length} مواد</div>
                <div className="text-[11px] text-gray-400">متاحة لمرحلتك</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action: Redeem Scratch Card Voucher Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-amber-950/30 border border-amber-500/30 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              كارت شحن المنصة الورقي المعتمد
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              هل تمتلك كود كارت من السنتر أو المكتبة؟
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              اشحن كارت المحاضرات أو كارت الشهر الآن لفتح المحتوى فوراً بضغطة زر.
            </p>
          </div>
        </div>

        <button
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
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition shrink-0 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>شحن كود الكارت الآن</span>
        </button>
      </div>

      {/* Active Teacher Subscriptions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">اشتراكاتك النشطة مع المدرسين ({activeSubs.length})</h2>
          </div>
          <Link
            href="/student/subscriptions"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>عرض الكل</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeSubs.map(sub => {
            const expDate = new Date(sub.expiresAt);
            const daysRemaining = Math.max(0, Math.ceil((expDate.getTime() - Date.now()) / (1000 * 3600 * 24)));

            return (
              <div
                key={sub.id}
                className="rounded-3xl glass-card border border-emerald-500/30 hover:border-emerald-500/60 p-5 flex flex-col justify-between transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      اشتراك نشط
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>متبقي {daysRemaining} يوم</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={sub.instructorAvatar}
                      alt={sub.instructorName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                        {sub.instructorName}
                      </h3>
                      <p className="text-xs text-cyan-400 font-semibold">{sub.subjectName}</p>
                    </div>
                  </div>

                  <div className="mt-3 p-2 rounded-xl bg-gray-900/60 text-xs text-gray-300 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">نوع الباقة:</span>
                    <span className="font-semibold text-white">{sub.durationLabel}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-800">
                  <Link
                    href={`/student/player?instructorId=${sub.instructorId}&subjectId=${sub.subjectId}`}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>دخول منصة المحاضرات والمذكرات</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade-Locked Subject Catalog & Instructor Selection Flow */}
      <div className="space-y-6 pt-4 border-t border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>كتالوج المواد المخصصة لـ {activeGradeDetails.nameAr}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            اختر المادة واستكشف أفضل المدرسين المعتمدين
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            اختر المادة لعرض كبار المعلمين، وتصفح المحتوى والاشتراك المباشر بكارت الشحن أو الدفع الإلكتروني.
          </p>
        </div>

        {/* Step 1: Subjects Horizontal Grid for Current Grade */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gradeSubjects.map(subj => {
            const isSelected = selectedSubjectId === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-600/30 to-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-102 font-bold'
                    : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: subj.color + '33' }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: subj.color }} />
                </div>
                <div className="text-xs font-bold leading-tight">{subj.nameAr}</div>
                <div className="text-[10px] text-gray-400">{subj.nameEn}</div>
              </button>
            );
          })}
        </div>

        {/* Step 2: Available Instructors for Selected Subject */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>مدرسو {currentSubject.nameAr} المتاحون</span>
            </h3>
            <span className="text-xs text-gray-400">{instructorsForSubject.length} مدرسين معتمدين</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorsForSubject.map(instructor => {
              const subscribed = isSubscribedToInstructor(instructor.instructorId, currentSubject.id);

              return (
                <div
                  key={instructor.id}
                  className="rounded-3xl glass-card border border-gray-800 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-300 group shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{instructor.rating}</span>
                        <span className="text-gray-500 font-normal">({instructor.totalSubscribers} طالب)</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {instructor.term}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <img
                        src={instructor.instructorAvatar}
                        alt={instructor.instructorName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-700 group-hover:ring-cyan-500/50 transition"
                      />
                      <div>
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                          {instructor.instructorName}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-1">{instructor.instructorTitle}</p>
                      </div>
                    </div>

                    {/* Free Preview Guarantee Tag */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold my-3">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>معاينة مجانية: متاح أول فيديوهين شرح كاملين مجاناً</span>
                    </div>

                    {/* Content highlights (4-tab previews) */}
                    <div className="grid grid-cols-2 gap-2 my-2 p-3 rounded-2xl bg-gray-900/60 border border-gray-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">الأبواب والفصول</span>
                        <span className="font-bold text-white">{instructor.chapters.length} أبواب دراسية</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">المذكرات والمراجعات</span>
                        <span className="font-bold text-white">
                          {instructor.booklets.length + instructor.revisions.length} كراسات PDF
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    {subscribed ? (
                      <Link
                        href={`/student/player?instructorId=${instructor.instructorId}&subjectId=${currentSubject.id}`}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>أنت مشترك بالفعل &bull; افتح المحاضرات</span>
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block">سعر الاشتراك</span>
                            <span className="text-base font-mono font-extrabold text-white">
                              {instructor.priceMonthly} ج.م <span className="text-xs font-normal text-gray-400">/شهر</span>
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Play className="w-3 h-3 fill-emerald-400" />
                            <span>2 فيديو شرح مجاناً</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/student/player?instructorId=${instructor.instructorId}&subjectId=${currentSubject.id}`}
                            className="py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm hover:border-cyan-400"
                          >
                            <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                            <span>معاينة فيديوهين</span>
                          </Link>

                          <button
                            onClick={() => handleOpenSubscribe(instructor)}
                            className="py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
                          >
                            <Ticket className="w-3.5 h-3.5 text-amber-300" />
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
