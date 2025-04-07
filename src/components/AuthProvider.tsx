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
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession({
          user: data.session?.user ? {
            id: data.session.user.id,
            email: data.session.user.email || undefined,
            role: data.session.user.role || undefined,
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
        console.log(`Auth event: ${event}`);
        
        setSession({
          user: newSession?.user ? {
            id: newSession.user.id,
            email: newSession.user.email || undefined,
            role: newSession.user.role || undefined,
          } : null,
          isLoading: false,
        });
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