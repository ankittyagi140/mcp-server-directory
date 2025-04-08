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
  slug?: string; // This will be generated from the name
};

// Helper function to generate a slug from a server name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper to get a server by slug
export async function getServerBySlug(slug: string): Promise<ServerEntry | null> {
  try {
    // Console log for debugging
    console.log(`Looking for server with slug: ${slug}`);
    
    // First try to find server with an exact slug match
    const { data: exactMatch, error: exactMatchError } = await supabase
      .from("servers")
      .select("*")
      .eq("status", "approved");
      
    if (exactMatchError) {
      console.error("Error fetching servers for slug match:", exactMatchError);
      return null;
    }
    
    // Try to find exact slug match
    if (exactMatch && exactMatch.length > 0) {
      const serverMatch = exactMatch.find(server => 
        generateSlug(server.name).toLowerCase() === slug.toLowerCase()
      );
      
      if (serverMatch) {
        console.log(`Found exact match for slug '${slug}': ${serverMatch.name}`);
        return {
          ...serverMatch,
          slug: generateSlug(serverMatch.name)
        };
      }
      
      // If no exact match, try a partial match (slug is part of the name or vice versa)
      const partialMatch = exactMatch.find(server => {
        const serverSlug = generateSlug(server.name).toLowerCase();
        return serverSlug.includes(slug.toLowerCase()) || slug.toLowerCase().includes(serverSlug);
      });
      
      if (partialMatch) {
        console.log(`Found partial match for slug '${slug}': ${partialMatch.name}`);
        return {
          ...partialMatch,
          slug: generateSlug(partialMatch.name)
        };
      }
    }
    
    // If no exact or partial match, try a fuzzy match on tokenized parts of the slug
    const slugParts = slug.split('-').filter(part => part.length > 2);
    
    if (slugParts.length === 0) {
      console.log(`No valid parts in slug: ${slug}`);
      return null;
    }
    
    // Create a query looking for servers that might match any part of the slug
    let fuzzyQuery = supabase
      .from("servers")
      .select("*")
      .eq("status", "approved");
    
    // Add ilike condition for the first part
    fuzzyQuery = fuzzyQuery.ilike("name", `%${slugParts[0]}%`);
    
    const { data: fuzzyMatches, error: fuzzyError } = await fuzzyQuery;
    
    if (fuzzyError || !fuzzyMatches || fuzzyMatches.length === 0) {
      // Try one more query with the entire slug as a search term
      const { data: globalMatches, error: globalError } = await supabase
        .from("servers")
        .select("*")
        .eq("status", "approved")
        .ilike("name", `%${slug.replace(/-/g, '%')}%`)
        .limit(5);
        
      if (!globalError && globalMatches && globalMatches.length > 0) {
        // Find the closest match based on string similarity
        const bestMatch = globalMatches[0]; // Simplify by taking the first match
        console.log(`Found global match for slug '${slug}': ${bestMatch.name}`);
        
        return {
          ...bestMatch,
          slug: generateSlug(bestMatch.name)
        };
      }
      
      console.log(`No fuzzy matches found for slug parts: ${slugParts.join(', ')}`);
      return null;
    }
    
    // Find the best match by comparing names
    // Sort by most slug parts matched
    const scoredMatches = fuzzyMatches.map(server => {
      const serverName = server.name.toLowerCase();
      const matchScore = slugParts.filter(part => 
        serverName.includes(part)
      ).length;
      
      return { server, score: matchScore };
    }).sort((a, b) => b.score - a.score);
    
    if (scoredMatches.length > 0 && scoredMatches[0].score > 0) {
      const bestMatch = scoredMatches[0].server;
      console.log(`Found fuzzy match for slug '${slug}': ${bestMatch.name} (score: ${scoredMatches[0].score})`);
      
      return {
        ...bestMatch,
        slug: generateSlug(bestMatch.name)
      };
    }
    
    console.log(`No matches found for slug: ${slug}`);
    return null;
  } catch (err) {
    console.error("Exception finding server by slug:", err);
    return null;
  }
} 