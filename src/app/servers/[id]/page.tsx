import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github, Mail, Server } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ServerEntry } from "@/lib/supabase";
import type { Metadata } from "next";
import Script from "next/script";

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
        ? data.tags.split(',').map((tag: string) => tag.trim()) 
        : [],
    features: Array.isArray(data.features) 
      ? data.features 
      : typeof data.features === 'string' 
        ? data.features.split(',').map((feature: string) => feature.trim()) 
        : [],
  };
}

async function getServer(id: string) {
  if (!id) return null;
  
  try {
    const { data, error } = await supabase
      .from("servers")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .single();

    if (error || !data) {
      console.error("Error fetching server:", error);
      return null;
    }

    return normalizeArrayData(data);
  } catch (err) {
    console.error("Exception fetching server:", err);
    return null;
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Safely access params
  const {id} = await params
  if (!id) {
    return {
      title: "Server Not Found | MCP Server Directory",
      description: "The requested MCP server could not be found.",
    };
  }

  const server = await getServer(id);
  
  if (!server) {
    return {
      title: "Server Not Found | MCP Server Directory",
      description: "The requested MCP server could not be found.",
    };
  }
  
  // We know tags and features are arrays because of normalizeArrayData
  
  return {
    title: `${server.name} | MCP Server Directory`,
    description: `${server.description.substring(0, 160)}${server.description.length > 160 ? '...' : ''}`,
    keywords: ["MCP server", "Model Context Protocol", ...server.tags, ...(server.features || [])],
    openGraph: {
      title: `${server.name} - Model Context Protocol Server`,
      description: server.description,
      type: "website",
      images: server.logo_url ? [{ url: server.logo_url }] : undefined,
    },
    twitter: {
      card: "summary",
      title: `${server.name} | MCP Server`,
      description: `${server.description.substring(0, 160)}${server.description.length > 160 ? '...' : ''}`,
      images: server.logo_url ? [server.logo_url] : undefined,
    },
  };
}



export default async function ServerDetailPage({ params }: Props) {
  // Safely access params
  const {id} = await params
  if (!id) {
    notFound();
  }

  const server = await getServer(id);

  if (!server) {
    notFound();
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
                  {server.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs font-medium text-blue-600 px-1"
                    >
                      [{tag}]
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
          
          <div>
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
                    <span className="break-all">{server.contact_email}</span>
                  </div>
                )}
                
                <div className="pt-3 md:pt-4">
                  <span className="text-xs text-muted-foreground">
                    Added on {new Date(server.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 