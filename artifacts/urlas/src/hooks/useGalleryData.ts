import { useEffect, useState } from "react";

export interface GalleryImage {
  id: number;
  url: string;
  altTr: string;
  altEn: string;
  sortOrder: number;
}

const DEFAULT_GALLERY: GalleryImage[] = [
  { id: -1, url: "/gallery-latte.jpg", altTr: "Latte art", altEn: "Latte art", sortOrder: 0 },
  { id: -2, url: "/gallery-cake.jpg", altTr: "Pasta dilimi", altEn: "Cake slice", sortOrder: 1 },
  { id: -3, url: "/gallery-mugs.jpg", altTr: "Kahve kupaları", altEn: "Coffee mugs", sortOrder: 2 },
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
