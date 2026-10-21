'use client';

import React from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/lms-context';
import {
  DollarSign,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Ticket,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  mockRevenueTrends,
  mockCategoryDistribution,
  mockAdminStats
} from '@/lib/mock-data/analytics';

export default function AdminOverviewPage() {
  const { courses, payoutRequests, users, vouchers } = useLMS();

  const pendingCourses = courses.filter(c => c.status === 'PENDING_REVIEW');
  const pendingPayouts = payoutRequests.filter(p => p.status === 'PENDING');
  const pendingUsers = users.filter(u => u.status === 'PENDING_APPROVAL');

  const pendingPayoutTotal = pendingPayouts.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة تحكم إدارة منصة YA7EDU والعمليات المالية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مركز القيادة والحوكمة الشاملة
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            متابعة نمو الاشتراكات، إصدار وتوليد كروت الشحن، مراجعة طلبات المعلمين، وصرف الأرباح.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/grades"
            className="px-4 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-2 transition"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>إدارة الصفوف والمواد</span>
          </Link>
          <Link
            href="/admin/vouchers"
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 transition"
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>توليد كروت شحن ({vouchers.length})</span>
          </Link>
          <Link
            href="/admin/payouts"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
          >
            <DollarSign className="w-4 h-4" />
            <span>صرف المستحقات (${pendingPayoutTotal.toLocaleString()})</span>
          </Link>
        </div>
      </div>

      {/* Critical Platform Action Alert Cards */}
      {(pendingCourses.length > 0 || pendingPayouts.length > 0 || pendingUsers.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingCourses.length > 0 && (
            <Link
              href="/admin/courses"
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">مراجعة المحتوى</div>
                  <div className="text-[11px] text-amber-300">{pendingCourses.length} دورات بانتظار الاعتماد</div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </Link>
          )}

          {pendingPayouts.length > 0 && (
            <Link
              href="/admin/payouts"
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">طلبات السحب المالي</div>
                  <div className="text-[11px] text-emerald-300">
                    {pendingPayouts.length} طلبات (${pendingPayoutTotal.toLocaleString()})
                  </div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
            </Link>
          )}

          {pendingUsers.length > 0 && (
            <Link
              href="/admin/users"
              className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 hover:border-indigo-500/60 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">انضمام المعلمين الجدد</div>
                  <div className="text-[11px] text-indigo-300">{pendingUsers.length} طلب بانتظار التحقق</div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
            </Link>
          )}
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl glass-card border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">إجمالي حجم الاشتراكات (GMV)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3 font-mono">${mockAdminStats.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% نمو ربع سنوي</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">نسبة عمولة المنصة (15%)</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-3 font-mono">
            ${mockAdminStats.platformCommissionCut.toLocaleString()}
          </div>
          <div className="text-xs text-indigo-300 mt-1">صافي أرباح تشغيل المنصة</div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">إجمالي الطلاب المسجلين</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-3 font-mono">
            {mockAdminStats.totalStudents.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">معدل البقاء والنشاط: 97.9%</div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">كروت الشحن المتوفرة</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 mt-3 font-mono">
            {vouchers.filter(v => v.status === 'AVAILABLE').length} كارت
          </div>
          <div className="text-xs text-amber-400/80 mt-1">جاهزة للتوزيع والشحن</div>
        </div>
      </div>

      {/* Interactive Financial & Platform Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Revenue vs Platform Commission */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">إيرادات الاشتراكات وصافي أرباح المعلمين ($)</h2>
              <p className="text-xs text-gray-400">معدل التحصيل المالي ونسبة المنصة خلال 6 أشهر</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> إجمالي التحصيل
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> عمولة المنصة
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="adminCutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#adminRevGrad)" />
                <Area type="monotone" dataKey="platformCut" stroke="#06b6d4" strokeWidth={2} fill="url(#adminCutGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="p-6 rounded-3xl glass-card border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">توزيع الاشتراكات حسب المادة</h2>
              <p className="text-xs text-gray-400">نسبة إقبال الطلاب لكل تخصص</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {mockCategoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {mockCategoryDistribution.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-gray-300 truncate">{cat.name}</span>
                <span className="text-gray-400 font-mono font-bold mr-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
