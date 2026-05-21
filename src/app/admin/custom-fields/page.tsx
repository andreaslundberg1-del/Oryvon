"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Save, Trash2, Wand2 } from "lucide-react";

const DEFAULT_FORM = {
  entity_table: "universes",
  field_key: "",
  label: "",
  field_type: "text",
  options: [] as string[],
  required: false,
  sort_order: 0,
};

const ENTITY_TABLES = ["universes", "characters", "locations", "timeline_events", "factions", "media", "portals"];
const FIELD_TYPES = ["text", "textarea", "number", "boolean", "select", "multi_select", "date", "url", "color"];

export default function CustomFieldsPage() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("custom_field_schemas").select("*").order("entity_table").order("sort_order");
    setSchemas(data || []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("custom_field_schemas").upsert({
      ...form,
      options: form.options,
      field_key: form.field_key.trim().toLowerCase().replace(/\s+/g, "_"),
      updated_at: new Date().toISOString(),
    }, { onConflict: "entity_table,field_key" });
    if (error) alert(error.message);
    await load();
    setForm({ ...DEFAULT_FORM });
    setSaving(false);
  };

  const remove = async (schema: any) => {
    await supabase.from("custom_field_schemas").delete().eq("id", schema.id);
    await load();
  };

  const inputCls = "w-full rounded border border-white/10 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-xl tracking-widest text-amber-500">CUSTOM FIELDS</h1>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/40">Dynamic metadata schemas for canon status, power level and timeline branches</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-2xl border border-white/5 bg-black/50 p-5 space-y-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-300"><Plus size={14} /> New Field Schema</div>
          <select value={form.entity_table} onChange={(e) => setForm({ ...form, entity_table: e.target.value })} className={inputCls}>
            {ENTITY_TABLES.map((table) => <option key={table} value={table}>{table}</option>)}
          </select>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label e.g. Power Level" className={inputCls} />
          <input value={form.field_key} onChange={(e) => setForm({ ...form, field_key: e.target.value })} placeholder="Field key e.g. power_level" className={inputCls} />
          <select value={form.field_type} onChange={(e) => setForm({ ...form, field_type: e.target.value })} className={inputCls}>
            {FIELD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <input value={form.options.join(", ")} onChange={(e) => setForm({ ...form, options: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Options for select fields" className={inputCls} />
          <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-widest text-white/60">
            <input type="checkbox" checked={form.required} onChange={(e) => setForm({ ...form, required: e.target.checked })} className="accent-amber-500" /> Required
          </label>
          <button onClick={save} disabled={saving || !form.label || !form.field_key} className="flex w-full items-center justify-center gap-2 rounded border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-amber-300 disabled:opacity-40">
            <Save size={13} /> {saving ? "Saving..." : "Save Schema"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/50 p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {schemas.map((schema) => (
              <div key={schema.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-amber-500/20 transition-all">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300"><Wand2 size={15} /></div>
                  <button onClick={() => remove(schema)} className="text-red-400/60 hover:text-red-300"><Trash2 size={14} /></button>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white">{schema.label}</div>
                <div className="mt-1 font-mono text-[8px] uppercase tracking-widest text-white/35">{schema.entity_table} · {schema.field_type}</div>
                <div className="mt-3 rounded border border-white/5 bg-black/40 px-2 py-1 font-mono text-[8px] text-amber-300/70">{schema.field_key}</div>
              </div>
            ))}
          </div>
          {schemas.length === 0 && <div className="py-20 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">No custom schemas yet</div>}
        </div>
      </div>
    </div>
  );
}
