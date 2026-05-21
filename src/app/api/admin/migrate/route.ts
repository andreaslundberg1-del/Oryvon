import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { UNIVERSE_REGISTRY } from '@/data/universeRegistry';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // we don't need to set cookies in this route, just read auth
          },
        },
      }
    );

    const universes = Object.values(UNIVERSE_REGISTRY).map((uni: any, index: number) => ({
      id: uni.id,
      title: uni.title,
      subtitle: uni.subtitle,
      rating: uni.rating,
      tagline: uni.tagline,
      description: uni.description,
      backdrop: uni.backdrop || uni.image,
      accent_color: uni.accentColor,
      universe_type: uni.universeType,
      release_years: uni.releaseYears,
      category_tags: uni.categoryTags,
      metrics: uni.metrics,
      locations: uni.locations,
      featured_characters: uni.featuredCharacters,
      timeline_events: uni.timelineEvents,
      sort_order: index * 10,
      is_hidden: false
    }));

    const { data, error } = await supabase
      .from('universes')
      .upsert(universes, { onConflict: 'id' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: universes.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
