-- Galleries table
CREATE TABLE public.galleries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  thumbnail TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Images table
CREATE TABLE public.gallery_images (
  id BIGSERIAL PRIMARY KEY,
  gallery_id BIGINT REFERENCES public.galleries(id) ON DELETE CASCADE,
  src TEXT NOT NULL, -- Storage path or URL
  alt TEXT,
  title VARCHAR(255),
  description TEXT,
  photographer VARCHAR(100),
  date DATE,
  featured BOOLEAN DEFAULT FALSE,
  size BIGINT, -- bytes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Videos table
CREATE TABLE public.gallery_videos (
  id BIGSERIAL PRIMARY KEY,
  gallery_id BIGINT REFERENCES public.galleries(id) ON DELETE CASCADE,
  src TEXT NOT NULL, -- Storage path or URL
  thumbnail TEXT,
  title VARCHAR(255),
  description TEXT,
  duration INTEGER, -- seconds
  featured BOOLEAN DEFAULT FALSE,
  size BIGINT, -- bytes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_videos ENABLE ROW LEVEL SECURITY;

-- Policies: allow authenticated users full access, public can select
CREATE POLICY "Authenticated full access" ON public.galleries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Authenticated full access" ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Authenticated full access" ON public.gallery_videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read" ON public.gallery_videos FOR SELECT USING (true); 