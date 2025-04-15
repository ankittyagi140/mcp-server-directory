import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExternalLink, Mail, Server, Github } from "lucide-react";
import { supabase, getServerBySlug, generateSlug } from "@/lib/supabase";
import type { ServerEntry } from "@/lib/supabase";
import type { Metadata } from "next";
import Script from "next/script";
import ServerCard from "@/components/ServerCard";
import ShareButtons from "../../../components/ShareButtons";

// Ensure tags and features are always arrays
function normalizeArrayData(data: Omit<ServerEntry, 'tags' | 'features'> & { 
  tags?: string[] | string | null;
  features?: string[] | string | null; 
}): ServerEntry {
  return {
    ...data,
    tags: Array.isArray(data.tags) 
      ? data.tags 
      : typeof data.tags === 'string' 
        ? JSON.parse(data.tags)
        : [],
    features: Array.isArray(data.features) 
      ? data.features 
      : typeof data.features === 'string' 
          ? JSON.parse(data.features)
          : [],
  };
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to get server by ID or slug
async function getServerByIdOrSlug(slug: string): Promise<ServerEntry | null> {
  const isNumeric = /^\d+$/.test(slug);
  
  if (isNumeric) {
    // Get server by ID
    try {
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("id", slug)
        .eq("status", "approved")
        .single();
        
      if (error || !data) {
        console.error("Error fetching server by ID:", error);
        return null;
      }
      
      return normalizeArrayData(data);
    } catch (error) {
      console.error("Error fetching server by ID:", error);
      return null;
    }
  } else {
    // Get server by slug
    const server = await getServerBySlug(slug);
    if (server) {
      return normalizeArrayData(server);
    }
    return null;
  }
}

// Generate dynamic metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  if (!slug) {
    return {
      title: "Server Not Found | MCP Server Directory",
      description: "The requested MCP server could not be found.",
    };
  }

  const server = await getServerByIdOrSlug(slug);
  
  if (!server) {
    return {
      title: "Server Not Found | MCP Server Directory",
      description: "The requested MCP server could not be found.",
    };
  }
  
  // Create proper slug for canonical URL
  const serverSlug = generateSlug(server.name);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mcp-server-directory.com';
  const canonicalUrl = `${baseUrl}/servers/${serverSlug}`;
  
  // Truncate description safely
  const metaDescription = server.description?.length > 160 
    ? `${server.description.substring(0, 157)}...` 
    : server.description || '';
  
  return {
    title: `${server.name} | MCP Server Directory`,
    description: metaDescription,
    keywords: ["MCP server", "Model Context Protocol", ...server.tags, ...(server.features || [])],
    openGraph: {
      title: `${server.name} - Model Context Protocol Server`,
      description: metaDescription,
      type: "website",
      url: canonicalUrl,
      siteName: "MCP Server Directory",
      images: server.logo_url ? [{ 
        url: server.logo_url,
        alt: `${server.name} logo`
      }] : undefined,
    },
    twitter: {
      card: "summary",
      title: `${server.name} | MCP Server`,
      description: metaDescription,
      images: server.logo_url ? [server.logo_url] : undefined,
    },
    alternates: {
      canonical: canonicalUrl
    }
  };
}

// Generate static paths for all server slugs and IDs
export async function generateStaticParams() {
  try {
    const { data } = await supabase
      .from("servers")
      .select("id, name")
      .eq("status", "approved");
    
    if (!data) return [];
    
    // Generate paths for all server slugs and IDs
    return data.flatMap(server => [
      { slug: String(server.id) },
      { slug: generateSlug(server.name) }
    ]);
  } catch (err) {
    console.error("Error generating static paths:", err);
    return [];
  }
}

