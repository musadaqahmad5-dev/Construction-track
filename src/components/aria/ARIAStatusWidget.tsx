/**
 * ARIA v2.5 Status Indicator Widget
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, Layers, ShieldCheck, RefreshCw } from 'lucide-react';
import { useARIAContext } from '../../aria/core/ARIAContext';

interface ARIAStatusWidgetProps {
  onOpenPanel?: () => void;
  className?: string;
  compact?: boolean;
}

export const ARIAStatusWidget: React.FC<ARIAStatusWidgetProps> = ({
  onOpenPanel,
  className = '',
  compact = false
}) => {
  const { status, registeredModules, context } = useARIAContext();

  const isOnline = status.status === 'online';
  const isSyncing = status.status === 'syncing';

  if (compact) {
    return (
      <button
        onClick={onOpenPanel}
        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] cursor-pointer ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : isSyncing ? 'bg-violet-400 animate-ping' : 'bg-amber-400'}`} />
          {isOnline && (
            <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
          )}
        </div>
        <span className="text-[11px] font-mono font-medium tracking-wider text-zinc-200 group-hover:text-white flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-violet-400 group-hover:rotate-12 transition-transform" />
          ARIA v2.5
        </span>
        <span className="text-[9px] font-mono text-zinc-400 border-l border-white/10 pl-2">
          {status.latencyMs}ms
        </span>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-4 rounded-2xl bg-gradient-to-b from-[#0a0a12]/80 to-[#05050a]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}
    >
      {/* Background Moon Pearl Glow Accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-100 font-semibold">
                ARIA v2.5 Foundation
              </h4>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-serif italic">
              Moon Pearl Glow Core Engine
            </p>
          </div>
        </div>

        {onOpenPanel && (
          <button
            onClick={onOpenPanel}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 text-[10px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            Open Panel
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 text-left">
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-mono uppercase">
            <Activity className="w-3 h-3 text-emerald-400" />
            Status
          </div>
          <div className="text-xs font-mono font-medium text-emerald-400 mt-1 capitalize flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {status.status}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-mono uppercase">
            <Layers className="w-3 h-3 text-violet-400" />
            Modules
          </div>
          <div className="text-xs font-mono font-medium text-zinc-100 mt-1">
            {registeredModules.length} Registered
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-mono uppercase">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            Latency
          </div>
          <div className="text-xs font-mono font-medium text-zinc-100 mt-1">
            {status.latencyMs} ms
          </div>
        </div>
      </div>
    </motion.div>
  );
};
