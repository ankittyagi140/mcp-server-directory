"use client";

import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial auth session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          throw error;
        }        
        setSession({
          user: data.session?.user ? {
            id: data.session.user.id,
            email: data.session.user.email || undefined,
            role: data.session.user.user_metadata?.role || undefined,
          } : null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error getting session:', error);
        setSession({ user: null, isLoading: false });
      }
    };

    getInitialSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {        
        // Set new session data
        setSession({
          user: newSession?.user ? {
            id: newSession.user.id,
            email: newSession.user.email || undefined,
            role: newSession.user.user_metadata?.role || undefined,
          } : null,
          isLoading: false,
        });
        
        // If we have a logout event, make sure to clear any leftover cookies
        if (event === 'SIGNED_OUT' && typeof window !== 'undefined') {
          // Clear any lingering supabase cookies
          document.cookie = 'sb-access-token=; max-age=0; path=/;';
          document.cookie = 'sb-refresh-token=; max-age=0; path=/;';
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
} 