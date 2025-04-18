"use client";

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import AdminDashboard from "@/components/AdminDashboard";
import { ShieldAlert, BookOpen, FileText, PlusCircle } from "lucide-react";
import Link from 'next/link';

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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage server and client submissions and blog content.
        </p>
      </div>
      
      {/* Admin quick actions */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <BookOpen className="mb-4 h-10 w-10 text-green-600" />
          <h2 className="mb-2 text-xl font-bold">Blog Management</h2>
          <p className="mb-4 text-center text-sm text-slate-600">
            Create and manage blog content and articles.
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              View All Posts
            </Link>
          </div>
        </div>
        
      </div>
      
      <Suspense fallback={<AdminLoading />}>
        <AdminDashboard />
      </Suspense>
    </div>
  );
} 