import { createContext, useContext, useState } from "react";

type Lang = "tr" | "en";

interface Translations {
  nav: {
    about: string;
    menu: string;
    visit: string;
    order: string;
  };
  hero: {
    tagline: string;
    discover: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
  };
  gallery: {
    title: string;
    subtitle: string;
  };
  visit: {
    title: string;
    location: string;
    hours: string;
    contact: string;
    address: string;
    weekdays: string;
    weekend: string;
    email: string;
    phone: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
  menu: {
    title: string;
    subtitle: string;
    backHome: string;
    addPhoto: string;
    categories: {
      espresso: string;
      cold: string;
      filter: string;
      hot: string;
      pastries: string;
    };
    items: {
      [key: string]: { name: string; desc: string };
    };
  };
}

const tr: Translations = {
  nav: {
    about: "Hakkımızda",
    menu: "Menü",
    visit: "Bizi Bul",
    order: "Sipariş Ver",
  },
  hero: {
    tagline: "Sıradan değil, özenle hazırlanmış. Tıpkı doğru çekilen mükemmel bir espresso gibi.",
    discover: "Keşfet",
  },
  about: {
    title: "Kahvenin Sanatı",
    p1: "Her fincan kahvenin bir hikayesi olduğuna inanıyoruz. Urla's'ta bu hikaye niyetle başlar. Çekirdeklerimizi seçme biçimimizde, öğütme hassasiyetimizde ve baristalarımızın her fincana döktüğü özenle kendini gösterir.",
    p2: "Dükkanımız bir sığınak olarak tasarlandı. Yavaşlayabileceğiniz, nefes alabileceğiniz ve gürültülü bir dünyada sessiz bir zanaat anının tadını çıkarabileceğiniz bir yer. Biz yalnızca bir kafe değil; mükemmel kavurmanın etrafında kurulmuş bir topluluğuz.",
  },
  gallery: {
    title: "Atmosfer",
    subtitle: "Urla's'ı Keşfedin",
  },
  visit: {
    title: "Köşenizi Bulun",
    location: "Konum",
    hours: "Çalışma Saatleri",
    contact: "İletişim",
    address: "Kahve Sokak 123\nUrla, İzmir",
    weekdays: "Pzt–Cum  07:00–21:00",
    weekend: "Cmt–Paz  08:00–22:00",
    email: "hello@urlas.com",
    phone: "+90 232 123 45 67",
  },
  footer: {
    tagline: "Özenle hazırlanmış.",
    rights: "Tüm hakları saklıdır.",
  },
  menu: {
    title: "Menümüz",
    subtitle: "Özenle Seçilmiş, Ustaca Demlenmiş",
    backHome: "Ana Sayfa",
    addPhoto: "Fotoğraf Ekle",
    categories: {
      espresso: "Espresso Bazlı",
      cold: "Soğuk İçecekler",
      filter: "Filtre Kahve",
      hot: "Sıcak İçecekler",
      pastries: "Pastane & Yiyecek",
    },
    items: {
      espresso: { name: "Espresso", desc: "İmza harmanlamamızın çift şotu" },
      macchiato: { name: "Macchiato", desc: "Bir miktar buharda ısıtılmış sütle işaretlenmiş espresso" },
      cortado: { name: "Cortado", desc: "Eşit oranlarda espresso ve ılık süt" },
      cappuccino: { name: "Cappuccino", desc: "Yoğun havalandırılmış sütlü espresso" },
      latte: { name: "Latte", desc: "Hafifçe havalandırılmış sütlü espresso" },
      coldBrew: { name: "Ev Yapımı Cold Brew", desc: "18 saat yavaş demlenen, zengin ve yumuşak içim" },
      nitroCold: { name: "Nitro Cold Brew", desc: "Kremamsı bir doku için azotla zenginleştirilmiş" },
      icedLatte: { name: "Buzlu Latte", desc: "Buz üzerine espresso ve süt" },
      pourOver: { name: "Pour Over", desc: "Tek kökenli döner seçim" },
      batchBrew: { name: "Günlük Demleme", desc: "Günlük damlatma kahvemiz" },
      chemex: { name: "Chemex", desc: "İki kişilik temiz ve parlak ekstraksiyon" },
      matcha: { name: "Matcha Latte", desc: "Seremoniyel kalitede matcha ve buharda ısıtılmış süt" },
      chai: { name: "Chai Latte", desc: "Baharatlı siyah çay karışımı ve buharda ısıtılmış süt" },
      hotChocolate: { name: "Sıcak Çikolata", desc: "Buharda ısıtılmış süte eritilmiş zengin bitter çikolata" },
      butterCroissant: { name: "Tereyağlı Kruvasan", desc: "Pul pul, tereyağlı, her gün taze pişirilmiş" },
      almondCroissant: { name: "Bademli Kruvasan", desc: "Badem franjipanesine iki kez batırılmış" },
      avocadoToast: { name: "Avokadolu Tost", desc: "Ekşi maya ekmeği, ezilmiş avokado, pul biber, zeytinyağı" },
    },
  },
};

const en: Translations = {
  nav: {
    about: "About",
    menu: "Menu",
    visit: "Visit Us",
    order: "Order Now",
  },
  hero: {
    tagline: "Unpretentious but carefully crafted. Like the perfect espresso pulled just right.",
    discover: "Discover",
  },
  about: {
    title: "The Craft of Coffee",
    p1: "We believe that every cup of coffee tells a story. At Urla's, that story begins with intention. It's in the way we source our beans, the precision of our grind, and the care our baristas pour into every cup.",
    p2: "Our shop is designed to be a haven. A place where you can slow down, breathe, and enjoy a moment of quiet craft in a loud world. We are more than a café; we are a community built around the shared love of a perfect roast.",
  },
  gallery: {
    title: "Atmosphere",
    subtitle: "Discover Urla's",
  },
  visit: {
    title: "Find Your Corner",
    location: "Location",
    hours: "Opening Hours",
    contact: "Contact",
    address: "123 Coffee Lane\nUrla District",
    weekdays: "Mon–Fri  7:00–21:00",
    weekend: "Sat–Sun  8:00–22:00",
    email: "hello@urlas.com",
    phone: "+90 232 123 45 67",
  },
  footer: {
    tagline: "Carefully crafted.",
    rights: "All rights reserved.",
  },
  menu: {
    title: "Our Menu",
    subtitle: "Carefully Selected, Expertly Brewed",
    backHome: "Home",
    addPhoto: "Add Photo",
    categories: {
      espresso: "Espresso-Based",
      cold: "Cold Drinks",
      filter: "Filter Coffee",
      hot: "Hot Drinks",
      pastries: "Pastries & Food",
    },
    items: {
      espresso: { name: "Espresso", desc: "A double shot of our signature house blend" },
      macchiato: { name: "Macchiato", desc: "Espresso marked with a dollop of steamed milk" },
      cortado: { name: "Cortado", desc: "Equal parts espresso and warm milk" },
      cappuccino: { name: "Cappuccino", desc: "Espresso with heavily aerated milk" },
      latte: { name: "Latte", desc: "Espresso with lightly aerated milk" },
      coldBrew: { name: "House Cold Brew", desc: "Slow-steeped for 18 hours, rich and smooth" },
      nitroCold: { name: "Nitro Cold Brew", desc: "Infused with nitrogen for a creamy texture" },
      icedLatte: { name: "Iced Latte", desc: "Espresso and milk over ice" },
      pourOver: { name: "Pour Over", desc: "Single-origin rotating selection" },
      batchBrew: { name: "Batch Brew", desc: "Our daily drip coffee" },
      chemex: { name: "Chemex", desc: "Clean and bright extraction for two" },
      matcha: { name: "Matcha Latte", desc: "Ceremonial grade matcha with steamed milk" },
      chai: { name: "Chai Latte", desc: "Spiced black tea blend with steamed milk" },
      hotChocolate: { name: "Hot Chocolate", desc: "Rich dark chocolate melted into steamed milk" },
      butterCroissant: { name: "Butter Croissant", desc: "Flaky, buttery, baked fresh daily" },
      almondCroissant: { name: "Almond Croissant", desc: "Twice baked with almond frangipane" },
      avocadoToast: { name: "Avocado Toast", desc: "Sourdough, smashed avocado, chili flakes, olive oil" },
    },
  },
};

const allTranslations: Record<Lang, Translations> = { tr, en };

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "tr",
  setLang: () => {},
  t: tr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("tr");
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: allTranslations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
