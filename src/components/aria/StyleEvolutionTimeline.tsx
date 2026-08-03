/**
 * ARIA v2.5 Style Evolution Timeline
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { GitCommit, TrendingUp, Calendar, Zap } from 'lucide-react';
import { EvolutionMilestone } from '../../aria/digitalTwin/DigitalTwinTypes';

interface StyleEvolutionTimelineProps {
  milestones: EvolutionMilestone[];
}

export const StyleEvolutionTimeline: React.FC<StyleEvolutionTimelineProps> = ({ milestones }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#07070c] border border-white/10 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-serif font-medium text-white">Style Evolution Timeline</h3>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {milestones.length} Recorded Milestones
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500 before:to-transparent">
        {milestones.map((m, idx) => (
          <motion.div
            key={m.milestoneId || idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="relative space-y-2 group"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#07070c] border-2 border-indigo-400 flex items-center justify-center group-hover:border-amber-400 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-amber-400" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-serif font-semibold text-indigo-300">
                {m.phaseName}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>{new Date(m.timestamp).toLocaleDateString()}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/20">
                  Confidence: {Math.round(m.confidence * 100)}%
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-200 font-light">
              {m.description}
            </p>

            <div className="p-3 rounded-xl bg-[#090a12] border border-white/5 flex items-start gap-2 text-xs text-amber-200/90 font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Key Shift:</strong> {m.keyShift}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
