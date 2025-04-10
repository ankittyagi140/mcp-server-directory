"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Suspense } from "react";
import { ShieldAlert } from "lucide-react";
import BlogForm from "@/components/BlogForm";

// Loading fallback UI
function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
      <span className="ml-3">Loading...</span>
    </div>
  );
}

export default function NewBlogPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <Loading />;
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
        <h1 className="text-3xl font-bold tracking-tight">Create New Blog Post</h1>
        <p className="text-muted-foreground">
          Create and publish a new technical blog post.
        </p>
      </div>
      
      <div className="mx-auto max-w-3xl">
        <Suspense fallback={<Loading />}>
          <BlogForm />
        </Suspense>
      </div>
    </div>
  );
} 