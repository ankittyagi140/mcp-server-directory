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
  
  if (code) {
    // Create a supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (data.session) {
      // If auth was successful, redirect to the specified path with success parameter
      return NextResponse.redirect(new URL(`${redirectTo}?auth=success`, siteOrigin));
    }
    
    if (error) {
      console.error('Auth error:', error);
      // On error, redirect to login with error message
      return NextResponse.redirect(new URL('/login?error=auth_failed', siteOrigin));
    }
  }
  
  // Default fallback - redirect to home page without parameters
  return NextResponse.redirect(new URL('/', siteOrigin));
} 