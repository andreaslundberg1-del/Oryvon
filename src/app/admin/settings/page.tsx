"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Upload, RefreshCw } from "lucide-react";
import CursorSettings from "@/components/admin/CursorSettings";

const DEFAULT_FORM = {
  id: "global",
  site_name: "ORYVON",
  logo_url: "",
  favicon_url: "",
  background_image_url: "",
  primary_color: "#c59635",
  secondary_color: "#7c51a0",
  accent_color: "#3a65b0",
  seo_title: "ORYVON - The Multiverse Archive",
  seo_description: "Explore infinite universes, characters, timelines, and stories in the ultimate cinematic multiverse archive.",
  default_language: "en",
  enabled_languages: ["en"],
  audio_enabled: true,
  animations_enabled: true,
  performance_mode: false,
  maintenance_mode: false,
  custom_css: "",
  custom_js: "",
};

type FormData = typeof DEFAULT_FORM;

const LANGUAGE_OPTIONS = [
  { code: "en", name: "English" },
  { code: "sv", name: "Swedish" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ar", name: "Arabic" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

export default function GlobalSettings() {
  const [formData, setFormData] = useState<FormData>({ ...DEFAULT_FORM });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("global_settings").select("*").eq("id", "global").single();
    if (data) {
      setFormData({
        ...DEFAULT_FORM,
        ...data,
        enabled_languages: Array.isArray(data.enabled_languages) ? data.enabled_languages : ["en"],
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("global_settings")
      .upsert({
        ...formData,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      alert("Save failed: " + error.message);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setSaving(false);
  };

  const handleImageUpload = async (file: File, field: string) => {
    setUploading(field);
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `settings-${field}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("oryvon-assets")
      .upload(fileName, file, { upsert: true });
    
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("oryvon-assets").getPublicUrl(data.path);
      setFormData((prev) => ({ ...prev, [field]: urlData.publicUrl }));
    } else {
      alert("Upload failed: " + (error?.message || "Unknown error"));
    }
    setUploading(null);
  };

  const toggleLanguage = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      enabled_languages: prev.enabled_languages.includes(code)
        ? prev.enabled_languages.filter((l) => l !== code)
        : [...prev.enabled_languages, code],
    }));
  };

  const inputCls =
    "bg-black/70 border border-white/10 rounded px-3 py-2 text-sm text-white font-sans focus:border-amber-500/60 focus:outline-none transition-colors placeholder-white/20 w-full";

  if (loading) {
    return (
      <div className="text-center py-24 font-mono text-amber-500 animate-pulse tracking-widest text-sm">
        LOADING SETTINGS...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-mono text-xl tracking-widest text-amber-500">GLOBAL SETTINGS</h1>
          <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-1">
            Configure site-wide settings
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSettings}
            className="flex items-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-colors"
          >
            <RefreshCw size={11} /> REFRESH
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 border px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-all ${
              saveSuccess
                ? "bg-emerald-500 border-emerald-400 text-white"
                : "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <Save size={11} /> {saving ? "SAVING..." : saveSuccess ? "SAVED!" : "SAVE CHANGES"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                Default Language
              </label>
              <select
                value={formData.default_language}
                onChange={(e) => setFormData({ ...formData, default_language: e.target.value })}
                className={inputCls}
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
              SEO Description
            </label>
            <textarea
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* Branding */}
        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
            Branding
          </h2>
          
          <div>
            <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
              Logo URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://..."
                className={`${inputCls} flex-1`}
              />
              <label className="shrink-0 flex items-center gap-1.5 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 px-3 py-2 rounded cursor-pointer transition-all font-mono text-[8px] text-white/50 hover:text-amber-400 tracking-widest">
                <Upload size={11} />
                {uploading === "logo" ? "UPLOADING..." : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "logo_url")}
                />
              </label>
            </div>
            {formData.logo_url && (
              <div className="mt-2 h-16 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
              </div>
            )}
          </div>

          <div>
            <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
              Favicon URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.favicon_url}
                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                placeholder="https://..."
                className={`${inputCls} flex-1`}
              />
              <label className="shrink-0 flex items-center gap-1.5 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 px-3 py-2 rounded cursor-pointer transition-all font-mono text-[8px] text-white/50 hover:text-amber-400 tracking-widest">
                <Upload size={11} />
                {uploading === "favicon" ? "UPLOADING..." : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "favicon_url")}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
              Background Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.background_image_url}
                onChange={(e) => setFormData({ ...formData, background_image_url: e.target.value })}
                placeholder="https://..."
                className={`${inputCls} flex-1`}
              />
              <label className="shrink-0 flex items-center gap-1.5 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 px-3 py-2 rounded cursor-pointer transition-all font-mono text-[8px] text-white/50 hover:text-amber-400 tracking-widest">
                <Upload size={11} />
                {uploading === "background" ? "UPLOADING..." : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "background_image_url")}
                />
              </label>
            </div>
            {formData.background_image_url && (
              <div className="mt-2 h-32 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                <img src={formData.background_image_url} alt="Background" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
            Color Theme
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className={`${inputCls} flex-1`}
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  className={`${inputCls} flex-1`}
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                  className={`${inputCls} flex-1`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
            Enabled Languages
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGE_OPTIONS.map((lang) => (
              <label key={lang.code} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.enabled_languages.includes(lang.code)}
                  onChange={() => toggleLanguage(lang.code)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="font-mono text-[9px] text-white/70">{lang.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
            Features & Performance
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-white/60 tracking-widest uppercase">Audio Enabled</span>
              <input
                type="checkbox"
                checked={formData.audio_enabled}
                onChange={(e) => setFormData({ ...formData, audio_enabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-white/60 tracking-widest uppercase">Animations Enabled</span>
              <input
                type="checkbox"
                checked={formData.animations_enabled}
                onChange={(e) => setFormData({ ...formData, animations_enabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-white/60 tracking-widest uppercase">Performance Mode</span>
              <input
                type="checkbox"
                checked={formData.performance_mode}
                onChange={(e) => setFormData({ ...formData, performance_mode: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-white/60 tracking-widest uppercase">Maintenance Mode</span>
              <input
                type="checkbox"
                checked={formData.maintenance_mode}
                onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Cursor Settings */}
        <CursorSettings />

        {/* Custom Code */}
        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
            Custom Code
          </h2>
          
          <div>
            <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
              Custom CSS
            </label>
            <textarea
              value={formData.custom_css}
              onChange={(e) => setFormData({ ...formData, custom_css: e.target.value })}
              placeholder="/* Custom CSS */"
              rows={6}
              className={`${inputCls} resize-none font-mono text-xs`}
            />
          </div>

          <div>
            <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
              Custom JavaScript
            </label>
            <textarea
              value={formData.custom_js}
              onChange={(e) => setFormData({ ...formData, custom_js: e.target.value })}
              placeholder="// Custom JavaScript"
              rows={6}
              className={`${inputCls} resize-none font-mono text-xs`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
