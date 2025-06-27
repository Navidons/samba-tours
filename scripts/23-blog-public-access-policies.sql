-- Enable RLS on blog tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to view published blog posts
CREATE POLICY "Allow anonymous users to view published blog posts" ON blog_posts
FOR SELECT
TO anon
USING (status = 'published');

-- Policy for authenticated users to view all blog posts (for admin purposes)
CREATE POLICY "Allow authenticated users to view all blog posts" ON blog_posts
FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to manage blog posts (insert, update, delete)
CREATE POLICY "Allow authenticated users to manage blog posts" ON blog_posts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy for anonymous users to view blog categories
CREATE POLICY "Allow anonymous users to view blog categories" ON blog_categories
FOR SELECT
TO anon
USING (true);

-- Policy for authenticated users to manage blog categories
CREATE POLICY "Allow authenticated users to manage blog categories" ON blog_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy for anonymous users to view author profiles (only basic info for blog posts)
CREATE POLICY "Allow anonymous users to view author profiles for blog posts" ON profiles
FOR SELECT
TO anon
USING (true);

-- Policy for authenticated users to manage their own profile
CREATE POLICY "Allow users to manage their own profile" ON profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for authenticated users to view all profiles (for admin purposes)
CREATE POLICY "Allow authenticated users to view all profiles" ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Grant necessary permissions to anon role
GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON blog_categories TO anon;
GRANT SELECT ON profiles TO anon;

-- Grant necessary permissions to authenticated role
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON blog_categories TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON SEQUENCE blog_posts_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE blog_categories_id_seq TO authenticated; 