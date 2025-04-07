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
      
      // Show toast only for successful login and when user exists
      if (auth === "success" && user && !toastShownRef.current) {
        toast.success("Signed in successfully!");
        toastShownRef.current = true;
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
    if (!isLoading && user && !prevUserRef.current && !toastShownRef.current && !searchParams.get("auth")) {
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