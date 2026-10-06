import React from "react";
import { useApp } from "../context/AppContext";
import { Badge } from "../components/Badge";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck, Download } from "lucide-react";

export const AlignmentReportPage: React.FC = () => {
  const { matchAnalysis, activeJd, setCurrentStep } = useApp();

  if (!matchAnalysis) {
    return (
      <div className="p-8 text-center text-slate-400">
        No alignment report available. Please generate a resume first.
      </div>
    );
  }

  const { overallScore, atsScore, skillsMatch, learningRoadmap } = matchAnalysis;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Official Report
          </div>
          <h1 className="text-2xl font-bold text-white">Resume ↔ JD Alignment Report</h1>
          <p className="text-xs text-slate-400 mt-1">
            Role: <strong className="text-cyan-300">{activeJd?.roleTitle || "Target Role"}</strong> at {activeJd?.company || "Target Company"}
          </p>
        </div>
        <button
          onClick={() => setCurrentStep("DASHBOARD")}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Resume & View History</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Score Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 uppercase font-semibold">Overall Alignment</p>
          <p className="text-3xl font-extrabold text-cyan-400 mt-1">{overallScore}%</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 uppercase font-semibold">ATS Compatibility</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{atsScore}/100</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 uppercase font-semibold">Matched Skills</p>
          <p className="text-3xl font-extrabold text-cyan-300 mt-1">{skillsMatch.matched.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 uppercase font-semibold">Roadmap Skills</p>
          <p className="text-3xl font-extrabold text-rose-400 mt-1">{learningRoadmap.length}</p>
        </div>
      </div>

      {/* Skill Match Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Matches */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4" /> What You Already Match
          </h2>
          <div className="space-y-1.5">
            {skillsMatch.matched.map((s, idx) => (
              <div key={idx} className="p-2 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-xs text-emerald-300">
                ✓ {s}
              </div>
            ))}
          </div>
        </div>

        {/* Partial Matches */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> What You Partially Match
          </h2>
          <div className="space-y-2">
            {skillsMatch.partial.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No partial overlaps.</p>
            ) : (
              skillsMatch.partial.map((s, idx) => (
                <div key={idx} className="p-2 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-300">
                  △ {s}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4" /> What You Are Missing
          </h2>
          <div className="space-y-1.5">
            {skillsMatch.missing.map((s, idx) => (
              <div key={idx} className="p-2 bg-rose-950/20 border border-rose-800/40 rounded-lg text-xs text-rose-300">
                ✗ {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prioritized Learning Roadmap */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">"What Should I Learn First?" Roadmap</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Prioritized skills required by the JD that are not yet in your candidate profile. (These are kept separate and NOT falsely added to your resume).
            </p>
          </div>
          <Badge variant="warning">Truth Safety Protected</Badge>
        </div>

        <div className="space-y-3">
          {learningRoadmap.map(item => (
            <div key={item.priority} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                  #{item.priority}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {item.skill}
                    <Badge variant={item.impact === "High" ? "danger" : "warning"}>{item.impact} Impact</Badge>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{item.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                <span>Difficulty: <strong className="text-slate-200">{item.difficulty}</strong></span>
                <span>Est. Time: <strong className="text-cyan-300">{item.learningTime}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Prep & Recommendations */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h2 className="text-base font-bold text-white mb-3">Interview Preparation & Resume Improvement Recommendations</h2>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold">1.</span>
            <span>Highlight your hands-on REST API architectural patterns and PostgreSQL schema optimization during technical rounds.</span>
          </li>
          <li className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold">2.</span>
            <span>Be prepared to discuss missing skills (like AWS and Kubernetes) honestly: explain your strong foundational understanding and how your Redis/Docker experience enables rapid onboarding.</span>
          </li>
          <li className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold">3.</span>
            <span>Ensure your GitHub project links (AuthForge, DevFlow) are clean, documented with clear README files, and included in your resume header.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
