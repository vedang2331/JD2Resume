import { Router } from "express";
import {
  generateResumeHandler,
  regenerateBulletHandler,
  listResumesHandler,
  getResumeByIdHandler
} from "../controllers/resume.controller.js";

const router = Router();

router.post("/generate", generateResumeHandler);
router.post("/regenerate-bullet", regenerateBulletHandler);
router.get("/", listResumesHandler);
router.get("/:id", getResumeByIdHandler);

export default router;
