import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { ApiError, auth } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  let admin;
  try {
    const res = await auth.me();
    admin = res.admin;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect('/admin/login');
    throw err;
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar admin={admin} />
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8">{children}</main>
    </div>
  );
}
