import { MetadataRoute } from 'next';
import { supabase, generateSlug } from "@/lib/supabase";
import type { ServerEntry } from "@/lib/supabase";

// Helper function to get all published servers for sitemap
async function getPublishedServers() {
  try {
    const { data, error } = await supabase
      .from("servers")
      .select("id, name")
      .eq("status", "approved");
      
    if (error) {
      console.error("Error fetching servers for sitemap:", error);
      return [];
    }
    
    return data as Pick<ServerEntry, 'id' | 'name'>[];
  } catch (err) {
    console.error("Failed to fetch servers for sitemap:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mcp-server-directory.com';
  
  // Get all published servers
  const servers = await getPublishedServers();
  
  // Generate server detail URLs with slugs (preferred URLs)
  const serverUrls = servers.map((server) => {
    const slug = generateSlug(server.name);
    return {
      url: `${baseUrl}/servers/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });
  
  // We don't need to include ID-based URLs anymore since they redirect automatically
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/servers`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];
  
  return [...staticPages, ...serverUrls];
} 