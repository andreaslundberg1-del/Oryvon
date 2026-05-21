"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert } from "lucide-react";

const TABLES = [
  { name: "universes", title: "Universes", titleField: "title", required: ["title", "description", "slug"], media: ["backdrop", "poster_image"] },
  { name: "characters", title: "Characters", titleField: "name", required: ["name", "biography"], media: ["image_url"] },
  { name: "locations", title: "Locations", titleField: "name", required: ["name", "description"], media: ["image_url"] },
  { name: "timeline_events", title: "Timeline", titleField: "title", required: ["title", "description", "year"], media: ["image_url"] },
  { name: "factions", title: "Factions", titleField: "name", required: ["name", "description"], media: ["symbol_image_url"] },
  { name: "media", title: "Media", titleField: "title", required: ["title", "url", "type"], media: ["thumbnail_url"] },
  { name: "portals", title: "Portals", titleField: "name", required: ["name", "slug", "description"], media: ["background_image"] },
];

export default function ContentHealthPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const results = await Promise.all(TABLES.map(async (table) => {
      const { data } = await supabase.from(table.name).select("*");
      return { table, data: data || [] };
    }));

    const issues = results.flatMap(({ table, data }) => data.map((row: any) => {
      const warnings: string[] = [];
      table.required.forEach((field) => {
        if (!row[field] || String(row[field]).trim() === "") warnings.push(`Missing ${field}`);
      });
      if (!table.media.some((field) => row[field])) warnings.push("Missing thumbnail/media");
      if (row.slug && data.filter((item: any) => item.slug === row.slug).length > 1) warnings.push("Duplicate slug");
      const score = Math.max(0, 100 - warnings.length * 18);
      return {
        id: `${table.name}-${row.id}`,
        entityId: row.id,
        table: table.title,
        title: row[table.titleField] || row.id || "Untitled",
        warnings,
        score,
      };
    }));

    setRows(issues);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const average = useMemo(() => {
    if (!rows.length) return 100;
    return Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length);
  }, [rows]);

  const warningCount = rows.reduce((sum, row) => sum + row.warnings.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl tracking-widest text-amber-500">CONTENT HEALTH</h1>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/40">Archive validation, missing media and completion telemetry</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded border border-white/10 bg-white/5 px-3 py-2 font-mono text-[8px] uppercase tracking-widest text-white/60 hover:text-amber-300">
          <RefreshCw size={12} /> Rescan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
          <div className="font-mono text-[8px] uppercase tracking-widest text-white/35">Global Health Score</div>
          <div className="mt-3 text-5xl font-light text-amber-300">{average}%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <div className="font-mono text-[8px] uppercase tracking-widest text-white/35">Entities Scanned</div>
          <div className="mt-3 text-5xl font-light text-white">{rows.length}</div>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
          <div className="font-mono text-[8px] uppercase tracking-widest text-white/35">Warnings</div>
          <div className="mt-3 text-5xl font-light text-red-300">{warningCount}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-black/50 p-4">
        {loading ? (
          <div className="py-20 text-center font-mono text-[10px] uppercase tracking-widest text-amber-400 animate-pulse">Scanning archive...</div>
        ) : (
          <div className="space-y-2">
            {rows.sort((a, b) => a.score - b.score).map((row) => (
              <div key={row.id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${row.warnings.length ? "border-red-500/25 bg-red-500/10 text-red-300" : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"}`}>
                  {row.warnings.length ? <ShieldAlert size={17} /> : <CheckCircle2 size={17} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white">{row.title}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[7px] uppercase tracking-widest text-white/35">{row.table}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {row.warnings.length ? row.warnings.map((warning: string) => (
                      <span key={warning} className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-red-300/80"><AlertTriangle size={10} /> {warning}</span>
                    )) : <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-300/70">Complete</span>}
                  </div>
                </div>
                <div className="font-mono text-sm text-amber-300">{row.score}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
