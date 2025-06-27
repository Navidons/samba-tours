-- Function to increment blog post comments count
CREATE OR REPLACE FUNCTION increment_blog_post_comments(blog_post_id BIGINT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_comments_count INTEGER;
BEGIN
  -- Increment comments count and return the new count
  UPDATE public.blog_posts
  SET comments_count = comments_count + 1
  WHERE id = blog_post_id
  RETURNING comments_count INTO new_comments_count;

  RETURN new_comments_count;
END;
$$;

-- Enable RLS for the function
GRANT EXECUTE ON FUNCTION increment_blog_post_comments(BIGINT) TO authenticated, anon; 