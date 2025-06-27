-- Customers Schema for Samba Tours
-- This file creates the customers table and related functionality

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    first_booking_date TIMESTAMP WITH TIME ZONE,
    last_booking_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    preferred_contact_method VARCHAR(50) DEFAULT 'email',
    preferred_contact_time VARCHAR(100),
    customer_type VARCHAR(50) DEFAULT 'regular' CHECK (customer_type IN ('regular', 'vip', 'repeat', 'new')),
    loyalty_points INTEGER DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0.00
);

-- Create customer_booking_history table to track individual bookings
CREATE TABLE IF NOT EXISTS customer_booking_history (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    booking_reference VARCHAR(20) NOT NULL,
    tour_title VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    travel_date DATE,
    status VARCHAR(50),
    payment_status VARCHAR(50)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_total_bookings ON customers(total_bookings);
CREATE INDEX IF NOT EXISTS idx_customer_booking_history_customer_id ON customer_booking_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_booking_history_booking_id ON customer_booking_history(booking_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customers_updated_at();

-- Create function to add or update customer when booking is confirmed and paid
CREATE OR REPLACE FUNCTION handle_confirmed_paid_booking()
RETURNS TRIGGER AS $$
DECLARE
    customer_record RECORD;
    avg_order_value DECIMAL(10,2);
BEGIN
    -- Only process if booking is confirmed and paid
    IF NEW.status = 'confirmed' AND NEW.payment_status = 'paid' THEN
        -- Check if customer already exists
        SELECT * INTO customer_record 
        FROM customers 
        WHERE email = NEW.customer_email;
        
        IF customer_record IS NULL THEN
            -- Create new customer
            INSERT INTO customers (
                name, 
                email, 
                phone, 
                country, 
                total_bookings, 
                total_spent, 
                first_booking_date, 
                last_booking_date,
                preferred_contact_method,
                preferred_contact_time,
                customer_type,
                average_order_value
            ) VALUES (
                NEW.customer_name,
                NEW.customer_email,
                NEW.customer_phone,
                NEW.customer_country,
                1,
                NEW.total_amount,
                NEW.created_at,
                NEW.created_at,
                NEW.contact_method,
                NEW.preferred_contact_time,
                'new',
                NEW.total_amount
            );
            
            -- Get the customer ID for booking history
            SELECT id INTO customer_record.id FROM customers WHERE email = NEW.customer_email;
        ELSE
            -- Update existing customer
            avg_order_value := (customer_record.total_spent + NEW.total_amount) / (customer_record.total_bookings + 1);
            
            UPDATE customers SET
                total_bookings = total_bookings + 1,
                total_spent = total_spent + NEW.total_amount,
                last_booking_date = NEW.created_at,
                average_order_value = avg_order_value,
                customer_type = CASE 
                    WHEN total_bookings + 1 >= 5 THEN 'vip'
                    WHEN total_bookings + 1 >= 3 THEN 'repeat'
                    ELSE 'regular'
                END,
                loyalty_points = loyalty_points + FLOOR(NEW.total_amount / 100) -- 1 point per $100 spent
            WHERE id = customer_record.id;
        END IF;
        
        -- Add to booking history
        INSERT INTO customer_booking_history (
            customer_id,
            booking_id,
            booking_reference,
            tour_title,
            amount,
            booking_date,
            travel_date,
            status,
            payment_status
        ) VALUES (
            customer_record.id,
            NEW.id,
            NEW.booking_reference,
            (SELECT tour_title FROM booking_items WHERE booking_id = NEW.id LIMIT 1),
            NEW.total_amount,
            NEW.created_at,
            (SELECT travel_date FROM booking_items WHERE booking_id = NEW.id LIMIT 1),
            NEW.status,
            NEW.payment_status
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically handle customer updates
DROP TRIGGER IF EXISTS trigger_handle_confirmed_paid_booking ON bookings;
CREATE TRIGGER trigger_handle_confirmed_paid_booking
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION handle_confirmed_paid_booking();

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_booking_history ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Customers are viewable by authenticated users" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Customers are insertable by authenticated users" ON customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Customers are updatable by authenticated users" ON customers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for customer_booking_history table
CREATE POLICY "Customer booking history is viewable by authenticated users" ON customer_booking_history
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Customer booking history is insertable by authenticated users" ON customer_booking_history
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Customer booking history is updatable by authenticated users" ON customer_booking_history
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON customers TO authenticated;
GRANT ALL ON customer_booking_history TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE customers_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE customer_booking_history_id_seq TO authenticated;

-- Insert sample customers for testing
INSERT INTO customers (name, email, phone, country, total_bookings, total_spent, first_booking_date, last_booking_date, customer_type)
VALUES 
    ('Sarah Johnson', 'sarah@example.com', '+1-555-0123', 'United States', 3, 4200.00, '2023-08-15', '2024-06-15', 'repeat'),
    ('Michael Chen', 'michael@example.com', '+1-555-0124', 'Canada', 2, 2800.00, '2023-11-22', '2024-06-18', 'regular'),
    ('Emma Thompson', 'emma@example.com', '+44-20-1234-5678', 'United Kingdom', 1, 1900.00, '2024-01-10', '2024-06-20', 'new'),
    ('David Wilson', 'david@example.com', '+61-2-1234-5678', 'Australia', 0, 0.00, NULL, NULL, 'new')
ON CONFLICT (email) DO NOTHING; 