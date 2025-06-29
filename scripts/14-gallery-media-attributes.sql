-- Create gallery_media_categories table
CREATE TABLE IF NOT EXISTS public.gallery_media_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery_media_locations table
CREATE TABLE IF NOT EXISTS public.gallery_media_locations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add category_id and location_id to gallery_images if not exists
DO $$
BEGIN
    -- Check and add category_id to gallery_images
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_images' AND column_name='category_id'
    ) THEN
        ALTER TABLE public.gallery_images
        ADD COLUMN category_id BIGINT REFERENCES public.gallery_media_categories(id) ON DELETE SET NULL;
    END IF;

    -- Check and add location_id to gallery_images
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_images' AND column_name='location_id'
    ) THEN
        ALTER TABLE public.gallery_images
        ADD COLUMN location_id BIGINT REFERENCES public.gallery_media_locations(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add category_id and location_id to gallery_videos if not exists
DO $$
BEGIN
    -- Check and add category_id to gallery_videos
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_videos' AND column_name='category_id'
    ) THEN
        ALTER TABLE public.gallery_videos
        ADD COLUMN category_id BIGINT REFERENCES public.gallery_media_categories(id) ON DELETE SET NULL;
    END IF;

    -- Check and add location_id to gallery_videos
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='gallery_videos' AND column_name='location_id'
    ) THEN
        ALTER TABLE public.gallery_videos
        ADD COLUMN location_id BIGINT REFERENCES public.gallery_media_locations(id) ON DELETE SET NULL;
    END IF;
END $$;

-- RLS for gallery_media_categories
ALTER TABLE public.gallery_media_categories ENABLE ROW LEVEL SECURITY;

-- Check and create policies for gallery_media_categories
DO $$
BEGIN
    -- Check if authenticated full access policy exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'gallery_media_categories' 
        AND policyname = 'Authenticated full access on gallery_media_categories'
    ) THEN
        CREATE POLICY "Authenticated full access on gallery_media_categories" 
        ON public.gallery_media_categories 
        FOR ALL 
        USING (auth.role() = 'authenticated');
    END IF;

    -- Check if public read policy exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'gallery_media_categories' 
        AND policyname = 'Public read on gallery_media_categories'
    ) THEN
        CREATE POLICY "Public read on gallery_media_categories" 
        ON public.gallery_media_categories 
        FOR SELECT 
        USING (true);
    END IF;
END $$;

-- RLS for gallery_media_locations
ALTER TABLE public.gallery_media_locations ENABLE ROW LEVEL SECURITY;

-- Check and create policies for gallery_media_locations
DO $$
BEGIN
    -- Check if authenticated full access policy exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'gallery_media_locations' 
        AND policyname = 'Authenticated full access on gallery_media_locations'
    ) THEN
        CREATE POLICY "Authenticated full access on gallery_media_locations" 
        ON public.gallery_media_locations 
        FOR ALL 
        USING (auth.role() = 'authenticated');
    END IF;

    -- Check if public read policy exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'gallery_media_locations' 
        AND policyname = 'Public read on gallery_media_locations'
    ) THEN
        CREATE POLICY "Public read on gallery_media_locations" 
        ON public.gallery_media_locations 
        FOR SELECT 
        USING (true);
    END IF;
END $$;

-- Optional: Migrate existing categories from 'galleries' table if needed, 
-- though the prompt implies new categories for individual media.
-- For now, we will assume categories/locations are new per media item.

SELECT 'Gallery media attributes schema updated successfully!' as status; 