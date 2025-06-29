-- Fresh Tours System Setup - Version 2
-- Completely clean setup after force reset

-- Defensive custom type creation
DO $$
BEGIN
    -- Check and create user_role type if not exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type 
        WHERE typname = 'user_role'
    ) THEN
CREATE TYPE user_role AS ENUM ('admin', 'user');
        RAISE NOTICE 'Created user_role type';
    ELSE
        RAISE NOTICE 'user_role type already exists';
    END IF;

    -- Check and create tour_difficulty type if not exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type 
        WHERE typname = 'tour_difficulty'
    ) THEN
CREATE TYPE tour_difficulty AS ENUM ('Easy', 'Moderate', 'Challenging');
        RAISE NOTICE 'Created tour_difficulty type';
    ELSE
        RAISE NOTICE 'tour_difficulty type already exists';
    END IF;
END $$;

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Defensive table creation for tour_categories
DO $$
BEGIN
    -- Check and create tour_categories table if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tour_categories'
    ) THEN
CREATE TABLE tour_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
            description TEXT,
    slug TEXT NOT NULL UNIQUE,
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Insert some default categories
        INSERT INTO tour_categories (name, slug, description, is_featured) VALUES
        ('Wildlife Safari', 'wildlife-safari', 'Explore the rich wildlife of Uganda', TRUE),
        ('Mountain Trekking', 'mountain-trekking', 'Challenging mountain expeditions', TRUE),
        ('Cultural Tours', 'cultural-tours', 'Immerse in local traditions and communities', TRUE),
        ('Birdwatching', 'birdwatching', 'Discover Uganda''s incredible bird species', FALSE),
        ('Adventure Trips', 'adventure-trips', 'Exciting and thrilling experiences', FALSE)
        ON CONFLICT (name) DO NOTHING;
        
        RAISE NOTICE 'Created tour_categories table with default categories';
    ELSE
        RAISE NOTICE 'tour_categories table already exists';
    END IF;
END $$;

-- Defensive table creation for tours
DO $$
BEGIN
    -- Check and create tours table if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tours'
    ) THEN
CREATE TABLE tours (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id INTEGER REFERENCES tour_categories(id),
            
            -- Tour details
            description TEXT,
            highlights TEXT[],
            itinerary JSONB,
            
            -- Pricing and logistics
            duration_days INTEGER NOT NULL,
            group_size_min INTEGER DEFAULT 1,
            group_size_max INTEGER DEFAULT 12,
            difficulty tour_difficulty DEFAULT 'Easy',
            
            -- Pricing
            base_price NUMERIC(10,2) NOT NULL,
            discount_price NUMERIC(10,2),
            
            -- Metadata
            is_featured BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            
            -- Media
            cover_image_url TEXT,
            gallery_images TEXT[],
            
            -- Location
            start_location TEXT,
            end_location TEXT,
            
            -- Inclusions and exclusions
            inclusions TEXT[],
            exclusions TEXT[],
            
            -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

        -- Insert some sample tours
        INSERT INTO tours (
            title, 
            slug, 
            category_id, 
            description, 
            highlights, 
            itinerary, 
            duration_days, 
            group_size_min, 
            group_size_max, 
            difficulty, 
            base_price, 
            is_featured,
            start_location,
            end_location,
            inclusions,
            exclusions
        ) VALUES 
        (
            'Murchison Falls Adventure', 
            'murchison-falls-adventure', 
            (SELECT id FROM tour_categories WHERE slug = 'wildlife-safari'),
            'Explore the magnificent Murchison Falls and its incredible wildlife.',
            ARRAY[
                'Spectacular waterfall views', 
                'Big Five wildlife spotting', 
                'Nile River boat safari'
            ],
            jsonb_build_object(
                'day1', 'Arrival and orientation',
                'day2', 'Morning game drive, afternoon boat safari',
                'day3', 'Waterfall hike and wildlife viewing'
            ),
            3,  -- duration
            2,  -- min group size
            12, -- max group size
            'Moderate',
            450.00,  -- base price
            TRUE,
            'Kampala',
            'Murchison Falls National Park',
            ARRAY[
                'Professional guide', 
                'Park entrance fees', 
                'Game drives', 
                'Boat safari'
            ],
            ARRAY[
                'Personal expenses', 
                'Travel insurance', 
                'Alcoholic beverages'
            ]
        ) ON CONFLICT (slug) DO NOTHING;

        RAISE NOTICE 'Created tours table with sample tour';
    ELSE
        RAISE NOTICE 'tours table already exists';
    END IF;
END $$;

-- Defensive table creation for tour_highlights
DO $$
BEGIN
    -- Check and create tour_highlights table if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tour_highlights'
    ) THEN
