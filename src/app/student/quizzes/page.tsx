'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Lock,
  Unlock,
  Play,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { ExamRunnerModal } from '@/components/exam/exam-runner-modal';
import { InstructorExam } from '@/lib/types';

export default function StudentQuizzesPage() {
  const { currentUser, instructorExams, studentExamAttempts } = useLMS();
  const [selectedExamForRunner, setSelectedExamForRunner] = useState<InstructorExam | null>(null);

  // Student's attempts for current grade
  const myAttempts = studentExamAttempts.filter(a => a.studentId === currentUser.id);
  const completedAttempts = myAttempts.filter(a => a.isUnlocked);
  const embargoedAttempts = myAttempts.filter(a => a.submittedAt && !a.isUnlocked);

  const averageScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce((acc, a) => acc + a.scorePercent, 0) / completedAttempts.length
        )
      : null;

  return (
    <div className="space-y-8 font-sans pb-16 text-right" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            <span>بوابة الطالب &bull; الامتحانات والاختبارات المعتمدة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            امتحانات معلميك الدورية والتقييمات
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            أدّ امتحانات معلميك الدورية في مواد مرحلتك الدراسية، مع التطبيق الصارم لقاعدة حجب النتيجة حتى انتهاء وقت الامتحان لمنع تسريب الأسئلة وضمان النزاهة.
          </p>
        </div>

        {averageScore !== null && (
          <div className="px-5 py-3 rounded-2xl bg-white border border-blue-200 flex items-center gap-3.5 shrink-0 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-blue-600 leading-tight">{averageScore}%</div>
              <div className="text-[11px] text-slate-500">متوسط درجاتك المحققة</div>
            </div>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900">{instructorExams.length}</div>
            <div className="text-xs text-slate-500">امتحانات متاحة لمرحلتك</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900">{completedAttempts.length}</div>
            <div className="text-xs text-slate-500">امتحانات مكتملة ومصححة</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 flex items-center gap-4 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-amber-600 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-amber-700">{embargoedAttempts.length}</div>
            <div className="text-xs text-slate-500">امتحانات قيد حجب النتيجة مؤقتاً</div>
          </div>
        </div>
      </div>

      {/* Embargo Rule Banner */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 ring-2 ring-amber-200">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <span>حوكمة الامتحانات: قاعدة حجب النتيجة حتى انتهاء تاريخ ووقت الامتحان</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
              مفعل لجميع الامتحانات
            </span>
          </h4>
          <p className="text-slate-600 mt-1 leading-relaxed">
            عند أدائك للامتحان وتسليمه، يتم حفظ إجاباتك وتظل درجتك ونموذج الإجابة محجوبة بالكامل بعداد رقمي حتى انتهاء تاريخ وساعة نهاية الامتحان رسمياً لجميع الطلاب، حفاظاً على تكافؤ الفرص ومنع تسريب الأسئلة.
          </p>
        </div>
      </div>

      {/* Available Exams Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>امتحانات المنهج المتاحة ({instructorExams.length})</span>
          </h2>
          <span className="text-xs text-slate-500">معتمدة ومحدثة دورياً</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {instructorExams.map(ex => {
            const studentAttempt = studentExamAttempts.find(
              a => a.examId === ex.id && a.studentId === currentUser.id
            );
            const isSubmitted = Boolean(studentAttempt?.submittedAt);
            const isUnlocked = Boolean(studentAttempt?.isUnlocked);
            const isEmbargoed = isSubmitted && !isUnlocked;

            return (
              <div
                key={ex.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {ex.subjectName}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{ex.durationMinutes} دقيقة</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                      {ex.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {ex.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    <div>المعلم: <strong className="text-slate-900">{ex.instructorName}</strong></div>
                    <div>الدرجة: <strong className="text-blue-600 font-bold">{ex.totalMarks} درجة</strong></div>
                  </div>

                  {(ex.startDate || ex.endDate) && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>يبدأ الامتحان:</span>
                        <span className="text-slate-800">{ex.startDate} ({ex.startTime || '00:00'})</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-amber-700 font-bold">ينتهي الامتحان:</span>
                        <span className="text-amber-800 font-bold">{ex.endDate} ({ex.endTime || '23:59'})</span>
                      </div>
                    </div>
                  )}

                  {isEmbargoed && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <Lock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>تم التسليم • النتيجة محجوبة</span>
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight">
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
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Award className="w-4 h-4" />
                      <span>النتيجة والحل النموذجي ({studentAttempt?.scorePercent}%)</span>
                    </button>
                  ) : isEmbargoed ? (
                    <button
                      type="button"
                      onClick={() => setSelectedExamForRunner(ex)}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm animate-pulse transition"
                    >
                      <Clock className="w-4 h-4" />
                      <span>متابعة عداد فك الحجب (محجوب) ⏱️</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedExamForRunner(ex)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition hover:scale-[1.01]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>بدء الامتحان الآن</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Exams History */}
      {completedAttempts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>سجل نتائجك المعتمدة ({completedAttempts.length})</span>
          </h2>

          <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">الامتحان</th>
                    <th className="py-3.5 px-5">الدرجة المحققة</th>
                    <th className="py-3.5 px-5">النسبة المئوية</th>
                    <th className="py-3.5 px-5">الحالة</th>
                    <th className="py-3.5 px-5 text-left">نموذج الإجابة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {completedAttempts.map(att => {
                    const matchedExam = instructorExams.find(e => e.id === att.examId);
                    if (!matchedExam) return null;

                    return (
                      <tr key={att.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          {matchedExam.title}
                          <span className="text-[11px] text-slate-500 block font-normal">
                            مستر {matchedExam.instructorName} &bull; {matchedExam.subjectName}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono font-bold text-blue-600">
                          {att.totalScore} / {att.maxScore}
                        </td>
                        <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                          {att.scorePercent}%
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            اجتياز بنجاح 🏆
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-left">
                          <button
                            type="button"
                            onClick={() => setSelectedExamForRunner(matchedExam)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold text-xs transition border border-slate-200"
                          >
                            عرض الإجابات والتفسير
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Exam Runner Modal */}
      {selectedExamForRunner && (
        <ExamRunnerModal
          exam={selectedExamForRunner}
          isOpen={!!selectedExamForRunner}
          onClose={() => setSelectedExamForRunner(null)}
        />
      )}
    </div>
  );
}
