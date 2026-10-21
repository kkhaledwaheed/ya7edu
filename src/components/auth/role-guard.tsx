'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLMS } from '@/context/lms-context';
import { UserRole } from '@/lib/types';
import { ShieldAlert, ArrowLeft, Sparkles } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { currentUser, switchRole } = useLMS();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

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
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 ring-1 ring-rose-500/30">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold mb-2">
          <span>نظام حماية الصلاحيات (RBAC Protected)</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">الوصول مقيد لهذه الصفحة</h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mt-2">
          يتطلب هذا القسم صلاحيات <strong>{allowedRoles.map(r => roleNameAr[r]).join(' أو ')}</strong>. حسابك الحالي هو{' '}
          <strong className="text-white">{currentUser.name}</strong> ({roleNameAr[currentUser.role]}).
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => switchRole(recommendedRole)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>التحويل التجريبي إلى {roleNameAr[recommendedRole]}</span>
          </button>

          <button
            onClick={() => router.push(destination)}
            className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs flex items-center gap-2 transition"
          >
            <span>العودة إلى بوابتي المصرح بها</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
