import { createClient } from '@supabase/supabase-js';

// Use direct string assignments for troubleshooting
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Enhanced debugging

// Log if Supabase credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. Please check your .env.local file.');
}

// Create the Supabase client with explicit options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-v2',
    },
  },
});

// Check client initialization
if (process.env.NODE_ENV !== 'production') {
  console.info('Supabase client initialized with:');
  console.info('- URL:', supabaseUrl ? 'Valid URL provided' : 'Missing URL');
  console.info('- Key:', supabaseAnonKey ? 'Valid key provided' : 'Missing key');
  
  // Test connection
  const testConnection = async () => {
    try {
      const { error } = await supabase.from('servers').select('count').limit(1);
      if (error) {
        console.error('Supabase connection test failed:', error.message);
      } else {
        console.log('Supabase connection test successful');
      }
    } catch (e) {
      console.error('Supabase connection test exception:', e);
    }
  };
  
  testConnection();
}

export type ServerEntry = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  endpoint_url: string;
  tags: string[];
  logo_url?: string | null;
  github_url?: string | null;
  contact_email?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  features?: string[] | null;
}; 