export default async function ServerPage({ params }: Props) {
  const { slug } = await params;
  const server = await getServerByIdOrSlug(slug);
  
  if (!server) {
    notFound();
  }

  // Create slug for canonical URL
  const serverSlug = generateSlug(server.name);
  
  // If this is a numeric ID, redirect to the slug version for better SEO
  if (/^\d+$/.test(slug)) {
    redirect(`/servers/${serverSlug}`);
  }
  
  // Only redirect if there's a significant difference between slugs
  // This prevents unnecessary redirects for minor differences or case variations
  if (slug.toLowerCase() !== serverSlug.toLowerCase() && 
      !serverSlug.toLowerCase().includes(slug.toLowerCase()) &&
      !slug.toLowerCase().includes(serverSlug.toLowerCase())) {
    redirect(`/servers/${serverSlug}`);
  }

  // Create structured data for the server
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": server.name,
    "description": server.description,
    "applicationCategory": "AIApplication",
    "operatingSystem": "Cross-platform",
    "url": server.endpoint_url,
    "datePublished": server.created_at,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "keywords": server.tags.join(", "),
    ...(server.logo_url && { "image": server.logo_url }),
    ...(server.github_url && { "codeRepository": server.github_url })
  };

  // Get recommended servers
  const { data: recommendedServers } = await supabase
    .from("servers")
    .select("*")
    .eq("status", "approved")
    .neq("id", server.id) // Exclude current server
    .order("created_at", { ascending: false })
    .limit(9);

  return (
    <>
      <Script id="server-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <div className="container mx-auto px-4 py-6 md:py-12">
        <Link 
          href="/servers" 
          className="mb-4 md:mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to servers
        </Link>
        
        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
              {server.logo_url ? (
                <Image
                  src={server.logo_url}
                  alt={`${server.name} logo`}
                  width={64}
                  height={64}
                  className="rounded-md h-16 w-16 object-contain mx-auto sm:mx-0"
                  unoptimized={true}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10 mx-auto sm:mx-0">
                  <Server className="h-8 w-8 text-green-600" />
                </div>
              )}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">{server.name}</h1>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  {server.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs font-medium text-green-600 px-1"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-4 md:mb-6 rounded-lg border p-4 md:p-6">
              <h2 className="mb-2 md:mb-4 text-lg md:text-xl font-semibold">Description</h2>
              <p className="text-sm md:text-base text-muted-foreground">{server.description}</p>
            </div>
            
            {server.features && server.features.length > 0 && (
              <div className="mb-4 md:mb-6 rounded-lg border p-4 md:p-6">
                <h2 className="mb-2 md:mb-4 text-lg md:text-xl font-semibold">Features</h2>
                <ul className="ml-6 list-disc text-sm md:text-base text-muted-foreground">
                  {server.features.map((feature, index) => (
                    <li key={index} className="mb-1">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mb-4 md:mb-6 rounded-lg border p-4 md:p-6">
              <h2 className="mb-2 md:mb-4 text-lg md:text-xl font-semibold">Endpoint URL</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md bg-muted p-3">
                <code className="text-xs sm:text-sm break-all mb-2 sm:mb-0">{server.endpoint_url}</code>
                <a
                  href={server.endpoint_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-background ml-auto"
                  aria-label="Open endpoint URL"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border p-4 md:p-6 md:sticky md:top-24">
            <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-semibold">Links & Contact</h2>
            <div className="space-y-3 md:space-y-4">
              {server.github_url && (
                <a
                  href={server.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">{server.github_url.replace("https://github.com/", "")}</span>
                </a>
              )}
              
              {server.contact_email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">{server.contact_email === "aki.tyagi1991@gmail.com" ? "Contact me on GitHub" : server.contact_email}</span>
                </div>
              )}
              
              <div className="pt-3 md:pt-4">
                <span className="text-xs text-muted-foreground">
                  Added on {new Date(server.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {/* Social Sharing */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium mb-2">Share this server:</p>
              <ShareButtons title={server.name} slug={slug} />
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Recommended Servers</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedServers?.map((recommendedServer) => (
              <ServerCard key={recommendedServer.id} server={recommendedServer} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 