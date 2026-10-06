import React from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, ShieldCheck, UserCheck, FileSearch, Layers, Sliders, FileText, CheckCircle2, History } from "lucide-react";
import { AppStep } from "../types";

export const Header: React.FC = () => {
  const { currentStep, setCurrentStep } = useApp();

  const navItems: Array<{ id: AppStep; label: string; icon: React.ReactNode }> = [
    { id: "PROFILE", label: "Candidate Profile", icon: <UserCheck className="w-4 h-4" /> },
    { id: "JD_INPUT", label: "Job Description", icon: <FileSearch className="w-4 h-4" /> },
    { id: "JD_ANALYSIS", label: "JD Analysis", icon: <Layers className="w-4 h-4" /> },
    { id: "MATCH", label: "Match Matrix", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "STRATEGY", label: "Strategy & Mode", icon: <Sliders className="w-4 h-4" /> },
    { id: "RESUME_EDITOR", label: "ATS Resume Builder", icon: <FileText className="w-4 h-4" /> },
    { id: "ALIGNMENT_REPORT", label: "Alignment Report", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "DASHBOARD", label: "Saved Resumes", icon: <History className="w-4 h-4" /> }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentStep("PROFILE")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                JD<span className="text-cyan-400">2</span>Resume
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  Truth-First AI
                </span>
              </span>
              <p className="text-xs text-slate-400 hidden sm:block">Intelligent Job Description Based Resume Builder</p>
            </div>
          </div>

          {/* Nav Actions */}
          <button
            onClick={() => setCurrentStep("DASHBOARD")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>My Resumes</span>
          </button>
        </div>

        {/* Step Indicator Navigation Bar */}
        <div className="flex items-center justify-start gap-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/60">
          {navItems.map((item, idx) => {
            const isActive = currentStep === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentStep(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
