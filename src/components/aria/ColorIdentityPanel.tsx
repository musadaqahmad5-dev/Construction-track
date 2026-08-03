/**
 * ARIA v2.5 Color Identity Panel
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { motion } from 'motion/react';
import { Palette, ShieldCheck, Sparkles } from 'lucide-react';
import { StyleDNAAttribute } from '../../aria/styleDNA/StyleDNATypes';

interface ColorIdentityPanelProps {
  colors: StyleDNAAttribute<string>[];
  className?: string;
}

export const ColorIdentityPanel: React.FC<ColorIdentityPanelProps> = ({
  colors,
  className = ''
}) => {
  // Helper to map color name strings to Tailwind/CSS color swatches
  const getColorSwatch = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('black') || lower.includes('onyx') || lower.includes('noir')) return 'bg-zinc-950 border-zinc-700';
    if (lower.includes('white') || lower.includes('cream') || lower.includes('ivory')) return 'bg-zinc-100 border-zinc-300';
    if (lower.includes('blue') || lower.includes('navy') || lower.includes('midnight')) return 'bg-indigo-900 border-indigo-700';
    if (lower.includes('violet') || lower.includes('purple') || lower.includes('plum')) return 'bg-violet-900 border-violet-600';
    if (lower.includes('green') || lower.includes('emerald') || lower.includes('olive')) return 'bg-emerald-900 border-emerald-600';
    if (lower.includes('red') || lower.includes('burgundy') || lower.includes('crimson')) return 'bg-rose-900 border-rose-700';
    if (lower.includes('beige') || lower.includes('tan') || lower.includes('camel')) return 'bg-amber-900/60 border-amber-700';
    if (lower.includes('gray') || lower.includes('charcoal') || lower.includes('slate')) return 'bg-zinc-700 border-zinc-500';
    return 'bg-gradient-to-tr from-violet-600 to-indigo-600 border-violet-400';
  };

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-b from-[#0a0a14] to-[#05050a] border border-white/10 space-y-3 text-left ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-violet-500/15 border border-violet-500/20 text-violet-300">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
              Color Vector Identity
            </h4>
            <p className="text-[10px] text-zinc-400 font-serif italic">
              Confirmed color palette preferences
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
          {colors.length} Color Vectors
        </span>
      </div>

      {colors.length === 0 ? (
        <p className="text-xs font-mono text-zinc-400 italic py-2">
          No color identity preferences established yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {colors.map((c) => (
            <div
              key={c.id}
              className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg border shadow-sm ${getColorSwatch(c.value)} shrink-0`} />
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-200 block">
                    {c.value}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 capitalize block">
                    {c.source.replace('_', ' ')} • {c.evidenceCount} {c.evidenceCount === 1 ? 'Signal' : 'Signals'}
                  </span>
                </div>
              </div>

              <div className="text-right font-mono text-[10px]">
                <span className="text-emerald-400 font-bold flex items-center gap-0.5 justify-end">
                  <ShieldCheck className="w-3 h-3" />
                  {Math.round(c.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
