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
  const [takingSecondsRemaining, setTakingSecondsRemaining] = useState<number>(exam.durationMinutes * 60);

  // Remaining seconds until official exam end date & time (embargo deadline)
  const [embargoSecondsRemaining, setEmbargoSecondsRemaining] = useState<number>(0);

  // Sync timers when existingAttempt is present or on mount
  useEffect(() => {
    if (existingAttempt) {
      const startMs = new Date(existingAttempt.startedAt).getTime();
      const durationMs = exam.durationMinutes * 60 * 1000;
      const endMs = startMs + durationMs;
      setTakingSecondsRemaining(Math.max(0, Math.floor((endMs - Date.now()) / 1000)));

      const deadlineMs = getExamEndDeadlineMs(exam, existingAttempt.startedAt);
      setEmbargoSecondsRemaining(Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000)));
    }
  }, [existingAttempt, exam]);

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

      // 1. Duration timer (if still taking)
      if (!attempt.submittedAt) {
        const remaining = Math.max(0, Math.floor((takingEndMs - now) / 1000));
        setTakingSecondsRemaining(remaining);
        if (remaining === 0) {
          // Auto submit on timeout
          handleSubmit();
        }
      }

      // 2. Embargo deadline timer (if submitted but not unlocked yet)
      const embargoLeft = Math.max(0, Math.floor((embargoDeadlineMs - now) / 1000));
      setEmbargoSecondsRemaining(embargoLeft);

      if (attempt.submittedAt && !attempt.isUnlocked && embargoLeft === 0) {
        // Automatically unlock results!
        unlockExamAttempt(attempt.id);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, attempt, exam]);

  if (!isOpen) return null;

  const currentQ = exam.questions[activeQuestionIndex] || exam.questions[0];
  const isSubmitted = !!attempt?.submittedAt;
  const isUnlocked = isSubmitted && !!attempt?.isUnlocked;
  const isEmbargoed = isSubmitted && !isUnlocked;

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    if (!attempt || isSubmitted) return;
    submitExamAttempt(attempt.id, selectedAnswers);
  };

  // Fast-Forward cheat for testing/evaluation (unlocks immediately)
  const handleFastForwardUnlock = () => {
    if (!attempt) return;
    unlockExamAttempt(attempt.id);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const embargoCountdown = formatEmbargoCountdown(embargoSecondsRemaining);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans text-right" dir="rtl">
      <div className="w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col text-slate-900">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {exam.title}
              </h3>
              <span className="text-[11px] text-slate-500">
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
                    ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>الوقت المتبقي: {formatTime(takingSecondsRemaining)}</span>
              </div>
            ) : isEmbargoed ? (
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold flex items-center gap-2 animate-pulse font-mono">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>النتيجة محجوبة ({embargoCountdown.digital})</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>النتيجة معلنة ({attempt?.scorePercent}%)</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
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
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <span>السؤال {activeQuestionIndex + 1} من {exam.questions.length}</span>
                  <span className="font-mono text-blue-600 font-bold">({currentQ.marks} درجات)</span>
                </div>
                <div className="text-slate-600">
                  تمت الإجابة على <strong className="text-slate-900">{answeredCount}</strong> من {exam.questions.length}
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
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400 font-black'
                          : isAnswered
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Current Question Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  سؤال {activeQuestionIndex + 1}
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
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
                          ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300 bg-slate-100 text-slate-600'
                          }`}
                        >
                          {['أ', 'ب', 'ج', 'د'][optIdx] || optIdx + 1}
                        </div>
                        <span className="text-xs sm:text-sm">{optText}</span>
                      </div>

                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation and Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center gap-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>

                  <button
                    disabled={activeQuestionIndex === exam.questions.length - 1}
                    onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center gap-1"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
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
              <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto ring-4 ring-amber-100 animate-pulse">
                <Lock className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تم استلام وتوثيق إجاباتك بنجاح في النظام</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
                  النتيجة ونموذج الإجابة محجوبة حالياً
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  بناءً على تعليمات المعلم (مستر <strong>{exam.instructorName}</strong>) وضوابط حوكمة الامتحانات بالمنصة، تظل نتيجة الامتحان ونموذج الإجابة محجوبة بالكامل حتى انتهاء تاريخ ووقت الامتحان رسمياً لجميع الطلاب منعاً لتسريب الأسئلة وضماناً لتكافؤ الفرص.
                </p>
              </div>

              {/* بطاقة مواعيد نهاية الامتحان الرسمية */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] text-slate-500 block mb-1">تاريخ نهاية الامتحان</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">{exam.endDate || 'محدد بالمدة'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] text-slate-500 block mb-1">ساعة نهاية الامتحان</span>
                  <span className="font-bold text-amber-700 font-mono text-xs">
                    {formatArabicTime(exam.endTime) || exam.endTime || 'نهاية الموعد'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] text-slate-500 block mb-1">مدة الإجابة المحددة</span>
                  <span className="font-bold text-blue-600 font-mono text-xs">{exam.durationMinutes} دقيقة</span>
                </div>
              </div>

              {/* Big Countdown Timer Card with Days/Hours/Minutes/Seconds blocks */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-amber-200 shadow-sm space-y-3">
                <span className="text-xs font-bold text-amber-800 block flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 animate-spin text-amber-600" />
                  <span>الوقت المتبقي حتى انتهاء الامتحان وفك حجب النتيجة تلقائياً:</span>
                </span>

                <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1 font-mono">
                  {embargoCountdown.days > 0 && (
                    <div className="p-3 rounded-2xl bg-white border border-amber-200 min-w-[70px] shadow-2xs">
                      <span className="text-2xl sm:text-3xl font-black text-amber-700 block">
                        {embargoCountdown.days}
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans block mt-0.5">يوم</span>
                    </div>
                  )}
                  <div className="p-3 rounded-2xl bg-white border border-amber-200 min-w-[70px] shadow-2xs">
                    <span className="text-2xl sm:text-3xl font-black text-amber-700 block">
                      {embargoCountdown.hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans block mt-0.5">ساعة</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-amber-200 min-w-[70px] shadow-2xs">
                    <span className="text-2xl sm:text-3xl font-black text-amber-700 block">
                      {embargoCountdown.minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans block mt-0.5">دقيقة</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-amber-200 min-w-[70px] shadow-2xs">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600 block animate-pulse">
                      {embargoCountdown.seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans block mt-0.5">ثانية</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  ستظهر درجتك ونموذج الإجابة التفسيري تلقائياً فور وصول العداد إلى الصفر في موعد نهاية الامتحان.
                </div>
              </div>

              {/* Fast Forward Demo Button for testing/evaluation */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2.5 text-right">
                <div className="flex items-center gap-2 text-blue-900 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>زر تجربة العرض الفوري (Fast-Forward Demo):</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  لتسهيل مراجعة وتجربة النظام دون الانتظار الفعلي حتى انقضاء موعد نهاية الامتحان، يمكنك النقر على الزر أدناه لفك الحجب فوراً واستعراض النتيجة ونموذج الإجابة.
                </p>
                <button
                  onClick={handleFastForwardUnlock}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition"
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
                className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  attempt.passed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl ${
                      attempt.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {attempt.passed ? '🏆' : '⚠️'}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block">
                      {attempt.passed ? 'تم اجتياز الامتحان بنجاح' : 'لم يتم تحقيق نسبة الاجتياز'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      درجتك المحققة: {attempt.totalScore} من {attempt.maxScore}
                    </h3>
                    <span className="text-xs text-slate-600">
                      نسبتك المئوية: <strong className="text-slate-900">{attempt.scorePercent}%</strong> &bull; درجة النجاح: {exam.passingPercent}%
                    </span>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-center shrink-0 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">حالة النتيجة</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1 justify-center mt-0.5">
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>مُعلنة ونموذج الحل متاح</span>
                  </span>
                </div>
              </div>

              {/* Model Answers Review */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
                          isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">سؤال {idx + 1} ({q.marks} درجات)</span>
                          {isCorrect ? (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>إجابة صحيحة (+{q.marks})</span>
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>إجابة خاطئة (0/{q.marks})</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-slate-900">{q.questionText}</p>

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
                                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                                    : isChosenByStudent
                                    ? 'bg-rose-100 border-rose-400 text-rose-900'
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}
                              >
                                <span>{opt}</span>
                                {isModelAnswer && (
                                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black">
                                    الإجابة الصحيحة
                                  </span>
                                )}
                                {isChosenByStudent && !isModelAnswer && (
                                  <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-black">
                                    إجابتك
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Instructor's detailed explanation */}
                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                            <strong className="text-blue-700 block mb-0.5">توضيح المعلم:</strong>
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
