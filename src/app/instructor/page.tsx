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
    <div className="space-y-8 font-sans">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>لوحة تحكم المعلم &bull; YA7EDU Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            أهلاً بك، {currentUser.name}! 🎓
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            متابعة إقبال الطلاب على مادتك ({myContent?.subjectName})، إحصائيات كروت الشحن المفعلة، وسجل الأرباح.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/instructor/payouts"
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold flex items-center gap-2 transition"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>طلب سحب أرباح</span>
          </Link>
          <Link
            href="/instructor/studio"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-gray-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition"
          >
            <Layers className="w-4 h-4" />
            <span>استوديو الأبواب والمذكرات (4 Tabs)</span>
          </Link>
        </div>
      </div>

      {/* Instructor Platform Subscription Duration & Remaining Validity Card */}
      <InstructorSubscriptionCard instructor={currentUser} />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl glass-card border border-gray-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">إجمالي صافي الأرباح</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3 font-mono">182,450 EGP</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+22.4% مقارنة بالشهر السابق</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-gray-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">مستحقات قيد الصرف</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3 font-mono">
            {pendingPayoutTotal > 0 ? `${pendingPayoutTotal.toLocaleString()} EGP` : '18,500 EGP'}
          </div>
          <div className="text-xs text-amber-300 mt-1">قيد المراجعة الإدارية</div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-gray-800 hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">الطلاب المشتركون</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3 font-mono">{totalStudents.toLocaleString()} طالب</div>
          <div className="text-xs text-indigo-300 mt-1">+410 مشترك جديد هذا الشهر</div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-gray-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">تقييم الطلاب</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Star className="w-5 h-5 fill-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3 font-mono">{myContent?.rating || 4.96} / 5.0</div>
          <div className="text-xs text-purple-300 mt-1">من 1,240 تقييماً معتمداً</div>
        </div>
      </div>

      {/* Charts Section: Revenue Area Chart & Enrollment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">تطور الإيرادات الشهرية (EGP)</h2>
              <p className="text-xs text-gray-400">صافي أرباح كروت الشحن والاشتراكات المباشرة</p>
            </div>
            <span className="text-xs font-bold text-cyan-400 font-mono">آخر 6 أشهر</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', textAlign: 'right' }}
                  labelStyle={{ color: '#f3f4f6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#earningsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Volume Bar Chart */}
        <div className="p-6 rounded-3xl glass-card border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">الاشتراكات الجديدة</h2>
              <p className="text-xs text-gray-400">معدل تفعيل كروت الشحن شهرياً</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', textAlign: 'right' }}
                />
                <Bar dataKey="enrollments" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4-Tab Content Overview Card */}
      <div className="p-6 rounded-3xl glass-card border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold mb-1">
            <Layers className="w-4 h-4" />
            <span>هيكل المحتوى التعليمي الأربعة (4 Tabs)</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {myContent?.chapters.length} أبواب دراسية &bull; {myContent?.booklets.length} مذكرات شرح &bull; {myContent?.revisions.length} مراجعات &bull; {myContent?.ya7eduBooklets.length} مذكرات YA7EDU
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            يمكنك إضافة فصول جديدة وتحديد المحاضرات المتاحة للمعاينة المجانية بدون اشتراك عبر الاستوديو.
          </p>
        </div>

        <Link
          href="/instructor/studio"
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
        >
          <span>فتح الاستوديو وإضافة أبواب</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
