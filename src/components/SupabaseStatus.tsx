"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SupabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error" | "config-missing">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    setStatus("loading");
    setErrorMessage(null);
    
    try {
      // Check if Supabase URL is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || supabaseUrl === 'your-supabase-url' || 
          !supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
        setStatus("config-missing");
        setErrorMessage("Supabase credentials not configured");
        return;
      }

      // Try a simple query to verify connection
      const { error } = await supabase
        .from("servers")
        .select("count")
        .limit(1)
        .throwOnError();
      
      if (error) {
        throw error;
      }
      
      setStatus("connected");
    } catch (error) {
      console.error("Supabase connection error:", error);
      setStatus("error");
      
      // Provide more detailed error message
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setErrorMessage("Network error: Unable to reach the database");
        } else if (error.message.includes("relation") && error.message.includes("does not exist")) {
          setErrorMessage("Table 'servers' does not exist. Please run the SQL setup scripts.");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("Could not connect to database");
      }
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true);
    await checkConnection();
    setIsRetrying(false);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-full bg-amber-100 py-1 px-3 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>Checking database connection...</span>
      </div>
    );
  }

  if (status === "config-missing") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-full bg-amber-100 py-1 px-3 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>Setup required: Supabase credentials not configured</span>
        <button 
          onClick={handleRetry}
          className="ml-2 rounded bg-amber-200 px-1.5 text-amber-800 hover:bg-amber-300 dark:bg-amber-800/30 dark:text-amber-300"
          disabled={isRetrying}
        >
          {isRetrying ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Retry"}
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-full bg-red-100 py-1 px-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
        <XCircle className="h-3.5 w-3.5" />
        <span>{errorMessage || "Database connection error"}</span>
        <button 
          onClick={handleRetry}
          className="ml-2 rounded bg-red-200 px-1.5 text-red-800 hover:bg-red-300 dark:bg-red-800/30 dark:text-red-300"
          disabled={isRetrying}
        >
          {isRetrying ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Retry"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 rounded-full bg-green-100 py-1 px-3 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
      <CheckCircle className="h-3.5 w-3.5" />
      <span>Database connected</span>
    </div>
  );
} 