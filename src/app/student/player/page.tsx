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
  Clock
} from 'lucide-react';
import { SubscriptionModal } from '@/components/subscription/subscription-modal';
import { ExamRunnerModal } from '@/components/exam/exam-runner-modal';
import { PracticeRunnerModal } from '@/components/booklet/practice-runner-modal';
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
  // Default to first free lesson or first lesson
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
      // Prompt subscription when clicking locked lesson
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
    <div className={`min-h-[calc(100vh-5rem)] flex flex-col font-sans -m-4 sm:-m-6 lg:-m-8 ${isTheaterMode ? 'fixed inset-0 z-50 bg-[#0b0f19] p-4 overflow-y-auto' : ''}`}>
      {/* Top Banner when viewing in Free Preview Mode */}
      {!isSubscribed && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
            <span>
              <strong>وضع المعاينة المجانية (فيديوهين شرح كاملين مجاناً):</strong> متاح لك مشاهدة حصتين شرح كاملتين مجاناً بدون اشتراك لـ {content.instructorName} في {content.subjectName} لمعاينة أسلوب الشرح وفهم المنهج قبل الاشتراك.
            </span>
          </div>
          <button
            onClick={() => setSubModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition shrink-0"
          >
            <Ticket className="w-3.5 h-3.5 text-amber-300" />
            <span>اشترك الآن أو اشحن كارت</span>
          </button>
        </div>
      )}

      {/* Top Player Action Bar */}
      <div className="h-16 border-b border-gray-800 bg-[#0d1322]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition px-2.5 py-1.5 rounded-lg hover:bg-gray-800"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="h-5 w-px bg-gray-800" />

          <div className="flex items-center gap-3">
            <img
              src={content.instructorAvatar}
              alt={content.instructorName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/40"
            />
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                {content.instructorName} &bull; {content.subjectName}
              </span>
              <span className="text-[11px] text-gray-400 block -mt-0.5">
                {activeChapter?.titleAr} &bull; {activeLesson?.titleAr}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>اشتراك مفعل ({activeSub?.durationLabel.split('(')[0]})</span>
            </div>
          ) : (
            <button
              onClick={() => setSubModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-gray-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>شحن كارت / اشتراك</span>
            </button>
          )}

          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            title={isTheaterMode ? 'خروج من وضع السينما' : 'وضع السينما'}
          >
            {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Player on left, Curriculum & Materials below */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Video Screen Area */}
        <div className="bg-black relative aspect-video max-h-[60vh] w-full flex items-center justify-center">
          {/* شريط تنبيه إذا كان المشغل يعرض فيديو مراجعة خاصة */}
          {activeRevisionVideo && (
            <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>جاري تشغيل فيديو مراجعة: {activeRevisionVideo.titleAr}</span>
              </div>
              <button
                onClick={() => setActiveRevisionVideo(null)}
                className="px-2.5 py-1 rounded-lg bg-gray-900/90 text-gray-300 hover:text-white text-[11px] font-bold"
              >
                العودة لمحاضرات المنهج
              </button>
            </div>
          )}

          {canPlayActiveLesson ? (
            (activeRevisionVideo?.videoUrl || activeLesson?.videoUrl) ? (
              (() => {
                const playingUrl = activeRevisionVideo?.videoUrl || activeLesson?.videoUrl;
                const playingTitle = activeRevisionVideo?.titleAr || activeLesson?.titleAr || 'فيديو';
                const ytEmbed = getYouTubeEmbedUrl(playingUrl);
                if (ytEmbed) {
                  return (
                    <iframe
                      src={ytEmbed}
                      title={playingTitle}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video
                    src={playingUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                );
              })()
            ) : (
              <div className="text-center p-8 text-gray-400 text-xs">لا يوجد فيديو محدد لهذه المحاضرة.</div>
            )
          ) : (
            /* Locked Video State */
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 ring-1 ring-amber-500/40">
                <Lock className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 mb-1">
                محتوى مقفل للمشتركين فقط
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{activeLesson?.titleAr}</h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mt-1 mb-5">
                لقد انتهت حصص المعاينة المجانية (متاح فيديوهين شرح مجاناً لكل مدرس). لمتابعة باقي دروس ووحدات المنهج مع {content.instructorName}، يرجى الاشتراك أو شحن كارت المنصة.
              </p>
              <button
                onClick={() => setSubModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-extrabold text-xs shadow-xl shadow-amber-500/30 flex items-center gap-2 transition"
              >
                <Ticket className="w-4 h-4" />
                <span>اشترك الآن أو اشحن كود الكارت</span>
              </button>
            </div>
          )}

          {/* Video Control Bar when playable */}
          {canPlayActiveLesson && (
            <div className="absolute bottom-0 inset-x-0 bg-gray-900/90 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-medium">سرعة التشغيل:</span>
                {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2 py-0.5 rounded font-mono font-medium ${
                      playbackSpeed === speed ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
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
                onClick={handleToggleComplete}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                  activeLesson?.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
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

        {/* 4 DISTINCT CLEAN TABS BELOW VIDEO */}
        <div className="border-b border-gray-800 bg-[#0d1322]/90 px-4 sm:px-8 flex items-center gap-4 sm:gap-8 overflow-x-auto">
          {/* Tab 1: Curriculum Videos (الأبواب والفصول) */}
          <button
            onClick={() => setActiveTab('chapters')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'chapters'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>الأبواب والفصول ({content.chapters.length})</span>
          </button>

          {/* Tab 2: Booklets & Handouts (قسم المذكرات) */}
          <button
            onClick={() => setActiveTab('booklets')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'booklets'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>قسم المذكرات والواجبات ({content.booklets.length})</span>
          </button>

          {/* Tab 3: Revisions (قسم المراجعات) */}
          <button
            onClick={() => setActiveTab('revisions')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'revisions'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>قسم المراجعات وليالي الامتحان ({content.revisions.length})</span>
          </button>

          {/* Tab 4: YA7EDU Booklets (قسم مذكرات YA7EDU) */}
          <button
            onClick={() => setActiveTab('ya7edu')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'ya7edu'
                ? 'border-amber-400 text-amber-300 font-extrabold'
                : 'border-transparent text-amber-400/70 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>مذكرات YA7EDU الحصرية ({content.ya7eduBooklets.length})</span>
          </button>

          {/* Tab 5: Exams & Quizzes (قسم الامتحانات والاختبارات) */}
          <button
            onClick={() => setActiveTab('exams')}
            className={`py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 shrink-0 transition ${
              activeTab === 'exams'
                ? 'border-rose-500 text-rose-300 font-extrabold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-rose-400" />
            <span>الامتحانات والاختبارات ({teacherExams.length})</span>
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="p-6 sm:p-8 flex-1 bg-[#0b0f19]">
          {/* TAB 1: CURRICULUM VIDEOS (الأبواب والفصول) */}
          {activeTab === 'chapters' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-white">الخطة الدراسية وأبواب المنهج</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  مرتبة حسب الوحدات الرسمية المعتمدة لـ {content.subjectName}. المحاضرات المفتوحة بدون قفل متاحة للمعاينة المجانية.
                </p>
              </div>

              {/* Free Preview Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">حق المعاينة المجانية مكفول لجميع الطلاب</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      أي مدرس لست مشتركاً معه، يمنحك النظام <strong>فيديوهين شرح كاملين مجاناً</strong> للمعاينة قبل الاشتراك.
                    </p>
                  </div>
                </div>
                {!isSubscribed && (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-[11px] shrink-0 self-start sm:self-auto">
                    متاح 2 فيديو شرح مجاناً
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {content.chapters.map(chap => {
                  const isCollapsed = collapsedChapters[chap.id] || false;
                  const completedLessons = chap.lessons.filter(l => l.isCompleted).length;

                  return (
                    <div key={chap.id} className="rounded-2xl glass-card border border-gray-800 overflow-hidden">
                      <button
                        onClick={() => toggleChapter(chap.id)}
                        className="w-full p-4 flex items-center justify-between text-right hover:bg-gray-800/40 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {chap.chapterNumber}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{chap.titleAr}</h4>
                            <span className="text-[11px] text-gray-400">
                              {chap.titleEn} &bull; {completedLessons}/{chap.lessons.length} محاضرات مكتملة
                            </span>
                          </div>
                        </div>

                        {isCollapsed ? (
                          <ChevronLeft className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {!isCollapsed && (
                        <div className="border-t border-gray-800/60 divide-y divide-gray-800/40 bg-gray-900/30">
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
                                    ? 'bg-cyan-500/10 border-r-4 border-cyan-400'
                                    : 'hover:bg-gray-800/40'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {isLocked ? (
                                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                                      <Lock className="w-3.5 h-3.5" />
                                    </div>
                                  ) : (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        toggleLessonProgress(content.id, les.id);
                                      }}
                                      className="text-gray-400 hover:text-emerald-400 shrink-0"
                                    >
                                      {les.isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-gray-600" />
                                      )}
                                    </button>
                                  )}

                                  <div>
                                    <div className={`text-xs font-semibold ${isCurrent ? 'text-cyan-300' : 'text-gray-200'}`}>
                                      {les.titleAr}
                                    </div>
                                    <div className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                                      <span>{les.durationMinutes} دقيقة</span>
                                      {les.isFree && !isSubscribed && (
                                        <span className="text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                                          <Unlock className="w-2.5 h-2.5" />
                                          <span>معاينة مجانية (فيديو {freeIndex >= 0 ? freeIndex + 1 : 1} من 2)</span>
                                        </span>
                                      )}
                                      {isLocked && (
                                        <span className="text-amber-400 font-mono text-[9px] bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                          <Lock className="w-2.5 h-2.5" />
                                          <span>يتطلب اشتراك</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  {isCurrent && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                                      جاري المشاهدة
                                    </span>
                                  )}
                                  {isLocked && (
                                    <span className="text-xs text-amber-400 hover:underline font-bold">
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

          {/* TAB 2: BOOKLETS & HANDOUTS (قسم المذكرات) */}
          {activeTab === 'booklets' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-white">كراسات ومذكرات الشرح والواجبات</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  ملفات PDF مخصصة للطباعة والمذاكرة، تشمل ملخصات القوانين وحلول الواجبات.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.booklets.map(bkt => {
                  const isLocked = !isSubscribed && !bkt.isFree;
                  const isPractice = bkt.format === 'INTERACTIVE_PRACTICE' || Boolean(bkt.questions && bkt.questions.length > 0);

                  return (
                    <div
                      key={bkt.id}
                      className="p-5 rounded-2xl glass-card border border-gray-800 hover:border-indigo-500/40 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5 pl-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isPractice ? 'bg-cyan-500/20 text-cyan-400' : 'bg-indigo-500/20 text-indigo-400'
                        }`}>
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-amber-400" />
                          ) : isPractice ? (
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{bkt.titleAr}</h4>
                          <p className="text-[11px] text-gray-400">{bkt.titleEn}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-indigo-300 font-mono">
                              {isPractice ? `${bkt.questions?.length || 3} مسائل تدريبية` : `${bkt.pageCount} صفحة`} &bull; {bkt.fileSize}
                            </span>
                            {isPractice && (
                              <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.2 rounded border border-cyan-500/30">
                                تدريب تفاعلي 💡
                              </span>
                            )}
                            {bkt.isFree && !isSubscribed && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                                عينة مجانية
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isPractice ? (
                        <button
                          onClick={() => {
                            if (isLocked) {
                              setSubModalOpen(true);
                            } else {
                              setSelectedPracticeBooklet(bkt);
                            }
                          }}
                          className={`px-3.5 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-md ${
                            isLocked
                              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                              : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 text-white'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>فتح التدريب</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                              <span>حل التدريب مع التفسير الفوري 💡</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDownloadMaterial(bkt.titleAr, bkt.isFree, bkt.downloadUrl)}
                          className={`p-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-semibold ${
                            isLocked
                              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                              : 'bg-gray-800 hover:bg-indigo-600 text-gray-300 hover:text-white'
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

          {/* TAB 3: REVISIONS & EXAM NIGHTS (قسم المراجعات) */}
          {activeTab === 'revisions' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-white">المراجعات الدورية ومذكرات ليلة الامتحان</h3>
                <p className="text-xs text-gray-400 mt-0.5">
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
                      className="p-5 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-500/60 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5 pl-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isVideoRev ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-amber-400" />
                          ) : isVideoRev ? (
                            <Play className="w-5 h-5 fill-rose-400 text-rose-400" />
                          ) : (
                            <Calendar className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{rev.titleAr}</h4>
                          <p className="text-[11px] text-gray-400">{rev.titleEn}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-emerald-300 font-mono">
                              {isVideoRev ? `${rev.durationMinutes || 45} دقيقة &bull; فيديو شرح` : `${rev.pageCount} صفحة &bull; ${rev.fileSize}`}
                            </span>
                            {isVideoRev && (
                              <span className="text-[9px] font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.2 rounded border border-rose-500/30">
                                🎬 فيديو مراجعة
                              </span>
                            )}
                            {rev.isFree && !isSubscribed && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                                عينة مجانية
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isVideoRev ? (
                        <button
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
                          className={`px-3.5 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-md ${
                            isLocked
                              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                              : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 text-white'
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
                          onClick={() => handleDownloadMaterial(rev.titleAr, rev.isFree, rev.downloadUrl)}
                          className={`p-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 text-xs font-semibold ${
                            isLocked
                              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                              : 'bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white'
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

          {/* TAB 4: YA7EDU EXCLUSIVE BOOKLETS (قسم مذكرات YA7EDU) */}
          {activeTab === 'ya7edu' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-900/20 to-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>مذكرات YA7EDU الحصرية لطلاب الأوائل</span>
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    إصدارات رسمية خاصة لا تتوفر إلا لمشتركي منصة YA7EDU، تشمل كبسولات القوانين ونقاط التريكات الوزارية.
                  </p>
                </div>
                {!isSubscribed && (
                  <button
                    onClick={() => setSubModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs shrink-0 transition"
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
                      className="p-5 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-500/60 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5 pl-3">
                        <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          {isLocked ? <Lock className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{ya7.titleAr}</h4>
                          <p className="text-[11px] text-gray-400">{ya7.titleEn}</p>
                          <span className="text-[10px] text-amber-300 font-mono mt-0.5 block">
                            {ya7.pageCount} صفحة &bull; {ya7.fileSize}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadMaterial(ya7.titleAr, ya7.isFree, ya7.downloadUrl)}
                        className={`p-2.5 rounded-xl font-bold text-xs transition shrink-0 flex items-center gap-1.5 ${
                          isLocked
                            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                            : 'bg-amber-500 hover:bg-amber-400 text-gray-950'
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

          {/* TAB 5: EXAMS & QUIZZES (قسم الامتحانات والاختبارات) */}
          {activeTab === 'exams' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-white">الامتحانات والاختبارات الدورية</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  امتحانات معتمدة من مستر {content.instructorName}. تطبق المنصة قاعدة حجب النتيجة حتى انتهاء وقت الامتحان لمنع تسريب الأسئلة.
                </p>
              </div>

              {/* Embargo rule card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-indigo-950/30 border border-amber-500/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-white">قاعدة حجب النتيجة حتى انتهاء تاريخ ووقت الامتحان (Exam Embargo)</h4>
                  <p className="text-gray-300 mt-0.5 leading-relaxed">
                    تظل درجتك ونموذج الحل النموذجي محجوبة بالكامل حتى انقضاء تاريخ وساعة نهاية الامتحان رسمياً لجميع الطلاب، حفاظاً على تكافؤ الفرص ومنع تسريب الأسئلة.
                  </p>
                </div>
              </div>

              {teacherExams.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs rounded-2xl glass-card border border-gray-800">
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
                        className="p-5 rounded-3xl glass-card border border-gray-800 hover:border-indigo-500/50 flex flex-col justify-between transition-all duration-300 shadow-xl group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                              {ex.subjectName}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{ex.durationMinutes} دقيقة</span>
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                              {ex.title}
                            </h4>
                            <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                              {ex.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80 text-[11px] text-gray-300">
                            <div>الأسئلة: <strong className="text-white">{ex.questions.length}</strong></div>
                            <div>الدرجة الكلية: <strong className="text-white">{ex.totalMarks}</strong></div>
                          </div>

                          {(ex.startDate || ex.endDate) && (
                            <div className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 text-[11px] font-mono space-y-1">
                              <div className="flex items-center justify-between text-gray-400">
                                <span>يبدأ الامتحان:</span>
                                <span className="text-gray-200">{ex.startDate} ({ex.startTime || '00:00'})</span>
                              </div>
                              <div className="flex items-center justify-between text-gray-400">
                                <span className="text-amber-400">ينتهي الامتحان:</span>
                                <span className="text-amber-300 font-bold">{ex.endDate} ({ex.endTime || '23:59'})</span>
                              </div>
                            </div>
                          )}

                          {isEmbargoed && (
                            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-300 space-y-1">
                              <div className="flex items-center gap-1.5 font-bold">
                                <Lock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                <span>تم التسليم • النتيجة محجوبة</span>
                              </div>
                              <div className="text-[10px] text-gray-400 leading-tight">
                                ستظهر النتيجة ونموذج الإجابة تلقائياً بعد انتهاء موعد الامتحان في: {ex.endDate} ({ex.endTime || '23:59'})
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-800 mt-4">
                          {isUnlocked ? (
                            <button
                              onClick={() => setSelectedExamForRunner(ex)}
                              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition"
                            >
                              <Award className="w-4 h-4" />
                              <span>النتيجة والحل النموذجي ({studentAttempt?.scorePercent}%)</span>
                            </button>
                          ) : isEmbargoed ? (
                            <button
                              onClick={() => setSelectedExamForRunner(ex)}
                              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/25 animate-pulse transition"
                            >
                              <Clock className="w-4 h-4" />
                              <span>متابعة عداد فك الحجب (محجوب) ⏱️</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedExamForRunner(ex)}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition"
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
    <Suspense fallback={<div className="p-8 text-center text-gray-400">جاري تحميل منصة المحاضرات...</div>}>
      <PlayerContent />
    </Suspense>
  );
}
