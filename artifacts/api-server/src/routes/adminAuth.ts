import { type Request, type Response, type NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminPassword) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured" });
    return;
  }
  const provided = req.headers["x-admin-password"];
  if (!provided || provided !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
