import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { galleryImagesTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "./adminAuth";

const router: IRouter = Router();

router.get("/gallery", async (req: Request, res: Response) => {
  try {
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
    await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting gallery image");
    res.status(500).json({ error: "Failed to delete gallery image" });
  }
});

export default router;
