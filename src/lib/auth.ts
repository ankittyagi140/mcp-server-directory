import { supabase } from './supabase';
import { createContext, useContext } from 'react';

// Types for our auth context
export interface AuthSession {
  user: {
    id: string;
    email?: string;
    role?: string;
  } | null;
  isLoading: boolean;
}

// Get site URL - use environment variable in production or window.location.origin in development
const getSiteUrl = () => {
  // In server context
  if (typeof window === 'undefined') {
    // Use explicit environment detection
    return process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL || ''
      : 'http://localhost:3000';
  }
  
  // In browser context - use production URL if set and in production mode, otherwise use current origin
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : window.location.origin;
};

// Functions for authentication
export const signInWithGoogle = async (redirectTo?: string) => {
  try {
    const siteUrl = getSiteUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
      }
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { data: null, error };
  }
};

export const signInWithGitHub = async (redirectTo?: string) => {
  try {
    const siteUrl = getSiteUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${siteUrl}/auth/callback${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
      }
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with GitHub:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    // Refresh the entire page after signout to clear cached data and reset app state
    if (typeof window !== 'undefined') {
      // Remove any hash or query parameters
      window.location.href = window.location.origin;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

/**
 * Initiates the password reset process by sending a reset link to the provided email
 * @param email The email address of the user requesting a password reset
 * @returns An object with error field if there was an error
 */
export async function resetPassword(email: string) {
  try {
    const siteUrl = getSiteUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });
    
    if (error) {
      return { error };
    }
    
    return { error: null };
  } catch (error: unknown) {
    console.error("Reset password error:", error instanceof Error ? error.message : error);
    return { error };
  }
}

/**
 * Updates the user's password after they've received a reset link
 * @param password The new password for the user
 * @returns An object with error field if there was an error
 */
export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      return { error };
    }
    
    return { error: null };
  } catch (error: unknown) {
    console.error("Update password error:", error instanceof Error ? error.message : error);
    return { error };
  }
}

// Context for auth state
export const AuthContext = createContext<AuthSession>({
  user: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext); 