import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface ContentValue {
  tr: string;
  en: string;
}

export interface MenuCategory {
  id: number;
  nameTr: string;
  nameEn: string;
  sortOrder: number;
  createdAt?: string;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  nameTr: string;
  nameEn: string;
  descTr: string;
  descEn: string;
  photoUrl: string | null;
  sortOrder: number;
  createdAt?: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  altTr: string;
  altEn: string;
  sortOrder: number;
  createdAt?: string;
}

interface LocalData {
  content: Record<string, ContentValue>;
  menu: {
    categories: MenuCategory[];
    items: MenuItem[];
    nextCategoryId: number;
    nextItemId: number;
  };
  gallery: {
    images: GalleryImage[];
    nextImageId: number;
  };
}

const dataDir = path.resolve(process.cwd(), ".local");
const dataFile = path.join(dataDir, "api-data.json");

const defaultCategories: MenuCategory[] = [
  { id: -1, nameTr: "Espresso Bazlı", nameEn: "Espresso-Based", sortOrder: 0 },
  { id: -2, nameTr: "Soğuk İçecekler", nameEn: "Cold Drinks", sortOrder: 1 },
  { id: -3, nameTr: "Filtre Kahve", nameEn: "Filter Coffee", sortOrder: 2 },
  { id: -4, nameTr: "Sıcak İçecekler", nameEn: "Hot Drinks", sortOrder: 3 },
  { id: -5, nameTr: "Pastane & Yiyecek", nameEn: "Pastries & Food", sortOrder: 4 },
];

const defaultItems: MenuItem[] = [
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
];

function createEmptyData(): LocalData {
  return {
    content: {},
    menu: { categories: [], items: [], nextCategoryId: 1, nextItemId: 1 },
    gallery: { images: [], nextImageId: 1 },
  };
}

async function readData(): Promise<LocalData> {
  try {
    return JSON.parse(await readFile(dataFile, "utf8")) as LocalData;
  } catch {
    return createEmptyData();
  }
}

async function writeData(data: LocalData): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`);
}

function ensureMenu(data: LocalData): void {
  if (data.menu.categories.length === 0) {
    data.menu.categories = defaultCategories.map((category) => ({ ...category }));
  }
  if (data.menu.items.length === 0) {
    data.menu.items = defaultItems.map((item) => ({ ...item }));
  }
}

export async function getLocalContent() {
  return (await readData()).content;
}

export async function setLocalContent(key: string, value: ContentValue) {
  const data = await readData();
  data.content[key] = value;
  await writeData(data);
}

export async function getLocalMenu() {
  const data = await readData();
  ensureMenu(data);
  await writeData(data);
  return {
    categories: [...data.menu.categories].sort((a, b) => a.sortOrder - b.sortOrder),
    items: [...data.menu.items].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export async function addLocalCategory(input: Omit<MenuCategory, "id">) {
  const data = await readData();
  ensureMenu(data);
  const category = { ...input, id: data.menu.nextCategoryId++, createdAt: new Date().toISOString() };
  data.menu.categories.push(category);
  await writeData(data);
  return category;
}

export async function updateLocalCategory(id: number, updates: Partial<MenuCategory>) {
  const data = await readData();
  ensureMenu(data);
  data.menu.categories = data.menu.categories.map((category) =>
    category.id === id ? { ...category, ...updates } : category,
  );
  await writeData(data);
  return data.menu.categories.find((category) => category.id === id);
}

export async function deleteLocalCategory(id: number) {
  const data = await readData();
  ensureMenu(data);
  data.menu.categories = data.menu.categories.filter((category) => category.id !== id);
  data.menu.items = data.menu.items.filter((item) => item.categoryId !== id);
  await writeData(data);
}

export async function addLocalItem(input: Omit<MenuItem, "id">) {
  const data = await readData();
  ensureMenu(data);
  const item = { ...input, id: data.menu.nextItemId++, createdAt: new Date().toISOString() };
  data.menu.items.push(item);
  await writeData(data);
  return item;
}

export async function updateLocalItem(id: number, updates: Partial<MenuItem>) {
  const data = await readData();
  ensureMenu(data);
  data.menu.items = data.menu.items.map((item) => (item.id === id ? { ...item, ...updates } : item));
  await writeData(data);
  return data.menu.items.find((item) => item.id === id);
}

export async function deleteLocalItem(id: number) {
  const data = await readData();
  ensureMenu(data);
  data.menu.items = data.menu.items.filter((item) => item.id !== id);
  await writeData(data);
}

export async function getLocalGallery() {
  return (await readData()).gallery.images.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function addLocalGalleryImage(input: Omit<GalleryImage, "id">) {
  const data = await readData();
  const image = { ...input, id: data.gallery.nextImageId++, createdAt: new Date().toISOString() };
  data.gallery.images.push(image);
  await writeData(data);
  return image;
}

export async function updateLocalGalleryImage(id: number, updates: Partial<GalleryImage>) {
  const data = await readData();
  data.gallery.images = data.gallery.images.map((image) => (image.id === id ? { ...image, ...updates } : image));
  await writeData(data);
  return data.gallery.images.find((image) => image.id === id);
}

export async function deleteLocalGalleryImage(id: number) {
  const data = await readData();
  data.gallery.images = data.gallery.images.filter((image) => image.id !== id);
  await writeData(data);
}
