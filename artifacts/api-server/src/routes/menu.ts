import { Router, type IRouter, type Request, type Response } from "express";
import { requireAdmin } from "./adminAuth";
import {
  addLocalCategory,
  addLocalItem,
  deleteLocalCategory,
  deleteLocalItem,
  getLocalMenu,
  updateLocalCategory,
  updateLocalItem,
} from "../lib/localStore";

const router: IRouter = Router();
const useDatabase = Boolean(process.env.DATABASE_URL);

router.get("/menu", async (req: Request, res: Response) => {
  try {
    if (!useDatabase) {
      res.json(await getLocalMenu());
      return;
    }
    const [{ db }, { menuCategoriesTable, menuItemsTable }, { asc }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
      import("drizzle-orm"),
    ]);
    const categories = await db
      .select()
      .from(menuCategoriesTable)
      .orderBy(asc(menuCategoriesTable.sortOrder), asc(menuCategoriesTable.createdAt));
    const items = await db
      .select()
      .from(menuItemsTable)
      .orderBy(asc(menuItemsTable.sortOrder), asc(menuItemsTable.createdAt));
    res.json({ categories, items });
  } catch (err) {
    req.log.error({ err }, "Error fetching menu");
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

router.post("/menu/categories", requireAdmin, async (req: Request, res: Response) => {
  const { nameTr, nameEn, sortOrder } = req.body as {
    nameTr?: string;
    nameEn?: string;
    sortOrder?: number;
  };
  if (!nameTr || !nameEn) {
    res.status(400).json({ error: "nameTr and nameEn are required" });
    return;
  }
  try {
    if (!useDatabase) {
      res.json(await addLocalCategory({ nameTr, nameEn, sortOrder: sortOrder ?? 0 }));
      return;
    }
    const [{ db }, { menuCategoriesTable }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
    ]);
    const [cat] = await db
      .insert(menuCategoriesTable)
      .values({ nameTr, nameEn, sortOrder: sortOrder ?? 0 })
      .returning();
    res.json(cat);
  } catch (err) {
    req.log.error({ err }, "Error adding category");
    res.status(500).json({ error: "Failed to add category" });
  }
});

router.put("/menu/categories/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nameTr, nameEn, sortOrder } = req.body as {
    nameTr?: string;
    nameEn?: string;
    sortOrder?: number;
  };
  try {
    const updates: Partial<{ nameTr: string; nameEn: string; sortOrder: number }> = {};
    if (typeof nameTr === "string") updates.nameTr = nameTr;
    if (typeof nameEn === "string") updates.nameEn = nameEn;
    if (typeof sortOrder === "number") updates.sortOrder = sortOrder;
    if (!useDatabase) {
      res.json(await updateLocalCategory(id, updates));
      return;
    }
    const [{ db }, { menuCategoriesTable }, { eq }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
      import("drizzle-orm"),
    ]);
    const [cat] = await db
      .update(menuCategoriesTable)
      .set(updates)
      .where(eq(menuCategoriesTable.id, id))
      .returning();
    res.json(cat);
  } catch (err) {
    req.log.error({ err }, "Error updating category");
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/menu/categories/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    if (!useDatabase) {
      await deleteLocalCategory(id);
      res.json({ ok: true });
      return;
    }
    const [{ db }, { menuCategoriesTable, menuItemsTable }, { eq }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
      import("drizzle-orm"),
    ]);
    await db.delete(menuItemsTable).where(eq(menuItemsTable.categoryId, id));
    await db.delete(menuCategoriesTable).where(eq(menuCategoriesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting category");
    res.status(500).json({ error: "Failed to delete category" });
  }
});

router.post("/menu/items", requireAdmin, async (req: Request, res: Response) => {
  const { categoryId, nameTr, nameEn, descTr, descEn, photoUrl, sortOrder } = req.body as {
    categoryId?: number;
    nameTr?: string;
    nameEn?: string;
    descTr?: string;
    descEn?: string;
    photoUrl?: string;
    sortOrder?: number;
  };
  if (!categoryId || !nameTr || !nameEn) {
    res.status(400).json({ error: "categoryId, nameTr, nameEn are required" });
    return;
  }
  try {
    if (!useDatabase) {
      res.json(await addLocalItem({
        categoryId,
        nameTr,
        nameEn,
        descTr: descTr ?? "",
        descEn: descEn ?? "",
        photoUrl: photoUrl ?? null,
        sortOrder: sortOrder ?? 0,
      }));
      return;
    }
    const [{ db }, { menuItemsTable }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
    ]);
    const [item] = await db
      .insert(menuItemsTable)
      .values({
        categoryId,
        nameTr,
        nameEn,
        descTr: descTr ?? "",
        descEn: descEn ?? "",
        photoUrl: photoUrl ?? null,
        sortOrder: sortOrder ?? 0,
      })
      .returning();
    res.json(item);
  } catch (err) {
    req.log.error({ err }, "Error adding menu item");
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

router.put("/menu/items/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nameTr, nameEn, descTr, descEn, photoUrl, sortOrder, categoryId } = req.body as {
    nameTr?: string;
    nameEn?: string;
    descTr?: string;
    descEn?: string;
    photoUrl?: string | null;
    sortOrder?: number;
    categoryId?: number;
  };
  try {
    const updates: Record<string, unknown> = {};
    if (typeof nameTr === "string") updates["nameTr"] = nameTr;
    if (typeof nameEn === "string") updates["nameEn"] = nameEn;
    if (typeof descTr === "string") updates["descTr"] = descTr;
    if (typeof descEn === "string") updates["descEn"] = descEn;
    if (photoUrl !== undefined) updates["photoUrl"] = photoUrl;
    if (typeof sortOrder === "number") updates["sortOrder"] = sortOrder;
    if (typeof categoryId === "number") updates["categoryId"] = categoryId;
    if (!useDatabase) {
      res.json(await updateLocalItem(id, updates));
      return;
    }
    const [{ db }, { menuItemsTable }, { eq }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
      import("drizzle-orm"),
    ]);
    const [item] = await db
      .update(menuItemsTable)
      .set(updates)
      .where(eq(menuItemsTable.id, id))
      .returning();
    res.json(item);
  } catch (err) {
    req.log.error({ err }, "Error updating menu item");
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

router.delete("/menu/items/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    if (!useDatabase) {
      await deleteLocalItem(id);
      res.json({ ok: true });
      return;
    }
    const [{ db }, { menuItemsTable }, { eq }] = await Promise.all([
      import("@workspace/db"),
      import("@workspace/db/schema"),
      import("drizzle-orm"),
    ]);
    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting menu item");
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

export default router;
