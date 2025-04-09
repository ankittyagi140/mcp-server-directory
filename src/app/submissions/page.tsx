"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import UserSubmissions from "@/components/UserSubmissions";

// This will only be used as a reference since we can't export metadata from client components

export default function SubmissionsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/submissions");
    }
  }, [user, isLoading, router]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show login required message
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl text-center p-6 md:p-8 bg-white rounded-xl shadow-sm border border-slate-100">
          <ShieldAlert className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 md:mb-4">Authentication Required</h1>
          <p className="mb-6 text-slate-600 text-sm md:text-base max-w-md mx-auto">
            You need to be signed in to view your submissions.
          </p>
          <Link 
            href="/login?redirect=/submissions" 
            className="w-full sm:w-auto inline-flex h-10 md:h-12 items-center justify-center rounded-full bg-green-600 px-6 sm:px-8 text-sm md:text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 z-10 relative"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-8xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
          <p className="mt-2 text-muted-foreground">
            Track the status of your MCP server submissions
          </p>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm bg-white">
          <UserSubmissions />
        </div>
      </div>
    </div>
  );
} 