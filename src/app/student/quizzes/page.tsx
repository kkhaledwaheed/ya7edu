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
    <div className="space-y-8 font-sans pb-16">
      {/* ترويسة الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>بوابة الطالب &bull; الامتحانات والاختبارات المعتمدة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            امتحانات معلميك الدورية والتقييمات
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            أدّ امتحانات معلميك الدورية المعتمدة في مواد مرحلتك الدراسية، مع تطبيق قاعدة حجب النتيجة حتى انتهاء وقت الامتحان لمنع تسريب الأسئلة.
          </p>
        </div>

        {averageScore !== null && (
          <div className="px-5 py-3 rounded-2xl glass-card border border-cyan-500/30 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black font-mono text-white leading-tight">{averageScore}%</div>
              <div className="text-[11px] text-gray-400">متوسط درجاتك المحققة</div>
            </div>
          </div>
        )}
      </div>

      {/* شريط الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-indigo-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{instructorExams.length}</div>
            <div className="text-xs text-gray-400">امتحانات متاحة لمرحلتك</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{completedAttempts.length}</div>
            <div className="text-xs text-gray-400">امتحانات مكتملة ومصححة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-amber-400">{embargoedAttempts.length}</div>
            <div className="text-xs text-gray-400">امتحانات قيد حجب النتيجة مؤقتاً</div>
          </div>
        </div>
      </div>

      {/* قاعدة حجب النتيجة التوضيحية */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-indigo-950/30 border border-amber-500/30 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-white flex items-center gap-2">
            <span>حوكمة الامتحانات: قاعدة حجب النتيجة حتى انتهاء تاريخ ووقت الامتحان</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              مفعل لجميع الامتحانات
            </span>
          </h4>
          <p className="text-gray-300 mt-0.5 leading-relaxed">
            عند أدائك للامتحان وتسليمه، يتم حفظ إجاباتك وتظل درجتك ونموذج الإجابة محجوبة بالكامل حتى انتهاء تاريخ وساعة نهاية الامتحان رسمياً لجميع الطلاب، حفاظاً على تكافؤ الفرص ومنع تسريب الأسئلة.
          </p>
        </div>
      </div>

      {/* قسم الامتحانات التقييمية الدورية لمعلميك */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>امتحانات المنهج المتاحة ({instructorExams.length})</span>
          </h2>
          <span className="text-xs text-gray-400">معتمدة ومحدثة دورياً</span>
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
                className="p-5 rounded-3xl glass-card border border-gray-800 hover:border-indigo-500/50 flex flex-col justify-between transition-all duration-300 shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      {ex.subjectName}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ex.durationMinutes} دقيقة</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                      {ex.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                      {ex.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80 text-[11px] text-gray-300">
                    <div>المعلم: <strong className="text-white">{ex.instructorName}</strong></div>
                    <div>الدرجة: <strong className="text-cyan-400">{ex.totalMarks} درجة</strong></div>
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
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Award className="w-4 h-4" />
                      <span>النتيجة والحل النموذجي ({studentAttempt?.scorePercent}%)</span>
                    </button>
                  ) : isEmbargoed ? (
                    <button
                      onClick={() => setSelectedExamForRunner(ex)}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md animate-pulse transition"
                    >
                      <Clock className="w-4 h-4" />
                      <span>متابعة عداد فك الحجب (محجوب) ⏱️</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedExamForRunner(ex)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition"
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


      {/* سجل الامتحانات التي تم تسليمها */}
      {completedAttempts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>سجل نتائجك المعتمدة ({completedAttempts.length})</span>
          </h2>

          <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-900/80 text-gray-400 font-bold uppercase text-[11px] border-b border-gray-800">
                  <tr>
                    <th className="py-3.5 px-5">الامتحان</th>
                    <th className="py-3.5 px-5">الدرجة المحققة</th>
                    <th className="py-3.5 px-5">النسبة المئوية</th>
                    <th className="py-3.5 px-5">الحالة</th>
                    <th className="py-3.5 px-5 text-left">نموذج الإجابة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  {completedAttempts.map(att => {
                    const matchedExam = instructorExams.find(e => e.id === att.examId);
                    if (!matchedExam) return null;

                    return (
                      <tr key={att.id} className="hover:bg-gray-800/30 transition">
                        <td className="py-3.5 px-5 font-bold text-white">
                          {matchedExam.title}
                          <span className="text-[11px] text-gray-500 block font-normal">
                            مستر {matchedExam.instructorName} &bull; {matchedExam.subjectName}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono font-bold text-cyan-300">
                          {att.totalScore} / {att.maxScore}
                        </td>
                        <td className="py-3.5 px-5 font-mono font-bold text-white">
                          {att.scorePercent}%
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            اجتياز بنجاح 🏆
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-left">
                          <button
                            onClick={() => setSelectedExamForRunner(matchedExam)}
                            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 font-bold text-xs transition"
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

      {/* نافذة أداء وتصحيح الامتحان الدوري */}
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
