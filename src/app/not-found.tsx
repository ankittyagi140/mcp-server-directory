import Link from "next/link";
import type { Metadata } from "next";

// This metadata is for reference and won't be used directly in the not-found component
// To actually use it, we would need a parent layout that implements it
export const notFoundMetadata: Metadata = {
  title: "Page Not Found | MCP Server Directory",
  description: "The requested page could not be found. Browse our MCP Server Directory or return to the homepage.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="container flex h-[calc(100vh-16rem)] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">404 - Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Return Home
          </Link>
          <Link
            href="/servers"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Browse Servers
          </Link>
        </div>
      </div>
    </div>
  );
} 