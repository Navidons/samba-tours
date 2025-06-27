-- Clean Fix RLS Policies - Handle Existing Policies
-- This script safely fixes the recursive policy issues

-- Function to safely drop policy if it exists
CREATE OR REPLACE FUNCTION drop_policy_if_exists(policy_name text, table_name text)
RETURNS void AS $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors if policy doesn't exist
        NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop all existing policies safely
SELECT drop_policy_if_exists('Users can view own profile', 'profiles');
SELECT drop_policy_if_exists('Users can update own profile', 'profiles');
SELECT drop_policy_if_exists('Admins can view all profiles', 'profiles');
SELECT drop_policy_if_exists('Admins can manage tours', 'tours');
SELECT drop_policy_if_exists('Admins can manage tour categories', 'tour_categories');
SELECT drop_policy_if_exists('Admins can manage tour highlights', 'tour_highlights');
SELECT drop_policy_if_exists('Admins can manage tour inclusions', 'tour_inclusions');
SELECT drop_policy_if_exists('Admins can manage tour itinerary', 'tour_itinerary');
SELECT drop_policy_if_exists('Admins can manage tour images', 'tour_images');
SELECT drop_policy_if_exists('Public can view tours', 'tours');
SELECT drop_policy_if_exists('Public can view categories', 'tour_categories');

-- Disable RLS on all tour-related tables to make them publicly accessible
ALTER TABLE tours DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_highlights DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_inclusions DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_itinerary DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_images DISABLE ROW LEVEL SECURITY;

-- Keep RLS on profiles but with simple, non-recursive policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple profile policies
CREATE POLICY "profile_select_own" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profile_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Grant public access to tour tables
GRANT SELECT ON tours TO anon, authenticated;
GRANT SELECT ON tour_categories TO anon, authenticated;
GRANT SELECT ON tour_highlights TO anon, authenticated;
GRANT SELECT ON tour_inclusions TO anon, authenticated;
GRANT SELECT ON tour_itinerary TO anon, authenticated;
GRANT SELECT ON tour_images TO anon, authenticated;

-- Grant full access to authenticated users for tour management
GRANT ALL ON tours TO authenticated;
GRANT ALL ON tour_categories TO authenticated;
GRANT ALL ON tour_highlights TO authenticated;
GRANT ALL ON tour_inclusions TO authenticated;
GRANT ALL ON tour_itinerary TO authenticated;
GRANT ALL ON tour_images TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Clean up the helper function
DROP FUNCTION drop_policy_if_exists(text, text);

SELECT 'RLS policies cleaned and fixed successfully!' as status;
