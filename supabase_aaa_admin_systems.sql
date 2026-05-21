-- ORYVON AAA Admin Systems Migration
-- Run this in Supabase SQL Editor after supabase_schema_v3.sql

CREATE TABLE IF NOT EXISTS public.entity_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_table text NOT NULL,
    entity_id text NOT NULL,
    snapshot jsonb NOT NULL,
    change_summary text,
    edited_by text DEFAULT auth.email(),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_feed (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    action text NOT NULL,
    entity_table text,
    entity_id text,
    entity_title text,
    metadata jsonb DEFAULT '{}'::jsonb,
    actor text DEFAULT auth.email(),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.custom_field_schemas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_table text NOT NULL,
    field_key text NOT NULL,
    label text NOT NULL,
    field_type text NOT NULL DEFAULT 'text',
    options jsonb DEFAULT '[]'::jsonb,
    required boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(entity_table, field_key)
);

CREATE TABLE IF NOT EXISTS public.custom_field_values (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_table text NOT NULL,
    entity_id text NOT NULL,
    field_key text NOT NULL,
    value jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(entity_table, entity_id, field_key)
);

ALTER TABLE public.entity_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_field_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_field_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can manage entity versions" ON public.entity_versions;
CREATE POLICY "Authenticated can manage entity versions" ON public.entity_versions
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can manage activity feed" ON public.activity_feed;
CREATE POLICY "Authenticated can manage activity feed" ON public.activity_feed
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can manage custom schemas" ON public.custom_field_schemas;
CREATE POLICY "Authenticated can manage custom schemas" ON public.custom_field_schemas
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can manage custom values" ON public.custom_field_values;
CREATE POLICY "Authenticated can manage custom values" ON public.custom_field_values
    FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_entity_versions_entity ON public.entity_versions(entity_table, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON public.activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_field_schemas_entity ON public.custom_field_schemas(entity_table, sort_order);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_entity ON public.custom_field_values(entity_table, entity_id);
