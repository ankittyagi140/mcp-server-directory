"use client";

import { useState, useEffect } from "react";
import { Check, X, RefreshCw, ExternalLink, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ServerEntry } from "@/lib/supabase";

export default function AdminDashboard() {
  const [pendingServers, setPendingServers] = useState<ServerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<ServerEntry | null>(null);

  useEffect(() => {
    fetchPendingServers();
  }, []);

  async function fetchPendingServers() {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPendingServers(data as ServerEntry[]);
    } catch (err) {
      console.error("Error fetching pending servers:", err);
      setError("Failed to load pending servers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateServerStatus(id: string, status: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from("servers")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state with string comparison
      setPendingServers(pendingServers.filter(server => String(server.id) !== id));
      if (selectedServer && String(selectedServer.id) === id) {
        setSelectedServer(null);
      }
    } catch (err) {
      console.error(`Error ${status} server:`, err);
      setError(`Failed to ${status} server. Please try again.`);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pending Submissions</h2>
          <button
            onClick={fetchPendingServers}
            className="inline-flex h-8 items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <p>{error}</p>
            <button
              onClick={fetchPendingServers}
              className="mt-2 text-sm font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        ) : pendingServers.length === 0 ? (
          <div className="rounded-md bg-muted p-4 text-center text-muted-foreground">
            <p>No pending submissions.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingServers.map((server) => (
              <button
                key={server.id}
                onClick={() => setSelectedServer(server)}
                className={`w-full rounded-md border p-3 text-left hover:bg-muted ${
                  selectedServer?.id === server.id
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="font-medium">{server.name}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(server.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        {selectedServer ? (
          <div className="rounded-lg border p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedServer.name}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateServerStatus(String(selectedServer.id), "approved")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-green-600 px-3 text-sm font-medium text-white hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => updateServerStatus(String(selectedServer.id), "rejected")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Endpoint URL
                </h3>
                <div className="flex items-center justify-between rounded-md bg-muted p-2">
                  <code className="text-sm">{selectedServer.endpoint_url}</code>
                  <a
                    href={selectedServer.endpoint_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-background"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1">
                  {selectedServer.tags?.map((tag) => (
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

            <div className="mb-4">
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                Description
              </h3>
              <p className="rounded-md bg-muted p-3 text-sm">
                {selectedServer.description}
              </p>
            </div>

            {selectedServer.features && selectedServer.features.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Features
                </h3>
                <ul className="list-inside list-disc rounded-md bg-muted p-3 text-sm">
                  {selectedServer.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {selectedServer.github_url && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    GitHub URL
                  </h3>
                  <a
                    href={selectedServer.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {selectedServer.github_url.replace(
                      "https://github.com/",
                      ""
                    )}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {selectedServer.logo_url && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Logo URL
                  </h3>
                  <a
                    href={selectedServer.logo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View Logo
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {selectedServer.contact_email && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Contact Email
                  </h3>
                  <span className="text-sm">{selectedServer.contact_email}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Info className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">No server selected</h3>
            <p className="mt-1 text-muted-foreground">
              Select a server from the list to review its details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 