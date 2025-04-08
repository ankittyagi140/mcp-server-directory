"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Server } from "lucide-react";
import type { ServerEntry } from "@/lib/supabase";
import { useState } from "react";

interface ServerCardProps {
  server: ServerEntry;
}

export default function ServerCard({ server }: ServerCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Ensure tags is always an array
  const tags: string[] = Array.isArray(server.tags)
  ? server.tags
  : typeof server.tags === 'string'
    ? JSON.parse(server.tags)
    : [];

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          {server.logo_url && !imageError ? (
            <Image
              src={server.logo_url}
              alt={`${server.name} logo`}
              width={40}
              height={40}
              className="rounded-md"
              onError={() => setImageError(true)}
              unoptimized={true}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Server className="h-5 w-5 text-green-600" />
            </div>
          )}
          <div>
            <Link
              href={`/servers/${server.id}`}
              className="font-medium hover:underline"
            >
              {server.name}
            </Link>
          </div>
        </div>
      </div>
      <div className="px-6 py-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {server.description}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 px-6 py-2">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="inline-flex items-center text-xs font-medium text-green-600 px-1"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between border-t p-6">
        <Link
          href={`/servers/${server.id}`}
          className="text-sm font-medium hover:underline"
        >
          View Details
        </Link>
        <div className="flex space-x-2">
          {server.github_url && (
            <a
              href={server.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {server.endpoint_url && (
            <a
              href={server.endpoint_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              aria-label="Server endpoint"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 