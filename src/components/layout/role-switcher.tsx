'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/lms-context';
import {
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Sparkles,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Copy,
  Ticket
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AcademicGradeId } from '@/lib/types';
import { mockAcademicGrades } from '@/lib/mock-data/grades-subjects';

export function RoleSwitcher() {
  const {
    currentUser,
    switchRole,
    impersonatedByAdmin,
    stopImpersonating,
    studentGradeId,
    setStudentGradeId,
    academicGrades,
    vouchers
  } = useLMS();

  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleChange = (role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT', destination: string) => {
    switchRole(role);
    router.push(destination);
    setIsOpen(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const roleTitleMap = {
    ADMIN: 'مسؤول المنصة',
    INSTRUCTOR: 'معلم المادة',
    STUDENT: 'طالب'
  };

  const gradeShortMap: Record<string, string> = {
    grade_sec_3: 'تالتة ثانوي',
    grade_sec_2: 'تانية ثانوي',
    grade_sec_1: 'أولى ثانوي'
  };

  return (
    <aside aria-label="أداة التبديل التجريبي" className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2 font-sans">
      {/* القائمة المنبثقة للتحويل التجريبي */}
      {isOpen && (
        <div className="w-88 max-h-[85vh] overflow-y-auto rounded-3xl glass-card p-4 shadow-2xl border border-indigo-500/30 animate-in fade-in slide-in-from-bottom-5 duration-200 space-y-3 text-right">
          <div className="flex items-center justify-between pb-2 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-gray-200">
                التحويل السريع بين الهويات والصفوف
              </span>
            </div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
              وضع التجربة
            </span>
          </div>

          <p className="text-[11px] text-gray-400">
            اختر الصف أو الهوية لتجربة الصلاحيات وتصفح المحتوى المخصص فوراً:
          </p>

          {/* اختيار الدور */}
          <div className="space-y-1.5">
            {/* مسؤول المنصة */}
            <button
              onClick={() => handleRoleChange('ADMIN', '/admin')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right transition-all ${
                currentUser.role === 'ADMIN'
                  ? 'bg-rose-500/15 border border-rose-500/40 text-white'
                  : 'hover:bg-gray-800/60 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    إيلينا فانس
                    <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-bold">
                      مسؤول
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400">توليد الكروت والحوكمة المالية</div>
                </div>
              </div>
              {currentUser.role === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />}
            </button>

            {/* المعلم */}
            <button
              onClick={() => handleRoleChange('INSTRUCTOR', '/instructor')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right transition-all ${
                currentUser.role === 'INSTRUCTOR'
                  ? 'bg-indigo-500/15 border border-indigo-500/40 text-white'
                  : 'hover:bg-gray-800/60 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    الأستاذ أحمد سامي
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1 py-0.2 rounded font-bold">
                      معلم فيزياء
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400">استوديو الأبواب والمذكرات</div>
                </div>
              </div>
              {currentUser.role === 'INSTRUCTOR' && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
            </button>

            {/* الطالب */}
            <button
              onClick={() => handleRoleChange('STUDENT', '/student')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right transition-all ${
                currentUser.role === 'STUDENT'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-white'
                  : 'hover:bg-gray-800/60 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    صوفيا الردريغيز
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-bold">
                      طالبة
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400">كتالوج المواد ومشغل المحاضرات</div>
                </div>
              </div>
              {currentUser.role === 'STUDENT' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            </button>
          </div>

          {/* تبديل الصف الدراسي للطالب */}
          <div className="pt-2 border-t border-gray-800 space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 block">
              الصف الدراسي النشط (لتجربة تصفية المواد)
            </span>
            <div className="grid grid-cols-1 gap-1">
              {(academicGrades || mockAcademicGrades).map(g => (
                <button
                  key={g.id}
                  onClick={() => setStudentGradeId(g.id as AcademicGradeId)}
                  className={`px-3 py-2 rounded-xl text-right text-xs transition flex items-center justify-between ${
                    studentGradeId === g.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <div>
                    <span className="block leading-tight font-bold">{g.nameAr}</span>
                    <span className="block text-[10px] text-gray-400">{g.description}</span>
                  </div>
                  {studentGradeId === g.id && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* كروت شحن جاهزة للتجربة */}
          <div className="pt-2 border-t border-gray-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="font-bold">كروت شحن جاهزة للتجربة والنسخ:</span>
              <Ticket className="w-3 h-3 text-amber-400" />
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              {vouchers.slice(0, 4).map(v => (
                <div
                  key={v.code}
                  className="flex items-center justify-between p-2 rounded-xl bg-gray-900 border border-gray-800"
                >
                  <div className="text-right">
                    <span className="text-amber-400 font-bold block">{v.code}</span>
                    <span className="text-[10px] text-gray-400 font-sans">{v.durationLabelAr}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(v.code)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-cyan-500 hover:text-gray-950 text-gray-300 transition"
                    title="نسخ كود الكارت"
                  >
                    {copiedCode === v.code ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {impersonatedByAdmin && (
            <div className="pt-2 border-t border-gray-800">
              <button
                onClick={stopImpersonating}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition"
              >
                إنهاء وضع انتحال الهوية
              </button>
            </div>
          )}
        </div>
      )}

      {/* الزر العائم الصغير */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gray-900/95 hover:bg-gray-800 border border-gray-700 hover:border-cyan-400 text-white shadow-2xl backdrop-blur-md transition-all duration-200 group"
      >
        <span
          className={`w-2.5 h-2.5 rounded-full animate-pulse ${
            currentUser.role === 'ADMIN'
              ? 'bg-rose-400'
              : currentUser.role === 'INSTRUCTOR'
              ? 'bg-indigo-400'
              : 'bg-cyan-400'
          }`}
        />
        <div className="text-right text-xs">
          <span className="font-bold text-white">{roleTitleMap[currentUser.role]}</span>
          <span className="text-[10px] text-cyan-300 block font-bold">
            {gradeShortMap[studentGradeId] || 'الصف الثالث'}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white" />
        ) : (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-white" />
        )}
      </button>
    </aside>
  );
}
