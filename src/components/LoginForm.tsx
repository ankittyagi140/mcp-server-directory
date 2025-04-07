"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithGoogle, signInWithGitHub } from "@/lib/auth";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    const signInPromise = new Promise<void>((resolve, reject) => {
      signInWithGoogle(redirectPath)
        .then(({ error }) => {
          if (error) {
            reject(error);
          } else {
            // Success - will redirect automatically
            resolve();
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    
    toast.promise(
      signInPromise,
      {
        loading: 'Signing in with Google...',
        success: 'Signed in successfully!',
        error: (err) => `Failed to sign in: ${err.message || 'Please try again'}`
      }
    );
    
    try {
      await signInPromise;
    } catch (err: unknown) {
      console.error("Google login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in with Google. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    const signInPromise = new Promise<void>((resolve, reject) => {
      signInWithGitHub(redirectPath)
        .then(({ error }) => {
          if (error) {
            reject(error);
          } else {
            // Success - will redirect automatically
            resolve();
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    
    toast.promise(
      signInPromise,
      {
        loading: 'Signing in with GitHub...',
        success: 'Signed in successfully!',
        error: (err) => `Failed to sign in: ${err.message || 'Please try again'}`
      }
    );
    
    try {
      await signInPromise;
    } catch (err: unknown) {
      console.error("GitHub login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in with GitHub. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-bold">Sign In</h1>
        <p className="text-xs md:text-sm mt-1 md:mt-2 text-muted-foreground">
          Choose your preferred sign in method
        </p>
        {redirectPath !== '/' && (
          <p className="mt-1 md:mt-2 text-xs md:text-sm text-amber-600 bg-amber-50 rounded-md p-2 md:p-3">
            You&apos;ll be redirected after signing in
          </p>
        )}
      </div>

      <div className="space-y-3 md:space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-2 md:p-3 text-xs md:text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 md:gap-3 rounded-lg border border-gray-300 bg-white px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        <button
          onClick={handleGitHubSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 md:gap-3 rounded-lg border border-gray-300 bg-white px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
} 