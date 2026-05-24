import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Instagram } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, duration: 0.6 } },
};

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full aspect-square bg-muted/40 border border-border flex flex-col items-center justify-center relative overflow-hidden group-hover:border-olive/50 transition-colors duration-500">
      <div className="absolute inset-0 placeholder-pattern opacity-60" />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-6 h-px bg-olive/40" />
        <span className="font-sans italic text-[10px] text-muted-foreground/60 tracking-widest uppercase">{label}</span>
        <div className="w-6 h-px bg-olive/40" />
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
      viewport={{ once: true, margin: "-30px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-7 md:mb-10">
        <div className="w-5 h-px bg-olive" />
        <h3 className="font-sans text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-olive font-medium">{title}</h3>
        <div className="flex-1 h-px bg-border/50" />
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="group cursor-default"
            data-testid={`menu-item-${item.key}`}
          >
            <PhotoPlaceholder label={addPhotoLabel} />
            <div className="mt-3 md:mt-4 space-y-1">
              <h4 className="font-serif text-base md:text-lg leading-tight text-foreground group-hover:text-olive transition-colors duration-300">
                {item.name}
              </h4>
              <p className="font-sans text-[11px] md:text-xs text-muted-foreground leading-relaxed">
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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 py-3 md:py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <Link
            data-testid="menu-back-home"
            href="/"
            className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline">{t.menu.backHome}</span>
          </Link>

          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-foreground">
            Urla's
          </Link>

          <button
            data-testid="lang-toggle-menu"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="text-[11px] tracking-[0.16em] uppercase font-sans font-medium px-2.5 py-1.5 border border-border text-foreground hover:border-olive hover:text-olive transition-all duration-300"
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>
      </nav>

      {/* Hero Bar */}
      <div className="pt-20 md:pt-24 pb-10 md:pb-16 px-4 sm:px-6 md:px-8 green-stripe">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={fadeUp} className="font-sans text-[11px] tracking-[0.28em] uppercase text-olive mb-3 md:mb-4">
              Urla's
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-3 md:mb-4">
              {t.menu.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-xs md:text-sm tracking-[0.18em] uppercase text-muted-foreground">
              {t.menu.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 space-y-16 md:space-y-24">
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
      <footer className="bg-foreground text-background py-10 md:py-14 px-4 sm:px-6 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 md:gap-8">
          <div>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-olive mb-1">Urla's</h2>
            <p className="font-sans text-background/40 text-xs tracking-wide">{t.footer.tagline}</p>
          </div>
          <a
            href="https://www.instagram.com/urlascoffee/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-background/40 hover:text-olive transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" strokeWidth={1.5} />
          </a>
          <p className="font-sans text-background/25 text-xs tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Urla's
          </p>
        </div>
      </footer>
    </div>
  );
}
