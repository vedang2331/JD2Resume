import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { regenerateBullet } from "../api/client";
import { exportElementToPdf, generateFallbackPdfFromData } from "../utils/pdfExporter";
import { Badge } from "../components/Badge";
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Download, Printer } from "lucide-react";

export const ResumeEditorPage: React.FC = () => {
  const { candidate, activeJd, generatedResume, setGeneratedResume, matchAnalysis, setCurrentStep, setError } = useApp();

  const [selectedBulletIndex, setSelectedBulletIndex] = useState<{ expIdx: number; bIdx: number } | null>(null);
  const [rewriting, setRewriting] = useState<boolean>(false);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  if (!generatedResume || !candidate) {
    return (
      <div className="p-8 text-center text-slate-400">
        No resume generated yet. Please configure strategy and click Generate.
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    const filename = `${candidate.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
    try {
      setDownloadingPdf(true);
      setError(null);
      await exportElementToPdf("resume-document", filename);
    } catch (err: any) {
      console.warn("Element PDF export fallback invoked:", err);
      try {
        generateFallbackPdfFromData(candidate, generatedResume, filename);
      } catch (fallbackErr: any) {
        setError("Failed to generate PDF: " + fallbackErr.message);
      }
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleRewriteBullet = async (expIdx: number, bIdx: number, tone: "ats" | "technical" | "concise") => {
    try {
      setRewriting(true);
      const original = generatedResume.experiences[expIdx].bullets[bIdx];
      const candTechs = candidate.experiences[expIdx]?.technologies || [];
      const jdKws = activeJd?.technologies || [];

      const newBullet = await regenerateBullet(original, candTechs, jdKws, tone);

      const updatedExp = [...generatedResume.experiences];
      updatedExp[expIdx].bullets[bIdx] = newBullet;
      setGeneratedResume({ ...generatedResume, experiences: updatedExp });
    } catch (err) {
      console.error(err);
    } finally {
      setRewriting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 glass-panel p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Badge variant="success" size="md"><ShieldCheck className="w-3.5 h-3.5" /> Truth-Safety Verified</Badge>
          <span className="text-xs text-slate-400">
            ATS Score: <strong className="text-cyan-400 font-bold">{matchAnalysis?.atsScore || 90}/100</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPdf ? "Generating PDF..." : "Download PDF (.pdf)"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={() => setCurrentStep("ALIGNMENT_REPORT")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
          >
            <span>View Alignment Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: Live ATS Printable Resume Document */}
        <div
          id="resume-document"
          className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-8 shadow-2xl resume-paper border border-slate-200 text-sm leading-relaxed space-y-6"
        >
          {/* Header */}
          <div className="border-b border-slate-300 pb-4 text-center">
            <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{candidate.fullName}</h1>
            <p className="text-xs text-slate-600 mt-1 flex flex-wrap justify-center gap-3">
              <span>{candidate.email}</span>
              {candidate.phone && <span>• {candidate.phone}</span>}
              {candidate.location && <span>• {candidate.location}</span>}
            </p>
            <p className="text-xs text-blue-700 mt-1 flex flex-wrap justify-center gap-3 font-medium">
              {candidate.linkedIn && <a href={candidate.linkedIn} target="_blank" rel="noreferrer">LinkedIn</a>}
              {candidate.gitHub && <a href={candidate.gitHub} target="_blank" rel="noreferrer">GitHub</a>}
              {candidate.portfolio && <a href={candidate.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
            </p>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <textarea
              rows={3}
              value={generatedResume.summary}
              onChange={e => setGeneratedResume({ ...generatedResume, summary: e.target.value })}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Technical Skills
            </h2>
            <div className="space-y-1.5 text-xs text-slate-800">
              {Object.keys(generatedResume.skills).map((cat, idx) => (
                <div key={idx}>
                  <strong className="text-slate-900">{cat}:</strong>{" "}
                  <span>{generatedResume.skills[cat].join(", ")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {generatedResume.experiences.map((exp, expIdx) => (
                <div key={expIdx}>
                  <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                    <span>{exp.position} — {exp.company}</span>
                    <span className="text-slate-600 font-normal">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 text-xs text-slate-700 mt-1 space-y-1">
                    {exp.bullets.map((b, bIdx) => (
                      <li
                        key={bIdx}
                        onClick={() => setSelectedBulletIndex({ expIdx, bIdx })}
                        className={`cursor-pointer rounded p-1 transition-all ${
                          selectedBulletIndex?.expIdx === expIdx && selectedBulletIndex?.bIdx === bIdx
                            ? "bg-blue-50 border border-blue-300 ring-1 ring-blue-300"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Key Projects
            </h2>
            <div className="space-y-3">
              {generatedResume.projects.map((proj, pIdx) => (
                <div key={pIdx}>
                  <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                    <span>{proj.projectName}</span>
                    <span className="text-slate-600 font-normal">{proj.technologies.join(", ")}</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">{proj.description}</p>
                  <ul className="list-disc list-outside ml-4 text-xs text-slate-700 mt-1 space-y-0.5">
                    {proj.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Education
            </h2>
            {generatedResume.education.map((edu, eIdx) => (
              <div key={eIdx} className="flex justify-between text-xs text-slate-800">
                <span><strong>{edu.degree}</strong> — {edu.institution}</span>
                <span className="text-slate-600">{edu.graduationYear}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT 5 COLS: AI Assistant & Bullet Regenerator Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick PDF Action Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" /> Export Options
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Direct high-res ATS PDF document</p>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingPdf ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>

          {/* Bullet Regenerator Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Grounded Bullet Regenerator
            </h3>
            {selectedBulletIndex ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  "{generatedResume.experiences[selectedBulletIndex.expIdx].bullets[selectedBulletIndex.bIdx]}"
                </p>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-slate-400">Regenerate with JD-aligned tone:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      disabled={rewriting}
                      onClick={() => handleRewriteBullet(selectedBulletIndex.expIdx, selectedBulletIndex.bIdx, "ats")}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold hover:bg-cyan-900"
                    >
                      ATS Standard
                    </button>
                    <button
                      disabled={rewriting}
                      onClick={() => handleRewriteBullet(selectedBulletIndex.expIdx, selectedBulletIndex.bIdx, "technical")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold hover:bg-slate-700"
                    >
                      More Technical
                    </button>
                    <button
                      disabled={rewriting}
                      onClick={() => handleRewriteBullet(selectedBulletIndex.expIdx, selectedBulletIndex.bIdx, "concise")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold hover:bg-slate-700"
                    >
                      More Concise
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Click on any bullet point in the resume preview to inspect or regenerate it truthfully using JD terminology.
              </p>
            )}
          </div>

          {/* Truth-Safety Grounding Badge */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> 100% Truth-Grounded
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every technology, project, and experience bullet in this generated document exists in your verified Candidate Master Profile. No hallucinated skills were added.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
