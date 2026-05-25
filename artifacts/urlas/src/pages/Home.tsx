import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock, Mail, Instagram, Phone, ChevronDown, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useLang } from "@/context/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useGalleryData } from "@/hooks/useGalleryData";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, duration: 0.8 } },
};

const SECTIONS = ["hero", "about", "gallery", "visit"] as const;
type SectionId = typeof SECTIONS[number];

function SideNav({ active }: { active: SectionId }) {
  const { t } = useLang();
  const labels: Record<SectionId, string> = {
    hero: "Urla's",
    about: t.nav.about,
    gallery: t.gallery.title,
    visit: t.nav.visit,
  };
  return (
    <div className="fixed left-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 items-center">
      {SECTIONS.map((id) => (
        <div key={id} className="nav-dot-wrapper relative flex items-center">
          <button
            data-testid={`dot-nav-${id}`}
            className={`nav-dot ${active === id ? "active" : ""}`}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            aria-label={labels[id]}
          />
          <span className="nav-dot-label">{labels[id]}</span>
        </div>
      ))}
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, setLang, t } = useLang();

  const scrollTo = (id: string) => {
    onClose();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-foreground flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-background/10">
            <span className="font-serif text-2xl font-bold text-olive">Urla's</span>
            <button onClick={onClose} className="text-background/60 hover:text-background p-2" aria-label="Close menu">
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
            {[
              { label: t.nav.about, action: () => scrollTo("about") },
              { label: t.nav.menu, href: "/menu" },
              { label: t.nav.visit, action: () => scrollTo("visit") },
            ].map((item, i) =>
              item.href ? (
                <Link key={i} href={item.href} onClick={onClose} className="font-serif text-4xl text-background/80 hover:text-olive py-3 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <button key={i} onClick={item.action} className="font-serif text-4xl text-background/80 hover:text-olive py-3 text-left transition-colors">
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="px-8 pb-10 flex items-center justify-between border-t border-background/10 pt-6">
            <button
              onClick={() => { setLang(lang === "tr" ? "en" : "tr"); onClose(); }}
              className="text-[11px] tracking-[0.2em] uppercase text-background/50 hover:text-olive border border-background/20 px-3 py-1.5 transition-colors"
            >
              {lang === "tr" ? "EN" : "TR"}
            </button>
            <div className="flex gap-5">
              <a href="https://www.instagram.com/urlascoffee/" target="_blank" rel="noopener noreferrer" className="text-background/40 hover:text-olive transition-colors">
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="tel:+905346962033" className="text-background/40 hover:text-olive transition-colors">
                <Phone className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const { lang, setLang, t } = useLang();
  const { get } = useSiteContent(lang);
  const { images: galleryImages } = useGalleryData();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightbox(i), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevPhoto = useCallback(() => setLightbox(i => i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null), [galleryImages.length]);
  const nextPhoto = useCallback(() => setLightbox(i => i !== null ? (i + 1) % galleryImages.length : null), [galleryImages.length]);

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.06]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen || lightbox !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, prevPhoto, nextPhoto]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const instagramHandle = get("contact.instagram") || "urlascoffee";

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <div className="noise-overlay" />
      <SideNav active={activeSection} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border/60 py-3 md:py-4" : "bg-transparent py-4 md:py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <button
            data-testid="nav-logo"
            onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
            className={`font-serif text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}
          >
            Urla's
          </button>

          <div className={`hidden md:flex items-center gap-8 lg:gap-10 text-[11px] tracking-[0.18em] uppercase font-sans font-medium transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}>
            <button data-testid="nav-about" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-olive transition-colors">{t.nav.about}</button>
            <Link data-testid="nav-menu" href="/menu" className="hover:text-olive transition-colors">{t.nav.menu}</Link>
            <button data-testid="nav-visit" onClick={() => document.getElementById("visit")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-olive transition-colors">{t.nav.visit}</button>
          </div>

          <div className="flex items-center gap-3">
            <button
              data-testid="lang-toggle"
              onClick={() => setLang(lang === "tr" ? "en" : "tr")}
              className={`text-[11px] tracking-[0.16em] uppercase font-sans font-medium px-2.5 py-1.5 border transition-all duration-300 ${scrolled ? "border-border text-foreground hover:border-olive hover:text-olive" : "border-white/50 text-white hover:border-white"}`}
            >
              {lang === "tr" ? "EN" : "TR"}
            </button>
            <button
              data-testid="mobile-menu-open"
              onClick={() => setMobileOpen(true)}
              className={`md:hidden p-1.5 transition-colors ${scrolled ? "text-foreground" : "text-white"}`}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative h-screen w-full flex items-end justify-center overflow-hidden">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <img src="/cafe-interior.jpg" alt="Urla's Coffee Shop" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/80" />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 text-center text-white px-4 pb-20 md:pb-28 max-w-4xl w-full">
          <motion.h1 variants={fadeUp} className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] mb-5 md:mb-8 tracking-tight leading-none">
            Urla's
          </motion.h1>
          <motion.p variants={fadeUp} className="font-sans text-sm md:text-base lg:text-lg font-light tracking-wide max-w-md md:max-w-xl mx-auto text-white/75 leading-relaxed">
            {get("hero.tagline")}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 md:mt-12">
            <button
              data-testid="hero-discover"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="flex flex-col items-center gap-2 mx-auto text-white/50 hover:text-white transition-colors text-[11px] tracking-[0.2em] uppercase"
            >
              <span>{t.hero.discover}</span>
              <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={1.5} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-28 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
              <motion.p variants={fadeUp} className="font-sans text-[11px] tracking-[0.28em] uppercase text-olive mb-4">
                {lang === "tr" ? "Hikayemiz" : "Our Story"}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl sm:text-5xl md:text-6xl mb-6 md:mb-10 leading-tight text-foreground">
                {get("about.title")}
              </motion.h2>
              <motion.div variants={stagger} className="space-y-5 text-muted-foreground font-sans text-sm md:text-base leading-[1.85]">
                <motion.p variants={fadeUp}>{get("about.p1")}</motion.p>
                <motion.p variants={fadeUp}>{get("about.p2")}</motion.p>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-8 md:mt-10">
                <Link data-testid="about-menu-link" href="/menu" className="inline-flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase font-sans font-medium text-foreground border-b border-foreground/30 pb-1 hover:border-olive hover:text-olive transition-all duration-300">
                  {t.nav.menu} <span className="text-xs">→</span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp} className="relative mt-4 lg:mt-0">
              <div className="aspect-[4/3] sm:aspect-[4/4] lg:aspect-[4/5] w-full overflow-hidden">
                <img src="/about-coffee.jpg" alt={lang === "tr" ? "Espresso fincanları" : "Espresso cups"} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-2/3 h-2/3 border border-olive/25 pointer-events-none z-[-1]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="green-stripe py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10 md:mb-14">
            <motion.p variants={fadeUp} className="font-sans text-[11px] tracking-[0.28em] uppercase text-olive mb-3 md:mb-4">{t.gallery.subtitle}</motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">{t.gallery.title}</motion.h2>
          </motion.div>
        </div>

        {/* Filmstrip — full width, no side padding */}
        <div className="overflow-hidden w-full cursor-pointer">
          <div className="gallery-track">
            {/* Render images twice for seamless loop */}
            {[...galleryImages, ...galleryImages].map((img, i) => (
              <div
                key={i}
                className="shrink-0 h-72 sm:h-80 md:h-96 mx-1.5 overflow-hidden"
                style={{ width: "clamp(260px, 32vw, 420px)" }}
                onClick={() => openLightbox(i % galleryImages.length)}
              >
                <img
                  src={img.url}
                  alt={lang === "tr" ? img.altTr : img.altEn}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ objectPosition: "50% 55%" }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && galleryImages[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Prev */}
            {galleryImages.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 sm:left-8 text-white/60 hover:text-white transition-colors p-3"
                aria-label="Previous"
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={galleryImages[lightbox].url}
              alt={lang === "tr" ? galleryImages[lightbox].altTr : galleryImages[lightbox].altEn}
              className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
              draggable={false}
            />

            {/* Next */}
            {galleryImages.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 sm:right-8 text-white/60 hover:text-white transition-colors p-3"
                aria-label="Next"
              >
                <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
              </button>
            )}

            {/* Counter */}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs font-sans tracking-widest">
              {lightbox + 1} / {galleryImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visit Us */}
      <section id="visit" className="py-16 md:py-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="font-sans text-[11px] tracking-[0.28em] uppercase text-olive mb-4 md:mb-5">
              {lang === "tr" ? "Adres & Saatler" : "Location & Hours"}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl sm:text-5xl md:text-6xl mb-10 md:mb-16 text-foreground">{t.visit.title}</motion.h2>

            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 border border-border/60">
              <motion.div variants={fadeUp} className="p-6 md:p-10 sm:border-r border-border/60 border-b sm:border-b-0">
                <div className="w-8 h-px bg-olive mb-6 md:mb-8" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Urla's+Coffee+NEF11+Kağıthane+İstanbul"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Google Maps"
                  className="inline-block mb-4 md:mb-5 text-olive hover:text-olive/70 transition-colors"
                >
                  <MapPin className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <h3 className="font-serif text-lg md:text-xl mb-3 md:mb-4 text-foreground">{t.visit.location}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed whitespace-pre-line select-text cursor-text">{get("visit.address")}</p>
              </motion.div>

              <motion.div variants={fadeUp} className="p-6 md:p-10 sm:border-r border-border/60 border-b sm:border-b-0">
                <div className="w-8 h-px bg-olive mb-6 md:mb-8" />
                <Clock className="w-5 h-5 mb-4 md:mb-5 text-olive" strokeWidth={1.5} />
                <h3 className="font-serif text-lg md:text-xl mb-3 md:mb-4 text-foreground">{t.visit.hours}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                  {get("visit.weekdays")}<br />{get("visit.weekend")}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="p-6 md:p-10">
                <div className="w-8 h-px bg-olive mb-6 md:mb-8" />
                <Mail className="w-5 h-5 mb-4 md:mb-5 text-olive" strokeWidth={1.5} />
                <h3 className="font-serif text-lg md:text-xl mb-3 md:mb-4 text-foreground">{t.visit.contact}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                  {get("visit.email")}<br />{get("visit.phone")}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 md:py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 md:gap-10 pb-8 md:pb-10 border-b border-background/10">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-1.5 text-olive">Urla's</h2>
              <p className="font-sans text-background/50 text-xs md:text-sm tracking-wide">{get("footer.tagline")}</p>
            </div>
            <div className="flex items-center gap-5">
              <a
                data-testid="footer-instagram"
                href={`https://www.instagram.com/${instagramHandle}/`}
                target="_blank" rel="noopener noreferrer"
                className="text-background/50 hover:text-olive transition-colors" aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                data-testid="footer-phone"
                href={`tel:${get("visit.phone").replace(/\s/g, "")}`}
                className="text-background/50 hover:text-olive transition-colors" aria-label="Phone"
              >
                <Phone className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          <div className="pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="font-sans text-background/30 text-xs tracking-[0.15em] uppercase">
              © {new Date().getFullYear()} Urla's Coffee Shop. {t.footer.rights}
            </p>
            <Link href="/menu" className="text-[11px] tracking-[0.15em] uppercase text-background/30 font-sans hover:text-olive transition-colors">
              {t.nav.menu}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
