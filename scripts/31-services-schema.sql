-- Create services schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (this will automatically drop their policies)
DROP TABLE IF EXISTS public.service_images CASCADE;
DROP TABLE IF EXISTS public.service_features CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.service_categories CASCADE;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Service images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload service images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update service images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete service images" ON storage.objects;

-- Create service categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    icon TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create service features table
CREATE TABLE IF NOT EXISTS public.service_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create service images table
CREATE TABLE IF NOT EXISTS public.service_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS service_images_updated_at ON public.service_images;
CREATE TRIGGER service_images_updated_at
    BEFORE UPDATE ON public.service_images
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle primary image
CREATE OR REPLACE FUNCTION public.handle_primary_service_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary THEN
        -- Set is_primary to false for all other images of this service
        UPDATE public.service_images
        SET is_primary = false
        WHERE service_id = NEW.service_id
        AND id != NEW.id;
    ELSE
        -- If no primary image exists for this service, make this one primary
        IF NOT EXISTS (
            SELECT 1 FROM public.service_images
            WHERE service_id = NEW.service_id
            AND is_primary = true
            AND id != NEW.id
        ) THEN
            NEW.is_primary := true;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for primary image handling
DROP TRIGGER IF EXISTS ensure_one_primary_image ON public.service_images;
CREATE TRIGGER ensure_one_primary_image
    BEFORE INSERT OR UPDATE OF is_primary ON public.service_images
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_primary_service_image();

-- Create indexes
CREATE INDEX IF NOT EXISTS services_category_id_idx ON public.services(category_id);
CREATE INDEX IF NOT EXISTS services_status_idx ON public.services(status);
CREATE INDEX IF NOT EXISTS service_images_service_id_idx ON public.service_images(service_id);
CREATE INDEX IF NOT EXISTS service_images_is_primary_idx ON public.service_images(is_primary);
CREATE INDEX IF NOT EXISTS service_categories_name_idx ON public.service_categories(name);

-- Create storage bucket for service images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'services',
  'services',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- Create function to clean up storage files when service image is deleted
CREATE OR REPLACE FUNCTION public.handle_deleted_service_image()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete the corresponding file from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'services'
    AND name = OLD.storage_path;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for storage cleanup
DROP TRIGGER IF EXISTS cleanup_service_image_storage ON public.service_images;
CREATE TRIGGER cleanup_service_image_storage
    AFTER DELETE ON public.service_images
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_deleted_service_image();

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.service_categories TO authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.service_features TO authenticated;
GRANT ALL ON public.service_images TO authenticated;

-- Service categories policies
CREATE POLICY "Allow public read access" ON public.service_categories
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access" ON public.service_categories
    FOR ALL TO authenticated USING (
        (SELECT role = 'admin'::public.user_role FROM public.profiles WHERE id = auth.uid())
    );

-- Services policies with proper checks
CREATE POLICY "Allow public read access" ON public.services
    FOR SELECT TO public USING (status = 'active');

CREATE POLICY "Allow admin full access" ON public.services
    FOR ALL TO authenticated USING (
        (SELECT role = 'admin'::public.user_role FROM public.profiles WHERE id = auth.uid())
    );

-- Drop existing policies if they exist for service_images
DROP POLICY IF EXISTS "Service images are viewable by everyone" ON public.service_images;
DROP POLICY IF EXISTS "Service images are insertable by authenticated users only" ON public.service_images;
DROP POLICY IF EXISTS "Service images are updatable by authenticated users only" ON public.service_images;
DROP POLICY IF EXISTS "Service images are deletable by authenticated users only" ON public.service_images;

-- Service images policies with proper checks
CREATE POLICY "Allow public read access" ON public.service_images
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access" ON public.service_images
    FOR ALL TO authenticated USING (
        (SELECT role = 'admin'::public.user_role FROM public.profiles WHERE id = auth.uid())
    );

-- Storage policies
CREATE POLICY "Service images are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'services');

CREATE POLICY "Authenticated users can upload service images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'services');

CREATE POLICY "Authenticated users can update service images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'services')
    WITH CHECK (bucket_id = 'services');

CREATE POLICY "Authenticated users can delete service images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'services');

-- Enable RLS for storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Grant necessary storage permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Create admin role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin'
    ) THEN
        CREATE ROLE admin;
        GRANT authenticated TO admin;
    END IF;
END
$$;

-- Insert some initial categories
INSERT INTO public.service_categories (name, slug, description, icon) VALUES
    ('Travel Planning', 'planning', 'Custom travel planning and itinerary services', 'Map'),
    ('Transportation', 'transport', 'Airport transfers and vehicle rental services', 'Car'),
    ('Accommodation', 'accommodation', 'Premium lodging and hotel bookings', 'Hotel'),
    ('Guide Services', 'guides', 'Expert local guides and tour leaders', 'Compass'),
    ('Equipment Rental', 'equipment', 'Professional travel and photography equipment', 'Camera');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_service_categories_updated_at
    BEFORE UPDATE ON public.service_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_features_updated_at
    BEFORE UPDATE ON public.service_features
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_images_updated_at
    BEFORE UPDATE ON public.service_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 