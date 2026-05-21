"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Save, Trash2, Upload, Filter, Image, Video, Music, FileText } from "lucide-react";
import { PreviewContainer } from "@/components/admin/PreviewContainer";
import { MediaGallery } from "@/components/MediaGallery";

const DEFAULT_FORM = {
  id: "",
  universe_id: "",
  type: "image" as "image" | "video" | "trailer" | "soundtrack" | "ambience" | "concept_art" | "document",
  title: "",
  url: "",
  thumbnail_url: "",
  description: "",
  metadata: {} as any,
  sort_order: 0,
};

type FormData = typeof DEFAULT_FORM;

const MEDIA_TYPES = [
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "trailer", label: "Trailer", icon: Video },
  { value: "soundtrack", label: "Soundtrack", icon: Music },
  { value: "ambience", label: "Ambience", icon: Music },
  { value: "concept_art", label: "Concept Art", icon: Image },
  { value: "document", label: "Document", icon: FileText },
];

export default function MediaManager() {
  const [media, setMedia] = useState<any[]>([]);
  const [universes, setUniverses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [filterUniverse, setFilterUniverse] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [mediaData, uniData] = await Promise.all([
      supabase.from("media").select("*").order("sort_order", { ascending: true }),
      supabase.from("universes").select("id, title").order("title"),
    ]);
    if (mediaData.data) setMedia(mediaData.data);
    if (uniData.data) setUniverses(uniData.data);
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      ...DEFAULT_FORM,
      ...item,
      metadata: item.metadata || {},
    });
    setEditingId(item.id);
    setConfirmDelete(false);
  };

  const handleCreate = () => {
    const newId = `media-${Date.now()}`;
    setFormData({ ...DEFAULT_FORM, id: newId, sort_order: media.length * 10 });
    setEditingId("__new__");
    setConfirmDelete(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const isNew = editingId === "__new__";
    const { error } = isNew
      ? await supabase.from("media").insert([formData])
      : await supabase.from("media").update(formData).eq("id", formData.id);

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
    const { error } = await supabase.from("media").delete().eq("id", formData.id);
    if (!error) {
      setEditingId(null);
      setFormData({ ...DEFAULT_FORM });
      await fetchData();
    } else {
      alert("Delete failed: " + error.message);
    }
    setConfirmDelete(false);
  };

  const handleFileUpload = async (file: File, field: string) => {
    setUploading(field);
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `media-${field}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("media-assets")
      .upload(fileName, file, { upsert: true });
    
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("media-assets").getPublicUrl(data.path);
      setFormData((prev) => ({ ...prev, [field]: urlData.publicUrl }));
    } else {
      alert("Upload failed: " + (error?.message || "Unknown error"));
    }
    setUploading(null);
  };

  const inputCls =
    "bg-black/70 border border-white/10 rounded px-3 py-2 text-sm text-white font-sans focus:border-amber-500/60 focus:outline-none transition-colors placeholder-white/20 w-full";

  const filteredMedia = media.filter((item) => {
    if (filterUniverse !== "all" && item.universe_id !== filterUniverse) return false;
    if (filterType !== "all" && item.type !== filterType) return false;
    return true;
  });

  const getMediaIcon = (type: string) => {
    const mediaType = MEDIA_TYPES.find(t => t.value === type);
    return mediaType ? mediaType.icon : FileText;
  };

  if (loading) {
    return (
      <div className="text-center py-24 font-mono text-amber-500 animate-pulse tracking-widest text-sm">
        LOADING MEDIA...
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Sidebar: Media List */}
      <div className="w-72 shrink-0 flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-mono text-lg tracking-widest text-amber-500">MEDIA</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded font-mono text-[8px] tracking-widest transition-colors"
          >
            <Plus size={11} /> NEW
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 space-y-3">
          <div>
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

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter size={12} className="text-white/40" />
              <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">Filter by Type</span>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`${inputCls} text-xs`}
            >
              <option value="all">All Types</option>
              {MEDIA_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredMedia.map((item) => {
          const Icon = getMediaIcon(item.type);
          return (
            <button
              key={item.id}
              onClick={() => handleEdit(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                editingId === item.id
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                  : "bg-black/40 border-white/5 hover:border-white/20 text-white/70 hover:text-white"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-[10px] tracking-widest truncate">
                  {item.title || "Untitled"}
                </span>
                <span className="font-mono text-[7px] text-white/25 mt-0.5 truncate capitalize">
                  {item.type}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Editor */}
      {editingId !== null && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Editor */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-mono text-xl tracking-widest text-amber-500">
                  {editingId === "__new__" ? "NEW MEDIA" : "EDIT MEDIA"}
                </h2>
                <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-1">
                  Configure media details
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
                  <option value="">Select Universe (Optional)</option>
                  {universes.map((u) => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Media Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className={inputCls}
                >
                  {MEDIA_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Media Title"
                  className={inputCls}
                />
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

            {/* URLs */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                URLs
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Media URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className={`${inputCls} flex-1`}
                  />
                  <label className="shrink-0 flex items-center gap-1.5 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 px-3 py-2 rounded cursor-pointer transition-all font-mono text-[8px] text-white/50 hover:text-amber-400 tracking-widest">
                    <Upload size={11} />
                    {uploading === "url" ? "UPLOADING..." : "UPLOAD"}
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*,.pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "url")}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Thumbnail URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                    className={`${inputCls} flex-1`}
                  />
                  <label className="shrink-0 flex items-center gap-1.5 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 px-3 py-2 rounded cursor-pointer transition-all font-mono text-[8px] text-white/50 hover:text-amber-400 tracking-widest">
                    <Upload size={11} />
                    {uploading === "thumbnail" ? "UPLOADING..." : "UPLOAD"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "thumbnail_url")}
                    />
                  </label>
                </div>
                {formData.thumbnail_url && (
                  <div className="mt-2 h-32 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                    <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
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
                  placeholder="Media description..."
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-amber-400 tracking-widest uppercase border-b border-white/5 pb-2">
                Metadata (JSON)
              </h3>
              
              <div>
                <label className="font-mono text-[8px] text-white/40 tracking-widest uppercase block mb-2">
                  Additional Metadata
                </label>
                <textarea
                  value={JSON.stringify(formData.metadata, null, 2)}
                  onChange={(e) => {
                    try {
                      setFormData({ ...formData, metadata: JSON.parse(e.target.value) });
                    } catch {
                      // Invalid JSON, don't update
                    }
                  }}
                  placeholder='{"key": "value"}'
                  rows={4}
                  className={`${inputCls} resize-none font-mono text-xs`}
                />
              </div>
            </div>
          </div>
        </div>

          {/* Preview Panel */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] flex flex-col">
            <PreviewContainer>
              <MediaGallery
                media={[
                  {
                    id: formData.id,
                    title: formData.title || "Media Title",
                    type: formData.type,
                    url: formData.url,
                    thumbnail_url: formData.thumbnail_url,
                    description: formData.description,
                  }
                ]}
              />
            </PreviewContainer>
          </div>
        </div>
      )}
    </div>
  );
}
