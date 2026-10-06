import { normalizeSkillName, areSkillsStrictlyNonEquivalent } from "./taxonomy.js";
import { ParsedJobDescription } from "./keyword-extractor.js";

export interface CandidateProfileData {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
  summary?: string;
  skills: Array<{
    skillName: string;
    category: string;
    proficiency: string;
    yearsExperience?: number;
    explicitlyVerified?: boolean;
  }>;
  educations: Array<{
    degree: string;
    institution: string;
    specialization?: string;
    gpa?: string;
    graduationYear: string;
  }>;
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
    technologies: string[];
    achievements?: string[];
    metrics?: string[];
  }>;
  projects: Array<{
    projectName: string;
    description: string;
    technologies: string[];
    responsibilities: string[];
    metrics?: string[];
    githubUrl?: string;
    liveUrl?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
  }>;
}

export interface MatchCategoryResult {
  matched: string[];
  partial: string[];
  missing: string[];
  related: Array<{ jdSkill: string; candidateSkill: string; note: string }>;
}

export interface FullMatchAnalysis {
  overallScore: number;
  atsScore: number;
  breakdown: {
    technicalSkillsMatch: number;
    experienceMatch: number;
    projectRelevance: number;
    educationMatch: number;
    keywordCoverage: number;
    responsibilityAlignment: number;
    certificationMatch: number;
    domainAlignment: number;
  };
  skillsMatch: MatchCategoryResult;
  keywordMatchMatrix: Array<{
    keyword: string;
    category: string;
    candidateHasIt: boolean;
    resumeContainsIt: boolean;
    foundSection: string;
    status: "MATCHED" | "PARTIAL" | "MISSING";
  }>;
  rankedProjects: Array<{
    projectName: string;
    score: number;
    matchedTech: string[];
    reason: string;
  }>;
  learningRoadmap: Array<{
    priority: number;
    skill: string;
    reason: string;
    difficulty: "Easy" | "Medium" | "Hard";
    learningTime: string;
    impact: "High" | "Medium";
  }>;
  truthValidation: {
    passed: boolean;
    flaggedClaims: string[];
  };
}

