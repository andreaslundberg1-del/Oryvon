-- Copy and paste this into the Supabase SQL Editor to create your database table!

CREATE TABLE public.universes (
    id text primary key,
    title text not null,
    subtitle text,
    rating text,
    tagline text,
    description text,
    backdrop text,
    accent_color text,
    universe_type text,
    release_years text,
    category_tags jsonb default '[]'::jsonb,
    metrics jsonb default '{}'::jsonb,
    locations jsonb default '[]'::jsonb,
    featured_characters jsonb default '[]'::jsonb,
    timeline_events jsonb default '[]'::jsonb,
    sort_order integer default 0,
    is_hidden boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.universes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to non-hidden universes
CREATE POLICY "Allow public read access" ON public.universes
    FOR SELECT USING (is_hidden = false);

-- Allow full access to authenticated users
CREATE POLICY "Allow authenticated full access" ON public.universes
    FOR ALL USING (auth.role() = 'authenticated');
