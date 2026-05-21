"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AdminAutosaveStatus from "@/components/AdminAutosaveStatus";
import VersionHistoryPanel from "@/components/VersionHistoryPanel";
import { createSnapshot, recordActivity, type SaveStatus } from "@/lib/adminSystems";
import { FloatingPreview } from "@/components/admin/FloatingPreview";
import { UniverseOverview } from "@/components/UniverseOverview";
import { useLivePreview } from "@/contexts/LivePreviewContext";
import {
  LogOut, Plus, Save, Trash2, Copy, Upload,
  Settings, Film, Tag, Palette, Globe,
  ChevronRight, Eye, EyeOff, Star, FileText,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// Types & Constants
// ═══════════════════════════════════════════════════════════════

const DEFAULT_FORM = {
  id: "",
  title: "",
  subtitle: "",
  description: "",
  long_description: "",
  rating: "",
  release_years: "",
  status: "published" as "published" | "draft" | "hidden",
  category_tags: [] as string[],
  tags: [] as string[],
  genre_badges: [] as string[],
  backdrop: "",
  poster_image: "",
  logo_image: "",
  accent_color: "#c59635",
  button_text: "Enter Universe",
  slug: "",
  sort_order: 0,
  featured_hero: false,
  timeline_position: "",
  video_url: "",
  sound_url: "",
  universe_type: "movies",
  translations: {
    sv: { title: "", subtitle: "", description: "", long_description: "", button_text: "" },
  },
};

type FormData = typeof DEFAULT_FORM;

const TABS = [
  { id: "basic", label: "BASIC", icon: Settings },
  { id: "media", label: "MEDIA", icon: Film },
  { id: "categories", label: "CATEGORIES", icon: Tag },
  { id: "appearance", label: "STYLE", icon: Palette },
  { id: "translations", label: "LANGUAGES", icon: Globe },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ACCENT_PRESETS = [
  "#c59635", "#7c51a0", "#3a65b0", "#2a9d60",
  "#b83232", "#e07b39", "#2d787a", "#8c6d3f",
];

const UNIVERSE_TYPES = [
  "movies", "series", "games", "anime", "sports", "history", "mythology",
];

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

const parseArr = (val: any): string[] => {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") return val.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};

const arrToStr = (arr: any): string =>
  Array.isArray(arr) ? arr.join(", ") : (arr || "");

// ═══════════════════════════════════════════════════════════════
// Micro-components
// ═══════════════════════════════════════════════════════════════

const inputCls =
  "bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-sans focus:border-amber-500/50 focus:bg-black/70 focus:outline-none focus:shadow-[0_0_0_1px_rgba(245,158,11,0.2),0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 placeholder-white/25 w-full backdrop-blur-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[8px] text-white/35 tracking-widest uppercase flex items-center gap-2">
        <span className="w-0.5 h-3 bg-amber-500/40 rounded-full" />
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} className={inputCls} />
  );
}

function Textarea({
  value, onChange, rows = 4,
}: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)}
      rows={rows} className={`${inputCls} resize-none`} />
  );
}