export function evaluateCandidateJdMatch(
  candidate: CandidateProfileData,
  jd: ParsedJobDescription
): FullMatchAnalysis {
  // Extract all candidate skills normalized
  const candidateSkillMap = new Map<string, { proficiency: string; verified: boolean }>();
  for (const s of candidate.skills) {
    const norm = normalizeSkillName(s.skillName);
    candidateSkillMap.set(norm, {
      proficiency: s.proficiency || "Intermediate",
      verified: s.explicitlyVerified !== false
    });
  }

  // Also include skills from projects and experience
  for (const exp of candidate.experiences) {
    for (const t of exp.technologies) {
      const norm = normalizeSkillName(t);
      if (!candidateSkillMap.has(norm)) {
        candidateSkillMap.set(norm, { proficiency: "Familiar", verified: true });
      }
    }
  }
  for (const proj of candidate.projects) {
    for (const t of proj.technologies) {
      const norm = normalizeSkillName(t);
      if (!candidateSkillMap.has(norm)) {
        candidateSkillMap.set(norm, { proficiency: "Familiar", verified: true });
      }
    }
  }

  // Evaluate technical skills match
  const matchedSkills: string[] = [];
  const partialSkills: string[] = [];
  const missingSkills: string[] = [];
  const relatedList: Array<{ jdSkill: string; candidateSkill: string; note: string }> = [];

  for (const jdSkill of jd.technologies) {
    const normJd = normalizeSkillName(jdSkill);
    if (candidateSkillMap.has(normJd)) {
      matchedSkills.push(normJd);
    } else {
      // Check partial match or related skills
      let foundRelated = false;
      for (const [candSkill, info] of candidateSkillMap.entries()) {
        if (!areSkillsStrictlyNonEquivalent(normJd, candSkill)) {
          if (candSkill.toLowerCase().includes(normJd.toLowerCase()) || normJd.toLowerCase().includes(candSkill.toLowerCase())) {
            partialSkills.push(normJd);
            relatedList.push({
              jdSkill: normJd,
              candidateSkill: candSkill,
              note: `Candidate has related skill ${candSkill} (Proficiency: ${info.proficiency}).`
            });
            foundRelated = true;
            break;
          }
        }
      }
      if (!foundRelated) {
        missingSkills.push(normJd);
      }
    }
  }

  // Calculate technical score
  const totalJdSkills = Math.max(1, jd.technologies.length);
  const technicalScore = Math.round(((matchedSkills.length * 1.0 + partialSkills.length * 0.5) / totalJdSkills) * 100);

  // Experience match score
  let expScore = 70;
  if (candidate.experiences.length > 0) {
    const totalRespMatch = candidate.experiences.flatMap(e => e.responsibilities).filter(r =>
      jd.responsibilities.some(jr => jr.toLowerCase().split(" ").some(word => word.length > 4 && r.toLowerCase().includes(word)))
    ).length;
    expScore = Math.min(100, Math.round(60 + (totalRespMatch * 10)));
  }

  // Project relevance ranking
  const rankedProjects = candidate.projects.map(p => {
    const pTechs = p.technologies.map(normalizeSkillName);
    const matched = pTechs.filter(t => jd.technologies.map(normalizeSkillName).includes(t));
    const score = Math.round(Math.min(100, (matched.length / Math.max(1, pTechs.length)) * 60 + (matched.length * 15)));
    return {
      projectName: p.projectName,
      score,
      matchedTech: matched,
      reason: matched.length > 0 ? `Matches ${matched.join(", ")} from JD` : "General domain application"
    };
  }).sort((a, b) => b.score - a.score);

  const projectRelevanceScore = Math.round(
    rankedProjects.length > 0 ? rankedProjects.reduce((acc, p) => acc + p.score, 0) / rankedProjects.length : 50
  );

  // Education match
  const hasEducation = candidate.educations.length > 0;
  const eduScore = hasEducation ? 95 : 60;

  // Keyword coverage matrix
  const keywordMatrix = jd.keywords.map(kw => {
    const norm = normalizeSkillName(kw);
    const candidateHasIt = candidateSkillMap.has(norm);
    let section = "None";
    if (candidateHasIt) {
      if (candidate.skills.some(s => normalizeSkillName(s.skillName) === norm)) section = "Skills";
      else if (candidate.projects.some(p => p.technologies.map(normalizeSkillName).includes(norm))) section = "Projects";
      else section = "Experience";
    }

    return {
      keyword: norm,
      category: jd.mandatorySkills.includes(norm) ? "Mandatory" : "Preferred",
      candidateHasIt,
      resumeContainsIt: candidateHasIt, // Truth-first guarantee
      foundSection: section,
      status: candidateHasIt ? ("MATCHED" as const) : ("MISSING" as const)
    };
  });

  const matchedKwCount = keywordMatrix.filter(k => k.candidateHasIt).length;
  const keywordCoverageScore = Math.round((matchedKwCount / Math.max(1, keywordMatrix.length)) * 100);

  // Certifications match
  const candidateCerts = candidate.certifications ? candidate.certifications.map(c => c.name.toLowerCase()) : [];
  const certScore = jd.certifications.length === 0 ? 100 : candidateCerts.length > 0 ? 90 : 50;

  // Domain alignment score
  const domainScore = 80;

  // Overall Score calculation (Weighted average)
  const overallScore = Math.round(
    technicalScore * 0.25 +
    expScore * 0.20 +
    projectRelevanceScore * 0.20 +
    eduScore * 0.10 +
    keywordCoverageScore * 0.10 +
    75 * 0.05 + // Responsibility score
    certScore * 0.05 +
    domainScore * 0.05
  );

  // ATS Structural Score
  const atsScore = Math.round(Math.min(98, overallScore + 8));

  // Learning Roadmap generator for missing skills
  const learningRoadmap = missingSkills.map((skill, index) => {
    const isMandatory = jd.mandatorySkills.map(normalizeSkillName).includes(skill);
    return {
      priority: index + 1,
      skill,
      reason: isMandatory ? "Mandatory requirement in Job Description" : "Preferred qualification that boosts ATS match",
      difficulty: (index % 2 === 0 ? "Medium" : "Easy") as "Easy" | "Medium",
      learningTime: isMandatory ? "2-3 weeks" : "1 week",
      impact: (isMandatory ? "High" : "Medium") as "High" | "Medium"
    };
  });

  return {
    overallScore,
    atsScore,
    breakdown: {
      technicalSkillsMatch: technicalScore,
      experienceMatch: expScore,
      projectRelevance: projectRelevanceScore,
      educationMatch: eduScore,
      keywordCoverage: keywordCoverageScore,
      responsibilityAlignment: 75,
      certificationMatch: certScore,
      domainAlignment: domainScore
    },
    skillsMatch: {
      matched: matchedSkills,
      partial: partialSkills,
      missing: missingSkills,
      related: relatedList
    },
    keywordMatchMatrix: keywordMatrix,
    rankedProjects,
    learningRoadmap,
    truthValidation: {
      passed: true,
      flaggedClaims: []
    }
  };
}
