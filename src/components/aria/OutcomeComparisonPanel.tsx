/**
 * ARIA v2.5 Outcome Comparison Panel
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { GitCompare, ArrowRight, ShieldAlert } from 'lucide-react';
import { AlternativeOutcome } from '../../aria/simulation/SimulationTypes';

interface OutcomeComparisonPanelProps {
  alternatives: AlternativeOutcome[];
}

export const OutcomeComparisonPanel: React.FC<OutcomeComparisonPanelProps> = ({ alternatives }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#07070c] border border-white/10 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <GitCompare className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-serif font-medium text-white">Alternative Scenario Comparison</h3>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {alternatives.length} Evaluated Alternatives
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alternatives.map((alt, idx) => (
          <motion.div
            key={alt.outcomeId || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-[#080911] border border-white/5 space-y-3 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-serif font-semibold text-white">
                  {alt.title}
                </h4>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  Versatility: {Math.round(alt.versatilityScore * 100)}%
                </span>
              </div>

              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {alt.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-2 text-xs text-purple-200 font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Trade-off:</strong> {alt.keyTradeoff}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
