
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/supabase";
import type { Metadata} from "next";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  // Fetch blog post data
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  // If post not found, return default metadata
  if (!post) {
    return {
      title: "Post Not Found | MCP Server Directory Blog",
      description: "The requested blog post was not found.",
    };
  }
  
  // Generate dynamic metadata
  return {
    title: `${post.title} | MCP Server Directory Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : undefined,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: post.author_name ? [post.author_name] : undefined,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  // If post not found, show not found page 
  if (!post) {
    notFound();
  }
  
  return <BlogPostClient post={post} />;
} 