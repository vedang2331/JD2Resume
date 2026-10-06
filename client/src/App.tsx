import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { ProfilePage } from "./pages/ProfilePage";
import { JdInputPage } from "./pages/JdInputPage";
import { JdAnalysisPage } from "./pages/JdAnalysisPage";
import { MatchPage } from "./pages/MatchPage";
import { ResumeStrategyPage } from "./pages/ResumeStrategyPage";
import { ResumeEditorPage } from "./pages/ResumeEditorPage";
import { AlignmentReportPage } from "./pages/AlignmentReportPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AlertCircle } from "lucide-react";

const MainLayout: React.FC = () => {
  const { currentStep, error, setError } = useApp();

  const renderStep = () => {
    switch (currentStep) {
      case "PROFILE":
        return <ProfilePage />;
      case "JD_INPUT":
        return <JdInputPage />;
      case "JD_ANALYSIS":
        return <JdAnalysisPage />;
      case "MATCH":
        return <MatchPage />;
      case "STRATEGY":
        return <ResumeStrategyPage />;
      case "RESUME_EDITOR":
        return <ResumeEditorPage />;
      case "ALIGNMENT_REPORT":
        return <AlignmentReportPage />;
      case "DASHBOARD":
        return <DashboardPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200 font-bold ml-4">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 pb-16">{renderStep()}</main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>JD2Resume — Truth-First AI-Powered Job-Specific Resume Builder</p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
