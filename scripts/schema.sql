-- Restore Permissions and RLS Policies

-- Create custom types (if not already existing from setup scripts)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tour_difficulty') THEN
        CREATE TYPE tour_difficulty AS ENUM ('Easy', 'Moderate', 'Challenging');
    END IF;
END $$;

-- Create profiles table (if not already existing)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure `tour_categories` exists if not already created by your setup scripts
CREATE TABLE IF NOT EXISTS tour_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure `tours` table has all necessary columns, including those added manually
CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT,
    category_id INTEGER REFERENCES tour_categories(id),
    duration TEXT NOT NULL,
    max_group_size INTEGER DEFAULT 12,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    difficulty tour_difficulty DEFAULT 'Moderate',
    location TEXT NOT NULL,
    featured_image TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'inactive')),
    featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    best_time TEXT,
    physical_requirements TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Manually added columns during the conversation:
    exclusions TEXT[],
    inclusions TEXT[],
    itinerary JSONB[]
);

-- Ensure `tour_itinerary` exists
CREATE TABLE IF NOT EXISTS tour_itinerary (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    activities TEXT[]
);

-- Ensure `tour_inclusions` exists
CREATE TABLE IF NOT EXISTS tour_inclusions (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    included BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0
);

-- Ensure `tour_exclusions` exists (this was explicitly requested earlier)
CREATE TABLE IF NOT EXISTS tour_exclusions (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Indexes (if not already existing)
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category_id);
CREATE INDEX IF NOT EXISTS idx_tours_status ON tours(status);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tour_itinerary_tour ON tour_itinerary(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_inclusions_tour ON tour_inclusions(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_exclusions_tour ON tour_exclusions(tour_id);


-- Disable RLS on tables where we want simple public/authenticated grants
ALTER TABLE tours DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_highlights DISABLE ROW LEVEL SECURITY; -- Assuming you'll add this later
ALTER TABLE tour_inclusions DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_itinerary DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_images DISABLE ROW LEVEL SECURITY; -- Assuming you'll add this later
ALTER TABLE tour_exclusions DISABLE ROW LEVEL SECURITY; -- New table


-- Keep RLS on profiles but with simple, non-recursive policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies safely (using a temporary function to handle non-existence)
CREATE OR REPLACE FUNCTION drop_policy_if_exists(policy_name text, table_name text)
RETURNS void AS $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Ignore errors if policy doesn't exist
END;
$$ LANGUAGE plpgsql;

SELECT drop_policy_if_exists('profile_select_own', 'profiles');
SELECT drop_policy_if_exists('profile_update_own', 'profiles');
SELECT drop_policy_if_exists('Users can view own profile', 'profiles');
SELECT drop_policy_if_exists('Users can update own profile', 'profiles');

-- Apply RLS policies for profiles
CREATE POLICY "profile_select_own" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profile_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Grant public read access to tours and related tables
GRANT SELECT ON tours TO anon, authenticated;
GRANT SELECT ON tour_categories TO anon, authenticated;
GRANT SELECT ON tour_highlights TO anon, authenticated;
GRANT SELECT ON tour_inclusions TO anon, authenticated;
GRANT SELECT ON tour_itinerary TO anon, authenticated;
GRANT SELECT ON tour_images TO anon, authenticated;
GRANT SELECT ON tour_exclusions TO anon, authenticated;

-- Grant full access to authenticated users for tour management
GRANT ALL ON tours TO authenticated;
GRANT ALL ON tour_categories TO authenticated;
GRANT ALL ON tour_highlights TO authenticated;
GRANT ALL ON tour_inclusions TO authenticated;
GRANT ALL ON tour_itinerary TO authenticated;
GRANT ALL ON tour_images TO authenticated;
GRANT ALL ON tour_exclusions TO authenticated;


-- Grant sequence permissions (important for SERIAL primary keys)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Clean up the helper function
DROP FUNCTION IF EXISTS drop_policy_if_exists(text, text);

SELECT 'Permissions and RLS policies restored successfully!' as status;