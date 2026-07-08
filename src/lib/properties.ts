import { supabase } from "@/integrations/supabase/client";
import type { Property } from "./property-types";

type Row = Record<string, unknown>;
function toProperty(r: Row): Property {
  return {
    id: String(r.id),
    slug: (r.slug as string | null) ?? null,
    title: String(r.title ?? ""),
    location: (r.location as string | null) ?? null,
    price: (r.price as string | null) ?? null,
    description: (r.description as string | null) ?? null,
    area: (r.area as number | null) ?? null,
    images: (r.images as string[] | null) ?? [],
    canva_embed_url: (r.canva_embed_url as string | null) ?? null,
    audio_tracks: (r.audio_tracks as Property["audio_tracks"] | null) ?? {},
    features: (r.features as Property["features"] | null) ?? [],
    source_url: (r.source_url as string | null) ?? null,
    featured: Boolean(r.featured),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function listProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => toProperty(r as Row));
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase.from("properties").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? toProperty(data as Row) : null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toProperty(data as Row) : null;
}

export async function upsertProperty(input: Partial<Property> & { title: string }): Promise<Property> {
  const payload = {
    id: input.id,
    slug: input.slug,
    title: input.title,
    location: input.location,
    price: input.price,
    description: input.description,
    area: input.area,
    images: input.images ?? [],
    canva_embed_url: input.canva_embed_url,
    audio_tracks: input.audio_tracks ?? {},
    features: input.features ?? [],
    source_url: input.source_url,
    featured: input.featured ?? false,
  };
  const { data, error } = await supabase.from("properties").upsert(payload).select().single();
  if (error) throw error;
  return toProperty(data as Row);
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
}

export async function submitMessage(input: {
  property_id?: string | null;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
}): Promise<void> {
  const { error } = await supabase.from("messages").insert(input);
  if (error) throw error;
}
