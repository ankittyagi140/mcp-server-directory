import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | MCP Server Directory",
  description: "Sign in to your MCP Server Directory account using Google or GitHub authentication.",
};

// Loading fallback for the login form
function LoginFormLoading() {
  return (
    <div className="p-4 md:p-6 flex justify-center items-center">
      <div className="h-6 w-6 md:h-8 md:w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
      <span className="ml-3 text-sm md:text-base">Loading sign in options...</span>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-8 md:py-12 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Suspense fallback={<LoginFormLoading />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 