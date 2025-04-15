import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Clone the request headers and create a new response
  const res = NextResponse.next();
  
  // Create a Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Log auth-related information
  const accessToken = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;
  
//   console.log('Auth cookies debug:', {
//     hasAccessToken: !!accessToken,
//     hasRefreshToken: !!refreshToken,
//     url: req.url,
//     headers: {
//       host: req.headers.get('host'),
//       origin: req.headers.get('origin'),
//       referer: req.headers.get('referer'),
//     },
//   });
  
  // Use an enhanced Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'middleware',
      },
    },
  });
  
  // If we have both tokens, set the session manually
  if (accessToken && refreshToken) {
    try {
      // Set auth session
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      // If tokens are expired or close to expiry, refresh them
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth error in middleware:', error.message);
        // If there's an error, clear the cookies
        res.cookies.delete('sb-access-token');
        res.cookies.delete('sb-refresh-token');
      } else if (data?.user) {
        console.log('Auth successful in middleware for user:', data.user.email);
      }
    } catch (error) {
      console.error('Exception in middleware auth:', error);
      // Clear cookies on exception
      res.cookies.delete('sb-access-token');
      res.cookies.delete('sb-refresh-token');
    }
  }

  return res;
} 