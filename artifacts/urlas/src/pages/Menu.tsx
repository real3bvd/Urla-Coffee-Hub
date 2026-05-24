import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Instagram, Twitter } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, duration: 0.7 } },
};

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full aspect-square bg-muted/40 border border-border flex flex-col items-center justify-center relative overflow-hidden group-hover:border-sage/50 transition-colors duration-500">
      <div className="absolute inset-0 placeholder-pattern opacity-60" />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-8 h-px bg-sage/40" />
        <span className="font-sans italic text-[11px] text-muted-foreground/60 tracking-widest uppercase">{label}</span>
        <div className="w-8 h-px bg-sage/40" />
      </div>
    </div>
  );
}

interface MenuItem {
  key: string;
  name: string;
  desc: string;
}

function MenuCategory({ title, items, addPhotoLabel }: { title: string; items: MenuItem[]; addPhotoLabel: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp} className="flex items-center gap-4 mb-10">
        <div className="w-6 h-px bg-sage" />
        <h3 className="font-sans text-[11px] tracking-[0.28em] uppercase text-sage font-medium">{title}</h3>
        <div className="flex-1 h-px bg-border/50" />
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="group cursor-default"
            data-testid={`menu-item-${item.key}`}
          >
            <PhotoPlaceholder label={addPhotoLabel} />
            <div className="mt-4 space-y-1.5">
              <h4 className="font-serif text-lg leading-tight text-foreground group-hover:text-sage transition-colors duration-300">
                {item.name}
              </h4>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== "undefined") {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true, once: true });
  }

  const { categories, items, addPhoto: addPhotoLabel } = t.menu;

  const menuSections = [
    {
      title: categories.espresso,
      items: [
        { key: "espresso", ...items.espresso },
        { key: "macchiato", ...items.macchiato },
        { key: "cortado", ...items.cortado },
        { key: "cappuccino", ...items.cappuccino },
        { key: "latte", ...items.latte },
      ],
    },
    {
      title: categories.cold,
      items: [
        { key: "coldBrew", ...items.coldBrew },
        { key: "nitroCold", ...items.nitroCold },
        { key: "icedLatte", ...items.icedLatte },
      ],
    },
    {
      title: categories.filter,
      items: [
        { key: "pourOver", ...items.pourOver },
        { key: "batchBrew", ...items.batchBrew },
        { key: "chemex", ...items.chemex },
      ],
    },
    {
      title: categories.hot,
      items: [
        { key: "matcha", ...items.matcha },
        { key: "chai", ...items.chai },
        { key: "hotChocolate", ...items.hotChocolate },
      ],
    },
    {
      title: categories.pastries,
      items: [
        { key: "butterCroissant", ...items.butterCroissant },
        { key: "almondCroissant", ...items.almondCroissant },
        { key: "avocadoToast", ...items.avocadoToast },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="noise-overlay" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 py-4">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <Link
            data-testid="menu-back-home"
            href="/"
            className="flex items-center gap-2.5 text-[11px] tracking-[0.18em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            {t.menu.backHome}
          </Link>

          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-foreground">
            Urla's
          </Link>

          <button
            data-testid="lang-toggle-menu"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="text-[11px] tracking-[0.16em] uppercase font-sans font-medium px-3 py-1.5 border border-border text-foreground hover:border-sage hover:text-sage transition-all duration-300"
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>
      </nav>

      {/* Hero Bar */}
      <div className="pt-24 pb-16 px-8 green-stripe">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-[11px] tracking-[0.28em] uppercase text-sage mb-4">
              Urla's
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-7xl text-foreground mb-4">
              {t.menu.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-sm tracking-[0.18em] uppercase text-muted-foreground">
              {t.menu.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-6xl mx-auto px-8 py-20 space-y-24">
        {menuSections.map((section, i) => (
          <MenuCategory
            key={i}
            title={section.title}
            items={section.items}
            addPhotoLabel={addPhotoLabel}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-14 px-8 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-1">Urla's</h2>
            <p className="font-sans text-background/40 text-xs tracking-wide">{t.footer.tagline}</p>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="text-background/40 hover:text-sage transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a href="#" className="text-background/40 hover:text-sage transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>
          <p className="font-sans text-background/25 text-xs tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Urla's
          </p>
        </div>
      </footer>
    </div>
  );
}
