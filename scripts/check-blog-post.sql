-- Check if blog post with slug exists
SELECT 
  id,
  title,
  slug,
  status,
  publish_date,
  created_at
FROM blog_posts 
WHERE slug = 'best-time-to-visit-uganda-a-month-by-month-guide';

-- Check all blog posts to see what's available
SELECT 
  id,
  title,
  slug,
  status,
  publish_date
FROM blog_posts 
ORDER BY created_at DESC
LIMIT 10; 