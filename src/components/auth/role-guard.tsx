'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import { UserRole } from '@/lib/types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { currentUser, isHydrated } = useLMS();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) return <>{children}</>;

  const isAuthorized = allowedRoles.includes(currentUser.role);

  if (!isAuthorized) {
    const recommendedRole = allowedRoles[0];
    const destination =
      currentUser.role === 'ADMIN'
        ? '/admin'
        : currentUser.role === 'INSTRUCTOR'
        ? '/instructor'
        : '/student';

    const roleNameAr: Record<UserRole, string> = {
      ADMIN: 'مسؤول المنصة (Admin)',
      INSTRUCTOR: 'المعلم (Instructor)',
      STUDENT: 'الطالب (Student)'
    };

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 ring-1 ring-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2 border border-rose-200">
          <span>نظام حماية الصلاحيات (RBAC Protected)</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">الوصول مقيد لهذه الصفحة</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-2">
          يتطلب هذا القسم صلاحيات <strong>{allowedRoles.map(r => roleNameAr[r]).join(' أو ')}</strong>. حسابك الحالي هو{' '}
          <strong className="text-slate-900">{currentUser.name}</strong> ({roleNameAr[currentUser.role]}).
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => router.push(destination)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition"
          >
            <span>العودة إلى بوابتي المصرح بها</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition"
          >
            <span>تسجيل الدخول بحساب آخر</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
