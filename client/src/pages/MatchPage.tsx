import React from "react";
import { useApp } from "../context/AppContext";
import { Badge } from "../components/Badge";
import { CheckCircle2, AlertTriangle, XCircle, Info, ArrowRight, ShieldCheck } from "lucide-react";

export const MatchPage: React.FC = () => {
  const { matchAnalysis, setCurrentStep } = useApp();

  if (!matchAnalysis) {
    return (
      <div className="p-8 text-center text-slate-400">
        No Match Analysis generated. Please evaluate candidate match from the JD Analysis page.
      </div>
    );
  }

  const { overallScore, atsScore, breakdown, skillsMatch, keywordMatchMatrix } = matchAnalysis;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner & Match Scores */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <span className="text-3xl font-extrabold text-cyan-400">{overallScore}%</span>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Transparent Alignment Matrix
            </div>
            <h1 className="text-2xl font-bold text-white">Candidate ↔ JD Match Analysis</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              ATS Optimization Score: <strong className="text-cyan-300">{atsScore}/100</strong>.
              <br />
              <span className="text-[11px] text-slate-500 italic">
                * Note: Alignment score is an optimization indicator, not a guarantee of shortlist.
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentStep("STRATEGY")}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <span>Select Strategy & Generate Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Score Breakdown Bars */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-slate-300">
          Match Score Category Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Technical Skills", score: breakdown.technicalSkillsMatch },
            { label: "Experience Match", score: breakdown.experienceMatch },
            { label: "Project Relevance", score: breakdown.projectRelevance },
            { label: "Education Match", score: breakdown.educationMatch },
            { label: "Keyword Coverage", score: breakdown.keywordCoverage },
            { label: "Responsibilities", score: breakdown.responsibilityAlignment },
            { label: "Certifications", score: breakdown.certificationMatch },
            { label: "Domain Alignment", score: breakdown.domainAlignment }
          ].map((cat, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{cat.label}</span>
                <span className="font-bold text-cyan-400">{cat.score}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Comparison Categorization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matched */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4" /> Matched Skills ({skillsMatch.matched.length})
          </h2>
          <div className="space-y-1.5">
            {skillsMatch.matched.map((s, idx) => (
              <div key={idx} className="p-2 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-[10px] text-emerald-500">✓ Grounded</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partial Matches */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> Partial / Related ({skillsMatch.partial.length})
          </h2>
          <div className="space-y-2">
            {skillsMatch.partial.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No partial skill overlaps.</p>
            ) : (
              skillsMatch.related.map((rel, idx) => (
                <div key={idx} className="p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs">
                  <div className="font-semibold text-amber-300">JD: {rel.jdSkill}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{rel.note}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4" /> Missing Skills ({skillsMatch.missing.length})
          </h2>
          <p className="text-[11px] text-slate-400 mb-2 italic">
            * Truth Directive: Missing skills are NEVER added falsely to your resume. They appear in your Learning Roadmap.
          </p>
          <div className="space-y-1.5">
            {skillsMatch.missing.map((s, idx) => (
              <div key={idx} className="p-2 bg-rose-950/20 border border-rose-800/40 rounded-lg text-xs text-rose-300 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-[10px] text-rose-500">Roadmap Only</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyword Coverage Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" /> Keyword Audit & Grounding Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Keyword / Skill</th>
                <th className="p-3">Category</th>
                <th className="p-3">Candidate Profile Has It?</th>
                <th className="p-3">Resume Placement</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {keywordMatchMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">{item.keyword}</td>
                  <td className="p-3"><Badge variant="neutral">{item.category}</Badge></td>
                  <td className="p-3">
                    {item.candidateHasIt ? (
                      <span className="text-emerald-400 font-semibold">Yes (Verified)</span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-300">{item.foundSection}</td>
                  <td className="p-3">
                    {item.status === "MATCHED" ? (
                      <Badge variant="success">MATCHED</Badge>
                    ) : (
                      <Badge variant="danger">MISSING</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
