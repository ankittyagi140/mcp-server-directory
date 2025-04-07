import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/';
  
  if (code) {
    // Create a supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (data.session) {
      // If auth was successful, redirect to the specified path with success parameter
      return NextResponse.redirect(new URL(`${redirectTo}?auth=success`, requestUrl.origin));
    }
    
    if (error) {
      console.error('Auth error:', error);
      // On error, redirect to login with error message
      return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin));
    }
  }
  
  // Default fallback - redirect to home page without parameters
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 