import { Router, type IRouter, type Request, type Response } from "express";
import { requireAdmin } from "./adminAuth";
import { getLocalContent, setLocalContent } from "../lib/localStore";

const router: IRouter = Router();
const useDatabase = Boolean(process.env.DATABASE_URL);

router.get("/content", async (req: Request, res: Response) => {
  try {
    if (!useDatabase) {
      res.json(await getLocalContent());
      return;
    }
    const [{ db }, { siteContentTable }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
    ]);
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
    if (!useDatabase) {
      await setLocalContent(key!, { tr, en });
      res.json({ ok: true });
      return;
    }
    const [{ db }, { siteContentTable }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
    ]);
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
