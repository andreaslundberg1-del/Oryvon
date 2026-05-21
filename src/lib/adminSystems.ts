import { supabase } from "@/lib/supabase";

export type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "failed";

export async function recordActivity(input: {
  action: string;
  entity_table?: string;
  entity_id?: string;
  entity_title?: string;
  metadata?: Record<string, any>;
}) {
  await supabase.from("activity_feed").insert({
    action: input.action,
    entity_table: input.entity_table,
    entity_id: input.entity_id,
    entity_title: input.entity_title,
    metadata: input.metadata || {},
  });
}

export async function createSnapshot(input: {
  entity_table: string;
  entity_id: string;
  snapshot: Record<string, any>;
  change_summary?: string;
}) {
  await supabase.from("entity_versions").insert({
    entity_table: input.entity_table,
    entity_id: input.entity_id,
    snapshot: input.snapshot,
    change_summary: input.change_summary || "Manual snapshot",
  });
}

export async function saveWithVersion(input: {
  table: string;
  id: string;
  payload: Record<string, any>;
  title?: string;
  summary?: string;
}) {
  await createSnapshot({
    entity_table: input.table,
    entity_id: input.id,
    snapshot: input.payload,
    change_summary: input.summary || "Content updated",
  });

  const { error } = await supabase
    .from(input.table)
    .update({ ...input.payload, updated_at: new Date().toISOString() })
    .eq("id", input.id);

  if (error) throw error;

  await recordActivity({
    action: input.summary || "Content updated",
    entity_table: input.table,
    entity_id: input.id,
    entity_title: input.title,
  });
}
