'use client';

import React, { useState, use, useRef } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Download,
  HelpCircle,
  Award,
  Sparkles,
  Maximize2,
  Minimize2,
  Send,
  Timer,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { courses, enrollments, currentUser, toggleLessonComplete, submitQuiz } = useLMS();

  // العثور على المنهج أو استخدام الأول افتراضياً
  const course = courses.find(c => c.id === courseId) || courses[0];
  const userEnrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === course.id);

  // قائمة جميع المحاضرات
  const allLessons = course.sections.flatMap(s => s.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string>(
    userEnrollment?.lastAccessedLessonId || allLessons[0]?.id || ''
  );

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const activeSection = course.sections.find(s => s.lessons.some(l => l.id === activeLesson?.id));

  // حالة مشغل الفيديو
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'qa' | 'quiz'>('notes');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // الأقسام المطوية
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // الأسئلة والمناقشات
  const [questions, setQuestions] = useState<Array<{ id: string; author: string; avatar: string; text: string; time: string; reply?: string }>>([
    {
      id: 'q_1',
      author: 'محمد طارق (طالب)',
      avatar: currentUser.avatar,
      text: 'يا مستر، هل قانون كيرشوف الأول ينطبق على الدوائر التي تحتوي على مكثفات في حالة الاستقرار؟',
      time: 'منذ ساعتين',
      reply: 'نعم يا بطل، لأن قانون كيرشوف الأول يعبر عن مبدأ حفظ الشحنة الكهربية، والشحنة محفوظة دائماً في أي نقطة تفرع. راجع المثال في الدقيقة 14!'
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  // حالة الاختبار التفاعلي
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  const isCompleted = userEnrollment?.completedLessonIds.includes(activeLesson?.id || '') || false;
  const progressPercent = userEnrollment?.progressPercent || 0;

  const toggleSection = (secId: string) => {
    setCollapsedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleToggleComplete = () => {
    if (!activeLesson) return;
    toggleLessonComplete(course.id, activeLesson.id);

    // إذا تم إكمال كافة المحاضرات، نطلق مؤثر الاحتفال
    const totalCount = allLessons.length;
    const currentCompleted = userEnrollment?.completedLessonIds.length || 0;
    if (!isCompleted && currentCompleted + 1 >= totalCount) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1];
      setActiveLessonId(next.id);
      if (next.quiz) setActiveTab('quiz');
      else setActiveTab('notes');
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
    if (currentIndex > 0) {
      const prev = allLessons[currentIndex - 1];
      setActiveLessonId(prev.id);
      if (prev.quiz) setActiveTab('quiz');
      else setActiveTab('notes');
    }
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    setQuestions(prev => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        author: currentUser.name,
        avatar: currentUser.avatar,
        text: newQuestionText,
        time: 'الآن'
      }
    ]);
    setNewQuestionText('');
  };

  const handleQuizSubmit = () => {
    if (!activeLesson?.quiz) return;
    const totalQ = activeLesson.quiz.questions.length;
    let correctCount = 0;
    activeLesson.quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / totalQ) * 100);
    const res = submitQuiz(course.id, activeLesson.id, scorePercent);
    setQuizResult(res);

    if (res.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className={`min-h-[calc(100vh-5rem)] flex flex-col font-sans -m-4 sm:-m-6 lg:-m-8 ${isTheaterMode ? 'fixed inset-0 z-50 bg-[#0b0f19] p-4 overflow-y-auto' : ''}`}>
      {/* شريط الإجراءات العلوي للمشغل */}
      <div className="h-14 border-b border-gray-800 bg-[#0d1322]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition px-2.5 py-1.5 rounded-lg hover:bg-gray-800"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للرئيسية</span>
          </Link>

          <div className="h-4 w-px bg-gray-800" />

          <div>
            <span className="text-xs font-bold text-white line-clamp-1">
              {course.title}
            </span>
            <span className="text-[11px] text-gray-400 block -mt-0.5">
              {activeSection?.title} &bull; {activeLesson?.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* مؤشر الإنجاز الكلي */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-400">نسبة الإنجاز:</span>
            <div className="w-24 h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">{progressPercent}%</span>
          </div>

          {progressPercent === 100 && (
            <Link
              href="/student/quizzes"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition"
            >
              <Award className="w-3.5 h-3.5" />
              <span>استخراج الشهادة</span>
            </Link>
          )}

          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            title={isTheaterMode ? 'إلغاء وضع المسرح' : 'وضع المسرح المكبر'}
          >
            {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* منطقة المشغل الرئيسية */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* الفيديو والتبويبات */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* مشغل الفيديو */}
          <div className="bg-black relative group flex flex-col justify-center items-center aspect-video max-h-[65vh] w-full">
            {activeLesson?.videoUrl ? (
              <video
                ref={videoRef}
                src={activeLesson.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={course.thumbnail}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/40 to-slate-900 p-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 ring-1 ring-cyan-500/40">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">محاضرة تقييم واختبار تراكمي</h3>
                <p className="text-sm text-gray-300 max-w-md mt-1">
                  هذه الحصة مخصصة لاختبار فهم واستيعاب المفاهيم من خلال كويز تفاعلي محدد بوقت.
                </p>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>بدء الاختبار التراكمي الآن</span>
                </button>
              </div>
            )}

            {/* شريط تحكم الفيديو */}
            {activeLesson?.videoUrl && (
              <div className="w-full bg-gray-900/90 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-medium">السرعة:</span>
                  {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`px-2 py-0.5 rounded font-mono font-medium ${
                        playbackSpeed === speed
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleComplete}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تمت المشاهدة بنجاح</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>تحديد كمكتمل</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrevLesson}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
                    title="المحاضرة السابقة"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextLesson}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
                    title="المحاضرة التالية"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* تبويبات الشرح والمذكرات والأسئلة */}
          <div className="border-b border-gray-800 bg-[#0d1322]/80 px-4 sm:px-6 flex items-center gap-6">
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'notes'
                  ? 'border-cyan-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ملاحظات الحصة</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'resources'
                  ? 'border-cyan-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>المذكرات والمرفقات ({activeLesson?.resources?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'qa'
                  ? 'border-cyan-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>اسأل المعلم وزملائك</span>
            </button>

            {activeLesson?.quiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                  activeTab === 'quiz'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-cyan-400/80 hover:text-cyan-300'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>اختبار المحاضرة</span>
              </button>
            )}
          </div>

          {/* محتوى التبويب النشط */}
          <div className="p-6 flex-1 bg-[#0b0f19] text-right">
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">{activeLesson?.title}</h2>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" />
                    <span>المدة الزمنية: {activeLesson?.durationMinutes} دقيقة</span>
                  </span>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-gray-900/60 p-5 rounded-2xl border border-gray-800">
                  {activeLesson?.notes || 'لا توجد ملاحظات نصية مسجلة لهذه المحاضرة.'}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">
                  المذكرات التدريبية وملفات الواجب القابلة للتحميل
                </h3>
                {activeLesson?.resources && activeLesson.resources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.resources.map(res => (
                      <div
                        key={res.id}
                        className="p-4 rounded-xl glass-card border border-gray-800 flex items-center justify-between hover:border-cyan-500/40 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs uppercase">
                            {res.type}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{res.name}</div>
                            <div className="text-[11px] text-gray-400">{res.size}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`جاري تنزيل ملف "${res.name}" بصيغة PDF`)}
                          className="p-2 rounded-lg bg-gray-800 hover:bg-cyan-600 text-gray-300 hover:text-white transition"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">لا توجد ملفات مرفقة إضافية لهذه المحاضرة.</p>
                )}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-6">
                <form onSubmit={handlePostQuestion} className="space-y-3">
                  <label className="text-xs font-bold text-gray-300 block">
                    اكتب سؤالك أو استفسارك للمعلم
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestionText}
                      onChange={e => setNewQuestionText(e.target.value)}
                      placeholder="هل استعصت عليك مسألة أو قانون في الشرح؟ اسأل هنا..."
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5 rotate-180" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {questions.map(q => (
                    <div key={q.id} className="p-4 rounded-xl glass-card border border-gray-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={q.avatar} alt={q.author} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-semibold text-white">{q.author}</div>
                          <div className="text-[10px] text-gray-400">{q.time}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300">{q.text}</p>

                      {q.reply && (
                        <div className="mr-6 p-3 rounded-xl bg-indigo-950/40 border-r-2 border-cyan-500 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-300">{course.instructorName}</span>
                            <span className="text-[9px] font-mono px-1.5 rounded bg-cyan-500/20 text-cyan-300">
                              معلم المادة
                            </span>
                          </div>
                          <p className="text-gray-300">{q.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quiz' && activeLesson?.quiz && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeLesson.quiz.title}</h3>
                    <p className="text-xs text-gray-400">
                      درجة النجاح: {activeLesson.quiz.passingScore}% &bull; الوقت المحدد: {activeLesson.quiz.timeLimitMinutes} دقيقة
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    <Timer className="w-4 h-4" />
                    <span>مؤقت زمني نشط</span>
                  </div>
                </div>

                {/* الأسئلة */}
                <div className="space-y-5">
                  {activeLesson.quiz.questions.map((q, qIndex) => (
                    <div key={q.id} className="p-5 rounded-2xl glass-card border border-gray-800 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{q.question}</h4>
                      </div>

                      <div className="space-y-2 mt-3 pr-8">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = quizAnswers[q.id] === optIndex;
                          const showCorrect = quizResult !== null && optIndex === q.correctAnswerIndex;
                          const showWrong = quizResult !== null && isSelected && !showCorrect;

                          return (
                            <button
                              key={optIndex}
                              onClick={() => {
                                if (quizResult === null) {
                                  setQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }));
                                }
                              }}
                              className={`w-full text-right p-3 rounded-xl text-xs transition border flex items-center justify-between ${
                                showCorrect
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold'
                                  : showWrong
                                  ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                                  : isSelected
                                  ? 'bg-cyan-600/30 border-cyan-500 text-white font-semibold'
                                  : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              {showWrong && <AlertCircle className="w-4 h-4 text-rose-400" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizResult !== null && (
                        <div className="mt-3 pr-8 text-xs text-gray-400 bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                          <strong>تفسير الإجابة النموذجية:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* النتيجة */}
                {quizResult ? (
                  <div className={`p-5 rounded-2xl border text-center space-y-2 ${
                    quizResult.passed ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  }`}>
                    <h4 className="text-lg font-bold">
                      {quizResult.passed ? '🎉 مبروك! اجتزت الاختبار بنجاح وتم تسجيل الدرجة!' : '❌ لم تحقق نسبة النجاح المطلوبة. حاول مرة أخرى.'}
                    </h4>
                    <p className="text-xs">
                      درجتك المحققة: <strong>{quizResult.score}%</strong> (درجة الاجتياز: {activeLesson.quiz.passingScore}%)
                    </p>
                    <button
                      onClick={() => {
                        setQuizResult(null);
                        setQuizAnswers({});
                      }}
                      className="mt-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < activeLesson.quiz.questions.length}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition"
                  >
                    تسليم إجابات الاختبار للتصحيح
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* الشريط الجانبي لفهرس المحاضرات */}
        <div
          className={`border-r border-gray-800 bg-[#0d1322]/90 flex flex-col shrink-0 transition-all duration-300 ${
            sidebarOpen ? 'w-full lg:w-80' : 'w-12'
          }`}
        >
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            {sidebarOpen ? (
              <>
                <div className="text-right">
                  <h3 className="text-xs font-bold text-white">
                    فهرس محتويات المنهج
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    أنجزت {userEnrollment?.completedLessonIds.length || 0} من أصل {allLessons.length} حصة
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-full py-2 flex items-center justify-center text-gray-400 hover:text-white"
                title="فتح الفهرس"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-right">
              {course.sections.map((sec, secIdx) => {
                const isCollapsed = collapsedSections[sec.id] || false;
                const completedInSec = sec.lessons.filter(l =>
                  userEnrollment?.completedLessonIds.includes(l.id)
                ).length;

                return (
                  <div key={sec.id} className="rounded-xl border border-gray-800/80 bg-gray-900/40 overflow-hidden">
                    <button
                      onClick={() => toggleSection(sec.id)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-right hover:bg-gray-800/40 transition"
                    >
                      <div className="pl-2">
                        <div className="text-xs font-semibold text-gray-200 line-clamp-1">
                          {sec.title}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {completedInSec}/{sec.lessons.length} &bull; {sec.lessons.reduce((acc, l) => acc + l.durationMinutes, 0)} دقيقة
                        </div>
                      </div>
                      {isCollapsed ? (
                        <ChevronLeft className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      )}
                    </button>

                    {!isCollapsed && (
                      <div className="border-t border-gray-800/60 divide-y divide-gray-800/40">
                        {sec.lessons.map(lesson => {
                          const isLessonActive = activeLessonId === lesson.id;
                          const isLessonCompleted = userEnrollment?.completedLessonIds.includes(lesson.id) || false;

                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between px-3 py-2.5 transition group cursor-pointer ${
                                isLessonActive
                                  ? 'bg-cyan-600/20 border-r-4 border-cyan-500'
                                  : 'hover:bg-gray-800/50'
                              }`}
                              onClick={() => {
                                setActiveLessonId(lesson.id);
                                if (lesson.quiz) setActiveTab('quiz');
                                else setActiveTab('notes');
                              }}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pl-2">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    toggleLessonComplete(course.id, lesson.id);
                                  }}
                                  className="text-gray-400 hover:text-emerald-400 shrink-0"
                                >
                                  {isLessonCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                                  )}
                                </button>

                                <div className="min-w-0">
                                  <p
                                    className={`text-xs line-clamp-1 ${
                                      isLessonActive
                                        ? 'font-bold text-white'
                                        : isLessonCompleted
                                        ? 'text-gray-400 line-through'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                    {lesson.videoUrl ? (
                                      <span className="flex items-center gap-1">
                                        <Play className="w-2.5 h-2.5" />
                                        {lesson.durationMinutes} د
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        اختبار
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {isLessonActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
