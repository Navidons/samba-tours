-- Create visitors table for tracking website visitors
CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  unique_identifier TEXT NULL,
  ip_address TEXT NULL,
  user_agent TEXT NULL,
  device_type TEXT NULL,
  browser TEXT NULL,
  operating_system TEXT NULL,
  country TEXT NULL,
  city TEXT NULL,
  first_visit_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
  last_visit_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
  total_visits INTEGER NULL DEFAULT 1,
  referrer TEXT NULL,
  page_visited TEXT NULL,
  is_mobile BOOLEAN NULL DEFAULT FALSE,
  latitude DOUBLE PRECISION NULL,
  longitude DOUBLE PRECISION NULL,
  timezone TEXT NULL,
  language TEXT NULL,
  CONSTRAINT visitors_pkey PRIMARY KEY (id),
  CONSTRAINT visitors_unique_identifier_key UNIQUE (unique_identifier)
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_visitors_unique_identifier 
ON public.visitors USING BTREE (unique_identifier) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_visitors_first_visit 
ON public.visitors USING BTREE (first_visit_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_visitors_last_visit 
ON public.visitors USING BTREE (last_visit_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_visitors_device_type 
ON public.visitors USING BTREE (device_type) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_visitors_browser 
ON public.visitors USING BTREE (browser) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_visitors_operating_system 
ON public.visitors USING BTREE (operating_system) TABLESPACE pg_default;

-- Function to increment visitor count with comprehensive tracking
CREATE OR REPLACE FUNCTION increment_visitor_count(
  p_unique_identifier TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_device_type TEXT DEFAULT NULL,
  p_browser TEXT DEFAULT NULL,
  p_operating_system TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_page_visited TEXT DEFAULT NULL,
  p_is_mobile BOOLEAN DEFAULT FALSE,
  p_latitude DOUBLE PRECISION DEFAULT NULL,
  p_longitude DOUBLE PRECISION DEFAULT NULL,
  p_timezone TEXT DEFAULT NULL,
  p_language TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  visitor_record UUID;
BEGIN
  -- Insert or update visitor record with comprehensive details
  INSERT INTO visitors (
    unique_identifier,
    ip_address,
    user_agent,
    device_type,
    browser,
    operating_system,
    country,
    city,
    referrer,
    page_visited,
    is_mobile,
    latitude,
    longitude,
    timezone,
    language
  )
  VALUES (
    p_unique_identifier,
    p_ip_address,
    p_user_agent,
    p_device_type,
    p_browser,
    p_operating_system,
    p_country,
    p_city,
    p_referrer,
    p_page_visited,
    p_is_mobile,
    p_latitude,
    p_longitude,
    p_timezone,
    p_language
  )
  ON CONFLICT (unique_identifier) DO UPDATE 
  SET 
    total_visits = visitors.total_visits + 1,
    last_visit_at = CURRENT_TIMESTAMP,
    ip_address = COALESCE(EXCLUDED.ip_address, visitors.ip_address),
    user_agent = COALESCE(EXCLUDED.user_agent, visitors.user_agent),
    device_type = COALESCE(EXCLUDED.device_type, visitors.device_type),
    browser = COALESCE(EXCLUDED.browser, visitors.browser),
    operating_system = COALESCE(EXCLUDED.operating_system, visitors.operating_system),
    country = COALESCE(EXCLUDED.country, visitors.country),
    city = COALESCE(EXCLUDED.city, visitors.city),
    referrer = COALESCE(EXCLUDED.referrer, visitors.referrer),
    page_visited = COALESCE(EXCLUDED.page_visited, visitors.page_visited),
    is_mobile = COALESCE(EXCLUDED.is_mobile, visitors.is_mobile),
    latitude = COALESCE(EXCLUDED.latitude, visitors.latitude),
    longitude = COALESCE(EXCLUDED.longitude, visitors.longitude),
    timezone = COALESCE(EXCLUDED.timezone, visitors.timezone),
    language = COALESCE(EXCLUDED.language, visitors.language)
  RETURNING id INTO visitor_record;

  RETURN visitor_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for visitors table
CREATE POLICY "Allow insert for all users" ON visitors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for all users" ON visitors
    FOR SELECT USING (true);

CREATE POLICY "Allow update for all users" ON visitors
    FOR UPDATE USING (true);

-- Grant permissions
GRANT INSERT, SELECT, UPDATE ON visitors TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_visitor_count(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, 
  TEXT, TEXT, BOOLEAN, DOUBLE PRECISION, DOUBLE PRECISION, 
  TEXT, TEXT
) TO authenticated, anon;

-- Add comments to the table and columns
COMMENT ON TABLE visitors IS 'Comprehensive tracking of website visitors with detailed metadata';
COMMENT ON COLUMN visitors.unique_identifier IS 'Unique identifier for the visitor (e.g., session ID)';
COMMENT ON COLUMN visitors.ip_address IS 'IP address of the visitor';
COMMENT ON COLUMN visitors.user_agent IS 'User agent string of the visitor''s browser';
COMMENT ON COLUMN visitors.device_type IS 'Type of device used (mobile, desktop, tablet)';
COMMENT ON COLUMN visitors.browser IS 'Browser used by the visitor';
COMMENT ON COLUMN visitors.operating_system IS 'Operating system of the visitor';
COMMENT ON COLUMN visitors.total_visits IS 'Total number of visits by this visitor';
COMMENT ON COLUMN visitors.is_mobile IS 'Whether the visitor is using a mobile device'; 