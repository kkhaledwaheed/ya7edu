'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import { Course } from '@/lib/types';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminCourseGovernancePage() {
  const { courses, updateCourseStatus } = useLMS();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // نافذة الرفض وإرسال الملاحظات
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCourseForReject, setSelectedCourseForReject] = useState<Course | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');

  // نافذة فحص محتوى المنهج
  const [inspectCourse, setInspectCourse] = useState<Course | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;

    return true;
  });

  const handleApprove = (course: Course) => {
    updateCourseStatus(course.id, 'APPROVED');
    setNotification(`تم اعتماد منهج "${course.title}" ونشره رسمياً للطلاب!`);
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleOpenRejectModal = (course: Course) => {
    setSelectedCourseForReject(course);
    setRejectionFeedback('يرجى تحسين جودة الصوت في تسجيل الباب الأول وإرفاق أسئلة الاختبار التراكمي قبل إعادة الإرسال.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForReject) return;
    updateCourseStatus(selectedCourseForReject.id, 'REJECTED', rejectionFeedback);
    setRejectModalOpen(false);
    setNotification(`تم رفض منهج "${selectedCourseForReject.title}" وإرسال الملاحظات للمعلم.`);
  };

  const statusNameArabic: Record<string, string> = {
    APPROVED: 'معتمد ونشط',
    PENDING_REVIEW: 'بانتظار المراجعة',
    REJECTED: 'مرفوض للتعديل',
    DRAFT: 'مسودة'
  };

  return (
    <div className="space-y-8 font-sans">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>حوكمة وجودة المناهج والمذكرات</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مراجعة المناهج والرقابة الأكاديمية
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            مراجعة المناهج المرفوعة من المعلمين، فحص جودة الفيديوهات والمذكرات، واعتماد النشر للطلاب.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            إغلاق
          </button>
        </div>
      )}

      {/* شريط البحث والتصفية */}
      <div className="p-5 rounded-2xl glass-card border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث باسم المنهج أو المعلم أو المادة..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Filter className="w-3.5 h-3.5" />
          <span>تصفية الحالة:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="PENDING_REVIEW">بانتظار المراجعة</option>
            <option value="APPROVED">معتمد ونشط</option>
            <option value="REJECTED">مرفوض للتعديل</option>
            <option value="DRAFT">مسودة</option>
          </select>
        </div>
      </div>

      {/* قائمة المناهج المعروضة للرقابة */}
      <div className="space-y-4">
        {filteredCourses.map(course => {
          const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

          return (
            <div
              key={course.id}
              className="p-5 sm:p-6 rounded-3xl glass-card border border-gray-800 hover:border-gray-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-2xl overflow-hidden shrink-0 ring-1 ring-gray-700">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {course.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        course.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : course.status === 'PENDING_REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : course.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-gray-700/20 text-gray-400 border border-gray-700/30'
                      }`}
                    >
                      {statusNameArabic[course.status] || course.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-gray-400">
                    المعلم: <strong className="text-gray-200">{course.instructorName}</strong> &bull; {course.sections.length} أبواب &bull; {totalLessons} محاضرة &bull; {course.price} جنيه
                  </p>

                  {course.rejectionReason && (
                    <p className="text-xs text-rose-300 mt-1">
                      <strong>ملاحظات الرفض:</strong> {course.rejectionReason}
                    </p>
                  )}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setInspectCourse(course)}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>فحص المنهج</span>
                </button>

                {course.status === 'PENDING_REVIEW' && (
                  <>
                    <button
                      onClick={() => handleApprove(course)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>اعتماد</span>
                    </button>
                    <button
                      onClick={() => handleOpenRejectModal(course)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>رفض وملاحظات</span>
                    </button>
                  </>
                )}

                {course.status === 'APPROVED' && (
                  <Link
                    href={`/student/player`}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold"
                  >
                    عرض في مشغل الطالب
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة فحص وتدقيق محتوى المنهج */}
      {inspectCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-right">
          <div className="w-full max-w-2xl rounded-3xl glass-card border border-cyan-500/40 p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setInspectCourse(null)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white pl-8">{inspectCourse.title}</h3>
            <p className="text-xs text-gray-400 mt-1">
              إعداد المعلم {inspectCourse.instructorName} &bull; المادة: {inspectCourse.category}
            </p>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pl-2">
              <div className="text-xs text-gray-300 leading-relaxed bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
                <strong>وصف المنهج والمخرجات:</strong> {inspectCourse.description}
              </div>

              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                هيكل الأبواب والمحاضرات ({inspectCourse.sections.length} أبواب)
              </h4>

              <div className="space-y-3">
                {inspectCourse.sections.map((sec, idx) => (
                  <div key={sec.id} className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
                    <div className="text-xs font-bold text-white">
                      الباب {idx + 1}: {sec.title}
                    </div>
                    <div className="space-y-1.5 pr-3">
                      {sec.lessons.map((les, lIdx) => (
                        <div key={les.id} className="text-xs text-gray-300 flex items-center justify-between">
                          <span>{idx + 1}.{lIdx + 1} {les.title}</span>
                          <span className="text-[11px] font-mono text-gray-400">{les.durationMinutes} دقيقة</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-800 flex justify-end gap-2">
              {inspectCourse.status === 'PENDING_REVIEW' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(inspectCourse);
                      setInspectCourse(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    اعتماد المنهج
                  </button>
                  <button
                    onClick={() => {
                      setInspectCourse(null);
                      handleOpenRejectModal(inspectCourse);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    إرسال ملاحظات للتعديل
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* نافذة إدخال ملاحظات الرفض */}
      {rejectModalOpen && selectedCourseForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-right">
          <div className="w-full max-w-md rounded-3xl glass-card border border-rose-500/40 p-6 shadow-2xl relative">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">طلب تعديلات على المنهج</h3>
            <p className="text-xs text-gray-400 mb-4">
              اكتب ملاحظات دقيقة للأستاذ {selectedCourseForReject.instructorName} لمساعدته في استكمال متطلبات النشر.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">الملاحظات الأكاديمية والفنية</label>
                <textarea
                  rows={4}
                  value={rejectionFeedback}
                  onChange={e => setRejectionFeedback(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-gray-200 focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
                >
                  تأكيد الرفض وإرسال الملاحظات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
