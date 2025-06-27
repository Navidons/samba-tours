-- Grant full permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE bookings_id_seq TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE customers_id_seq TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_booking_history TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE customer_booking_history_id_seq TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_items TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE booking_items_id_seq TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_guests TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE booking_guests_id_seq TO authenticated; 