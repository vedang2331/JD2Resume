export interface CandidateSkill {
  id?: string;
  skillName: string;
  category: string;
  proficiency: "Beginner" | "Familiar" | "Intermediate" | "Advanced" | "Expert";
  yearsExperience?: number;
  explicitlyVerified?: boolean;
  notes?: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  specialization?: string;
  gpa?: string;
  graduationYear: string;
  relevantCoursework?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location?: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
  metrics?: string[];
}

export interface Project {
  id?: string;
  projectName: string;
  description: string;
  problemSolved?: string;
  technologies: string[];
  responsibilities: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface CandidateProfile {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
  summary?: string;
  skills: CandidateSkill[];
  educations: Education[];
  experiences: Experience[];
  projects: Project[];
  certifications?: Certification[];
}

export interface ParsedJobDescription {
  id?: string;
  roleTitle: string;
  company: string;
  location: string;
  rawText: string;
  experienceRequired: string;
  educationRequired: string;
  mandatorySkills: string[];
  preferredSkills: string[];
  technologies: string[];
  responsibilities: string[];
  domainKeywords: string[];
  softSkills: string[];
  certifications: string[];
  keywords: string[];
}

export interface MatchAnalysis {
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
  skillsMatch: {
    matched: string[];
    partial: string[];
    missing: string[];
    related: Array<{ jdSkill: string; candidateSkill: string; note: string }>;
  };
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

export interface GeneratedResume {
  summary: string;
  skills: Record<string, string[]>;
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }>;
  projects: Array<{
    projectName: string;
    description: string;
    bullets: string[];
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduationYear: string;
    gpa?: string;
    coursework?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
  }>;
}

export type AppStep =
  | "PROFILE"
  | "JD_INPUT"
  | "JD_ANALYSIS"
  | "MATCH"
  | "STRATEGY"
  | "RESUME_EDITOR"
  | "ALIGNMENT_REPORT"
  | "DASHBOARD";
