'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Play,
  ArrowLeft,
  Star,
  Sparkles,
  Layers,
  Award,
  Ticket,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  Clock,
  Lock,
  FileText,
  PhoneCall,
  MessageSquare,
  TrendingUp,
  Check,
  Cpu,
  Zap,
  Calendar,
  LogIn
} from 'lucide-react';

export default function HomePage() {
  const { instructorContents, academicGrades } = useLMS();
  const [activeTabRole, setActiveTabRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative">
      {/* Floating Top Announcement */}
      <div className="bg-gradient-to-r from-cyan-900/40 via-indigo-900/40 to-cyan-900/40 border-b border-cyan-500/20 py-2 px-4 text-center text-[11px] font-semibold text-cyan-200 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
        <span>إصدار المنصة المعتمد 2026 &bull; حوكمة نتائج الامتحانات، كروت شحن السناتر، ومذكرات YA7EDU الحصرية جاهزة للعرض</span>
      </div>

      {/* Main Top Navigation Header */}
      <header className="h-20 border-b border-gray-800/80 bg-[#090e1c]/90 backdrop-blur-2xl px-5 sm:px-10 lg:px-14 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-400 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-white font-mono">
                YA7<span className="text-cyan-400">EDU</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                PRO LMS
              </span>
            </div>
            <span className="text-[11px] text-gray-400 block -mt-0.5">
              منصة التعليم الرقمي وحوكمة السناتر الذكية
            </span>
          </div>
        </Link>

        {/* Quick Jump Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-300">
          <a href="#features" className="hover:text-cyan-400 transition">مميزات المنصة</a>
          <a href="#exam-embargo" className="hover:text-amber-400 transition flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>حوكمة الامتحانات</span>
          </a>
          <a href="#instructors" className="hover:text-cyan-400 transition">نخبة المعلمين</a>
          <a href="#roles" className="hover:text-indigo-400 transition">استكشاف المنظومة</a>
          <a
            href="https://wa.me/201090138676"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 font-mono font-bold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>01090138676</span>
          </a>
        </nav>

        {/* Single Standard Login Button in Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-gray-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-cyan-600/25 via-indigo-600/20 to-amber-500/15 rounded-full blur-[110px] -z-10 pointer-events-none" />
        <div className="absolute -top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-6 shadow-inner">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>المنظومة التعليمية المتكاملة لسناتر ومدرسي الثانوية العامة 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] max-w-5xl mx-auto">
          المنصة التعليمية الأكثر تطوراً وحوكمة في <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">الثانوية العامة</span>
        </h1>

        <p className="text-sm sm:text-lg text-gray-300 mt-6 max-w-3xl mx-auto leading-relaxed">
          نظام متكامل يربط الطالب والمعلم وإدارة المنصة في بيئة آمنة: 
          <strong> حصص معاينة مجانية</strong>، 
          <strong> حجب نتائج الامتحانات حتى انتهاء الموعد</strong>، 
          <strong> مذكرات شرح تفاعلية وفورية</strong>، 
          و<strong>كروت شحن سناتر فورية</strong> مع دعم مالي وفني مباشر عبر الواتساب.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-gray-950 font-black text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/30 transition-all hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول للمنصة</span>
          </Link>

          <a
            href="#features"
            className="px-7 py-3.5 rounded-2xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-white font-bold text-sm flex items-center gap-2 transition hover:border-cyan-500/60 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>استكشاف مميزات المنظومة</span>
          </a>

          <a
            href="https://wa.me/201090138676"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center gap-2 transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>تواصل مع الإدارة (واتساب)</span>
          </a>
        </div>

        {/* 4 Highlights Metric Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-right">
          <div className="p-4 rounded-2xl glass-card border border-amber-500/30 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <Lock className="w-4 h-4" />
              <span>حوكمة الامتحانات</span>
            </div>
            <div className="text-xl font-black text-white font-mono">100% محجوبة</div>
            <p className="text-[11px] text-gray-400 mt-1">تظل النتيجة محجوبة حتى انتهاء تاريخ وساعة الامتحان لمنع التسريب.</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 shadow-lg">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
              <Play className="w-4 h-4" />
              <span>معاينة مجانية</span>
            </div>
            <div className="text-xl font-black text-white font-mono">2 فيديو لكل مدرس</div>
            <p className="text-[11px] text-gray-400 mt-1">يتيح للطالب تجربة الشرح وطريقة الأستاذ قبل الاشتراك رسمياً.</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-indigo-500/30 shadow-lg">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
              <Ticket className="w-4 h-4" />
              <span>كروت شحن السناتر</span>
            </div>
            <div className="text-xl font-black text-white font-mono">كود PIN مؤمن</div>
            <p className="text-[11px] text-gray-400 mt-1">توليد كروت شحن شهرية وفصلية وسنوية مع صلاحية محددة بالسناتر.</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-rose-500/30 shadow-lg">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>مذكرات YA7EDU</span>
            </div>
            <div className="text-xl font-black text-white font-mono">حصرية للأوائل</div>
            <p className="text-[11px] text-gray-400 mt-1">رفع مباشر لملفات الـ PDF الحصرية الخاصة بالأوائل مع التحميل المباشر.</p>
          </div>
        </div>
      </section>

      {/* Role Architecture Hub (Student & Instructor only) */}
      <section id="roles" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-gray-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>تجربة المنظومة التعليمية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            استكشف قدرات المنصة للطلاب والمعلمين
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            تم بناء المنصة بهيكلية تمنح كلاً من الطالب والمعلم لوحة تحكم مخصصة ومصممة بأعلى معايير تجربة المستخدم.
          </p>

          {/* 2 Tabs: Student and Instructor Only */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-gray-900 border border-gray-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTabRole('STUDENT')}
              className={`px-6 py-2.5 rounded-xl flex items-center gap-2 transition ${
                activeTabRole === 'STUDENT'
                  ? 'bg-cyan-500 text-gray-950 font-black shadow-lg shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>1. بوابة الطالب (Student Hub)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabRole('INSTRUCTOR')}
              className={`px-6 py-2.5 rounded-xl flex items-center gap-2 transition ${
                activeTabRole === 'INSTRUCTOR'
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>2. استوديو المعلم (Instructor Studio)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Feature Showcase */}
        {activeTabRole === 'STUDENT' && (
          <div className="p-8 rounded-3xl glass-card border border-cyan-500/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-right shadow-2xl">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30">
                تجربة الطالب &bull; الثانوية العامة
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                مشغل ذكي، معاينة مجانية، وامتحانات محكومة
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                يتمتع الطالب ببيئة تعليمية مخصصة للمرحلة الدراسية المقيد بها، تمنحه تصفح مواد المنهج، مشاهدة فيديوهات المعاينة المجانية بدون اشتراك، شحن كروت السناتر، وأداء الامتحانات الدورية.
              </p>
              
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>مشغل فيديو تفاعلي يدعم السرعات (0.75x إلى 2x) وملاحظات المحاضرة.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>حل التدريبات التفاعلية مع ظهور الإجابة الصحيحة وشرح الحل تفصيلياً فوراً.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>عداد تنازلي رسمي لفك حجب نتائج ونماذج إجابات الامتحانات.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-black text-xs inline-flex items-center gap-2 shadow-lg transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول لبوابة الطالب</span>
                </Link>
              </div>
            </div>

            {/* Visual Mockup Card */}
            <div className="p-6 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-gray-400 font-mono text-[11px] mr-2">YA7EDU Player Demo</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded">عينة مجانية</span>
              </div>

              <div className="aspect-video rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-cyan-400 block">الفيزياء &bull; الباب الأول</span>
                    <h4 className="text-xs font-bold text-white">المحاضرة 1: التيار الكهربي وقانون أوم (معاينة مجانية)</h4>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-gray-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Play className="w-5 h-5 fill-gray-950 ml-0.5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">امتحان كيرشوف الدوري</span>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                  النتيجة محجوبة 🔒
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTabRole === 'INSTRUCTOR' && (
          <div className="p-8 rounded-3xl glass-card border border-indigo-500/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-right shadow-2xl">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30">
                تجربة المعلم &bull; إدارة المناهج والامتحانات
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                استوديو متكامل لإدارة الأبواب والمذكرات والامتحانات
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                يتحكم المعلم في كامل محتواه التعليمي: إنشاء الأبواب، رفع فيديوهات الشرح (ملفات مباشرة أو روابط يوتيوب)، وتحديد حصص المعاينة المجانية، وإعداد الامتحانات بمواعيد ومدة زمنية دقيقة.
              </p>
              
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>تحديد تاريخ وبداية الامتحان، وتاريخ ونهاية الامتحان، والمدة بالدقائق لكل طالب.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>رفع مذكرات الشرح PDF أو إنشاء تدريبات ذات حل وتفسير فوري.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>بطاقة مدة الاشتراك وتجديد الحساب مباشرة عبر واتساب الإدارة (01090138676).</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول لاستوديو المعلم</span>
                </Link>
              </div>
            </div>

            {/* Visual Mockup Card */}
            <div className="p-6 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-xs">
                <span className="font-bold text-white">تبويبات استوديو المعلم</span>
                <span className="text-[10px] text-gray-400 font-mono">3 أقسام حصرية</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h5 className="font-bold text-white">الأبواب والمحاضرات</h5>
                    <span className="text-[10px] text-gray-400">رفع فيديو مسجل أو يوتيوب + معاينة مجانية</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h5 className="font-bold text-white">المذكرات والحل الفوري</h5>
                    <span className="text-[10px] text-gray-400">رفع ملفات PDF أو تدريبات تفسير الإجابة</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h5 className="font-bold text-white">المراجعات وليلة الامتحان</h5>
                    <span className="text-[10px] text-gray-400">ملفات PDF وفيديوهات شرح المراجعة</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Deep Spotlight: Exam Embargo System (قاعدة حجب النتيجة) */}
      <section id="exam-embargo" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-gray-800/80">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-950/20 via-gray-900 to-indigo-950/30 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-right">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Lock className="w-3.5 h-3.5 animate-pulse" />
                <span>نظام حوكمة الامتحانات &bull; Exam Embargo Governance</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                حجب النتيجة ونموذج الإجابة حتى انتهاء تاريخ ووقت الامتحان
              </h2>

              <p className="text-xs sm:text-base text-gray-300 leading-relaxed">
                لمنع تسريب الأسئلة وضمان تكافؤ الفرص بين جميع الطلاب في السناتر والمنازل، يحدد المعلم تاريخ وبداية الامتحان وتاريخ ونهاية الامتحان بدقة. 
                حتى لو سلّم الطالب إجاباته مبكراً، **تظل النتيجة محجوبة بالكامل** بشاشة عداد تنازلي رقمي حي، ولا تظهر الدرجة ونموذج الحل التفسيري إلا بعد انقضاء الموعد النهائي المحدد.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800">
                  <span className="font-bold text-white block">مواعيد دقيقة بالساعة والدقيقة</span>
                  <span className="text-[11px] text-gray-400">تاريخ بداية ونهاية وساعة محددة ومدة إجابة.</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800">
                  <span className="font-bold text-white block">فتح تلقائي فور حلول الموعد</span>
                  <span className="text-[11px] text-gray-400">تظهر الدرجة ونموذج الإجابة التفصيلي لكل سؤال.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs inline-flex items-center gap-2 shadow-lg transition"
                >
                  <Lock className="w-4 h-4" />
                  <span>تسجيل الدخول لتجربة الامتحانات</span>
                </Link>
              </div>
            </div>

            {/* Visual Embargo Preview */}
            <div className="p-6 rounded-2xl bg-gray-950/90 border border-amber-500/30 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto ring-4 ring-amber-500/30 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  تم استلام إجابات الطالب وتوثيقها بنجاح ✅
                </span>
                <h4 className="text-base font-bold text-white mt-2">
                  النتيجة ونموذج الإجابة محجوبة حالياً
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">
                  تظهر الدرجة تلقائياً فور انتهاء موعد الامتحان لجميع الطلاب
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900 border border-amber-500/30 space-y-1">
                <span className="text-[10px] text-gray-400 block">متبقي على فك الحجب التلقائي:</span>
                <div className="text-2xl font-black font-mono text-amber-400">
                  02d 04:15:30
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-gray-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>البنية التقنية المتقدمة لمنصة YA7EDU</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            كل ما تحتاجه لإدارة منظومة تعليمية رقمية متكاملة
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            تم تصميم كل عنصر في المنصة ليلبي احتياجات السناتر التعليمية الكبرى ومدرسي الأوائل في مصر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
          <div className="p-6 rounded-3xl glass-card border border-gray-800 hover:border-cyan-500/50 transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
              <Play className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
              فيديوهات معاينة مجانية (Free Previews)
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              لكل معلم ومادة فيديوهين متاحين مجاناً لأي طالب لمشاهدة الشرح وتقييم الأسلوب قبل شراء كرت السنتر أو الاشتراك.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-gray-800 hover:border-indigo-500/50 transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Ticket className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
              نظام كروت الشحن الرقمية (Vouchers)
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              توليد كروت شحن بأكواد PIN فريدة ومدد اشتراك متعددة (شهر، 3 أشهر، ترم، سنة) جاهزة للتوزيع المباشر بالسناتر.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-emerald-500/50 transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
              تدريبات ذات حل فوري وتفسير
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              تدريبات تشبه الامتحانات تتيح للطالب اختيار الإجابة، ومعرفة الإجابة الصحيحة وشرح الحل بالتفصيل فوراً بدون انتظار.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-amber-500/50 transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition">
              تجديد اشتراك المعلمين عبر الواتساب
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              بطاقة ذكية توضح للمعلم مدة اشتراكه ووقته المتبقي، مع زر تجديد ينقله مباشرة إلى واتساب الدعم الفني المعتمد (01090138676).
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-rose-500/50 transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition">
              مذكرات YA7EDU الحصرية
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              إصدارات رسمية حصرية للأوائل تشمل كبسولات القوانين ونقاط التريكات الوزارية متاحة للمشتركين.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-cyan-500/50 transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
              إدارة الصفوف والمناهج الدراسية
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              توزيع وتخصيص المواد لكل صف دراسي بمرونة تامة لتوفير بيئة تعليمية مقفلة لكل مرحلة دراسية.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Teachers Section */}
      <section id="instructors" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-gray-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>مدرسو الصف الثالث الثانوي (الثانوية العامة)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              أبرز مدرسي المواد المعتمدين على YA7EDU
            </h2>
          </div>

          <Link
            href="/login"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition"
          >
            <span>تسجيل الدخول لاستعراض كافة المواد</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {instructorContents.map(inst => (
            <div
              key={inst.id}
              className="rounded-3xl glass-card border border-gray-800 hover:border-cyan-500/50 p-6 flex flex-col justify-between transition-all duration-300 group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                    {inst.subjectName}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{inst.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={inst.instructorAvatar}
                    alt={inst.instructorName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-700 group-hover:ring-cyan-500/50 transition shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                      {inst.instructorName}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{inst.instructorTitle}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {inst.bioAr}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-gray-900/60 border border-gray-800 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">الأبواب الدراسية</span>
                    <span className="font-bold text-white">{inst.chapters.length} أبواب</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">المذكرات والمراجعات</span>
                    <span className="font-bold text-white">{inst.booklets.length + inst.revisions.length} كراسة</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">سعر الاشتراك</span>
                  <span className="text-base font-mono font-extrabold text-white">
                    {inst.priceMonthly} ج.م <span className="text-xs font-normal text-gray-400">/شهر</span>
                  </span>
                </div>

                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-black text-xs inline-flex items-center gap-1.5 shadow-md transition"
                >
                  <Play className="w-3.5 h-3.5 fill-gray-950" />
                  <span>معاينة فيديوهين مجاناً</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Ready Banner */}
      <section className="py-12 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/50 to-cyan-950/40 border border-cyan-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            منظومة LMS جاهزة للتشغيل والتسليم الفوري
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            تم اختبار كافة الوظائف البرمجية والتأكد من توافق المنظومة مع أرقى معايير الأداء والسرعة، ودعم كامل للغة العربية وتجربة استخدام خالية من التعقيد.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-cyan-300">
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>حوكمة حجب نتائج الامتحانات</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>فيديوهات المعاينة المجانية</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>كروت شحن السناتر PIN</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>تجديد المدرسين عبر الواتساب</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="mt-auto border-t border-gray-800/80 bg-[#060911] pt-14 pb-8 px-5 sm:px-10 lg:px-14 text-right">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800/60">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white font-mono">
                YA7<span className="text-cyan-400">EDU</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              المنظومة التعليمية الرقمية المعتمدة لسناتر ومدرسي الثانوية العامة. تقديم تجربة تعليمية محكومة بأعلى معايير النزاهة والجودة التعليمية.
            </p>
            <div className="pt-2 text-xs text-gray-300">
              <span className="text-gray-500 block mb-1">دعم المعلمين والسناتر (واتساب مباشر):</span>
              <a
                href="https://wa.me/201090138676"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-mono font-bold hover:underline inline-flex items-center gap-1 text-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+20 109 013 8676</span>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">تسجيل الدخول للمنظومة</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition">
                  تسجيل الدخول للطالب
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition">
                  تسجيل الدخول للمعلم
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition">
                  بوابة إدارة المنصة
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">الحوكمة والأمان</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>قاعدة حجب نتائج الامتحانات (Exam Embargo)</li>
              <li>كروت شحن السناتر المشفرة (PIN)</li>
              <li>مذكرات YA7EDU الحصرية</li>
              <li>تخصيص مواد الصفوف الدراسية</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>
            جميع الحقوق محفوظة لمنصة <strong>YA7EDU</strong> &copy; 2026.
          </div>
          <div className="font-mono text-gray-400">
            Powered by YA7EDU High-Performance Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
