'use client';

import React from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import { BookOpen, PlusCircle, Edit3, Eye, Star, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function InstructorCoursesPage() {
  const { currentUser, courses } = useLMS();

  // مناهج المعلم الحالي
  const myCourses = courses.filter(
    c => c.instructorId === currentUser.id || c.instructorName.includes(currentUser.name.split(' ')[0])
  );

  const statusArabic: Record<string, { label: string; color: string }> = {
    APPROVED: { label: 'معتمد ونشط', color: 'bg-emerald-500/90 text-white' },
    PENDING_REVIEW: { label: 'بانتظار المراجعة', color: 'bg-amber-500/90 text-white' },
    REJECTED: { label: 'مرفوض للتعديل', color: 'bg-rose-500/90 text-white' },
    DRAFT: { label: 'مسودة', color: 'bg-gray-700/90 text-gray-200' },
  };

  return (
    <div className="space-y-8 font-sans text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>إدارة المناهج والأبواب التعليمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مناهجي ومحاضراتي المنشورة
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            إدارة المناهج الدراسية، متابعة حالة الاعتماد الرقابي، وتعديل الفصول والمذكرات التابعة.
          </p>
        </div>

        <Link
          href="/instructor/studio"
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>استوديو رفع الأبواب والمذكرات</span>
        </Link>
      </div>

      {/* شبكة المناهج */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map(course => {
          const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
          const statusInfo = statusArabic[course.status] || { label: course.status, color: 'bg-gray-700 text-white' };

          return (
            <div
              key={course.id}
              className="rounded-3xl glass-card border border-gray-800 hover:border-cyan-500/50 p-5 flex flex-col justify-between transition-all duration-200 group text-right"
            >
              <div>
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-cyan-400 font-semibold">{course.category}</span>
                  <span className="font-mono font-bold text-white">
                    {course.price * 25} ج.م / شهر
                  </span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition">
                  {course.title}
                </h3>

                {course.rejectionReason && (
                  <div className="mt-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>ملاحظات الرقابة: {course.rejectionReason}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-gray-800 text-xs">
                <div className="flex items-center justify-between text-gray-400 mb-3">
                  <span>{course.sections.length} أبواب &bull; {totalLessons} حصص</span>
                  <span className="font-bold text-gray-200">{course.totalStudents} طالب مسجل</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/instructor/studio"
                    className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-center transition flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل المحتوى</span>
                  </Link>

                  <Link
                    href={`/student/player?instructorId=${course.instructorId}&subjectId=subj_g3_phys`}
                    className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                    title="معاينة كطالب"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
