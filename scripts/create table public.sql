create table public.customers (
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

create index IF not exists idx_customers_email on public.customers using btree (email) TABLESPACE pg_default;

create index IF not exists idx_customers_status on public.customers using btree (status) TABLESPACE pg_default;

create index IF not exists idx_customers_total_bookings on public.customers using btree (total_bookings) TABLESPACE pg_default;

create trigger update_customers_updated_at BEFORE
update on customers for EACH row
execute FUNCTION update_customers_updated_at ();


create table public.customer_booking_history (
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

create index IF not exists idx_customer_booking_history_customer_id on public.customer_booking_history using btree (customer_id) TABLESPACE pg_default;

create index IF not exists idx_customer_booking_history_booking_id on public.customer_booking_history using btree (booking_id) TABLESPACE pg_default;


create table public.bookings (
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

create index IF not exists idx_bookings_email on public.bookings using btree (customer_email) TABLESPACE pg_default;

create index IF not exists idx_bookings_status on public.bookings using btree (status) TABLESPACE pg_default;

create index IF not exists idx_bookings_created_at on public.bookings using btree (created_at) TABLESPACE pg_default;

create trigger create_customer_on_booking_confirmed
after
update on bookings for EACH row
execute FUNCTION create_customer_on_booking_confirmed ();

create trigger trigger_handle_confirmed_paid_booking
after
update on bookings for EACH row
execute FUNCTION handle_confirmed_paid_booking_v6 ();

create trigger update_bookings_updated_at BEFORE
update on bookings for EACH row
execute FUNCTION update_updated_at_column ();