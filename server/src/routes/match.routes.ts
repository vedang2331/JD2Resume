import { Router } from "express";
import { analyzeMatchHandler } from "../controllers/match.controller.js";

const router = Router();

router.post("/analyze", analyzeMatchHandler);

export default router;
