'use client';

import React, { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  Award,
  Sparkles,
  Maximize2,
  Minimize2,
  Lock,
  Ticket,
  BookOpen,
  Calendar,
  Layers,
  Star,
  Info,
  Unlock,
  FileCheck2,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SubscriptionModal } from '@/components/subscription/subscription-modal';
import { ExamRunnerModal } from '@/components/exam/exam-runner-modal';
import { PracticeRunnerModal } from '@/components/booklet/practice-runner-modal';
import { SecureLmsPlayer } from '@/components/player/secure-lms-player';
import { InstructorExam, BookletItem } from '@/lib/types';
import confetti from 'canvas-confetti';

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&modestbranding=1&rel=0`
    : null;
}

function PlayerContent() {
  const searchParams = useSearchParams();
  const instructorId = searchParams.get('instructorId') || 'inst_ahmed_samy';
  const subjectId = searchParams.get('subjectId') || 'subj_g3_phys';

  const {
    currentUser,
    getInstructorContent,
    isSubscribedToInstructor,
    getSubscription,
    toggleLessonProgress,
    instructorExams,
    studentExamAttempts
  } = useLMS();

  const content = getInstructorContent(instructorId, subjectId) || getInstructorContent('inst_ahmed_samy', 'subj_g3_phys')!;
  const isSubscribed = isSubscribedToInstructor(content.instructorId, content.subjectId);
  const activeSub = getSubscription(content.instructorId, content.subjectId);

  // Instructor's exams
  const teacherExams = instructorExams.filter(e => e.instructorId === content.instructorId);
  const [selectedExamForRunner, setSelectedExamForRunner] = useState<InstructorExam | null>(null);

  // Active Lesson
  const allLessons = content.chapters.flatMap(c => c.lessons);
  const freeLessons = allLessons.filter(l => l.isFree);
  const defaultLesson = allLessons.find(l => l.isFree) || allLessons[0];
  const [activeLessonId, setActiveLessonId] = useState<string>(defaultLesson?.id || '');
  const activeLesson = allLessons.find(l => l.id === activeLessonId) || defaultLesson;
  const activeChapter = content.chapters.find(c => c.lessons.some(l => l.id === activeLesson?.id)) || content.chapters[0];
  const activeFreeIndex = freeLessons.findIndex(l => l.id === activeLesson?.id);

  // 5 Dedicated Content Tabs
  const [activeTab, setActiveTab] = useState<'chapters' | 'booklets' | 'revisions' | 'ya7edu' | 'exams'>('chapters');

  // Video state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [selectedPracticeBooklet, setSelectedPracticeBooklet] = useState<BookletItem | null>(null);
  const [activeRevisionVideo, setActiveRevisionVideo] = useState<{ titleAr: string; videoUrl: string; isFree?: boolean } | null>(null);

  // Check if current active lesson can be played
  const canPlayActiveLesson = activeRevisionVideo
    ? (isSubscribed || activeRevisionVideo.isFree)
    : (isSubscribed || activeLesson?.isFree);

  const toggleChapter = (chapId: string) => {
    setCollapsedChapters(prev => ({ ...prev, [chapId]: !prev[chapId] }));
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
  };

  const handleToggleComplete = () => {
    if (!activeLesson) return;
    toggleLessonProgress(content.id, activeLesson.id);
    if (!activeLesson.isCompleted) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleLessonClick = (lesson: typeof allLessons[0]) => {
    if (isSubscribed || lesson.isFree) {
      setActiveLessonId(lesson.id);
    } else {
      setSubModalOpen(true);
    }
  };

  const handleDownloadMaterial = (title: string, isFree?: boolean, downloadUrl?: string) => {
    if (isSubscribed || isFree) {
      if (downloadUrl && downloadUrl !== '#' && downloadUrl.length > 5) {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${title}.pdf`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert(`جاري تجهيز وتحميل ملف الـ PDF: ${title}`);
      }
    } else {
      setSubModalOpen(true);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-5rem)] flex flex-col font-sans -m-4 sm:-m-6 lg:-m-8 bg-slate-50 ${isTheaterMode ? 'fixed inset-0 z-50 bg-slate-900 p-4 overflow-y-auto' : ''}`}>
      {/* Top Banner when viewing in Free Preview Mode */}
      {!isSubscribed && (
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
            <span>
              <strong>وضع المعاينة المجانية (متاح حصتين شرح كاملتين):</strong> متاح لك مشاهدة حصتين كاملتين مجاناً لـ {content.instructorName} في {content.subjectName} لمعاينة جودة المحتوى وأسلوب الشرح قبل الاشتراك.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSubModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-black text-xs flex items-center justify-center gap-1.5 transition shrink-0 shadow-sm"
          >
            <Ticket className="w-3.5 h-3.5 text-blue-600" />
            <span>اشترك الآن أو اشحن كارت</span>
          </button>
        </div>
      )}

      {/* Top Player Action Bar */}
      <div className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition px-2.5 py-1.5 rounded-xl hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4 text-blue-600" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="h-5 w-px bg-slate-200" />

          <div className="flex items-center gap-3">
            <img
              src={content.instructorAvatar}
              alt={content.instructorName}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/30"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                {content.instructorName} &bull; {content.subjectName}
              </span>
              <span className="text-[11px] text-slate-500 block -mt-0.5">
                {activeChapter?.titleAr} &bull; {activeLesson?.titleAr}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>اشتراك مفعل ({activeSub?.durationLabel.split('(')[0]})</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSubModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition hover:scale-105"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>شحن كارت / اشتراك</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title={isTheaterMode ? 'خروج من وضع السينما' : 'وضع السينما'}
          >
            {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Player on top, Curriculum & Materials below */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Video Screen Area */}
        <div className="bg-slate-950 relative aspect-video max-h-[60vh] w-full flex items-center justify-center">
          {/* Notification bar if playing a special revision video */}
          {activeRevisionVideo && (
            <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-blue-500/50 backdrop-blur-md text-xs shadow-lg">
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>جاري تشغيل فيديو مراجعة: {activeRevisionVideo.titleAr}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveRevisionVideo(null)}
                className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 hover:text-white text-[11px] font-bold"
              >
                العودة لمحاضرات المنهج
              </button>
            </div>
          )}

          {canPlayActiveLesson ? (
            (activeRevisionVideo?.videoUrl || activeLesson?.videoUrl) ? (
              <SecureLmsPlayer
                videoUrl={activeRevisionVideo?.videoUrl || activeLesson?.videoUrl || ''}
                title={activeRevisionVideo?.titleAr || activeLesson?.titleAr || 'محاضرة تعليمية'}
                studentName={currentUser?.name || 'طالب الأكاديمية'}
                studentPhone={currentUser?.phone || '01030370718'}
                studentId={currentUser?.id}
                isTheater={isTheaterMode}
                onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
                className="w-full h-full"
              />
            ) : (
              <div className="text-center p-8 text-slate-400 text-xs">لا يوجد فيديو محدد لهذه المحاضرة.</div>
            )
          ) : (
            /* Locked Video State */
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 ring-2 ring-blue-500/40">
                <Lock className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-mono font-bold px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-1">
                محتوى مقفل للمشتركين فقط
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{activeLesson?.titleAr}</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-1 mb-5">
                انتهت حصص المعاينة المجانية (متاح حصتان شرح مجاناً لكل مدرس). لمتابعة باقي دروس ووحدات المنهج مع {content.instructorName}، يرجى الاشتراك أو شحن كارت المنصة.
              </p>
              <button
                type="button"
                onClick={() => setSubModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl shadow-blue-500/30 flex items-center gap-2 transition hover:scale-105"
              >
                <Ticket className="w-4 h-4" />
                <span>اشترك الآن أو اشحن كود الكارت</span>
              </button>
            </div>
          )}

          {/* Video Control Bar when playable */}
          {canPlayActiveLesson && (
            <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">سرعة التشغيل:</span>
                {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2 py-0.5 rounded-md font-mono font-medium transition ${
                      playbackSpeed === speed ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {activeLesson?.isFree && !isSubscribed && (
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span>معاينة مجانية (فيديو {activeFreeIndex >= 0 ? activeFreeIndex + 1 : 1} من {freeLessons.length || 2})</span>
                </span>
              )}

              <button
                type="button"
                onClick={handleToggleComplete}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold transition ${
                  activeLesson?.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {activeLesson?.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم إنهاء المحاضرة</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    <span>تحديد كمكتمل</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 5 DISTINCT TABS BELOW VIDEO */}
        <div className="border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center gap-4 sm:gap-8 overflow-x-auto shadow-sm">
          {/* Tab 1: Curriculum Videos */}
          <button
            type="button"
            onClick={() => setActiveTab('chapters')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'chapters'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Play className="w-4 h-4 text-blue-600" />
            <span>الأبواب والفصول ({content.chapters.length})</span>
          </button>

          {/* Tab 2: Booklets */}
          <button
            type="button"
            onClick={() => setActiveTab('booklets')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'booklets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>قسم المذكرات والواجبات ({content.booklets.length})</span>
          </button>

          {/* Tab 3: Revisions */}
          <button
            type="button"
            onClick={() => setActiveTab('revisions')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'revisions'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>قسم المراجعات وليالي الامتحان ({content.revisions.length})</span>
          </button>

          {/* Tab 4: YA7EDU Booklets */}
          <button
            type="button"
            onClick={() => setActiveTab('ya7edu')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'ya7edu'
                ? 'border-amber-600 text-amber-600 font-extrabold'
                : 'border-transparent text-amber-700/80 hover:text-amber-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>مذكرات YA7EDU الحصرية ({content.ya7eduBooklets.length})</span>
          </button>

          {/* Tab 5: Exams & Quizzes */}
          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'exams'
                ? 'border-rose-600 text-rose-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-rose-600" />
            <span>الامتحانات والاختبارات ({teacherExams.length})</span>
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="p-6 sm:p-8 flex-1 bg-slate-50">
          {/* TAB 1: CURRICULUM VIDEOS */}
          {activeTab === 'chapters' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">الخطة الدراسية وأبواب المنهج</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  مرتبة حسب الوحدات الرسمية المعتمدة لـ {content.subjectName}. المحاضرات المفتوحة بدون قفل متاحة للمعاينة المجانية.
                </p>
              </div>

              {/* Free Preview Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">حق المعاينة المجانية مكفول لجميع الطلاب</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      أي مدرس لست مشتركاً معه، يمنحك النظام <strong>فيديوهين شرح كاملين مجاناً</strong> للمعاينة قبل الاشتراك.
                    </p>
                  </div>
                </div>
                {!isSubscribed && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[11px] shrink-0 self-start sm:self-auto">
                    متاح 2 فيديو شرح مجاناً
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {content.chapters.map(chap => {
                  const isCollapsed = collapsedChapters[chap.id] || false;
                  const completedLessons = chap.lessons.filter(l => l.isCompleted).length;

                  return (
                    <div key={chap.id} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                      <button
                        type="button"
                        onClick={() => toggleChapter(chap.id)}
                        className="w-full p-4 flex items-center justify-between text-right hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {chap.chapterNumber}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{chap.titleAr}</h4>
                            <span className="text-[11px] text-slate-500">
                              {chap.titleEn} &bull; {completedLessons}/{chap.lessons.length} محاضرات مكتملة
                            </span>
                          </div>
                        </div>

                        {isCollapsed ? (
                          <ChevronLeft className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {!isCollapsed && (
                        <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/50">
                          {chap.lessons.map(les => {
                            const isCurrent = activeLessonId === les.id;
                            const isLocked = !isSubscribed && !les.isFree;
                            const freeIndex = freeLessons.findIndex(l => l.id === les.id);

                            return (
                              <div
                                key={les.id}
                                onClick={() => handleLessonClick(les)}
                                className={`p-4 flex items-center justify-between cursor-pointer transition ${
                                  isCurrent
                                    ? 'bg-blue-50 border-r-4 border-blue-600'
                                    : 'hover:bg-slate-100/60'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {isLocked ? (
                                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                      <Lock className="w-3.5 h-3.5" />
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        toggleLessonProgress(content.id, les.id);
                                      }}
                                      className="text-slate-400 hover:text-emerald-600 shrink-0"
                                    >
                                      {les.isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-slate-400" />
                                      )}
                                    </button>
                                  )}

                                  <div>
                                    <div className={`text-xs font-semibold ${isCurrent ? 'text-blue-900' : 'text-slate-800'}`}>
                                      {les.titleAr}
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                      <span>{les.durationMinutes} دقيقة</span>
                                      {les.isFree && !isSubscribed && (
                                        <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                                          <Unlock className="w-2.5 h-2.5" />
                                          <span>معاينة مجانية (فيديو {freeIndex >= 0 ? freeIndex + 1 : 1} من 2)</span>
                                        </span>
                                      )}
                                      {isLocked && (
                                        <span className="text-amber-700 font-mono text-[9px] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                                          <Lock className="w-2.5 h-2.5" />
                                          <span>يتطلب اشتراك</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  {isCurrent && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                                      جاري المشاهدة
                                    </span>
                                  )}
                                  {isLocked && (
                                    <span className="text-xs text-amber-600 hover:underline font-bold">
                                      اشترك الآن
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BOOKLETS & HANDOUTS */}
          {activeTab === 'booklets' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">كراسات ومذكرات الشرح والواجبات</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ملفات PDF مخصصة للطباعة والمذاكرة، تشمل ملخصات القوانين والتدريبات الفورية.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.booklets.map(bkt => {
                  const isLocked = !isSubscribed && !bkt.isFree;
                  const isPractice = bkt.format === 'INTERACTIVE_PRACTICE' || Boolean(bkt.questions && bkt.questions.length > 0);

                  return (
                    <div
                      key={bkt.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 pl-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isPractice ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-amber-500" />
                          ) : isPractice ? (
                            <Sparkles className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{bkt.titleAr}</h4>
                          <p className="text-[11px] text-slate-500">{bkt.titleEn}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-blue-600 font-mono">
                              {isPractice ? `${bkt.questions?.length || 3} مسائل تدريبية` : `${bkt.pageCount} صفحة`} &bull; {bkt.fileSize}
                            </span>
                            {isPractice && (
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                تدريب تفاعلي 💡
                              </span>
                            )}
                            {bkt.isFree && !isSubscribed && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                عينة مجانية
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isPractice ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (isLocked) {
                              setSubModalOpen(true);
                            } else {
                              setSelectedPracticeBooklet(bkt);
                            }
                          }}
                          className={`px-3.5 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-sm ${
                            isLocked
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>فتح التدريب</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                              <span>حل التدريب مع التفسير الفوري 💡</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDownloadMaterial(bkt.titleAr, bkt.isFree, bkt.downloadUrl)}
                          className={`p-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-semibold ${
                            isLocked
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white'
                          }`}
                          title={isLocked ? 'يتطلب اشتراك للتحميل' : 'تحميل PDF'}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>فتح المذكرة</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>تحميل</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: REVISIONS */}
          {activeTab === 'revisions' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">المراجعات الدورية ومذكرات ليلة الامتحان</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  مراجعات مكثفة، ونماذج امتحانات الثانوية العامة السابقة مع الإجابات النموذجية وفيديوهات الشرح.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.revisions.map(rev => {
                  const isLocked = !isSubscribed && !rev.isFree;
                  const isVideoRev = rev.format === 'VIDEO' || Boolean(rev.videoUrl);

                  return (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 pl-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isVideoRev ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-amber-500" />
                          ) : isVideoRev ? (
                            <Play className="w-5 h-5 fill-rose-600 text-rose-600" />
                          ) : (
                            <Calendar className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{rev.titleAr}</h4>
                          <p className="text-[11px] text-slate-500">{rev.titleEn}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-emerald-700 font-mono">
                              {isVideoRev ? `${rev.durationMinutes || 45} دقيقة &bull; فيديو شرح` : `${rev.pageCount} صفحة &bull; ${rev.fileSize}`}
                            </span>
                            {isVideoRev && (
                              <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                🎬 فيديو مراجعة
                              </span>
                            )}
                            {rev.isFree && !isSubscribed && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                عينة مجانية
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isVideoRev ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (isLocked) {
                              setSubModalOpen(true);
                            } else {
                              setActiveRevisionVideo({
                                titleAr: rev.titleAr,
                                videoUrl: rev.videoUrl || '',
                                isFree: rev.isFree
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className={`px-3.5 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-sm ${
                            isLocked
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>فتح الفيديو</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>مشاهدة فيديو المراجعة 🎬</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDownloadMaterial(rev.titleAr, rev.isFree, rev.downloadUrl)}
                          className={`p-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-semibold ${
                            isLocked
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>فتح المراجعة</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>تحميل</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: YA7EDU EXCLUSIVE BOOKLETS */}
          {activeTab === 'ya7edu' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-blue-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span>مذكرات YA7EDU الحصرية لطلاب الأوائل</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    إصدارات رسمية خاصة لا تتوفر إلا لمشتركي منصة YA7EDU، تشمل كبسولات القوانين ونقاط التريكات الوزارية.
                  </p>
                </div>
                {!isSubscribed && (
                  <button
                    type="button"
                    onClick={() => setSubModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition shadow-sm"
                  >
                    اشترك لفتح المذكرات الحصرية
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.ya7eduBooklets.map(ya7 => {
                  const isLocked = !isSubscribed && !ya7.isFree;

                  return (
                    <div
                      key={ya7.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 pl-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          {isLocked ? <Lock className="w-5 h-5 text-amber-500" /> : <Sparkles className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ya7.titleAr}</h4>
                          <p className="text-[11px] text-slate-500">{ya7.titleEn}</p>
                          <span className="text-[10px] text-blue-600 font-mono mt-0.5 block">
                            {ya7.pageCount} صفحة &bull; {ya7.fileSize}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadMaterial(ya7.titleAr, ya7.isFree, ya7.downloadUrl)}
                        className={`p-2.5 rounded-xl font-bold text-xs transition shrink-0 flex items-center gap-1.5 ${
                          isLocked
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>فتح المذكرة</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>تحميل</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: EXAMS & QUIZZES */}
          {activeTab === 'exams' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">الامتحانات والاختبارات الدورية</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  امتحانات معتمدة من مستر {content.instructorName}. تطبق المنصة قاعدة حجب النتيجة حتى انتهاء وقت الامتحان لمنع تسريب الأسئلة.
                </p>
              </div>

              {/* Embargo rule card */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900">قاعدة حجب النتيجة حتى انتهاء تاريخ ووقت الامتحان (Exam Embargo)</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    تظل درجتك ونموذج الحل النموذجي محجوبة بالكامل حتى انقضاء تاريخ وساعة نهاية الامتحان رسمياً لجميع الطلاب، حفاظاً على تكافؤ الفرص ومنع تسريب الأسئلة.
                  </p>
                </div>
              </div>

              {teacherExams.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs rounded-2xl bg-white border border-slate-200">
                  لا توجد امتحانات منشورة حالياً لهذا المعلم.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacherExams.map(ex => {
                    const studentAttempt = studentExamAttempts.find(
                      a => a.examId === ex.id && a.studentId === currentUser.id
                    );
                    const isSubmitted = Boolean(studentAttempt?.submittedAt);
                    const isUnlocked = Boolean(studentAttempt?.isUnlocked);
                    const isEmbargoed = isSubmitted && !isUnlocked;

                    return (
                      <div
                        key={ex.id}
                        className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md flex flex-col justify-between transition-all duration-300 shadow-sm group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                              {ex.subjectName}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-600 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{ex.durationMinutes} دقيقة</span>
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                              {ex.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                              {ex.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                            <div>الأسئلة: <strong className="text-slate-900">{ex.questions.length}</strong></div>
                            <div>الدرجة الكلية: <strong className="text-slate-900">{ex.totalMarks}</strong></div>
                          </div>

                          {(ex.startDate || ex.endDate) && (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono space-y-1">
                              <div className="flex items-center justify-between text-slate-500">
                                <span>يبدأ الامتحان:</span>
                                <span className="text-slate-800">{ex.startDate} ({ex.startTime || '00:00'})</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-500">
                                <span className="text-amber-700">ينتهي الامتحان:</span>
                                <span className="text-amber-700 font-bold">{ex.endDate} ({ex.endTime || '23:59'})</span>
                              </div>
                            </div>
                          )}

                          {isEmbargoed && (
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 space-y-1">
                              <div className="flex items-center gap-1.5 font-bold">
                                <Lock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                <span>تم التسليم • النتيجة محجوبة</span>
                              </div>
                              <div className="text-[10px] text-slate-600 leading-tight">
                                ستظهر النتيجة ونموذج الإجابة تلقائياً بعد انتهاء موعد الامتحان في: {ex.endDate} ({ex.endTime || '23:59'})
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4">
                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => setSelectedExamForRunner(ex)}
                              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                            >
                              <Award className="w-4 h-4" />
                              <span>النتيجة والحل النموذجي ({studentAttempt?.scorePercent}%)</span>
                            </button>
                          ) : isEmbargoed ? (
                            <button
                              type="button"
                              onClick={() => setSelectedExamForRunner(ex)}
                              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm animate-pulse transition"
                            >
                              <Clock className="w-4 h-4" />
                              <span>متابعة عداد فك الحجب (محجوب) ⏱️</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedExamForRunner(ex)}
                              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>بدء الامتحان الآن ({ex.durationMinutes} دقيقة)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Practice Runner Modal for Interactive booklets */}
      {selectedPracticeBooklet && (
        <PracticeRunnerModal
          booklet={selectedPracticeBooklet}
          isOpen={!!selectedPracticeBooklet}
          onClose={() => setSelectedPracticeBooklet(null)}
        />
      )}

      {/* Exam Runner Modal */}
      {selectedExamForRunner && (
        <ExamRunnerModal
          exam={selectedExamForRunner}
          isOpen={!!selectedExamForRunner}
          onClose={() => setSelectedExamForRunner(null)}
        />
      )}

      {/* Subscription Modal Trigger */}
      {subModalOpen && (
        <SubscriptionModal
          isOpen={subModalOpen}
          onClose={() => setSubModalOpen(false)}
          instructorId={content.instructorId}
          instructorName={content.instructorName}
          instructorAvatar={content.instructorAvatar}
          subjectId={content.subjectId}
          subjectName={content.subjectName}
        />
      )}
    </div>
  );
}

export default function StudentPlayerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">جاري تحميل منصة المحاضرات...</div>}>
      <PlayerContent />
    </Suspense>
  );
}
