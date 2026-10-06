import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { fetchSavedResumes } from "../api/client";
import { Badge } from "../components/Badge";
import { History, FileText, Download, FileCode, CheckCircle2, ShieldCheck } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { generatedResume, candidate, setCurrentStep } = useApp();
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSavedResumes()
      .then(res => setSavedResumes(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const exportAsPdf = () => {
    window.print();
  };

  const exportAsTxt = () => {
    if (!generatedResume || !candidate) return;
    let txt = `${candidate.fullName.toUpperCase()}\nEmail: ${candidate.email} | Phone: ${candidate.phone || ""}\nLinkedIn: ${candidate.linkedIn || ""} | GitHub: ${candidate.gitHub || ""}\n\n`;
    txt += `SUMMARY\n${generatedResume.summary}\n\n`;
    txt += `SKILLS\n`;
    for (const cat of Object.keys(generatedResume.skills)) {
      txt += `${cat}: ${generatedResume.skills[cat].join(", ")}\n`;
    }
    txt += `\nEXPERIENCE\n`;
    for (const exp of generatedResume.experiences) {
      txt += `${exp.position} - ${exp.company} (${exp.startDate} - ${exp.endDate})\n`;
      for (const b of exp.bullets) {
        txt += `- ${b}\n`;
      }
    }
    txt += `\nPROJECTS\n`;
    for (const p of generatedResume.projects) {
      txt += `${p.projectName} (${p.technologies.join(", ")})\n${p.description}\n`;
      for (const b of p.bullets) {
        txt += `- ${b}\n`;
      }
    }

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidate.fullName.replace(/\s+/g, "_")}_Resume.txt`;
    a.click();
  };

  const exportAsMarkdown = () => {
    if (!generatedResume || !candidate) return;
    let md = `# ${candidate.fullName}\n${candidate.email} | ${candidate.phone || ""} | [LinkedIn](${candidate.linkedIn || ""}) | [GitHub](${candidate.gitHub || ""})\n\n`;
    md += `## Professional Summary\n${generatedResume.summary}\n\n`;
    md += `## Technical Skills\n`;
    for (const cat of Object.keys(generatedResume.skills)) {
      md += `- **${cat}**: ${generatedResume.skills[cat].join(", ")}\n`;
    }
    md += `\n## Experience\n`;
    for (const exp of generatedResume.experiences) {
      md += `### ${exp.position} — ${exp.company}\n_${exp.startDate} – ${exp.endDate}_\n`;
      for (const b of exp.bullets) {
        md += `- ${b}\n`;
      }
    }
    md += `\n## Projects\n`;
    for (const p of generatedResume.projects) {
      md += `### ${p.projectName}\n_${p.technologies.join(", ")}_\n${p.description}\n`;
      for (const b of p.bullets) {
        md += `- ${b}\n`;
      }
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidate.fullName.replace(/\s+/g, "_")}_Resume.md`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Export Action Card */}
      {generatedResume && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-cyan-400" /> Export Active Resume
              </h2>
              <p className="text-xs text-slate-400 mt-1">Download your job-tailored ATS resume in multiple formats.</p>
            </div>
            <Badge variant="success"><ShieldCheck className="w-3.5 h-3.5" /> Truth Verified</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={exportAsPdf}
              className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-center transition-all group"
            >
              <FileText className="w-7 h-7 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-white">Print / PDF</div>
              <p className="text-[10px] text-slate-400 mt-1">ATS Printable PDF</p>
            </button>

            <button
              onClick={exportAsTxt}
              className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-center transition-all group"
            >
              <FileText className="w-7 h-7 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-white">Plain Text (.txt)</div>
              <p className="text-[10px] text-slate-400 mt-1">Direct ATS Copy/Paste</p>
            </button>

            <button
              onClick={exportAsMarkdown}
              className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-center transition-all group"
            >
              <FileCode className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-white">Markdown (.md)</div>
              <p className="text-[10px] text-slate-400 mt-1">For Developers</p>
            </button>

            <button
              onClick={() => setCurrentStep("RESUME_EDITOR")}
              className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-center transition-all group"
            >
              <CheckCircle2 className="w-7 h-7 text-sky-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-white">Edit Resume</div>
              <p className="text-[10px] text-slate-400 mt-1">Back to Editor</p>
            </button>
          </div>
        </div>
      )}

      {/* Version Management History */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Saved Job-Specific Resume Versions</h2>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">Loading saved versions...</p>
        ) : savedResumes.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No saved resume versions found in database.</p>
        ) : (
          <div className="space-y-3">
            {savedResumes.map(r => (
              <div key={r.id} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{r.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Mode: <Badge variant="info">{r.mode}</Badge></span>
                    <span>Overall Score: <strong className="text-cyan-400">{r.overallScore}%</strong></span>
                    <span>ATS Score: <strong className="text-emerald-400">{r.atsScore}/100</strong></span>
                    <span>Created: {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep("RESUME_EDITOR")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 border border-slate-700"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
