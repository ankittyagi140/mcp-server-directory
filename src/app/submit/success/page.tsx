import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submission Successful | MCP Server Directory",
  description: "Your Model Context Protocol server has been successfully submitted for review. Thank you for contributing to the MCP community.",
  keywords: ["MCP submission success", "Model Context Protocol", "server submitted", "submission confirmation"],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Submission Successful | MCP Server Directory",
    description: "Your Model Context Protocol server has been successfully submitted for review.",
    type: "website",
  },
};

export default function SubmitSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md rounded-lg border p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Submission Successful!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for submitting your MCP server. Our team will review your submission and you&apos;ll be notified when the status changes.
          </p>
          <div className="mt-6 space-y-4">
            <Link
              href="/submissions"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-green-600 px-8 text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 hover:scale-105 transform duration-200"
            >
              Track My Submissions
            </Link>
            <Link
              href="/servers"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-gray-300 bg-white px-8 text-base font-medium text-gray-700 shadow-lg transition-colors hover:bg-gray-50 hover:scale-105 transform duration-200"
            >
              Browse Servers
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 w-full items-center justify-center text-base font-medium text-gray-500 hover:text-gray-700"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 