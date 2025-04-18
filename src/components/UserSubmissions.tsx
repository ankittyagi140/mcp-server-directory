"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getUserSubmissions } from "@/lib/supabase";
import type { ServerEntry, ClientEntry } from "@/lib/supabase";
import { ClockIcon, CheckCircle, XCircle, ArrowRight, Loader2, Server, Monitor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type TabType = 'pending' | 'approved' | 'rejected';
type SubmissionType = 'all' | 'servers' | 'clients';

type SubmissionEntry = ServerEntry | ClientEntry;

// Type guard to check if an entry is a ServerEntry
function isServerEntry(entry: SubmissionEntry): entry is ServerEntry {
  return (entry as ServerEntry).endpoint_url !== undefined;
}

// Type guard to check if an entry is a ClientEntry
function isClientEntry(entry: SubmissionEntry): entry is ClientEntry {
  return (entry as ClientEntry).client_url !== undefined;
}

export default function UserSubmissions() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('all');
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    async function fetchSubmissions() {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const allSubmissions = await getUserSubmissions(user.id);
        
        // Filter by type if needed
        let filteredSubmissions = allSubmissions;
        if (submissionType === 'servers') {
          filteredSubmissions = allSubmissions.filter(isServerEntry);
        } else if (submissionType === 'clients') {
          filteredSubmissions = allSubmissions.filter(isClientEntry);
        }
        
        // Calculate counts for each status
        const counts = {
          pending: filteredSubmissions.filter(sub => sub.status === 'pending').length,
          approved: filteredSubmissions.filter(sub => sub.status === 'approved').length,
          rejected: filteredSubmissions.filter(sub => sub.status === 'rejected').length
        };
        setStats(counts);
        
        // Filter submissions based on active tab
        setSubmissions(filteredSubmissions.filter(submission => submission.status === activeTab));
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load your submissions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSubmissions();
  }, [user, activeTab, submissionType]);

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

  // Tab definitions with explicit colors and styling
  const tabs = [
    { id: 'pending', label: 'Pending', icon: <ClockIcon className="h-4 w-4 mr-1" />, count: stats.pending, bgColor: 'bg-amber-100', textColor: 'text-amber-800', borderColor: 'border-amber-500' },
    { id: 'approved', label: 'Approved', icon: <CheckCircle className="h-4 w-4 mr-1" />, count: stats.approved, bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-500' },
    { id: 'rejected', label: 'Rejected', icon: <XCircle className="h-4 w-4 mr-1" />, count: stats.rejected, bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-500' }
  ];

  // Type filter definitions
  const typeFilters = [
    { id: 'all', label: 'All Submissions' },
    { id: 'servers', label: 'Servers', icon: <Server className="h-4 w-4 mr-1" /> },
    { id: 'clients', label: 'Clients', icon: <Monitor className="h-4 w-4 mr-1" /> }
  ];

  const getEmptyStateForTab = () => {
    return (
      <div className="text-center py-12 px-4">
        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          {activeTab === 'pending' && <ClockIcon className="h-8 w-8 text-amber-500" />}
          {activeTab === 'approved' && <CheckCircle className="h-8 w-8 text-green-500" />}
          {activeTab === 'rejected' && <XCircle className="h-8 w-8 text-red-500" />}
        </div>
        <h3 className="text-xl font-semibold mb-2">No {activeTab} submissions</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          {activeTab === 'pending' && "You don't have any pending submissions awaiting review."}
          {activeTab === 'approved' && "You don't have any approved submissions yet."}
          {activeTab === 'rejected' && "You don't have any rejected submissions."}
        </p>
        <Link 
          href="/submit" 
          className="inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-6 text-sm font-medium text-white shadow-lg transition-colors hover:bg-green-700"
        >
          Submit to Directory
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {typeFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSubmissionType(filter.id as SubmissionType)}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${submissionType === filter.id ? 
                'bg-green-100 text-green-800 border border-green-300' : 
                'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>
      
      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-0 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              relative flex items-center py-3 px-4 text-sm font-medium rounded-t-lg transition-colors cursor-pointer
              ${activeTab === tab.id ? 
                `${tab.textColor} border-b-2 ${tab.borderColor}` : 
                'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="flex items-center">
              {tab.icon}
              {tab.label}
            </span>
            <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.id ? tab.bgColor : 'bg-gray-100'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
      
      {submissions.length === 0 ? getEmptyStateForTab() : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Submissions</h2>
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
                      <div className="flex items-center">
                        <h3 className="font-semibold text-lg">{submission.name}</h3>
                        <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {isServerEntry(submission) ? (
                            <><Server className="h-3 w-3 mr-1" /> Server</>
                          ) : (
                            <><Monitor className="h-3 w-3 mr-1" /> Client</>
                          )}
                        </span>
                      </div>
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
                      <p className="mt-1">
                        {isServerEntry(submission) ? (
                          <>Endpoint: <a href={submission.endpoint_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">{submission.endpoint_url}</a></>
                        ) : (
                          <>URL: <a href={(submission as ClientEntry).client_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">{(submission as ClientEntry).client_url}</a></>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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