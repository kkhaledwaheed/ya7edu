'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import { BookOpen, Search, Star, Play, Sparkles, ArrowRight } from 'lucide-react';

export default function StudentCoursesPage() {
  const { currentUser, courses, enrollments } = useLMS();
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);

  const coursesWithEnrollment = courses.map(c => {
    const enr = userEnrollments.find(e => e.courseId === c.id);
    return {
      course: c,
      enrollment: enr
    };
  });

  const enrolledOnly = coursesWithEnrollment.filter(item => item.enrollment !== undefined);

  const filtered = enrolledOnly.filter(({ course, enrollment }) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTab === 'in_progress') return (enrollment?.progressPercent || 0) < 100;
    if (filterTab === 'completed') return (enrollment?.progressPercent || 0) === 100;
    return true;
  });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>المناهج والاشتراكات النشطة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مناهجي والمحاضرات المسجلة
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            استعرض مكتبتك الدراسية الكاملة، تابع مشاهدة المحاضرات، واستكمل المذكرات التدريبية.
          </p>
        </div>

        {/* البحث */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث في مناهجي الدراسية..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* تبويبات التصفية */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterTab === 'all'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          جميع المناهج ({enrolledOnly.length})
        </button>
        <button
          onClick={() => setFilterTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterTab === 'in_progress'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          قيد المتابعة ({enrolledOnly.filter(i => (i.enrollment?.progressPercent || 0) < 100).length})
        </button>
        <button
          onClick={() => setFilterTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterTab === 'completed'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          المكتملة ({enrolledOnly.filter(i => (i.enrollment?.progressPercent || 0) === 100).length})
        </button>
      </div>

      {/* شبكة المناهج */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ course, enrollment }) => {
          const isCompleted = enrollment?.progressPercent === 100;
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
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-cyan-400 font-semibold">{course.category}</span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.averageRating}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">المعلم: {course.instructorName}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-800">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>نسبة الإنجاز</span>
                  <span className="font-bold text-gray-200">{enrollment?.progressPercent || 0}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-400' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${enrollment?.progressPercent || 0}%` }}
                  />
                </div>

                <Link
                  href={`/student/player?instructorId=${course.instructorId}&subjectId=subj_g3_phys`}
                  className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-cyan-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCompleted ? 'مراجعة المنهج' : 'متابعة المحاضرة'}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
