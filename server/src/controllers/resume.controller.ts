import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateJdOptimizedResume, rewriteSingleBulletTruthfully } from "../ai/llm-client.js";
import { evaluateCandidateJdMatch, CandidateProfileData } from "../matching/match-engine.js";
import { auditResumeClaimsTruth } from "../services/truth-validator.service.js";
import { extractKeywordsFromText } from "../matching/keyword-extractor.js";

const prisma = new PrismaClient();

export async function generateResumeHandler(req: Request, res: Response) {
  try {
    const { candidateId, jdId, rawText, mode = "STRICT_PROFILE", objective = "BALANCED", lengthPreference = "ONE_PAGE" } = req.body;

    const candidateRecord = await prisma.candidateProfile.findFirst({
      where: candidateId ? { id: candidateId } : undefined,
      include: {
        skills: true,
        educations: true,
        experiences: true,
        projects: true,
        certifications: true,
        achievements: true
      }
    });

    if (!candidateRecord) {
      return res.status(404).json({ success: false, error: "Candidate profile not found." });
    }

    let parsedJd;
    let actualJdId = jdId;

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
      const newJd = await prisma.jobDescription.create({
        data: {
          roleTitle: parsedJd.roleTitle,
          company: parsedJd.company,
          location: parsedJd.location,
          rawText: parsedJd.rawText,
          mandatorySkills: JSON.stringify(parsedJd.mandatorySkills),
          preferredSkills: JSON.stringify(parsedJd.preferredSkills),
          technologies: JSON.stringify(parsedJd.technologies),
          responsibilities: JSON.stringify(parsedJd.responsibilities),
          domainKeywords: JSON.stringify(parsedJd.domainKeywords),
          softSkills: JSON.stringify(parsedJd.softSkills),
          certifications: JSON.stringify(parsedJd.certifications),
          keywords: JSON.stringify(parsedJd.keywords)
        }
      });
      actualJdId = newJd.id;
    }

    if (!parsedJd) {
      return res.status(400).json({ success: false, error: "Please provide a valid Job Description." });
    }

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

    // 1. Generate Resume Document
    const generatedResume = await generateJdOptimizedResume(candidateData, parsedJd, mode);

    // 2. Perform Truth-Safety Claim Auditor Check
    const truthValidation = auditResumeClaimsTruth(candidateData, generatedResume);

    // 3. Evaluate Match & ATS score
    const matchAnalysis = evaluateCandidateJdMatch(candidateData, parsedJd);
    matchAnalysis.truthValidation = {
      passed: truthValidation.isTruthful,
      flaggedClaims: truthValidation.unsupportedClaims.map(c => `${c.claim} (${c.section})`)
    };

    // 4. Save Version to Database
    const savedResume = await prisma.resumeVersion.create({
      data: {
        title: `${parsedJd.roleTitle} - ${parsedJd.company || "Target Job"}`,
        candidateId: candidateRecord.id,
        jobDescriptionId: actualJdId,
        mode,
        objective,
        lengthPreference,
        resumeJson: JSON.stringify(generatedResume),
        matchReportJson: JSON.stringify(matchAnalysis),
        overallScore: matchAnalysis.overallScore,
        atsScore: matchAnalysis.atsScore
      }
    });

    return res.json({
      success: true,
      data: {
        id: savedResume.id,
        title: savedResume.title,
        mode: savedResume.mode,
        resume: generatedResume,
        matchReport: matchAnalysis,
        truthValidation
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function regenerateBulletHandler(req: Request, res: Response) {
  try {
    const { originalBullet, candidateTechnologies = [], jdKeywords = [], tone = "ats" } = req.body;
    const rewritten = rewriteSingleBulletTruthfully(originalBullet, candidateTechnologies, jdKeywords, tone);
    return res.json({ success: true, data: { rewritten } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function listResumesHandler(req: Request, res: Response) {
  try {
    const resumes = await prisma.resumeVersion.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        jobDescription: {
          select: { roleTitle: true, company: true }
        }
      }
    });
    return res.json({ success: true, data: resumes });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getResumeByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const resumeRecord = await prisma.resumeVersion.findUnique({
      where: { id },
      include: { candidate: true, jobDescription: true }
    });
    if (!resumeRecord) {
      return res.status(404).json({ success: false, error: "Resume version not found." });
    }
    return res.json({
      success: true,
      data: {
        id: resumeRecord.id,
        title: resumeRecord.title,
        mode: resumeRecord.mode,
        resume: JSON.parse(resumeRecord.resumeJson),
        matchReport: JSON.parse(resumeRecord.matchReportJson),
        overallScore: resumeRecord.overallScore,
        atsScore: resumeRecord.atsScore,
        createdAt: resumeRecord.createdAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
