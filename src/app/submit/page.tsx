"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SubmitForm from "@/components/SubmitForm";
import { InfoIcon, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SubmitPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("You must be signed in to submit a server or client");
      router.push("/login?redirect=/submit");
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
          <p className="mb-6 text-slate-600 text-sm md:text-base max-w-md mx-auto">You need to be signed in to submit to the MCP Directory.</p>
          <Link 
            href="/login?redirect=/submit" 
            className="w-full sm:w-auto inline-flex h-10 md:h-12 items-center justify-center rounded-full bg-green-600 px-6 sm:px-8 text-sm md:text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 z-10 relative"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }
  
  // If authenticated, show the form
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Submit to Directory</h1>
          <p className="mt-2 text-muted-foreground">
            Share your MCP server or client with the community.
          </p>
        </div>
        
        <div className="mb-8 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-4 dark:bg-amber-950/20">
          <div className="flex gap-3">
            <InfoIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Important Note</h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                All submissions are reviewed by our team before being published to ensure quality and relevance.
                Please provide accurate and detailed information to expedite the review process.
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <SubmitForm />
        </div>
      </div>
    </div>
  );
}