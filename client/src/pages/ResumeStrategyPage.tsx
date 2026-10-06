import React from "react";
import { useApp } from "../context/AppContext";
import { generateResume } from "../api/client";
import { Sliders, ShieldCheck, Sparkles, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export const ResumeStrategyPage: React.FC = () => {
  const {
    candidate,
    activeJd,
    mode,
    setMode,
    objective,
    setObjective,
    lengthPref,
    setLengthPref,
    setGeneratedResume,
    setMatchAnalysis,
    setCurrentStep,
    setError
  } = useApp();

  const handleGenerate = async () => {
    if (!candidate || !activeJd) {
      setError("Candidate profile or Job Description missing.");
      return;
    }
    try {
      setError(null);
      const result = await generateResume({
        candidateId: candidate.id || "",
        jdId: activeJd.id,
        rawText: activeJd.rawText,
        mode,
        objective,
        lengthPreference: lengthPref
      });

      setGeneratedResume(result.resume);
      setMatchAnalysis(result.matchReport);
      setCurrentStep("RESUME_EDITOR");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <Sliders className="w-7 h-7 text-cyan-400" /> Resume Generation Strategy
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Configure generation modes, objectives, and length limits. All modes strictly enforce the <strong>Truth-First Directive</strong>.
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Select Resume Mode</h2>

        {/* MODE 1 */}
        <div
          onClick={() => setMode("STRICT_PROFILE")}
          className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all ${
            mode === "STRICT_PROFILE"
              ? "border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  MODE 1 — STRICT PROFILE MODE <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">RECOMMENDED / SAFEST</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Only include information explicitly provided by the candidate. The JD determines ordering, emphasis, and project prioritization, but no new wording or candidate claims are introduced.
                </p>
              </div>
            </div>
            <input type="radio" checked={mode === "STRICT_PROFILE"} onChange={() => {}} className="accent-cyan-400" />
          </div>
        </div>

        {/* MODE 2 */}
        <div
          onClick={() => setMode("JD_OPTIMIZED")}
          className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all ${
            mode === "JD_OPTIMIZED"
              ? "border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-white">MODE 2 — JD OPTIMIZED MODE</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Rewrite candidate responsibilities and bullets using precise JD terminology and strong action verbs, strictly limited to tools the candidate has actually used.
                </p>
              </div>
            </div>
            <input type="radio" checked={mode === "JD_OPTIMIZED"} onChange={() => {}} className="accent-cyan-400" />
          </div>
        </div>

        {/* MODE 3 */}
        <div
          onClick={() => setMode("LEARNED_SKILLS")}
          className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all ${
            mode === "LEARNED_SKILLS"
              ? "border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-white">MODE 3 — LEARNED-SKILLS MODE</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Only include skills marked as Intermediate, Advanced, or Expert. Skills to learn are placed strictly in the Roadmap report.
                </p>
              </div>
            </div>
            <input type="radio" checked={mode === "LEARNED_SKILLS"} onChange={() => {}} className="accent-cyan-400" />
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Resume Length Preference</label>
          <select
            value={lengthPref}
            onChange={e => setLengthPref(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ONE_PAGE">One Page (Strict ATS Standard)</option>
            <option value="TWO_PAGES">Two Pages (For Experienced Candidates)</option>
            <option value="AUTO">Auto (Dynamic Length)</option>
          </select>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Keyword Strategy</label>
          <select
            value={objective}
            onChange={e => setObjective(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="BALANCED">Balanced + Truth First (Default)</option>
            <option value="MAX_ALIGNMENT">Maximum JD Alignment</option>
            <option value="CONSERVATIVE">Conservative / Interview-Safe</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-6"
      >
        <FileText className="w-5 h-5" />
        <span>Generate JD-Optimized ATS Resume</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
