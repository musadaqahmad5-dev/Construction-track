/**
 * ARIA v2.5 Insight & Structured Response Card
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Cpu, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { ARIAStructuredResponse } from '../../aria/core/ARIATypes';

interface ARIAInsightCardProps {
  response: ARIAStructuredResponse;
  onExecuteAction?: (actionId: string, actionType: string, payload?: any) => void;
  className?: string;
}

export const ARIAInsightCard: React.FC<ARIAInsightCardProps> = ({
  response,
  onExecuteAction,
  className = ''
}) => {
  const [showReasoning, setShowReasoning] = useState(false);

  const confidencePct = Math.round(response.confidence.overallScore * 100);
  const confidenceColor = 
    response.confidence.confidenceLevel === 'HIGH' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
    response.confidence.confidenceLevel === 'MEDIUM' ? 'text-violet-400 border-violet-500/30 bg-violet-500/10' :
    'text-amber-400 border-amber-500/30 bg-amber-500/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative p-5 rounded-2xl bg-gradient-to-b from-[#080810]/90 to-[#040408]/95 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden text-left ${className}`}
    >
      {/* Top Sheen Glow */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-semibold tracking-wider text-zinc-100 uppercase">
            ARIA Intelligence Output
          </span>
          <span className="text-[9px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {response.intent}
          </span>
        </div>

        {/* Confidence Badge */}
        <div className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-medium flex items-center gap-1.5 ${confidenceColor}`}>
          <ShieldCheck className="w-3 h-3" />
          <span>{confidencePct}% Certainty</span>
        </div>
      </div>

      {/* Display Text Content */}
      <div className="py-4">
        <p className="text-sm font-sans text-zinc-200 leading-relaxed">
          {response.displayText}
        </p>

        {/* Structured Insights List if present */}
        {Array.isArray((response.response as any)?.insights) && (
          <div className="mt-3 space-y-1.5">
            {(response.response as any).insights.map((insight: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {response.actions && response.actions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 pb-3 border-t border-white/5">
          {response.actions.map((act) => (
            <button
              key={act.id}
              onClick={() => onExecuteAction?.(act.id, act.actionType, act.payload)}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/30 hover:border-violet-500/50 text-xs font-mono font-medium text-violet-200 hover:text-white transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.15)]"
            >
              <span>{act.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      )}

      {/* Accordion Toggle for Reasoning Steps & Metadata */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-violet-400" />
          <span>Reasoning Chain ({response.reasoningChain?.length || 0} stages)</span>
          {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <div className="flex items-center gap-3 text-zinc-400">
          <span>{response.metadata.model}</span>
          <span>•</span>
          <span>{response.metadata.latencyMs}ms</span>
        </div>
      </div>

      {/* Expanded Reasoning & Confidence Breakdown */}
      <AnimatePresence>
        {showReasoning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/5 space-y-3 overflow-hidden text-left"
          >
            {/* Reasoning Steps */}
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
                Execution Steps
              </span>
              <div className="space-y-1.5">
                {response.reasoningChain.map((step) => (
                  <div key={step.id} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-zinc-200">{step.stageName}:</span>{' '}
                        <span className="text-zinc-400 text-[11px]">{step.description}</span>
                      </div>
                    </div>
                    {step.confidenceScore !== undefined && (
                      <span className="text-[9px] font-mono text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20 shrink-0">
                        {Math.round(step.confidenceScore * 100)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Factors Breakdown */}
            {response.confidence.factors && response.confidence.factors.length > 0 && (
              <div className="pt-2">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
                  Confidence Score Factors
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {response.confidence.factors.map((factor, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-300 truncate">{factor.name}</span>
                        <span className="text-violet-400 font-bold">{Math.round(factor.score * 100)}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                          style={{ width: `${Math.round(factor.score * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
