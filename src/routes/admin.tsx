import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Plus, Save, Star, Trash2 } from "lucide-react";
import { deleteProperty, listProperties, upsertProperty } from "@/lib/properties";
import type { Feature, Property } from "@/lib/property-types";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const empty: Partial<Property> = {
  title: "",
  location: "",
  price: "",
  description: "",
  area: 0,
  images: [],
  canva_embed_url: "",
  audio_tracks: { fr: "", ar: "", en: "" },
  features: [],
  featured: false,
  slug: "",
};

function AdminPage() {
  const qc = useQueryClient();
  const { data: props = [] } = useQuery({ queryKey: ["properties"], queryFn: listProperties });
  const [editing, setEditing] = useState<Partial<Property> | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["properties"] });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </Link>
          <div className="font-display text-lg">Movia Immo — Admin</div>
          <button
            onClick={() => setEditing({ ...empty })}
            className="inline-flex items-center gap-1 rounded-full bg-ember px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Nouvelle propriété
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[380px_1fr]">
        <aside className="glass rounded-3xl p-3">
          <div className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">
            {props.length} propriétés
          </div>
          <ul className="space-y-1">
            {props.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setEditing(p)}
                  className={`group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${editing?.id === p.id ? "bg-ember/15 ring-1 ring-ember/40" : "hover:bg-secondary/60"}`}
                >
                  <img src={p.images[0]} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 truncate text-sm">
                      {p.featured && <Star className="h-3 w-3 fill-ember text-ember" />}
                      <span className="truncate">{p.title}</span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{p.location}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main>
          {editing ? (
            <PropertyForm
              key={editing.id ?? "new"}
              initial={editing}
              onSaved={() => { refresh(); }}
              onDeleted={() => { setEditing(null); refresh(); }}
            />
          ) : (
            <div className="glass grid min-h-[400px] place-items-center rounded-3xl p-10 text-center text-muted-foreground">
              <div>
                <div className="font-display text-2xl text-foreground">Sélectionnez une propriété</div>
                <p className="mt-2 text-sm">…ou créez-en une nouvelle depuis le bouton en haut à droite.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function PropertyForm({
  initial,
  onSaved,
  onDeleted,
}: {
  initial: Partial<Property>;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [p, setP] = useState<Partial<Property>>({ ...initial });
  const [imagesText, setImagesText] = useState((initial.images ?? []).join("\n"));
  const [features, setFeatures] = useState<Feature[]>(initial.features ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | undefined>(initial.id);

  const audio = { fr: "", ar: "", en: "", ...(initial.audio_tracks ?? {}) };
  const [tracks, setTracks] = useState<{ fr: string; ar: string; en: string }>({
    fr: audio.fr ?? "",
    ar: audio.ar ?? "",
    en: audio.en ?? "",
  });

  const set = (k: keyof Property, v: unknown) => setP((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      const images = imagesText.split("\n").map((s) => s.trim()).filter(Boolean);
      const cleanTracks = Object.fromEntries(
        Object.entries(tracks).map(([k, v]) => [k, v.trim() || null])
      );
      const saved = await upsertProperty({
        ...(p as Property),
        title: p.title ?? "Sans titre",
        images,
        features,
        audio_tracks: cleanTracks,
        slug: (p.slug || "").trim() || null,
      });
      setSavedId(saved.id);
      setP(saved);
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!p.id) return;
    if (!confirm("Supprimer cette propriété ?")) return;
    await deleteProperty(p.id);
    onDeleted();
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">{p.id ? "Éditer la propriété" : "Nouvelle propriété"}</h2>
        <div className="flex gap-2">
          {savedId && p.slug && (
            <Link
              to="/property/$slug"
              params={{ slug: p.slug }}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary"
            >
              <ExternalLink className="h-3 w-3" /> Live preview
            </Link>
          )}
          {p.id && (
            <button onClick={remove} className="inline-flex items-center gap-1 rounded-full border border-destructive/50 text-destructive px-3 py-1.5 text-xs">
              <Trash2 className="h-3 w-3" /> Supprimer
            </button>
          )}
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-1 rounded-full bg-ember px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">
            <Save className="h-3 w-3" /> {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Field label="Titre"><Input value={p.title ?? ""} onChange={(v) => set("title", v)} /></Field>
        <Field label="Slug (URL)"><Input value={p.slug ?? ""} onChange={(v) => set("slug", v)} placeholder="ex: hajriyine-991-vue-mer" /></Field>
        <Field label="Localisation"><Input value={p.location ?? ""} onChange={(v) => set("location", v)} /></Field>
        <Field label="Prix"><Input value={p.price ?? ""} onChange={(v) => set("price", v)} /></Field>
        <Field label="Surface (m²)"><Input type="number" value={String(p.area ?? "")} onChange={(v) => set("area", Number(v))} /></Field>
        <Field label="Source URL"><Input value={p.source_url ?? ""} onChange={(v) => set("source_url", v)} /></Field>
        <Field label="Featured (visible sur homepage)">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} />
            <span>Afficher dans le carrousel principal</span>
          </label>
        </Field>
        <Field label="Canva embed URL" hint="Collez le lien iframe/embed depuis Canva (…/watch?embed).">
          <Input value={p.canva_embed_url ?? ""} onChange={(v) => set("canva_embed_url", v)} />
        </Field>
        <Field className="md:col-span-2" label="Description">
          <textarea rows={6} value={p.description ?? ""} onChange={(e) => set("description", e.target.value)} className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 outline-none focus:border-ember" />
        </Field>
        <Field className="md:col-span-2" label="Images (une URL par ligne)">
          <textarea rows={4} value={imagesText} onChange={(e) => setImagesText(e.target.value)} className="w-full font-mono text-xs rounded-xl border border-input bg-background/50 px-4 py-3 outline-none focus:border-ember" />
        </Field>

        <Field className="md:col-span-2" label="Fiche technique">
          <FeaturesEditor features={features} onChange={setFeatures} />
        </Field>

        <Field className="md:col-span-2" label="Pistes audio (URLs)">
          <div className="grid gap-3 md:grid-cols-3">
            {(["fr", "ar", "en"] as const).map((lang) => (
              <div key={lang}>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{lang}</div>
                <Input value={tracks[lang]} onChange={(v) => setTracks({ ...tracks, [lang]: v })} placeholder={`https://…/audio-${lang}.mp3`} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Astuce : hébergez les fichiers audio sur Cloud Storage puis collez l'URL publique ici.
          </p>
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function Field({ label, children, hint, className = "" }: { label: string; children: React.ReactNode; hint?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 outline-none focus:border-ember"
    />
  );
}

function FeaturesEditor({ features, onChange }: { features: Feature[]; onChange: (f: Feature[]) => void }) {
  const update = (i: number, patch: Partial<Feature>) => onChange(features.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  return (
    <div className="space-y-2">
      {features.map((f, i) => (
        <div key={i} className="flex gap-2">
          <input value={f.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Label" className="w-1/3 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm" />
          <input value={f.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="Valeur" className="flex-1 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm" />
          <button onClick={() => onChange(features.filter((_, idx) => idx !== i))} className="rounded-xl border border-border px-3 text-xs">×</button>
        </div>
      ))}
      <button onClick={() => onChange([...features, { label: "", value: "" }])} className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs">+ Ajouter une caractéristique</button>
    </div>
  );
}
