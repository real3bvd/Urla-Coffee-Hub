import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Save, Trash2, Plus, Upload, Eye, EyeOff, Image, X, ChevronDown, ChevronUp } from "lucide-react";
import { DEFAULTS } from "@/hooks/useSiteContent";
import { DEFAULT_MENU } from "@/hooks/useMenuData";
import { apiUrl, mediaUrl } from "@/lib/api";

const API = "/api";

function useAdminSession() {
  const [token, setToken] = useState(() => sessionStorage.getItem("admin_token") ?? "");
  const [authed, setAuthed] = useState(() => Boolean(sessionStorage.getItem("admin_token")));
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  async function login(pw: string) {
    setChecking(true);
    setError("");
    try {
      const r = await fetch(apiUrl(`${API}/auth/login`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.status === 401) { setError("Hatalı şifre / Wrong password"); return; }
      if (!r.ok) { setError("Giris yapilamadi / Login failed"); return; }
      const session = await r.json() as { token: string };
      sessionStorage.setItem("admin_token", session.token);
      setToken(session.token);
      setAuthed(true);
    } catch {
      setError("Bağlantı hatası / Connection error");
    } finally {
      setChecking(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_token");
    setToken("");
    setAuthed(false);
  }

  return { token, authed, checking, error, login, logout };
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function apiPut(path: string, body: unknown, token: string) {
  const r = await fetch(apiUrl(`${API}${path}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function apiPost(path: string, body: unknown, token: string) {
  const r = await fetch(apiUrl(`${API}${path}`), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function apiDelete(path: string, token: string) {
  const r = await fetch(apiUrl(`${API}${path}`), {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function uploadImage(file: File, token: string): Promise<string> {
  const urlRes = await fetch(apiUrl(`${API}/storage/uploads/request-url`), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  });
  if (!urlRes.ok) throw new Error("Upload URL alınamadı");
  const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };
  const put = await fetch(apiUrl(uploadURL), { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  if (!put.ok) throw new Error("Dosya yüklenemedi");
  return objectPath;
}

function Field({ label, valueTr, valueEn, onChangeTr, onChangeEn, multiline }: {
  label: string;
  valueTr: string;
  valueEn: string;
  onChangeTr: (v: string) => void;
  onChangeEn: (v: string) => void;
  multiline?: boolean;
}) {
  const cls = "w-full border border-border rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-olive font-sans";
  return (
    <div className="space-y-2">
      <p className="text-xs font-sans text-muted-foreground tracking-wider uppercase">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-olive font-sans uppercase tracking-widest mb-1 block">TR</label>
          {multiline
            ? <textarea rows={3} className={cls} value={valueTr} onChange={e => onChangeTr(e.target.value)} />
            : <input className={cls} value={valueTr} onChange={e => onChangeTr(e.target.value)} />}
        </div>
        <div>
          <label className="text-[10px] text-olive font-sans uppercase tracking-widest mb-1 block">EN</label>
          {multiline
            ? <textarea rows={3} className={cls} value={valueEn} onChange={e => onChangeEn(e.target.value)} />
            : <input className={cls} value={valueEn} onChange={e => onChangeEn(e.target.value)} />}
        </div>
      </div>
    </div>
  );
}

function SaveBtn({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 px-4 py-2 bg-olive text-white text-xs tracking-widest uppercase font-sans rounded hover:bg-olive/80 disabled:opacity-50 transition-colors"
    >
      <Save className="w-3.5 h-3.5" />
      {saving ? "Kaydediliyor…" : "Kaydet / Save"}
    </button>
  );
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded text-sm font-sans shadow-lg ${ok ? "bg-olive text-white" : "bg-red-600 text-white"}`}>
      {msg}
    </div>
  );
}

type ContentRecord = Record<string, { tr: string; en: string }>;

function contentDefaultsFor(keys: string[]): ContentRecord {
  return Object.fromEntries(
    keys.map((key) => [key, DEFAULTS[key] ?? { tr: "", en: "" }]),
  );
}

function GeneralTab({ token }: { token: string }) {
  const keys: Array<{ key: string; label: string; multiline?: boolean }> = [
    { key: "hero.tagline", label: "Hero Tagline", multiline: true },
    { key: "about.title", label: "Hakkımızda Başlık / About Title" },
    { key: "about.p1", label: "Hakkımızda Paragraf 1 / About P1", multiline: true },
    { key: "about.p2", label: "Hakkımızda Paragraf 2 / About P2", multiline: true },
    { key: "footer.tagline", label: "Footer Tagline" },
  ];
  const contentKeys = keys.map(({ key }) => key);
  const [content, setContent] = useState<ContentRecord>(() => contentDefaultsFor(contentKeys));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch(apiUrl(`${API}/content`)).then(r => r.json()).then((d: ContentRecord) => {
      const merged: ContentRecord = {};
      for (const k of contentKeys) {
        merged[k] = d[k] ?? DEFAULTS[k] ?? { tr: "", en: "" };
      }
      setContent(merged);
    }).catch(() => setContent(contentDefaultsFor(contentKeys)));
  }, []);

  function update(key: string, lang: "tr" | "en", val: string) {
    setContent(prev => ({ ...prev, [key]: { ...prev[key], [lang]: val } }));
  }

  async function save() {
    setSaving(true);
    try {
      for (const [key, val] of Object.entries(content)) {
        await apiPut(`/content/${encodeURIComponent(key)}`, { tr: val.tr, en: val.en }, token);
      }
      setToast({ msg: "Kaydedildi!", ok: true });
    } catch {
      setToast({ msg: "Hata oluştu", ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <div className="space-y-8">
      {keys.map(({ key, label, multiline }) => (
        <Field
          key={key}
          label={label}
          valueTr={content[key]?.tr ?? ""}
          valueEn={content[key]?.en ?? ""}
          onChangeTr={v => update(key, "tr", v)}
          onChangeEn={v => update(key, "en", v)}
          multiline={multiline}
        />
      ))}
      <SaveBtn saving={saving} onClick={save} />
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}

function ContactTab({ token }: { token: string }) {
  const keys = ["visit.address", "visit.weekdays", "visit.weekend", "visit.email", "visit.phone", "contact.instagram"];
  const [content, setContent] = useState<ContentRecord>(() => contentDefaultsFor(keys));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch(apiUrl(`${API}/content`)).then(r => r.json()).then((d: ContentRecord) => {
      const merged: ContentRecord = {};
      for (const k of keys) merged[k] = d[k] ?? DEFAULTS[k] ?? { tr: "", en: "" };
      setContent(merged);
    }).catch(() => setContent(contentDefaultsFor(keys)));
  }, []);

  function update(key: string, lang: "tr" | "en", val: string) {
    setContent(prev => ({ ...prev, [key]: { ...prev[key], [lang]: val } }));
  }

  async function save() {
    setSaving(true);
    try {
      for (const [key, val] of Object.entries(content)) {
        await apiPut(`/content/${encodeURIComponent(key)}`, { tr: val.tr, en: val.en }, token);
      }
      setToast({ msg: "Kaydedildi!", ok: true });
    } catch {
      setToast({ msg: "Hata oluştu", ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  const fieldDefs: Array<{ key: string; label: string; multiline?: boolean }> = [
    { key: "visit.address", label: "Adres / Address", multiline: true },
    { key: "visit.weekdays", label: "Hafta içi saatler / Weekday Hours" },
    { key: "visit.weekend", label: "Hafta sonu saatler / Weekend Hours" },
    { key: "visit.email", label: "E-posta / Email" },
    { key: "visit.phone", label: "Telefon / Phone" },
    { key: "contact.instagram", label: "Instagram Kullanıcı Adı / Instagram Handle" },
  ];

  return (
    <div className="space-y-8">
      {fieldDefs.map(({ key, label, multiline }) => (
        <Field
          key={key}
          label={label}
          valueTr={content[key]?.tr ?? ""}
          valueEn={content[key]?.en ?? ""}
          onChangeTr={v => update(key, "tr", v)}
          onChangeEn={v => update(key, "en", v)}
          multiline={multiline}
        />
      ))}
      <div className="text-xs text-muted-foreground font-sans p-3 bg-muted/40 rounded">
        Instagram için sadece kullanıcı adı yazın (örn: urlascoffee) — @ işareti olmadan.<br />
        Enter only the username for Instagram (e.g. urlascoffee) — no @ sign.
      </div>
      <SaveBtn saving={saving} onClick={save} />
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}

interface GalleryImage { id: number; url: string; altTr: string; altEn: string; sortOrder: number; }

function GalleryTab({ token }: { token: string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch(apiUrl(`${API}/gallery`)).then(r => r.json()).then((d: GalleryImage[]) => {
      setImages(Array.isArray(d) ? d.map((image) => ({ ...image, url: mediaUrl(image.url) ?? image.url })) : []);
    });
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const objectPath = await uploadImage(file, token);
      const imgUrl = `/api/storage/objects/${objectPath.replace(/^\/objects\//, "")}`;
      await apiPost("/gallery", { url: imgUrl, altTr: file.name, altEn: file.name, sortOrder: images.length }, token);
      load();
      setToast({ msg: "Yüklendi!", ok: true });
    } catch {
      setToast({ msg: "Yükleme hatası", ok: false });
    } finally {
      setUploading(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu resmi sil? / Delete this image?")) return;
    try {
      await apiDelete(`/gallery/${id}`, token);
      load();
      setToast({ msg: "Silindi", ok: true });
    } catch {
      setToast({ msg: "Silinemedi", ok: false });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  }

  async function updateAlt(img: GalleryImage, field: "altTr" | "altEn", val: string) {
    const updated = { ...img, [field]: val };
    setImages(prev => prev.map(i => i.id === img.id ? updated : i));
    await apiPut(`/gallery/${img.id}`, { [field]: val }, token).catch(() => {});
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-sans uppercase tracking-widest">
          {images.length} resim / images
        </p>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 border border-olive text-olive text-xs tracking-widest uppercase font-sans rounded hover:bg-olive hover:text-white disabled:opacity-50 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          {uploading ? "Yükleniyor…" : "Resim Ekle / Add Image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map(img => (
          <div key={img.id} className="border border-border rounded overflow-hidden group">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img src={mediaUrl(img.url) ?? img.url} alt={img.altTr} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 bg-black/60 text-white rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <div>
                <label className="text-[10px] text-olive font-sans uppercase tracking-widest">Alt TR</label>
                <input
                  className="w-full border border-border rounded px-2 py-1 text-xs font-sans bg-background focus:outline-none focus:ring-1 focus:ring-olive mt-1"
                  value={img.altTr}
                  onChange={e => updateAlt(img, "altTr", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-olive font-sans uppercase tracking-widest">Alt EN</label>
                <input
                  className="w-full border border-border rounded px-2 py-1 text-xs font-sans bg-background focus:outline-none focus:ring-1 focus:ring-olive mt-1"
                  value={img.altEn}
                  onChange={e => updateAlt(img, "altEn", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground text-sm font-sans">
            Henüz resim yok. / No images yet.
          </div>
        )}
      </div>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}

interface ApiCategory { id: number; nameTr: string; nameEn: string; sortOrder: number; }
interface ApiItem { id: number; categoryId: number; nameTr: string; nameEn: string; descTr: string; descEn: string; photoUrl: string | null; sortOrder: number; }

type CatEdit = { nameTr: string; nameEn: string };
type ItemEdit = { nameTr: string; nameEn: string; descTr: string; descEn: string };

function MenuTab({ token }: { token: string }) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [items, setItems] = useState<ApiItem[]>([]);
  const [catEdits, setCatEdits] = useState<Record<number, CatEdit>>({});
  const [itemEdits, setItemEdits] = useState<Record<number, ItemEdit>>({});
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [newCat, setNewCat] = useState({ nameTr: "", nameEn: "" });
  const [addingItem, setAddingItem] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({ nameTr: "", nameEn: "", descTr: "", descEn: "" });
  const uploadRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  function load() {
    fetch(apiUrl(`${API}/menu`)).then(r => r.json()).then((d: { categories: ApiCategory[]; items: ApiItem[] }) => {
      const cats = d.categories?.length ? d.categories : DEFAULT_MENU.categories;
      const itms = d.items?.length ? d.items.map((item) => ({ ...item, photoUrl: mediaUrl(item.photoUrl) })) : DEFAULT_MENU.items;
      setCategories(cats);
      setItems(itms);
      setCatEdits(Object.fromEntries(
        cats.map((c) => [c.id, { nameTr: c.nameTr, nameEn: c.nameEn }]),
      ));
      setItemEdits(Object.fromEntries(
        itms.map((i) => [i.id, { nameTr: i.nameTr, nameEn: i.nameEn, descTr: i.descTr, descEn: i.descEn }]),
      ));
    }).catch(() => {
      setCategories(DEFAULT_MENU.categories);
      setItems(DEFAULT_MENU.items);
      setCatEdits(Object.fromEntries(
        DEFAULT_MENU.categories.map((c) => [c.id, { nameTr: c.nameTr, nameEn: c.nameEn }]),
      ));
      setItemEdits(Object.fromEntries(
        DEFAULT_MENU.items.map((i) => [i.id, { nameTr: i.nameTr, nameEn: i.nameEn, descTr: i.descTr, descEn: i.descEn }]),
      ));
    });
  }

  useEffect(() => { load(); }, []);

  async function addCategory() {
    if (!newCat.nameTr || !newCat.nameEn) return;
    try {
      await apiPost("/menu/categories", { ...newCat, sortOrder: categories.length }, token);
      setNewCat({ nameTr: "", nameEn: "" });
      load();
      showToast("Kategori eklendi!");
    } catch { showToast("Hata", false); }
  }

  async function deleteCategory(id: number) {
    if (!confirm("Kategori ve tüm ürünlerini sil? / Delete category and all its items?")) return;
    try {
      await apiDelete(`/menu/categories/${id}`, token);
      load();
      showToast("Silindi");
    } catch { showToast("Hata", false); }
  }

  async function updateCategory(id: number, nameTr: string, nameEn: string) {
    try {
      await apiPut(`/menu/categories/${id}`, { nameTr, nameEn }, token);
      showToast("Kaydedildi!");
    } catch { showToast("Hata", false); }
  }

  async function addItem(categoryId: number) {
    if (!newItem.nameTr || !newItem.nameEn) return;
    try {
      await apiPost("/menu/items", { ...newItem, categoryId, sortOrder: items.filter(i => i.categoryId === categoryId).length }, token);
      setNewItem({ nameTr: "", nameEn: "", descTr: "", descEn: "" });
      setAddingItem(null);
      load();
      showToast("Ürün eklendi!");
    } catch { showToast("Hata", false); }
  }

  async function deleteItem(id: number) {
    if (!confirm("Bu ürünü sil? / Delete this item?")) return;
    try {
      await apiDelete(`/menu/items/${id}`, token);
      load();
      showToast("Silindi");
    } catch { showToast("Hata", false); }
  }

  async function updateItem(item: ApiItem, field: string, val: string) {
    const updated = { ...item, [field]: val };
    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    await apiPut(`/menu/items/${item.id}`, { [field]: val }, token).catch(() => {});
  }

  async function uploadItemPhoto(item: ApiItem, file: File) {
    try {
      const objectPath = await uploadImage(file, token);
      const imgUrl = `/api/storage/objects/${objectPath.replace(/^\/objects\//, "")}`;
      await apiPut(`/menu/items/${item.id}`, { photoUrl: imgUrl }, token);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, photoUrl: imgUrl } : i));
      showToast("Fotoğraf yüklendi!");
    } catch { showToast("Yükleme hatası", false); }
  }

  const inputCls = "w-full border border-border rounded px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-olive font-sans";

  return (
    <div className="space-y-6">
      <div className="border border-border rounded p-4 space-y-3">
        <p className="text-xs font-sans uppercase tracking-widest text-olive">Yeni Kategori / New Category</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground block mb-1">TR</label>
            <input className={inputCls} placeholder="Kategori adı (TR)" value={newCat.nameTr} onChange={e => setNewCat(p => ({ ...p, nameTr: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground block mb-1">EN</label>
            <input className={inputCls} placeholder="Category name (EN)" value={newCat.nameEn} onChange={e => setNewCat(p => ({ ...p, nameEn: e.target.value }))} />
          </div>
        </div>
        <button
          onClick={addCategory}
          className="flex items-center gap-2 px-4 py-2 bg-olive text-white text-xs tracking-widest uppercase font-sans rounded hover:bg-olive/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Kategori Ekle / Add Category
        </button>
      </div>

      {categories.map(cat => {
        const catItems = items.filter(i => i.categoryId === cat.id);
        const isExpanded = expandedCat === cat.id;
        return (
          <div key={cat.id} className="border border-border rounded overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
              <button
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4 text-olive shrink-0" /> : <ChevronDown className="w-4 h-4 text-olive shrink-0" />}
                <span className="font-serif text-lg text-foreground">{cat.nameTr}</span>
                <span className="text-muted-foreground text-sm font-sans">/ {cat.nameEn}</span>
                <span className="text-xs text-muted-foreground font-sans ml-auto">{catItems.length} ürün</span>
              </button>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {isExpanded && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground block mb-1">Kategori Adı TR</label>
                    <input
                      className={inputCls}
                      value={catEdits[cat.id]?.nameTr ?? cat.nameTr}
                      onChange={e => setCatEdits(p => ({ ...p, [cat.id]: { ...p[cat.id], nameTr: e.target.value } }))}
                      onBlur={e => updateCategory(cat.id, e.target.value, catEdits[cat.id]?.nameEn ?? cat.nameEn)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground block mb-1">Category Name EN</label>
                    <input
                      className={inputCls}
                      value={catEdits[cat.id]?.nameEn ?? cat.nameEn}
                      onChange={e => setCatEdits(p => ({ ...p, [cat.id]: { ...p[cat.id], nameEn: e.target.value } }))}
                      onBlur={e => updateCategory(cat.id, catEdits[cat.id]?.nameTr ?? cat.nameTr, e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {catItems.map(item => (
                    <div key={item.id} className="border border-border/60 rounded p-3 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 shrink-0 bg-muted rounded overflow-hidden relative group">
                          {item.photoUrl
                            ? <img src={mediaUrl(item.photoUrl) ?? item.photoUrl} alt={item.nameTr} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Image className="w-6 h-6 text-muted-foreground/40" /></div>
                          }
                          <button
                            onClick={() => uploadRefs.current[item.id]?.click()}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Upload className="w-4 h-4 text-white" />
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={el => { uploadRefs.current[item.id] = el; }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadItemPhoto(item, f); e.target.value = ""; }}
                          />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-olive font-sans uppercase tracking-widest block mb-1">TR Ad</label>
                            <input
                              className={inputCls}
                              value={itemEdits[item.id]?.nameTr ?? item.nameTr}
                              onChange={e => setItemEdits(p => ({ ...p, [item.id]: { ...p[item.id], nameTr: e.target.value } }))}
                              onBlur={e => updateItem(item, "nameTr", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-olive font-sans uppercase tracking-widest block mb-1">EN Name</label>
                            <input
                              className={inputCls}
                              value={itemEdits[item.id]?.nameEn ?? item.nameEn}
                              onChange={e => setItemEdits(p => ({ ...p, [item.id]: { ...p[item.id], nameEn: e.target.value } }))}
                              onBlur={e => updateItem(item, "nameEn", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground font-sans uppercase tracking-widest block mb-1">Açıklama TR</label>
                            <input
                              className={inputCls}
                              value={itemEdits[item.id]?.descTr ?? item.descTr}
                              onChange={e => setItemEdits(p => ({ ...p, [item.id]: { ...p[item.id], descTr: e.target.value } }))}
                              onBlur={e => updateItem(item, "descTr", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground font-sans uppercase tracking-widest block mb-1">Description EN</label>
                            <input
                              className={inputCls}
                              value={itemEdits[item.id]?.descEn ?? item.descEn}
                              onChange={e => setItemEdits(p => ({ ...p, [item.id]: { ...p[item.id], descEn: e.target.value } }))}
                              onBlur={e => updateItem(item, "descEn", e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {addingItem === cat.id ? (
                  <div className="border border-olive/40 rounded p-3 space-y-3 bg-olive/5">
                    <p className="text-xs font-sans uppercase tracking-widest text-olive">Yeni Ürün / New Item</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input className={inputCls} placeholder="Ad TR" value={newItem.nameTr} onChange={e => setNewItem(p => ({ ...p, nameTr: e.target.value }))} />
                      <input className={inputCls} placeholder="Name EN" value={newItem.nameEn} onChange={e => setNewItem(p => ({ ...p, nameEn: e.target.value }))} />
                      <input className={inputCls} placeholder="Açıklama TR" value={newItem.descTr} onChange={e => setNewItem(p => ({ ...p, descTr: e.target.value }))} />
                      <input className={inputCls} placeholder="Description EN" value={newItem.descEn} onChange={e => setNewItem(p => ({ ...p, descEn: e.target.value }))} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => addItem(cat.id)} className="flex items-center gap-2 px-3 py-2 bg-olive text-white text-xs uppercase tracking-widest font-sans rounded hover:bg-olive/80 transition-colors">
                        <Plus className="w-3 h-3" /> Ekle / Add
                      </button>
                      <button onClick={() => { setAddingItem(null); setNewItem({ nameTr: "", nameEn: "", descTr: "", descEn: "" }); }} className="px-3 py-2 border border-border text-xs uppercase tracking-widest font-sans rounded hover:border-olive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingItem(cat.id)}
                    className="flex items-center gap-2 text-xs text-olive font-sans uppercase tracking-widest hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ürün Ekle / Add Item
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {categories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm font-sans">
          Henüz kategori yok. Yukarıdan ekleyin. / No categories yet. Add one above.
        </div>
      )}
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}

type Tab = "general" | "contact" | "gallery" | "menu";

export default function Admin() {
  const { token, authed, checking, error, login, logout } = useAdminSession();
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("general");

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-2 text-foreground">Urla's</h1>
            <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Admin Panel</p>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Şifre / Password"
                className="w-full border border-border rounded px-4 py-3 pr-10 text-sm font-sans bg-background focus:outline-none focus:ring-1 focus:ring-olive"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login(pw)}
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs font-sans">{error}</p>}
            <button
              onClick={() => login(pw)}
              disabled={checking || !pw}
              className="w-full py-3 bg-olive text-white font-sans text-sm uppercase tracking-widest rounded hover:bg-olive/80 disabled:opacity-50 transition-colors"
            >
              {checking ? "…" : "Giriş Yap / Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "general", label: "Genel / General" },
    { id: "contact", label: "İletişim / Contact" },
    { id: "gallery", label: "Galeri / Gallery" },
    { id: "menu", label: "Menü / Menu" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-30 bg-background border-b border-border/60 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-sans uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Siteye Dön / Back
          </Link>
          <span className="text-border">|</span>
          <span className="font-serif text-lg text-foreground">Admin</span>
        </div>
        <button
          onClick={logout}
          className="text-xs text-muted-foreground hover:text-foreground font-sans uppercase tracking-widest transition-colors"
        >
          Çıkış / Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-sans uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-olive text-olive"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "general" && <GeneralTab token={token} />}
        {activeTab === "contact" && <ContactTab token={token} />}
        {activeTab === "gallery" && <GalleryTab token={token} />}
        {activeTab === "menu" && <MenuTab token={token} />}
      </div>
    </div>
  );
}
