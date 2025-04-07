import { MetadataRoute } from 'next';
import { supabase } from "@/lib/supabase";
import type { ServerEntry } from "@/lib/supabase";

// Helper function to get all published server IDs
async function getPublishedServerIds() {
  try {
    const { data, error } = await supabase
      .from("servers")
      .select("id")
      .eq("status", "approved");
      
    if (error) {
      console.error("Error fetching server IDs for sitemap:", error);
      return [];
    }
    
    return data as Pick<ServerEntry, 'id'>[];
  } catch (err) {
    console.error("Failed to fetch server IDs for sitemap:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for your site
  const baseUrl = 'https://mcp-server-directory.com';
  
  // Static routes with their last modified date and change frequency
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/servers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  
  // Dynamically generate routes for each server
  let serverRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const serverIds = await getPublishedServerIds();
    
    serverRoutes = serverIds.map(server => ({
      url: `${baseUrl}/servers/${server.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating server routes for sitemap:', error);
  }
  
  // Combine static and dynamic routes
  return [...staticRoutes, ...serverRoutes] as MetadataRoute.Sitemap;
} 