"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Save, Trash2, Search, Languages } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

const DEFAULT_FORM = {
  id: "",
  language_code: "en",
  translation_key: "",
  translation_value: "",
  context: "",
};

type FormData = typeof DEFAULT_FORM;

export default function TranslationManager() {
  const [translations, setTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    setLoading(true);
    const { data } = await supabase.from("translations").select("*").order("language_code", { ascending: true });
    if (data) setTranslations(data);
    setLoading(false);
  };

  const handleEdit = (translation: any) => {
    setFormData({ ...DEFAULT_FORM, ...translation });
    setEditingId(translation.id);
    setConfirmDelete(false);
  };

  const handleCreate = () => {
    const newId = `trans-${Date.now()}`;
    setFormData({ ...DEFAULT_FORM, id: newId });
    setEditingId("__new__");
    setConfirmDelete(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const isNew = editingId === "__new__";
    const { error } = isNew
      ? await supabase.from("translations").insert([formData])
      : await supabase.from("translations").update(formData).eq("id", formData.id);

    if (error) {
      alert("Save failed: " + error.message);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      await fetchTranslations();
      if (isNew) setEditingId(formData.id);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    const { error } = await supabase.from("translations").delete().eq("id", formData.id);
    if (!error) {
      setEditingId(null);
      setFormData({ ...DEFAULT_FORM });
      await fetchTranslations();
    } else {
      alert("Delete failed: " + error.message);
    }
    setConfirmDelete(false);
  };

  const inputCls =
    "bg-black/70 border border-white/10 rounded px-3 py-2 text-sm text-white font-sans focus:border-amber-500/60 focus:outline-none transition-colors placeholder-white/20 w-full";

  const filteredTranslations = translations.filter((t) => {
    if (filterLanguage !== "all" && t.language_code !== filterLanguage) return false;
    if (searchQuery && !t.translation_key.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !t.translation_value.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getLanguageInfo = (code: string) => {
    return LANGUAGES.find(l => l.code === code) || { name: code, flag: "🌐" };
  };

  if (loading) {
    return (
      <div className="text-center py-24 font-mono text-amber-500 animate-pulse tracking-widest text-sm">
        LOADING TRANSLATIONS...
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Sidebar: Translation List */}
      <div className="w-80 shrink-0 flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-mono text-lg tracking-widest text-amber-500">TRANSLATIONS</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-colors"
          >
            <Plus size={11} /> NEW
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search translations..."
              className={`${inputCls} pl-9 text-xs`}
            />
          </div>

          <div>
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className={`${inputCls} text-xs`}
            >
              <option value="all">All Languages</option>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredTranslations.map((trans) => {
          const langInfo = getLanguageInfo(trans.language_code);
          return (
            <button
              key={trans.id}
              onClick={() => handleEdit(trans)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                editingId === trans.id
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                  : "bg-black/40 border-white/5 hover:border-white/20 text-white/70 hover:text-white"
              }`}
            >
              <span className="text-lg">{langInfo.flag}</span>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-[10px] tracking-widest truncate">
                  {trans.translation_key}
                </span>
                <span className="font-mono text-[7px] text-white/25 mt-0.5 truncate">
                  {trans.translation_value}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Editor */}
      {editingId !== null && (
        <div className="flex-1 bg-black/50 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-mono text-xl tracking-widest text-amber-500">
                {editingId === "__new__" ? "NEW TRANSLATION" : "EDIT TRANSLATION"}
              </h2>
              <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-1">
                Configure translation details
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 border px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-all ${
                  saveSuccess
                    ? "bg-emerald-500 border-emerald-400 text-white"
                    : "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                }`}
              >
                <Save size={11} /> {saving ? "SAVING..." : saveSuccess ? "SAVED!" : "SAVE"}
              </button>
              <button
                onClick={handleDelete}
                className={`flex items-center gap-1.5 border px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-all ${
                  confirmDelete
                    ? "bg-red-500 border-red-400 text-white animate-pulse"
                    : "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400"
                }`}
              >
                <Trash2 size={10} /> {confirmDelete ? "CONFIRM?" : "DELETE"}
              </button>
            </div>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Language */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Language
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Target Language
                </label>
                <select
                  value={formData.language_code}
                  onChange={(e) => setFormData({ ...formData, language_code: e.target.value })}
                  className={inputCls}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Key */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Translation Key
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Key (e.g., nav.home, button.submit)
                </label>
                <input
                  type="text"
                  value={formData.translation_key}
                  onChange={(e) => setFormData({ ...formData, translation_key: e.target.value })}
                  placeholder="nav.home"
                  className={`${inputCls} font-mono`}
                />
              </div>
            </div>

            {/* Value */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Translation Value
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Translated Text
                </label>
                <textarea
                  value={formData.translation_value}
                  onChange={(e) => setFormData({ ...formData, translation_value: e.target.value })}
                  placeholder="Home"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Context */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Context
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Context (optional - helps translators)
                </label>
                <textarea
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Navigation menu item"
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Preview
              </h3>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Languages size={20} className="text-amber-500" />
                  <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">
                    {getLanguageInfo(formData.language_code).flag} {getLanguageInfo(formData.language_code).name}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-[9px] text-white/30">
                    Key: <span className="text-amber-400">{formData.translation_key || "..."}</span>
                  </div>
                  <div className="font-mono text-lg text-white">
                    {formData.translation_value || "No translation"}
                  </div>
                  {formData.context && (
                    <div className="font-mono text-[8px] text-white/25 mt-2">
                      Context: {formData.context}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
