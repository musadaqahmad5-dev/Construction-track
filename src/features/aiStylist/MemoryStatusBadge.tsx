import React from 'react';
import { Database, Brain, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export interface MemoryStatusBadgeProps {
  styleDNA: Record<string, any>;
  messageCount: number;
  sessionActive: boolean;
}

export const MemoryStatusBadge: React.FC<MemoryStatusBadgeProps> = ({
  styleDNA,
  messageCount,
  sessionActive
}) => {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a12]/80 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Memory Engine
          </h4>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Synchronized
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <Clock className="h-3 w-3 text-indigo-400" />
            <span>Session Memory</span>
          </div>
          <span className="text-zinc-200 font-medium font-mono text-[11px]">
            {sessionActive ? 'Active (Live)' : 'Idle'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <Database className="h-3 w-3 text-purple-400" />
            <span>Long-Term Memory</span>
          </div>
          <span className="text-zinc-200 font-medium font-mono text-[11px]">
            Firestore Synced
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Style DNA</span>
          </div>
          <span className="text-zinc-200 font-medium truncate text-[11px]">
            {styleDNA.archetype || 'Modern Minimalist'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>History Log</span>
          </div>
          <span className="text-zinc-200 font-medium font-mono text-[11px]">
            {messageCount} Messages
          </span>
        </div>
      </div>
    </div>
  );
};
