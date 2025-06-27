-- Create gallery_media_categories table
CREATE TABLE public.gallery_media_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery_media_locations table
CREATE TABLE public.gallery_media_locations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add category_id and location_id to gallery_images
ALTER TABLE public.gallery_images
ADD COLUMN category_id BIGINT REFERENCES public.gallery_media_categories(id) ON DELETE SET NULL,
ADD COLUMN location_id BIGINT REFERENCES public.gallery_media_locations(id) ON DELETE SET NULL;

-- Add category_id and location_id to gallery_videos
ALTER TABLE public.gallery_videos
ADD COLUMN category_id BIGINT REFERENCES public.gallery_media_categories(id) ON DELETE SET NULL,
ADD COLUMN location_id BIGINT REFERENCES public.gallery_media_locations(id) ON DELETE SET NULL;

-- RLS for gallery_media_categories
ALTER TABLE public.gallery_media_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access on gallery_media_categories" ON public.gallery_media_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read on gallery_media_categories" ON public.gallery_media_categories FOR SELECT USING (true);

-- RLS for gallery_media_locations
ALTER TABLE public.gallery_media_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access on gallery_media_locations" ON public.gallery_media_locations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read on gallery_media_locations" ON public.gallery_media_locations FOR SELECT USING (true);

-- Optional: Migrate existing categories from 'galleries' table if needed, 
-- though the prompt implies new categories for individual media.
-- For now, we will assume categories/locations are new per media item.

SELECT 'Gallery media attributes schema updated successfully!' as status; 