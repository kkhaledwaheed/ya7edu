'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { RoleGuard } from '@/components/auth/role-guard';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <RoleGuard allowedRoles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}>
        {children}
      </RoleGuard>
    </DashboardShell>
  );
}
