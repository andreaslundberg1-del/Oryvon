"use client";

import { CheckCircle2, Cloud, CloudOff, Loader2 } from "lucide-react";
import type { SaveStatus } from "@/lib/adminSystems";

export default function AdminAutosaveStatus({ status }: { status: SaveStatus }) {
  const config = {
    idle: { label: "Synced", icon: Cloud, cls: "text-white/35 border-white/10 bg-white/[0.03]" },
    dirty: { label: "Unsaved changes", icon: Cloud, cls: "text-amber-300 border-amber-500/25 bg-amber-500/10" },
    saving: { label: "Saving...", icon: Loader2, cls: "text-amber-300 border-amber-500/25 bg-amber-500/10 animate-pulse" },
    saved: { label: "Saved just now", icon: CheckCircle2, cls: "text-emerald-300 border-emerald-500/25 bg-emerald-500/10" },
    failed: { label: "Sync failed", icon: CloudOff, cls: "text-red-300 border-red-500/25 bg-red-500/10" },
  }[status];

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest transition-all ${config.cls}`}>
      <Icon size={12} className={status === "saving" ? "animate-spin" : ""} />
      {config.label}
    </div>
  );
}
