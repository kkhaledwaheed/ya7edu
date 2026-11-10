'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Play,
  ArrowLeft,
  ArrowRight,
  Star,
  Sparkles,
  Layers,
  Award,
  Ticket,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  BookOpen,
  Clock,
  Lock,
  Unlock,
  FileText,
  PhoneCall,
  MessageSquare,
  TrendingUp,
  Check,
  Cpu,
  Zap,
  Calendar,
  LogIn,
  Search,
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';

export default function HomePage() {
  const { instructorContents, academicGrades } = useLMS();
  const [activeTabRole, setActiveTabRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [scratched, setScratched] = useState(false);

  // Live Embargo Countdown Simulator (starts at 2d 14h 28m 42s)
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 28,
    seconds: 42
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: 'كيف يعمل نظام حوكمة حجب نتائج الامتحانات (Exam Embargo)؟',
      a: 'يحدد المعلم تاريخ وساعة بداية ونهاية الامتحان بدقة. فور تسليم الطالب لإجاباته، يتم توثيق المحاولة وتظل النتيجة ونموذج الإجابة محجوبة تماماً بعداد تنازلي حي حتى انتهاء الموعد الرسمي لجميع الطلاب بالسناتر والمنازل، مما يضمن العدالة التامة ويمنع تداول الأسئلة.'
    },
    {
      q: 'هل يمكن لأي طالب مشاهدة حصص الشرح مجاناً قبل الاشتراك؟',
      a: 'نعم، المنظومة توفر حصتي معاينة مجانية كاملة لكل معلم ومادة بدون أي اشتراك أو دفع مسبق. يستطيع الطالب تجربة أسلوب الشرح وجودة الصوت والصورة ومحتوى المذكرة قبل اتخاذ قرار الشراء.'
    },
    {
      q: 'كيف يحصل الطلاب على كروت شحن السناتر وكيف يتم تفعيلها؟',
      a: 'تتوفر كروت شحن YA7EDU الورقية المؤمنة في مراكز الدروس والمكتبات المعتمدة. كل كارت يحتوي على كود PIN محمي بطبقة كشط فضية. يخدش الطالب الكارت ويدخل الرمز في حسابه ليتم تفعيل اشتراك الشهر أو الترم فوراً.'
    },
    {
      q: 'كيف يقوم المعلم أو إدارة السنتر بالاشتراك وتجديد الحساب؟',
      a: 'يتمتع المعلم بلوحة تحكم واستوديو متكامل. وتتيح المنظومة بطاقة تجديد سريعة مع زر ربط مباشر بالواتساب الرسمي للمنصة (01090138676) لسرعة تفعيل الحسابات وصرف المستحقات.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Background Decorative Lighting (White & Blue) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[640px] pointer-events-none -z-10 tech-grid opacity-60" />
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-32 right-1/4 w-[480px] h-[480px] bg-sky-400/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Notification Announcement Bar */}
      <div className="bg-blue-50/90 border-b border-blue-200/80 py-2.5 px-4 text-center text-xs font-semibold text-blue-900 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          <p className="truncate">
            <strong className="text-blue-950 font-bold ml-1">إصدار المنظومة 2026:</strong>
            حوكمة نتائج الامتحانات، كروت شحن السناتر الفورية، ومذكرات أوائل الجمهورية متاحة الآن.
          </p>
          <a
            href="https://wa.me/201090138676"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-full shadow-xs transition mr-2 font-bold"
          >
            <span>انضمام المعلمين والسناتر</span>
            <ArrowLeft className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="h-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl px-5 sm:px-10 lg:px-14 flex items-center justify-between sticky top-0 z-40 transition-all shadow-xs">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600 group-hover:rotate-6 transition-transform duration-300" />
              </div>
            </div>
            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-slate-900 font-mono">
                YA7<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">EDU</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-md font-bold tracking-wider">
                V2.6 LMS
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block -mt-0.5 font-medium">
              المنظومة التعليمية الرقمية وحوكمة السناتر
            </span>
          </div>
        </Link>

        {/* Desktop Quick Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-700">
          <a href="#features" className="hover:text-blue-600 transition-colors">
            مميزات المنظومة
          </a>
          <a href="#exam-embargo" className="hover:text-amber-600 transition-colors flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>حوكمة الامتحانات</span>
          </a>
          <a href="#vouchers" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-blue-600" />
            <span>كروت السناتر</span>
          </a>
          <a href="#instructors" className="hover:text-blue-600 transition-colors">
            نخبة المعلمين
          </a>
          <a href="#roles" className="hover:text-indigo-600 transition-colors">
            بوابة الطلاب والمدرسين
          </a>
          <a href="#faq" className="hover:text-blue-600 transition-colors">
            الأسئلة الشائعة
          </a>
        </nav>

        {/* Right CTA / Hotline / Login */}
        <div className="flex items-center gap-3.5">
          <a
            href="https://wa.me/201090138676"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition font-mono"
            title="تواصل مباشر عبر الواتساب"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>01090138676</span>
          </a>

          <Link
            href="/login"
            className="relative group px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>تسجيل الدخول</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full text-center">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-blue-200 text-blue-800 text-xs font-semibold mb-8 shadow-sm backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          <span>منظومة حوكمة السناتر والتعليم الذكي للثانوية العامة 2026</span>
          <span className="text-slate-300">|</span>
          <span className="text-amber-600 font-bold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            نظام حجب النتائج المعتمد
          </span>
        </div>

        {/* Main H1 Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.18] max-w-5xl mx-auto">
          المنظومة التعليمية الرقمية الأكثر تفوقاً وحوكمة في{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600">
            الثانوية العامة
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-sm sm:text-lg text-slate-600 mt-6 max-w-3xl mx-auto leading-relaxed font-normal">
          بيئة رقمية شاملة تجمع كبرى سناتر ومدرسي مصر مع طلاب الثانوية العامة: 
          <strong className="text-blue-700 font-semibold"> حصص معاينة مجانية</strong>، 
          <strong className="text-amber-700 font-semibold"> حجب نتائج ونماذج إجابات الامتحانات حتى انتهاء الموعد</strong>، 
          <strong className="text-indigo-700 font-semibold"> مذكرات شرح تفاعلية وتدريبات بحل وتفسير فوري</strong>، 
          و<strong className="text-emerald-700 font-semibold">كروت شحن فورية بأكواد PIN مؤمنة</strong>.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center gap-2.5 shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>تسجيل الدخول للمنظومة</span>
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>

          <a
            href="#features"
            className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 transition hover:border-blue-400 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>استكشاف قدرات المنصة</span>
          </a>

          <a
            href="https://wa.me/201090138676"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-2 transition shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>تواصل الدعم السريع (واتساب)</span>
          </a>
        </div>

        {/* 4 Highlights Value Pillars */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-right">
          <div className="p-5 rounded-3xl bg-white border border-amber-200 hover:border-amber-400 transition shadow-xs hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-125 transition" />
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold mb-1.5">
              <Lock className="w-4 h-4" />
              <span>حوكمة الامتحانات</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">100% محجوبة</div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              حجب النتائج ونماذج الإجابة حتى انقضاء موعد الامتحان لمنع تسريب الأسئلة.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-blue-200 hover:border-blue-400 transition shadow-xs hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-125 transition" />
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-1.5">
              <Play className="w-4 h-4" />
              <span>معاينة مجانية</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">2 فيديو لكل مدرس</div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              إتاحة حصتي معاينة مجانية كاملة لكل معلم ومادة قبل شراء كرت السنتر.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-indigo-200 hover:border-indigo-400 transition shadow-xs hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-125 transition" />
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-1.5">
              <Ticket className="w-4 h-4" />
              <span>كروت شحن السناتر</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">PIN رقمي مؤمن</div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              توليد وطباعة كروت كشط فورية بصيغة A4 جاهزة للتوزيع بالسناتر والمكتبات.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-rose-200 hover:border-rose-400 transition shadow-xs hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:scale-125 transition" />
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>مذكرات YA7EDU</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">حصرية للأوائل</div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              ملفات PDF لكبسولات القوانين والتريكات الوزارية بإشراف الإدارة المعتمدة.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Exam Embargo Spotlight (حوكمة حجب النتيجة) */}
      <section id="exam-embargo" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-50/80 via-white to-sky-50/80 border border-blue-200 p-8 sm:p-12 shadow-sm overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-right">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                <Lock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                <span>نظام حوكمة الامتحانات &bull; Full Exam Embargo System</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                حجب النتيجة ونموذج الإجابة حتى انتهاء تاريخ وساعة نهاية الامتحان رسمياً
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                في سناتر ومراكز الثانوية العامة، يعد تسريب نماذج الأسئلة قبل انتهاء الموعد أكبر معضلة تواجه المعلمين. في منظومة YA7EDU، يقوم المعلم بتحديد تاريخ ووقت بداية الامتحان وتاريخ ووقت نهاية الامتحان بالدقيقة.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأمين تكافؤ الفرص</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    حتى لو سلّم الطالب إجاباته في الدقيقة الأولى، لا يمكنه الاطلاع على درجاته أو إجابات زملائه.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-1">
                    <Clock className="w-4 h-4" />
                    <span>فك حجب تلقائي لحظي</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    فور حلول ساعة نهاية الامتحان، يفك النظام الحجب ويظهر التقرير والحل النموذجي للجميع معاً.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-amber-500/25 transition hover:scale-105"
                >
                  <Lock className="w-4 h-4" />
                  <span>تسجيل الدخول والوصول للامتحانات</span>
                </Link>
              </div>
            </div>

            {/* Embargo Live Interactive Simulation Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-white border border-amber-200 text-center space-y-4 shadow-xl relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تم استلام إجابات الطالب وتوثيقها رسمياً</span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto ring-4 ring-amber-100 animate-pulse">
                  <Lock className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    امتحان الفيزياء &bull; الفصل الأول (كيرشوف)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    الدرجة ونموذج الإجابة محجوبة حالياً بموجب سياسة الحوكمة
                  </p>
                </div>

                {/* Live Digital Countdown Clock */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                    الوقت المتبقي لفك الحجب التلقائي:
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xl font-black text-amber-600 block">{String(countdown.days).padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-500">يوم</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xl font-black text-amber-600 block">{String(countdown.hours).padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-500">ساعة</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xl font-black text-amber-600 block">{String(countdown.minutes).padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-500">دقيقة</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xl font-black text-amber-600 block">{String(countdown.seconds).padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-500">ثانية</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>موثق بنظام التشفير وحماية الامتحانات YA7EDU</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Architecture Interactive Showcase (Student vs. Instructor) */}
      <section id="roles" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>تجربة المنظومة المتكاملة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            لوحة تحكم مخصصة لكل من الطالب والمعلم
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            تمت هندسة المنصة لتمنح كلاً من الطالب والمعلم تجربة مريحة وسريعة تلبي كل متطلبات العام الدراسي.
          </p>

          {/* Tab Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTabRole('STUDENT')}
              className={`px-6 py-2.5 rounded-xl flex items-center gap-2 transition duration-200 ${
                activeTabRole === 'STUDENT'
                  ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>1. بوابة الطالب (Student Hub)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabRole('INSTRUCTOR')}
              className={`px-6 py-2.5 rounded-xl flex items-center gap-2 transition duration-200 ${
                activeTabRole === 'INSTRUCTOR'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>2. استوديو المعلم (Instructor Studio)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Student Hub */}
        {activeTabRole === 'STUDENT' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-blue-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-right shadow-lg">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-blue-700 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                تجربة الطالب &bull; الثانوية العامة 2026
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                مشغل ذكي فائق السرعة، معاينة مجانية، وتدريبات فورية
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                يتمتع الطالب ببيئة تعليمية مخصصة للمرحلة الدراسية المقيد بها (أولى، تانية، تالتة ثانوي)، تمنحه تصفح مواد المنهج، مشاهدة فيديوهات المعاينة المجانية بدون اشتراك، شحن كروت السناتر، وأداء الامتحانات الدورية.
              </p>
              
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>مشغل فيديو تفاعلي يدعم السرعات (0.75x حتى 2x) وملاحظات المحاضرة.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>حل التدريبات التفاعلية مع ظهور الإجابة الصحيحة وتفسير الحل تفصيلياً فور الإجابة.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>عداد تنازلي رسمي لفك حجب نتائج ونماذج إجابات الامتحانات.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول لبوابة الطالب</span>
                </Link>
              </div>
            </div>

            {/* Visual Interactive Player Mockup */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-500 font-mono text-[11px] mr-2">YA7EDU Player Pro</span>
                </div>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                  عينة مجانية
                </span>
              </div>

              <div className="aspect-video rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-sky-400 block">الفيزياء &bull; الباب الأول</span>
                    <h4 className="text-xs font-bold text-white">المحاضرة 1: التيار الكهربي وقانون أوم (معاينة مجانية)</h4>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-800">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold">امتحان كيرشوف الدوري</span>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold">
                  النتيجة محجوبة 🔒
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Instructor Studio */}
        {activeTabRole === 'INSTRUCTOR' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-blue-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-right shadow-lg">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-blue-700 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                تجربة المعلم &bull; إدارة المناهج والامتحانات
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                استوديو متكامل لإدارة الأبواب والمذكرات والامتحانات
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                يتحكم المعلم في كامل محتواه التعليمي: إنشاء الأبواب، رفع فيديوهات الشرح (ملفات مباشرة أو روابط يوتيوب)، وتحديد حصص المعاينة المجانية، وإعداد الامتحانات بمواعيد ومدة زمنية دقيقة.
              </p>
              
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>تحديد تاريخ وبداية الامتحان، وتاريخ ونهاية الامتحان، والمدة بالدقائق لكل طالب.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>رفع مذكرات الشرح PDF أو إنشاء تدريبات ذات حل وتفسير فوري.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>بطاقة مدة الاشتراك وتجديد الحساب مباشرة عبر واتساب الإدارة (01090138676).</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول لاستوديو المعلم</span>
                </Link>
              </div>
            </div>

            {/* Visual Instructor Studio Tabs Mockup */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <span className="font-bold text-slate-900">أقسام استوديو المعلم المتخصصة</span>
                <span className="text-[10px] text-blue-700 font-mono bg-blue-100 px-2 py-0.5 rounded font-bold">
                  4 تبويبات شاملة
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h5 className="font-bold text-slate-900">الأبواب والمحاضرات</h5>
                    <span className="text-[10px] text-slate-500">رفع فيديو مسجل أو يوتيوب + معاينة مجانية</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-blue-600" />
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h5 className="font-bold text-slate-900">المذكرات والحل الفوري</h5>
                    <span className="text-[10px] text-slate-500">رفع ملفات PDF وتدريبات بتفسير فوري</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-indigo-600" />
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h5 className="font-bold text-slate-900">المراجعات وليلة الامتحان</h5>
                    <span className="text-[10px] text-slate-500">ملفات PDF وفيديوهات شرح المراجعة</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">4</div>
                  <div>
                    <h5 className="font-bold text-slate-900">الامتحانات والاختبارات الدورية</h5>
                    <span className="text-[10px] text-slate-500">حوكمة مواعيد الامتحان وحجب النتيجة</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Interactive Center Scratch Card Section */}
      <section id="vouchers" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Ticket className="w-3.5 h-3.5 text-blue-600" />
              <span>منظومة كروت شحن السناتر والمكتبات المعتمدة</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              كروت شحن ورقية مؤمنة بطبقة كشط فضية وأكواد PIN فريدة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              لتمكين السناتر والمراكز التعليمية من تحصيل الرسوم بمرونة ودون تعقيدات بنكية، توفر المنصة محرك توليد كروت الشحن الذكي. يتم طباعة الكروت بأكواد مؤمنة ومدد صلاحية مخصصة (شهر، 3 أشهر، ترم، سنة كاملة).
            </p>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>تصدير فوري لصفحات A4 جاهزة للطباعة على أرقى الورق المقوى.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>باركود وكود سري مؤمن يمنع التكرار أو التخمين.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>شحن فوري من حساب الطالب بضغطة زر واحدة.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition"
              >
                <Ticket className="w-4 h-4" />
                <span>شحن كارت في بوابة الطالب</span>
              </Link>
            </div>
          </div>

          {/* Interactive Scratch Card Visualizer */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-blue-200 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">YA7EDU VOUCHER</span>
                    <span className="text-[10px] text-blue-600 block font-semibold">كارت شحن سنتر رسمي</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  150 EGP &bull; شهر
                </span>
              </div>

              <div className="py-6 text-center space-y-3">
                <span className="text-xs text-slate-600 font-semibold block">
                  {scratched ? 'تم الكشف عن كود الشحن بنجاح:' : 'انقر على الشريط لكشف كود الـ PIN المطبوع:'}
                </span>

                <div
                  onClick={() => setScratched(true)}
                  className={`cursor-pointer mx-auto max-w-xs h-14 rounded-2xl flex items-center justify-center text-center font-mono font-black text-lg tracking-widest transition-all duration-300 select-none shadow-inner ${
                    scratched
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                      : 'scratch-foil text-slate-900 hover:opacity-90'
                  }`}
                >
                  {scratched ? 'YA7EDU-PHY-9842' : '« انقر هنا لكشط الكارت »'}
                </div>

                <p className="text-[10px] text-slate-500">
                  {scratched ? '✅ كود صالح للاستخدام والتفعيل الفوري بالمنظومة' : '🔒 كود مشفر ومحمي حتى كشط الكارت بالسنتر'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>الصلاحية: 30 يوماً من التفعيل</span>
                <span className="font-mono text-slate-700 font-bold">SN: #2026-V8941</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars Bento Grid */}
      <section id="features" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>البنية التقنية المتقدمة لمنصة YA7EDU</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            كل ما تحتاجه لإدارة منظومة تعليمية رقمية متكاملة
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            تم تصميم كل عنصر في المنصة ليلبي احتياجات السناتر التعليمية الكبرى ومدرسي الأوائل في مصر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Play className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
              فيديوهات معاينة مجانية (Free Previews)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              لكل معلم ومادة فيديوهين متاحين مجاناً لأي طالب لمشاهدة الشرح وتقييم الأسلوب قبل شراء كرت السنتر أو الاشتراك.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Ticket className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
              نظام كروت الشحن الرقمية (Vouchers)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              توليد كروت شحن بأكواد PIN فريدة ومدد اشتراك متعددة (شهر، 3 أشهر، ترم، سنة) جاهزة للتوزيع المباشر بالسناتر.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
              تدريبات ذات حل فوري وتفسير
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              تدريبات تشبه الامتحانات تتيح للطالب اختيار الإجابة، ومعرفة الإجابة الصحيحة وشرح الحل بالتفصيل فوراً بدون انتظار.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition">
              تجديد اشتراك المعلمين عبر الواتساب
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              بطاقة ذكية توضح للمعلم مدة اشتراكه ووقته المتبقي، مع زر تجديد ينقله مباشرة إلى واتساب الدعم الفني المعتمد (01090138676).
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition">
              مذكرات YA7EDU الحصرية
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              إصدارات رسمية حصرية للأوائل تشمل كبسولات القوانين ونقاط التريكات الوزارية متاحة للمشتركين.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
              إدارة الصفوف والمناهج الدراسية
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              توزيع وتخصيص المواد لكل صف دراسي بمرونة تامة لتوفير بيئة تعليمية مقفلة لكل مرحلة دراسية.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Teachers Section */}
      <section id="instructors" className="py-20 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>مدرسو الصف الثالث الثانوي (الثانوية العامة)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              أبرز مدرسي المواد المعتمدين على YA7EDU
            </h2>
          </div>

          <Link
            href="/login"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition"
          >
            <span>تسجيل الدخول لاستعراض كافة المواد</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {instructorContents.map(inst => (
            <div
              key={inst.id}
              className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between group shadow-xs hover:border-blue-400 hover:shadow-lg transition"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {inst.subjectName}
                  </span>
                  <div className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{inst.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={inst.instructorAvatar}
                    alt={inst.instructorName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-400 transition shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {inst.instructorName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{inst.instructorTitle}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {inst.bioAr}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">الأبواب الدراسية</span>
                    <span className="font-bold text-slate-900">{inst.chapters.length} أبواب</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">المذكرات والمراجعات</span>
                    <span className="font-bold text-slate-900">{inst.booklets.length + inst.revisions.length} كراسة</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">سعر الاشتراك</span>
                  <span className="text-base font-mono font-extrabold text-blue-600">
                    {inst.priceMonthly} ج.م <span className="text-xs font-normal text-slate-500">/شهر</span>
                  </span>
                </div>

                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>معاينة فيديوهين مجاناً</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq" className="py-20 px-5 sm:px-10 lg:px-14 max-w-5xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>الأسئلة الشائعة والأجوبة الفورية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            كل ما يهمك معرفته حول المنظومة
          </h2>
        </div>

        <div className="space-y-3.5 text-right">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-right text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Client Ready Conversion Banner */}
      <section className="py-12 px-5 sm:px-10 lg:px-14 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-center space-y-5 shadow-xl text-white relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white">
            منظومة LMS جاهزة للتشغيل والتسليم الفوري
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
            تم اختبار كافة الوظائف البرمجية والتأكد من توافق المنظومة مع أرقى معايير الأداء والسرعة، ودعم كامل للغة العربية وتجربة استخدام خالية من التعقيد.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-white">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>حوكمة حجب نتائج الامتحانات</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>فيديوهات المعاينة المجانية</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>كروت شحن السناتر PIN</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>تجديد المدرسين عبر الواتساب</span>
            </span>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-black text-sm flex items-center gap-2 shadow-lg transition"
            >
              <LogIn className="w-4 h-4 text-blue-700" />
              <span>الدخول للمنظومة الآن</span>
            </Link>
            <a
              href="https://wa.me/201090138676"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>تواصل مع الإدارة (واتساب)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Agency-Quality Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900 text-slate-300 pt-16 pb-10 px-5 sm:px-10 lg:px-14 text-right">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-black text-2xl text-white font-mono">
                YA7<span className="text-blue-400">EDU</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              المنظومة التعليمية الرقمية المعتمدة لسناتر ومدرسي الثانوية العامة. تقديم تجربة تعليمية محكومة بأعلى معايير النزاهة والجودة التعليمية.
            </p>
            <div className="pt-2 text-xs text-slate-300">
              <span className="text-slate-400 block mb-1">دعم المعلمين والسناتر (واتساب مباشر):</span>
              <a
                href="https://wa.me/201090138676"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-mono font-bold hover:underline inline-flex items-center gap-1.5 text-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+20 109 013 8676</span>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">بوابات المنظومة</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/login" className="hover:text-blue-400 transition">
                  بوابة الطالب (Student Hub)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition">
                  استوديو المعلم (Instructor Studio)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition">
                  بوابة إدارة المنصة (Admin Command)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition">
                  تفعيل كروت شحن السناتر
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">الحوكمة والأمان</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>قاعدة حجب نتائج الامتحانات (Exam Embargo)</li>
              <li>كروت شحن السناتر المشفرة (PIN)</li>
              <li>مذكرات YA7EDU الحصرية للأوائل</li>
              <li>تخصيص مواد الصفوف الدراسية</li>
              <li>مطابقة مناهج وزارة التربية والتعليم</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            جميع الحقوق محفوظة لمنصة <strong>YA7EDU</strong> &copy; 2026.
          </div>
          <div className="font-mono text-slate-400 text-[11px]">
            High-Performance LMS & Center Governance Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
