import { CandidateProfile, ParsedJobDescription, MatchAnalysis, GeneratedResume } from "../types";

const API_BASE = "/api";

export async function fetchProfile(): Promise<CandidateProfile> {
  const res = await fetch(`${API_BASE}/candidates/profile`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch profile");
  
  // Format arrays from stringified JSON if needed
  const c = data.data;
  return {
    ...c,
    experiences: c.experiences.map((exp: any) => ({
      ...exp,
      responsibilities: typeof exp.responsibilities === "string" ? JSON.parse(exp.responsibilities) : exp.responsibilities,
      technologies: typeof exp.technologies === "string" ? JSON.parse(exp.technologies) : exp.technologies
    })),
    projects: c.projects.map((p: any) => ({
      ...p,
      technologies: typeof p.technologies === "string" ? JSON.parse(p.technologies) : p.technologies,
      responsibilities: typeof p.responsibilities === "string" ? JSON.parse(p.responsibilities) : p.responsibilities
    }))
  };
}

export async function updateProfile(id: string, profile: CandidateProfile): Promise<CandidateProfile> {
  const res = await fetch(`${API_BASE}/candidates/profile/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to update profile");
  return data.data;
}

export async function parseJd(rawText?: string, file?: File): Promise<{ id: string; parsed: ParsedJobDescription }> {
  let body: any;
  let headers: any = {};

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    if (rawText) formData.append("rawText", rawText);
    body = formData;
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({ rawText });
  }

  const res = await fetch(`${API_BASE}/jd/parse`, {
    method: "POST",
    headers,
    body
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to parse Job Description");
  return data.data;
}

export async function analyzeMatch(candidateId: string, jdId?: string, rawText?: string): Promise<{ matchAnalysis: MatchAnalysis; parsedJd: ParsedJobDescription }> {
  const res = await fetch(`${API_BASE}/match/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidateId, jdId, rawText })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to analyze match");
  return data.data;
}

export async function generateResume(payload: {
  candidateId: string;
  jdId?: string;
  rawText?: string;
  mode: "STRICT_PROFILE" | "JD_OPTIMIZED" | "LEARNED_SKILLS";
  objective: string;
  lengthPreference: string;
}): Promise<{ id: string; resume: GeneratedResume; matchReport: MatchAnalysis; truthValidation: any }> {
  const res = await fetch(`${API_BASE}/resumes/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to generate resume");
  return data.data;
}

export async function regenerateBullet(
  originalBullet: string,
  candidateTechnologies: string[],
  jdKeywords: string[],
  tone: "ats" | "technical" | "concise"
): Promise<string> {
  const res = await fetch(`${API_BASE}/resumes/regenerate-bullet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalBullet, candidateTechnologies, jdKeywords, tone })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to rewrite bullet");
  return data.data.rewritten;
}

export async function fetchSavedResumes(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/resumes`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch resumes");
  return data.data;
}
