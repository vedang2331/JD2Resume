import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { evaluateCandidateJdMatch, CandidateProfileData } from "../matching/match-engine.js";
import { extractKeywordsFromText } from "../matching/keyword-extractor.js";

const prisma = new PrismaClient();

export async function analyzeMatchHandler(req: Request, res: Response) {
  try {
    const { candidateId, jdId, rawText } = req.body;

    const candidateRecord = await prisma.candidateProfile.findFirst({
      where: candidateId ? { id: candidateId } : undefined,
      include: {
        skills: true,
        educations: true,
        experiences: true,
        projects: true,
        certifications: true
      }
    });

    if (!candidateRecord) {
      return res.status(404).json({ success: false, error: "Candidate profile not found." });
    }

    let parsedJd;
    if (jdId) {
      const jdRecord = await prisma.jobDescription.findUnique({ where: { id: jdId } });
      if (jdRecord) {
        parsedJd = {
          roleTitle: jdRecord.roleTitle,
          company: jdRecord.company || "Tech Company",
          location: jdRecord.location || "Remote",
          rawText: jdRecord.rawText,
          experienceRequired: jdRecord.experienceRequired || "0-2 years",
          educationRequired: jdRecord.educationRequired || "Bachelor's Degree",
          mandatorySkills: JSON.parse(jdRecord.mandatorySkills),
          preferredSkills: JSON.parse(jdRecord.preferredSkills),
          technologies: JSON.parse(jdRecord.technologies),
          responsibilities: JSON.parse(jdRecord.responsibilities),
          domainKeywords: JSON.parse(jdRecord.domainKeywords),
          softSkills: JSON.parse(jdRecord.softSkills),
          certifications: JSON.parse(jdRecord.certifications),
          keywords: JSON.parse(jdRecord.keywords)
        };
      }
    }

    if (!parsedJd && rawText) {
      parsedJd = extractKeywordsFromText(rawText);
    }

    if (!parsedJd) {
      return res.status(400).json({ success: false, error: "Please provide a valid Job Description." });
    }

    // Adapt database record to CandidateProfileData
    const candidateData: CandidateProfileData = {
      fullName: candidateRecord.fullName,
      email: candidateRecord.email,
      phone: candidateRecord.phone || undefined,
      location: candidateRecord.location || undefined,
      linkedIn: candidateRecord.linkedIn || undefined,
      gitHub: candidateRecord.gitHub || undefined,
      portfolio: candidateRecord.portfolio || undefined,
      summary: candidateRecord.summary || undefined,
      skills: candidateRecord.skills.map(s => ({
        skillName: s.skillName,
        category: s.category,
        proficiency: s.proficiency,
        yearsExperience: s.yearsExperience || undefined,
        explicitlyVerified: s.explicitlyVerified
      })),
      educations: candidateRecord.educations.map(e => ({
        degree: e.degree,
        institution: e.institution,
        specialization: e.specialization || undefined,
        gpa: e.gpa || undefined,
        graduationYear: e.graduationYear
      })),
      experiences: candidateRecord.experiences.map(exp => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        responsibilities: JSON.parse(exp.responsibilities),
        technologies: JSON.parse(exp.technologies),
        achievements: exp.achievements ? JSON.parse(exp.achievements) : undefined
      })),
      projects: candidateRecord.projects.map(p => ({
        projectName: p.projectName,
        description: p.description,
        technologies: JSON.parse(p.technologies),
        responsibilities: JSON.parse(p.responsibilities),
        githubUrl: p.githubUrl || undefined,
        liveUrl: p.liveUrl || undefined
      })),
      certifications: candidateRecord.certifications.map(c => ({
        name: c.name,
        issuer: c.issuer
      }))
    };

    const matchAnalysis = evaluateCandidateJdMatch(candidateData, parsedJd);

    return res.json({
      success: true,
      data: {
        matchAnalysis,
        parsedJd
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
