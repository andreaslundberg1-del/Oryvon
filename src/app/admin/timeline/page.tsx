"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Save, Trash2, Upload, Filter, Clock } from "lucide-react";
import { PreviewContainer } from "@/components/admin/PreviewContainer";
import { TimelineVisualization } from "@/components/TimelineVisualization";

const DEFAULT_FORM = {
  id: "",
  universe_id: "",
  title: "",
  year: "",
  date: "",
  era: "",
  image_url: "",
  description: "",
  related_characters: [] as string[],
  related_factions: [] as string[],
  related_locations: [] as string[],
  sort_order: 0,
};

type FormData = typeof DEFAULT_FORM;

export default function TimelineManager() {
  const [events, setEvents] = useState<any[]>([]);
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
    const [eventData, uniData] = await Promise.all([
      supabase.from("timeline_events").select("*").order("sort_order", { ascending: true }),
      supabase.from("universes").select("id, title").order("title"),
    ]);
    if (eventData.data) setEvents(eventData.data);
    if (uniData.data) setUniverses(uniData.data);
    setLoading(false);
  };

  const handleEdit = (event: any) => {
    setFormData({
      ...DEFAULT_FORM,
      ...event,
      related_characters: Array.isArray(event.related_characters) ? event.related_characters : [],
      related_factions: Array.isArray(event.related_factions) ? event.related_factions : [],
      related_locations: Array.isArray(event.related_locations) ? event.related_locations : [],
    });
    setEditingId(event.id);
    setConfirmDelete(false);
  };

  const handleCreate = () => {
    const newId = `event-${Date.now()}`;
    setFormData({ ...DEFAULT_FORM, id: newId, sort_order: events.length * 10 });
    setEditingId("__new__");
    setConfirmDelete(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...formData,
      related_characters: formData.related_characters.filter(Boolean),
      related_factions: formData.related_factions.filter(Boolean),
      related_locations: formData.related_locations.filter(Boolean),
    };
    const isNew = editingId === "__new__";
    const { error } = isNew
      ? await supabase.from("timeline_events").insert([payload])
      : await supabase.from("timeline_events").update(payload).eq("id", formData.id);

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
    const { error } = await supabase.from("timeline_events").delete().eq("id", formData.id);
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
    const fileName = `timeline-${Date.now()}.${ext}`;
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

  const filteredEvents = filterUniverse === "all" 
    ? events 
    : events.filter(e => e.universe_id === filterUniverse);

  if (loading) {
    return (
      <div className="text-center py-24 font-mono text-amber-500 animate-pulse tracking-widest text-sm">
        LOADING TIMELINE EVENTS...
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Sidebar: Event List */}
      <div className="w-72 shrink-0 flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-mono text-lg tracking-widest text-amber-500">TIMELINE</h1>
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
        
        {filteredEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => handleEdit(event)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
              editingId === event.id
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                : "bg-black/40 border-white/5 hover:border-white/20 text-white/70 hover:text-white"
            }`}
          >
            <Clock size={16} className="shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-mono text-[10px] tracking-widest truncate">
                {event.title || "Untitled"}
              </span>
              <span className="font-mono text-[7px] text-white/25 mt-0.5 truncate">
                {event.year || "No year"}
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
                  {editingId === "__new__" ? "NEW EVENT" : "EDIT EVENT"}
                </h2>
                <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-1">
                  Configure timeline event details
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
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Event Title"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="1997"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="July 31"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                    Era
                  </label>
                  <input
                    type="text"
                    value={formData.era}
                    onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                    placeholder="Modern Age"
                    className={inputCls}
                  />
                </div>
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

            {/* Image */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Image
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Event Image
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
                    <img src={formData.image_url} alt="Event" className="w-full h-full object-cover" />
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
                  Event Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description..."
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Connections */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Related Entities
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Related Characters (comma-separated IDs)
                </label>
                <input
                  type="text"
                  value={formData.related_characters.join(", ")}
                  onChange={(e) => setFormData({ ...formData, related_characters: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="char-1, char-2"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Related Factions (comma-separated IDs)
                </label>
                <input
                  type="text"
                  value={formData.related_factions.join(", ")}
                  onChange={(e) => setFormData({ ...formData, related_factions: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="faction-1, faction-2"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Related Locations (comma-separated IDs)
                </label>
                <input
                  type="text"
                  value={formData.related_locations.join(", ")}
                  onChange={(e) => setFormData({ ...formData, related_locations: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="location-1, location-2"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

          {/* Preview Panel */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] flex flex-col">
            {formData.id ? (
              <PreviewContainer route={`/timeline/${formData.id}`} />
            ) : (
              <PreviewContainer>
                <TimelineVisualization
                  events={[
                    {
                      id: formData.id,
                      title: formData.title || "Event Title",
                      date: formData.date || formData.year,
                      year: formData.year,
                      description: formData.description,
                      image_url: formData.image_url,
                    }
                  ]}
                />
              </PreviewContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
