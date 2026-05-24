import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, MapPin, Clock, Mail, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const MenuPlaceholder = () => (
  <div className="w-full aspect-[4/3] bg-muted/30 border border-muted flex items-center justify-center relative overflow-hidden mb-4 group-hover:border-primary/50 transition-colors duration-500">
    <div className="absolute inset-0 placeholder-pattern opacity-30" />
    <span className="font-serif italic text-sm text-muted-foreground z-10 tracking-wide">Add photo</span>
  </div>
);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 pointer-events-none noise-overlay z-50" />

      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          scrolled ? "bg-background/95 backdrop-blur-md py-4 border-b border-border/50 shadow-sm" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => smoothScroll(e, "hero")}
            className={`font-serif text-3xl font-bold tracking-tighter ${scrolled ? "text-primary" : "text-[#FAF7F2]"}`}
          >
            Urla's
          </a>
          <div className={`hidden md:flex items-center gap-8 font-sans text-xs tracking-[0.2em] uppercase ${scrolled ? "text-foreground" : "text-[#FAF7F2]"}`}>
            <a href="#about" onClick={(e) => smoothScroll(e, "about")} className="hover:text-primary transition-colors">
              About
            </a>
            <a href="#menu" onClick={(e) => smoothScroll(e, "menu")} className="hover:text-primary transition-colors">
              Menu
            </a>
            <a href="#visit" onClick={(e) => smoothScroll(e, "visit")} className="hover:text-primary transition-colors">
              Visit Us
            </a>
          </div>
          <button className={`px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${scrolled ? "bg-foreground text-background hover:bg-primary" : "bg-[#FAF7F2] text-foreground hover:bg-primary hover:text-background"}`}>
            Order Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="Urla's Coffee Shop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center text-[#FAF7F2] px-6 max-w-4xl mt-20"
        >
          <motion.h1 variants={fadeInUp} className="font-serif text-7xl md:text-8xl lg:text-9xl mb-8 tracking-tight drop-shadow-lg">
            Urla's
          </motion.h1>
          <motion.p variants={fadeInUp} className="font-sans text-lg md:text-xl font-light tracking-[0.05em] max-w-2xl mx-auto opacity-90 drop-shadow-md">
            Unpretentious but carefully crafted. Like the perfect espresso pulled just right.
          </motion.p>
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl md:text-6xl font-serif mb-10 text-foreground">The Craft of Coffee</h2>
            <div className="font-sans text-lg leading-relaxed text-muted-foreground space-y-8">
              <p>
                We believe that every cup of coffee tells a story. At Urla's, that story begins with 
                intention. It's in the way we source our beans, the precision of our grind, and the 
                care our baristas pour into every cup.
              </p>
              <p>
                Our shop is designed to be a haven. A place where you can slow down, breathe, and 
                enjoy a moment of quiet craft in a loud world. We are more than a café; we are a 
                community built around the shared love of a perfect roast.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="relative aspect-[4/5] w-full"
          >
            <img
              src="/about.png"
              alt="Barista pouring latte art"
              className="w-full h-full object-cover rounded-sm shadow-xl"
            />
            <div className="absolute -inset-4 border border-primary/20 -z-10 rounded-sm" />
          </motion.div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-32 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-serif mb-6 text-foreground">Our Offerings</h2>
            <p className="font-sans text-muted-foreground tracking-[0.2em] uppercase text-xs">
              Carefully Selected, Expertly Brewed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
            {/* Category: Espresso-Based */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
              <h3 className="text-3xl font-serif mb-10 text-primary border-b border-border/50 pb-4">Espresso-Based</h3>
              <div className="space-y-12">
                {[
                  { name: "Espresso", desc: "A double shot of our signature house blend", price: "$3.50" },
                  { name: "Macchiato", desc: "Espresso marked with a dollop of steamed milk", price: "$4.00" },
                  { name: "Cortado", desc: "Equal parts espresso and warm milk", price: "$4.25" },
                  { name: "Cappuccino", desc: "Espresso with heavily aerated milk", price: "$4.50" },
                  { name: "Latte", desc: "Espresso with lightly aerated milk", price: "$5.00" },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="group cursor-pointer">
                    <MenuPlaceholder />
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-serif text-2xl group-hover:text-primary transition-colors">{item.name}</h4>
                      <span className="font-sans text-sm tracking-widest text-muted-foreground">{item.price}</span>
                    </div>
                    <p className="font-sans text-muted-foreground/80 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Category: Cold Brews */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
              <h3 className="text-3xl font-serif mb-10 text-primary border-b border-border/50 pb-4">Cold Brews</h3>
              <div className="space-y-12">
                {[
                  { name: "House Cold Brew", desc: "Slow-steeped for 18 hours, rich and smooth", price: "$4.50" },
                  { name: "Nitro Cold Brew", desc: "Infused with nitrogen for a creamy texture", price: "$5.50" },
                  { name: "Iced Latte", desc: "Espresso and milk over ice", price: "$5.00" },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="group cursor-pointer">
                    <MenuPlaceholder />
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-serif text-2xl group-hover:text-primary transition-colors">{item.name}</h4>
                      <span className="font-sans text-sm tracking-widest text-muted-foreground">{item.price}</span>
                    </div>
                    <p className="font-sans text-muted-foreground/80 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Category: Filter Coffee */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
              <h3 className="text-3xl font-serif mb-10 text-primary border-b border-border/50 pb-4">Filter Coffee</h3>
              <div className="space-y-12">
                {[
                  { name: "Pour Over", desc: "Single-origin rotating selection", price: "$5.00" },
                  { name: "Batch Brew", desc: "Our daily drip coffee", price: "$3.00" },
                  { name: "Chemex", desc: "Clean and bright extraction for two", price: "$8.00" },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="group cursor-pointer">
                    <MenuPlaceholder />
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-serif text-2xl group-hover:text-primary transition-colors">{item.name}</h4>
                      <span className="font-sans text-sm tracking-widest text-muted-foreground">{item.price}</span>
                    </div>
                    <p className="font-sans text-muted-foreground/80 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Category: Hot Drinks */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
              <h3 className="text-3xl font-serif mb-10 text-primary border-b border-border/50 pb-4">Hot Drinks</h3>
              <div className="space-y-12">
                {[
                  { name: "Matcha Latte", desc: "Ceremonial grade matcha with steamed milk", price: "$5.50" },
                  { name: "Chai Latte", desc: "Spiced black tea blend with steamed milk", price: "$5.00" },
                  { name: "Hot Chocolate", desc: "Rich dark chocolate melted into steamed milk", price: "$4.50" },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="group cursor-pointer">
                    <MenuPlaceholder />
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-serif text-2xl group-hover:text-primary transition-colors">{item.name}</h4>
                      <span className="font-sans text-sm tracking-widest text-muted-foreground">{item.price}</span>
                    </div>
                    <p className="font-sans text-muted-foreground/80 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Category: Pastries & Food */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="md:col-span-2 max-w-2xl mx-auto w-full">
              <h3 className="text-3xl font-serif mb-10 text-primary border-b border-border/50 pb-4 text-center">Pastries & Food</h3>
              <div className="space-y-12">
                {[
                  { name: "Butter Croissant", desc: "Flaky, buttery, baked fresh daily", price: "$4.00" },
                  { name: "Almond Croissant", desc: "Twice baked with almond frangipane", price: "$5.00" },
                  { name: "Avocado Toast", desc: "Sourdough, smashed avocado, chili flakes, olive oil", price: "$9.00" },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="group cursor-pointer">
                    <MenuPlaceholder />
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-serif text-2xl group-hover:text-primary transition-colors">{item.name}</h4>
                      <span className="font-sans text-sm tracking-widest text-muted-foreground">{item.price}</span>
                    </div>
                    <p className="font-sans text-muted-foreground/80 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-2 px-2 max-w-[2000px] mx-auto bg-background">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-auto md:h-[700px]">
          <div className="relative h-[500px] md:h-full group overflow-hidden">
            <img src="/gallery1.png" alt="Coffee beans" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="relative h-[500px] md:h-full group overflow-hidden">
            <img src="/gallery2.png" alt="Cappuccino" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="relative h-[500px] md:h-full group overflow-hidden">
            <img src="/gallery3.png" alt="Cafe interior" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section id="visit" className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Coffee className="w-10 h-10 mx-auto mb-10 text-primary" strokeWidth={1} />
          <h2 className="text-5xl md:text-6xl font-serif mb-20 text-foreground">Find Your Corner</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center border-y border-border/50 py-20 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-border/50 hidden md:block" />
            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-border/50 hidden md:block" />
            
            <div className="space-y-6">
              <MapPin className="w-6 h-6 mx-auto text-muted-foreground/70" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl">Location</h3>
              <p className="font-sans text-muted-foreground leading-relaxed">
                123 Coffee Lane<br />
                Urla District
              </p>
            </div>
            <div className="space-y-6">
              <Clock className="w-6 h-6 mx-auto text-muted-foreground/70" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl">Hours</h3>
              <p className="font-sans text-muted-foreground leading-relaxed">
                Mon–Fri <span className="text-foreground">7am–9pm</span><br />
                Sat–Sun <span className="text-foreground">8am–10pm</span>
              </p>
            </div>
            <div className="space-y-6">
              <Mail className="w-6 h-6 mx-auto text-muted-foreground/70" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl">Contact</h3>
              <p className="font-sans text-muted-foreground leading-relaxed">
                hello@urlas.com<br />
                (555) 123-4567
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-[#FAF7F2] py-20 px-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-4xl font-bold mb-3 text-primary">Urla's</h2>
            <p className="font-sans text-[#FAF7F2]/60 text-sm tracking-wide">Unpretentious but carefully crafted.</p>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors p-2 border border-[#FAF7F2]/20 rounded-full hover:border-primary">
              <Instagram className="w-5 h-5" strokeWidth={1.5} />
            </a>
            <a href="#" className="hover:text-primary transition-colors p-2 border border-[#FAF7F2]/20 rounded-full hover:border-primary">
              <Twitter className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>
          
          <p className="font-sans text-[#FAF7F2]/40 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} Urla's Coffee Shop.
          </p>
        </div>
      </footer>
    </div>
  );
}
