import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { extractKeywordsFromText } from "../matching/keyword-extractor.js";

const prisma = new PrismaClient();

export async function parseJdHandler(req: Request, res: Response) {
  try {
    let rawText = req.body.rawText || "";
    
    // If file was uploaded via multer, parse text from PDF or DOCX buffer
    if (req.file) {
      const buffer = req.file.buffer;
      const mime = req.file.mimetype;
      if (mime.includes("pdf")) {
        const pdfParse = (await import("pdf-parse")).default;
        const pdfData = await pdfParse(buffer);
        rawText = pdfData.text;
      } else if (mime.includes("word") || mime.includes("docx")) {
        const mammoth = await import("mammoth");
        const docxData = await mammoth.extractRawText({ buffer });
        rawText = docxData.value;
      } else {
        rawText = buffer.toString("utf-8");
      }
    }

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Please provide raw text or upload a valid JD document." });
    }

    const parsed = extractKeywordsFromText(rawText);

    // Save to database
    const savedJd = await prisma.jobDescription.create({
      data: {
        roleTitle: parsed.roleTitle,
        company: parsed.company,
        location: parsed.location,
        rawText: parsed.rawText,
        experienceRequired: parsed.experienceRequired,
        educationRequired: parsed.educationRequired,
        mandatorySkills: JSON.stringify(parsed.mandatorySkills),
        preferredSkills: JSON.stringify(parsed.preferredSkills),
        technologies: JSON.stringify(parsed.technologies),
        responsibilities: JSON.stringify(parsed.responsibilities),
        domainKeywords: JSON.stringify(parsed.domainKeywords),
        softSkills: JSON.stringify(parsed.softSkills),
        certifications: JSON.stringify(parsed.certifications),
        keywords: JSON.stringify(parsed.keywords)
      }
    });

    return res.json({
      success: true,
      data: {
        id: savedJd.id,
        parsed
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
