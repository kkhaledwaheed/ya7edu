'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import {
  FileCheck2,
  Plus,
  Clock,
  Award,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Edit,
  Eye,
  Sparkles,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Search,
  BookOpen,
  Calendar
} from 'lucide-react';
import { InstructorExam, InstructorExamQuestion } from '@/lib/types';

export default function InstructorExamsPage() {
  const {
    currentUser,
    instructorExams,
    studentExamAttempts,
    createInstructorExam,
    updateInstructorExam,
    deleteInstructorExam,
    unlockExamAttempt,
    gradeSubjects
  } = useLMS();

  // Filter exams for current instructor (or show all if admin/demo)
  const currentInstructorId = currentUser.role === 'INSTRUCTOR' ? currentUser.id : 'inst_ahmed_samy';
  const myExams = instructorExams.filter(
    ex => ex.instructorId === currentInstructorId || currentUser.role === 'ADMIN'
  );

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewSubmissionsExamId, setViewSubmissionsExamId] = useState<string | null>(null);

  // New Exam Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(gradeSubjects[0]?.id || 'subj_g3_phys');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [startDate, setStartDate] = useState('2026-10-21');
  const [startTime, setStartTime] = useState('18:00');
  const [endDate, setEndDate] = useState('2026-10-22');
  const [endTime, setEndTime] = useState('22:00');
  const [passingPercent, setPassingPercent] = useState(60);
  const [hideResultUntilDurationEnds, setHideResultUntilDurationEnds] = useState(true);

  // Dynamic Questions in Form
  const [questions, setQuestions] = useState<Omit<InstructorExamQuestion, 'id'>[]>([
    {
      questionText: 'السؤال الأول: ...',
      options: ['الخيار الأول (أ)', 'الخيار الثاني (ب)', 'الخيار الثالث (ج)', 'الخيار الرابع (د)'],
      correctOptionIndex: 0,
      explanation: 'شرح الحل النموذجي والخطوات بالتفصيل.',
      marks: 5
    }
  ]);

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        questionText: `السؤال ${prev.length + 1}: `,
        options: ['الخيار الأول (أ)', 'الخيار الثاني (ب)', 'الخيار الثالث (ج)', 'الخيار الرابع (د)'],
        correctOptionIndex: 0,
        explanation: 'تفسير الإجابة الصحيحة.',
        marks: 5
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setQuestions(prev =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOpts = [...q.options];
        newOpts[optIndex] = text;
        return { ...q, options: newOpts };
      })
    );
  };

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('يرجى إدخال عنوان الامتحان');

    const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 5), 0);
    const chosenSubject = gradeSubjects.find(s => s.id === subjectId) || gradeSubjects[0];

    createInstructorExam({
      instructorId: currentInstructorId,
      instructorName: currentUser.name,
      instructorAvatar: currentUser.avatar,
      subjectId: chosenSubject.id,
      subjectName: chosenSubject.nameAr,
      gradeId: chosenSubject.gradeId,
      title,
      description,
      durationMinutes: Number(durationMinutes) || 60,
      startDate,
      startTime,
      endDate,
      endTime,
      passingPercent: Number(passingPercent) || 60,
      totalMarks,
      isPublished: true,
      hideResultUntilDurationEnds,
      questions: questions.map((q, idx) => ({
        ...q,
        id: `q_${Date.now()}_${idx}`
      }))
    });

    setModalOpen(false);
    // Reset
    setTitle('');
    setDescription('');
    setQuestions([
      {
        questionText: 'السؤال الأول: ...',
        options: ['الخيار الأول (أ)', 'الخيار الثاني (ب)', 'الخيار الثالث (ج)', 'الخيار الرابع (د)'],
        correctOptionIndex: 0,
        explanation: 'شرح الحل النموذجي والخطوات بالتفصيل.',
        marks: 5
      }
    ]);
  };

  // Filtered exams
  const filteredExams = myExams.filter(ex =>
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submissions for modal
  const activeSubmissionsExam = instructorExams.find(e => e.id === viewSubmissionsExamId);
  const examSubmissions = studentExamAttempts.filter(a => a.examId === viewSubmissionsExamId);

  // Stats
  const totalSubmissionsCount = studentExamAttempts.length;
  const lockedResultsCount = studentExamAttempts.filter(a => !a.isUnlocked).length;

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>بوابة المعلم &bull; قسم الامتحانات التقييمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            إدارة الامتحانات والاختبارات التقييمية
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            أنشئ امتحاناتك الدورية، حدد مدة الاختبار، مع تفعيل خاصية <strong>حجب النتيجة حتى انتهاء وقت الامتحان الكلي</strong> منعاً لتسريب الإجابات بين الطلاب.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء امتحان جديد</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-card border border-indigo-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">{myExams.length}</div>
            <div className="text-xs text-gray-400">إجمالي الامتحانات المنشورة</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-cyan-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">{totalSubmissionsCount}</div>
            <div className="text-xs text-gray-400">إجمالي تسليمات الطلاب</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-amber-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400">{lockedResultsCount}</div>
            <div className="text-xs text-gray-400">تسليمات قيد حجب النتيجة (نشطة)</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-emerald-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-300">أمان وحوكمة النزاهة</div>
            <div className="text-[11px] text-gray-400">منع تسريب الأسئلة مفعل</div>
          </div>
        </div>
      </div>

      {/* Security Rule Explanation Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-indigo-950/30 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>نظام حجب النتيجة حتى انتهاء وقت الامتحان (Exam Duration Embargo)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                ميزة أمنية مخصصة
              </span>
            </h3>
            <p className="text-xs text-gray-300 mt-0.5 max-w-3xl">
              عندما يؤدي الطالب الامتحان ويسلّم إجاباته مبكراً، يتم حفظ إجاباته وحساب درجته في النظام، ولكن <strong>تظل نتيجته ونموذج الإجابة محجوبة بشاشة عد تنازلي حي</strong> حتى تنتهي مدة الامتحان الكلية لجميع الطلاب، مما يمنع الطالب السريع من تصوير أو تسريب نموذج الحل لزملائه.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث باسم الامتحان أو المادة..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-gray-900/80 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <span className="text-xs text-gray-400">{filteredExams.length} امتحانات مسجلة</span>
        </div>

        {/* Exams Table */}
        <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-900/80 border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">عنوان الامتحان</th>
                  <th className="py-4 px-6">المادة والمرحلة</th>
                  <th className="py-4 px-6">المواعيد والمدة</th>
                  <th className="py-4 px-6">الأسئلة والدرجة</th>
                  <th className="py-4 px-6">قاعدة حجب النتيجة</th>
                  <th className="py-4 px-6">تسليمات الطلاب</th>
                  <th className="py-4 px-6 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredExams.map(exam => {
                  const subs = studentExamAttempts.filter(a => a.examId === exam.id);
                  const lockedSubs = subs.filter(a => !a.isUnlocked);

                  return (
                    <tr key={exam.id} className="hover:bg-gray-800/40 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-sm">{exam.title}</div>
                        <div className="text-[11px] text-gray-400 line-clamp-1">{exam.description}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px]">
                          {exam.subjectName}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>مدة الإجابة: {exam.durationMinutes} دقيقة</span>
                          </div>
                          {(exam.startDate || exam.endDate) && (
                            <div className="text-[10px] text-gray-400 font-mono space-y-0.5">
                              <div>من: {exam.startDate} ({exam.startTime || '00:00'})</div>
                              <div>إلى: {exam.endDate} ({exam.endTime || '23:59'})</div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        <div>{exam.questions.length} أسئلة</div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {exam.totalMarks} درجة (اجتياز {exam.passingPercent}%)
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {exam.hideResultUntilDurationEnds ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px] flex items-center gap-1 w-fit">
                            <Lock className="w-3 h-3" />
                            <span>حجب حتى انتهاء تاريخ ووقت الامتحان</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 text-[10px] flex items-center gap-1 w-fit">
                            <Unlock className="w-3 h-3" />
                            <span>إعلان فوري</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setViewSubmissionsExamId(exam.id)}
                          className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{subs.length} تسليم</span>
                          {lockedSubs.length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => deleteInstructorExam(exam.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                            title="حذف الامتحان"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE NEW EXAM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">إنشاء امتحان جديد للمنهج</h3>
                  <p className="text-xs text-gray-400">حدد أسئلة الامتحان والوقت وقواعد حجب النتيجة</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExamSubmit} className="space-y-6">
              {/* Row 1: Title and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">عنوان الامتحان</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: امتحان الباب الأول - قانون أوم وكيرشوف"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">المادة المخصصة</label>
                  <select
                    value={subjectId}
                    onChange={e => setSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {gradeSubjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nameAr} ({s.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* جدول ومواعيد الامتحان: تاريخ وساعة البداية والنهاية ومدة الإجابة */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>جدول مواعيد الامتحان ومواعيد الإتاحة للطلاب</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold block text-[11px]">
                      تاريخ وساعة بداية الامتحان (Start) *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="time"
                        required
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500 text-center font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold block text-[11px]">
                      تاريخ وساعة نهاية الامتحان (End) *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="time"
                        required
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500 text-center font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-gray-300 font-semibold block text-[11px]">
                      مدة الامتحان بالدقائق لكل طالب (Duration) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="300"
                        required
                        value={durationMinutes}
                        onChange={e => setDurationMinutes(Number(e.target.value))}
                        className="w-full pl-3 pr-10 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                      <Clock className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">
                      الوقت المسموح للطالب للإجابة من لحظة الضغط على بدء الامتحان.
                    </span>
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block text-[11px]">
                      نسبة النجاح والاجتياز (%)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      required
                      value={passingPercent}
                      onChange={e => setPassingPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">وصف الامتحان وتعليمات الحل</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="تعليمات للطالب، وموضوعات الامتحان..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* KEY FEATURE: Embargo toggle */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="embargoToggle"
                  checked={hideResultUntilDurationEnds}
                  onChange={e => setHideResultUntilDurationEnds(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-0 bg-gray-900 border-gray-700"
                />
                <label htmlFor="embargoToggle" className="cursor-pointer">
                  <span className="text-xs font-bold text-amber-300 block">
                    حجب النتيجة ونموذج الإجابة حتى انتهاء تاريخ ووقت الامتحان (مُوصى به)
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    تظل النتيجة ونموذج الإجابة محجوبة عن الطلاب حتى حلول تاريخ وساعة نهاية الامتحان، حتى لو سلّم الطالب إجاباته مبكراً، لمنع تسريب الأسئلة وضمان تكافؤ الفرص.
                  </span>

                </label>
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>أسئلة الامتحان ({questions.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة سؤال</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">سؤال رقم {qIdx + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="text-rose-400 hover:text-rose-300 text-xs"
                          >
                            حذف السؤال
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="نص السؤال..."
                        value={q.questionText}
                        onChange={e => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
                      />

                      {/* 4 Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() => handleQuestionChange(qIdx, 'correctOptionIndex', optIdx)}
                              className="text-emerald-500 focus:ring-0"
                              title="حدد كإجابة صحيحة"
                            />
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                              placeholder={`الخيار ${optIdx + 1}`}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs bg-gray-900 border ${
                                q.correctOptionIndex === optIdx ? 'border-emerald-500 text-emerald-300' : 'border-gray-800 text-gray-300'
                              }`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <input
                        type="text"
                        placeholder="تفسير الحل النموذجي (يظهر للطالب بعد فك الحجب)..."
                        value={q.explanation}
                        onChange={e => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 text-white font-extrabold text-xs shadow-lg"
                >
                  حفظ ونشر الامتحان
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSIONS MODAL */}
      {viewSubmissionsExamId && activeSubmissionsExam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-base font-bold text-white">تسليمات الطلاب: {activeSubmissionsExam.title}</h3>
                <span className="text-xs text-gray-400">
                  المدة الكلية: {activeSubmissionsExam.durationMinutes} دقيقة &bull; إجمالي الأسئلة: {activeSubmissionsExam.questions.length}
                </span>
              </div>
              <button
                onClick={() => setViewSubmissionsExamId(null)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {examSubmissions.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs">
                لم يقم أي طالب بأداء هذا الامتحان حتى الآن.
              </div>
            ) : (
              <div className="space-y-3">
                {examSubmissions.map(sub => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-gray-950 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{sub.studentName}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        الدرجة: <strong className="text-emerald-400">{sub.totalScore}/{sub.maxScore} ({sub.scorePercent}%)</strong> &bull; {sub.passed ? 'ناجح' : 'راسب'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.isUnlocked ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>النتيجة معلنة للطالب</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 animate-pulse">
                            <Lock className="w-3.5 h-3.5" />
                            <span>محجوبة بانتظار انتهاء المدة</span>
                          </span>
                          <button
                            onClick={() => unlockExamAttempt(sub.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold"
                            title="فك الحجب وإظهار النتيجة للطالب الآن"
                          >
                            فك الحجب الآن
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
