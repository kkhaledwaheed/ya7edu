'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import { Users, GraduationCap, CheckCircle2, Clock, Search, Award } from 'lucide-react';

export default function InstructorStudentsPage() {
  const { users, enrollments, courses, currentUser } = useLMS();
  const [searchQuery, setSearchQuery] = useState('');

  // إيجاد طلاب المعلم
  const myCourses = courses.filter(
    c => c.instructorId === currentUser.id || c.instructorName.includes(currentUser.name.split(' ')[0])
  );
  const myCourseIds = myCourses.map(c => c.id);

  const relevantEnrollments = enrollments.filter(e => myCourseIds.includes(e.courseId));

  const studentRows = relevantEnrollments.map(enr => {
    const student = users.find(u => u.id === enr.userId) || {
      id: enr.userId,
      name: 'طالب مسجل',
      email: 'student@ya7edu.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    const course = courses.find(c => c.id === enr.courseId);
    return {
      enrollment: enr,
      student,
      course
    };
  });

  const filtered = studentRows.filter(
    r =>
      r.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.course?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>متابعة وتقييم أداء الطلاب</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            سجل الطلاب ونسب إنجاز الحصص
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            متابعة معدلات حضور ومشاهدة محاضرات مادتك، نتائج الامتحانات التراكمية، ومؤشرات التفوق.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الطالب أو المنهج..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* جدول قائمة الطلاب */}
      <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">الطالب</th>
                <th className="py-3.5 px-4">المنهج / المادة</th>
                <th className="py-3.5 px-4">نسبة الإنجاز</th>
                <th className="py-3.5 px-4">الحصص المكتملة</th>
                <th className="py-3.5 px-4">تاريخ الاشتراك</th>
                <th className="py-3.5 px-4 text-left">الحالة الأكاديمية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filtered.map(({ enrollment, student, course }) => {
                const isComplete = enrollment.progressPercent === 100;
                return (
                  <tr key={enrollment.id} className="hover:bg-gray-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-700"
                        />
                        <div>
                          <div className="font-semibold text-white">{student.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-200 max-w-xs truncate">
                      {course?.title || 'منهج الفيزياء'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isComplete ? 'bg-emerald-400' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${enrollment.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-gray-300 text-[11px]">
                          {enrollment.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-300">
                      {enrollment.completedLessonIds.length} حصص
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(enrollment.enrolledAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isComplete
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {isComplete ? <Award className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isComplete ? 'مكتمل ومؤهل للشهادة' : 'متابع ونشط'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
