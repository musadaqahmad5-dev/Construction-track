import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BrainCircuit,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';
import { ConversationStateMetadata } from './RealtimeConversationState';

export interface LiveThinkingPipelineProps {
  metadata: ConversationStateMetadata;
  expandedDefault?: boolean;
}

const ALL_STAGES = [
  { step: 'Analyzing Style DNA & Archetype', description: 'Querying vector embeddings & personal aesthetic profile' },
  { step: 'Reading Digital Wardrobe & Fits', description: 'Scanning 3D garment inventory and fit constraints' },
  { step: 'Checking Fashion Memory & DNA', description: 'Retrieving past user feedback and favorite combinations' },
  { step: 'Consulting Unified Intelligence', description: 'Cross-referencing real-time trends, climate & occasion rules' },
  { step: 'Synthesizing Color & Silhouette Constraints', description: 'Calculating color harmonic ratios & visual weight balance' },
  { step: 'Ranking Recommendations & Confidence', description: 'Computing multi-variant confidence scores' },
  { step: 'Building Final Executive Response', description: 'Structuring luxury sartorial lookbook metadata' }
];

export const LiveThinkingPipeline: React.FC<LiveThinkingPipelineProps> = ({
  metadata,
  expandedDefault = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(expandedDefault);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const {
    status,
    thinkingStep,
    thinkingStepIndex,
    thinkingTotalSteps,
    progressPercentage,
    startedAt
  } = metadata;

  useEffect(() => {
    if (!startedAt || ['Completed', 'Failed', 'Cancelled', 'Idle'].includes(status)) {
      return;
    }

    const interval = setInterval(() => {
      const start = new Date(startedAt).getTime();
      setElapsedMs(Math.max(0, Date.now() - start));
    }, 100);

    return () => clearInterval(interval);
  }, [startedAt, status]);

  if (status === 'Idle') return null;

  const currentStageIndex = Math.min(
    thinkingStepIndex ?? 0,
    ALL_STAGES.length - 1
  );

  return (
    <div className="w-full rounded-2xl border border-indigo-500/30 bg-[#06060e]/95 p-4 shadow-2xl backdrop-blur-xl transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              {status === 'Completed' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <BrainCircuit className="h-5 w-5 animate-pulse text-indigo-400" />
              )}
            </div>
            {status !== 'Completed' && status !== 'Failed' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Live Thinking Pipeline
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200">
                {status}
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-medium truncate max-w-xs sm:max-w-md mt-0.5">
              {thinkingStep || ALL_STAGES[currentStageIndex]?.step}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Execution Time</span>
            <span className="text-xs font-mono font-semibold text-zinc-300">
              {(elapsedMs / 1000).toFixed(1)}s
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle Live Stage Details"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3.5 space-y-1">
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-indigo-400" />
            Stage {currentStageIndex + 1} of {thinkingTotalSteps || ALL_STAGES.length}
          </span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Expanded Stages Timeline */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-3 border-t border-white/10 space-y-2.5 overflow-hidden"
          >
            {ALL_STAGES.map((stage, idx) => {
              const isFinished = idx < currentStageIndex || status === 'Completed';
              const isActive = idx === currentStageIndex && status !== 'Completed';

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-500/10 border border-indigo-500/30'
                      : isFinished
                      ? 'bg-white/[0.02]'
                      : 'opacity-40'
                  }`}
                >
                  <div className="mt-0.5">
                    {isFinished ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-zinc-600 flex items-center justify-center text-[9px] font-mono text-zinc-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h5
                      className={`text-xs font-semibold ${
                        isActive
                          ? 'text-indigo-200'
                          : isFinished
                          ? 'text-zinc-300'
                          : 'text-zinc-500'
                      }`}
                    >
                      {stage.step}
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                      {stage.description}
                    </p>
                  </div>

                  {isActive && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse">
                      PROCESSING
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
