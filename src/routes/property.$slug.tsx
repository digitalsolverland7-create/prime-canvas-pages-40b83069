import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
  Phone,
  Ruler,
  Volume2,
  VolumeX,
  Waves,
} from "lucide-react";
import { getPropertyBySlug, submitMessage } from "@/lib/properties";
import type { Property } from "@/lib/property-types";

export const Route = createFileRoute("/property/$slug")({
  component: PropertyPage,
  errorComponent: ({ error, reset }) => {
    const r = useRouter();
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <button onClick={() => { r.invalidate(); reset(); }} className="mt-3 underline">Retry</button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="font-display text-3xl">Propriété introuvable</h1>
        <Link to="/" className="mt-4 inline-block underline">Retour à l'accueil</Link>
      </div>
    </div>
  ),
});

function PropertyPage() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => getPropertyBySlug(slug),
  });

  if (isLoading) return <div className="min-h-screen grid place-items-center theme-light bg-background text-foreground">Chargement…</div>;
  if (error) throw error;
  if (!data) throw notFound();
  return <PropertyView p={data} />;
}

function PropertyView({ p }: { p: Property }) {
  return (
    <div className="theme-light bg-background text-foreground min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(1000px 600px at 10% -10%, oklch(0.9 0.05 155 / 0.5), transparent 60%), radial-gradient(800px 500px at 100% 20%, oklch(0.95 0.02 90 / 0.6), transparent 60%)",
        }}
      />
      <PropertyNav p={p} />
      <PropertyHero p={p} />
      <MediaCarousel p={p} />
      <AudioModule p={p} />
      <FeaturesGrid p={p} />
      <LeadForm p={p} />
      <PropertyFooter />
    </div>
  );
}

function PropertyNav({ p }: { p: Property }) {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="glass-light flex items-center gap-4 rounded-full px-4 py-2">
        <Link to="/" className="flex items-center gap-2 pr-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-display">Movia Immo</span>
        </Link>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> À Vendre
        </span>
        <a
          href="#contact"
          className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium"
        >
          <Phone className="h-3 w-3" /> Contactez-nous
        </a>
        {p.source_url && (
          <a href={p.source_url} target="_blank" rel="noreferrer" className="hidden md:inline text-xs text-muted-foreground hover:text-foreground">
            Voir l'annonce ↗
          </a>
        )}
      </nav>
    </header>
  );
}

