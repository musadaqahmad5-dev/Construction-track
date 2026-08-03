/**
 * ARIA v2.5 Compatibility Badge Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface CompatibilityBadgeProps {
  score: number; // 0.0 to 1.0
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  score,
  size = 'md',
  className = ''
}) => {
  const pct = Math.round(score * 100);

  const getClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-0.5 text-[10px] gap-1';
      case 'lg': return 'px-3.5 py-1.5 text-xs font-bold gap-2';
      default: return 'px-2.5 py-1 text-xs font-semibold gap-1.5';
    }
  };

  const isHigh = pct >= 85;
  const badgeColor = isHigh
    ? 'from-emerald-500/15 via-teal-500/10 to-indigo-500/15 text-emerald-200 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
    : 'from-amber-500/15 via-orange-500/10 to-indigo-500/15 text-amber-200 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]';

  return (
    <div className={`inline-flex items-center rounded-full border font-mono bg-gradient-to-r ${badgeColor} ${getClasses()} ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span>{pct}% Visual Match</span>
    </div>
  );
};
