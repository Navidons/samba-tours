-- Ensure service_role has connect privilege on the database
GRANT CONNECT ON DATABASE postgres TO service_role;

-- Grant usage on the public schema to service_role
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant all privileges on all tables in the public schema to service_role
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant usage on all sequences in the public schema to service_role
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT USAGE ON SEQUENCES TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Create tour_images table
CREATE TABLE IF NOT EXISTS tour_images (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and set insert policy for tour_images
ALTER TABLE public.tour_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role to insert tour_images" ON public.tour_images;
CREATE POLICY "Allow service_role to insert tour_images" ON public.tour_images
FOR INSERT TO service_role WITH CHECK (true);
GRANT USAGE ON SEQUENCE public.tour_images_id_seq TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.tour_images TO service_role;

-- Create tour_itinerary table
CREATE TABLE IF NOT EXISTS tour_itinerary (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT,
    location TEXT,
    description TEXT,
    activities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tour_id, day_number)
);

-- Enable RLS and set insert policy for tour_itinerary
ALTER TABLE public.tour_itinerary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role to insert tour_itinerary" ON public.tour_itinerary;
CREATE POLICY "Allow service_role to insert tour_itinerary" ON public.tour_itinerary
FOR INSERT TO service_role WITH CHECK (true);
GRANT USAGE ON SEQUENCE public.tour_itinerary_id_seq TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.tour_itinerary TO service_role;

-- Create tour_inclusions table
CREATE TABLE IF NOT EXISTS tour_inclusions (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tour_id, item)
);

-- Enable RLS and set insert policy for tour_inclusions
ALTER TABLE public.tour_inclusions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role to insert tour_inclusions" ON public.tour_inclusions;
CREATE POLICY "Allow service_role to insert tour_inclusions" ON public.tour_inclusions
FOR INSERT TO service_role WITH CHECK (true);
GRANT USAGE ON SEQUENCE public.tour_inclusions_id_seq TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.tour_inclusions TO service_role;

-- Create tour_exclusions table
CREATE TABLE IF NOT EXISTS tour_exclusions (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tour_id, item)
);

-- Enable RLS and set insert policy for tour_exclusions
ALTER TABLE public.tour_exclusions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role to insert tour_exclusions" ON public.tour_exclusions;
CREATE POLICY "Allow service_role to insert tour_exclusions" ON public.tour_exclusions
FOR INSERT TO service_role WITH CHECK (true);
GRANT USAGE ON SEQUENCE public.tour_exclusions_id_seq TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.tour_exclusions TO service_role;

-- Create tour_highlights table
-- Note: This table already exists in 01-fresh-tours-setup-v2.sql with (tour_id, title) unique constraint.
-- We need to ensure its schema matches the application's expectation (highlight column).
-- If the existing highlights column in tours is TEXT[], we need to remove it.

CREATE TABLE IF NOT EXISTS tour_highlights (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    highlight TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tour_id, highlight)
);

-- Enable RLS and set insert policy for tour_highlights
ALTER TABLE public.tour_highlights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role to insert tour_highlights" ON public.tour_highlights;
CREATE POLICY "Allow service_role to insert tour_highlights" ON public.tour_highlights
FOR INSERT TO service_role WITH CHECK (true);
GRANT USAGE ON SEQUENCE public.tour_highlights_id_seq TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.tour_highlights TO service_role;

-- Create tour_best_times table
CREATE TABLE IF NOT EXISTS tour_best_times (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    best_time_item TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tour_id, best_time_item)
);

-- Enable RLS and set insert policy for tour_best_times
ALTER TABLE public.tour_best_times ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role to insert tour_best_times" ON public.tour_best_times;
CREATE POLICY "Allow service_role to insert tour_best_times" ON public.tour_best_times
FOR INSERT TO service_role WITH CHECK (true);
GRANT USAGE ON SEQUENCE public.tour_best_times_id_seq TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.tour_best_times TO service_role;

-- Create tour_physical_requirements table
CREATE TABLE IF NOT EXISTS tour_physical_requirements (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    requirement TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tour_id, requirement)
);

-- Enable RLS and set insert policy for tour_physical_requirements
ALTER TABLE public.tour_physical_requirements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role to insert tour_physical_requirements" ON public.tour_physical_requirements;
CREATE POLICY "Allow service_role to insert tour_physical_requirements" ON public.tour_physical_requirements
FOR INSERT TO service_role WITH CHECK (true);
GRANT USAGE ON SEQUENCE public.tour_physical_requirements_id_seq TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.tour_physical_requirements TO service_role;

-- Alter existing tours table to remove old columns
-- IMPORTANT: If you have existing data in these columns, you may want to migrate it first.
-- This will drop the columns and any data they contain.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'highlights') THEN
        ALTER TABLE public.tours DROP COLUMN highlights;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'itinerary') THEN
        ALTER TABLE public.tours DROP COLUMN itinerary;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'inclusions') THEN
        ALTER TABLE public.tours DROP COLUMN inclusions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'exclusions') THEN
        ALTER TABLE public.tours DROP COLUMN exclusions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'gallery_images') THEN
        ALTER TABLE public.tours DROP COLUMN gallery_images;
    END IF;
    -- Also update the tours table to reflect changes in column names from 01-fresh-tours-setup-v2.sql to app/api/tours/route.ts
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'duration_days') THEN
        ALTER TABLE public.tours RENAME COLUMN duration_days TO duration;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'group_size_max') THEN
        ALTER TABLE public.tours RENAME COLUMN group_size_max TO max_group_size;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'base_price') THEN
        ALTER TABLE public.tours RENAME COLUMN base_price TO price;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'discount_price') THEN
        ALTER TABLE public.tours RENAME COLUMN discount_price TO original_price;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'cover_image_url') THEN
        ALTER TABLE public.tours RENAME COLUMN cover_image_url TO featured_image;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'is_active') THEN
        ALTER TABLE public.tours RENAME COLUMN is_active TO status;
    END IF;

    -- Add best_time and physical_requirements columns as TEXT, as they are JSON.parsed and passed as string from the app
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'best_time') THEN
        ALTER TABLE public.tours ADD COLUMN best_time TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'physical_requirements') THEN
        ALTER TABLE public.tours ADD COLUMN physical_requirements TEXT;
    END IF;
END $$; 