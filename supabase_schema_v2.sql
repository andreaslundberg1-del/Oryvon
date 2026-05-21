-- ═══════════════════════════════════════════════════════════════
-- ORYVON CMS - Supabase Schema V2
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Add all new columns to the universes table ─────────────
ALTER TABLE public.universes
  ADD COLUMN IF NOT EXISTS long_description    text,
  ADD COLUMN IF NOT EXISTS poster_image        text,
  ADD COLUMN IF NOT EXISTS logo_image          text,
  ADD COLUMN IF NOT EXISTS tags                jsonb  DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS genre_badges        jsonb  DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS button_text         text   DEFAULT 'Enter Universe',
  ADD COLUMN IF NOT EXISTS slug                text,
  ADD COLUMN IF NOT EXISTS status              text   DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS translations        jsonb  DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS featured_hero       boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS timeline_position   text,
  ADD COLUMN IF NOT EXISTS video_url           text,
  ADD COLUMN IF NOT EXISTS sound_url           text;

-- ── 2. Backfill: set status from old is_hidden column ─────────
UPDATE public.universes
  SET status = CASE WHEN is_hidden = true THEN 'hidden' ELSE 'published' END
  WHERE status IS NULL;

-- ── 3. Create Supabase Storage bucket for uploaded images ──────
INSERT INTO storage.buckets (id, name, public)
  VALUES ('universe-assets', 'universe-assets', true)
  ON CONFLICT (id) DO NOTHING;

-- ── 4. Storage RLS policies ────────────────────────────────────
DO $$
BEGIN
  -- Public read
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'universe-assets public read' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "universe-assets public read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'universe-assets');
  END IF;

  -- Authenticated upload
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'universe-assets auth upload' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "universe-assets auth upload"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'universe-assets' AND auth.role() = 'authenticated');
  END IF;

  -- Authenticated update
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'universe-assets auth update' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "universe-assets auth update"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'universe-assets' AND auth.role() = 'authenticated');
  END IF;

  -- Authenticated delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'universe-assets auth delete' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "universe-assets auth delete"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'universe-assets' AND auth.role() = 'authenticated');
  END IF;
END $$;