CREATE TABLE tour_highlights (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
            
            -- Highlight details
            title TEXT NOT NULL,
            description TEXT,
            icon_name TEXT,
            
            -- Ordering and visibility
            display_order INTEGER DEFAULT 0,
            is_primary BOOLEAN DEFAULT FALSE,
            
            -- Metadata
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Unique constraint to prevent duplicate highlights for a tour
            UNIQUE(tour_id, title)
        );

        -- Insert sample highlights for the Murchison Falls Adventure tour
        INSERT INTO tour_highlights (
            tour_id, 
            title, 
            description, 
            icon_name, 
            display_order, 
            is_primary
        ) VALUES 
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Spectacular Waterfall',
            'Witness the incredible power of Murchison Falls, where the Nile River squeezes through a 7-meter wide gorge.',
            'waterfall',
            1,
            TRUE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Wildlife Diversity',
            'Encounter a rich variety of wildlife including elephants, lions, giraffes, and numerous bird species.',
            'wildlife',
            2,
            TRUE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Nile River Boat Safari',
            'Enjoy a scenic boat trip along the Nile, offering unique wildlife viewing opportunities and breathtaking landscapes.',
            'boat',
            3,
            TRUE
        )
        ON CONFLICT (tour_id, title) DO NOTHING;

        RAISE NOTICE 'Created tour_highlights table with sample highlights';
    ELSE
        RAISE NOTICE 'tour_highlights table already exists';
    END IF;
END $$;

-- Defensive table creation for tour_inclusions
DO $$
BEGIN
    -- Check and create tour_inclusions table if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tour_inclusions'
    ) THEN
        CREATE TYPE inclusion_type AS ENUM ('Accommodation', 'Meals', 'Transportation', 'Activities', 'Equipment', 'Guide', 'Other');

CREATE TABLE tour_inclusions (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
            
            -- Inclusion details
            title TEXT NOT NULL,
            description TEXT,
            inclusion_type inclusion_type DEFAULT 'Other',
            
            -- Pricing and availability
            is_complimentary BOOLEAN DEFAULT TRUE,
            additional_cost NUMERIC(10,2),
            
            -- Ordering and visibility
            display_order INTEGER DEFAULT 0,
            is_primary BOOLEAN DEFAULT FALSE,
            
            -- Metadata
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Unique constraint to prevent duplicate inclusions for a tour
            UNIQUE(tour_id, title)
        );

        -- Insert sample inclusions for the Murchison Falls Adventure tour
        INSERT INTO tour_inclusions (
            tour_id, 
            title, 
            description, 
            inclusion_type,
            is_complimentary,
            additional_cost,
            display_order, 
            is_primary
        ) VALUES 
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Professional Safari Guide',
            'Experienced, English-speaking guide throughout the tour',
            'Guide',
            TRUE,
            NULL,
            1,
            TRUE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Park Entrance Fees',
            'All necessary fees for Murchison Falls National Park',
            'Activities',
            TRUE,
            NULL,
            2,
            TRUE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Game Drives',
            'Multiple guided game drives in open-top safari vehicles',
            'Activities',
            TRUE,
            NULL,
            3,
            TRUE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Nile River Boat Safari',
            'Scenic boat trip along the Nile with wildlife viewing opportunities',
            'Activities',
            TRUE,
            NULL,
            4,
            TRUE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Meals',
            'All meals during the tour (breakfast, lunch, and dinner)',
            'Meals',
            TRUE,
            NULL,
            5,
            FALSE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            'Accommodation',
            'Comfortable lodging in selected safari lodges',
            'Accommodation',
            TRUE,
            NULL,
            6,
            FALSE
        )
        ON CONFLICT (tour_id, title) DO NOTHING;

        RAISE NOTICE 'Created tour_inclusions table with sample inclusions';
    ELSE
        RAISE NOTICE 'tour_inclusions table already exists';
    END IF;
END $$;

-- Defensive table creation for tour_itinerary
DO $$
BEGIN
    -- Check and create tour_itinerary table if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tour_itinerary'
    ) THEN
        CREATE TYPE day_activity_type AS ENUM (
            'Travel', 
            'Sightseeing', 
            'Wildlife Viewing', 
            'Cultural Experience', 
            'Hiking', 
            'Boat Trip', 
            'Rest', 
            'Other'
        );

