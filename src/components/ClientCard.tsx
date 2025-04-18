"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Laptop } from "lucide-react";
import type { ClientEntry } from "@/lib/supabase";
import { useState } from "react";
import { generateSlug } from "@/lib/supabase";

interface ClientCardProps {
  client: ClientEntry;
}

export default function ClientCard({ client }: ClientCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Generate the slug from the client name
  const clientSlug = generateSlug(client.name);

  // Ensure tags is always an array
  const tags: string[] = Array.isArray(client.tags)
    ? client.tags
    : typeof client.tags === 'string'
      ? JSON.parse(client.tags)
      : [];

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          {client.logo_url && !imageError ? (
            <Image
              src={client.logo_url}
              alt={`${client.name} logo`}
              width={40}
              height={40}
              className="rounded-md"
              onError={() => setImageError(true)}
              unoptimized={true}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Laptop className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div>
            <Link
              href={`/clients/${clientSlug}`}
              className="font-medium hover:underline"
            >
              {client.name}
            </Link>
          </div>
        </div>
      </div>
      <div className="px-6 py-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {client.description}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 px-6 py-2">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="inline-flex items-center text-xs font-medium text-blue-600 px-1"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-auto flex justify-between items-center p-4 pt-2 border-t">
        <Link
          href={`/clients/${clientSlug}`}
          className="text-sm font-medium hover:underline"
        >
          View Details
        </Link>
        <div className="flex space-x-2">
          {client.github_url && (
            <a
              href={client.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {client.client_url && (
            <a
              href={client.client_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              aria-label="Client website"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 