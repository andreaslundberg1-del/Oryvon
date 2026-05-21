"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, GitBranch, RotateCcw, X } from "lucide-react";

export default function VersionHistoryPanel({
  table,
  entityId,
  onRestore,
}: {
  table: string;
  entityId: string;
  onRestore?: (snapshot: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const load = async () => {
    if (!entityId) return;
    const { data } = await supabase
      .from("entity_versions")
      .select("*")
      .eq("entity_table", table)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false })
      .limit(30);
    setVersions(data || []);
  };

  useEffect(() => {
    if (open) load();
  }, [open, table, entityId]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest text-white/45 hover:border-amber-500/40 hover:text-amber-300 transition-all"
      >
        <GitBranch size={12} /> History
      </button>
      {open && (
        <div className="fixed inset-0 z-[980] flex justify-end bg-black/60 backdrop-blur-md">
          <div className="h-full w-full max-w-xl border-l border-amber-500/20 bg-[#050303]/95 shadow-[0_0_80px_rgba(245,158,11,0.16)]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="font-mono text-sm uppercase tracking-widest text-amber-400">Version History</h2>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-widest text-white/35">{table} · {entityId}</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid h-[calc(100%-73px)] grid-cols-[230px_1fr]">
              <div className="overflow-y-auto border-r border-white/10 p-3">
                {versions.map((version) => (
                  <button
                    key={version.id}
                    onClick={() => setSelected(version)}
                    className={`mb-2 w-full rounded-xl border p-3 text-left transition-all ${selected?.id === version.id ? "border-amber-500/35 bg-amber-500/10" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-widest text-white/70"><Clock size={11} /> {new Date(version.created_at).toLocaleString()}</div>
                    <div className="mt-2 text-xs text-white/40">{version.change_summary || "Snapshot"}</div>
                  </button>
                ))}
                {versions.length === 0 && <div className="py-10 text-center font-mono text-[9px] uppercase tracking-widest text-white/30">No snapshots yet</div>}
              </div>
              <div className="overflow-y-auto p-4">
                {selected ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => selected?.snapshot && onRestore?.(selected.snapshot)}
                      className="flex items-center gap-2 rounded border border-amber-500/35 bg-amber-500/10 px-3 py-2 font-mono text-[8px] uppercase tracking-widest text-amber-300"
                    >
                      <RotateCcw size={12} /> Restore Snapshot
                    </button>
                    <pre className="max-h-[70vh] overflow-auto rounded-xl border border-white/10 bg-black/70 p-4 text-xs text-white/60">
                      {JSON.stringify(selected.snapshot, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center font-mono text-[9px] uppercase tracking-widest text-white/30">Select a snapshot to inspect changes</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
