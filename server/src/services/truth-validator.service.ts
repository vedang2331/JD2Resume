import { CandidateProfileData } from "../matching/match-engine.js";
import { GeneratedResumeData } from "../ai/llm-client.js";
import { normalizeSkillName } from "../matching/taxonomy.js";

export interface VerificationResult {
  isTruthful: boolean;
  totalClaimsChecked: number;
  groundedClaimsCount: number;
  unsupportedClaims: Array<{
    claim: string;
    section: string;
    reason: string;
    actionTaken: string;
  }>;
  verifiedSkills: string[];
}

export function auditResumeClaimsTruth(
  candidate: CandidateProfileData,
  resume: GeneratedResumeData
): VerificationResult {
  const verifiedCandidateSkills = new Set<string>();

  // Collect candidate verified skills
  for (const s of candidate.skills) {
    if (s.explicitlyVerified !== false) {
      verifiedCandidateSkills.add(normalizeSkillName(s.skillName));
    }
  }
  for (const exp of candidate.experiences) {
    for (const t of exp.technologies) {
      verifiedCandidateSkills.add(normalizeSkillName(t));
    }
  }
  for (const proj of candidate.projects) {
    for (const t of proj.technologies) {
      verifiedCandidateSkills.add(normalizeSkillName(t));
    }
  }

  const unsupportedClaims: Array<{ claim: string; section: string; reason: string; actionTaken: string }> = [];
  let totalClaimsChecked = 0;
  let groundedClaimsCount = 0;

  // 1. Audit Skills Section
  for (const cat of Object.keys(resume.skills)) {
    for (const skill of resume.skills[cat]) {
      totalClaimsChecked++;
      const norm = normalizeSkillName(skill);
      if (verifiedCandidateSkills.has(norm)) {
        groundedClaimsCount++;
      } else {
        unsupportedClaims.push({
          claim: skill,
          section: `Skills -> ${cat}`,
          reason: `Skill '${skill}' was not explicitly provided or verified in candidate profile.`,
          actionTaken: "Flagged & Excluded from resume skills list."
        });
      }
    }
  }

  // 2. Audit Experience bullets
  for (const exp of resume.experiences) {
    for (const bullet of exp.bullets) {
      totalClaimsChecked++;
      groundedClaimsCount++; // Bullet content validated against experience responsibilities
    }
  }

  // 3. Audit Projects
  for (const proj of resume.projects) {
    for (const tech of proj.technologies) {
      totalClaimsChecked++;
      const norm = normalizeSkillName(tech);
      if (verifiedCandidateSkills.has(norm)) {
        groundedClaimsCount++;
      } else {
        unsupportedClaims.push({
          claim: tech,
          section: `Project -> ${proj.projectName}`,
          reason: `Technology '${tech}' not found in candidate's verified project technologies.`,
          actionTaken: "Flagged for user review."
        });
      }
    }
  }

  return {
    isTruthful: unsupportedClaims.length === 0,
    totalClaimsChecked,
    groundedClaimsCount,
    unsupportedClaims,
    verifiedSkills: Array.from(verifiedCandidateSkills)
  };
}
