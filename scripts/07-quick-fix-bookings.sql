-- Quick fix for booking permissions
-- Run this in your Supabase SQL editor

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_country VARCHAR(100),
    special_requests TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contact_method VARCHAR(50) DEFAULT 'email',
    preferred_contact_time VARCHAR(100),
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE
);

-- Create booking_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS booking_items (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    tour_id INTEGER,
    tour_title VARCHAR(255) NOT NULL,
    tour_price DECIMAL(10,2) NOT NULL,
    number_of_guests INTEGER NOT NULL,
    travel_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_guests table if it doesn't exist
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

-- Create booking_communications table if it doesn't exist
CREATE TABLE IF NOT EXISTS booking_communications (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    communication_type VARCHAR(50) NOT NULL,
    communication_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    staff_member VARCHAR(255),
    notes TEXT,
    outcome VARCHAR(255),
    next_follow_up_date DATE
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_communications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Bookings are viewable by authenticated users" ON bookings;
DROP POLICY IF EXISTS "Bookings are insertable by everyone" ON bookings;
DROP POLICY IF EXISTS "Bookings are updatable by authenticated users" ON bookings;

DROP POLICY IF EXISTS "Booking items are viewable by authenticated users" ON booking_items;
DROP POLICY IF EXISTS "Booking items are insertable by everyone" ON booking_items;
DROP POLICY IF EXISTS "Booking items are updatable by authenticated users" ON booking_items;

DROP POLICY IF EXISTS "Booking guests are viewable by authenticated users" ON booking_guests;
DROP POLICY IF EXISTS "Booking guests are insertable by everyone" ON booking_guests;
DROP POLICY IF EXISTS "Booking guests are updatable by authenticated users" ON booking_guests;

DROP POLICY IF EXISTS "Booking communications are viewable by authenticated users" ON booking_communications;
DROP POLICY IF EXISTS "Booking communications are insertable by authenticated users" ON booking_communications;
DROP POLICY IF EXISTS "Booking communications are updatable by authenticated users" ON booking_communications;

-- Create permissive policies for inserts (allow everyone to insert)
CREATE POLICY "Bookings are insertable by everyone" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Booking items are insertable by everyone" ON booking_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Booking guests are insertable by everyone" ON booking_guests
    FOR INSERT WITH CHECK (true);

-- Create policies for viewing (authenticated users only)
CREATE POLICY "Bookings are viewable by authenticated users" ON bookings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Booking items are viewable by authenticated users" ON booking_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Booking guests are viewable by authenticated users" ON booking_guests
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for updating (authenticated users only)
CREATE POLICY "Bookings are updatable by authenticated users" ON bookings
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Booking items are updatable by authenticated users" ON booking_items
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Booking guests are updatable by authenticated users" ON booking_guests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking_items(booking_id); 