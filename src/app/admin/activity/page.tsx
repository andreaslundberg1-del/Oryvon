"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Activity, Clock, Database, RefreshCw, Sparkles } from "lucide-react";

const SOURCES = [
  { table: "universes", title: "Universe", label: (row: any) => row.title },
  { table: "characters", title: "Character", label: (row: any) => row.name },
  { table: "locations", title: "Location", label: (row: any) => row.name },
  { table: "timeline_events", title: "Timeline Event", label: (row: any) => row.title },
  { table: "factions", title: "Faction", label: (row: any) => row.name },
  { table: "media", title: "Media", label: (row: any) => row.title },
  { table: "portals", title: "Portal", label: (row: any) => row.name },
  { table: "translations", title: "Translation", label: (row: any) => row.translation_key },
];

export default function ActivityPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: stored } = await supabase.from("activity_feed").select("*").order("created_at", { ascending: false }).limit(40);
    if (stored && stored.length > 0) {
      setItems(stored.map((item: any) => ({
        id: item.id,
        action: item.action,
        entity: item.entity_title || item.entity_id,
        table: item.entity_table,
        actor: item.actor || "ORYVON Admin",
        created_at: item.created_at,
      })));
      setLoading(false);
      return;
    }

    const fallback = await Promise.all(SOURCES.map(async (source) => {
      const { data } = await supabase.from(source.table).select("*").limit(6);
      return (data || []).map((row: any) => ({
        id: `${source.table}-${row.id}`,
        action: `${source.title} indexed`,
        entity: source.label(row) || row.id,
        table: source.table,
        actor: "ORYVON System",
        created_at: row.updated_at || row.created_at || new Date().toISOString(),
      }));
    }));
    setItems(fallback.flat().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 40));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl tracking-widest text-amber-500">ACTIVITY FEED</h1>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/40">Live archive telemetry and recent operations</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded border border-white/10 bg-white/5 px-3 py-2 font-mono text-[8px] uppercase tracking-widest text-white/60 hover:text-amber-300">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/50 p-4">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(245,158,11,0.12),transparent_34%)]" />
        {loading ? (
          <div className="py-20 text-center font-mono text-[10px] uppercase tracking-widest text-amber-400 animate-pulse">Reading activity stream...</div>
        ) : (
          <div className="relative space-y-3">
            {items.map((item) => (
              <div key={item.id} className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-amber-500/20 hover:bg-amber-500/[0.04] transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
                  <Activity size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white">{item.action}</span>
                    <Sparkles size={11} className="text-amber-400/60" />
                  </div>
                  <p className="mt-1 text-xs text-white/40">{item.actor} touched <span className="text-amber-300/80">{item.entity}</span> in {item.table}</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-widest text-white/30">
                  <Clock size={11} /> {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="py-20 text-center">
                <Database className="mx-auto mb-4 text-white/20" size={42} />
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/35">No activity recorded yet</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
