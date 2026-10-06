import { Router } from "express";
import { getProfileHandler, updateProfileHandler } from "../controllers/candidate.controller.js";

const router = Router();

router.get("/profile", getProfileHandler);
router.post("/profile/:id", updateProfileHandler);

export default router;
