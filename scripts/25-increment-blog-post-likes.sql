-- Function to increment blog post likes
CREATE OR REPLACE FUNCTION increment_blog_post_likes(blog_post_id BIGINT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_likes INTEGER;
BEGIN
  -- Increment likes and return the new likes count
  UPDATE public.blog_posts
  SET likes = likes + 1
  WHERE id = blog_post_id
  RETURNING likes INTO new_likes;

  RETURN new_likes;
END;
$$;

-- Enable RLS for the function
GRANT EXECUTE ON FUNCTION increment_blog_post_likes(BIGINT) TO authenticated, anon;

-- Enable Row Level Security for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading blog posts
CREATE POLICY "Allow reading blog posts" ON public.blog_posts
FOR SELECT USING (true);

-- Policy to allow updating likes
CREATE POLICY "Allow updating likes" ON public.blog_posts
FOR UPDATE USING (true); 