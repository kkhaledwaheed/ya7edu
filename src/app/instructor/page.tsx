'use client';

import React from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import {
  DollarSign,
  Users,
  Star,
  BookOpen,
  PlusCircle,
  TrendingUp,
  ArrowLeft,
  Clock,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { InstructorSubscriptionCard } from '@/components/instructor/instructor-subscription-card';

export default function InstructorDashboardPage() {
  const { currentUser, payoutRequests, instructorContents } = useLMS();

  const myContent = instructorContents[0]; // Mr. Ahmed Samy
  const totalStudents = myContent?.totalSubscribers || 4820;
  const pendingPayoutTotal = payoutRequests
    .filter(p => p.status === 'PENDING')
    .reduce((acc, p) => acc + p.amount, 0);

  const earningsChartData = [
    { month: 'أكتوبر', earnings: 14200, enrollments: 80 },
    { month: 'نوفمبر', earnings: 21800, enrollments: 120 },
    { month: 'ديسمبر', earnings: 29400, enrollments: 190 },
    { month: 'يناير', earnings: 38500, enrollments: 240 },
    { month: 'فبراير', earnings: 49800, enrollments: 310 },
    { month: 'مارس', earnings: 62400, enrollments: 380 },
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>لوحة تحكم المعلم &bull; YA7EDU Studio Pro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            أهلاً بك، {currentUser.name}! 🎓
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            متابعة إقبال الطلاب على مادتك ({myContent?.subjectName})، إحصائيات كروت الشحن المفعلة، والأرباح الشهرية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/instructor/payouts"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition border border-slate-200 shadow-sm"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>طلب سحب أرباح</span>
          </Link>
          <Link
            href="/instructor/studio"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition hover:scale-105"
          >
            <Layers className="w-4 h-4" />
            <span>استوديو الأبواب والمذكرات</span>
          </Link>
        </div>
      </div>

      {/* Instructor Platform Subscription Duration Card */}
      <InstructorSubscriptionCard instructor={currentUser} />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">إجمالي صافي الأرباح</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3 font-mono">182,450 EGP</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+22.4% مقارنة بالشهر السابق</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">مستحقات قيد الصرف</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3 font-mono">
            {pendingPayoutTotal > 0 ? `${pendingPayoutTotal.toLocaleString()} EGP` : '18,500 EGP'}
          </div>
          <div className="text-xs text-amber-600 mt-1 font-medium">قيد المراجعة الإدارية</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">الطلاب المشتركون</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3 font-mono">{totalStudents.toLocaleString()} طالب</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">+410 مشترك جديد هذا الشهر</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">تقييم الطلاب</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3 font-mono">{myContent?.rating || 4.96} / 5.0</div>
          <div className="text-xs text-purple-600 mt-1 font-medium">من 1,240 تقييماً معتمداً</div>
        </div>
      </div>

      {/* Charts Section: Revenue Area Chart & Enrollment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">تطور الإيرادات الشهرية (EGP)</h2>
              <p className="text-xs text-slate-500">صافي أرباح كروت الشحن والاشتراكات المباشرة</p>
            </div>
            <span className="text-xs font-bold text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              آخر 6 أشهر
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '14px', textAlign: 'right', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#earningsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Volume Bar Chart */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">الاشتراكات الجديدة</h2>
              <p className="text-xs text-slate-500">معدل تفعيل كروت الشحن شهرياً</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '14px', textAlign: 'right', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="enrollments" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4-Tab Content Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-bold mb-1">
            <Layers className="w-4 h-4" />
            <span>هيكل المحتوى التعليمي الأربعة (4 Tabs)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {myContent?.chapters.length} أبواب دراسية &bull; {myContent?.booklets.length} مذكرات شرح &bull; {myContent?.revisions.length} مراجعات &bull; {myContent?.ya7eduBooklets.length} مذكرات YA7EDU
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            يمكنك إضافة فصول ومحاضرات وتحديد المحاضرات المتاحة للمعاينة المجانية بدون اشتراك عبر الاستوديو.
          </p>
        </div>

        <Link
          href="/instructor/studio"
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition shrink-0 hover:scale-105"
        >
          <span>فتح الاستوديو وإضافة أبواب</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
