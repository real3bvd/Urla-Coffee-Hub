import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

type Lang = "tr" | "en";

export interface ContentRecord {
  [key: string]: { tr: string; en: string };
}

export const DEFAULTS: ContentRecord = {
  "hero.tagline": {
    tr: "Sıradan değil, özenle hazırlanmış. Tıpkı doğru çekilen mükemmel bir espresso gibi.",
    en: "Unpretentious but carefully crafted. Like the perfect espresso pulled just right.",
  },
  "about.title": { tr: "Kahvenin Sanatı", en: "The Craft of Coffee" },
  "about.p1": {
    tr: "Her fincan kahvenin bir hikayesi olduğuna inanıyoruz. Urla's'ta bu hikaye niyetle başlar. Çekirdeklerimizi seçme biçimimizde, öğütme hassasiyetimizde ve baristalarımızın her fincana döktüğü özenle kendini gösterir.",
    en: "We believe that every cup of coffee tells a story. At Urla's, that story begins with intention. It's in the way we source our beans, the precision of our grind, and the care our baristas pour into every cup.",
  },
  "about.p2": {
    tr: "Dükkanımız bir sığınak olarak tasarlandı. Yavaşlayabileceğiniz, nefes alabileceğiniz ve gürültülü bir dünyada sessiz bir zanaat anının tadını çıkarabileceğiniz bir yer. Biz yalnızca bir kafe değil; mükemmel kahvenin etrafında kurulmuş bir topluluğuz.",
    en: "Our shop is designed to be a haven. A place where you can slow down, breathe, and enjoy a moment of quiet craft in a loud world. We are more than a café; we are a community built around the shared love of a perfect roast.",
  },
  "visit.address": {
    tr: "Merkez Mah. Ayazma Cad.\nIlgın Sokak NEF11 C Blok\n34406 Kağıthane / İstanbul",
    en: "Merkez Mah. Ayazma Cad.\nIlgın Sokak NEF11 C Blok\n34406 Kağıthane / Istanbul",
  },
  "visit.weekdays": { tr: "Pzt–Cum  07:00–21:00", en: "Mon–Fri  7:00–21:00" },
  "visit.weekend": { tr: "Cmt–Paz  08:00–22:00", en: "Sat–Sun  8:00–22:00" },
  "visit.email": { tr: "hello@urlas.com", en: "hello@urlas.com" },
  "visit.phone": { tr: "+90 534 696 20 33", en: "+90 534 696 20 33" },
  "contact.instagram": { tr: "urlascoffee", en: "urlascoffee" },
  "footer.tagline": { tr: "Özenle hazırlanmış.", en: "Carefully crafted." },
};

export function useSiteContent(lang: Lang) {
  const [content, setContent] = useState<ContentRecord>(DEFAULTS);

  useEffect(() => {
    fetch(apiUrl("/api/content"))
      .then((r) => r.json())
      .then((data: ContentRecord) => {
        if (data && typeof data === "object") {
          setContent({ ...DEFAULTS, ...data });
        }
      })
      .catch(() => {});
  }, []);

  function get(key: string): string {
    return content[key]?.[lang] ?? DEFAULTS[key]?.[lang] ?? "";
  }

  return { content, get };
}
