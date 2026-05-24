import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock, Mail, Instagram, Phone, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { useLang } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, duration: 0.9 } },
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
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 items-center">
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

export default function Home() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <div className="noise-overlay" />
      <SideNav active={activeSection} />

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/60 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <button
            data-testid="nav-logo"
            onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
            className={`font-serif text-2xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}
          >
            Urla's
          </button>

          <div className={`hidden md:flex items-center gap-10 text-[11px] tracking-[0.18em] uppercase font-sans font-medium transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}>
            <button
              data-testid="nav-about"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-olive transition-colors"
            >
              {t.nav.about}
            </button>
            <Link
              data-testid="nav-menu"
              href="/menu"
              className="hover:text-olive transition-colors"
            >
              {t.nav.menu}
            </Link>
            <button
              data-testid="nav-visit"
              onClick={() => document.getElementById("visit")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-olive transition-colors"
            >
              {t.nav.visit}
            </button>
          </div>

          <button
            data-testid="lang-toggle"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className={`text-[11px] tracking-[0.16em] uppercase font-sans font-medium px-3 py-1.5 border transition-all duration-300 ${
              scrolled
                ? "border-border text-foreground hover:border-olive hover:text-olive"
                : "border-white/50 text-white hover:border-white"
            }`}
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative h-screen w-full flex items-end justify-center overflow-hidden">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/cafe-interior.jpg"
            alt="Urla's Coffee Shop"
            className="w-full h-full object-cover"
          />
          {/* Night shadow effect — heavy dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center text-white px-6 pb-28 max-w-4xl"
        >
          <motion.h1 variants={fadeUp} className="font-serif text-7xl md:text-8xl lg:text-[9rem] mb-8 tracking-tight leading-none">
            Urla's
          </motion.h1>
          <motion.p variants={fadeUp} className="font-sans text-base md:text-lg font-light tracking-wide max-w-xl mx-auto text-white/75 leading-relaxed">
            {t.hero.tagline}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-12">
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
      <section id="about" className="section-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-[11px] tracking-[0.28em] uppercase text-olive mb-5">
                {lang === "tr" ? "Hikayemiz" : "Our Story"}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-5xl md:text-6xl mb-10 leading-tight text-foreground">
                {t.about.title}
              </motion.h2>
              <motion.div variants={stagger} className="space-y-6 text-muted-foreground font-sans text-base leading-[1.85]">
                <motion.p variants={fadeUp}>{t.about.p1}</motion.p>
                <motion.p variants={fadeUp}>{t.about.p2}</motion.p>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-10">
                <Link
                  data-testid="about-menu-link"
                  href="/menu"
                  className="inline-flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase font-sans font-medium text-foreground border-b border-foreground/30 pb-1 hover:border-olive hover:text-olive transition-all duration-300"
                >
                  {t.nav.menu}
                  <span className="text-xs">→</span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="relative"
            >
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src="/about-coffee.jpg"
                  alt={lang === "tr" ? "Espresso fincanları" : "Espresso cups"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-olive/25 pointer-events-none z-[-1]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="green-stripe py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16"
          >
            <motion.p variants={fadeUp} className="font-sans text-[11px] tracking-[0.28em] uppercase text-olive mb-4">
              {t.gallery.subtitle}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-5xl md:text-6xl text-foreground">
              {t.gallery.title}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-12 gap-3"
          >
            <motion.div variants={fadeUp} className="col-span-12 md:col-span-7 h-[480px] overflow-hidden group">
              <img
                src="/gallery-latte.jpg"
                alt={lang === "tr" ? "Latte art" : "Latte art"}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="col-span-12 md:col-span-5 h-[480px] overflow-hidden group">
              <img
                src="/gallery-cake.jpg"
                alt={lang === "tr" ? "Pasta dilimi" : "Cake slice"}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="col-span-12 h-[320px] overflow-hidden group">
              <img
                src="/gallery-mugs.jpg"
                alt={lang === "tr" ? "Kahve kupaları" : "Coffee mugs"}
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Visit Us */}
      <section id="visit" className="section-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-[11px] tracking-[0.28em] uppercase text-olive mb-5">
              {lang === "tr" ? "Adres & Saatler" : "Location & Hours"}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-5xl md:text-6xl mb-20 text-foreground">
              {t.visit.title}
            </motion.h2>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border/60"
            >
              <motion.div variants={fadeUp} className="p-10 md:border-r border-border/60">
                <div className="w-8 h-px bg-olive mb-8" />
                <MapPin className="w-5 h-5 mb-5 text-olive" strokeWidth={1.5} />
                <h3 className="font-serif text-xl mb-4 text-foreground">{t.visit.location}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {t.visit.address}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="p-10 md:border-r border-border/60 border-t md:border-t-0">
                <div className="w-8 h-px bg-olive mb-8" />
                <Clock className="w-5 h-5 mb-5 text-olive" strokeWidth={1.5} />
                <h3 className="font-serif text-xl mb-4 text-foreground">{t.visit.hours}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                  {t.visit.weekdays}<br />
                  {t.visit.weekend}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="p-10 border-t md:border-t-0">
                <div className="w-8 h-px bg-olive mb-8" />
                <Mail className="w-5 h-5 mb-5 text-olive" strokeWidth={1.5} />
                <h3 className="font-serif text-xl mb-4 text-foreground">{t.visit.contact}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                  {t.visit.email}<br />
                  {t.visit.phone}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 pb-10 border-b border-background/10">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2 text-olive">Urla's</h2>
              <p className="font-sans text-background/50 text-sm tracking-wide">{t.footer.tagline}</p>
            </div>
            <div className="flex items-center gap-5">
              <a
                data-testid="footer-instagram"
                href="https://www.instagram.com/urlascoffee/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/50 hover:text-olive transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                data-testid="footer-phone"
                href="tel:+905346962033"
                className="text-background/50 hover:text-olive transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans text-background/30 text-xs tracking-[0.15em] uppercase">
              © {new Date().getFullYear()} Urla's Coffee Shop. {t.footer.rights}
            </p>
            <div className="flex gap-8 text-[11px] tracking-[0.15em] uppercase text-background/30 font-sans">
              <Link href="/menu" className="hover:text-olive transition-colors">
                {t.nav.menu}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
