"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Save, Trash2, Upload, Filter } from "lucide-react";
import { PreviewContainer } from "@/components/admin/PreviewContainer";
import { CharacterDetail } from "@/components/CharacterDetail";

const DEFAULT_FORM = {
  id: "",
  universe_id: "",
  name: "",
  image_url: "",
  actor_played_by: "",
  faction_id: "",
  species_race: "",
  status: "alive",
  biography: "",
  relationships: [] as string[],
  abilities: [] as string[],
  quotes: [] as string[],
  connected_events: [] as string[],
  connected_locations: [] as string[],
  sort_order: 0,
  visibility: true,
};

type FormData = typeof DEFAULT_FORM;

const STATUS_OPTIONS = ["alive", "deceased", "unknown", "immortal", "missing"];

export default function CharacterManager() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [universes, setUniverses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [filterUniverse, setFilterUniverse] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [charData, uniData] = await Promise.all([
      supabase.from("characters").select("*").order("sort_order", { ascending: true }),
      supabase.from("universes").select("id, title").order("title"),
    ]);
    if (charData.data) setCharacters(charData.data);
    if (uniData.data) setUniverses(uniData.data);
    setLoading(false);
  };

  const handleEdit = (char: any) => {
    setFormData({
      ...DEFAULT_FORM,
      ...char,
      relationships: Array.isArray(char.relationships) ? char.relationships : [],
      abilities: Array.isArray(char.abilities) ? char.abilities : [],
      quotes: Array.isArray(char.quotes) ? char.quotes : [],
      connected_events: Array.isArray(char.connected_events) ? char.connected_events : [],
      connected_locations: Array.isArray(char.connected_locations) ? char.connected_locations : [],
    });
    setEditingId(char.id);
    setConfirmDelete(false);
  };

  const handleCreate = () => {
    const newId = `char-${Date.now()}`;
    setFormData({ ...DEFAULT_FORM, id: newId, sort_order: characters.length * 10 });
    setEditingId("__new__");
    setConfirmDelete(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...formData,
      relationships: formData.relationships.filter(Boolean),
      abilities: formData.abilities.filter(Boolean),
      quotes: formData.quotes.filter(Boolean),
      connected_events: formData.connected_events.filter(Boolean),
      connected_locations: formData.connected_locations.filter(Boolean),
    };
    const isNew = editingId === "__new__";
    const { error } = isNew
      ? await supabase.from("characters").insert([payload])
      : await supabase.from("characters").update(payload).eq("id", formData.id);

    if (error) {
      alert("Save failed: " + error.message);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      await fetchData();
      if (isNew) setEditingId(formData.id);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    const { error } = await supabase.from("characters").delete().eq("id", formData.id);
    if (!error) {
      setEditingId(null);
      setFormData({ ...DEFAULT_FORM });
      await fetchData();
    } else {
      alert("Delete failed: " + error.message);
    }
    setConfirmDelete(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploading("image");
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `character-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("oryvon-assets")
      .upload(fileName, file, { upsert: true });
    
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("oryvon-assets").getPublicUrl(data.path);
      setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    } else {
      alert("Upload failed: " + (error?.message || "Unknown error"));
    }
    setUploading(null);
  };

  const inputCls =
    "bg-black/70 border border-white/10 rounded px-3 py-2 text-sm text-white font-sans focus:border-amber-500/60 focus:outline-none transition-colors placeholder-white/20 w-full";

  const filteredCharacters = filterUniverse === "all" 
    ? characters 
    : characters.filter(c => c.universe_id === filterUniverse);

  if (loading) {
    return (
      <div className="text-center py-24 font-mono text-amber-500 animate-pulse tracking-widest text-sm">
        LOADING CHARACTERS...
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Sidebar: Character List */}
      <div className="w-72 shrink-0 flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-mono text-lg tracking-widest text-amber-500">CHARACTERS</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-colors"
          >
            <Plus size={11} /> NEW
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={12} className="text-white/40" />
            <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">Filter by Universe</span>
          </div>
          <select
            value={filterUniverse}
            onChange={(e) => setFilterUniverse(e.target.value)}
            className={`${inputCls} text-xs`}
          >
            <option value="all">All Universes</option>
            {universes.map((u) => (
              <option key={u.id} value={u.id}>{u.title}</option>
            ))}
          </select>
        </div>
        
        {filteredCharacters.map((char) => (
          <button
            key={char.id}
            onClick={() => handleEdit(char)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
              editingId === char.id
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                : "bg-black/40 border-white/5 hover:border-white/20 text-white/70 hover:text-white"
            }`}
          >
            {char.image_url && (
              <img src={char.image_url} alt="" className="w-10 h-10 rounded object-cover" />
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-mono text-[10px] tracking-widest truncate">
                {char.name || "Untitled"}
              </span>
              <span className="font-mono text-[7px] text-white/25 mt-0.5 truncate capitalize">
                {char.status}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Editor */}
      {editingId !== null && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Editor */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-mono text-xl tracking-widest text-amber-500">
                  {editingId === "__new__" ? "NEW CHARACTER" : "EDIT CHARACTER"}
                </h2>
                <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-1">
                  Configure character details
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
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Basic Information
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Universe
                </label>
                <select
                  value={formData.universe_id}
                  onChange={(e) => setFormData({ ...formData, universe_id: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Select Universe</option>
                  {universes.map((u) => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Character Name"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Actor / Played By
                  </label>
                  <input
                    type="text"
                    value={formData.actor_played_by}
                    onChange={(e) => setFormData({ ...formData, actor_played_by: e.target.value })}
                    placeholder="Actor Name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Species / Race
                  </label>
                  <input
                    type="text"
                    value={formData.species_race}
                    onChange={(e) => setFormData({ ...formData, species_race: e.target.value })}
                    placeholder="Human, Elf, etc."
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={inputCls}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visibility"
                  checked={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor="visibility" className="font-mono text-[9px] text-white/60 tracking-widest uppercase">
                  Visible
                </label>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Image
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Character Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className={`${inputCls} flex-1`}
                  />
                  <label className="shrink-0 flex items-center gap-1.5 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 px-3 py-2 rounded cursor-pointer transition-all font-mono text-[8px] text-white/50 hover:text-amber-400 tracking-widest">
                    <Upload size={11} />
                    {uploading === "image" ? "UPLOADING..." : "UPLOAD"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    />
                  </label>
                </div>
                {formData.image_url && (
                  <div className="mt-2 h-48 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                    <img src={formData.image_url} alt="Character" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Biography
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Biography
                </label>
                <textarea
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  placeholder="Character biography..."
                  rows={6}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Arrays */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Additional Data
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Relationships (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.relationships.join(", ")}
                  onChange={(e) => setFormData({ ...formData, relationships: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="Relationship 1, Relationship 2"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Abilities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.abilities.join(", ")}
                  onChange={(e) => setFormData({ ...formData, abilities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="Ability 1, Ability 2"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Quotes (comma-separated)
                </label>
                <textarea
                  value={formData.quotes.join(", ")}
                  onChange={(e) => setFormData({ ...formData, quotes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="Quote 1, Quote 2"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Connected Events (comma-separated IDs)
                </label>
                <input
                  type="text"
                  value={formData.connected_events.join(", ")}
                  onChange={(e) => setFormData({ ...formData, connected_events: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="event-1, event-2"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Connected Locations (comma-separated IDs)
                </label>
                <input
                  type="text"
                  value={formData.connected_locations.join(", ")}
                  onChange={(e) => setFormData({ ...formData, connected_locations: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="location-1, location-2"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

          {/* Preview Panel */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] flex flex-col">
            <PreviewContainer>
              <CharacterDetail
                name={formData.name || "Character Name"}
                biography={formData.biography}
                image_url={formData.image_url}
                species_race={formData.species_race}
                status={formData.status}
                role={formData.actor_played_by || "Unknown"}
                affiliations={formData.relationships || []}
                abilities={formData.abilities || []}
              />
            </PreviewContainer>
          </div>
        </div>
      )}
    </div>
  );
}
