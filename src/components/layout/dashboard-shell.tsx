'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  Settings,
  PlusCircle,
  GraduationCap,
  MessageSquare,
  Award,
  PlayCircle,
  CreditCard,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  Ticket,
  FileCheck2,
  Layers,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ImpersonationBanner } from './impersonation-banner';
import { SubscriptionModal } from '../subscription/subscription-modal';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const {
    currentUser,
    courses,
    payoutRequests,
    users,
    platformConfig,
    activeGradeDetails,
    logout,
    isHydrated,
    isLiveDbReady
  } = useLMS();

  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickRedeemOpen, setQuickRedeemOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // شارات التنبيه الحية
  const pendingCoursesCount = courses.filter(c => c.status === 'PENDING_REVIEW').length;
  const pendingPayoutsCount = payoutRequests.filter(p => p.status === 'PENDING').length;
  const pendingUsersCount = users.filter(u => u.status === 'PENDING_APPROVAL').length;

  const adminNav: NavItem[] = [
    { label: 'نظرة عامة', href: '/admin', icon: LayoutDashboard },
    { label: 'إدارة المعلمين وصلاحياتهم', href: '/admin/instructors', icon: GraduationCap },
    { label: 'إدارة الصفوف والمواد', href: '/admin/grades', icon: Layers },
    { label: 'مذكرات YA7EDU الحصرية', href: '/admin/ya7edu-booklets', icon: Sparkles },
    { label: 'إدارة المستخدمين', href: '/admin/users', icon: Users, badge: pendingUsersCount > 0 ? pendingUsersCount : undefined },
    { label: 'مراجعة المناهج', href: '/admin/courses', icon: BookOpen, badge: pendingCoursesCount > 0 ? pendingCoursesCount : undefined },
    { label: 'توليد كروت الشحن', href: '/admin/vouchers', icon: Ticket },
    { label: 'طلبات سحب الأرباح', href: '/admin/payouts', icon: DollarSign, badge: pendingPayoutsCount > 0 ? pendingPayoutsCount : undefined },
    { label: 'إعدادات المنصة', href: '/admin/settings', icon: Settings },
  ];

  const instructorNav: NavItem[] = [
    { label: 'لوحة التحكم', href: '/instructor', icon: LayoutDashboard },
    { label: 'استوديو الأبواب والمذكرات', href: '/instructor/studio', icon: PlusCircle },
    { label: 'الامتحانات والاختبارات', href: '/instructor/exams', icon: FileCheck2 },
    { label: 'متابعة أداء الطلاب', href: '/instructor/students', icon: GraduationCap },
    { label: 'الأرباح والتحويلات', href: '/instructor/payouts', icon: DollarSign },
    { label: 'أسئلة وتقييمات الطلاب', href: '/instructor/qa', icon: MessageSquare },
  ];

  const studentNav: NavItem[] = [
    { label: 'الرئيسية والمواد', href: '/student', icon: LayoutDashboard },
    { label: 'مشغل المحاضرات والمذكرات', href: '/student/player', icon: PlayCircle },
    { label: 'اشتراكاتي وكروت الشحن', href: '/student/subscriptions', icon: Ticket },
    { label: 'امتحانات المعلمين والتقييمات', href: '/student/quizzes', icon: FileCheck2 },
    { label: 'سجل المدفوعات والفواتير', href: '/student/billing', icon: CreditCard },
  ];

  // Resolve effective active role:
  // On SSR or prior to client mount, infer role from URL path to avoid hydration mismatch.
  // Once mounted on client, use currentUser.role.
  const routeRole = pathname.startsWith('/admin')
    ? 'ADMIN'
    : pathname.startsWith('/instructor')
    ? 'INSTRUCTOR'
    : 'STUDENT';

  const effectiveRole = mounted ? currentUser.role : routeRole;

  const currentNav =
    effectiveRole === 'ADMIN'
      ? adminNav
      : effectiveRole === 'INSTRUCTOR'
      ? instructorNav
      : studentNav;

  const roleNameArabic = {
    ADMIN: 'بوابة الإدارة والحوكمة',
    INSTRUCTOR: 'بوابة المعلم',
    STUDENT: 'بوابة الطالب'
  }[effectiveRole];

  const roleTheme = {
    ADMIN: {
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      activeLink: 'bg-rose-50 text-rose-700 border-rose-600 font-bold shadow-2xs',
      accentDot: 'bg-rose-600',
    },
    INSTRUCTOR: {
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      activeLink: 'bg-blue-50 text-blue-700 border-blue-600 font-bold shadow-2xs',
      accentDot: 'bg-blue-600',
    },
    STUDENT: {
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      activeLink: 'bg-blue-50 text-blue-700 border-blue-600 font-bold shadow-2xs',
      accentDot: 'bg-blue-600',
    },
  }[effectiveRole];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <ImpersonationBanner />

      {/* الشريط الإعلاني العام */}
      {platformConfig.bannerEnabled && platformConfig.bannerText && (
        <div className="bg-blue-50/90 border-b border-blue-200 px-4 py-2 text-center text-xs text-blue-900 font-semibold flex items-center justify-center gap-2 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{platformConfig.bannerText}</span>
        </div>
      )}

      {/* منطقة التخطيط الرئيسية */}
      <div className="flex-1 flex overflow-hidden">
        {/* الشريط الجانبي الثابت (Desktop Sidebar) */}
        <aside className="hidden lg:flex flex-col w-64 border-l border-slate-200 bg-white shrink-0 z-20 text-right shadow-xs">
          {/* الشعار واسم المنصة */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1.5 font-mono">
                  YA7<span className="text-blue-600">EDU</span>
                  <span className="text-[10px] font-sans bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                    PRO
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 block -mt-0.5">
                  منظومة الحوكمة والتعليم
                </span>
              </div>
            </Link>
          </div>

          {/* الدور والصف الدراسي النشط */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 space-y-2">
            <div
              suppressHydrationWarning
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-bold ${roleTheme.badgeBg}`}
            >
              <div className="flex items-center gap-2">
                <span
                  suppressHydrationWarning
                  className={`w-2 h-2 rounded-full ${roleTheme.accentDot} animate-pulse`}
                />
                <span suppressHydrationWarning>{roleNameArabic}</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono">V2.6</span>
            </div>

            {/* بطاقة الصف الدراسي للطالب */}
            {effectiveRole === 'STUDENT' && (
              <div suppressHydrationWarning className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/80 text-xs">
                <div className="text-[10px] text-blue-700 font-bold">
                  الصف الدراسي المعتمد
                </div>
                <div className="font-extrabold text-slate-900 leading-tight mt-0.5">{activeGradeDetails.nameAr}</div>
              </div>
            )}
          </div>

          {/* روابط القائمة */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              القائمة الرئيسية
            </div>
            {currentNav.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? `${roleTheme.activeLink} border-r-4 font-bold`
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-inherit' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* معلومات الحساب الشخصي في الأسفل */}
          <div suppressHydrationWarning className="p-3 border-t border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p suppressHydrationWarning className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p suppressHydrationWarning className="text-[10px] text-slate-500 truncate font-mono">{currentUser.email}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                title="تسجيل الخروج والتبديل"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* مساحة المحتوى الرئيسية */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* شريط التنقل العلوي (Navbar) */}
          <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            {/* يمين: قائمة الجوال والبحث */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="فتح القائمة الجانبية"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative hidden sm:block w-64 md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث عن مادة، مدرس، أو باب دراسي..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
            </div>

            {/* يسار: شارة الصف، زر شحن الكارت، الإشعارات، الحساب */}
            <div className="flex items-center gap-3">
              {/* شارة الصف الدراسي للطالب */}
              {effectiveRole === 'STUDENT' && (
                <div suppressHydrationWarning className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>{activeGradeDetails.nameAr}</span>
                </div>
              )}

              {/* زر شحن كارت سريع */}
              {effectiveRole === 'STUDENT' && (
                <button
                  type="button"
                  onClick={() => setQuickRedeemOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition hover:scale-105"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>شحن كارت</span>
                </button>
              )}

              {/* الإشعارات */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
                  title="الإشعارات"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
                </button>

                {notificationsOpen && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white p-4 shadow-xl border border-slate-200 z-50 text-right animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">
                        إشعارات وتنبيهات المنصة
                      </span>
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                        تحديد كمقروء
                      </button>
                    </div>
                    <div className="mt-3 space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-slate-700">
                        <p className="font-bold text-blue-800">تم رفع الباب الأول في الفيزياء</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          نشر الأستاذ أحمد سامي محاضرة كيرشوف مع مذكرة الشرح.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-slate-700">
                        <p className="font-bold text-amber-800">تذكير بموعد فك حجب الامتحان</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          سيتم إتاحة درجات ونموذج إجابة امتحان الفصل الأول قريباً.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* بطاقة الحساب الشخصي */}
              <div suppressHydrationWarning className="flex items-center gap-2 pr-3 border-r border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="hidden md:block text-right">
                  <span suppressHydrationWarning className="text-xs font-bold text-slate-900 block leading-tight">
                    {currentUser.name}
                  </span>
                  <span suppressHydrationWarning className="text-[10px] text-slate-500 block font-medium">
                    {roleNameArabic}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* محتوى الصفحة */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {!isLiveDbReady ? (
              <div className="min-h-[55vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-base font-extrabold text-slate-900">
                    جاري تحميل ومزامنة البيانات من قاعدة البيانات...
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    يتم الآن جلب أحدث المحاضرات والامتحانات والحسابات المسجلة مباشرة من سيرفر YA7EDU VPS
                  </p>
                </div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer (Responsive Slide-over) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative mr-auto w-72 max-w-[85vw] h-full bg-white border-l border-slate-200 flex flex-col z-10 text-right shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-slate-900">YA7EDU</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className={`p-2 rounded-xl border text-xs font-bold text-center ${roleTheme.badgeBg}`}>
                {roleNameArabic}
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {currentNav.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? `${roleTheme.activeLink} font-bold`
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>تسجيل الخروج والتبديل</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* نافذة شحن الكارت السريع */}
      {quickRedeemOpen && (
        <SubscriptionModal
          isOpen={quickRedeemOpen}
          onClose={() => setQuickRedeemOpen(false)}
          instructorId="inst_ahmed_samy"
          instructorName="الأستاذ أحمد سامي"
          instructorAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
          subjectId="subj_g3_phys"
          subjectName="الفيزياء (Physics)"
        />
      )}
    </div>
  );
}
