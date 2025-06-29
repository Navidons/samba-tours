-- Add photographer, likes, and views columns to gallery_images table if not exists
DO $$
BEGIN
    -- Check and add photographer column to gallery_images
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_images' AND column_name='photographer'
    ) THEN
        ALTER TABLE public.gallery_images
        ADD COLUMN photographer VARCHAR(255);
    END IF;

    -- Check and add likes column to gallery_images
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_images' AND column_name='likes'
    ) THEN
        ALTER TABLE public.gallery_images
        ADD COLUMN likes INTEGER DEFAULT 0;
    END IF;

    -- Check and add views column to gallery_images
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_images' AND column_name='views'
    ) THEN
        ALTER TABLE public.gallery_images
        ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add photographer, likes, and views columns to gallery_videos table if not exists
DO $$
BEGIN
    -- Check and add photographer column to gallery_videos
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_videos' AND column_name='photographer'
    ) THEN
        ALTER TABLE public.gallery_videos
        ADD COLUMN photographer VARCHAR(255);
    END IF;

    -- Check and add likes column to gallery_videos
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_videos' AND column_name='likes'
    ) THEN
        ALTER TABLE public.gallery_videos
        ADD COLUMN likes INTEGER DEFAULT 0;
    END IF;

    -- Check and add views column to gallery_videos
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_videos' AND column_name='views'
    ) THEN
        ALTER TABLE public.gallery_videos
        ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
END $$;

SELECT 'Gallery media stats columns added successfully!' as status; 