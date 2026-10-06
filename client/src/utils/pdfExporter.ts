import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { GeneratedResume, CandidateProfile } from "../types";

export async function exportElementToPdf(
  elementId: string = "resume-document",
  filename: string = "Resume.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Resume document container not found. Please open the ATS Resume Builder tab first.");
  }

  // Create canvas from element at high scale
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: 800
  });

  const imgData = canvas.toDataURL("image/png");

  // Standard A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(filename);
}

export function generateFallbackPdfFromData(
  candidate: CandidateProfile,
  resume: GeneratedResume,
  filename: string = "Resume.pdf"
): void {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let y = 15;
  const margin = 15;
  const pageWidth = 210 - margin * 2;

  // Header Name
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(candidate.fullName.toUpperCase(), 105, y, { align: "center" });
  y += 7;

  // Contact Info
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  const contactText = `${candidate.email} | ${candidate.phone || ""} | ${candidate.location || ""}`;
  pdf.text(contactText, 105, y, { align: "center" });
  y += 5;

  const links = [candidate.linkedIn, candidate.gitHub, candidate.portfolio].filter(Boolean).join(" | ");
  if (links) {
    pdf.text(links, 105, y, { align: "center" });
    y += 7;
  } else {
    y += 2;
  }

  // Divider Line
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, 210 - margin, y);
  y += 6;

  // Section Header Helper
  const addSectionHeader = (title: string) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(title.toUpperCase(), margin, y);
    y += 2;
    pdf.setLineWidth(0.2);
    pdf.line(margin, y, 210 - margin, y);
    y += 5;
  };

  // Summary
  addSectionHeader("Professional Summary");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  const summaryLines = pdf.splitTextToSize(resume.summary, pageWidth);
  pdf.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 4;

  // Skills
  addSectionHeader("Technical Skills");
  pdf.setFontSize(9);
  for (const cat of Object.keys(resume.skills)) {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${cat}: `, margin, y);
    const catWidth = pdf.getTextWidth(`${cat}: `);
    pdf.setFont("helvetica", "normal");
    const skillList = resume.skills[cat].join(", ");
    const skillLines = pdf.splitTextToSize(skillList, pageWidth - catWidth);
    pdf.text(skillLines, margin + catWidth, y);
    y += skillLines.length * 4 + 1;
  }
  y += 4;

  // Experience
  if (resume.experiences.length > 0) {
    addSectionHeader("Professional Experience");
    for (const exp of resume.experiences) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(`${exp.position} - ${exp.company}`, margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(`${exp.startDate} - ${exp.endDate}`, 210 - margin, y, { align: "right" });
      y += 5;

      for (const b of exp.bullets) {
        const bulletLines = pdf.splitTextToSize(`• ${b}`, pageWidth - 5);
        pdf.text(bulletLines, margin + 3, y);
        y += bulletLines.length * 4;
      }
      y += 3;
    }
  }

  // Projects
  if (resume.projects.length > 0) {
    addSectionHeader("Key Projects");
    for (const proj of resume.projects) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(proj.projectName, margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(proj.technologies.join(", "), 210 - margin, y, { align: "right" });
      y += 4;

      pdf.setFontSize(9);
      for (const b of proj.bullets) {
        const bulletLines = pdf.splitTextToSize(`• ${b}`, pageWidth - 5);
        pdf.text(bulletLines, margin + 3, y);
        y += bulletLines.length * 4;
      }
      y += 3;
    }
  }

  // Education
  if (resume.education.length > 0) {
    addSectionHeader("Education");
    for (const edu of resume.education) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text(`${edu.degree} - ${edu.institution}`, margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.text(edu.graduationYear, 210 - margin, y, { align: "right" });
      y += 5;
    }
  }

  pdf.save(filename);
}
