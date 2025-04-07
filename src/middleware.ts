import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Clone the request headers and create a new response
  const res = NextResponse.next();
  
  // Create a Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  
  // Get the access token and refresh token from cookies
  const accessToken = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;
  
  // If we have both tokens, set the session manually
  if (accessToken && refreshToken) {
    // Set auth session
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    
    // If tokens are expired or close to expiry, refresh them
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data?.user) {
      // If there's an error or no user, clear the cookies
      res.cookies.delete('sb-access-token');
      res.cookies.delete('sb-refresh-token');
    }
  }

  return res;
} 