-- Test Customer Creation System
-- This script tests the automatic customer creation when bookings are confirmed and paid

-- First, let's check if we have any existing customers
SELECT 'Current customers:' as info;
SELECT id, name, email, total_bookings, total_spent, customer_type FROM customers ORDER BY id;

-- Check if we have any bookings that are confirmed and paid
SELECT 'Confirmed and paid bookings:' as info;
SELECT 
    id, 
    booking_reference, 
    customer_name, 
    customer_email, 
    status, 
    payment_status, 
    total_amount 
FROM bookings 
WHERE status = 'confirmed' AND payment_status = 'paid'
ORDER BY created_at DESC;

-- Let's create a test booking that's confirmed and paid
INSERT INTO bookings (
    booking_reference, 
    customer_name, 
    customer_email, 
    customer_phone, 
    customer_country, 
    total_amount, 
    status, 
    payment_status,
    contact_method
) VALUES (
    'ST-20241201-TEST1', 
    'Test Customer One', 
    'test1@example.com', 
    '+1234567890', 
    'United States', 
    1500.00, 
    'confirmed', 
    'paid',
    'email'
) ON CONFLICT (booking_reference) DO NOTHING;

-- Add a booking item for the test booking
INSERT INTO booking_items (
    booking_id, 
    tour_id, 
    tour_title, 
    tour_price, 
    number_of_guests, 
    travel_date, 
    total_price
) VALUES (
    (SELECT id FROM bookings WHERE booking_reference = 'ST-20241201-TEST1'), 
    1, 
    'Test Tour', 
    1500.00, 
    2, 
    '2024-03-15', 
    1500.00
) ON CONFLICT DO NOTHING;

-- Now let's check if the customer was created
SELECT 'Customers after test booking:' as info;
SELECT id, name, email, total_bookings, total_spent, customer_type FROM customers ORDER BY id;

-- Let's create another booking for the same customer to test updating
INSERT INTO bookings (
    booking_reference, 
    customer_name, 
    customer_email, 
    customer_phone, 
    customer_country, 
    total_amount, 
    status, 
    payment_status,
    contact_method
) VALUES (
    'ST-20241201-TEST2', 
    'Test Customer One', 
    'test1@example.com', 
    '+1234567890', 
    'United States', 
    2000.00, 
    'confirmed', 
    'paid',
    'email'
) ON CONFLICT (booking_reference) DO NOTHING;

-- Add a booking item for the second test booking
INSERT INTO booking_items (
    booking_id, 
    tour_id, 
    tour_title, 
    tour_price, 
    number_of_guests, 
    travel_date, 
    total_price
) VALUES (
    (SELECT id FROM bookings WHERE booking_reference = 'ST-20241201-TEST2'), 
    2, 
    'Test Tour 2', 
    2000.00, 
    1, 
    '2024-04-15', 
    2000.00
) ON CONFLICT DO NOTHING;

-- Check the customer record again to see if it was updated
SELECT 'Customer after second booking:' as info;
SELECT id, name, email, total_bookings, total_spent, customer_type, loyalty_points FROM customers WHERE email = 'test1@example.com';

-- Check the customer booking history
SELECT 'Customer booking history:' as info;
SELECT 
    cbh.id,
    c.name as customer_name,
    cbh.booking_reference,
    cbh.tour_title,
    cbh.amount,
    cbh.booking_date,
    cbh.status,
    cbh.payment_status
FROM customer_booking_history cbh
JOIN customers c ON cbh.customer_id = c.id
WHERE c.email = 'test1@example.com'
ORDER BY cbh.booking_date DESC;

-- Clean up test data (optional - uncomment if you want to remove test data)
-- DELETE FROM booking_items WHERE booking_id IN (SELECT id FROM bookings WHERE booking_reference LIKE 'ST-20241201-TEST%');
-- DELETE FROM bookings WHERE booking_reference LIKE 'ST-20241201-TEST%';
-- DELETE FROM customer_booking_history WHERE customer_id IN (SELECT id FROM customers WHERE email = 'test1@example.com');
-- DELETE FROM customers WHERE email = 'test1@example.com'; 