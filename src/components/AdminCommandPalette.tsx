"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Activity,
  AlertTriangle,
  Boxes,
  Clock,
  Command,
  FilePlus,
  Film,
  Globe,
  Image,
  Languages,
  Map,
  Search,
  Settings,
  Shield,
  Sparkles,
  Upload,
  Users,
  Wand2,
} from "lucide-react";

type CommandItem = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  href?: string;
  action?: () => void;
  keywords?: string[];
  icon?: any;
};

const STATIC_COMMANDS: CommandItem[] = [
  { id: "nav-homepage", title: "Open Homepage Editor", subtitle: "Hero, slogan, portal intro and background", type: "Navigate", href: "/admin/homepage", icon: Globe, keywords: ["home", "hero", "landing"] },
  { id: "nav-portals", title: "Open Portal Manager", subtitle: "Movies, series, games, sports, anime and mythology portals", type: "Navigate", href: "/admin/portals", icon: Boxes, keywords: ["portal", "category"] },
  { id: "nav-universes", title: "Open Universe Manager", subtitle: "Core archive entities and cinematic cards", type: "Navigate", href: "/admin", icon: Film, keywords: ["universe", "realm"] },
  { id: "nav-characters", title: "Open Character Manager", subtitle: "Characters, abilities, relationships and status", type: "Navigate", href: "/admin/characters", icon: Users, keywords: ["character", "cast"] },
  { id: "nav-locations", title: "Open Location Manager", subtitle: "Maps, regions and dimensional coordinates", type: "Navigate", href: "/admin/locations", icon: Map, keywords: ["map", "location"] },
  { id: "nav-timeline", title: "Open Timeline Manager", subtitle: "Events, eras and historical sequence", type: "Navigate", href: "/admin/timeline", icon: Clock, keywords: ["timeline", "event"] },
  { id: "nav-factions", title: "Open Faction Manager", subtitle: "Factions, allies, enemies and symbols", type: "Navigate", href: "/admin/factions", icon: Shield, keywords: ["faction", "alliance"] },
  { id: "nav-media", title: "Upload or Manage Media", subtitle: "Images, trailers, audio, documents and concept art", type: "Action", href: "/admin/media", icon: Upload, keywords: ["upload", "asset", "image", "video"] },
  { id: "nav-translations", title: "Open Translation Console", subtitle: "Multilingual strings and localization health", type: "Navigate", href: "/admin/translations", icon: Languages, keywords: ["translation", "language"] },
  { id: "nav-settings", title: "Open Global Settings", subtitle: "Branding, SEO, languages and performance", type: "Navigate", href: "/admin/settings", icon: Settings, keywords: ["settings", "config"] },
  { id: "nav-health", title: "Open Content Health", subtitle: "Missing thumbnails, duplicate slugs and incomplete content", type: "System", href: "/admin/health", icon: AlertTriangle, keywords: ["health", "validation", "warnings"] },
  { id: "nav-activity", title: "Open Activity Feed", subtitle: "Live archive operations and recent changes", type: "System", href: "/admin/activity", icon: Activity, keywords: ["activity", "history", "feed"] },
  { id: "nav-visualizer", title: "Open Database Visualizer", subtitle: "Neural multiverse graph and entity relationships", type: "System", href: "/admin/visualizer", icon: Sparkles, keywords: ["graph", "visualizer", "nodes"] },
  { id: "nav-custom-fields", title: "Open Custom Fields", subtitle: "Dynamic schemas like canon status and power level", type: "System", href: "/admin/custom-fields", icon: Wand2, keywords: ["custom", "fields", "schema"] },
  { id: "preview-live", title: "Open Live Preview", subtitle: "Launch the real homepage viewport", type: "Preview", href: "/", icon: Image, keywords: ["preview", "homepage", "live"] },
  { id: "create-universe", title: "Create Universe", subtitle: "Jump to universe manager and start a new realm", type: "Create", href: "/admin", icon: FilePlus, keywords: ["new", "create", "universe"] },
];

const SEARCH_TABLES = [
  { table: "universes", type: "Universe", href: (row: any) => `/admin?entity=${row.id}`, title: (row: any) => row.title, subtitle: (row: any) => row.description || row.subtitle || row.slug, icon: Film },
  { table: "characters", type: "Character", href: () => "/admin/characters", title: (row: any) => row.name, subtitle: (row: any) => row.biography || row.status, icon: Users },
  { table: "locations", type: "Location", href: () => "/admin/locations", title: (row: any) => row.name, subtitle: (row: any) => row.description || row.region, icon: Map },
  { table: "timeline_events", type: "Timeline", href: () => "/admin/timeline", title: (row: any) => row.title, subtitle: (row: any) => row.description || row.year, icon: Clock },
  { table: "factions", type: "Faction", href: () => "/admin/factions", title: (row: any) => row.name, subtitle: (row: any) => row.description || row.leader, icon: Shield },
  { table: "media", type: "Media", href: () => "/admin/media", title: (row: any) => row.title, subtitle: (row: any) => row.description || row.type, icon: Image },
  { table: "portals", type: "Portal", href: () => "/admin/portals", title: (row: any) => row.name, subtitle: (row: any) => row.description || row.slug, icon: Globe },
];

