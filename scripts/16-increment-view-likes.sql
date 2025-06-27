-- scripts/16-increment-view-likes.sql
-- Create a function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(row_id bigint, table_name text)
RETURNS void AS $$
BEGIN
  IF table_name = 'gallery_images' THEN
    UPDATE gallery_images
    SET views = COALESCE(views, 0) + 1
    WHERE id = row_id;
  ELSIF table_name = 'gallery_videos' THEN
    UPDATE gallery_videos
    SET views = COALESCE(views, 0) + 1
    WHERE id = row_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to authenticated users to execute this function
GRANT EXECUTE ON FUNCTION increment_view_count(bigint, text) TO authenticated;

-- Create a function to increment like count
CREATE OR REPLACE FUNCTION increment_like_count(row_id bigint, table_name text)
RETURNS void AS $$
BEGIN
  IF table_name = 'gallery_images' THEN
    UPDATE gallery_images
    SET likes = COALESCE(likes, 0) + 1
    WHERE id = row_id;
  ELSIF table_name = 'gallery_videos' THEN
    UPDATE gallery_videos
    SET likes = COALESCE(likes, 0) + 1
    WHERE id = row_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to authenticated users to execute this function
GRANT EXECUTE ON FUNCTION increment_like_count(bigint, text) TO authenticated; 