import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ServerCard from "@/components/ServerCard";
import PaginationControls from "@/components/PaginationControls";
import SearchForm from "@/components/SearchForm";
import type { Metadata } from "next";
import type { ServerEntry } from "@/lib/supabase";

// Export metadata for SEO
export const metadata: Metadata = {
  title: "MCP Servers | Find and Join Model Context Protocol Servers | MCP Directory",
  description:
    "Browse and join MCP servers. Find the perfect Model Context Protocol server for your playstyle.",
  keywords: "MCP servers, Model Context Protocol servers, server list, join server",
  openGraph: {
    title: "Browse MCP Servers | Model Context Protocol Directory",
    description: "Find the perfect Model Context Protocol server for your AI applications. Filter by tags, features, and more.",
    type: "website",
  },
};

const ITEMS_PER_PAGE = 12;

async function getServers(page: number, searchQuery?: string) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("servers")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
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
  const {page, search} = await searchParams;
  const currentPage = Number(page) || 1;
  const searchQuery = search as string;
  const { servers, totalCount } = await getServers(currentPage, searchQuery);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Generate base URL for pagination
  const baseUrl = searchQuery ? `/servers?search=${encodeURIComponent(searchQuery)}` : "/servers";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Model Context Protocol Servers</h1>
        <p className="text-lg text-gray-600">
          Discover and join the best Model Context Protocol servers
        </p>
      </div>

      <div className="mb-8">
        <SearchForm />
        {searchQuery && (
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