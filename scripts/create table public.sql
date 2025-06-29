-- Defensive script to create tables only if they don't exist

-- Function to safely create table if not exists
CREATE OR REPLACE FUNCTION create_table_if_not_exists(
    p_table_name TEXT, 
    p_table_definition TEXT
) RETURNS VOID AS $$
BEGIN
    -- Check if table exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = p_table_name
    ) THEN
        -- Execute table creation
        EXECUTE p_table_definition;
        RAISE NOTICE 'Created table %', p_table_name;
    ELSE
        RAISE NOTICE 'Table % already exists, skipping creation', p_table_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create customers table (if not exists)
SELECT create_table_if_not_exists('customers', $$
CREATE TABLE public.customers (
  id serial not null,
  name character varying(255) not null,
  email character varying(255) not null,
  phone character varying(50) null,
  country character varying(100) null,
  total_bookings integer null default 0,
  total_spent numeric(10, 2) null default 0.00,
  first_booking_date timestamp with time zone null,
  last_booking_date timestamp with time zone null,
  status character varying(50) null default 'active'::character varying,
  join_date timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  notes text null,
  preferred_contact_method character varying(50) null default 'email'::character varying,
  preferred_contact_time character varying(100) null,
  customer_type character varying(50) null default 'regular'::character varying,
  loyalty_points integer null default 0,
  average_order_value numeric(10, 2) null default 0.00,
  booking_count integer null default 0,
  customer_classification text null,
  created_at timestamp without time zone null default now(),
  constraint customers_pkey primary key (id),
  constraint customers_email_key unique (email),
  constraint customers_customer_type_check check (
    (
      (customer_type)::text = any (
        (
          array[
            'regular'::character varying,
            'vip'::character varying,
            'repeat'::character varying,
            'new'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint customers_status_check check (
    (
      (status)::text = any (
        (
          array[
            'active'::character varying,
            'inactive'::character varying,
            'blocked'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;
$$);

-- Create indexes for customers table (if not exists)
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_customers_total_bookings ON public.customers USING btree (total_bookings) TABLESPACE pg_default;

-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.triggers 
        WHERE event_object_table = 'customers' 
        AND trigger_name = 'update_customers_updated_at'
    ) THEN
        CREATE TRIGGER update_customers_updated_at 
        BEFORE UPDATE ON customers 
        FOR EACH ROW 
        EXECUTE FUNCTION update_customers_updated_at();
    END IF;
END $$;

-- Repeat similar defensive approach for other tables
-- Create customer_booking_history table (if not exists)
SELECT create_table_if_not_exists('customer_booking_history', $$
CREATE TABLE public.customer_booking_history (
  id serial not null,
  customer_id integer null,
  booking_id integer null,
  booking_reference character varying(20) not null,
  tour_title character varying(255) null,
  amount numeric(10, 2) not null,
  booking_date timestamp with time zone null default now(),
  travel_date date null,
  status character varying(50) null,
  payment_status character varying(50) null,
  constraint customer_booking_history_pkey primary key (id),
  constraint customer_booking_history_booking_id_fkey foreign KEY (booking_id) references bookings (id) on delete CASCADE,
  constraint customer_booking_history_customer_id_fkey foreign KEY (customer_id) references customers (id) on delete CASCADE
) TABLESPACE pg_default;
$$);

-- Create indexes for customer_booking_history
CREATE INDEX IF NOT EXISTS idx_customer_booking_history_customer_id ON public.customer_booking_history USING btree (customer_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_customer_booking_history_booking_id ON public.customer_booking_history USING btree (booking_id) TABLESPACE pg_default;

-- Create bookings table (if not exists)
SELECT create_table_if_not_exists('bookings', $$
CREATE TABLE public.bookings (
  id serial not null,
  booking_reference character varying(20) not null,
  customer_name character varying(255) not null,
  customer_email character varying(255) not null,
  customer_phone character varying(50) not null,
  customer_country character varying(100) null,
  special_requests text null,
  total_amount numeric(10, 2) not null,
  status character varying(50) null default 'pending'::character varying,
  payment_status character varying(50) null default 'pending'::character varying,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  staff_notes text null,
  contact_method character varying(50) null default 'email'::character varying,
  preferred_contact_time character varying(100) null,
  email_sent boolean null default false,
  email_sent_at timestamp with time zone null,
  constraint bookings_pkey primary key (id),
  constraint bookings_booking_reference_key unique (booking_reference),
  constraint bookings_contact_method_check check (
    (
      (contact_method)::text = any (
        (
          array[
            'email'::character varying,
            'phone'::character varying,
            'whatsapp'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint bookings_payment_status_check check (
    (
      (payment_status)::text = any (
        (
          array[
            'pending'::character varying,
            'paid'::character varying,
            'refunded'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint bookings_status_check check (
    (
      (status)::text = any (
        (
          array[
            'pending'::character varying,
            'confirmed'::character varying,
            'cancelled'::character varying,
            'completed'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;
$$);

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings USING btree (customer_email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings USING btree (created_at) TABLESPACE pg_default;

-- Create triggers for bookings (if not exists)
DO $$
BEGIN
    -- Trigger for creating customer on booking confirmation
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.triggers 
        WHERE event_object_table = 'bookings' 
        AND trigger_name = 'create_customer_on_booking_confirmed'
    ) THEN
        CREATE TRIGGER create_customer_on_booking_confirmed 
        AFTER UPDATE ON bookings 
        FOR EACH ROW 
        EXECUTE FUNCTION create_customer_on_booking_confirmed();
    END IF;

    -- Trigger for handling confirmed paid booking
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.triggers 
        WHERE event_object_table = 'bookings' 
        AND trigger_name = 'trigger_handle_confirmed_paid_booking'
    ) THEN
        CREATE TRIGGER trigger_handle_confirmed_paid_booking 
        AFTER UPDATE ON bookings 
        FOR EACH ROW 
        EXECUTE FUNCTION handle_confirmed_paid_booking_v6();
    END IF;

    -- Trigger for updating bookings updated_at column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.triggers 
        WHERE event_object_table = 'bookings' 
        AND trigger_name = 'update_bookings_updated_at'
    ) THEN
        CREATE TRIGGER update_bookings_updated_at 
        BEFORE UPDATE ON bookings 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Provide overall status
SELECT 'Database tables and triggers processed successfully' as status;