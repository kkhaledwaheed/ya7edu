'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import {
  Layers,
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRightLeft,
  X,
  Zap,
  FlaskConical,
  Binary,
  Dna,
  Languages,
  Globe,
  Compass,
  Atom,
  Award,
  Palette,
  Search,
  Check
} from 'lucide-react';
import { AcademicGrade, Subject } from '@/lib/types';

// Map icon strings to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Zap,
  FlaskConical,
  Binary,
  Dna,
  Languages,
  Globe,
  Compass,
  Atom,
  Award,
  Layers
};

const availableColors = [
  { name: 'نيلي إمبراطوري', hex: '#6366f1' },
  { name: 'فيروزي سيان', hex: '#06b6d4' },
  { name: 'زمردي مشرق', hex: '#10b981' },
  { name: 'كهرماني ذهبي', hex: '#f59e0b' },
  { name: 'وردي زاهي', hex: '#ec4899' },
  { name: 'بنفسجي ملكي', hex: '#8b5cf6' },
  { name: 'أحمر مرجاني', hex: '#f43f5e' }
];

const availableIcons = [
  { id: 'BookOpen', label: 'كتاب / لغة' },
  { id: 'Zap', label: 'كهرباء / فيزياء' },
  { id: 'FlaskConical', label: 'دورق / كيمياء' },
  { id: 'Binary', label: 'رياضيات / خوارزميات' },
  { id: 'Dna', label: 'أحياء / وراثة' },
  { id: 'Languages', label: 'لغات أجنبية' },
  { id: 'Globe', label: 'جغرافيا / دراسات' },
  { id: 'Atom', label: 'علوم / ذرة' },
  { id: 'Compass', label: 'هندسة وميكانيكا' },
  { id: 'Layers', label: 'مناهج عامة' }
];

