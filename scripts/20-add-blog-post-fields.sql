-- Add missing columns to blog_posts table
-- excerpt: A short summary of the blog post
-- read_time: Estimated reading time (e.g., "5 min read")
-- tags: Array of tags for categorization

ALTER TABLE public.blog_posts 
ADD COLUMN excerpt TEXT,
ADD COLUMN read_time TEXT,
ADD COLUMN tags TEXT[];

-- Add comments for documentation
COMMENT ON COLUMN public.blog_posts.excerpt IS 'A short summary or excerpt of the blog post content';
COMMENT ON COLUMN public.blog_posts.read_time IS 'Estimated reading time (e.g., "5 min read", "10 minutes")';
COMMENT ON COLUMN public.blog_posts.tags IS 'Array of tags for categorizing and searching blog posts';

-- Update existing posts to have default values (optional)
UPDATE public.blog_posts 
SET 
    excerpt = COALESCE(excerpt, ''),
    read_time = COALESCE(read_time, ''),
    tags = COALESCE(tags, ARRAY[]::TEXT[])
WHERE excerpt IS NULL OR read_time IS NULL OR tags IS NULL; 