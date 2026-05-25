import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import contentRouter from "./content";
import galleryRouter from "./gallery";
import menuRouter from "./menu";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(contentRouter);
router.use(galleryRouter);
router.use(menuRouter);

export default router;