export default function AdminGradesPage() {
  const {
    academicGrades,
    allSubjects,
    addGrade,
    updateGrade,
    deleteGrade,
    addSubject,
    updateSubject,
    deleteSubject,
    users
  } = useLMS();

  // Active selected grade for viewing/managing its assigned subjects
  const [selectedGradeId, setSelectedGradeId] = useState<string>(
    academicGrades[0]?.id || 'grade_sec_3'
  );

  // Search filter
  const [subjectSearch, setSubjectSearch] = useState('');

  // Modals state
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<AcademicGrade | null>(null);

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [movingSubject, setMovingSubject] = useState<Subject | null>(null);
  const [targetMoveGradeId, setTargetMoveGradeId] = useState<string>('');

  // Grade Form Inputs
  const [gradeNameAr, setGradeNameAr] = useState('');
  const [gradeNameEn, setGradeNameEn] = useState('');
  const [gradeStage, setGradeStage] = useState('المرحلة الثانوية');
  const [gradeDescription, setGradeDescription] = useState('');

  // Subject Form Inputs
  const [subjectNameAr, setSubjectNameAr] = useState('');
  const [subjectNameEn, setSubjectNameEn] = useState('');
  const [subjectGradeId, setSubjectGradeId] = useState(selectedGradeId);
  const [subjectIcon, setSubjectIcon] = useState('BookOpen');
  const [subjectColor, setSubjectColor] = useState('#6366f1');
  const [subjectDescription, setSubjectDescription] = useState('');

  // Selected grade object
  const activeGrade =
    academicGrades.find(g => g.id === selectedGradeId) || academicGrades[0];

  // Subjects for the currently selected grade
  const currentGradeSubjects = allSubjects.filter(
    s => s.gradeId === (activeGrade?.id || selectedGradeId)
  );

  const filteredSubjects = currentGradeSubjects.filter(
    s =>
      s.nameAr.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // Handlers for Grade Modal
  const handleOpenAddGrade = () => {
    setEditingGrade(null);
    setGradeNameAr('');
    setGradeNameEn('');
    setGradeStage('المرحلة الثانوية');
    setGradeDescription('');
    setGradeModalOpen(true);
  };

  const handleOpenEditGrade = (grade: AcademicGrade, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGrade(grade);
    setGradeNameAr(grade.nameAr);
    setGradeNameEn(grade.nameEn);
    setGradeStage(grade.stage);
    setGradeDescription(grade.description);
    setGradeModalOpen(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeNameAr.trim()) return;

    if (editingGrade) {
      updateGrade(editingGrade.id, {
        nameAr: gradeNameAr.trim(),
        nameEn: gradeNameEn.trim() || gradeNameAr.trim(),
        stage: gradeStage.trim(),
        description: gradeDescription.trim()
      });
    } else {
      const created = addGrade({
        nameAr: gradeNameAr.trim(),
        nameEn: gradeNameEn.trim() || gradeNameAr.trim(),
        stage: gradeStage.trim(),
        description: gradeDescription.trim()
      });
      setSelectedGradeId(created.id);
    }

    setGradeModalOpen(false);
  };

  const handleDeleteGrade = (gradeId: string, gradeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (academicGrades.length <= 1) {
      alert('لا يمكن حذف هذا الصف لأنه الصف الوحيد المتبقي على المنصة!');
      return;
    }

    if (
      confirm(
        `هل أنت متأكد من حذف (${gradeName})؟ سيتم حذف جميع المواد الدراسية التابعة له نهائياً!`
      )
    ) {
      deleteGrade(gradeId);
      const remaining = academicGrades.filter(g => g.id !== gradeId);
      if (remaining.length > 0) {
        setSelectedGradeId(remaining[0].id);
      }
    }
  };

  // Handlers for Subject Modal
  const handleOpenAddSubject = (gradeId?: string) => {
    setEditingSubject(null);
    setSubjectNameAr('');
    setSubjectNameEn('');
    setSubjectGradeId(gradeId || selectedGradeId);
    setSubjectIcon('BookOpen');
    setSubjectColor('#6366f1');
    setSubjectDescription('');
    setSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectNameAr(sub.nameAr);
    setSubjectNameEn(sub.nameEn);
    setSubjectGradeId(sub.gradeId);
    setSubjectIcon(sub.icon || 'BookOpen');
    setSubjectColor(sub.color || '#6366f1');
    setSubjectDescription(sub.description || '');
    setSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectNameAr.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        nameAr: subjectNameAr.trim(),
        nameEn: subjectNameEn.trim() || subjectNameAr.trim(),
        gradeId: subjectGradeId,
        icon: subjectIcon,
        color: subjectColor,
        description: subjectDescription.trim()
      });
    } else {
      addSubject({
        nameAr: subjectNameAr.trim(),
        nameEn: subjectNameEn.trim() || subjectNameAr.trim(),
        gradeId: subjectGradeId,
        icon: subjectIcon,
        color: subjectColor,
        description: subjectDescription.trim()
      });
      // Ensure we view the grade to which the subject was added
      setSelectedGradeId(subjectGradeId);
    }

    setSubjectModalOpen(false);
  };

  const handleDeleteSubject = (subId: string, subName: string) => {
    if (confirm(`هل أنت متأكد من حذف مادة (${subName}) من هذا الصف؟`)) {
      deleteSubject(subId);
    }
  };

  // Handlers for Moving Subject to Another Grade
  const handleOpenMoveSubject = (sub: Subject) => {
    setMovingSubject(sub);
    const otherGrades = academicGrades.filter(g => g.id !== sub.gradeId);
    setTargetMoveGradeId(otherGrades[0]?.id || '');
    setMoveModalOpen(true);
  };

  const handleConfirmMove = () => {
    if (!movingSubject || !targetMoveGradeId) return;
    updateSubject(movingSubject.id, { gradeId: targetMoveGradeId });
    setMoveModalOpen(false);
    setMovingSubject(null);
  };

  // Instructors count
  const instructorUsers = users.filter(u => u.role === 'INSTRUCTOR');

  return (
    <div className="space-y-8 font-sans pb-16 text-right">
      {/* رأس الصفحة والإحصائيات */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>بوابة الإدارة والحوكمة &bull; الهيكل التعليمي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            إدارة الصفوف والمراحل والمواد الدراسية
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            أضف الصفوف الدراسية والمراحل التعليمية بحرية كاملة، وحدد وخصص المواد التابعة لكل صف، مع انعكاس فوري على بوابات المعلمين والطلاب وتوليد الكروت.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleOpenAddSubject(selectedGradeId)}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مادة دراسية</span>
          </button>

          <button
            onClick={handleOpenAddGrade}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صف دراسي جديد</span>
          </button>
        </div>
      </div>

      {/* شريط الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-rose-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{academicGrades.length} صفوف</div>
            <div className="text-xs text-gray-400">إجمالي الصفوف المفعلة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{allSubjects.length} مادة</div>
            <div className="text-xs text-gray-400">إجمالي المقررات بالمنصة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{instructorUsers.length} معلم</div>
            <div className="text-xs text-gray-400">معلمون مسندون للصفوف</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{currentGradeSubjects.length} مادة</div>
            <div className="text-xs text-gray-400">مواد الصف المختار حالياً</div>
          </div>
        </div>
      </div>

      {/* قسم استعراض الصفوف واختيار الصف */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-400" />
            <span>الصفوف والمراحل الدراسية المسجلة ({academicGrades.length})</span>
          </h2>
          <span className="text-xs text-gray-400">
            اضغط على أي صف لعرض وتخصيص المواد التابعة له
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {academicGrades.map(grade => {
            const isSelected = grade.id === (activeGrade?.id || selectedGradeId);
            const subsCount = allSubjects.filter(s => s.gradeId === grade.id).length;

            return (
              <div
                key={grade.id}
                onClick={() => setSelectedGradeId(grade.id)}
                className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer border text-right relative group ${
                  isSelected
                    ? 'bg-rose-950/30 border-rose-500/70 shadow-lg shadow-rose-950/40'
                    : 'glass-card border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                    <span>{grade.stage}</span>
                  </div>

                  {/* إجراءات الصف */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={e => handleOpenEditGrade(grade, e)}
                      title="تعديل الصف"
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => handleDeleteGrade(grade.id, grade.nameAr, e)}
                      title="حذف الصف"
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-600/30 text-gray-400 hover:text-rose-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition">
                  {grade.nameAr}
                </h3>
                <div className="text-[11px] font-mono text-gray-400 mt-0.5">{grade.nameEn}</div>
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {grade.description}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
                  <span className="text-gray-400">المواد المحددة:</span>
                  <span className="font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    {subsCount} مادة مقررة
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 left-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block animate-ping" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* منطقة إدارة المواد التابعة للصف المختار */}
      {activeGrade && (
        <div className="p-6 rounded-3xl glass-card border border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  المقررات والمناهج التابعة
                </span>
                <span className="text-xs text-gray-500">&bull;</span>
                <span className="text-xs text-gray-300 font-bold">{activeGrade.nameAr}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>المواد المقررة لهذا الصف ({currentGradeSubjects.length})</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* شريط البحث في المواد */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={subjectSearch}
                  onChange={e => setSubjectSearch(e.target.value)}
                  placeholder="بحث في مواد هذا الصف..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={() => handleOpenAddSubject(activeGrade.id)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ مادة جديدة لـ {activeGrade.nameAr}</span>
              </button>
            </div>
          </div>

          {/* شبكة المواد الدراسية */}
          {filteredSubjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-gray-950/40 border border-gray-800/80 space-y-3">
              <BookOpen className="w-10 h-10 text-gray-600 mx-auto" />
              <h3 className="text-base font-bold text-white">لا توجد مواد مضافة لهذا الصف بعد</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                قم بالضغط على زر &quot;إضافة مادة جديدة&quot; لتحديد المقررات والمذكرات المعتمدة لطلاب هذا الصف.
              </p>
              <button
                onClick={() => handleOpenAddSubject(activeGrade.id)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة أول مادة دراسية للصف</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map(subject => {
                const SubjectIconComp = iconMap[subject.icon] || BookOpen;

                return (
                  <div
                    key={subject.id}
                    className="p-5 rounded-2xl bg-gray-950/60 border border-gray-800/80 hover:border-cyan-500/40 flex flex-col justify-between transition-all duration-200 group shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-md"
                          style={{
                            backgroundColor: `${subject.color}20`,
                            color: subject.color,
                            border: `1px solid ${subject.color}40`
                          }}
                        >
                          <SubjectIconComp className="w-5 h-5" />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenMoveSubject(subject)}
                            title="نقل المادة لصف دراسي آخر"
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-cyan-300 transition"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditSubject(subject)}
                            title="تعديل المادة"
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(subject.id, subject.nameAr)}
                            title="حذف المادة"
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-600/30 text-gray-400 hover:text-rose-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                            {subject.nameAr}
                          </h4>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                        </div>
                        <div className="text-[11px] font-mono text-gray-400">{subject.nameEn}</div>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                          {subject.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="font-mono text-gray-500">ID: {subject.id}</span>
                      <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800 font-semibold">
                        {activeGrade.nameAr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: إضافة / تعديل صف دراسي */}
      {/* ========================================================= */}
      {gradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl glass-card border border-rose-500/40 p-6 sm:p-7 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {editingGrade ? 'تعديل بيانات الصف الدراسي' : 'إضافة صف دراسي جديد للمنصة'}
                </h3>
              </div>
              <button
                onClick={() => setGradeModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  اسم الصف بالعربية *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الصف الأول الإعدادي، الصف الثالث الثانوي"
                  value={gradeNameAr}
                  onChange={e => setGradeNameAr(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  اسم الصف بالإنجليزية (أو الرمز)
                </label>
                <input
                  type="text"
                  placeholder="مثال: 1st Preparatory, 3rd Secondary"
                  value={gradeNameEn}
                  onChange={e => setGradeNameEn(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 font-mono"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  المرحلة التعليمية العامة *
                </label>
                <select
                  value={gradeStage}
                  onChange={e => setGradeStage(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="المرحلة الثانوية">المرحلة الثانوية (Secondary Stage)</option>
                  <option value="المرحلة الإعدادية">المرحلة الإعدادية (Preparatory Stage)</option>
                  <option value="المرحلة الابتدائية">المرحلة الابتدائية (Primary Stage)</option>
                  <option value="شهادات ومعاهد متخصصة">شهادات ومعاهد متخصصة (Specialized Courses)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  وصف تعريفي ونبذة عن المنهج
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب نبذة مختصرة عن المقررات وطبيعة المنهج الدراسي لهذا الصف..."
                  value={gradeDescription}
                  onChange={e => setGradeDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setGradeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-lg shadow-rose-600/30 transition"
                >
                  {editingGrade ? 'حفظ التعديلات' : 'إضافة الصف فوراً'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: إضافة / تعديل مادة دراسية */}
      {/* ========================================================= */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl glass-card border border-cyan-500/40 p-6 sm:p-7 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {editingSubject ? 'تعديل بيانات المادة الدراسية' : 'إضافة مادة دراسية جديدة للصف'}
                </h3>
              </div>
              <button
                onClick={() => setSubjectModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  الصف الدراسي التابع له هذه المادة *
                </label>
                <select
                  value={subjectGradeId}
                  onChange={e => setSubjectGradeId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  {academicGrades.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.nameAr} ({g.stage})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    اسم المادة بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الفيزياء، الكيمياء، الفلسفة"
                    value={subjectNameAr}
                    onChange={e => setSubjectNameAr(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">
                    اسم المادة بالإنجليزية
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: Physics, Chemistry"
                    value={subjectNameEn}
                    onChange={e => setSubjectNameEn(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* اختيار الأيقونة واللون */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1.5">
                    أيقونة المادة التعبيرية:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableIcons.map(ico => {
                      const IconComp = iconMap[ico.id] || BookOpen;
                      const isChosen = subjectIcon === ico.id;
                      return (
                        <button
                          type="button"
                          key={ico.id}
                          onClick={() => setSubjectIcon(ico.id)}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                            isChosen
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                              : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                          <span className="text-[9px] line-clamp-1">{ico.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span>اللون المميز للمادة:</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableColors.map(col => (
                      <button
                        type="button"
                        key={col.hex}
                        onClick={() => setSubjectColor(col.hex)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                          subjectColor === col.hex ? 'scale-110 border-white ring-2 ring-cyan-400' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {subjectColor === col.hex && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  نبذة ووصف محتويات المادة
                </label>
                <textarea
                  rows={2}
                  placeholder="موضوعات المنهج والأبواب الرئيسية..."
                  value={subjectDescription}
                  onChange={e => setSubjectDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setSubjectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold shadow-lg shadow-cyan-600/30 transition"
                >
                  {editingSubject ? 'حفظ تعديل المادة' : 'إضافة المادة فوراً'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: نقل مادة لصف دراسي آخر */}
      {/* ========================================================= */}
      {moveModalOpen && movingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl glass-card border border-indigo-500/40 p-6 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  نقل مادة ({movingSubject.nameAr})
                </h3>
              </div>
              <button
                onClick={() => setMoveModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-gray-300 leading-relaxed">
                اختر الصف الدراسي الجديد الذي تريد نقل هذه المادة إليه وتعيينها له:
              </p>

              <div>
                <label className="text-gray-400 font-semibold block mb-1">الصف الدراسي المستهدف:</label>
                <select
                  value={targetMoveGradeId}
                  onChange={e => setTargetMoveGradeId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-400"
                >
                  {academicGrades
                    .filter(g => g.id !== movingSubject.gradeId)
                    .map(g => (
                      <option key={g.id} value={g.id}>
                        {g.nameAr} ({g.stage})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setMoveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMove}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  تأكيد النقل الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
