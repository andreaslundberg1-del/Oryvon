-- ═══════════════════════════════════════════════════════════════
-- ORYVON CMS - Complete Supabase Schema V3
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. GLOBAL SETTINGS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.global_settings (
    id text PRIMARY KEY DEFAULT 'global',
    site_name text DEFAULT 'ORYVON',
    logo_url text,
    favicon_url text,
    background_image_url text,
    primary_color text DEFAULT '#c59635',
    secondary_color text DEFAULT '#7c51a0',
    accent_color text DEFAULT '#3a65b0',
    seo_title text,
    seo_description text,
    default_language text DEFAULT 'en',
    enabled_languages jsonb DEFAULT '["en"]'::jsonb,
    audio_enabled boolean DEFAULT true,
    animations_enabled boolean DEFAULT true,
    performance_mode boolean DEFAULT false,
    maintenance_mode boolean DEFAULT false,
    custom_css text,
    custom_js text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 2. PORTALS TABLE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.portals (
    id text PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    icon text,
    background_image text,
    color_theme text DEFAULT '#c59635',
    glow_color text,
    description text,
    system_label text,
    subtitle text,
    count_label text,
    visibility boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 3. UNIVERSES TABLE (Enhanced) ───────────────────────────────
-- Note: This table already exists, we'll add columns if needed
ALTER TABLE public.universes
  ADD COLUMN IF NOT EXISTS portal_id text REFERENCES public.portals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS featured_hero boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS timeline_position text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS sound_url text,
  ADD COLUMN IF NOT EXISTS poster_image text,
  ADD COLUMN IF NOT EXISTS logo_image text,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS genre_badges jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS button_text text DEFAULT 'Enter Universe',
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;

-- ── 4. CHARACTERS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.characters (
    id text PRIMARY KEY,
    universe_id text REFERENCES public.universes(id) ON DELETE CASCADE,
    name text NOT NULL,
    image_url text,
    actor_played_by text,
    faction_id text,
    species_race text,
    status text DEFAULT 'alive',
    biography text,
    relationships jsonb DEFAULT '[]'::jsonb,
    abilities jsonb DEFAULT '[]'::jsonb,
    quotes jsonb DEFAULT '[]'::jsonb,
    connected_events jsonb DEFAULT '[]'::jsonb,
    connected_locations jsonb DEFAULT '[]'::jsonb,
    sort_order integer DEFAULT 0,
    visibility boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 5. LOCATIONS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.locations (
    id text PRIMARY KEY,
    universe_id text REFERENCES public.universes(id) ON DELETE CASCADE,
    name text NOT NULL,
    type text,
    region text,
    coordinates jsonb,
    map_position_x numeric,
    map_position_y numeric,
    image_url text,
    description text,
    connected_characters jsonb DEFAULT '[]'::jsonb,
    connected_events jsonb DEFAULT '[]'::jsonb,
    visible_on_map boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 6. TIMELINE EVENTS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id text PRIMARY KEY,
    universe_id text REFERENCES public.universes(id) ON DELETE CASCADE,
    title text NOT NULL,
    year text,
    date text,
    era text,
    image_url text,
    description text,
    related_characters jsonb DEFAULT '[]'::jsonb,
    related_factions jsonb DEFAULT '[]'::jsonb,
    related_locations jsonb DEFAULT '[]'::jsonb,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 7. FACTIONS TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.factions (
    id text PRIMARY KEY,
    universe_id text REFERENCES public.universes(id) ON DELETE CASCADE,
    name text NOT NULL,
    symbol_image_url text,
    leader text,
    members jsonb DEFAULT '[]'::jsonb,
    allies jsonb DEFAULT '[]'::jsonb,
    enemies jsonb DEFAULT '[]'::jsonb,
    description text,
    history text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 8. MEDIA TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media (
    id text PRIMARY KEY,
    universe_id text REFERENCES public.universes(id) ON DELETE CASCADE,
    type text NOT NULL, -- 'image', 'video', 'trailer', 'soundtrack', 'ambience', 'concept_art', 'document'
    title text,
    url text NOT NULL,
    thumbnail_url text,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 9. TRANSLATIONS TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.translations (
    id text PRIMARY KEY,
    language_code text NOT NULL, -- 'en', 'sv', 'es', 'fr', 'de', 'it', 'ar', 'ja', 'ko', 'zh'
    translation_key text NOT NULL,
    translation_value text NOT NULL,
    context text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(language_code, translation_key)
);

-- ── 10. HOMEPAGE SETTINGS TABLE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.homepage_settings (
    id text PRIMARY KEY DEFAULT 'homepage',
    background_image_url text,
    hero_logo_url text,
    hero_text text,
    slogan text,
    subtitle text,
    portal_cards jsonb DEFAULT '[]'::jsonb,
    animations_enabled boolean DEFAULT true,
    effects_config jsonb DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 11. UNIVERSE SECTIONS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.universe_sections (
    id text PRIMARY KEY,
    universe_id text REFERENCES public.universes(id) ON DELETE CASCADE,
    section_type text NOT NULL, -- 'overview', 'timeline', 'map', 'characters', 'family_tree', 'factions', 'lore', 'events', 'media'
    title text,
    content jsonb DEFAULT '{}'::jsonb,
    visibility boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_sections ENABLE ROW LEVEL SECURITY;

-- Global Settings Policies
CREATE POLICY "Allow public read global_settings" ON public.global_settings
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access global_settings" ON public.global_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Portals Policies
CREATE POLICY "Allow public read portals" ON public.portals
    FOR SELECT USING (visibility = true);
CREATE POLICY "Allow authenticated full access portals" ON public.portals
    FOR ALL USING (auth.role() = 'authenticated');

-- Characters Policies
CREATE POLICY "Allow public read characters" ON public.characters
    FOR SELECT USING (visibility = true);
CREATE POLICY "Allow authenticated full access characters" ON public.characters
    FOR ALL USING (auth.role() = 'authenticated');

-- Locations Policies
CREATE POLICY "Allow public read locations" ON public.locations
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access locations" ON public.locations
    FOR ALL USING (auth.role() = 'authenticated');

-- Timeline Events Policies
CREATE POLICY "Allow public read timeline_events" ON public.timeline_events
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access timeline_events" ON public.timeline_events
    FOR ALL USING (auth.role() = 'authenticated');

-- Factions Policies
CREATE POLICY "Allow public read factions" ON public.factions
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access factions" ON public.factions
    FOR ALL USING (auth.role() = 'authenticated');

-- Media Policies
CREATE POLICY "Allow public read media" ON public.media
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access media" ON public.media
    FOR ALL USING (auth.role() = 'authenticated');

-- Translations Policies
CREATE POLICY "Allow public read translations" ON public.translations
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access translations" ON public.translations
    FOR ALL USING (auth.role() = 'authenticated');

-- Homepage Settings Policies
CREATE POLICY "Allow public read homepage_settings" ON public.homepage_settings
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access homepage_settings" ON public.homepage_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Universe Sections Policies
CREATE POLICY "Allow public read universe_sections" ON public.universe_sections
    FOR SELECT USING (visibility = true);
CREATE POLICY "Allow authenticated full access universe_sections" ON public.universe_sections
    FOR ALL USING (auth.role() = 'authenticated');

-- ── STORAGE BUCKETS ──────────────────────────────────────────────

-- Create storage buckets for different asset types
INSERT INTO storage.buckets (id, name, public)
  VALUES 
    ('oryvon-assets', 'oryvon-assets', true),
    ('media-assets', 'media-assets', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DO $$
BEGIN
  -- Public read for oryvon-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'oryvon-assets public read' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "oryvon-assets public read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'oryvon-assets');
  END IF;

  -- Authenticated upload for oryvon-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'oryvon-assets auth upload' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "oryvon-assets auth upload"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'oryvon-assets' AND auth.role() = 'authenticated');
  END IF;

  -- Authenticated update for oryvon-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'oryvon-assets auth update' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "oryvon-assets auth update"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'oryvon-assets' AND auth.role() = 'authenticated');
  END IF;

  -- Authenticated delete for oryvon-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'oryvon-assets auth delete' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "oryvon-assets auth delete"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'oryvon-assets' AND auth.role() = 'authenticated');
  END IF;

  -- Public read for media-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'media-assets public read' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "media-assets public read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'media-assets');
  END IF;

  -- Authenticated upload for media-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'media-assets auth upload' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "media-assets auth upload"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'media-assets' AND auth.role() = 'authenticated');
  END IF;

  -- Authenticated update for media-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'media-assets auth update' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "media-assets auth update"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'media-assets' AND auth.role() = 'authenticated');
  END IF;

  -- Authenticated delete for media-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'media-assets auth delete' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "media-assets auth delete"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'media-assets' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- ── INITIAL DATA SEEDING ─────────────────────────────────────────

-- Insert default global settings
INSERT INTO public.global_settings (id, site_name, seo_title, seo_description)
VALUES ('global', 'ORYVON', 'ORYVON - The Multiverse Archive', 'Explore infinite universes, characters, timelines, and stories in the ultimate cinematic multiverse archive.')
ON CONFLICT (id) DO NOTHING;

-- Insert default portals
INSERT INTO public.portals (id, name, slug, icon, background_image, color_theme, glow_color, description, system_label, subtitle, count_label, visibility, sort_order)
VALUES 
  ('movies', 'Movies', 'movies', 'film', '/Images/harrypotter_castle.png', '#c59635', 'rgba(197, 150, 53, 0.65)', 'Stories through the lens & blockbusters', '//001 CINEMA CORE//', 'Binge-worthy sagas & TV chronicles', '1,248 REALMS', true, 0),
  ('series', 'Series', 'series', 'tv', '/Images/got_throne.png', '#7c51a0', 'rgba(124, 81, 160, 0.65)', 'Binge-worthy sagas & TV chronicles', '//002 CHRONICLE CORE//', 'Binge-worthy sagas & TV chronicles', '832 REALMS', true, 1),
  ('games', 'Games', 'games', 'gamepad', '/Images/elden_ring_tree.png', '#3a65b0', 'rgba(58, 101, 176, 0.65)', 'Immersive worlds & interactive epics', '//003 VIRTUAL CORE//', 'Immersive worlds & interactive epics', '1,572 REALMS', true, 2),
  ('sports', 'Sports', 'sports', 'trophy', null, '#2a9d60', 'rgba(42, 157, 96, 0.65)', 'Legendary competitions & athletic feats', '//004 ATHLETICS CORE//', 'Legendary competitions & athletic feats', '456 REALMS', true, 3),
  ('anime', 'Anime', 'anime', 'star', null, '#e07b39', 'rgba(224, 123, 57, 0.65)', 'Japanese animation & manga worlds', '//005 ANIMATION CORE//', 'Japanese animation & manga worlds', '924 REALMS', true, 4),
  ('history', 'History', 'history', 'scroll', null, '#8c6d3f', 'rgba(140, 109, 63, 0.65)', 'Real events that shaped our world', '//006 ARCHIVE CORE//', 'Real events that shaped our world', '312 REALMS', true, 5),
  ('mythology', 'Mythology', 'mythology', 'sparkles', null, '#b83232', 'rgba(184, 50, 50, 0.65)', 'Ancient legends & divine tales', '//007 LEGEND CORE//', 'Ancient legends & divine tales', '267 REALMS', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert default homepage settings
INSERT INTO public.homepage_settings (id, hero_text, slogan, subtitle)
VALUES ('homepage', 'ORYVON', 'The Multiverse Archive', 'Explore infinite universes, characters, timelines, and stories')
ON CONFLICT (id) DO NOTHING;

-- Insert default translations
INSERT INTO public.translations (language_code, translation_key, translation_value)
VALUES 
  ('en', 'nav.home', 'Home'),
  ('en', 'nav.explore', 'Explore'),
  ('en', 'nav.timeline', 'Timeline'),
  ('en', 'nav.about', 'About'),
  ('sv', 'nav.home', 'Hem'),
  ('sv', 'nav.explore', 'Utforska'),
  ('sv', 'nav.timeline', 'Tidslinje'),
  ('sv', 'nav.about', 'Om')
ON CONFLICT (language_code, translation_key) DO NOTHING;
