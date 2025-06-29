-- Check if RLS is enabled on tours table and handle accordingly
DO $$
BEGIN
    -- Check if RLS is currently enabled
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'tours' 
        AND schemaname = 'public' 
        AND rowsecurity = true
    ) THEN
        -- RLS is enabled, so we need policies
        RAISE NOTICE 'RLS is enabled on tours table, creating policies...';
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow service_role full access to tours" ON public.tours;
        DROP POLICY IF EXISTS "Allow authenticated users to read tours" ON public.tours;
        DROP POLICY IF EXISTS "Allow admin users to manage tours" ON public.tours;
        DROP POLICY IF EXISTS "Allow public to read tours" ON public.tours;
        
        -- Create comprehensive policies
        CREATE POLICY "Allow service_role full access to tours" ON public.tours
        FOR ALL TO service_role USING (true) WITH CHECK (true);

        CREATE POLICY "Allow authenticated users to read tours" ON public.tours
        FOR SELECT TO authenticated USING (true);

        CREATE POLICY "Allow admin users to manage tours" ON public.tours
        FOR ALL TO authenticated 
        USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        ) 
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );

        CREATE POLICY "Allow public to read tours" ON public.tours
        FOR SELECT TO anon USING (true);
        
    ELSE
        -- RLS is disabled, so we need to enable it and create policies
        RAISE NOTICE 'RLS is disabled on tours table, enabling and creating policies...';
        
        ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
        
        -- Create comprehensive policies
        CREATE POLICY "Allow service_role full access to tours" ON public.tours
        FOR ALL TO service_role USING (true) WITH CHECK (true);

        CREATE POLICY "Allow authenticated users to read tours" ON public.tours
        FOR SELECT TO authenticated USING (true);

        CREATE POLICY "Allow admin users to manage tours" ON public.tours
        FOR ALL TO authenticated 
        USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        ) 
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );

        CREATE POLICY "Allow public to read tours" ON public.tours
        FOR SELECT TO anon USING (true);
    END IF;
END $$;

-- Handle tour-related tables (tour_itinerary, tour_inclusions, tour_exclusions, tour_images)
DO $$
DECLARE
    current_table text;
BEGIN
    -- List of tour-related tables
    FOR current_table IN SELECT unnest(ARRAY['tour_itinerary', 'tour_inclusions', 'tour_exclusions', 'tour_images']) LOOP
        -- Check if table exists
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = current_table 
            AND table_schema = 'public'
        ) THEN
            -- Enable RLS if not already enabled
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', current_table);
            
            -- Drop existing policies
            EXECUTE format('DROP POLICY IF EXISTS "Allow service_role full access to %I" ON public.%I', current_table, current_table);
            EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated users to read %I" ON public.%I', current_table, current_table);
            EXECUTE format('DROP POLICY IF EXISTS "Allow admin users to manage %I" ON public.%I', current_table, current_table);
            EXECUTE format('DROP POLICY IF EXISTS "Allow public to read %I" ON public.%I', current_table, current_table);
            
            -- Create comprehensive policies for each table
            EXECUTE format('CREATE POLICY "Allow service_role full access to %I" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', current_table, current_table);
            EXECUTE format('CREATE POLICY "Allow authenticated users to read %I" ON public.%I FOR SELECT TO authenticated USING (true)', current_table, current_table);
            EXECUTE format('CREATE POLICY "Allow admin users to manage %I" ON public.%I FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin'')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))', current_table, current_table);
            EXECUTE format('CREATE POLICY "Allow public to read %I" ON public.%I FOR SELECT TO anon USING (true)', current_table, current_table);
            
            RAISE NOTICE 'Created RLS policies for table: %', current_table;
        ELSE
            RAISE NOTICE 'Table % does not exist, skipping', current_table;
        END IF;
    END LOOP;
END $$;