function PropertyHero({ p }: { p: Property }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 pb-12">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="text-xs uppercase tracking-[0.24em] text-primary/70 flex items-center gap-2">
            <Waves className="h-3 w-3" /> {p.location}
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.02]">
            Découvrez votre <em className="text-primary not-italic">futur domaine</em>
            {p.title.toLowerCase().includes("mer") ? " avec vue sur mer." : "."}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            {p.area?.toLocaleString("fr-FR")} m² · {p.location}. Une opportunité rare, présentée en détail par Movia Immo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#audio" className="glass-light inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
              <Play className="h-3.5 w-3.5" /> Écouter la présentation
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm">
              Demander une visite <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="glass-light rounded-3xl p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Résumé</div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs flex items-center gap-1"><Ruler className="h-3 w-3" /> Surface</div>
                <div className="font-display text-2xl mt-1">{p.area?.toLocaleString("fr-FR")}<span className="text-sm text-muted-foreground"> m²</span></div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> Zone</div>
                <div className="mt-1">{(p.location ?? "").split(",")[0]}</div>
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground text-xs">Prix</div>
                <div className="mt-1 font-medium">{p.price ?? "À consulter"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaCarousel({ p }: { p: Property }) {
  const slides = useMemo(() => {
    const arr: { type: "image" | "canva"; src: string }[] = p.images.map((src) => ({ type: "image", src }));
    if (p.canva_embed_url) arr.push({ type: "canva", src: p.canva_embed_url });
    return arr;
  }, [p]);
  const [i, setI] = useState(0);
  const total = slides.length || 1;
  const current = slides[i];

  return (
    <section className="mx-auto max-w-7xl px-6 py-4">
      <div className="glass-light overflow-hidden rounded-[2rem] p-3">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-secondary">
          <AnimatePresence mode="wait">
            {current?.type === "image" && (
              <motion.img
                key={current.src}
                src={current.src}
                alt=""
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {current?.type === "canva" && (
              <motion.iframe
                key={current.src}
                src={current.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                title="Présentation Canva"
                allow="fullscreen"
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            )}
          </AnimatePresence>
          {slides.length > 1 && (
            <>
              <button
                onClick={() => setI((v) => (v - 1 + total) % total)}
                className="glass-light absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setI((v) => (v + 1) % total)}
                className="glass-light absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2"
                aria-label="Suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-4 bg-white/60"}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {slides.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto p-1">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl transition ring-2 ${idx === i ? "ring-primary" : "ring-transparent"}`}
              >
                {s.type === "image" ? (
                  <img src={s.src} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-primary/10 text-xs">Canva</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AudioModule({ p }: { p: Property }) {
  const langs = [
    { id: "fr" as const, label: "Français" },
    { id: "ar" as const, label: "العربية" },
    { id: "en" as const, label: "English" },
  ];
  const [lang, setLang] = useState<"fr" | "ar" | "en">("fr");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);
  const src = p.audio_tracks?.[lang] ?? null;

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
  }, [lang, src]);

  const toggle = () => {
    if (!ref.current || !src) return;
    if (playing) ref.current.pause();
    else ref.current.play();
    setPlaying(!playing);
  };

  const fmt = (n: number) => {
    if (!isFinite(n)) return "0:00";
    const m = Math.floor(n / 60);
    const s = Math.floor(n % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section id="audio" className="mx-auto max-w-7xl px-6 py-12">
      <div className="glass-light rounded-[2rem] p-6 md:p-8" style={{ boxShadow: "0 40px 80px -40px rgba(50,100,80,0.35), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-primary/70">Présentation vocale</div>
            <h2 className="font-display text-2xl md:text-3xl mt-2">Un guide privé de la propriété</h2>
          </div>
          <div className="flex gap-1 rounded-full bg-white/60 p-1 shadow-inner">
            {langs.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`relative rounded-full px-4 py-1.5 text-sm transition ${lang === l.id ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"}`}
              >
                {lang === l.id && (
                  <motion.span layoutId="audio-lang" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={toggle}
            disabled={!src}
            className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:scale-105 transition"
            aria-label={playing ? "Pause" : "Lecture"}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px]" />}
          </button>
          <div className="flex-1">
            <div className="relative h-1.5 w-full rounded-full bg-primary/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={progress}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setProgress(v);
                  if (ref.current) ref.current.currentTime = v;
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                disabled={!src}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{fmt(progress)}</span>
              <span>{src ? fmt(duration) : "Aucune piste audio pour cette langue"}</span>
            </div>
          </div>
          <button onClick={() => setMuted((m) => !m)} className="glass-light rounded-full p-2" aria-label="Muet">
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {src && (
          <audio
            ref={ref}
            src={src}
            muted={muted}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
            onEnded={() => setPlaying(false)}
          />
        )}
        {!src && (
          <p className="mt-4 text-xs text-muted-foreground">
            Piste audio pour cette langue non disponible. Ajoutez-la depuis le tableau de bord Admin.
          </p>
        )}
      </div>
    </section>
  );
}

function FeaturesGrid({ p }: { p: Property }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-primary/70">Fiche technique</div>
        <h2 className="font-display text-3xl md:text-5xl mt-3">Chaque détail vérifié.</h2>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {p.features.map((f) => (
          <div key={f.label} className="glass-light rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</div>
            <div className="mt-2 font-display text-xl">{f.value}</div>
          </div>
        ))}
      </div>
      {p.description && (
        <article className="glass-light mt-10 rounded-3xl p-8 whitespace-pre-line leading-relaxed text-[15px]">
          {p.description}
        </article>
      )}
    </section>
  );
}

function LeadForm({ p }: { p: Property }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await submitMessage({ property_id: p.id, name, phone, email, message });
      setSent(true);
      setName(""); setPhone(""); setEmail(""); setMessage("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-16">
      <div className="glass-light grid gap-8 rounded-[2rem] p-8 md:grid-cols-2 md:p-12">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-primary/70">Contact</div>
          <h2 className="font-display text-3xl md:text-5xl mt-3">Réservez une visite privée.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Notre conseiller vous rappelle sous 24 h avec le dossier complet et les disponibilités du terrain.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 outline-none focus:border-primary" />
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 outline-none focus:border-primary" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optionnel)" className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 outline-none focus:border-primary" />
          <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 outline-none focus:border-primary" />
          <button disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium disabled:opacity-50">
            {loading ? "Envoi…" : sent ? "Merci ! Nous vous recontactons." : "Envoyer la demande"}
            <ArrowUpRight className="h-4 w-4" />
          </button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </div>
    </section>
  );
}

function PropertyFooter() {
  return (
    <footer className="border-t border-border/40 py-10 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Movia Immo — Terrains d'exception à Tanger.
    </footer>
  );
}
