"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Tag, ChevronLeft } from "lucide-react";
import type { BlogPost } from "@/lib/supabase";

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  // Format the date
  const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to blog
        </Link>
      </div>
      
      <article className="prose prose-green mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="mr-1.5 h-4 w-4" />
              <time dateTime={post.created_at}>{formattedDate}</time>
            </div>
            
            <div className="flex items-center">
              <User className="mr-1.5 h-4 w-4" />
              <span>{post.author_name || 'MCP Team'}</span>
            </div>
          </div>
        </header>
        
        {post.featured_image && (
          <div className="relative mb-10 h-[400px] w-full overflow-hidden rounded-lg">
            <Image 
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <style jsx global>{`
          .feature-box {
            background-color: #f8f9fa;
            border-left: 4px solid #4285F4;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
          
          .highlight {
            background-color: #E8F0FE;
            padding: 2px 5px;
            border-radius: 3px;
            font-weight: bold;
          }
          
          .conclusion {
            background-color: #f0f7f4;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
          }

          article h1 {
            color: #4285F4;
            border-bottom: 2px solid #EA4335;
            padding-bottom: 10px;
          }
          
          article h2 {
            color: #34A853;
            margin-top: 30px;
          }
          
          article h3 {
            color: #FBBC05;
          }
        `}</style>
        
        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-green-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link 
                  key={tag} 
                  href={`/blog?tag=${tag}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200"
                >
                  <Tag className="mr-1.5 h-3.5 w-3.5" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
} 