import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { parseJd } from "../api/client";
import { FileText, Upload, Sparkles, ArrowRight } from "lucide-react";

export const JdInputPage: React.FC = () => {
  const { setActiveJd, setCurrentStep, setError } = useApp();
  const [rawText, setRawText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sampleJdText = `
Job Title: Backend Software Engineer
Company: CloudScale Solutions
Location: Remote

Key Responsibilities:
- Design and implement high-performance RESTful APIs using Node.js and Express.js.
- Optimize relational database queries and schema designs using PostgreSQL.
- Collaborate with frontend engineers to integrate services.
- Package services into Docker containers for cloud deployment.

Mandatory Requirements:
- 0-2 years experience in Backend Software Engineering.
- Strong proficiency in Node.js, TypeScript, JavaScript, and Express.js.
- Solid experience with PostgreSQL database modeling and SQL optimization.
- Proficiency with Git version control and REST API architecture.

Preferred / Nice to Have:
- Hands-on experience with Redis caching strategies.
- Containerization experience with Docker.
- Basic exposure to AWS (Amazon Web Services) cloud infrastructure.
- Familiarity with Kubernetes (K8s) container orchestration.
  `;

  const handleAnalyze = async () => {
    if (!rawText.trim() && !file) {
      setError("Please paste a Job Description or upload a PDF/DOCX file.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await parseJd(rawText, file || undefined);
      setActiveJd(result.parsed);
      setCurrentStep("JD_ANALYSIS");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Job Description Input</h1>
        <p className="text-sm text-slate-400 mt-2">
          Paste the target Job Description or upload a JD document. Our deterministic engine will extract requirements, technical skills, and keywords.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        {/* Upload Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Upload JD File (PDF / DOCX / TXT)
          </label>
          <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/50 bg-slate-900/60 rounded-xl p-6 text-center transition-all">
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-slate-300">
              {file ? <span className="text-cyan-400 font-medium">{file.name}</span> : "Drag & drop file here or click to browse"}
            </p>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={e => e.target.files && setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block mt-3 px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              Choose File
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
          <div className="flex-1 h-px bg-slate-800" />
          <span>Or Paste Plain Text</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Text Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Job Description Text
            </label>
            <button
              onClick={() => setRawText(sampleJdText.trim())}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Sample Backend Engineer JD
            </button>
          </div>
          <textarea
            rows={10}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder="Paste Job Description content here..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-xs leading-relaxed"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Extracting Keywords & Structuring JD...</span>
          ) : (
            <>
              <span>Analyze & Extract Requirements</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
