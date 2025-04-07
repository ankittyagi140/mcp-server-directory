import Link from "next/link";
import ServerCard from "@/components/ServerCard";
import { supabase } from "@/lib/supabase";
import type { ServerEntry } from "@/lib/supabase";
import type { Metadata } from "next";

// Export metadata for SEO
export const metadata: Metadata = {
  title: "MCP Servers Directory | Browse Model Context Protocol Servers",
  description: "Discover and explore Model Context Protocol (MCP) servers with search, filtering by tags, and detailed server information. The most comprehensive MCP server list.",
  keywords: ["MCP servers", "Model Context Protocol", "MCP directory", "Claude integration", "AI tools", "server listings", "MCP implementations"],
  openGraph: {
    title: "Browse MCP Servers | Model Context Protocol Directory",
    description: "Find the perfect Model Context Protocol server for your AI applications. Filter by tags, features, and more.",
    type: "website",
  },
};

async function getServers() {
  const { data, error } = await supabase
    .from("servers")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching servers:", error);
    return [];
  }

  return data as ServerEntry[];
}

export default async function ServersPage() {
  const servers = await getServers();

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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 