"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Save, Trash2, Upload, Filter, MapPin } from "lucide-react";

const DEFAULT_FORM = {
  id: "",
  universe_id: "",
  name: "",
  type: "",
  region: "",
  coordinates: {} as any,
  map_position_x: 0,
  map_position_y: 0,
  image_url: "",
  description: "",
  connected_characters: [] as string[],
  connected_events: [] as string[],
  visible_on_map: true,
  sort_order: 0,
};

type FormData = typeof DEFAULT_FORM;

export default function LocationManager() {
  const [locations, setLocations] = useState<any[]>([]);
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
    const [locData, uniData] = await Promise.all([
      supabase.from("locations").select("*").order("sort_order", { ascending: true }),
      supabase.from("universes").select("id, title").order("title"),
    ]);
    if (locData.data) setLocations(locData.data);
    if (uniData.data) setUniverses(uniData.data);
    setLoading(false);
  };

  const handleEdit = (loc: any) => {
    setFormData({
      ...DEFAULT_FORM,
      ...loc,
      connected_characters: Array.isArray(loc.connected_characters) ? loc.connected_characters : [],
      connected_events: Array.isArray(loc.connected_events) ? loc.connected_events : [],
      coordinates: loc.coordinates || {},
    });
    setEditingId(loc.id);
    setConfirmDelete(false);
  };

  const handleCreate = () => {
    const newId = `loc-${Date.now()}`;
    setFormData({ ...DEFAULT_FORM, id: newId, sort_order: locations.length * 10 });
    setEditingId("__new__");
    setConfirmDelete(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...formData,
      connected_characters: formData.connected_characters.filter(Boolean),
      connected_events: formData.connected_events.filter(Boolean),
    };
    const isNew = editingId === "__new__";
    const { error } = isNew
      ? await supabase.from("locations").insert([payload])
      : await supabase.from("locations").update(payload).eq("id", formData.id);

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
    const { error } = await supabase.from("locations").delete().eq("id", formData.id);
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
    const fileName = `location-${Date.now()}.${ext}`;
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

  const filteredLocations = filterUniverse === "all" 
    ? locations 
    : locations.filter(l => l.universe_id === filterUniverse);

  if (loading) {
    return (
      <div className="text-center py-24 font-mono text-amber-500 animate-pulse tracking-widest text-sm">
        LOADING LOCATIONS...
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Sidebar: Location List */}
      <div className="w-72 shrink-0 flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-mono text-lg tracking-widest text-amber-500">LOCATIONS</h1>
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
        
        {filteredLocations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => handleEdit(loc)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
              editingId === loc.id
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                : "bg-black/40 border-white/5 hover:border-white/20 text-white/70 hover:text-white"
            }`}
          >
            <MapPin size={16} className="shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-mono text-[10px] tracking-widest truncate">
                {loc.name || "Untitled"}
              </span>
              <span className="font-mono text-[7px] text-white/25 mt-0.5 truncate">
                {loc.region || "No region"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Editor */}
      {editingId !== null && (
        <div className="flex-1 bg-black/50 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-mono text-xl tracking-widest text-amber-500">
                {editingId === "__new__" ? "NEW LOCATION" : "EDIT LOCATION"}
              </h2>
              <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-1">
                Configure location details
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
                  Location Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Location Name"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Type
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="City, Castle, Forest, etc."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Region Name"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Map Position X
                  </label>
                  <input
                    type="number"
                    value={formData.map_position_x}
                    onChange={(e) => setFormData({ ...formData, map_position_x: parseFloat(e.target.value) || 0 })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Map Position Y
                  </label>
                  <input
                    type="number"
                    value={formData.map_position_y}
                    onChange={(e) => setFormData({ ...formData, map_position_y: parseFloat(e.target.value) || 0 })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center justify-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visible_on_map}
                      onChange={(e) => setFormData({ ...formData, visible_on_map: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="font-mono text-[9px] text-white/60 tracking-widest uppercase">
                      Visible on Map
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Image
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Location Image
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
                    <img src={formData.image_url} alt="Location" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Description
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Location description..."
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Connections */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Connections
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Connected Characters (comma-separated IDs)
                </label>
                <input
                  type="text"
                  value={formData.connected_characters.join(", ")}
                  onChange={(e) => setFormData({ ...formData, connected_characters: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="char-1, char-2"
                  className={inputCls}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
