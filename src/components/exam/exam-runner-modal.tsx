'use client';

import React, { useState, useEffect } from 'react';
import { useLMS } from '@/context/lms-context';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  FastForward,
  RotateCcw,
  Calendar
} from 'lucide-react';
import { InstructorExam, StudentExamAttempt } from '@/lib/types';
import { getExamEndDeadlineMs, formatEmbargoCountdown, formatArabicTime } from '@/lib/exam-utils';
import confetti from 'canvas-confetti';


interface ExamRunnerModalProps {
  exam: InstructorExam;
  isOpen: boolean;
  onClose: () => void;
}

export function ExamRunnerModal({ exam, isOpen, onClose }: ExamRunnerModalProps) {
  const {
    currentUser,
    startExamAttempt,
    submitExamAttempt,
    unlockExamAttempt,
    studentExamAttempts
  } = useLMS();

  // Find or start attempt
  const existingAttempt = studentExamAttempts.find(
    a => a.examId === exam.id && a.studentId === currentUser.id
  );

  const [attempt, setAttempt] = useState<StudentExamAttempt | null>(existingAttempt || null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    existingAttempt?.answers || {}
  );
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Remaining seconds for answering the exam (duration based)
  const [takingSecondsRemaining, setTakingSecondsRemaining] = useState<number>(() => {
    if (!existingAttempt) return exam.durationMinutes * 60;
    const startMs = new Date(existingAttempt.startedAt).getTime();
    const durationMs = exam.durationMinutes * 60 * 1000;
    const endMs = startMs + durationMs;
    return Math.max(0, Math.floor((endMs - Date.now()) / 1000));
  });

  // Remaining seconds until official exam end date & time (embargo deadline)
  const [embargoSecondsRemaining, setEmbargoSecondsRemaining] = useState<number>(() => {
    const deadlineMs = getExamEndDeadlineMs(exam, existingAttempt?.startedAt);
    return Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000));
  });

  // Start attempt on modal open if not exists
  useEffect(() => {
    if (isOpen && !attempt) {
      const newAtt = startExamAttempt(exam.id);
      setAttempt(newAtt);
      setTakingSecondsRemaining(exam.durationMinutes * 60);
      const deadlineMs = getExamEndDeadlineMs(exam, newAtt.startedAt);
      setEmbargoSecondsRemaining(Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000)));
    }
  }, [isOpen]);

  // Keep attempt in sync with context
  useEffect(() => {
    const updated = studentExamAttempts.find(
      a => a.examId === exam.id && a.studentId === currentUser.id
    );
    if (updated) setAttempt(updated);
  }, [studentExamAttempts, exam.id, currentUser.id]);

  // Timer interval for taking duration and embargo deadline
  useEffect(() => {
    if (!isOpen || !attempt) return;

    const startMs = new Date(attempt.startedAt).getTime();
    const durationMs = exam.durationMinutes * 60 * 1000;
    const takingEndMs = startMs + durationMs;
    const embargoDeadlineMs = getExamEndDeadlineMs(exam, attempt.startedAt);

    const interval = setInterval(() => {
      const now = Date.now();

      // Countdown for taking questions
      const takingDiff = Math.max(0, Math.floor((takingEndMs - now) / 1000));
      setTakingSecondsRemaining(takingDiff);

      // Countdown for embargo deadline
      const embargoDiff = Math.max(0, Math.floor((embargoDeadlineMs - now) / 1000));
      setEmbargoSecondsRemaining(embargoDiff);

      // Auto unlock when embargo deadline ends if submitted but locked
      if (embargoDiff === 0 && attempt.submittedAt && !attempt.isUnlocked) {
        unlockExamAttempt(attempt.id);
        confetti({ particleCount: 90, spread: 70 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, attempt, exam]);

  if (!isOpen) return null;

  const isSubmitted = Boolean(attempt?.submittedAt);
  const isUnlocked = Boolean(attempt?.isUnlocked);
  const isEmbargoed = isSubmitted && !isUnlocked;
  const embargoCountdown = formatEmbargoCountdown(embargoSecondsRemaining);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = exam.questions[activeQuestionIndex] || exam.questions[0];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmit = () => {
    if (!attempt) return;
    if (answeredCount < exam.questions.length) {
      const confirmIncomplete = confirm(
        `أجبت على ${answeredCount} من أصل ${exam.questions.length} أسئلة فقط. هل أنت متأكد من تسليم الامتحان الآن؟`
      );
      if (!confirmIncomplete) return;
    }

    const updated = submitExamAttempt(attempt.id, selectedAnswers);
    setAttempt(updated);

    if (updated.isUnlocked) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleFastForwardUnlock = () => {
    if (!attempt) return;
    unlockExamAttempt(attempt.id);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#0d1322] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">{exam.title}</h3>
              <span className="text-[11px] text-gray-400">
                {exam.instructorName} &bull; {exam.subjectName} &bull; {exam.totalMarks} درجة
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer or State badge */}
            {!isSubmitted ? (
              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono font-bold text-xs ${
                  takingSecondsRemaining < 120
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>الوقت المتبقي: {formatTime(takingSecondsRemaining)}</span>
              </div>
            ) : isEmbargoed ? (
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 animate-pulse font-mono">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>النتيجة محجوبة ({embargoCountdown.digital})</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>النتيجة معلنة ({attempt?.scorePercent}%)</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* STATE 1: ACTIVE EXAM (Taking Questions) */}
          {!isSubmitted && (
            <div className="space-y-6">
              {/* Question Navigation Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>السؤال {activeQuestionIndex + 1} من {exam.questions.length}</span>
                  <span className="font-mono text-cyan-400 font-bold">({currentQ.marks} درجات)</span>
                </div>
                <div className="text-gray-400">
                  تمت الإجابة على <strong className="text-white">{answeredCount}</strong> من {exam.questions.length}
                </div>
              </div>

              {/* Question Number Pills */}
              <div className="flex flex-wrap gap-2">
                {exam.questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === activeQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-xl font-bold text-xs transition ${
                        isCurrent
                          ? 'bg-cyan-500 text-gray-950 ring-2 ring-cyan-400 font-black'
                          : isAnswered
                          ? 'bg-indigo-600/40 text-indigo-300 border border-indigo-500/50'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Current Question Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
                <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  سؤال {activeQuestionIndex + 1}
                </div>
                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {currentQ.questionText}
                </p>
              </div>

              {/* Options Radio List */}
              <div className="space-y-2.5">
                {currentQ.options.map((optText, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:bg-gray-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'border-indigo-400 bg-indigo-500 text-white'
                              : 'border-gray-700 bg-gray-900 text-gray-500'
                          }`}
                        >
                          {['أ', 'ب', 'ج', 'د'][optIdx] || optIdx + 1}
                        </div>
                        <span className="text-xs sm:text-sm">{optText}</span>
                      </div>

                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation and Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                    className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>

                  <button
                    disabled={activeQuestionIndex === exam.questions.length - 1}
                    onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                    className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تسليم الامتحان الآن</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: EMBARGOED (Submitted, but official exam end date & time hasn't arrived yet!) */}
          {isEmbargoed && (
            <div className="py-4 text-center space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto ring-4 ring-amber-500/30 animate-pulse">
                <Lock className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تم استلام وتوثيق إجاباتك بنجاح في النظام</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-3">
                  النتيجة ونموذج الإجابة محجوبة حالياً
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  بناءً على تعليمات المعلم (مستر <strong>{exam.instructorName}</strong>) وضوابط حوكمة الامتحانات بالمنصة، تظل نتيجة الامتحان ونموذج الإجابة محجوبة بالكامل حتى انتهاء تاريخ ووقت الامتحان رسمياً لجميع الطلاب منعاً لتسريب الأسئلة وضماناً لتكافؤ الفرص.
                </p>
              </div>

              {/* بطاقة مواعيد نهاية الامتحان الرسمية */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-gray-950/80 border border-gray-800 text-xs">
                <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-800 text-center">
                  <span className="text-[10px] text-gray-400 block mb-1">تاريخ نهاية الامتحان</span>
                  <span className="font-bold text-white font-mono text-xs">{exam.endDate || 'محدد بالمدة'}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-800 text-center">
                  <span className="text-[10px] text-gray-400 block mb-1">ساعة نهاية الامتحان</span>
                  <span className="font-bold text-amber-300 font-mono text-xs">
                    {formatArabicTime(exam.endTime) || exam.endTime || 'نهاية الموعد'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-800 text-center">
                  <span className="text-[10px] text-gray-400 block mb-1">مدة الإجابة المحددة</span>
                  <span className="font-bold text-cyan-300 font-mono text-xs">{exam.durationMinutes} دقيقة</span>
                </div>
              </div>

              {/* Big Countdown Timer Card with Days/Hours/Minutes/Seconds blocks */}
              <div className="p-6 rounded-3xl bg-gray-950 border border-amber-500/30 shadow-xl space-y-3">
                <span className="text-xs font-bold text-amber-400 block flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 animate-spin text-amber-400" />
                  <span>الوقت المتبقي حتى انتهاء الامتحان وفك حجب النتيجة تلقائياً:</span>
                </span>

                <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1 font-mono">
                  {embargoCountdown.days > 0 && (
                    <div className="p-3 rounded-2xl bg-gray-900/90 border border-amber-500/30 min-w-[70px]">
                      <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                        {embargoCountdown.days}
                      </span>
                      <span className="text-[10px] text-gray-400 font-sans block mt-0.5">يوم</span>
                    </div>
                  )}
                  <div className="p-3 rounded-2xl bg-gray-900/90 border border-amber-500/30 min-w-[70px]">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                      {embargoCountdown.hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans block mt-0.5">ساعة</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-900/90 border border-amber-500/30 min-w-[70px]">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                      {embargoCountdown.minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans block mt-0.5">دقيقة</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-900/90 border border-amber-500/30 min-w-[70px]">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 block animate-pulse">
                      {embargoCountdown.seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans block mt-0.5">ثانية</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400">
                  ستظهر درجتك ونموذج الإجابة التفسيري تلقائياً فور وصول العداد إلى الصفر في موعد نهاية الامتحان.
                </div>
              </div>

              {/* Fast Forward Demo Button for testing/evaluation */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5 text-right">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>زر تجربة العرض الفوري (Fast-Forward Demo):</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  لتسهيل مراجعة وتجربة النظام دون الانتظار الفعلي حتى انقضاء موعد نهاية الامتحان، يمكنك النقر على الزر أدناه لفك الحجب فوراً واستعراض النتيجة ونموذج الإجابة.
                </p>
                <button
                  onClick={handleFastForwardUnlock}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <FastForward className="w-4 h-4" />
                  <span>تخطي الوقت واستعراض النتيجة ونموذج الحل الآن</span>
                </button>
              </div>
            </div>
          )}


          {/* STATE 3: UNLOCKED RESULTS & MODEL ANSWERS */}
          {isUnlocked && attempt && (
            <div className="space-y-6">
              {/* Score Highlight Card */}
              <div
                className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
                  attempt.passed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl ${
                      attempt.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {attempt.passed ? '🏆' : '⚠️'}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block">
                      {attempt.passed ? 'تم اجتياز الامتحان بنجاح' : 'لم يتم تحقيق نسبة الاجتياز'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      درجتك المحققة: {attempt.totalScore} من {attempt.maxScore}
                    </h3>
                    <span className="text-xs text-gray-400">
                      نسبتك المئوية: <strong className="text-white">{attempt.scorePercent}%</strong> &bull; درجة النجاح: {exam.passingPercent}%
                    </span>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-center shrink-0">
                  <span className="text-[10px] text-gray-400 block">حالة النتيجة</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1 justify-center mt-0.5">
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>مُعلنة ونموذج الحل متاح</span>
                  </span>
                </div>
              </div>

              {/* Model Answers Review */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>نموذج الإجابة الرسمي وتفسير مستر {exam.instructorName}</span>
                </h4>

                <div className="space-y-4">
                  {exam.questions.map((q, idx) => {
                    const studentAns = attempt.answers[q.id];
                    const isCorrect = studentAns === q.correctOptionIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                          isCorrect ? 'bg-emerald-950/15 border-emerald-500/30' : 'bg-rose-950/15 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400">سؤال {idx + 1} ({q.marks} درجات)</span>
                          {isCorrect ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>إجابة صحيحة (+{q.marks})</span>
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>إجابة خاطئة (0/{q.marks})</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-white">{q.questionText}</p>

                        {/* Options comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isChosenByStudent = studentAns === optIdx;
                            const isModelAnswer = q.correctOptionIndex === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                  isModelAnswer
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                                    : isChosenByStudent
                                    ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                                    : 'bg-gray-900 border-gray-800 text-gray-400'
                                }`}
                              >
                                <span>{opt}</span>
                                {isModelAnswer && (
                                  <span className="text-[10px] bg-emerald-500 text-gray-950 px-1.5 py-0.2 rounded font-black">
                                    الإجابة الصحيحة
                                  </span>
                                )}
                                {isChosenByStudent && !isModelAnswer && (
                                  <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-black">
                                    إجابتك
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Instructor's detailed explanation */}
                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-xs text-gray-300">
                            <strong className="text-cyan-400 block mb-0.5">توضيح المعلم:</strong>
                            <span>{q.explanation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
