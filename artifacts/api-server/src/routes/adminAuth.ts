import { type Request, type Response, type NextFunction } from "express";
import { randomBytes, timingSafeEqual } from "node:crypto";

const sessions = new Map<string, number>();
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function getAdminPassword() {
  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD not configured");
  }
  return adminPassword;
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

function getBearerToken(req: Request) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length);
}

function isValidSession(token: string) {
  const expiresAt = sessions.get(token);
  if (!expiresAt) {
    return false;
  }

  if (expiresAt <= Date.now()) {
    sessions.delete(token);
    return false;
  }

  return true;
}

export function createAdminSession(password: string) {
  const adminPassword = getAdminPassword();
  if (!safeEqual(password, adminPassword)) {
    return undefined;
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, expiresAt);

  return { token, expiresAt };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    getAdminPassword();
  } catch {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured" });
    return;
  }

  const token = getBearerToken(req);
  if (!token || !isValidSession(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