CREATE TABLE tour_itinerary (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
            
            -- Itinerary details
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
            description TEXT,
            activity_type day_activity_type DEFAULT 'Other',
            
            -- Timing and logistics
            start_time TIME,
            end_time TIME,
            duration_hours NUMERIC(5,2),
            
            -- Location and movement
            start_location TEXT,
            end_location TEXT,
            
            -- Additional details
            meals_included TEXT[],
            highlights TEXT[],
            
            -- Media and visual references
            image_urls TEXT[],
            
            -- Ordering and visibility
            display_order INTEGER DEFAULT 0,
            is_key_day BOOLEAN DEFAULT FALSE,
            
            -- Metadata
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Unique constraint to prevent duplicate days for a tour
            UNIQUE(tour_id, day_number)
        );

        -- Insert sample itinerary for the Murchison Falls Adventure tour
        INSERT INTO tour_itinerary (
            tour_id, 
            day_number, 
            title, 
            description, 
            activity_type,
            start_time,
            end_time,
            duration_hours,
            start_location,
            end_location,
            meals_included,
            highlights,
            display_order,
            is_key_day
        ) VALUES 
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            1,
            'Arrival and Orientation',
            'Travel to Murchison Falls National Park, check-in, and evening briefing',
            'Travel',
            '10:00:00',
            '18:00:00',
            8,
            'Kampala',
            'Murchison Falls National Park',
            ARRAY['Lunch', 'Dinner'],
            ARRAY['Scenic drive', 'Park entry', 'Sunset welcome'],
            1,
            FALSE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            2,
            'Morning Game Drive and Nile Boat Safari',
            'Early morning wildlife viewing followed by a scenic boat trip to the base of Murchison Falls',
            'Wildlife Viewing',
            '06:00:00',
            '16:00:00',
            10,
            'Murchison Falls National Park',
            'Murchison Falls',
            ARRAY['Breakfast', 'Lunch', 'Dinner'],
            ARRAY['Big Five spotting', 'Nile River wildlife', 'Waterfall views'],
            2,
            TRUE
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            3,
            'Waterfall Hike and Departure',
            'Morning hike to the top of Murchison Falls, followed by return journey',
            'Hiking',
            '07:00:00',
            '16:00:00',
            9,
            'Murchison Falls',
            'Kampala',
            ARRAY['Breakfast', 'Lunch'],
            ARRAY['Waterfall summit', 'Panoramic views', 'Final wildlife encounters'],
            3,
            TRUE
        )
        ON CONFLICT (tour_id, day_number) DO NOTHING;

        RAISE NOTICE 'Created tour_itinerary table with sample itinerary';
    ELSE
        RAISE NOTICE 'tour_itinerary table already exists';
    END IF;
END $$;

-- Defensive table creation for tour_images
DO $$
BEGIN
    -- Check and create tour_images table if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tour_images'
    ) THEN
        CREATE TYPE image_usage_type AS ENUM (
            'Cover', 
            'Thumbnail', 
            'Gallery', 
            'Itinerary', 
            'Highlight', 
            'Landscape', 
            'Wildlife', 
            'Other'
        );

CREATE TABLE tour_images (
            id SERIAL PRIMARY KEY,
            tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
            
            -- Image details
            url TEXT NOT NULL,
            alt_text TEXT,
            caption TEXT,
            
            -- Image classification
            image_usage image_usage_type DEFAULT 'Other',
            
            -- Metadata
            file_name TEXT,
            file_size INTEGER,
            mime_type TEXT,
            
            -- Image attributes
            width INTEGER,
            height INTEGER,
            
            -- Visibility and ordering
            display_order INTEGER DEFAULT 0,
            is_primary BOOLEAN DEFAULT FALSE,
            is_visible BOOLEAN DEFAULT TRUE,
            
            -- Tracking
            upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            uploaded_by UUID REFERENCES auth.users(id),
            
            -- Additional metadata
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Unique constraint to prevent duplicate images
            UNIQUE(tour_id, url)
        );

        -- Insert sample images for the Murchison Falls Adventure tour
        INSERT INTO tour_images (
            tour_id, 
            url, 
            alt_text, 
            caption, 
            image_usage,
            file_name,
            file_size,
            mime_type,
            width,
            height,
            display_order,
            is_primary,
            uploaded_by
        ) VALUES 
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            '/images/murchison-falls-hero.jpg',
            'Murchison Falls Panoramic View',
            'The magnificent Murchison Falls where the Nile River squeezes through a narrow gorge',
            'Cover',
            'murchison-falls-hero.jpg',
            1024000,
            'image/jpeg',
            1920,
            1080,
            1,
            TRUE,
            (SELECT id FROM auth.users LIMIT 1)
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            '/images/murchison-falls-spectacular.jpg',
            'Waterfall Close-up',
            'A breathtaking close-up of Murchison Falls',
            'Highlight',
            'murchison-falls-spectacular.jpg',
            768000,
            'image/jpeg',
            1600,
            900,
            2,
            FALSE,
            (SELECT id FROM auth.users LIMIT 1)
        ),
        (
            (SELECT id FROM tours WHERE slug = 'murchison-falls-adventure'),
            '/images/wildlife-safari.jpg',
            'Wildlife Encounter',
            'Diverse wildlife in Murchison Falls National Park',
            'Wildlife',
            'wildlife-safari.jpg',
            512000,
            'image/jpeg',
            1200,
            800,
            3,
            FALSE,
            (SELECT id FROM auth.users LIMIT 1)
        )
        ON CONFLICT (tour_id, url) DO NOTHING;

        RAISE NOTICE 'Created tour_images table with sample images';
    ELSE
        RAISE NOTICE 'tour_images table already exists';
    END IF;
END $$;

-- Create tour exclusions table
CREATE TABLE tour_exclusions (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Skip trigger creation for tours
-- Existing update_updated_at_column function is used by other tables
-- Optional status message
SELECT 'Skipped trigger creation for tours table' AS status;

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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate trigger for new user registration
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
ALTER TABLE tour_exclusions ENABLE ROW LEVEL SECURITY;

-- Skip policy creation to prevent conflicts
-- Policies should be managed separately or through migration tools
SELECT 'Skipped policy creation for tours table' AS status;

-- Optional status message
SELECT 'Custom types and profiles table processed successfully' as status;
