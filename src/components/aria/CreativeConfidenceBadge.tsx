/**
 * ARIA v2.5 Creative Confidence Badge
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Sparkles, Compass, Lightbulb } from 'lucide-react';

interface CreativeConfidenceBadgeProps {
  confidence: number;      // 0.0 to 1.0
  originalityScore?: number; // 0.0 to 1.0
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CreativeConfidenceBadge: React.FC<CreativeConfidenceBadgeProps> = ({
  confidence,
  originalityScore,
  size = 'md',
  className = ''
}) => {
  const confPct = Math.round(confidence * 100);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-0.5 text-[10px] gap-1';
      case 'lg': return 'px-3.5 py-1.5 text-xs gap-2 font-bold';
      default: return 'px-2.5 py-1 text-xs gap-1.5 font-semibold';
    }
  };

  return (
    <div className={`inline-flex items-center rounded-full border font-mono bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-pink-500/15 text-purple-200 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)] ${getSizeClasses()} ${className}`}>
      <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
      <span>{confPct}% Confidence</span>
      {originalityScore !== undefined && (
        <>
          <span className="opacity-40">•</span>
          <span className="opacity-80 flex items-center gap-0.5 text-[10px] text-pink-300">
            <Lightbulb className="w-2.5 h-2.5" />
            {Math.round(originalityScore * 100)}% Originality
          </span>
        </>
      )}
    </div>
  );
};