function scoreItem(item: CommandItem, query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const haystack = [item.title, item.subtitle, item.type, ...(item.keywords || [])].join(" ").toLowerCase();
  if (haystack.includes(q)) return 100 + q.length;
  let score = 0;
  let index = 0;
  for (const char of q) {
    const found = haystack.indexOf(char, index);
    if (found === -1) return 0;
    score += Math.max(1, 20 - found + index);
    index = found + 1;
  }
  return score;
}

export default function AdminCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [dbResults, setDbResults] = useState<CommandItem[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("oryvon-command-recent");
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelected((value) => Math.min(value + 1, filtered.length - 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelected((value) => Math.max(value - 1, 0));
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = filtered[selected];
        if (item) execute(item);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setDbResults([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const text = query.trim();
      const results = await Promise.all(
        SEARCH_TABLES.map(async (source) => {
          const { data } = await supabase.from(source.table).select("*").limit(8);
          return (data || [])
            .map((row: any) => ({
              id: `${source.table}-${row.id}`,
              title: source.title(row) || "Untitled",
              subtitle: source.subtitle(row) || source.table,
              type: source.type,
              href: source.href(row),
              icon: source.icon,
              keywords: Object.values(row).filter((v) => typeof v === "string") as string[],
            }))
            .filter((item: CommandItem) => scoreItem(item, text) > 0);
        })
      );
      setDbResults(results.flat().slice(0, 30));
      setLoading(false);
    }, 160);
    return () => window.clearTimeout(timer);
  }, [open, query]);

  const filtered = useMemo(() => {
    const items = [...STATIC_COMMANDS, ...dbResults]
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
    if (!query && recent.length > 0) {
      return [
        ...recent
          .map((id) => STATIC_COMMANDS.find((item) => item.id === id))
          .filter(Boolean) as CommandItem[],
        ...items.filter((item) => !recent.includes(item.id)),
      ];
    }
    return items;
  }, [dbResults, query, recent]);

  useEffect(() => setSelected(0), [query, open]);

  const execute = (item: CommandItem) => {
    const nextRecent = [item.id, ...recent.filter((id) => id !== item.id)].slice(0, 6);
    setRecent(nextRecent);
    window.localStorage.setItem("oryvon-command-recent", JSON.stringify(nextRecent));
    item.action?.();
    if (item.href) router.push(item.href);
    setOpen(false);
    setQuery("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 font-mono text-[8px] uppercase tracking-widest text-white/55 transition-all hover:border-amber-500/40 hover:text-amber-300 sm:px-3"
        aria-label="Open command palette"
      >
        <Command size={13} />
        <span className="hidden md:inline">Ctrl K</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/70 px-4 pt-[9vh] backdrop-blur-xl">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_15%,rgba(245,158,11,0.16),transparent_34%),radial-gradient(circle_at_15%_35%,rgba(124,81,160,0.13),transparent_30%)]" />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-amber-500/20 bg-[#050303]/95 shadow-[0_0_80px_rgba(245,158,11,0.14)]">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search size={18} className="text-amber-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands, universes, characters, media..."
            className="w-full bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/25"
          />
          {loading && <span className="font-mono text-[8px] uppercase tracking-widest text-amber-400 animate-pulse">Scanning</span>}
        </div>

        <div className="max-h-[58vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">No archive signal found</div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon || Command;
              return (
                <button
                  key={item.id}
                  onClick={() => execute(item)}
                  onMouseEnter={() => setSelected(index)}
                  className={`group flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-all ${
                    selected === index
                      ? "border-amber-500/35 bg-amber-500/10 shadow-[inset_0_0_25px_rgba(245,158,11,0.06)]"
                      : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-amber-400 group-hover:scale-105 transition-transform">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-[11px] uppercase tracking-widest text-white">{item.title}</span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[7px] uppercase tracking-widest text-amber-300/70">{item.type}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-white/38">{item.subtitle}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono text-[7px] uppercase tracking-widest text-white/30">
          <span>↑↓ Navigate · Enter Open · Esc Close</span>
          <span>ORYVON Command OS</span>
        </div>
      </div>
    </div>
  );
}
