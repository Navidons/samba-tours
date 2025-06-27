-- Add photographer, likes, and views columns to gallery_images table
ALTER TABLE public.gallery_images
ADD COLUMN photographer VARCHAR(255),
ADD COLUMN likes INTEGER DEFAULT 0,
ADD COLUMN views INTEGER DEFAULT 0;

-- Add photographer, likes, and views columns to gallery_videos table
ALTER TABLE public.gallery_videos
ADD COLUMN photographer VARCHAR(255),
ADD COLUMN likes INTEGER DEFAULT 0,
ADD COLUMN views INTEGER DEFAULT 0;

SELECT 'Gallery media stats columns added successfully!' as status; 