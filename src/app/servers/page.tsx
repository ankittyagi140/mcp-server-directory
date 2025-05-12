import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ServerCard from "@/components/ServerCard";
import PaginationControls from "@/components/PaginationControls";
import SearchForm from "@/components/SearchForm";
import SortDropdown from "@/components/SortDropdown";
import type { Metadata } from "next";
import type { ServerEntry } from "@/lib/supabase";
import Script from "next/script";

// Export metadata for SEO
export const metadata: Metadata = {
  title: "MCP Servers | Find and Join Model Context Protocol Servers | MCP Directory",
  description:
    "Browse and join MCP servers. Find the perfect Model Context Protocol server for your playstyle.",
  keywords: "MCP servers, Model Context Protocol servers, server list, join server",
  authors: [{ name: "Ankit Tyagi" }],
  creator: "www.linkedin.com/in/atyagi-js",
  publisher: "www.linkedin.com/in/atyagi-js",
  openGraph: {
    title: "Browse MCP Servers | Model Context Protocol Directory",
    description: "Find the perfect Model Context Protocol server for your AI applications. Filter by tags, features, and more.",
    type: "website",
    url: "https://mcp-server-directory.com/servers",
    siteName: "MCP Server Directory",
    images: [
      {
        url: "/mcp-server-directory.png",
        width: 478,
        height: 480,
        alt: "MCP Server Directory Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse MCP Servers | Model Context Protocol Directory",
    description: "Find the perfect Model Context Protocol server for your AI applications. Filter by tags, features, and more.",
    images: ["/mcp-server-directory.png"],
    creator: "www.linkedin.com/in/atyagi-js",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/servers",
  },
};

const ITEMS_PER_PAGE = 12;

// Define sort options and their corresponding Supabase sorting configurations
const SORT_OPTIONS = {
  "latest": { column: "created_at", ascending: false },
  "oldest": { column: "created_at", ascending: true },
  "a-z": { column: "name", ascending: true },
  "z-a": { column: "name", ascending: false },
};

async function getServers(page: number, searchQuery?: string, sortOption?: string) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Default sort is by latest (created_at descending)
  const sort = SORT_OPTIONS[sortOption as keyof typeof SORT_OPTIONS] || SORT_OPTIONS.latest;

  let query = supabase
    .from("servers")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .order(sort.column, { ascending: sort.ascending })
    .range(from, to);

  if (searchQuery && searchQuery.trim()) {
    query = query.or(
      `name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%,tags.ilike.%${searchQuery.trim()}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching servers:", error);
    return { servers: [], totalCount: 0 };
  }

  return {
    servers: data as ServerEntry[],
    totalCount: count || 0,
  };
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ServersPage({ searchParams }: Props) {
  const {page, search, sort} = await searchParams;
  const currentPage = Number(page) || 1;
  const searchQuery = search as string;
  const sortOption = sort as string;
  
  const { servers, totalCount } = await getServers(currentPage, searchQuery, sortOption);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Generate base URL for pagination that includes both search and sort params if present
  let baseUrl = "/servers";
  const params = new URLSearchParams();
  if (searchQuery) params.set("search", searchQuery);
  if (sortOption) params.set("sort", sortOption);
  if (params.toString()) baseUrl += `?${params.toString()}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Script
  id="structured-data"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "MCP Servers Directory",
      url: "https://www.mcp-server-directory.com/servers",
      description:
        "Browse and join MCP servers. Find the perfect Model Context Protocol server for your needs.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.mcp-server-directory.com"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Servers",
            item: "https://www.mcp-server-directory.com/servers"
          }
        ]
      },
      mainEntity: {
        "@type": "ItemList",
        name: "MCP Servers",
        numberOfItems: totalCount,
        itemListElement: servers.map((server, index) => ({
          "@type": "ListItem",
          position: index + 1 + (currentPage - 1) * ITEMS_PER_PAGE,
          url: `https://www.mcp-server-directory.com/servers/${server.slug || server.id}`,
          name: server.name,
          description: server.description
        }))
      }
    })
  }}
/>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">MCP Servers</h1>
        <p className="text-lg text-gray-600">
          Discover and join the best MCP servers
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex-grow">
            <SearchForm currentSort={sortOption} />
          </div>
          <div className="sm:flex-shrink-0">
            <SortDropdown currentSort={sortOption} currentSearch={searchQuery} />
          </div>
        </div>
        
        {(searchQuery || sortOption) && (
          <div className="mt-4 text-center">
            <Link
              href="/servers"
              className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              View All Servers
            </Link>
          </div>
        )}
      </div>

      {servers.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            {searchQuery
              ? "No servers found matching your search"
              : "No servers available yet"}
          </h2>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Check back later for new servers"}
          </p>
          {!searchQuery && (
            <Link
              href="/servers/add"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your Server
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCount)}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of{" "}
              <span className="font-medium">{totalCount}</span> servers
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={ITEMS_PER_PAGE}
              basePath={baseUrl}
            />
          </div>
        </>
      )}
    </div>
  );
} 