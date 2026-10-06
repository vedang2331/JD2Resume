import { useApp } from "../context/AppContext";
import { analyzeMatch } from "../api/client";
import { Badge } from "../components/Badge";
import { Briefcase, Building, MapPin, CheckCircle2, Star, Cpu, ArrowRight } from "lucide-react";

export const JdAnalysisPage: React.FC = () => {
  const { activeJd, candidate, setMatchAnalysis, setCurrentStep, setError } = useApp();

  if (!activeJd) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active Job Description found. Please go back and enter a JD.
      </div>
    );
  }

  const handleProceedToMatch = async () => {
    if (!candidate) return;
    try {
      const match = await analyzeMatch(candidate.id || "", activeJd.id, activeJd.rawText);
      setMatchAnalysis(match.matchAnalysis);
      setCurrentStep("MATCH");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{activeJd.roleTitle}</h1>
            <Badge variant="info">{activeJd.company}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-cyan-400" /> {activeJd.company}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {activeJd.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-cyan-400" /> {activeJd.experienceRequired}</span>
          </div>
        </div>
        <button
          onClick={handleProceedToMatch}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <span>Evaluate Candidate Match</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mandatory Skills */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mandatory Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {activeJd.mandatorySkills.map((skill, idx) => (
              <Badge key={idx} variant="success" size="md">{skill}</Badge>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-400" /> Preferred / Nice-to-Have Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {activeJd.preferredSkills.map((skill, idx) => (
              <Badge key={idx} variant="warning" size="md">{skill}</Badge>
            ))}
          </div>
        </div>

        {/* Extracted Technologies */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-cyan-400" /> All Detected Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {activeJd.technologies.map((tech, idx) => (
              <Badge key={idx} variant="info" size="sm">{tech}</Badge>
            ))}
          </div>
        </div>

        {/* Requirements & Qualifications */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-white mb-2">Qualifications & Education</h2>
          <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            {activeJd.educationRequired}
          </p>
        </div>

        {/* Responsibilities */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 md:col-span-2">
          <h2 className="text-sm font-bold text-white mb-3">Extracted Role Responsibilities</h2>
          <ul className="space-y-2 text-xs text-slate-300">
            {activeJd.responsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
