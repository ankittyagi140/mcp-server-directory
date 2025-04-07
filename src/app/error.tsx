"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Metadata } from "next";

// Note: Since this is a client component, metadata needs to be exported from a parent page.tsx
// This doesn't directly use metadata but we'll define it for reference
export const errorMetadata: Metadata = {
  title: "Error | MCP Server Directory",
  description: "An error occurred while loading the requested page. Please try again later.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex h-[calc(100vh-16rem)] flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">
          We apologize for the inconvenience. Please try again later.
        </p>
        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 