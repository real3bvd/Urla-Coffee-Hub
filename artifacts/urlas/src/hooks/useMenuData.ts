import { useEffect, useState } from "react";

export interface ApiMenuCategory {
  id: number;
  nameTr: string;
  nameEn: string;
  sortOrder: number;
}

export interface ApiMenuItem {
  id: number;
  categoryId: number;
  nameTr: string;
  nameEn: string;
  descTr: string;
  descEn: string;
  photoUrl: string | null;
  sortOrder: number;
}

export interface MenuData {
  categories: ApiMenuCategory[];
  items: ApiMenuItem[];
}

const DEFAULT_MENU: MenuData = {
  categories: [
    { id: -1, nameTr: "Espresso Bazlı", nameEn: "Espresso-Based", sortOrder: 0 },
    { id: -2, nameTr: "Soğuk İçecekler", nameEn: "Cold Drinks", sortOrder: 1 },
    { id: -3, nameTr: "Filtre Kahve", nameEn: "Filter Coffee", sortOrder: 2 },
    { id: -4, nameTr: "Sıcak İçecekler", nameEn: "Hot Drinks", sortOrder: 3 },
    { id: -5, nameTr: "Pastane & Yiyecek", nameEn: "Pastries & Food", sortOrder: 4 },
  ],
  items: [
    { id: -1, categoryId: -1, nameTr: "Espresso", nameEn: "Espresso", descTr: "İmza harmanlamamızın çift şotu", descEn: "A double shot of our signature house blend", photoUrl: null, sortOrder: 0 },
    { id: -2, categoryId: -1, nameTr: "Macchiato", nameEn: "Macchiato", descTr: "Bir miktar buharda ısıtılmış sütle işaretlenmiş espresso", descEn: "Espresso marked with a dollop of steamed milk", photoUrl: null, sortOrder: 1 },
    { id: -3, categoryId: -1, nameTr: "Cortado", nameEn: "Cortado", descTr: "Eşit oranlarda espresso ve ılık süt", descEn: "Equal parts espresso and warm milk", photoUrl: null, sortOrder: 2 },
    { id: -4, categoryId: -1, nameTr: "Cappuccino", nameEn: "Cappuccino", descTr: "Yoğun havalandırılmış sütlü espresso", descEn: "Espresso with heavily aerated milk", photoUrl: null, sortOrder: 3 },
    { id: -5, categoryId: -1, nameTr: "Latte", nameEn: "Latte", descTr: "Hafifçe havalandırılmış sütlü espresso", descEn: "Espresso with lightly aerated milk", photoUrl: null, sortOrder: 4 },
    { id: -6, categoryId: -2, nameTr: "Ev Yapımı Cold Brew", nameEn: "House Cold Brew", descTr: "18 saat yavaş demlenen, zengin ve yumuşak içim", descEn: "Slow-steeped for 18 hours, rich and smooth", photoUrl: null, sortOrder: 0 },
    { id: -7, categoryId: -2, nameTr: "Nitro Cold Brew", nameEn: "Nitro Cold Brew", descTr: "Kremamsı bir doku için azotla zenginleştirilmiş", descEn: "Infused with nitrogen for a creamy texture", photoUrl: null, sortOrder: 1 },
    { id: -8, categoryId: -2, nameTr: "Buzlu Latte", nameEn: "Iced Latte", descTr: "Buz üzerine espresso ve süt", descEn: "Espresso and milk over ice", photoUrl: null, sortOrder: 2 },
    { id: -9, categoryId: -3, nameTr: "Pour Over", nameEn: "Pour Over", descTr: "Tek kökenli döner seçim", descEn: "Single-origin rotating selection", photoUrl: null, sortOrder: 0 },
    { id: -10, categoryId: -3, nameTr: "Günlük Demleme", nameEn: "Batch Brew", descTr: "Günlük damlatma kahvemiz", descEn: "Our daily drip coffee", photoUrl: null, sortOrder: 1 },
    { id: -11, categoryId: -3, nameTr: "Chemex", nameEn: "Chemex", descTr: "İki kişilik temiz ve parlak ekstraksiyon", descEn: "Clean and bright extraction for two", photoUrl: null, sortOrder: 2 },
    { id: -12, categoryId: -4, nameTr: "Matcha Latte", nameEn: "Matcha Latte", descTr: "Seremoniyel kalitede matcha ve buharda ısıtılmış süt", descEn: "Ceremonial grade matcha with steamed milk", photoUrl: null, sortOrder: 0 },
    { id: -13, categoryId: -4, nameTr: "Chai Latte", nameEn: "Chai Latte", descTr: "Baharatlı siyah çay karışımı ve buharda ısıtılmış süt", descEn: "Spiced black tea blend with steamed milk", photoUrl: null, sortOrder: 1 },
    { id: -14, categoryId: -4, nameTr: "Sıcak Çikolata", nameEn: "Hot Chocolate", descTr: "Buharda ısıtılmış süte eritilmiş zengin bitter çikolata", descEn: "Rich dark chocolate melted into steamed milk", photoUrl: null, sortOrder: 2 },
    { id: -15, categoryId: -5, nameTr: "Tereyağlı Kruvasan", nameEn: "Butter Croissant", descTr: "Pul pul, tereyağlı, her gün taze pişirilmiş", descEn: "Flaky, buttery, baked fresh daily", photoUrl: null, sortOrder: 0 },
    { id: -16, categoryId: -5, nameTr: "Bademli Kruvasan", nameEn: "Almond Croissant", descTr: "Badem franjipanesine iki kez batırılmış", descEn: "Twice baked with almond frangipane", photoUrl: null, sortOrder: 1 },
    { id: -17, categoryId: -5, nameTr: "Avokadolu Tost", nameEn: "Avocado Toast", descTr: "Ekşi maya ekmeği, ezilmiş avokado, pul biber, zeytinyağı", descEn: "Sourdough, smashed avocado, chili flakes, olive oil", photoUrl: null, sortOrder: 2 },
  ],
};

export function useMenuData() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: MenuData) => {
        if (data?.categories?.length > 0) {
          setMenuData(data);
        } else {
          setMenuData(DEFAULT_MENU);
        }
      })
      .catch(() => setMenuData(DEFAULT_MENU))
      .finally(() => setLoading(false));
  }, []);

  return { menuData: menuData ?? DEFAULT_MENU, loading };
}

export { DEFAULT_MENU };
