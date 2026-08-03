/**
 * ARIA v2.5 Decision Score Badge
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface DecisionScoreBadgeProps {
  score: number;       // 0.0 to 1.0
  confidence?: number; // 0.0 to 1.0
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DecisionScoreBadge: React.FC<DecisionScoreBadgeProps> = ({
  score,
  confidence,
  size = 'md',
  className = ''
}) => {
  const percentage = Math.round(score * 100);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-0.5 text-[10px] gap-1';
      case 'lg': return 'px-3.5 py-1.5 text-xs gap-2 font-bold';
      default: return 'px-2.5 py-1 text-xs gap-1.5 font-semibold';
    }
  };

  const getThemeClasses = () => {
    if (score >= 0.85) {
      return 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(34,197,94,0.15)]';
    }
    if (score >= 0.70) {
      return 'bg-gradient-to-r from-violet-500/15 to-indigo-500/10 text-violet-300 border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]';
    }
    return 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
  };

  return (
    <div className={`inline-flex items-center rounded-full border font-mono ${getSizeClasses()} ${getThemeClasses()} ${className}`}>
      <Sparkles className="w-3 h-3 shrink-0" />
      <span>{percentage}% Match</span>
      {confidence !== undefined && (
        <>
          <span className="opacity-40">•</span>
          <span className="opacity-80 flex items-center gap-0.5 text-[10px]">
            <ShieldCheck className="w-2.5 h-2.5" />
            {Math.round(confidence * 100)}% Conf
          </span>
        </>
      )}
    </div>
  );
};
