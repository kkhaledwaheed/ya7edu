'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import { BookOpen, Search, Star, Play, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-8 font-sans pb-16 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>المناهج والاشتراكات النشطة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            مناهجي والمحاضرات المسجلة
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            استعرض مكتبتك الدراسية الكاملة، تابع مشاهدة المحاضرات، واستكمل المذكرات والتدريبات التفاعلية.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث في مناهجي الدراسية..."
            className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-2xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterTab === 'all'
              ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          جميع المناهج ({enrolledOnly.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterTab === 'in_progress'
              ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          قيد المتابعة ({enrolledOnly.filter(i => (i.enrollment?.progressPercent || 0) < 100).length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filterTab === 'completed'
              ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          المكتملة ({enrolledOnly.filter(i => (i.enrollment?.progressPercent || 0) === 100).length})
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ course, enrollment }) => {
          const isCompleted = enrollment?.progressPercent === 100;
          return (
            <div
              key={course.id}
              className="rounded-3xl bg-white border border-slate-200 hover:border-blue-400 p-5 flex flex-col justify-between transition-all duration-300 group text-right shadow-2xs hover:shadow-md"
            >
              <div>
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-blue-700 border border-slate-200 shadow-2xs">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-blue-600 font-bold">{course.category}</span>
                  <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{course.averageRating}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">المعلم: {course.instructorName}</p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
                  <span>نسبة الإنجاز</span>
                  <span className="font-bold text-slate-900 font-mono">{enrollment?.progressPercent || 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-3.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}
                    style={{ width: `${enrollment?.progressPercent || 0}%` }}
                  />
                </div>

                <Link
                  href={`/student/player?instructorId=${course.instructorId}&subjectId=subj_g3_phys`}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99] shadow-sm"
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
