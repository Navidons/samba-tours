-- Grant Booking Permissions
-- This script grants the necessary permissions to authenticated users

-- Grant INSERT permissions to authenticated users
GRANT INSERT ON public.bookings TO authenticated;
GRANT INSERT ON public.booking_items TO authenticated;
GRANT INSERT ON public.booking_guests TO authenticated;
GRANT INSERT ON public.booking_communications TO authenticated;

-- Grant SELECT permissions to authenticated users
GRANT SELECT ON public.bookings TO authenticated;
GRANT SELECT ON public.booking_items TO authenticated;
GRANT SELECT ON public.booking_guests TO authenticated;
GRANT SELECT ON public.booking_communications TO authenticated;

-- Grant UPDATE permissions to authenticated users (for admin functionality)
GRANT UPDATE ON public.bookings TO authenticated;
GRANT UPDATE ON public.booking_items TO authenticated;
GRANT UPDATE ON public.booking_guests TO authenticated;
GRANT UPDATE ON public.booking_communications TO authenticated;

-- Grant USAGE on sequences (for auto-incrementing IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions on specific sequences if they exist
GRANT USAGE, SELECT ON SEQUENCE bookings_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE booking_items_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE booking_guests_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE booking_communications_id_seq TO authenticated;

-- Also grant permissions to anon role for public booking form
GRANT INSERT ON public.bookings TO anon;
GRANT INSERT ON public.booking_items TO anon;
GRANT INSERT ON public.booking_guests TO anon;
GRANT SELECT ON public.bookings TO anon;
GRANT SELECT ON public.booking_items TO anon;
GRANT SELECT ON public.booking_guests TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON SEQUENCE bookings_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE booking_items_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE booking_guests_id_seq TO anon; 