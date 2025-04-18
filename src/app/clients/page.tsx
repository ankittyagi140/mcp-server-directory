import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ClientCard from "@/components/ClientCard";
import PaginationControls from "@/components/PaginationControls";
import SearchForm from "@/components/SearchForm";
import type { Metadata } from "next";
import type { ClientEntry } from "@/lib/supabase";

// Export metadata for SEO
export const metadata: Metadata = {
  title: "MCP Clients | Find and Download Model Context Protocol Clients | MCP Directory",
  description:
    "Browse and download MCP clients. Find the perfect Model Context Protocol client for your AI applications.",
  keywords: "MCP clients, Model Context Protocol clients, AI clients, MCP compatible clients",
  openGraph: {
    title: "Browse MCP Clients | Model Context Protocol Directory",
    description: "Find the perfect Model Context Protocol client for your AI applications. Filter by capabilities, compatibility, and more.",
    type: "website",
  },
};

const ITEMS_PER_PAGE = 12;

async function getClients(page: number, searchQuery?: string) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("clients")
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
    console.error("Error fetching clients:", error);
    return { clients: [], totalCount: 0 };
  }

  return {
    clients: data as ClientEntry[],
    totalCount: count || 0,
  };
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ClientsPage({ searchParams }: Props) {
  const {page, search} = await searchParams;
  const currentPage = Number(page) || 1;
  const searchQuery = search as string;
  const { clients, totalCount } = await getClients(currentPage, searchQuery);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Generate base URL for pagination
  const baseUrl = searchQuery ? `/clients?search=${encodeURIComponent(searchQuery)}` : "/clients";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Model Context Protocol Clients</h1>
        <p className="text-lg text-gray-600">
          Discover and download the best Model Context Protocol clients
        </p>
      </div>

      <div className="mb-8">
        <SearchForm />
        {searchQuery && (
          <div className="mt-4 text-center">
            <Link
              href="/clients"
              className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              View All Clients
            </Link>
          </div>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            {searchQuery
              ? "No clients found matching your search"
              : "No clients available yet"}
          </h2>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Check back later for new clients"}
          </p>
          {!searchQuery && (
            <Link
              href="/submit"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Your Client
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCount)}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of{" "}
              <span className="font-medium">{totalCount}</span> clients
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