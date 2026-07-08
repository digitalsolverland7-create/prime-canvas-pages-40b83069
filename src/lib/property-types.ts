export type Feature = { label: string; value: string };
export type AudioTracks = { fr?: string | null; ar?: string | null; en?: string | null };

export type Property = {
  id: string;
  slug: string | null;
  title: string;
  location: string | null;
  price: string | null;
  description: string | null;
  area: number | null;
  images: string[];
  canva_embed_url: string | null;
  audio_tracks: AudioTracks;
  features: Feature[];
  source_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};
