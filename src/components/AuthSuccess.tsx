"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";

export default function AuthSuccess() {
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const prevUserRef = useRef<{id: string; email?: string; role?: string;} | null>(null);
  const prevLoadingRef = useRef(true);
  const toastShownRef = useRef(false);

  // Handle auth parameter in URL
  useEffect(() => {
    const auth = searchParams.get("auth");
    // If we have an auth parameter, clean up the URL
    if (auth) {
      // Replace URL without the query parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show toast only for successful login when auth exchange is complete
      // and when user exists, but skip if we're in the middle of OAuth flow
      if (auth === "success" && user && !toastShownRef.current) {
        // Only show the toast if we're not in the middle of an OAuth flow
        // Check if there's no 'code' parameter, which would indicate an OAuth redirect
        const hasOAuthCode = window.location.href.includes('code=');
        if (!hasOAuthCode) {
          toast.success("Signed in successfully!");
          toastShownRef.current = true;
        }
      }
    }
  }, [searchParams, user]);

  // Track user state changes
  useEffect(() => {
    // Skip initial render
    if (prevLoadingRef.current && isLoading) {
      prevLoadingRef.current = isLoading;
      return;
    }

    // Only show success toast when user changes from null to a value (login)
    // And only show it once per session, and there's no auth param (handled separately)
    // And ensure we're not in an OAuth flow (when a user has just clicked the button)
    const hasOAuthCode = window.location.href.includes('code=');
    
    if (!isLoading && user && !prevUserRef.current && !toastShownRef.current && 
        !searchParams.get("auth") && !hasOAuthCode) {
      toast.success("Signed in successfully!");
      toastShownRef.current = true; // Prevent showing again
    }

    // Update the previous user ref
    prevUserRef.current = user;
    prevLoadingRef.current = isLoading;
  }, [user, isLoading, searchParams]);
  
  // This component doesn't render anything visually
  return null;
} 