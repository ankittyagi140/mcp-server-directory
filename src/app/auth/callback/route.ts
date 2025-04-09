import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Helper function to get site URL
const getSiteOrigin = (requestUrl: URL) => {
  // Get environment variables
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const nodeEnv = process.env.NODE_ENV;
  
  // Clear production case - use the site URL
  if (nodeEnv === 'production' && siteUrl) {
    return new URL(siteUrl).origin;
  }
  
  // Development - use request origin, but handle potential localhost redirects
  // Check if the request is coming from an external domain but we're in development
  if (nodeEnv !== 'production') {
    // If we're in dev but the request isn't from localhost, still use localhost for redirects
    if (!requestUrl.origin.includes('localhost')) {
      return 'http://localhost:3000';
    }
  }
  
  // Default to the request origin
  return requestUrl.origin;
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/';
  
  // Get the correct site origin
  const siteOrigin = getSiteOrigin(requestUrl);
  
  // Log important data for debugging
  console.log('Auth callback debug:', {
    hasCode: !!code,
    redirectTo,
    siteOrigin,
    requestOrigin: requestUrl.origin,
    requestUrl: requestUrl.toString(),
    env: process.env.NODE_ENV
  });
  
  if (code) {
    // Create a supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
      // Try to exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth code exchange error:', error);
        return NextResponse.redirect(new URL('/login?error=auth_failed', siteOrigin));
      }
      
      if (!data.session) {
        console.error('No session after code exchange');
        return NextResponse.redirect(new URL('/login?error=no_session', siteOrigin));
      }
      
      console.log('Auth successful for:', data.session.user.email);
      
      // Create the response with the redirect
      const response = NextResponse.redirect(new URL(`${redirectTo}?auth=success`, siteOrigin));
      
      // Ensure cookies are properly set in the response
      if (data.session) {
        // Set access token cookie
        response.cookies.set({
          name: 'sb-access-token',
          value: data.session.access_token,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          domain: process.env.NODE_ENV === 'production' 
            ? '.mcp-server-directory.com' 
            : undefined
        });
        
        // Set refresh token cookie
        response.cookies.set({
          name: 'sb-refresh-token',
          value: data.session.refresh_token,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          domain: process.env.NODE_ENV === 'production' 
            ? '.mcp-server-directory.com' 
            : undefined
        });
      }
      
      return response;
    } catch (e) {
      console.error('Exception during auth code exchange:', e);
      return NextResponse.redirect(new URL('/login?error=exception', siteOrigin));
    }
  }
  
  // Default fallback - redirect to home page without parameters
  return NextResponse.redirect(new URL('/', siteOrigin));
} 