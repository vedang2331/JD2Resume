import { describe, it, expect } from "vitest";
import { normalizeSkillName, areSkillsStrictlyNonEquivalent } from "../src/matching/taxonomy.js";
import { extractKeywordsFromText } from "../src/matching/keyword-extractor.js";
import { evaluateCandidateJdMatch, CandidateProfileData } from "../src/matching/match-engine.js";

describe("Skill Taxonomy & Normalization", () => {
  it("should normalize skill variations accurately", () => {
    expect(normalizeSkillName("postgres")).toBe("PostgreSQL");
    expect(normalizeSkillName("postgresql")).toBe("PostgreSQL");
    expect(normalizeSkillName("node")).toBe("Node.js");
    expect(normalizeSkillName("RESTful APIs")).toBe("REST APIs");
  });

  it("should enforce strict non-equivalence rules", () => {
    expect(areSkillsStrictlyNonEquivalent("React", "Angular")).toBe(true);
    expect(areSkillsStrictlyNonEquivalent("AWS", "Azure")).toBe(true);
    expect(areSkillsStrictlyNonEquivalent("PostgreSQL", "MongoDB")).toBe(true);
    expect(areSkillsStrictlyNonEquivalent("Node.js", "Node.js")).toBe(false);
  });
});

describe("JD Parser & Match Engine", () => {
  it("should extract mandatory and preferred skills from raw JD text", () => {
    const rawJd = `
      Job Title: Backend Developer
      Mandatory: Node.js, Express.js, PostgreSQL
      Preferred: Redis, AWS
    `;
    const parsed = extractKeywordsFromText(rawJd);
    expect(parsed.technologies).toContain("Node.js");
    expect(parsed.technologies).toContain("PostgreSQL");
  });

  it("should generate a match analysis with accurate score", () => {
    const candidate: CandidateProfileData = {
      fullName: "Test Candidate",
      email: "test@example.com",
      skills: [
        { skillName: "Node.js", category: "Languages", proficiency: "Advanced", explicitlyVerified: true },
        { skillName: "PostgreSQL", category: "Databases", proficiency: "Advanced", explicitlyVerified: true }
      ],
      educations: [{ degree: "B.Tech CS", institution: "Test Univ", graduationYear: "2025" }],
      experiences: [],
      projects: [{ projectName: "Proj A", description: "Test proj", technologies: ["Node.js", "PostgreSQL"], responsibilities: ["Built API"] }]
    };

    const jd = extractKeywordsFromText("Backend Engineer requiring Node.js, PostgreSQL and AWS.");
    const match = evaluateCandidateJdMatch(candidate, jd);

    expect(match.overallScore).toBeGreaterThan(0);
    expect(match.skillsMatch.matched).toContain("Node.js");
    expect(match.skillsMatch.matched).toContain("PostgreSQL");
    expect(match.skillsMatch.missing).toContain("AWS");
  });
});
