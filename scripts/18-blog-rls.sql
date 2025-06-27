-- Enable RLS for blog_categories table
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read blog categories
CREATE POLICY "Allow authenticated users to read blog_categories" ON public.blog_categories
FOR SELECT
TO authenticated
USING (TRUE);

-- Allow admin users to insert, update, and delete blog categories
-- Assuming you have a 'role' column in your 'profiles' table or similar mechanism
-- For simplicity, we'll allow all authenticated users for now. 
-- In a real app, you'd check for specific admin roles.
CREATE POLICY "Allow authenticated users to manage blog_categories" ON public.blog_categories
FOR ALL
TO authenticated
USING (TRUE) WITH CHECK (TRUE);

-- Enable RLS for blog_posts table
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read published blog posts
CREATE POLICY "Allow authenticated users to read published blog_posts" ON public.blog_posts
FOR SELECT
TO authenticated
USING (status = 'published');

-- Allow admin users (or post authors) to read all their own posts (including drafts)
CREATE POLICY "Allow authenticated users to read own blog_posts" ON public.blog_posts
FOR SELECT
TO authenticated
USING (auth.uid() = author_id);

-- New policy: Allow admin users to read all blog posts
CREATE POLICY "Allow admin to read all blog_posts" ON public.blog_posts
FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Allow admin users to insert blog posts
CREATE POLICY "Allow authenticated users to insert blog_posts" ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id); -- Only allow inserting if author_id is the current user

-- Allow admin users (or post authors) to update their own blog posts
CREATE POLICY "Allow authenticated users to update own blog_posts" ON public.blog_posts
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

-- Allow admin users (or post authors) to delete their own blog posts
CREATE POLICY "Allow authenticated users to delete own blog_posts" ON public.blog_posts
FOR DELETE
TO authenticated
USING (auth.uid() = author_id); 