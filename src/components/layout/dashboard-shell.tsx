'use client';

import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { RoleSwitcher } from './role-switcher';
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
    activeGradeDetails
  } = useLMS();

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickRedeemOpen, setQuickRedeemOpen] = useState(false);

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

  const currentNav =
    currentUser.role === 'ADMIN'
      ? adminNav
      : currentUser.role === 'INSTRUCTOR'
      ? instructorNav
      : studentNav;

  const roleNameArabic = {
    ADMIN: 'بوابة الإدارة والحوكمة',
    INSTRUCTOR: 'بوابة المعلم',
    STUDENT: 'بوابة الطالب'
  }[currentUser.role];

  const roleTheme = {
    ADMIN: {
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      activeLink: 'bg-rose-500/15 text-rose-300 border-rose-500',
      accentDot: 'bg-rose-500',
    },
    INSTRUCTOR: {
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      activeLink: 'bg-indigo-500/15 text-indigo-300 border-indigo-500',
      accentDot: 'bg-indigo-500',
    },
    STUDENT: {
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      activeLink: 'bg-cyan-500/15 text-cyan-300 border-cyan-500',
      accentDot: 'bg-cyan-500',
    },
  }[currentUser.role];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
      <ImpersonationBanner />

      {/* الشريط الإعلاني العام */}
      {platformConfig.bannerEnabled && platformConfig.bannerText && (
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-indigo-950/60 border-b border-indigo-500/20 px-4 py-1.5 text-center text-xs text-indigo-200 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{platformConfig.bannerText}</span>
        </div>
      )}

      {/* منطقة التخطيط الرئيسية */}
      <div className="flex-1 flex overflow-hidden">
        {/* الشريط الجانبي (Sidebar) */}
        <aside className="hidden lg:flex flex-col w-64 border-l border-gray-800 bg-[#0d1322]/80 backdrop-blur-xl shrink-0 z-20 text-right">
          {/* الشعار واسم المنصة */}
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-400 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 font-mono">
                  YA7<span className="text-cyan-400">EDU</span>
                  <span className="text-[10px] font-sans bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">
                    ثانوية عامة
                  </span>
                </span>
                <span className="text-[11px] text-gray-400 block -mt-0.5">
                  منصة المحاضرات والمذكرات
                </span>
              </div>
            </Link>
          </div>

          {/* الدور والصف الدراسي النشط */}
          <div className="px-4 py-3 border-b border-gray-800/80 bg-gray-900/40 space-y-2">
            <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-bold ${roleTheme.badgeBg}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${roleTheme.accentDot} animate-pulse`} />
                <span>{roleNameArabic}</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono">إصدار 2.5</span>
            </div>

            {/* بطاقة الصف الدراسي للطالب */}
            {currentUser.role === 'STUDENT' && (
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
                <div className="text-[10px] text-cyan-400 font-bold">
                  الصف الدراسي المسجل
                </div>
                <div className="font-extrabold text-white leading-tight mt-0.5">{activeGradeDetails.nameAr}</div>
              </div>
            )}
          </div>

          {/* روابط القائمة */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">
              القائمة الرئيسية
            </div>
            {currentNav.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? `${roleTheme.activeLink} border-r-4 font-bold shadow-sm`
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-inherit' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* معلومات الحساب الشخصي في الأسفل */}
          <div className="p-3 border-t border-gray-800 bg-gray-900/60">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-800/40 border border-gray-700/50">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-gray-400 truncate font-mono">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* مساحة المحتوى الرئيسية */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* شريط التنقل العلوي (Navbar) */}
          <header className="h-16 border-b border-gray-800/80 bg-[#0d1322]/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
            {/* يمين: قائمة الجوال والبحث */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative hidden sm:block w-64 md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث عن مادة، مدرس، أو باب دراسي..."
                  className="w-full bg-gray-900/80 border border-gray-800 rounded-xl pr-9 pl-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* يسار: شارة الصف، زر شحن الكارت، الإشعارات، الحساب */}
            <div className="flex items-center gap-3">
              {/* شارة الصف الدراسي للطالب */}
              {currentUser.role === 'STUDENT' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>{activeGradeDetails.nameAr}</span>
                </div>
              )}

              {/* زر شحن كارت سريع */}
              {currentUser.role === 'STUDENT' && (
                <button
                  onClick={() => setQuickRedeemOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-gray-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>شحن كارت</span>
                </button>
              )}

              {/* الإشعارات */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/70 relative"
                  title="الإشعارات"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                </button>

                {notificationsOpen && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl glass-card p-4 shadow-2xl border border-gray-800 z-50 text-right">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                      <span className="text-xs font-bold text-gray-200">
                        إشعارات وتنبيهات المنصة
                      </span>
                      <span className="text-[10px] text-cyan-400 font-bold cursor-pointer">
                        تحديد كمقروء
                      </span>
                    </div>
                    <div className="mt-3 space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-gray-300">
                        <p className="font-bold text-cyan-300">تم رفع الباب الأول في الفيزياء</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          نشر الأستاذ أحمد سامي محاضرة كيرشوف مع مذكرة الشرح.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* بطاقة الحساب الشخصي */}
              <div className="flex items-center gap-2 pr-3 border-r border-gray-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/40"
                />
                <div className="hidden md:block text-right">
                  <span className="text-xs font-bold text-gray-200 block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-gray-400 block">
                    {roleNameArabic}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* محتوى الصفحة */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* الأداة العائمة للتبديل */}
      <RoleSwitcher />

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
