"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getUserSubmissions } from "@/lib/supabase";
import type { ServerEntry } from "@/lib/supabase";
import { ClockIcon, CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserSubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ServerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const userSubmissions = await getUserSubmissions(user.id);
        setSubmissions(userSubmissions);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load your submissions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSubmissions();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-3 text-lg">Loading your submissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-l-red-500 bg-red-50 p-4 dark:bg-red-950/20 text-red-700 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <ClockIcon className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          You haven&apos;t submitted any MCP servers yet. Submit your first server to see it here.
        </p>
        <Link 
          href="/submit" 
          className="inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-6 text-sm font-medium text-white shadow-lg transition-colors hover:bg-green-700"
        >
          Submit a Server
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Submissions</h2>
        <Link 
          href="/submit" 
          className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center"
        >
          New Submission <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="rounded-lg border shadow-sm p-4 bg-white">
            <div className="flex items-start gap-4">
              {submission.logo_url ? (
                <Image 
                  src={submission.logo_url} 
                  alt={`${submission.name} logo`} 
                  width={48} 
                  height={48} 
                  className="rounded-md object-contain h-12 w-12"
                  unoptimized={true}
                />
              ) : (
                <div className="rounded-md bg-slate-100 h-12 w-12 flex items-center justify-center">
                  <span className="text-slate-400 text-lg font-semibold">
                    {submission.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{submission.name}</h3>
                  <StatusBadge status={submission.status} />
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                  {submission.description}
                </p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {submission.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {submission.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      +{submission.tags.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t text-sm text-slate-500">
                  <p>Submitted on {new Date(submission.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 bg-green-100 text-green-800">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Approved
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 bg-red-100 text-red-800">
          <XCircle className="h-3.5 w-3.5 mr-1" />
          Rejected
        </span>
      );
    case 'pending':
    default:
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 bg-amber-100 text-amber-800">
          <ClockIcon className="h-3.5 w-3.5 mr-1" />
          Pending Review
        </span>
      );
  }
} 