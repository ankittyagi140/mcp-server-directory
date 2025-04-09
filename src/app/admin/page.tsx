"use client";

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import AdminDashboard from "@/components/AdminDashboard";
import { ShieldAlert } from "lucide-react";

// Loading fallback UI for the suspense boundary
function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
      <span className="ml-3">Loading admin dashboard...</span>
    </div>
  );
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <AdminLoading />;
  }

  // If not admin, show access denied
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl text-center p-6 md:p-8 bg-white rounded-xl shadow-sm border border-slate-100">
          <ShieldAlert className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 text-red-500" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 md:mb-4">Access Denied</h1>
          <p className="mb-6 text-slate-600 text-sm md:text-base max-w-md mx-auto">
            You do not have permission to access this page. This area is restricted to administrators only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Review and manage server submissions.
        </p>
      </div>
      
      <Suspense fallback={<AdminLoading />}>
        <AdminDashboard />
      </Suspense>
    </div>
  );
} 