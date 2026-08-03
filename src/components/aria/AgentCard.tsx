/**
 * ARIA v2.5 Agent Card Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { AgentProfile } from '../../aria/agents/AgentTypes';
import { AgentStatusBadge } from './AgentStatusBadge';
import { Bot, Cpu, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface AgentCardProps {
  agent: AgentProfile;
  onExecute?: (agent: AgentProfile) => void;
  className?: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onExecute,
  className = ''
}) => {
  return (
    <div className={`p-5 rounded-3xl bg-gradient-to-b from-[#0a0a14] via-[#06060c] to-[#040408] border border-white/10 hover:border-indigo-500/30 transition-all space-y-3 text-left shadow-lg relative overflow-hidden group ${className}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all" />

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
              {agent.role.replace('_', ' ')}
            </span>
            <h4 className="text-sm font-mono font-bold text-white tracking-wide">
              {agent.agentName}
            </h4>
          </div>
        </div>

        <AgentStatusBadge status={agent.status} />
      </div>

      <p className="text-xs font-mono text-zinc-400 leading-relaxed relative z-10">
        {agent.description}
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono text-zinc-300 relative z-10">
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-500 block">Confidence</span>
          <span className="font-bold text-emerald-300">{Math.round(agent.confidence * 100)}%</span>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-500 block">Avg Latency</span>
          <span className="font-bold text-indigo-300">{agent.metrics.averageLatencyMs}ms</span>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-zinc-500 block">Executions</span>
          <span className="font-bold text-purple-300">{agent.metrics.totalExecutions}</span>
        </div>
      </div>

      {onExecute && (
        <button
          onClick={() => onExecute(agent)}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500/40 text-xs font-mono font-bold text-zinc-200 hover:text-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2 relative z-10"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Execute {agent.agentName}</span>
        </button>
      )}
    </div>
  );
};
