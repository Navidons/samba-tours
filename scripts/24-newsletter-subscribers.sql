-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    source TEXT, -- e.g., 'blog_sidebar', 'landing_page'
    metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for newsletter signup
DROP POLICY IF EXISTS "Anyone can signup for newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can signup for newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Allow public select for newsletter subscribers (if needed)
DROP POLICY IF EXISTS "Public can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Public can view newsletter subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (true);

-- Create a unique index on email to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);

-- Grant permissions to the anon and authenticated roles
GRANT INSERT, SELECT ON public.newsletter_subscribers TO anon, authenticated;

-- Add comment to the table
COMMENT ON TABLE public.newsletter_subscribers IS 'Stores email addresses of newsletter subscribers'; 