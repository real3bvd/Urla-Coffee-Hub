import { Router, type IRouter, type Request, type Response } from "express";
import { requireAdmin } from "./adminAuth";
import {
  addLocalGalleryImage,
  deleteLocalGalleryImage,
  getLocalGallery,
  updateLocalGalleryImage,
} from "../lib/localStore";

const router: IRouter = Router();
const useDatabase = Boolean(process.env.DATABASE_URL);

router.get("/gallery", async (req: Request, res: Response) => {
  try {
    if (!useDatabase) {
      res.json(await getLocalGallery());
      return;
    }
    const [{ db }, { galleryImagesTable }, { asc }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
      import("drizzle-orm"),
    ]);
    const images = await db
      .select()
      .from(galleryImagesTable)
      .orderBy(asc(galleryImagesTable.sortOrder), asc(galleryImagesTable.createdAt));
    res.json(images);
  } catch (err) {
    req.log.error({ err }, "Error fetching gallery");
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

router.post("/gallery", requireAdmin, async (req: Request, res: Response) => {
  const { url, altTr, altEn, sortOrder } = req.body as {
    url?: string;
    altTr?: string;
    altEn?: string;
    sortOrder?: number;
  };
  if (!url) {
    res.status(400).json({ error: "url is required" });
    return;
  }
  try {
    if (!useDatabase) {
      res.json(await addLocalGalleryImage({ url, altTr: altTr ?? "", altEn: altEn ?? "", sortOrder: sortOrder ?? 0 }));
      return;
    }
    const [{ db }, { galleryImagesTable }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
    ]);
    const [image] = await db
      .insert(galleryImagesTable)
      .values({ url, altTr: altTr ?? "", altEn: altEn ?? "", sortOrder: sortOrder ?? 0 })
      .returning();
    res.json(image);
  } catch (err) {
    req.log.error({ err }, "Error adding gallery image");
    res.status(500).json({ error: "Failed to add gallery image" });
  }
});

router.put("/gallery/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { altTr, altEn, sortOrder } = req.body as {
    altTr?: string;
    altEn?: string;
    sortOrder?: number;
  };
  try {
    const updates: Partial<{ altTr: string; altEn: string; sortOrder: number }> = {};
    if (typeof altTr === "string") updates.altTr = altTr;
    if (typeof altEn === "string") updates.altEn = altEn;
    if (typeof sortOrder === "number") updates.sortOrder = sortOrder;
    if (!useDatabase) {
      res.json(await updateLocalGalleryImage(id, updates));
      return;
    }
    const [{ db }, { galleryImagesTable }, { eq }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
      import("drizzle-orm"),
    ]);
    const [image] = await db
      .update(galleryImagesTable)
      .set(updates)
      .where(eq(galleryImagesTable.id, id))
      .returning();
    res.json(image);
  } catch (err) {
    req.log.error({ err }, "Error updating gallery image");
    res.status(500).json({ error: "Failed to update gallery image" });
  }
});

router.delete("/gallery/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    if (!useDatabase) {
      await deleteLocalGalleryImage(id);
      res.json({ ok: true });
      return;
    }
    const [{ db }, { galleryImagesTable }, { eq }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
      import("drizzle-orm"),
    ]);
    await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting gallery image");
    res.status(500).json({ error: "Failed to delete gallery image" });
  }
});

export default router;
