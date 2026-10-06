import React, { createContext, useContext, useState, useEffect } from "react";
import { CandidateProfile, ParsedJobDescription, MatchAnalysis, GeneratedResume, AppStep } from "../types";
import { fetchProfile } from "../api/client";

interface AppContextType {
  candidate: CandidateProfile | null;
  setCandidate: React.Dispatch<React.SetStateAction<CandidateProfile | null>>;
  activeJd: ParsedJobDescription | null;
  setActiveJd: React.Dispatch<React.SetStateAction<ParsedJobDescription | null>>;
  matchAnalysis: MatchAnalysis | null;
  setMatchAnalysis: React.Dispatch<React.SetStateAction<MatchAnalysis | null>>;
  generatedResume: GeneratedResume | null;
  setGeneratedResume: React.Dispatch<React.SetStateAction<GeneratedResume | null>>;
  currentStep: AppStep;
  setCurrentStep: React.Dispatch<React.SetStateAction<AppStep>>;
  mode: "STRICT_PROFILE" | "JD_OPTIMIZED" | "LEARNED_SKILLS";
  setMode: React.Dispatch<React.SetStateAction<"STRICT_PROFILE" | "JD_OPTIMIZED" | "LEARNED_SKILLS">>;
  objective: string;
  setObjective: React.Dispatch<React.SetStateAction<string>>;
  lengthPref: string;
  setLengthPref: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  refreshProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [activeJd, setActiveJd] = useState<ParsedJobDescription | null>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>("PROFILE");
  const [mode, setMode] = useState<"STRICT_PROFILE" | "JD_OPTIMIZED" | "LEARNED_SKILLS">("STRICT_PROFILE");
  const [objective, setObjective] = useState<string>("BALANCED");
  const [lengthPref, setLengthPref] = useState<string>("ONE_PAGE");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchProfile();
      setCandidate(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <AppContext.Provider
      value={{
        candidate,
        setCandidate,
        activeJd,
        setActiveJd,
        matchAnalysis,
        setMatchAnalysis,
        generatedResume,
        setGeneratedResume,
        currentStep,
        setCurrentStep,
        mode,
        setMode,
        objective,
        setObjective,
        lengthPref,
        setLengthPref,
        loading,
        error,
        setError,
        refreshProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
