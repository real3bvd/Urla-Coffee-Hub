import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Instagram, Image as ImageIcon } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useMenuData } from "@/hooks/useMenuData";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, duration: 0.6 } },
};

export default function Menu() {
  const { lang, setLang, t } = useLang();
  const { menuData } = useMenuData();

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
        {menuData.categories.map((cat) => {
          const catItems = menuData.items.filter(i => i.categoryId === cat.id);
          return (
            <motion.div
              key={cat.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-7 md:mb-10">
                <div className="w-5 h-px bg-olive" />
                <h3 className="font-sans text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-olive font-medium">
                  {lang === "tr" ? cat.nameTr : cat.nameEn}
                </h3>
                <div className="flex-1 h-px bg-border/50" />
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {catItems.map((item) => (
                  <motion.div key={item.id} variants={fadeUp} className="group cursor-default">
                    <div className="w-full aspect-square overflow-hidden bg-muted/40 border border-border group-hover:border-olive/50 transition-colors duration-500 relative">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={lang === "tr" ? item.nameTr : item.nameEn}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 placeholder-pattern opacity-60 flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="w-6 h-6 text-muted-foreground/30" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 md:mt-4 space-y-1">
                      <h4 className="font-serif text-base md:text-lg leading-tight text-foreground group-hover:text-olive transition-colors duration-300">
                        {lang === "tr" ? item.nameTr : item.nameEn}
                      </h4>
                      <p className="font-sans text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                        {lang === "tr" ? item.descTr : item.descEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-10 md:py-14 px-4 sm:px-6 md:px-8 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 md:gap-8">
          <div>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-olive mb-1">Urla's</h2>
            <p className="font-sans text-background/40 text-xs tracking-wide">{t.footer.tagline}</p>
          </div>
          <a href="https://www.instagram.com/urlascoffee/" target="_blank" rel="noopener noreferrer" className="text-background/40 hover:text-olive transition-colors" aria-label="Instagram">
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
