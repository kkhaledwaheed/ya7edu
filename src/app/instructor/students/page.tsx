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
    <div className="space-y-8 font-sans text-right pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>متابعة وتقييم أداء الطلاب</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            سجل الطلاب ونسب إنجاز الحصص
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            متابعة معدلات حضور ومشاهدة محاضرات مادتك، نتائج الامتحانات التراكمية، ومؤشرات التفوق.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الطالب أو المنهج..."
            className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* جدول قائمة الطلاب */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">الطالب</th>
                <th className="py-3.5 px-4">المنهج / المادة</th>
                <th className="py-3.5 px-4">نسبة الإنجاز</th>
                <th className="py-3.5 px-4">الحصص المكتملة</th>
                <th className="py-3.5 px-4">تاريخ الاشتراك</th>
                <th className="py-3.5 px-4 text-left">الحالة الأكاديمية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(({ enrollment, student, course }) => {
                const isComplete = enrollment.progressPercent === 100;
                return (
                  <tr key={enrollment.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{student.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {course?.title || 'منهج الفيزياء'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isComplete ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${enrollment.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-600 text-[11px]">
                          {enrollment.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {enrollment.completedLessonIds.length} حصص
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(enrollment.enrolledAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isComplete
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {isComplete ? <Award className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-blue-600" />}
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
