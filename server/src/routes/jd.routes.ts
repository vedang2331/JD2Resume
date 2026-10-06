import { Router } from "express";
import multer from "multer";
import { parseJdHandler } from "../controllers/jd.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/parse", upload.single("file"), parseJdHandler);

export default router;
