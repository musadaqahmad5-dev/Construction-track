import React from 'react';

interface HealthIndicatorProps {
  score: number;
  label?: string;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({ score, label = "System Coherence" }) => {
  let color = 'bg-emerald-400 text-emerald-400 shadow-emerald-500/20';
  let rating = 'EXCELLENT';

  if (score < 50) {
    color = 'bg-rose-500 text-rose-500 shadow-rose-500/20';
    rating = 'CRITICAL';
  } else if (score < 80) {
    color = 'bg-amber-400 text-amber-400 shadow-amber-500/20';
    rating = 'WARNING';
  }

  return (
    <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 text-left">
      <div className="space-y-1">
        <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color} animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.3)]`} />
          <span className="text-sm font-semibold text-white tracking-tight">{rating}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs font-mono text-zinc-400">Score</span>
        <span className="text-xl font-light font-mono text-white block leading-none mt-0.5">{score}%</span>
      </div>
    </div>
  );
};
