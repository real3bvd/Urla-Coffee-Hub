import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const siteContentTable = pgTable("site_content", {
  key: text("key").primaryKey(),
  valueTr: text("value_tr").notNull(),
  valueEn: text("value_en").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteContent = typeof siteContentTable.$inferSelect;
