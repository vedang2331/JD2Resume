import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Plus, Trash2, CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { Badge } from "../components/Badge";

export const ProfilePage: React.FC = () => {
  const { candidate, setCandidate, setCurrentStep } = useApp();

  const [activeTab, setActiveTab] = useState<"personal" | "skills" | "experience" | "projects" | "education">("personal");

  if (!candidate) {
    return <div className="p-8 text-center text-slate-400">Loading Candidate Profile...</div>;
  }

  const handlePersonalChange = (field: string, val: string) => {
    setCandidate({ ...candidate, [field]: val });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Truth-First Candidate Grounding
          </div>
          <h1 className="text-2xl font-bold text-white">Candidate Master Profile</h1>
          <p className="text-sm text-slate-400 mt-1">
            Enter your verified skills, experience, and projects. JD2Resume strictly grounds every resume claim in this profile.
          </p>
        </div>
        <button
          onClick={() => setCurrentStep("JD_INPUT")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <span>Proceed to Job Description</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: "personal", label: "Personal Info" },
          { id: "skills", label: `Skills (${candidate.skills.length})` },
          { id: "experience", label: `Experience (${candidate.experiences.length})` },
          { id: "projects", label: `Projects (${candidate.projects.length})` },
          { id: "education", label: `Education (${candidate.educations.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === t.id
                ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
              </label>
              <input
                type="text"
                value={candidate.fullName}
                onChange={e => handlePersonalChange("fullName", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
              </label>
              <input
                type="email"
                value={candidate.email}
                onChange={e => handlePersonalChange("email", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> Phone Number
              </label>
              <input
                type="text"
                value={candidate.phone || ""}
                onChange={e => handlePersonalChange("phone", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location
              </label>
              <input
                type="text"
                value={candidate.location || ""}
                onChange={e => handlePersonalChange("location", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" /> LinkedIn URL
              </label>
              <input
                type="text"
                value={candidate.linkedIn || ""}
                onChange={e => handlePersonalChange("linkedIn", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-cyan-400" /> GitHub Profile
              </label>
              <input
                type="text"
                value={candidate.gitHub || ""}
                onChange={e => handlePersonalChange("gitHub", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Professional Master Summary</label>
              <textarea
                rows={3}
                value={candidate.summary || ""}
                onChange={e => handlePersonalChange("summary", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-400">Categorized Skills with Proficiency levels</p>
              <button
                onClick={() => {
                  const newSkills = [...candidate.skills, { skillName: "New Skill", category: "Languages", proficiency: "Intermediate" as const, explicitlyVerified: true }];
                  setCandidate({ ...candidate, skills: newSkills });
                }}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/40"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {candidate.skills.map((s, idx) => (
                <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                      {s.skillName}
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{s.category}</span>
                      <Badge variant="info">{s.proficiency}</Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const filtered = candidate.skills.filter((_, i) => i !== idx);
                      setCandidate({ ...candidate, skills: filtered });
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "experience" && (
          <div className="space-y-4">
            {candidate.experiences.map((exp, idx) => (
              <div key={idx} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{exp.position}</h3>
                    <p className="text-xs text-cyan-400">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-medium text-slate-400 mb-1">Verified Responsibilities:</p>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exp.technologies.map((t, tIdx) => (
                    <span key={tIdx} className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            {candidate.projects.map((proj, idx) => (
              <div key={idx} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white">{proj.projectName}</h3>
                <p className="text-xs text-slate-300 mt-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {proj.technologies.map((t, tIdx) => (
                    <span key={tIdx} className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "education" && (
          <div className="space-y-4">
            {candidate.educations.map((edu, idx) => (
              <div key={idx} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                <p className="text-xs text-cyan-400">{edu.institution} ({edu.graduationYear})</p>
                {edu.relevantCoursework && (
                  <p className="text-xs text-slate-400 mt-2"><strong className="text-slate-300">Coursework:</strong> {edu.relevantCoursework}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
