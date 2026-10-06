import { TECHNICAL_TAXONOMY, normalizeSkillName } from "./taxonomy.js";

export interface ParsedJobDescription {
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

const COMMON_SOFT_SKILLS = [
  "communication", "teamwork", "problem solving", "leadership", "critical thinking",
  "collaboration", "adaptability", "time management", "analytical skills", "ownership"
];

const DOMAIN_KEYWORDS = [
  "fintech", "e-commerce", "ecommerce", "saas", "healthcare", "banking", "finance",
  "cybersecurity", "ai/ml", "data science", "edtech", "supply chain", "logistics"
];

export function extractKeywordsFromText(rawText: string): ParsedJobDescription {
  const text = rawText || "";
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Role title detection
  let roleTitle = "Software Engineer";
  const titleMatch = text.match(/(?:title|role|position):\s*([^\n]+)/i) ||
                     lines.find(l => /engineer|developer|architect|analyst|specialist/i.test(l));
  if (titleMatch) {
    roleTitle = typeof titleMatch === "string" ? titleMatch : titleMatch[1] || roleTitle;
    roleTitle = roleTitle.replace(/^(Job Title|Role|Position):\s*/i, "").trim();
  }

  // Company detection
  let company = "Tech Company";
  const companyMatch = text.match(/(?:company|organization):\s*([^\n]+)/i);
  if (companyMatch && companyMatch[1]) {
    company = companyMatch[1].trim();
  }

  // Location detection
  let location = "Remote / Hybrid";
  const locMatch = text.match(/(?:location|place):\s*([^\n]+)/i);
  if (locMatch && locMatch[1]) {
    location = locMatch[1].trim();
  }

  // Experience requirement
  let experienceRequired = "0-2 years";
  const expMatch = text.match(/(\d+\s*[-+to]*\s*\d*\s*years?\b(?:\s*of\s*experience)?)/i);
  if (expMatch) {
    experienceRequired = expMatch[1].trim();
  }

  // Education requirement
  let educationRequired = "Bachelor's degree in Computer Science or related field";
  const eduMatch = text.match(/(bachelor'?s?|master'?s?|phd|b\.?e\.?|b\.?tech|m\.?tech|computer science|engineering)/i);
  if (eduMatch) {
    educationRequired = eduMatch[0].trim();
  }

  // Technical skill extraction using taxonomy
  const foundSkills = new Set<string>();
  const mandatorySet = new Set<string>();
  const preferredSet = new Set<string>();

  // Helper scan for known taxonomy skills
  for (const category of Object.keys(TECHNICAL_TAXONOMY)) {
    for (const skill of TECHNICAL_TAXONOMY[category]) {
      // Regex pattern with boundary protection
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        const canonical = normalizeSkillName(skill);
        foundSkills.add(canonical);

        // Distinguish mandatory vs preferred based on section context
        const lowerText = text.toLowerCase();
        const skillIdx = lowerText.indexOf(skill.toLowerCase());
        const precedingText = lowerText.substring(Math.max(0, skillIdx - 150), skillIdx);

        if (/preferred|nice to have|plus|bonus|optional/i.test(precedingText)) {
          preferredSet.add(canonical);
        } else {
          mandatorySet.add(canonical);
        }
      }
    }
  }

  // Responsibilities extraction
  const responsibilities: string[] = [];
  let inRespSection = false;
  for (const line of lines) {
    if (/responsibilities|what you'?ll do|duties|key tasks/i.test(line)) {
      inRespSection = true;
      continue;
    }
    if (inRespSection && /requirements|qualifications|skills|about you/i.test(line)) {
      inRespSection = false;
    }
    if (inRespSection && (line.startsWith("-") || line.startsWith("•") || line.startsWith("*"))) {
      responsibilities.push(line.replace(/^[-•*]\s*/, "").trim());
    }
  }
  if (responsibilities.length === 0) {
    // Fallback bullet points
    responsibilities.push(
      `Develop and maintain features for ${roleTitle} tasks.`,
      `Collaborate with cross-functional teams to deliver quality software.`,
      `Participate in code reviews, testing, and documentation.`
    );
  }

  // Soft skills detection
  const softSkills = COMMON_SOFT_SKILLS.filter(s =>
    new RegExp(`\\b${s}\\b`, 'i').test(text)
  );

  // Domain terms detection
  const domainKeywords = DOMAIN_KEYWORDS.filter(d =>
    new RegExp(`\\b${d}\\b`, 'i').test(text)
  );

  // Certifications
  const certMatch = text.match(/(aws certified|azure certified|pmp|ckad|cka|cissp|scrum master|comptia)/gi);
  const certifications = certMatch ? Array.from(new Set(certMatch.map(c => c.trim()))) : [];

  const allTech = Array.from(foundSkills);
  const mandatorySkills = Array.from(mandatorySet).length > 0 ? Array.from(mandatorySet) : allTech.slice(0, Math.ceil(allTech.length * 0.7));
  const preferredSkills = Array.from(preferredSet).length > 0 ? Array.from(preferredSet) : allTech.slice(Math.ceil(allTech.length * 0.7));

  return {
    roleTitle,
    company,
    location,
    rawText: text,
    experienceRequired,
    educationRequired,
    mandatorySkills,
    preferredSkills,
    technologies: allTech,
    responsibilities,
    domainKeywords,
    softSkills,
    certifications,
    keywords: Array.from(new Set([...allTech, ...domainKeywords, ...softSkills]))
  };
}
