import { MetadataRoute } from 'next';
import { supabase, generateSlug, getBlogPosts } from "@/lib/supabase";
import type { ServerEntry, ClientEntry } from "@/lib/supabase";

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

// Helper function to get all published clients for sitemap
async function getPublishedClients() {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("id, name")
      .eq("status", "approved");
      
    if (error) {
      console.error("Error fetching clients for sitemap:", error);
      return [];
    }
    
    return data as Pick<ClientEntry, 'id' | 'name'>[];
  } catch (err) {
    console.error("Failed to fetch clients for sitemap:", err);
    return [];
  }
}

// Helper function to get all published blog posts for sitemap
async function getPublishedBlogPosts() {
  try {
    const { posts } = await getBlogPosts({ status: 'published', limit: 100 });
    return posts;
  } catch (err) {
    console.error("Failed to fetch blog posts for sitemap:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mcp-server-directory.com';
  
  // Get all published servers
  const servers = await getPublishedServers();
  
  // Generate server detail URLs with slugs
  const serverUrls = servers.map((server) => {
    const slug = generateSlug(server.name);
    return {
      url: `${baseUrl}/servers/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });
  
  // Get all published clients
  const clients = await getPublishedClients();
  
  // Generate client detail URLs with slugs
  const clientUrls = clients.map((client) => {
    const slug = generateSlug(client.name);
    return {
      url: `${baseUrl}/clients/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });
  
  // Get all published blog posts
  const blogPosts = await getPublishedBlogPosts();
  
  // Generate blog post URLs with slugs
  const blogUrls = blogPosts.map((post) => {
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });
  
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
      url: `${baseUrl}/clients`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
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
      url: `${baseUrl}/login`,
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
  
  return [...staticPages, ...serverUrls, ...clientUrls, ...blogUrls];
} 