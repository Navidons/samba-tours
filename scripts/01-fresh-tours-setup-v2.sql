-- Fresh Tours System Setup - Version 2
-- Completely clean setup after force reset

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE tour_difficulty AS ENUM ('Easy', 'Moderate', 'Challenging');

-- Create profiles table for user management
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tour categories table
CREATE TABLE tour_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create main tours table
CREATE TABLE tours (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tour highlights table
CREATE TABLE tour_highlights (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    highlight TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Create tour inclusions table
CREATE TABLE tour_inclusions (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    included BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0
);

-- Create tour itinerary table
CREATE TABLE tour_itinerary (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    activities TEXT[]
);

-- Create tour images table
CREATE TABLE tour_images (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0
);

-- Create indexes for performance
CREATE INDEX idx_tours_category ON tours(category_id);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_featured ON tours(featured);
CREATE INDEX idx_tours_slug ON tours(slug);
CREATE INDEX idx_tour_highlights_tour ON tour_highlights(tour_id);
CREATE INDEX idx_tour_inclusions_tour ON tour_inclusions(tour_id);
CREATE INDEX idx_tour_itinerary_tour ON tour_itinerary(tour_id);
CREATE INDEX idx_tour_images_tour ON tour_images(tour_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tours_updated_at
    BEFORE UPDATE ON tours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create function to make user admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS TEXT AS $$
BEGIN
    UPDATE profiles 
    SET role = 'admin' 
    WHERE email = user_email;
    
    IF FOUND THEN
        RETURN 'User ' || user_email || ' is now an admin';
    ELSE
        RETURN 'User ' || user_email || ' not found';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_inclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can view active tours" ON tours
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view tour categories" ON tour_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can view tour highlights" ON tour_highlights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tours 
            WHERE tours.id = tour_highlights.tour_id 
            AND tours.status = 'active'
        )
    );

CREATE POLICY "Public can view tour inclusions" ON tour_inclusions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tours 
            WHERE tours.id = tour_inclusions.tour_id 
            AND tours.status = 'active'
        )
    );

CREATE POLICY "Public can view tour itinerary" ON tour_itinerary
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tours 
            WHERE tours.id = tour_itinerary.tour_id 
            AND tours.status = 'active'
        )
    );

CREATE POLICY "Public can view tour images" ON tour_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tours 
            WHERE tours.id = tour_images.tour_id 
            AND tours.status = 'active'
        )
    );

-- RLS Policies for admin access
CREATE POLICY "Admins can manage tours" ON tours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage tour categories" ON tour_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage tour highlights" ON tour_highlights
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage tour inclusions" ON tour_inclusions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage tour itinerary" ON tour_itinerary
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage tour images" ON tour_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Users can view their own profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
        )
    );

SELECT 'Fresh tours system setup complete - Version 2!' as status;
