import { useEffect, useState } from "react";

export interface GalleryImage {
  id: number;
  url: string;
  altTr: string;
  altEn: string;
  sortOrder: number;
}

const DEFAULT_GALLERY: GalleryImage[] = [
  { id: -1, url: "/gallery-croissant.jpg",       altTr: "Somon croissant",       altEn: "Salmon croissant",    sortOrder: 0 },
  { id: -2, url: "/gallery-cinnamon.jpg",         altTr: "Tarçınlı rulo",         altEn: "Cinnamon roll",       sortOrder: 1 },
  { id: -3, url: "/gallery-chocolate.jpg",        altTr: "Sıcak çikolata",        altEn: "Hot chocolate",       sortOrder: 2 },
  { id: -4, url: "/gallery-poppy-cake.jpg",       altTr: "Haşhaşlı kek",          altEn: "Poppy seed cake",     sortOrder: 3 },
  { id: -5, url: "/gallery-walnut-cake.jpg",      altTr: "Cevizli kek",           altEn: "Walnut cake",         sortOrder: 4 },
  { id: -6, url: "/gallery-latte-art.jpg",        altTr: "Latte art",             altEn: "Latte art",           sortOrder: 5 },
  { id: -7, url: "/gallery-plain-croissant.jpg",  altTr: "Düz croissant",         altEn: "Plain croissant",     sortOrder: 6 },
  { id: -8, url: "/gallery-mugs-color.jpg",       altTr: "Renkli kahve kupaları", altEn: "Colorful coffee mugs",sortOrder: 7 },
];

export function useGalleryData() {
  const [images, setImages] = useState<GalleryImage[]>(DEFAULT_GALLERY);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data: GalleryImage[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        }
      })
      .catch(() => {});
  }, []);

  return { images };
}
