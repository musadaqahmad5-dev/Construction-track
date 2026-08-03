/**
 * ARIA v2.5 Reason Signals Panel
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Cpu, UserCheck, Sparkles, Database, Layers } from 'lucide-react';
import { DecisionReasonSignal } from '../../aria/decision/DecisionTypes';

interface ReasonSignalsPanelProps {
  signals: DecisionReasonSignal[];
  evidenceCount?: number;
  className?: string;
}

export const ReasonSignalsPanel: React.FC<ReasonSignalsPanelProps> = ({
  signals,
  evidenceCount,
  className = ''
}) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'memory': return <Database className="w-3 h-3 text-emerald-400" />;
      case 'style_dna': return <Sparkles className="w-3 h-3 text-violet-400" />;
      case 'user_context': return <UserCheck className="w-3 h-3 text-indigo-400" />;
      default: return <Cpu className="w-3 h-3 text-amber-400" />;
    }
  };

  return (
    <div className={`space-y-2 text-left ${className}`}>
      <div className="flex items-center justify-between pb-1">
        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-violet-400" />
          Supporting Reason Signals ({signals.length})
        </h5>
        {evidenceCount !== undefined && (
          <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {evidenceCount} Evidence Signals
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {signals.map((sig) => (
          <div
            key={sig.id}
            className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-2 text-xs font-mono"
          >
            <div className="flex items-start gap-2">
              <div className="p-1 rounded-md bg-white/5 border border-white/5 mt-0.5 shrink-0">
                {getCategoryIcon(sig.category)}
              </div>
              <span className="text-zinc-200 text-[11px] leading-snug">
                {sig.signalText}
              </span>
            </div>

            <span className="text-[10px] text-emerald-400 font-bold shrink-0">
              {Math.round(sig.confidence * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
