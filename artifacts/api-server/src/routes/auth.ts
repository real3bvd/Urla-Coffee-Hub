import { Router, type IRouter, type Request, type Response } from "express";
import { createAdminSession } from "./adminAuth";

const router: IRouter = Router();

router.post("/auth/login", (req: Request, res: Response) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const session = createAdminSession(password);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.json(session);
});

export default router;
