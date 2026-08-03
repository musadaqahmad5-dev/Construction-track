/**
 * ARIA v2.5 Simulation Confidence Badge Component
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

interface SimulationConfidenceBadgeProps {
  score: number; // 0.0 to 1.0
  scenarioType?: string;
}

export const SimulationConfidenceBadge: React.FC<SimulationConfidenceBadgeProps> = ({ score, scenarioType }) => {
  const percent = Math.round(score * 100);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 via-purple-950/60 to-slate-900/90 border border-amber-500/30 text-amber-200 text-xs font-mono font-medium shadow-lg backdrop-blur-md">
      <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      <span>Sim Reliability: {percent}%</span>
      {scenarioType && (
        <span className="pl-1.5 border-l border-white/10 text-indigo-300 font-semibold flex items-center gap-1 uppercase text-[10px]">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          {scenarioType.replace('_', ' ')}
        </span>
      )}
    </div>
  );
};
