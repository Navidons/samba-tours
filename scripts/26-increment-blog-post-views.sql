-- Function to increment blog post views
CREATE OR REPLACE FUNCTION increment_blog_post_views(blog_post_id BIGINT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_views INTEGER;
BEGIN
  -- Increment views and return the new views count
  UPDATE public.blog_posts
  SET views = views + 1
  WHERE id = blog_post_id
  RETURNING views INTO new_views;

  RETURN new_views;
END;
$$;

-- Enable RLS for the function
GRANT EXECUTE ON FUNCTION increment_blog_post_views(BIGINT) TO authenticated, anon; 