'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import { UserRole, UserStatus } from '@/lib/types';
import {
  Users,
  Search,
  Filter,
  Eye,
  Shield,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Ban,
  ArrowLeft,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminUsersPage() {
  const router = useRouter();
  const {
    users,
    impersonateUser,
    toggleUserStatus,
    approveInstructorOnboarding,
    changeUserRole,
    currentUser
  } = useLMS();

  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;

    return true;
  });

  const pendingOnboarding = users.filter(u => u.status === 'PENDING_APPROVAL');

  const handleImpersonate = (userId: string, role: UserRole) => {
    impersonateUser(userId);
    const dest = role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : '/student';
    router.push(dest);
  };

  const handleApproveInstructor = (userId: string, name: string) => {
    approveInstructorOnboarding(userId);
    setAlertNotice(`تمت الموافقة بنجاح على انضمام ${name} كمعلم معتمد على منصة YA7EDU!`);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>إدارة الحسابات وصلاحيات المنصة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            إدارة المستخدمين وانتحال الشخصية التجريبي
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            إدارة حسابات المعلمين والطلاب، تفعيل الحسابات المعلقة، وتجربة المنصة بأي هوية في ثوانٍ.
          </p>
        </div>
      </div>

      {alertNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{alertNotice}</span>
          </div>
          <button onClick={() => setAlertNotice(null)} className="text-emerald-400 hover:text-white text-xs">
            إغلاق
          </button>
        </div>
      )}

      {/* Instructor Onboarding Approval Queue Section */}
      {pendingOnboarding.length > 0 && (
        <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              طلبات انضمام المعلمين الجدد ({pendingOnboarding.length} بانتظار الاعتماد)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOnboarding.map(applicant => (
              <div
                key={applicant.id}
                className="p-4 rounded-2xl glass-card border border-gray-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={applicant.avatar} alt={applicant.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="text-xs font-bold text-white">{applicant.name}</h3>
                    <p className="text-[11px] text-gray-400">{applicant.email}</p>
                    <p className="text-[10px] text-cyan-300 mt-0.5">{applicant.headline}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleApproveInstructor(applicant.id, applicant.name)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>اعتماد المعلم</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="p-5 rounded-2xl glass-card border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو البريد الإلكتروني..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5" />
            <span>الدور:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">جميع الأدوار</option>
              <option value="ADMIN">مسؤول (Admin)</option>
              <option value="INSTRUCTOR">معلم (Instructor)</option>
              <option value="STUDENT">طالب (Student)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>الحالة:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="ACTIVE">نشط (Active)</option>
              <option value="SUSPENDED">معلق (Suspended)</option>
              <option value="PENDING_APPROVAL">بانتظار الاعتماد</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users CRUD Table */}
      <div className="rounded-3xl glass-card border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">المستخدم</th>
                <th className="py-3.5 px-4">الدور والصلاحية</th>
                <th className="py-3.5 px-4">حالة الحساب</th>
                <th className="py-3.5 px-4">تاريخ الانضمام</th>
                <th className="py-3.5 px-4 text-center">انتحال الهوية (Impersonate)</th>
                <th className="py-3.5 px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredUsers.map(user => {
                const isCurrentUser = user.id === currentUser.id;

                return (
                  <tr key={user.id} className="hover:bg-gray-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-700"
                        />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {user.name}
                            {isCurrentUser && (
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 rounded font-mono">
                                أنت
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        onChange={e => changeUserRole(user.id, e.target.value as UserRole)}
                        className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="INSTRUCTOR">INSTRUCTOR</option>
                        <option value="STUDENT">STUDENT</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : user.status === 'SUSPENDED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-400'
                              : user.status === 'SUSPENDED'
                              ? 'bg-rose-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        <span>{user.status === 'ACTIVE' ? 'نشط' : user.status === 'SUSPENDED' ? 'معلق' : 'قيد المراجعة'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 font-mono">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {!isCurrentUser ? (
                        <button
                          onClick={() => handleImpersonate(user.id, user.role)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs inline-flex items-center gap-1.5 transition"
                          title="تجربة المنصة بهوية هذا المستخدم"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>انتحال الهوية</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-500 italic">الجلسة الحالية</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-left">
                      {!isCurrentUser && (
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            user.status === 'ACTIVE'
                              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'تعليق الحساب' : 'إعادة التفعيل'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
