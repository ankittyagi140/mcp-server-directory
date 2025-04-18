"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, RefreshCw, ExternalLink, Info, Edit2, Save, Trash2, Server, Monitor } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ServerEntry, ClientEntry } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

type TabType = 'pending' | 'approved' | 'rejected';
type ContentType = 'servers' | 'clients';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [contentType, setContentType] = useState<ContentType>('servers');
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<ServerEntry | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedServer, setEditedServer] = useState<Partial<ServerEntry>>({});
  const [editedClient, setEditedClient] = useState<Partial<ClientEntry>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    servers: {
      pending: 0,
      approved: 0,
      rejected: 0
    },
    clients: {
      pending: 0,
      approved: 0,
      rejected: 0
    }
  });

  const fetchAllStats = useCallback(async () => {
    try {
      // Get counts for each status for servers
      const serverPendingCount = await getStatusCount('servers', 'pending');
      const serverApprovedCount = await getStatusCount('servers', 'approved');
      const serverRejectedCount = await getStatusCount('servers', 'rejected');
      
      // Get counts for each status for clients
      const clientPendingCount = await getStatusCount('clients', 'pending');
      const clientApprovedCount = await getStatusCount('clients', 'approved');
      const clientRejectedCount = await getStatusCount('clients', 'rejected');
      
      setStats({
        servers: {
          pending: serverPendingCount,
          approved: serverApprovedCount,
          rejected: serverRejectedCount
        },
        clients: {
          pending: clientPendingCount,
          approved: clientApprovedCount,
          rejected: clientRejectedCount
        }
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    // Check if user is admin
    if (!user?.role || user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    fetchAllStats();
    if (contentType === 'servers') {
      fetchServers(activeTab);
      // Reset client selection when switching to servers
      setSelectedClient(null);
    } else {
      fetchClients(activeTab);
      // Reset server selection when switching to clients
      setSelectedServer(null);
    }
  }, [activeTab, contentType, user, router, fetchAllStats]);

  async function getStatusCount(type: ContentType, status: TabType) {
    try {
      const { count, error } = await supabase
        .from(type)
        .select("*", { count: 'exact', head: true })
        .eq("status", status);
        
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error(`Error getting ${type} ${status} count:`, err);
      return 0;
    }
  }

  async function fetchServers(status: TabType) {
    setIsLoading(true);
    setError(null);
    setSelectedServer(null);
    setSelectedClient(null);

    try {
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setServers(data as ServerEntry[]);
    } catch (err) {
      console.error(`Error fetching ${status} servers:`, err);
      setError(`Failed to load ${status} servers. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchClients(status: TabType) {
    setIsLoading(true);
    setError(null);
    setSelectedClient(null);

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setClients(data as ClientEntry[]);
    } catch (err) {
      console.error(`Error fetching ${status} clients:`, err);
      setError(`Failed to load ${status} clients. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateServerStatus(id: string, status: TabType) {
    try {
      const { error } = await supabase
        .from("servers")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setServers(servers.filter(server => String(server.id) !== id));
      if (selectedServer && String(selectedServer.id) === id) {
        setSelectedServer(null);
      }
      
      toast.success(`Server ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      
      // Refresh stats and current tab data
      fetchAllStats();
      fetchServers(activeTab);
    } catch (err) {
      console.error(`Error ${status} server:`, err);
      setError(`Failed to ${status} server. Please try again.`);
      toast.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} server`);
    }
  }

  async function deleteServer(id: string) {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("servers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setServers(servers.filter(server => String(server.id) !== id));
      setSelectedServer(null);
      
      toast.success("Server deleted successfully");
      
      // Refresh stats
      fetchAllStats();
    } catch (err) {
      console.error("Error deleting server:", err);
      toast.error("Failed to delete server");
    } finally {
      setIsDeleting(false);
    }
  }

  async function saveServerChanges() {
    if (!selectedServer?.id || !editedServer) return;

    try {
      const { error } = await supabase
        .from("servers")
        .update(editedServer)
        .eq("id", selectedServer.id);

      if (error) throw error;

      // Update local state
      setSelectedServer({ ...selectedServer, ...editedServer });
      setServers(servers.map(server => 
        String(server.id) === String(selectedServer.id) 
          ? { ...server, ...editedServer }
          : server
      ));
      setIsEditing(false);
      setEditedServer({});
      
      toast.success("Server updated successfully");
    } catch (err) {
      console.error("Error updating server:", err);
      setError("Failed to update server. Please try again.");
      toast.error("Error updating server");
    }
  }

  // Function to handle delete confirmation
  const handleDeleteConfirm = (id: string) => {
    if (window.confirm("Are you sure you want to delete this server? This action cannot be undone.")) {
      deleteServer(id);
    }
  };

  async function updateClientStatus(id: string, status: TabType) {
    try {
      const { error } = await supabase
        .from("clients")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setClients(clients.filter(client => String(client.id) !== id));
      if (selectedClient && String(selectedClient.id) === id) {
        setSelectedClient(null);
      }
      
      toast.success(`Client ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      
      // Refresh stats and current tab data
      fetchAllStats();
      fetchClients(activeTab);
    } catch (err) {
      console.error(`Error ${status} client:`, err);
      setError(`Failed to ${status} client. Please try again.`);
      toast.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} client`);
    }
  }

  async function deleteClient(id: string) {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setClients(clients.filter(client => String(client.id) !== id));
      setSelectedClient(null);
      
      toast.success("Client deleted successfully");
      
      // Refresh stats
      fetchAllStats();
    } catch (err) {
      console.error("Error deleting client:", err);
      toast.error("Failed to delete client");
    } finally {
      setIsDeleting(false);
    }
  }

  async function saveClientChanges() {
    if (!selectedClient?.id || !editedClient) return;

    try {
      const { error } = await supabase
        .from("clients")
        .update(editedClient)
        .eq("id", selectedClient.id);

      if (error) throw error;

      // Update local state
      setSelectedClient({ ...selectedClient, ...editedClient });
      setClients(clients.map(client => 
        String(client.id) === String(selectedClient.id) 
          ? { ...client, ...editedClient }
          : client
      ));
      setIsEditing(false);
      setEditedClient({});
      
      toast.success("Client updated successfully");
    } catch (err) {
      console.error("Error updating client:", err);
      setError("Failed to update client. Please try again.");
      toast.error("Error updating client");
    }
  }

  // Function to handle delete confirmation for clients
  const handleDeleteClientConfirm = (id: string) => {
    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      deleteClient(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Type Toggle */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setContentType('servers')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            contentType === 'servers' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Server className="h-4 w-4 mr-2" />
          Servers
        </button>
        <button
          onClick={() => setContentType('clients')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            contentType === 'clients' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Monitor className="h-4 w-4 mr-2" />
          Clients
        </button>
      </div>
      
      {/* Status Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {(['pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium
                ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                {contentType === 'servers' ? stats.servers[tab] : stats.clients[tab]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* List */}
        <div className="md:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} {contentType === 'servers' ? 'Servers' : 'Clients'}
            </h2>
            <button
              onClick={() => contentType === 'servers' ? fetchServers(activeTab) : fetchClients(activeTab)}
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
                onClick={() => contentType === 'servers' ? fetchServers(activeTab) : fetchClients(activeTab)}
                className="mt-2 text-sm font-medium hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (contentType === 'servers' ? servers.length === 0 : clients.length === 0) ? (
            <div className="rounded-md bg-muted p-4 text-center text-muted-foreground">
              <p>No {activeTab} {contentType === 'servers' ? 'servers' : 'clients'}.</p>
            </div>
          ) : contentType === 'servers' ? (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {servers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => {
                    setSelectedServer(server);
                    setIsEditing(false);
                    setEditedServer({});
                  }}
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
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsEditing(false);
                    setEditedClient({});
                  }}
                  className={`w-full rounded-md border p-3 text-left hover:bg-muted ${
                    selectedClient?.id === client.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(client.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-2">
          {contentType === 'servers' && selectedServer ? (
            <div className="rounded-lg border p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedServer.name ?? selectedServer.name}
                      onChange={(e) => setEditedServer({ ...editedServer, name: e.target.value })}
                      className="w-full rounded-md border p-2"
                    />
                  ) : (
                    selectedServer.name
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  {activeTab === 'pending' && (
                    <>
                      <button
                        onClick={() => updateServerStatus(String(selectedServer.id), "approved")}
                        disabled={isDeleting}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-green-600 px-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateServerStatus(String(selectedServer.id), "rejected")}
                        disabled={isDeleting}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      disabled={isDeleting}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={saveServerChanges}
                      disabled={isDeleting}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-green-600 px-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                  )}
                  
                  {/* Delete button - only show for approved/rejected servers */}
                  {(activeTab === 'approved' || activeTab === 'rejected') && (
                    <button
                      onClick={() => handleDeleteConfirm(String(selectedServer.id))}
                      disabled={isDeleting}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Logo preview - if available */}
              {selectedServer.logo_url && (
                <div className="mb-6 flex justify-center">
                  <div className="relative overflow-hidden rounded-lg border p-2 w-32 h-32">
                    <Image 
                      src={selectedServer.logo_url} 
                      alt={`${selectedServer.name} logo`}
                      width={128}
                      height={128}
                      className="object-contain h-full w-full"
                      unoptimized={true}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Endpoint URL
                  </h3>
                  <div className="flex items-center justify-between rounded-md bg-muted p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedServer.endpoint_url ?? selectedServer.endpoint_url}
                        onChange={(e) => setEditedServer({ ...editedServer, endpoint_url: e.target.value })}
                        className="w-full rounded-md border p-2"
                      />
                    ) : (
                      <>
                        <code className="text-sm break-all">{selectedServer.endpoint_url}</code>
                        <a
                          href={selectedServer.endpoint_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-background"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Tags
                  </h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={
                        Array.isArray(editedServer.tags) 
                          ? editedServer.tags.join(", ")
                          : editedServer.tags || (Array.isArray(selectedServer.tags)
                              ? selectedServer.tags.join(", ")
                              : (selectedServer.tags || ""))
                      }
                      onChange={(e) => setEditedServer({ 
                        ...editedServer, 
                        tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                      })}
                      className="w-full rounded-md border p-2"
                      placeholder="tag1, tag2, tag3"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(selectedServer.tags) 
                        ? selectedServer.tags 
                        : (selectedServer.tags ? String(selectedServer.tags).split(',').map(tag => tag.trim()) : [])
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                {isEditing ? (
                  <textarea
                    value={editedServer.description ?? selectedServer.description}
                    onChange={(e) => setEditedServer({ ...editedServer, description: e.target.value })}
                    className="w-full rounded-md border p-2"
                    rows={4}
                  />
                ) : (
                  <p className="rounded-md bg-muted p-3 text-sm">
                    {selectedServer.description}
                  </p>
                )}
              </div>

              {(selectedServer.features || isEditing) && (
                <div className="mb-4">
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Features
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={
                        editedServer.features && Array.isArray(editedServer.features) 
                          ? editedServer.features.join("\n") 
                          : Array.isArray(selectedServer.features) 
                            ? selectedServer.features.join("\n") 
                            : selectedServer.features 
                              ? String(selectedServer.features).split(',').join("\n") 
                              : ''
                      }
                      onChange={(e) => setEditedServer({ 
                        ...editedServer, 
                        features: e.target.value.split("\n").map(feature => feature.trim()).filter(Boolean)
                      })}
                      className="w-full rounded-md border p-2"
                      rows={4}
                      placeholder="One feature per line"
                    />
                  ) : (
                    <ul className="list-inside list-disc rounded-md bg-muted p-3 text-sm">
                      {(Array.isArray(selectedServer.features) 
                        ? selectedServer.features 
                        : (selectedServer.features ? String(selectedServer.features).split(',').map(feature => feature.trim()) : [])
                      ).map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    GitHub URL
                  </h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedServer.github_url ?? selectedServer.github_url ?? ''}
                      onChange={(e) => setEditedServer({ ...editedServer, github_url: e.target.value })}
                      className="w-full rounded-md border p-2"
                    />
                  ) : selectedServer.github_url ? (
                    <a
                      href={selectedServer.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {selectedServer.github_url.replace("https://github.com/", "")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : <span className="text-sm text-muted-foreground">Not provided</span>}
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Logo URL
                  </h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedServer.logo_url ?? selectedServer.logo_url ?? ''}
                      onChange={(e) => setEditedServer({ ...editedServer, logo_url: e.target.value })}
                      className="w-full rounded-md border p-2"
                    />
                  ) : selectedServer.logo_url ? (
                    <a
                      href={selectedServer.logo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View Logo
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : <span className="text-sm text-muted-foreground">Not provided</span>}
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Contact Email
                  </h3>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedServer.contact_email ?? selectedServer.contact_email ?? ''}
                      onChange={(e) => setEditedServer({ ...editedServer, contact_email: e.target.value })}
                      className="w-full rounded-md border p-2"
                    />
                  ) : selectedServer.contact_email ? (
                    <span className="text-sm">{selectedServer.contact_email}</span>
                  ) : <span className="text-sm text-muted-foreground">Not provided</span>}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Submission Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted on:</span>{" "}
                    {new Date(selectedServer.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <span className={`
                      ${selectedServer.status === 'approved' ? 'text-green-600' : ''}
                      ${selectedServer.status === 'rejected' ? 'text-red-600' : ''}
                      ${selectedServer.status === 'pending' ? 'text-amber-600' : ''}
                      font-medium
                    `}>
                      {selectedServer.status.charAt(0).toUpperCase() + selectedServer.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">User ID:</span>{" "}
                    <span className="font-mono text-xs">{selectedServer.user_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Server ID:</span>{" "}
                    <span className="font-mono text-xs">{selectedServer.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : contentType === 'clients' && selectedClient ? (
            <div className="rounded-lg border p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedClient.name ?? selectedClient.name}
                      onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                      className="w-full rounded-md border p-2"
                    />
                  ) : (
                    selectedClient.name
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  {activeTab === 'pending' && (
                    <>
                      <button
                        onClick={() => updateClientStatus(String(selectedClient.id), "approved")}
                        disabled={isDeleting}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-green-600 px-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateClientStatus(String(selectedClient.id), "rejected")}
                        disabled={isDeleting}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      disabled={isDeleting}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={saveClientChanges}
                      disabled={isDeleting}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-green-600 px-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                  )}
                  
                  {/* Delete button - only show for approved/rejected clients */}
                  {(activeTab === 'approved' || activeTab === 'rejected') && (
                    <button
                      onClick={() => handleDeleteClientConfirm(String(selectedClient.id))}
                      disabled={isDeleting}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Logo preview - if available */}
              {selectedClient.logo_url && (
                <div className="mb-6 flex justify-center">
                  <div className="relative overflow-hidden rounded-lg border p-2 w-32 h-32">
                    <Image 
                      src={selectedClient.logo_url} 
                      alt={`${selectedClient.name} logo`}
                      width={128}
                      height={128}
                      className="object-contain h-full w-full"
                      unoptimized={true}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Client URL
                  </h3>
                  <div className="flex items-center justify-between rounded-md bg-muted p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.client_url ?? selectedClient.client_url}
                        onChange={(e) => setEditedClient({ ...editedClient, client_url: e.target.value })}
                        className="w-full rounded-md border p-2"
                      />
                    ) : (
                      <>
                        <code className="text-sm break-all">{selectedClient.client_url}</code>
                        <a
                          href={selectedClient.client_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-background"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Tags
                  </h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={
                        Array.isArray(editedClient.tags) 
                          ? editedClient.tags.join(", ")
                          : editedClient.tags || (Array.isArray(selectedClient.tags)
                              ? selectedClient.tags.join(", ")
                              : (selectedClient.tags || ""))
                      }
                      onChange={(e) => setEditedClient({ 
                        ...editedClient, 
                        tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                      })}
                      className="w-full rounded-md border p-2"
                      placeholder="tag1, tag2, tag3"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(selectedClient.tags) 
                        ? selectedClient.tags 
                        : (selectedClient.tags ? String(selectedClient.tags).split(',').map(tag => tag.trim()) : [])
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                {isEditing ? (
                  <textarea
                    value={editedClient.description ?? selectedClient.description}
                    onChange={(e) => setEditedClient({ ...editedClient, description: e.target.value })}
                    className="w-full rounded-md border p-2"
                    rows={4}
                  />
                ) : (
                  <p className="rounded-md bg-muted p-3 text-sm">
                    {selectedClient.description}
                  </p>
                )}
              </div>

              {/* Client-specific fields: capabilities and compatibility */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                {(selectedClient.capabilities || isEditing) && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                      Capabilities
                    </h3>
                    {isEditing ? (
                      <textarea
                        value={
                          editedClient.capabilities && Array.isArray(editedClient.capabilities) 
                            ? editedClient.capabilities.join("\n") 
                            : Array.isArray(selectedClient.capabilities) 
                              ? selectedClient.capabilities.join("\n") 
                              : selectedClient.capabilities 
                                ? String(selectedClient.capabilities).split(',').join("\n") 
                                : ''
                        }
                        onChange={(e) => setEditedClient({ 
                          ...editedClient, 
                          capabilities: e.target.value.split("\n").map(cap => cap.trim()).filter(Boolean)
                        })}
                        className="w-full rounded-md border p-2"
                        rows={4}
                        placeholder="One capability per line"
                      />
                    ) : (
                      <ul className="list-inside list-disc rounded-md bg-muted p-3 text-sm">
                        {(Array.isArray(selectedClient.capabilities) 
                          ? selectedClient.capabilities 
                          : (selectedClient.capabilities ? String(selectedClient.capabilities).split(',').map(cap => cap.trim()) : [])
                        ).map((capability, index) => (
                          <li key={index}>{capability}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {(selectedClient.compatibility || isEditing) && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                      Compatibility
                    </h3>
                    {isEditing ? (
                      <textarea
                        value={
                          editedClient.compatibility && Array.isArray(editedClient.compatibility) 
                            ? editedClient.compatibility.join("\n") 
                            : Array.isArray(selectedClient.compatibility) 
                              ? selectedClient.compatibility.join("\n") 
                              : selectedClient.compatibility 
                                ? String(selectedClient.compatibility).split(',').join("\n") 
                                : ''
                        }
                        onChange={(e) => setEditedClient({ 
                          ...editedClient, 
                          compatibility: e.target.value.split("\n").map(item => item.trim()).filter(Boolean)
                        })}
                        className="w-full rounded-md border p-2"
                        rows={4}
                        placeholder="One compatibility item per line"
                      />
                    ) : (
                      <ul className="list-inside list-disc rounded-md bg-muted p-3 text-sm">
                        {(Array.isArray(selectedClient.compatibility) 
                          ? selectedClient.compatibility 
                          : (selectedClient.compatibility ? String(selectedClient.compatibility).split(',').map(item => item.trim()) : [])
                        ).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    GitHub URL
                  </h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedClient.github_url ?? selectedClient.github_url ?? ''}
                      onChange={(e) => setEditedClient({ ...editedClient, github_url: e.target.value })}
                      className="w-full rounded-md border p-2"
                    />
                  ) : selectedClient.github_url ? (
                    <a
                      href={selectedClient.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {selectedClient.github_url.replace("https://github.com/", "")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : <span className="text-sm text-muted-foreground">Not provided</span>}
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Logo URL
                  </h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedClient.logo_url ?? selectedClient.logo_url ?? ''}
                      onChange={(e) => setEditedClient({ ...editedClient, logo_url: e.target.value })}
                      className="w-full rounded-md border p-2"
                    />
                  ) : selectedClient.logo_url ? (
                    <a
                      href={selectedClient.logo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View Logo
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : <span className="text-sm text-muted-foreground">Not provided</span>}
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Contact Email
                  </h3>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedClient.contact_email ?? selectedClient.contact_email ?? ''}
                      onChange={(e) => setEditedClient({ ...editedClient, contact_email: e.target.value })}
                      className="w-full rounded-md border p-2"
                    />
                  ) : selectedClient.contact_email ? (
                    <span className="text-sm">{selectedClient.contact_email}</span>
                  ) : <span className="text-sm text-muted-foreground">Not provided</span>}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Submission Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted on:</span>{" "}
                    {new Date(selectedClient.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <span className={`
                      ${selectedClient.status === 'approved' ? 'text-green-600' : ''}
                      ${selectedClient.status === 'rejected' ? 'text-red-600' : ''}
                      ${selectedClient.status === 'pending' ? 'text-amber-600' : ''}
                      font-medium
                    `}>
                      {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">User ID:</span>{" "}
                    <span className="font-mono text-xs">{selectedClient.user_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Client ID:</span>{" "}
                    <span className="font-mono text-xs">{selectedClient.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Info className="mb-2 h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No {contentType === 'servers' ? 'server' : 'client'} selected</h3>
              <p className="mt-1 text-muted-foreground">
                Select a {contentType === 'servers' ? 'server' : 'client'} from the list to review its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 