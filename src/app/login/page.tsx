import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign In | MCP Server Directory",
  description: "Sign in to your MCP Server Directory account using Google or GitHub authentication.",
};

// Loading fallback for the login form
function LoginFormLoading() {
  return (
    <div className="p-5 md:p-7 flex justify-center items-center min-h-[150px] md:min-h-[180px]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 md:h-10 md:w-10 animate-spin rounded-full border-3 border-gray-200 border-t-green-600"></div>
        <span className="text-sm md:text-base text-gray-600">Loading sign in options...</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-10 md:py-16 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/mcp-server-directory.png"
            alt="MCP Server Directory"
            width={48}
            height={48}
            className="rounded mb-2"
            priority
          />
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome to MCP Server Directory</h2>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-md">
          <Suspense fallback={<LoginFormLoading />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 