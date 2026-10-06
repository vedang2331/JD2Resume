import { Request, Response } from "express";
import { getOrCreateDefaultCandidate, updateCandidateProfile } from "../services/candidate.service.js";

export async function getProfileHandler(req: Request, res: Response) {
  try {
    const candidate = await getOrCreateDefaultCandidate();
    return res.json({ success: true, data: candidate });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateProfileHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await updateCandidateProfile(id, req.body);
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
