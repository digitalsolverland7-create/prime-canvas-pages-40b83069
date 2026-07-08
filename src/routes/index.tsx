import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Cpu,
  Leaf,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
} from "lucide-react";
import { listProperties } from "@/lib/properties";
import type { Property } from "@/lib/property-types";

export const Route = createFileRoute("/")({
  component: HubPage,
});

const TABS = [
  { id: "automation", label: "Automation", icon: Cpu, blurb: "Villas connectées, contrôle centralisé et gestion à distance intégrée à chaque parcelle sélectionnée." },
  { id: "energy", label: "Energy", icon: Sun, blurb: "Orientation solaire optimale et zonage compatible autoconsommation photovoltaïque." },
  { id: "security", label: "Security", icon: ShieldCheck, blurb: "Périmètres protégés, accès contrôlés et zones résidentielles surveillées 24/7." },
  { id: "landscape", label: "Landscape", icon: Leaf, blurb: "Vues préservées, végétation locale et façades maritimes protégées par plan d'aménagement." },
] as const;

function HubPage() {
  const { data: properties = [], isLoading } = useQuery({ queryKey: ["properties"], queryFn: listProperties });
  const featured = properties.find((p) => p.featured) ?? properties[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero featured={featured} isLoading={isLoading} />
      <TabsSection />
      <PropertiesRail properties={properties} />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="glass flex items-center gap-3 rounded-full px-3 py-2 md:gap-8 md:px-6">
        <Link to="/" className="flex items-center gap-2 pl-2 pr-1">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ember text-primary-foreground font-display text-sm">M</span>
          <span className="font-display text-lg tracking-tight">Movia Immo</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#properties" className="hover:text-foreground transition">Propriétés</a>
          <a href="#experience" className="hover:text-foreground transition">Expérience</a>
          <a href="#contact" className="hover:text-foreground transition">Contact</a>
        </div>
        <Link
          to="/admin"
          className="hidden md:inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          Admin
        </Link>
        <a
          href="#contact"
          className="inline-flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition"
        >
          Réserver une visite <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </nav>
    </header>
  );
}

function Hero({ featured, isLoading }: { featured?: Property; isLoading: boolean }) {
  const bg =
    featured?.images[0] ??
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80";

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <motion.img
        key={bg}
        src={bg}
        alt=""
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-6 pt-32 pb-16">
        {/* Top HUD */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
          >
            <Wind className="h-4 w-4 text-ember" />
            <div>
              <div className="text-xs text-muted-foreground">Tanger, Maroc</div>
              <div className="font-medium">22°C · Ciel dégagé</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs"
          >
            <span className="h-2 w-2 rounded-full bg-ember animate-pulse" />
            Portfolio actif — {isLoading ? "…" : `${featured ? "4" : "0"} propriétés vérifiées`}
          </motion.div>
        </div>

        {/* Center title */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-ember" /> Sélection privée · Tanger
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              Le foncier <em className="text-ember not-italic">rare</em>,
              <br /> orchestré par Movia.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Terrains résidentiels, vues sur mer et zones stratégiques — chaque parcelle est
              vérifiée, présentée et livrée avec un dossier complet.
            </p>
          </motion.div>
        </div>

        {/* Bottom feature card + hotspots */}
        <div className="grid gap-4 md:grid-cols-3">
          {featured && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-strong ember-glow col-span-1 md:col-span-2 rounded-3xl p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-ember">Featured</div>
                  <h3 className="font-display text-xl md:text-2xl mt-1 truncate">{featured.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {featured.location}
                  </div>
                </div>
                {featured.slug && (
                  <Link
                    to="/property/$slug"
                    params={{ slug: featured.slug }}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ember px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                  >
                    Explorer <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="glass rounded-3xl p-5"
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs"><Ruler className="h-3 w-3" /> Surface</div>
                    <div className="font-display text-2xl mt-1">{featured.area?.toLocaleString("fr-FR")}<span className="text-sm text-muted-foreground"> m²</span></div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Statut</div>
                    <div className="mt-1 text-base">À vendre · Titré</div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function TabsSection() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("automation");
  const tab = TABS.find((t) => t.id === active)!;
  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-32">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">L'expérience Movia</div>
        <h2 className="font-display text-4xl md:text-6xl mt-3">Pensé pour le futur.<br />Livré aujourd'hui.</h2>
      </div>
      <div className="mt-12 glass-strong rounded-3xl p-2">
        <div className="flex flex-wrap gap-1 rounded-2xl bg-background/40 p-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`relative flex-1 min-w-[140px] rounded-xl px-4 py-3 text-sm transition ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-xl bg-ember/15 ring-1 ring-ember/40"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  <Icon className="h-4 w-4" /> {t.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="font-display text-3xl md:text-5xl">{tab.label}</div>
              <p className="mt-4 text-muted-foreground max-w-md text-lg leading-relaxed">{tab.blurb}</p>
              <div className="mt-8 flex gap-3">
                {["Vérifié", "ROI +18%", "Livrable 2027"].map((chip) => (
                  <span key={chip} className="rounded-full glass px-3 py-1 text-xs">{chip}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="relative overflow-hidden rounded-2xl bg-secondary/60 min-h-[240px]">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3 text-xs">
              <div className="text-muted-foreground">Certification</div>
              <div className="font-medium">Movia Verified · Dossier technique complet</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PropertiesRail({ properties }: { properties: Property[] }) {
  return (
    <section id="properties" className="mx-auto max-w-[100rem] px-6 py-24">
      <div className="mx-auto max-w-7xl flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Nos propriétés</div>
          <h2 className="font-display text-4xl md:text-6xl mt-3">Une sélection restreinte.</h2>
        </div>
        <Link to="/admin" className="hidden md:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          Gérer <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 flex gap-6 overflow-x-auto pb-6 [scrollbar-width:thin] snap-x snap-mandatory">
        {properties.map((p, i) => (
          <PropertyCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function PropertyCard({ p, index }: { p: Property; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative shrink-0 snap-start overflow-hidden rounded-3xl bg-secondary"
      style={{ width: "min(85vw, 380px)", height: "560px" }}
    >
      <motion.img
        src={p.images[0] ?? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"}
        alt={p.title}
        animate={{ scale: hover ? 1.08 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">{p.price ?? "À consulter"}</span>
        <span className="glass rounded-full px-3 py-1 text-[10px]">{p.area?.toLocaleString("fr-FR")} m²</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/70">
          <MapPin className="h-3 w-3" /> {p.location}
        </div>
        <h3 className="mt-2 font-display text-2xl leading-tight text-white line-clamp-2">{p.title}</h3>

        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-sm text-white/75 line-clamp-3">{p.description}</p>
              {p.slug && (
                <Link
                  to="/property/$slug"
                  params={{ slug: p.slug }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-ember hover:text-primary-foreground transition"
                >
                  Explore this estate <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ember text-primary-foreground font-display">M</span>
            <span className="font-display text-xl">Movia Immo</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Courtier foncier privé — Tanger. Nous sélectionnons, vérifions et présentons chaque parcelle.
          </p>
        </div>
        <div className="text-sm">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Contact</div>
          <div className="mt-3 space-y-1">
            <div>Tanger, Maroc</div>
            <div>contact@moviaimmo.ma</div>
          </div>
        </div>
        <div className="text-sm">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Espace pro</div>
          <Link to="/admin" className="mt-3 inline-flex items-center gap-1 hover:text-ember">Tableau de bord <ArrowUpRight className="h-3 w-3" /></Link>
        </div>
      </div>
      <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Movia Immo. Tous droits réservés.
      </div>
    </footer>
  );
}
