/**
 * ARIA v2.5 Twin Confidence Badge Component
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

interface TwinConfidenceBadgeProps {
  score: number; // 0.0 to 1.0
  level?: string;
}

export const TwinConfidenceBadge: React.FC<TwinConfidenceBadgeProps> = ({ score, level }) => {
  const percent = Math.round(score * 100);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900/90 border border-indigo-500/30 text-indigo-200 text-xs font-mono font-medium shadow-lg backdrop-blur-md">
      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
      <span>Confidence: {percent}%</span>
      {level && (
        <span className="pl-1.5 border-l border-white/10 text-amber-300 font-semibold flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          {level}
        </span>
      )}
    </div>
  );
};
