'use client';

import React from 'react';
import { useLMS } from '@/context/lms-context';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ImpersonationBanner() {
  const { currentUser, impersonatedByAdmin, stopImpersonating } = useLMS();
  const router = useRouter();

  if (!impersonatedByAdmin) return null;

  const handleExit = () => {
    stopImpersonating();
    router.push('/admin/users');
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
        <span>
          <strong>جلسة انتحال الشخصية نشطة (Admin Impersonation):</strong> أنت تستعرض المنصة حالياً بصفتك{' '}
          <span className="underline font-bold">{currentUser.name}</span> ({currentUser.email} &bull; الدور:{' '}
          <span className="font-mono">{currentUser.role}</span>).
        </span>
      </div>
      <button
        onClick={handleExit}
        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/30 hover:bg-black/50 transition font-bold text-xs text-white"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>إنهاء الجلسة والعودة للإدارة</span>
      </button>
    </div>
  );
}
