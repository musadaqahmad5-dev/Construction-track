/**
 * ARIA Recommendation Card Component
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Shirt,
  CheckCircle2,
  TrendingUp,
  CloudSun,
  Briefcase
} from 'lucide-react';
import { ARIARecommendationCard as ARIARecType } from '../../features/ariaExperience/ARIAExperienceTypes';

interface ARIARecommendationCardProps {
  card: ARIARecType;
  className?: string;
  onSaveToWardrobe?: () => void;
}

export const ARIARecommendationCard: React.FC<ARIARecommendationCardProps> = ({
  card,
  className = '',
  onSaveToWardrobe
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-[#06060c] border border-violet-500/30 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-violet-950/80 border border-violet-500/30 text-violet-300 text-[10px] font-mono font-bold uppercase tracking-wider">
              ARIA Decision Recommendation
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{card.title}</h2>
          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              {card.occasion}
            </span>
            <span className="flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              {card.weatherContext}
            </span>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl px-4 py-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">Match Score</span>
            <span className="text-lg font-bold font-mono text-emerald-300">{card.confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Outfit Garment Pieces */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Shirt className="w-4 h-4 text-violet-400" />
          Curated Ensemble Garments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {card.outfitItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-black/50 border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:border-violet-500/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-900/40 border border-violet-500/20 flex items-center justify-center text-violet-300 font-mono text-xs font-bold shrink-0">
                0{idx + 1}
              </div>
              <span className="text-sm text-zinc-200 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Match Factor Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Multi-Factor Compatibility Analysis
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {card.matchFactors.map((factor, idx) => (
            <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-3">
              <span className="text-[10px] text-zinc-500 font-mono block truncate">{factor.factorName}</span>
              <span className="text-base font-bold font-mono text-violet-300 mt-1 block">{factor.score}%</span>
              <div className="w-full bg-white/5 rounded-full h-1 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                  style={{ width: `${factor.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style Reasoning */}
      <div className="space-y-2 bg-[#0a0a14] border border-white/5 rounded-xl p-4">
        <h4 className="text-xs font-mono text-indigo-300 uppercase tracking-wider">ARIA Explainable Reasoning</h4>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {card.styleReasoning.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      {onSaveToWardrobe && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onSaveToWardrobe}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Sparkles className="w-4 h-4" />
            Save Ensemble to Closet
          </button>
        </div>
      )}
    </motion.div>
  );
};
