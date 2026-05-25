import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import express, { Router, type IRouter, type Request, type Response } from "express";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const localUploadsDir = path.resolve(process.cwd(), ".local", "uploads");

router.post("/storage/uploads/request-url", async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;
    const objectId = randomUUID();
    const objectPath = `/objects/uploads/${objectId}-${name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const uploadURL = `/api/storage/local-uploads/${encodeURIComponent(objectPath.replace(/^\/objects\//, ""))}`;

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.put(
  "/storage/local-uploads/:objectPath",
  express.raw({ type: "*/*", limit: "20mb" }),
  async (req: Request, res: Response) => {
    const rawObjectPath = req.params.objectPath;
    const objectPath = decodeURIComponent(Array.isArray(rawObjectPath) ? rawObjectPath.join("/") : rawObjectPath ?? "");
    const target = path.resolve(localUploadsDir, objectPath);

    if (!target.startsWith(localUploadsDir)) {
      res.status(400).json({ error: "Invalid upload path" });
      return;
    }

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, req.body as Buffer);
    res.json({ ok: true });
  },
);

router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const target = path.resolve(localUploadsDir, wildcardPath);
    if (!target.startsWith(localUploadsDir)) {
      res.status(400).json({ error: "Invalid object path" });
      return;
    }
    const file = await readFile(target);
    res.setHeader("Cache-Control", "private, max-age=3600");
    res.end(file);
  } catch (error) {
    req.log.error({ err: error }, "Error serving object");
    res.status(404).json({ error: "Object not found" });
  }
});

export default router;
