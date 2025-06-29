-- Add missing columns to blog_posts table
-- excerpt: A short summary of the blog post
-- read_time: Estimated reading time (e.g., "5 min read")
-- tags: Array of tags for categorization

-- Defensive script to handle blog_posts columns safely

-- Function to check if a column exists
CREATE OR REPLACE FUNCTION public.column_exists(
    p_table_name TEXT, 
    p_column_name TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_posts' 
        AND column_name = p_column_name
    );
END;
$$ LANGUAGE plpgsql;

-- Procedure to add column if not exists
CREATE OR REPLACE PROCEDURE public.add_column_if_not_exists(
    p_table_name TEXT, 
    p_column_name TEXT, 
    p_column_type TEXT
) LANGUAGE plpgsql AS $$
BEGIN
    IF NOT public.column_exists(p_table_name, p_column_name) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
            p_table_name, p_column_name, p_column_type);
        RAISE NOTICE 'Added column % to %', p_column_name, p_table_name;
    ELSE
        RAISE NOTICE 'Column % already exists in %', p_column_name, p_table_name;
    END IF;
END;
$$;

-- Add columns if they don't exist
DO $$
BEGIN
    CALL public.add_column_if_not_exists('blog_posts', 'excerpt', 'TEXT');
    CALL public.add_column_if_not_exists('blog_posts', 'read_time', 'TEXT');
    CALL public.add_column_if_not_exists('blog_posts', 'tags', 'TEXT[]');
END $$;

-- Add comments for columns
DO $$
BEGIN
    EXECUTE 'COMMENT ON COLUMN public.blog_posts.excerpt IS ''A short summary or excerpt of the blog post content''';
    EXECUTE 'COMMENT ON COLUMN public.blog_posts.read_time IS ''Estimated reading time (e.g., "5 min read", "10 minutes")''';
    EXECUTE 'COMMENT ON COLUMN public.blog_posts.tags IS ''Array of tags for categorizing and searching blog posts''';
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Comments may already exist or could not be added: %', SQLERRM;
END $$;

-- Update existing posts to ensure default values
UPDATE public.blog_posts 
SET 
    excerpt = COALESCE(excerpt, ''),
    read_time = COALESCE(read_time, ''),
    tags = COALESCE(tags, ARRAY[]::TEXT[])
WHERE excerpt IS NULL OR read_time IS NULL OR tags IS NULL;

-- Provide feedback
SELECT 'Blog posts columns processed successfully' as status; 