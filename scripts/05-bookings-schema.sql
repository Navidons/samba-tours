-- Bookings Schema for Samba Tours
-- This file creates the necessary tables for the booking system

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_country VARCHAR(100),
    special_requests TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    staff_notes TEXT,
    contact_method VARCHAR(50) DEFAULT 'email' CHECK (contact_method IN ('email', 'phone', 'whatsapp')),
    preferred_contact_time VARCHAR(100),
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE
);

-- Create booking_items table to store individual tour bookings
CREATE TABLE IF NOT EXISTS booking_items (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    tour_title VARCHAR(255) NOT NULL,
    tour_price DECIMAL(10,2) NOT NULL,
    number_of_guests INTEGER NOT NULL,
    travel_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_guests table for detailed guest information
CREATE TABLE IF NOT EXISTS booking_guests (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    guest_name VARCHAR(255) NOT NULL,
    guest_age INTEGER,
    dietary_restrictions TEXT,
    medical_conditions TEXT,
    passport_number VARCHAR(100),
    nationality VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_communications table to track staff communications
CREATE TABLE IF NOT EXISTS booking_communications (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    communication_type VARCHAR(50) NOT NULL CHECK (communication_type IN ('email', 'phone', 'whatsapp', 'in_person')),
    communication_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    staff_member VARCHAR(255),
    notes TEXT,
    outcome VARCHAR(255),
    next_follow_up_date DATE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_tour_id ON booking_items(tour_id);
CREATE INDEX IF NOT EXISTS idx_booking_guests_booking_id ON booking_guests(booking_id);

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS VARCHAR(20) AS $$
DECLARE
    reference VARCHAR(20);
    counter INTEGER := 1;
BEGIN
    LOOP
        -- Generate reference in format: ST-YYYYMMDD-XXXX
        reference := 'ST-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
        
        -- Check if reference already exists
        IF NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference = reference) THEN
            RETURN reference;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_communications ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings table
CREATE POLICY "Bookings are viewable by authenticated users" ON bookings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Bookings are insertable by everyone" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Bookings are updatable by authenticated users" ON bookings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for booking_items table
CREATE POLICY "Booking items are viewable by authenticated users" ON booking_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Booking items are insertable by everyone" ON booking_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Booking items are updatable by authenticated users" ON booking_items
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for booking_guests table
CREATE POLICY "Booking guests are viewable by authenticated users" ON booking_guests
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Booking guests are insertable by everyone" ON booking_guests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Booking guests are updatable by authenticated users" ON booking_guests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for booking_communications table
CREATE POLICY "Booking communications are viewable by authenticated users" ON booking_communications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Booking communications are insertable by authenticated users" ON booking_communications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Booking communications are updatable by authenticated users" ON booking_communications
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample tours first to resolve foreign key constraint
INSERT INTO tour_categories (name, slug, description) 
VALUES 
    ('Wildlife Safari', 'wildlife-safari', 'Explore the amazing wildlife of Uganda'),
    ('Mountain Trekking', 'mountain-trekking', 'Challenging mountain expeditions')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tours (
    title, 
    slug, 
    description, 
    category_id, 
    duration, 
    price, 
    difficulty, 
    location, 
    created_by
) 
VALUES 
    (
        'Gorilla Trekking Adventure', 
        'gorilla-trekking', 
        'An incredible journey to see mountain gorillas in their natural habitat', 
        (SELECT id FROM tour_categories WHERE slug = 'wildlife-safari'), 
        '3 Days', 
        1200.00, 
        'Challenging', 
        'Bwindi Impenetrable National Park', 
        (SELECT id FROM auth.users LIMIT 1)
    ),
    (
        'Wildlife Safari Experience', 
        'wildlife-safari-experience', 
        'Explore the diverse wildlife of Uganda''s national parks', 
        (SELECT id FROM tour_categories WHERE slug = 'wildlife-safari'), 
        '4 Days', 
        1200.00, 
        'Moderate', 
        'Queen Elizabeth National Park', 
        (SELECT id FROM auth.users LIMIT 1)
    )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (booking_reference, customer_name, customer_email, customer_phone, total_amount, status, payment_status)
VALUES 
    ('ST-20241201-0001', 'John Doe', 'john@example.com', '+1234567890', 2400.00, 'confirmed', 'paid'),
    ('ST-20241201-0002', 'Jane Smith', 'jane@example.com', '+1234567891', 1200.00, 'pending', 'pending')
ON CONFLICT (booking_reference) DO NOTHING;

-- Insert sample booking items
INSERT INTO booking_items (booking_id, tour_id, tour_title, tour_price, number_of_guests, travel_date, total_price)
VALUES 
    (
        (SELECT id FROM bookings WHERE booking_reference = 'ST-20241201-0001'), 
        (SELECT id FROM tours WHERE slug = 'gorilla-trekking'), 
        'Gorilla Trekking Adventure', 
        1200.00, 
        2, 
        '2024-03-15', 
        2400.00
    ),
    (
        (SELECT id FROM bookings WHERE booking_reference = 'ST-20241201-0002'), 
        (SELECT id FROM tours WHERE slug = 'wildlife-safari-experience'), 
        'Wildlife Safari Experience', 
        1200.00, 
        1, 
        '2024-03-20', 
        1200.00
    )
ON CONFLICT DO NOTHING; 