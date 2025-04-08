import Link from "next/link";
import ServerCard from "@/components/ServerCard";
import { supabase } from "@/lib/supabase";
import type { ServerEntry } from "@/lib/supabase";
import type { Metadata } from "next";
import { Suspense } from "react";
import PaginationControls from "@/components/PaginationControls";

// Export metadata for SEO
export const metadata: Metadata = {
  title: "MCP Server Directory | Browse Model Context Protocol Servers",
  description: "Discover and explore Model Context Protocol (MCP) servers with search, filtering by tags, and detailed server information. The most comprehensive MCP server list.",
  keywords: ["MCP servers", "Model Context Protocol", "MCP directory", "Claude integration", "AI tools", "server listings", "MCP implementations"],
  openGraph: {
    title: "Browse MCP Servers | Model Context Protocol Directory",
    description: "Find the perfect Model Context Protocol server for your AI applications. Filter by tags, features, and more.",
    type: "website",
  },
};

// Default pagination values
const DEFAULT_PAGE_SIZE = 9;
const DEFAULT_PAGE = 1;

async function getServers(page: number = DEFAULT_PAGE, pageSize: number = DEFAULT_PAGE_SIZE) {
  // Calculate offset
  const offset = (page - 1) * pageSize;

  // Get servers with pagination
  const { data, error, count } = await supabase
    .from("servers")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error("Error fetching servers:", error);
    return { servers: [], count: 0 };
  }

  return { 
    servers: data as ServerEntry[],
    count: count || 0
  };
}

interface Props {
  searchParams: Promise<{ 
    page?: string | string[];
    pageSize?: string | string[];
  }>;
}

export default async function ServersPage({ searchParams }: Props) {
  // Safely access params
  const params = await searchParams;
  
  // Extract and convert pagination parameters
  let page = DEFAULT_PAGE;
  let pageSize = DEFAULT_PAGE_SIZE;
  
  // Process page parameter if it exists
  if (params.page) {
    const pageValue = Array.isArray(params.page) ? params.page[0] : params.page;
    const parsedPage = parseInt(pageValue, 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }
  
  // Process pageSize parameter if it exists
  if (params.pageSize) {
    const pageSizeValue = Array.isArray(params.pageSize) ? params.pageSize[0] : params.pageSize;
    const parsedPageSize = parseInt(pageSizeValue, 10);
    if (!isNaN(parsedPageSize) && parsedPageSize > 0) {
      pageSize = parsedPageSize;
    }
  }

  // Fetch servers with pagination
  const { servers, count } = await getServers(page, pageSize);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  // Generate base URL for pagination
  const baseUrl = "/servers";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Servers</h1>
          <p className="text-muted-foreground">
            Browse and discover Model Context Protocol servers.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <h2 className="text-xl font-semibold">No servers found</h2>
            <p className="mt-2 text-muted-foreground">
              There are no servers available at the moment.
            </p>
            <Link
              href="/submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-green-600 px-8 text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 hover:scale-105 transform duration-200 mt-6"
            >
              Submit a Server
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {servers.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>
            
            {/* Pagination display and controls */}
            <div className="mt-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, count)}</span> to{" "}
                <span className="font-medium">{Math.min(page * pageSize, count)}</span> of{" "}
                <span className="font-medium">{count}</span> servers
              </div>
              
              <Suspense fallback={<div>Loading pagination...</div>}>
                <PaginationControls 
                  currentPage={page}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  basePath={baseUrl}
                />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 