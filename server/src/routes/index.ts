import { Router } from "express";
import candidateRoutes from "./candidate.routes.js";
import jdRoutes from "./jd.routes.js";
import matchRoutes from "./match.routes.js";
import resumeRoutes from "./resume.routes.js";

const router = Router();

router.use("/candidates", candidateRoutes);
router.use("/jd", jdRoutes);
router.use("/match", matchRoutes);
router.use("/resumes", resumeRoutes);

export default router;
