'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { RoleGuard } from '@/components/auth/role-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <RoleGuard allowedRoles={['ADMIN']}>
        {children}
      </RoleGuard>
    </DashboardShell>
  );
}
