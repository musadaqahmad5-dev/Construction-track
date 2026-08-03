/**
 * ARIA v2.5 Style Confidence Badge
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { StyleDNAScorer } from '../../aria/styleDNA/StyleDNAScorer';

interface StyleConfidenceBadgeProps {
  confidence: number; // 0.0 to 1.0
  evidenceCount?: number;
  showLabel?: boolean;
  className?: string;
}

export const StyleConfidenceBadge: React.FC<StyleConfidenceBadgeProps> = ({
  confidence,
  evidenceCount = 1,
  showLabel = true,
  className = ''
}) => {
  const percentage = Math.round(confidence * 100);
  const label = StyleDNAScorer.getMaturityLabel(confidence, evidenceCount);

  const getStyleClasses = () => {
    if (confidence >= 0.8) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_12px_rgba(34,197,94,0.15)]';
    }
    if (confidence >= 0.6) {
      return 'bg-violet-500/10 text-violet-300 border-violet-500/25 shadow-[0_0_12px_rgba(139,92,246,0.15)]';
    }
    return 'bg-amber-500/10 text-amber-300 border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-medium ${getStyleClasses()} ${className}`}>
      <ShieldCheck className="w-3 h-3 shrink-0" />
      <span className="font-bold">{percentage}% Confidence</span>
      {showLabel && (
        <>
          <span className="opacity-40">•</span>
          <span className="opacity-90">{label}</span>
        </>
      )}
    </div>
  );
};
