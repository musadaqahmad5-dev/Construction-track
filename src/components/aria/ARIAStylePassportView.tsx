/**
 * ARIA Style Passport View Component
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Zap,
  TrendingUp,
  Bookmark,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';

interface ARIAStylePassportViewProps {
  userId?: string;
  className?: string;
}

export const ARIAStylePassportView: React.FC<ARIAStylePassportViewProps> = ({
  userId = 'guest_user',
  className = ''
}) => {
  const memory = PersonalFashionMemoryEngine.getMemory(userId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#06060c] border border-violet-500/30 rounded-2xl p-6 space-y-6 shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-900 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Cognitive Style Passport</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-950/80 border border-violet-500/30 text-violet-300 font-bold">
                ARIA Style DNA
              </span>
            </div>
            <p className="text-xs text-zinc-400">Autonomous Fashion Identity & Personal Memory Model</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Profile Accuracy: {memory.accuracyEstimate}%</span>
        </div>
      </div>

      {/* Style DNA Vector Metrics */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-400" />
          Style DNA Vector Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-black/40 border border-white/5 rounded-xl p-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Primary Vibe</span>
            <span className="text-base font-bold text-violet-300 mt-1 block">{memory.styleDNA.primaryVibe}</span>
            <p className="text-[10px] text-zinc-500 mt-1">Learned from user interaction history</p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Formality Preference</span>
            <span className="text-base font-bold text-indigo-300 mt-1 block">
              {Math.round(memory.styleDNA.formalityPreference * 100)}%
            </span>
            <div className="w-full bg-white/5 rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full"
                style={{ width: `${memory.styleDNA.formalityPreference * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Experimental Index</span>
            <span className="text-base font-bold text-emerald-300 mt-1 block">
              {Math.round(memory.styleDNA.experimentalIndex * 100)}%
            </span>
            <div className="w-full bg-white/5 rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${memory.styleDNA.experimentalIndex * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Timeline & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
        {/* Fav Colors & Brands */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Favorite Color Tones</h4>
            <div className="flex flex-wrap gap-2">
              {memory.favColors.map((col, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-violet-300"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Preferred Fashion Houses</h4>
            <div className="flex flex-wrap gap-2">
              {memory.favBrands.map((brand, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs font-mono text-indigo-300"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Style Evolution Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Style Evolution Milestones
          </h4>
          <div className="space-y-2">
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-semibold text-white block">Minimalist Luxury Transition</span>
                <span className="text-[10px] text-zinc-500 font-mono">3 months ago · High Confidence</span>
              </div>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-semibold text-white block">Structured Outerwear Affinity</span>
                <span className="text-[10px] text-zinc-500 font-mono">1 month ago · Active Vector</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
