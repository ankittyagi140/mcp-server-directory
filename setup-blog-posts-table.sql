-- Create the blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- Create index for faster query performance
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON public.blog_posts(status);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read published posts
CREATE POLICY "Anyone can view published posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (status = 'published');

-- Allow admins to do everything with a simpler condition
CREATE POLICY "Admins can do everything" 
  ON public.blog_posts 
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'); 