function TagsInput({
  value, onChange, placeholder, color = "amber",
}: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    blue:  "bg-blue-500/10 border-blue-500/30 text-blue-400",
    purple:"bg-purple-500/10 border-purple-500/30 text-purple-400",
    white: "bg-white/5 border-white/15 text-white/50",
  };
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={arrToStr(value)}
        onChange={(e) => onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
        placeholder={placeholder}
        className={inputCls}
      />
      <div className="flex flex-wrap gap-1 min-h-[20px]">
        {value.map((tag, i) => (
          <span key={i} className={`${colorMap[color] || colorMap.white} border px-2 py-0.5 rounded-full font-mono text-[7px] tracking-widest`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ImageField({
  label, value, onChange, onUpload, uploading,
}: {
  label: string; value: string; onChange: (v: string) => void;
  onUpload: (file: File) => void; uploading: boolean;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-col gap-3">
        {value && (
          <div className="relative h-32 rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] group">
            <img src={value} alt={label} className="w-full h-full object-cover opacity-85 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        <div className="flex gap-3">
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
            placeholder="Paste URL or upload →" className={`${inputCls} flex-1 text-xs`} />
          <label className="shrink-0 flex items-center gap-2 bg-white/5 hover:bg-amber-500/12 border border-white/10 hover:border-amber-500/40 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 font-mono text-[8px] text-white/50 hover:text-amber-400 tracking-widest whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_12px_rgba(245,158,11,0.15)]">
            <Upload size={11} />
            {uploading ? "UPLOADING..." : "UPLOAD"}
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
          </label>
        </div>
      </div>
    </Field>
  );
}

// ═══════════════════════════════════════════════════════════════
// Live Card Preview
// ═══════════════════════════════════════════════════════════════

function AdminCardPreview({ form }: { form: FormData }) {
  const tags = parseArr(form.category_tags);
  const accent = form.accent_color || "#c59635";
  const bgImage = form.backdrop || form.poster_image;

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col relative select-none"
      style={{
        width: 260, minHeight: 370,
        background: "linear-gradient(180deg, rgba(8,7,12,0.96) 0%, rgba(3,2,5,0.99) 100%)",
        border: `1px solid ${accent}33`,
        boxShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 25px ${accent}10`,
      }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#030205] via-transparent to-transparent z-10" />
        {bgImage ? (
          <img src={bgImage} alt={form.title} className="w-full h-full object-cover brightness-75" />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Film className="text-white/15" size={36} />
          </div>
        )}
        {form.rating && (
          <div className="absolute top-2 right-2 z-20 bg-black/80 border border-amber-500/30 px-2 py-0.5 rounded font-mono text-[7px] text-amber-300">
            ★ {form.rating}
          </div>
        )}
        {tags[0] && (
          <div className="absolute bottom-2 left-2 z-20">
            <span className="bg-black/50 border border-white/15 px-2 py-0.5 rounded-full font-mono text-[6px] text-white/80 uppercase tracking-widest">
              {tags[0]}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="text-white text-[13px] tracking-widest leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
            {form.title || <span className="text-white/30">Universe Title</span>}
          </h3>
          {form.subtitle && <p className="font-mono text-[7px] text-white/35 mt-0.5">{form.subtitle}</p>}
        </div>
        {(form.release_years || tags.length > 1) && (
          <div className="font-mono text-[7px] text-white/30">
            {form.release_years}{tags.length > 1 && ` • ${tags.slice(1).join(" / ")}`}
          </div>
        )}
        {form.description && (
          <p className="text-[9px] text-white/50 leading-relaxed line-clamp-3">{form.description}</p>
        )}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="font-mono text-[6px] text-white/20 tracking-widest uppercase">
            SECTOR // {(form.id || "NEW").toUpperCase()}
          </span>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded border font-mono text-[7px]"
            style={{ borderColor: `${accent}55`, color: accent, background: `${accent}10` }}
          >
            {form.button_text || "Enter Universe"}
            <ChevronRight size={9} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Admin Dashboard
// ═══════════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const router = useRouter();
  const previewContext = useLivePreview();
  const [universes, setUniverses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...DEFAULT_FORM });
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Update preview context when form data changes
  useEffect(() => {
    if (previewContext && editingId) {
      previewContext.setDraftData({
        type: 'universe',
        data: formData
      });
    }
  }, [formData, editingId, previewContext]);

  useEffect(() => { fetchUniverses(); }, []);

  useEffect(() => {
    if (saveStatus !== "dirty" || !editingId || editingId === "__new__") return;
    const timer = window.setTimeout(async () => {
      try {
        setSaveStatus("saving");
        const payload = {
          ...formData,
          category_tags: parseArr(formData.category_tags),
          tags: parseArr(formData.tags),
          genre_badges: parseArr(formData.genre_badges),
        };
        const { error } = await supabase
          .from("universes")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", formData.id);
        if (error) throw error;
        await recordActivity({
          action: "Universe autosaved",
          entity_table: "universes",
          entity_id: formData.id,
          entity_title: formData.title,
        });
        setSaveStatus("saved");
        window.setTimeout(() => setSaveStatus("idle"), 2200);
      } catch {
        setSaveStatus("failed");
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [formData, saveStatus, editingId]);

  // ── Data ─────────────────────────────────────────────────────

  const fetchUniverses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("universes").select("*").order("sort_order", { ascending: true });
    if (data) setUniverses(data);
    setLoading(false);
  };

  const handleEdit = (uni: any) => {
    setFormData({
      ...DEFAULT_FORM,
      ...uni,
      category_tags: parseArr(uni.category_tags),
      tags: parseArr(uni.tags),
      genre_badges: parseArr(uni.genre_badges),
      translations: uni.translations || DEFAULT_FORM.translations,
    });
    setEditingId(uni.id);
    setSaveStatus("idle");
    setActiveTab("basic");
    setConfirmDelete(false);
  };

  const handleCreate = () => {
    const newId = `universe-${Date.now()}`;
    setFormData({ ...DEFAULT_FORM, id: newId, sort_order: universes.length * 10 });
    setEditingId("__new__");
    setSaveStatus("dirty");
    setActiveTab("basic");
    setConfirmDelete(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...formData,
      category_tags: parseArr(formData.category_tags),
      tags: parseArr(formData.tags),
      genre_badges: parseArr(formData.genre_badges),
    };
    const isNew = editingId === "__new__";
    if (!isNew) {
      await createSnapshot({
        entity_table: "universes",
        entity_id: formData.id,
        snapshot: payload,
        change_summary: "Universe updated",
      });
    }
    const { error } = isNew
      ? await supabase.from("universes").insert([payload])
      : await supabase.from("universes").update(payload).eq("id", formData.id);

    if (error) {
      alert("Save failed: " + error.message);
    } else {
      setSaveSuccess(true);
      setSaveStatus("saved");
      setTimeout(() => setSaveSuccess(false), 2000);
      setTimeout(() => setSaveStatus("idle"), 2500);
      await recordActivity({
        action: isNew ? "Universe created" : "Universe updated",
        entity_table: "universes",
        entity_id: formData.id,
        entity_title: formData.title,
      });
      await fetchUniverses();
      if (isNew) setEditingId(formData.id);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    const { error } = await supabase.from("universes").delete().eq("id", formData.id);
    if (!error) {
      setEditingId(null);
      setFormData({ ...DEFAULT_FORM });
      await fetchUniverses();
    } else {
      alert("Delete failed: " + error.message);
    }
    setConfirmDelete(false);
  };

  const handleDuplicate = async () => {
    const newId = `${formData.id}-copy`;
    const payload = { ...formData, id: newId, title: `${formData.title} (Copy)`, sort_order: formData.sort_order + 1 };
    const { error } = await supabase.from("universes").insert([payload]);
    if (!error) {
      await fetchUniverses();
      setFormData(payload as FormData);
      setEditingId(newId);
    } else {
      alert("Duplicate failed: " + error.message);
    }
  };

  const handleMigrate = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/migrate", { method: "POST" });
    if (res.ok) {
      await fetchUniverses();
      alert("Migration successful!");
    } else {
      const err = await res.json();
      alert("Migration failed: " + err.error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleImageUpload = async (file: File, field: string) => {
    setUploading(field);
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("universe-assets").upload(fileName, file, { upsert: true });
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("universe-assets").getPublicUrl(data.path);
      setField(field, urlData.publicUrl);
    } else {
      alert("Upload failed: " + (error?.message || "Unknown error. Did you run supabase_schema_v2.sql?"));
    }
    setUploading(null);
  };

  // ── Form Helpers ─────────────────────────────────────────────

  const setField = (field: string, value: any) => {
    setSaveStatus("dirty");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setSvField = (field: string, value: string) => {
    setSaveStatus("dirty");
    setFormData((prev) => ({
      ...prev,
      translations: { ...prev.translations, sv: { ...prev.translations?.sv, [field]: value } },
    }));
  };

  const svField = (field: string): string =>
    (formData.translations as any)?.sv?.[field] || "";

  // ── Render ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="text-center py-24 font-mono text-amber-500 animate-pulse tracking-widest text-sm">
        CONNECTING TO DATABASE...
      </div>
    );
  }

  const statusColor = {
    published: "text-emerald-400",
    draft:     "text-amber-400",
    hidden:    "text-red-400",
  }[formData.status] || "text-white/40";

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header Bar ── */}
      <div className="flex justify-between items-center bg-black/50 border border-white/5 rounded-xl px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="font-mono text-[9px] text-white/50 tracking-widest">
            {universes.length} ENTRIES IN ARCHIVE
          </span>
        </div>
        <div className="flex gap-2">
          <AdminAutosaveStatus status={saveStatus} />
          <button onClick={handleMigrate}
            className="flex items-center gap-1.5 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-colors">
            <Save size={11} /> MIGRATE DATA
          </button>
          <button onClick={handleCreate}
            className="flex items-center gap-1.5 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-colors">
            <Plus size={11} /> NEW UNIVERSE
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-colors">
            <LogOut size={11} /> LOGOUT
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex gap-6 items-start">

        {/* ── Sidebar: Universe List ── */}
        <div className="w-72 shrink-0 flex flex-col gap-2 max-h-[85vh] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
          {universes.map((uni) => (
            <button key={uni.id} onClick={() => handleEdit(uni)}
              className={`group flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all duration-300 ${
                editingId === uni.id
                  ? "bg-amber-500/12 border-amber-500/40 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15),inset_0_0_16px_rgba(245,158,11,0.05)]"
                  : "bg-black/40 border-white/8 hover:border-white/20 text-white/60 hover:text-white hover:bg-white/[0.06] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              }`}>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-[10px] tracking-widest truncate font-medium">
                  {uni.title || "Untitled"}
                </span>
                <span className="font-mono text-[7px] text-white/25 mt-0.5 truncate capitalize">
                  {uni.status || "published"} · {uni.id}
                </span>
              </div>
              <div className="flex gap-1.5 shrink-0 ml-3 opacity-60 group-hover:opacity-100 transition-opacity">
                {uni.featured_hero && <Star size={10} className="text-amber-400" />}
                {uni.status === "hidden" && <EyeOff size={10} className="text-red-400" />}
                {uni.status === "draft" && <Eye size={10} className="text-amber-400" />}
              </div>
            </button>
          ))}
          {universes.length === 0 && (
            <div className="text-center py-12 font-mono text-[9px] text-white/30 border border-white/5 rounded-xl bg-black/30">
              No entries yet.<br />Click MIGRATE DATA<br />to import your universes.
            </div>
          )}
        </div>

        {/* ── Editor + Preview ── */}
        {editingId !== null && (
          <div className="flex-1 flex gap-6 items-start min-w-0">

            {/* ── Tabbed Editor ── */}
            <div className="flex-1 bg-black/60 border border-white/8 rounded-2xl overflow-hidden min-w-0 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-xl relative">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.03),transparent_50%)]" />

              {/* Premium Tab Bar */}
              <div className="relative flex border-b border-white/8 overflow-x-auto bg-black/40" style={{ scrollbarWidth: "none" }}>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-amber-500/[0.02] to-transparent" />
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`relative flex items-center gap-2 px-6 py-4 font-mono text-[8px] tracking-widest whitespace-nowrap transition-all duration-300 border-b-2 ${
                      activeTab === id
                        ? "text-amber-400 border-amber-500 bg-amber-500/[0.08] shadow-[inset_0_-2px_12px_rgba(245,158,11,0.15)]"
                        : "text-white/35 hover:text-white/60 border-transparent hover:bg-white/[0.03]"
                    }`}>
                    <Icon size={11} className={activeTab === id ? "text-amber-400" : ""} />
                    <span className="relative z-10">{label}</span>
                    {activeTab === id && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8 flex flex-col gap-6 max-h-[65vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>

                {/* ── TAB: BASIC INFO ── */}
                {activeTab === "basic" && (
                  <>
                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/8">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <FileText size={14} className="text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-light tracking-[0.2em] text-white">Basic Information</h3>
                        <p className="font-mono text-[7px] text-white/30 tracking-widest uppercase mt-0.5">Core universe details</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Title (English)">
                        <TextInput value={formData.title} onChange={(v) => setField("title", v)} placeholder="Universe Title" />
                      </Field>
                      <Field label="ID / Unique Key">
                        <TextInput value={formData.id} onChange={(v) => setField("id", v)} placeholder="universe-id" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Subtitle / Sector Name">
                        <TextInput value={formData.subtitle || ""} onChange={(v) => setField("subtitle", v)} placeholder="The Wizarding World..." />
                      </Field>
                      <Field label="Custom URL Slug">
                        <TextInput value={formData.slug || ""} onChange={(v) => setField("slug", v)} placeholder="/universe/my-universe" />
                      </Field>
                    </div>
                    <Field label="Short Description (shown on card)">
                      <Textarea value={formData.description || ""} onChange={(v) => setField("description", v)} rows={3} />
                    </Field>
                    <Field label="Long Description (shown on universe detail page)">
                      <Textarea value={formData.long_description || ""} onChange={(v) => setField("long_description", v)} rows={6} />
                    </Field>
                    <div className="grid grid-cols-3 gap-5">
                      <Field label="Rating (IMDb / Custom)">
                        <TextInput value={formData.rating || ""} onChange={(v) => setField("rating", v)} placeholder="9.3/10" />
                      </Field>
                      <Field label="Release Years">
                        <TextInput value={formData.release_years || ""} onChange={(v) => setField("release_years", v)} placeholder="2001–2011" />
                      </Field>
                      <Field label="Sort Order">
                        <input type="number" value={formData.sort_order}
                          onChange={(e) => setField("sort_order", parseInt(e.target.value) || 0)}
                          className={inputCls} />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Status">
                        <select value={formData.status} onChange={(e) => setField("status", e.target.value)} className={`${inputCls} bg-black`}>
                          <option value="published">✅ Published — visible to everyone</option>
                          <option value="draft">🔒 Draft — admin only</option>
                          <option value="hidden">🚫 Hidden — not shown anywhere</option>
                        </select>
                      </Field>
                      <Field label="Button Text">
                        <TextInput value={formData.button_text || ""} onChange={(v) => setField("button_text", v)} placeholder="Enter Universe" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Timeline Position">
                        <TextInput value={formData.timeline_position || ""} onChange={(v) => setField("timeline_position", v)} placeholder="SECTOR-07 / YEAR-3001" />
                      </Field>
                      <div className="flex flex-col justify-end">
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                          <input type="checkbox" id="featured_hero" checked={formData.featured_hero}
                            onChange={(e) => setField("featured_hero", e.target.checked)}
                            className="w-4 h-4 accent-amber-500" />
                          <span className="font-mono text-[9px] text-white/60 tracking-widest uppercase">
                            ⭐ Featured in Hero Carousel
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* ── TAB: MEDIA ── */}
                {activeTab === "media" && (
                  <>
                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/8">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Film size={14} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-light tracking-[0.2em] text-white">Media Assets</h3>
                        <p className="font-mono text-[7px] text-white/30 tracking-widest uppercase mt-0.5">Images, videos, and audio</p>
                      </div>
                    </div>

                    <ImageField label="Background / Backdrop Image"
                      value={formData.backdrop || ""} onChange={(v) => setField("backdrop", v)}
                      onUpload={(f) => handleImageUpload(f, "backdrop")} uploading={uploading === "backdrop"} />
                    <ImageField label="Poster / Card Thumbnail Image"
                      value={formData.poster_image || ""} onChange={(v) => setField("poster_image", v)}
                      onUpload={(f) => handleImageUpload(f, "poster_image")} uploading={uploading === "poster_image"} />
                    <ImageField label="Logo / Title Image (PNG with transparency)"
                      value={formData.logo_image || ""} onChange={(v) => setField("logo_image", v)}
                      onUpload={(f) => handleImageUpload(f, "logo_image")} uploading={uploading === "logo_image"} />
                    <Field label="Video / Trailer URL">
                      <TextInput value={formData.video_url || ""} onChange={(v) => setField("video_url", v)} placeholder="https://youtube.com/watch?v=..." />
                    </Field>
                    <Field label="Sound / Music URL">
                      <TextInput value={formData.sound_url || ""} onChange={(v) => setField("sound_url", v)} placeholder="https://..." />
                    </Field>
                  </>
                )}

                {/* ── TAB: CATEGORIES ── */}
                {activeTab === "categories" && (
                  <>
                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/8">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Tag size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-light tracking-[0.2em] text-white">Categories & Tags</h3>
                        <p className="font-mono text-[7px] text-white/30 tracking-widest uppercase mt-0.5">Organization and discovery</p>
                      </div>
                    </div>

                    <Field label="Universe Type">
                      <select value={formData.universe_type || "movies"}
                        onChange={(e) => setField("universe_type", e.target.value)} className={`${inputCls} bg-black`}>
                        {UNIVERSE_TYPES.map((t) => (
                          <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Category Tags (comma-separated — shown on card)">
                      <TagsInput value={formData.category_tags} onChange={(v) => setField("category_tags", v)}
                        placeholder="Fantasy, Magic, Adventure" color="amber" />
                    </Field>
                    <Field label="Tags (comma-separated — for search &amp; filtering)">
                      <TagsInput value={formData.tags} onChange={(v) => setField("tags", v)}
                        placeholder="harry-potter, wizards, school, jkr" color="white" />
                    </Field>
                    <Field label="Genre Badges (comma-separated — small labels)">
                      <TagsInput value={formData.genre_badges} onChange={(v) => setField("genre_badges", v)}
                        placeholder="movies, series, games" color="purple" />
                    </Field>
                  </>
                )}

                {/* ── TAB: APPEARANCE ── */}
                {activeTab === "appearance" && (
                  <>
                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/8">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Palette size={14} className="text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-light tracking-[0.2em] text-white">Appearance</h3>
                        <p className="font-mono text-[7px] text-white/30 tracking-widest uppercase mt-0.5">Colors and visual styling</p>
                      </div>
                    </div>

                    <Field label="Accent / Glow Color">
                      <div className="flex items-center gap-3">
                        <input type="color" value={formData.accent_color || "#c59635"}
                          onChange={(e) => setField("accent_color", e.target.value)}
                          className="w-14 h-10 rounded cursor-pointer border-0 bg-transparent" />
                        <TextInput value={formData.accent_color || ""}
                          onChange={(v) => setField("accent_color", v)} placeholder="#c59635" />
                        <div className="w-10 h-10 rounded-full border border-white/10 shrink-0"
                          style={{ background: formData.accent_color || "#c59635", boxShadow: `0 0 18px ${formData.accent_color || "#c59635"}70` }} />
                      </div>
                    </Field>
                    <div>
                      <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-3">Quick Presets</label>
                      <div className="flex gap-3 flex-wrap">
                        {ACCENT_PRESETS.map((c) => (
                          <button key={c} onClick={() => setField("accent_color", c)}
                            title={c}
                            className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${formData.accent_color === c ? "border-white scale-110" : "border-transparent"}`}
                            style={{ background: c, boxShadow: `0 0 12px ${c}60` }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/3 border border-white/5 rounded-xl p-4">
                      <p className="font-mono text-[8px] text-white/30 mb-3 tracking-widest text-center">CARD PREVIEW WITH CURRENT COLOR</p>
                      <div className="flex justify-center">
                        <div style={{
                          width: 200, height: 40, borderRadius: 8,
                          border: `1.5px solid ${formData.accent_color || "#c59635"}77`,
                          background: `${formData.accent_color || "#c59635"}15`,
                          boxShadow: `0 0 20px ${formData.accent_color || "#c59635"}25`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span className="font-mono text-[9px] tracking-widest" style={{ color: formData.accent_color || "#c59635" }}>
                            {formData.button_text || "Enter Universe"} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── TAB: TRANSLATIONS ── */}
                {activeTab === "translations" && (
                  <>
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 font-mono text-[8px] text-amber-400 tracking-widest">
                      🌐 SVENSKA ÖVERSÄTTNINGAR — Lämna tomt för att använda engelska som fallback
                    </div>
                    <Field label="Svenska: Titel">
                      <TextInput value={svField("title")} onChange={(v) => setSvField("title", v)} placeholder="Trollkarlens Värld..." />
                    </Field>
                    <Field label="Svenska: Undertitel">
                      <TextInput value={svField("subtitle")} onChange={(v) => setSvField("subtitle", v)} placeholder="..." />
                    </Field>
                    <Field label="Svenska: Kort Beskrivning (på kortet)">
                      <Textarea value={svField("description")} onChange={(v) => setSvField("description", v)} rows={3} />
                    </Field>
                    <Field label="Svenska: Lång Beskrivning (universumsidan)">
                      <Textarea value={svField("long_description")} onChange={(v) => setSvField("long_description", v)} rows={6} />
                    </Field>
                    <Field label="Svenska: Knapptext">
                      <TextInput value={svField("button_text")} onChange={(v) => setSvField("button_text", v)} placeholder="Gå in i Universumet" />
                    </Field>
                  </>
                )}
              </div>

              {/* ── Action Bar ── */}
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {editingId !== "__new__" && (
                    <VersionHistoryPanel
                      table="universes"
                      entityId={formData.id}
                      onRestore={(snapshot) => {
                        setFormData({ ...DEFAULT_FORM, ...snapshot });
                        setSaveStatus("dirty");
                      }}
                    />
                  )}
                  <button onClick={handleDuplicate}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded font-mono text-[8px] text-white/40 hover:text-white/70 tracking-widest transition-colors">
                    <Copy size={10} /> DUPLICATE
                  </button>
                  <button onClick={handleDelete}
                    className={`flex items-center gap-1.5 border px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-all ${
                      confirmDelete
                        ? "bg-red-500 border-red-400 text-white animate-pulse"
                        : "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400"
                    }`}>
                    <Trash2 size={10} />
                    {confirmDelete ? "CONFIRM DELETE?" : "DELETE"}
                  </button>
                  {confirmDelete && (
                    <button onClick={() => setConfirmDelete(false)}
                      className="text-white/30 hover:text-white/60 font-mono text-[8px] px-2 tracking-widest">
                      CANCEL
                    </button>
                  )}
                </div>
                <button onClick={handleSave} disabled={saving}
                  className={`flex items-center gap-2 px-6 py-1.5 rounded font-mono text-[10px] tracking-widest transition-all disabled:opacity-60 ${
                    saveSuccess
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 hover:bg-amber-400 text-black"
                  }`}>
                  <Save size={12} />
                  {saving ? "SAVING..." : saveSuccess ? "✓ SAVED!" : "SAVE CHANGES"}
                </button>
              </div>
            </div>

            {/* ── Live Preview Panel (removed - using universal FloatingPreview) ── */}
            {/* Universal FloatingPreview is now in the bottom-right corner */}
            
            {/* Status Widget */}
            <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
              {[
                ["STATUS", <span className={`font-mono text-[8px] ${statusColor}`}>{formData.status.toUpperCase()}</span>],
                ["FEATURED", <span className={`font-mono text-[8px] ${formData.featured_hero ? "text-amber-400" : "text-white/25"}`}>{formData.featured_hero ? "⭐ YES" : "NO"}</span>],
                ["SORT", <span className="font-mono text-[8px] text-white/50">{formData.sort_order}</span>],
                ["TAGS", <span className="font-mono text-[8px] text-white/50">{parseArr(formData.category_tags).length} tags</span>],
                ["IMAGES", <span className="font-mono text-[8px] text-white/50">{[formData.backdrop, formData.poster_image, formData.logo_image].filter(Boolean).length} / 3</span>],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                  <span className="font-mono text-[7px] text-white/25 tracking-widest">{label as string}</span>
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {editingId === null && (
          <div className="flex-1 flex items-center justify-center py-32 border border-white/5 rounded-2xl">
            <div className="text-center flex flex-col gap-3">
              <div className="text-white/10 font-mono text-[80px] leading-none">⊕</div>
              <p className="font-mono text-[9px] text-white/30 tracking-widest">
                SELECT AN ENTRY FROM THE LEFT TO EDIT<br />OR CREATE A NEW UNIVERSE
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Universal FloatingPreview */}
      {editingId && editingId !== "__new__" && (
        <FloatingPreview
          route={formData.slug ? `/universe/${formData.slug}` : undefined}
          useContext={true}
        >
          <UniverseOverview
            title={formData.title || "Universe Name"}
            backdrop={formData.backdrop || formData.poster_image}
            poster_image={formData.poster_image}
            universe_type={formData.universe_type}
            release_years={formData.release_years}
            rating={formData.rating}
            description={formData.description}
            accent_color={formData.accent_color}
          />
        </FloatingPreview>
      )}
    </div>
  );
}
