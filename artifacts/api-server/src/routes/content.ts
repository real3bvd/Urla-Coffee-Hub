import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { siteContentTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./adminAuth";

const router: IRouter = Router();

router.get("/content", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(siteContentTable);
    const result: Record<string, { tr: string; en: string }> = {};
    for (const row of rows) {
      result[row.key] = { tr: row.valueTr, en: row.valueEn };
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error fetching content");
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

router.put("/content/:key", requireAdmin, async (req: Request, res: Response) => {
  const rawKey = req.params["key"];
  const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
  const { tr, en } = req.body as { tr?: string; en?: string };
  if (typeof tr !== "string" || typeof en !== "string") {
    res.status(400).json({ error: "tr and en are required strings" });
    return;
  }
  try {
    await db
      .insert(siteContentTable)
      .values({ key: key!, valueTr: tr, valueEn: en })
      .onConflictDoUpdate({
        target: siteContentTable.key,
        set: { valueTr: tr, valueEn: en, updatedAt: new Date() },
      });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Error updating content");
    res.status(500).json({ error: "Failed to update content" });
  }
});

export default router;
