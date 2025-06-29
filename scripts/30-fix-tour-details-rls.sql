-- Fix RLS policies for tour_best_times and tour_physical_requirements to allow SELECT operations
-- This is needed for the tour details page to display best times and physical requirements

-- Add SELECT policy for tour_best_times
DROP POLICY IF EXISTS "Allow service_role to select tour_best_times" ON public.tour_best_times;
CREATE POLICY "Allow service_role to select tour_best_times" ON public.tour_best_times
FOR SELECT TO service_role USING (true);

-- Add SELECT policy for tour_physical_requirements
DROP POLICY IF EXISTS "Allow service_role to select tour_physical_requirements" ON public.tour_physical_requirements;
CREATE POLICY "Allow service_role to select tour_physical_requirements" ON public.tour_physical_requirements
FOR SELECT TO service_role USING (true);

-- Also add SELECT policies for other tour-related tables to ensure consistency
DROP POLICY IF EXISTS "Allow service_role to select tour_highlights" ON public.tour_highlights;
CREATE POLICY "Allow service_role to select tour_highlights" ON public.tour_highlights
FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Allow service_role to select tour_itinerary" ON public.tour_itinerary;
CREATE POLICY "Allow service_role to select tour_itinerary" ON public.tour_itinerary
FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Allow service_role to select tour_inclusions" ON public.tour_inclusions;
CREATE POLICY "Allow service_role to select tour_inclusions" ON public.tour_inclusions
FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Allow service_role to select tour_exclusions" ON public.tour_exclusions;
CREATE POLICY "Allow service_role to select tour_exclusions" ON public.tour_exclusions
FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Allow service_role to select tour_images" ON public.tour_images;
CREATE POLICY "Allow service_role to select tour_images" ON public.tour_images
FOR SELECT TO service_role USING (true);

-- Add UPDATE and DELETE policies for completeness
-- tour_best_times
DROP POLICY IF EXISTS "Allow service_role to update tour_best_times" ON public.tour_best_times;
CREATE POLICY "Allow service_role to update tour_best_times" ON public.tour_best_times
FOR UPDATE TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role to delete tour_best_times" ON public.tour_best_times;
CREATE POLICY "Allow service_role to delete tour_best_times" ON public.tour_best_times
FOR DELETE TO service_role USING (true);

-- tour_physical_requirements
DROP POLICY IF EXISTS "Allow service_role to update tour_physical_requirements" ON public.tour_physical_requirements;
CREATE POLICY "Allow service_role to update tour_physical_requirements" ON public.tour_physical_requirements
FOR UPDATE TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role to delete tour_physical_requirements" ON public.tour_physical_requirements;
CREATE POLICY "Allow service_role to delete tour_physical_requirements" ON public.tour_physical_requirements
FOR DELETE TO service_role USING (true);

-- tour_highlights
DROP POLICY IF EXISTS "Allow service_role to update tour_highlights" ON public.tour_highlights;
CREATE POLICY "Allow service_role to update tour_highlights" ON public.tour_highlights
FOR UPDATE TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role to delete tour_highlights" ON public.tour_highlights;
CREATE POLICY "Allow service_role to delete tour_highlights" ON public.tour_highlights
FOR DELETE TO service_role USING (true);

-- tour_itinerary
DROP POLICY IF EXISTS "Allow service_role to update tour_itinerary" ON public.tour_itinerary;
CREATE POLICY "Allow service_role to update tour_itinerary" ON public.tour_itinerary
FOR UPDATE TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role to delete tour_itinerary" ON public.tour_itinerary;
CREATE POLICY "Allow service_role to delete tour_itinerary" ON public.tour_itinerary
FOR DELETE TO service_role USING (true);

-- tour_inclusions
DROP POLICY IF EXISTS "Allow service_role to update tour_inclusions" ON public.tour_inclusions;
CREATE POLICY "Allow service_role to update tour_inclusions" ON public.tour_inclusions
FOR UPDATE TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role to delete tour_inclusions" ON public.tour_inclusions;
CREATE POLICY "Allow service_role to delete tour_inclusions" ON public.tour_inclusions
FOR DELETE TO service_role USING (true);

-- tour_exclusions
DROP POLICY IF EXISTS "Allow service_role to update tour_exclusions" ON public.tour_exclusions;
CREATE POLICY "Allow service_role to update tour_exclusions" ON public.tour_exclusions
FOR UPDATE TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role to delete tour_exclusions" ON public.tour_exclusions;
CREATE POLICY "Allow service_role to delete tour_exclusions" ON public.tour_exclusions
FOR DELETE TO service_role USING (true);

-- tour_images
DROP POLICY IF EXISTS "Allow service_role to update tour_images" ON public.tour_images;
CREATE POLICY "Allow service_role to update tour_images" ON public.tour_images
FOR UPDATE TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role to delete tour_images" ON public.tour_images;
CREATE POLICY "Allow service_role to delete tour_images" ON public.tour_images
FOR DELETE TO service_role USING (true); 