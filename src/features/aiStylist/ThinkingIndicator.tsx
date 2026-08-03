import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Sparkles, CheckCircle } from 'lucide-react';
import { ThinkingState } from './hooks/useAIStylistWorkspace';

export interface ThinkingIndicatorProps {
  thinking: ThinkingState;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ thinking }) => {
  if (!thinking.isThinking) return null;

  const progressPercent = Math.round(((thinking.stepIndex + 1) / thinking.totalSteps) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="my-4 overflow-hidden rounded-xl border border-indigo-500/30 bg-[#0c0c1a]/90 p-4 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <BrainCircuit className="h-5 w-5 animate-pulse" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-purple-400 animate-spin" />
          </div>
          <div>
            <h5 className="text-xs font-semibold tracking-wide text-zinc-100 flex items-center gap-2">
              LOOK VISION Intelligence Core
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Reasoning
              </span>
            </h5>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{thinking.currentStep}</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-indigo-400">
          {progressPercent}%
        </span>
      </div>

      <div className="w-full bg-zinc-900/80 rounded-full h-1.5 overflow-hidden border border-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <CheckCircle className={`h-3 w-3 ${thinking.stepIndex >= 1 ? 'text-emerald-400' : 'text-zinc-600'}`} />
          <span>Style DNA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className={`h-3 w-3 ${thinking.stepIndex >= 3 ? 'text-emerald-400' : 'text-zinc-600'}`} />
          <span>Fashion Core</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className={`h-3 w-3 ${thinking.stepIndex >= 5 ? 'text-emerald-400' : 'text-zinc-600'}`} />
          <span>Confidence Matrix</span>
        </div>
      </div>
    </motion.div>
  );
};
