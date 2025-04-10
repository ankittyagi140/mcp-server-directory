"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Tag } from "lucide-react";
import type { BlogPost } from "@/lib/supabase";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  // Format the date
  const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {post.featured_image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Link href={`/blog/${post.slug}`}>
            <Image 
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority={false}
            />
          </Link>
        </div>
      )}
      
      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          
          <h3 className="text-xl font-bold tracking-tight">
            <Link href={`/blog/${post.slug}`} className="hover:text-green-600">
              {post.title}
            </Link>
          </h3>
        </div>
        
        <p className="flex-1 text-sm text-gray-600">
          {post.excerpt}
        </p>
        
        <div className="pt-2">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((tag) => (
                <Link 
                  key={tag} 
                  href={`/blog/tag/${tag}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-3 flex items-center text-xs text-gray-500">
            <User className="mr-1 h-3.5 w-3.5" />
            <span>{post.author_name || 'MCP Team'}</span>
          </div>
        </div>
        
        <Link 
          href={`/blog/${post.slug}`}
          className="mt-2 text-sm font-medium text-green-600 hover:text-green-700"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
} 