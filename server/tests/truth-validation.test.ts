import { describe, it, expect } from "vitest";
import { auditResumeClaimsTruth } from "../src/services/truth-validator.service.js";
import { CandidateProfileData } from "../src/matching/match-engine.js";
import { GeneratedResumeData } from "../src/ai/llm-client.js";

describe("Truth-Safety Claim Validation Auditor", () => {
  const sampleCandidate: CandidateProfileData = {
    fullName: "Vedang Deshpande",
    email: "vedang@example.com",
    skills: [
      { skillName: "Node.js", category: "Languages", proficiency: "Advanced", explicitlyVerified: true },
      { skillName: "PostgreSQL", category: "Databases", proficiency: "Advanced", explicitlyVerified: true }
    ],
    educations: [{ degree: "B.Tech", institution: "Mumbai University", graduationYear: "2026" }],
    experiences: [],
    projects: [
      {
        projectName: "Backend Project",
        description: "Built API",
        technologies: ["Node.js", "PostgreSQL"],
        responsibilities: ["Developed API endpoints"]
      }
    ]
  };

  it("should pass verification when all resume claims exist in candidate profile", () => {
    const truthfulResume: GeneratedResumeData = {
      summary: "Node.js developer with PostgreSQL experience",
      skills: { Languages: ["Node.js"], Databases: ["PostgreSQL"] },
      experiences: [],
      projects: [
        {
          projectName: "Backend Project",
          description: "Built API",
          bullets: ["Developed API endpoints"],
          technologies: ["Node.js", "PostgreSQL"]
        }
      ],
      education: [{ degree: "B.Tech", institution: "Mumbai University", graduationYear: "2026" }]
    };

    const audit = auditResumeClaimsTruth(sampleCandidate, truthfulResume);
    expect(audit.isTruthful).toBe(true);
    expect(audit.unsupportedClaims.length).toEqual(0);
  });

  it("should catch and flag unsupported skills injected into resume", () => {
    const hallucinatedResume: GeneratedResumeData = {
      summary: "Cloud Architect expert in AWS and Kubernetes",
      skills: { Cloud: ["AWS", "Kubernetes"], Languages: ["Node.js"] },
      experiences: [],
      projects: [],
      education: []
    };

    const audit = auditResumeClaimsTruth(sampleCandidate, hallucinatedResume);
    expect(audit.isTruthful).toBe(false);
    expect(audit.unsupportedClaims.some(c => c.claim === "AWS")).toBe(true);
    expect(audit.unsupportedClaims.some(c => c.claim === "Kubernetes")).toBe(true);
  });
});
