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
  Layers,
  Shield,
  MessageCircle
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
  const { courses, payoutRequests, users, vouchers, subscriptions } = useLMS();

  const pendingCourses = courses.filter(c => c.status === 'PENDING_REVIEW');
  const pendingPayouts = payoutRequests.filter(p => p.status === 'PENDING');
  const pendingUsers = users.filter(u => u.status === 'PENDING_APPROVAL');
  const pendingWhatsAppSubs = subscriptions.filter(s => s.status === 'PENDING_ADMIN_PAYMENT');

  const pendingPayoutTotal = pendingPayouts.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>لوحة تحكم إدارة منصة YA7EDU والعمليات المالية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            مركز القيادة والحوكمة الشاملة
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            متابعة نمو الاشتراكات، إصدار وتوليد كروت الشحن الورقية، مراجعة طلبات المعلمين، وصرف الأرباح.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/grades"
            className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-2 transition shadow-sm"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>إدارة الصفوف والمواد</span>
          </Link>
          <Link
            href="/admin/vouchers"
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 transition shadow-sm"
          >
            <Ticket className="w-4 h-4 text-amber-600" />
            <span>توليد كروت شحن ({vouchers.length})</span>
          </Link>
          <Link
            href="/admin/payouts"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition hover:scale-105"
          >
            <DollarSign className="w-4 h-4" />
            <span>صرف المستحقات (${pendingPayoutTotal.toLocaleString()})</span>
          </Link>
        </div>
      </div>

      {/* WhatsApp Subscription Requests Pending Admin Activation */}
      {pendingWhatsAppSubs.length > 0 && (
        <Link
          href="/admin/users"
          className="p-4 rounded-3xl bg-emerald-50 border border-emerald-300 hover:border-emerald-400 transition flex items-center justify-between group shadow-sm hover:shadow-md animate-in fade-in"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 ring-2 ring-emerald-200">
              <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>طلبات اشتراك عبر الواتساب بانتظار تفعيل الأدمن</span>
                <span className="text-[10px] bg-emerald-600 text-white font-mono px-2.5 py-0.5 rounded-full font-bold">
                  {pendingWhatsAppSubs.length} طلبات جديدة
                </span>
              </div>
              <div className="text-xs text-emerald-700 mt-0.5 font-medium">
                قام طلاب بالتحويل إلى رقم الإدارة (01090138676) ومرفق طلباتهم بانتظار تأكيدك وتفعيل اشتراكهم فوراً.
              </div>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-emerald-600 group-hover:-translate-x-1.5 transition shrink-0" />
        </Link>
      )}

      {/* Critical Platform Action Alert Cards */}
      {(pendingCourses.length > 0 || pendingPayouts.length > 0 || pendingUsers.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingCourses.length > 0 && (
            <Link
              href="/admin/courses"
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-300 transition flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">مراجعة المحتوى</div>
                  <div className="text-[11px] text-amber-700 font-medium">{pendingCourses.length} دورات بانتظار الاعتماد</div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-amber-600 group-hover:-translate-x-1 transition" />
            </Link>
          )}

          {pendingPayouts.length > 0 && (
            <Link
              href="/admin/payouts"
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">طلبات السحب المالي</div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {pendingPayouts.length} طلبات (${pendingPayoutTotal.toLocaleString()})
                  </div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:-translate-x-1 transition" />
            </Link>
          )}

          {pendingUsers.length > 0 && (
            <Link
              href="/admin/users"
              className="p-4 rounded-2xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">انضمام المعلمين الجدد</div>
                  <div className="text-[11px] text-blue-700 font-medium">{pendingUsers.length} طلب بانتظار التحقق</div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-1 transition" />
            </Link>
          )}
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">إجمالي حجم الاشتراكات (GMV)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3 font-mono">${mockAdminStats.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% نمو ربع سنوي</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">نسبة عمولة المنصة (15%)</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-3 font-mono">
            ${mockAdminStats.platformCommissionCut.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 mt-1 font-medium">صافي أرباح تشغيل المنصة</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">إجمالي الطلاب المسجلين</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3 font-mono">
            {mockAdminStats.totalStudents.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">معدل البقاء والنشاط: 97.9%</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">كروت الشحن المتوفرة</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-3 font-mono">
            {vouchers.filter(v => v.status === 'AVAILABLE').length} كارت
          </div>
          <div className="text-xs text-amber-700 mt-1 font-medium">جاهزة للتوزيع والشحن</div>
        </div>
      </div>

      {/* Financial & Platform Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Revenue vs Platform Commission */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">إيرادات الاشتراكات وصافي أرباح المعلمين ($)</h2>
              <p className="text-xs text-slate-500">معدل التحصيل المالي ونسبة المنصة خلال 6 أشهر</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> إجمالي التحصيل
              </span>
              <span className="flex items-center gap-1.5 text-sky-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> عمولة المنصة
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="adminCutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '14px', textAlign: 'right', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#adminRevGrad)" />
                <Area type="monotone" dataKey="platformCut" stroke="#0284c7" strokeWidth={2} fill="url(#adminCutGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">توزيع الاشتراكات حسب المادة</h2>
              <p className="text-xs text-slate-500">نسبة إقبال الطلاب لكل تخصص</p>
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
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '14px', textAlign: 'right', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {mockCategoryDistribution.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-700 truncate">{cat.name}</span>
                <span className="text-slate-500 font-mono font-bold mr-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
