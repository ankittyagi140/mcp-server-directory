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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 hover:scale-[1.03] cursor-pointer">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          {client.logo_url && !imageError ? (
            <Image
              src={client.logo_url}
              alt={`${client.name} logo`}
              width={40}
              height={40}
              className="rounded-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
              onError={() => setImageError(true)}
              unoptimized={true}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Laptop className="h-5 w-5 text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
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
      <div className="flex items-center justify-between border-t p-6">
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted group-hover:bg-blue-50 transition-colors"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4 group-hover:scale-110 group-hover:text-blue-600 transition-transform duration-300" />
            </a>
          )}
          {client.client_url && (
            <a
              href={client.client_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted group-hover:bg-blue-50 transition-colors"
              aria-label="Client website"
            >
              <ExternalLink className="h-4 w-4 group-hover:scale-110 group-hover:text-blue-600 transition-transform duration-300" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 