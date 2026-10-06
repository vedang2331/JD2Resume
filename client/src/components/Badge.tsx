import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "info", size = "sm" }) => {
  const styles = {
    success: "bg-emerald-950/80 text-emerald-400 border-emerald-800/50",
    warning: "bg-amber-950/80 text-amber-400 border-amber-800/50",
    danger: "bg-rose-950/80 text-rose-400 border-rose-800/50",
    info: "bg-cyan-950/80 text-cyan-400 border-cyan-800/50",
    neutral: "bg-slate-800 text-slate-300 border-slate-700"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm font-medium"
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border ${styles[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
