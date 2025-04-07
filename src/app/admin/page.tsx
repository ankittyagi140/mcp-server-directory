import { Suspense } from 'react';
import AdminDashboard from "@/components/AdminDashboard";

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