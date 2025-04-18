import Link from "next/link";
import { Suspense } from "react";
import { getBlogPosts } from "@/lib/supabase";
import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import PaginationControls from "@/components/PaginationControls";
import { Newspaper, FileText, PlusCircle } from "lucide-react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// Export metadata for SEO
export const metadata: Metadata = {
  title: "MCP Server Directory Blog | Technical Articles",
  description: "Read the latest technical articles, tutorials, and news about Model Context Protocol (MCP) servers and implementation.",
  keywords: ["MCP blog", "Model Context Protocol", "tech articles", "MCP tutorials", "AI articles"],
  openGraph: {
    title: "MCP Server Directory Blog | Technical Articles",
    description: "Read the latest technical articles, tutorials, and news about Model Context Protocol (MCP).",
    type: "website",
  },
};

// Default pagination values
const DEFAULT_PAGE_SIZE = 9;
const DEFAULT_PAGE = 1;

// Function to check if user is admin
async function isUserAdmin() {
  try {
    // Create supabase client correctly
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Check if user is admin
    return user.user_metadata?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

interface Props {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    tag?: string;
  }>;
}

export default async function BlogPage({ searchParams }: Props) {
  // Extract and convert pagination parameters
  let page = DEFAULT_PAGE;
  let pageSize = DEFAULT_PAGE_SIZE;
  const { tag, page: pageParam, pageSize: pageSizeParam } = await searchParams;
  
  // Process page parameter if it exists
  if (pageParam) {
    const parsedPage = parseInt(pageParam, 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }
  
  // Process pageSize parameter if it exists
  if (pageSizeParam) {
    const parsedPageSize = parseInt(pageSizeParam, 10);
    if (!isNaN(parsedPageSize) && parsedPageSize > 0) {
      pageSize = parsedPageSize;
    }
  }

  // Fetch blog posts with pagination
  const { posts, count } = await getBlogPosts({ 
    page, 
    limit: pageSize,
    tag
  });
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  // Generate base URL for pagination
  const baseUrl = tag ? `/blog?tag=${tag}` : "/blog";
  
  // Check if user is admin
  const isAdmin = await isUserAdmin();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Technical Blog</h1>
          <p className="text-muted-foreground">
            Latest articles, tutorials, and news about Model Context Protocol.
          </p>
        </div>
        
        {/* Admin can add new blog post if logged in */}
        {isAdmin && (
          <Link
            href="/admin/blog/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white shadow hover:bg-green-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Post
          </Link>
        )}
      </div>

      <div className="mt-8">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Newspaper className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold">No blog posts found</h2>
            <p className="mt-2 text-muted-foreground">
              {tag ? `No posts found with tag "${tag}".` : "There are no blog posts available yet."}
            </p>
            <div className="mt-6 space-x-4">
              <Link
                href="/blog"
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 px-6 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-200"
              >
                <FileText className="mr-2 h-4 w-4" />
                View all posts
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/blog/new"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-6 text-base font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add first post
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            
            {/* Pagination display and controls */}
            <div className="mt-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, count)}</span> to{" "}
                <span className="font-medium">{Math.min(page * pageSize, count)}</span> of{" "}
                <span className="font-medium">{count}</span> posts
              </div>
              
              <Suspense fallback={<div>Loading pagination...</div>}>
                <PaginationControls 
                  currentPage={page}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  basePath={baseUrl}
                />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 