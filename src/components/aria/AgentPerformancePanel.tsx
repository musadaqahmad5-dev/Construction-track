/**
 * ARIA v2.5 Agent Performance Panel Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { AgentProfile, AgentOrchestratorStatus } from '../../aria/agents/AgentTypes';
import { Gauge, Activity, ShieldCheck, Cpu, Database, CheckCircle2 } from 'lucide-react';

interface AgentPerformancePanelProps {
  agents: AgentProfile[];
  status: AgentOrchestratorStatus;
  className?: string;
}

export const AgentPerformancePanel: React.FC<AgentPerformancePanelProps> = ({
  agents,
  status,
  className = ''
}) => {
  const totalExecutions = agents.reduce((acc, a) => acc + a.metrics.totalExecutions, 0);
  const avgConfidence = (agents.reduce((acc, a) => acc + a.metrics.averageConfidence, 0) / (agents.length || 1)).toFixed(2);
  const avgLatency = Math.round(agents.reduce((acc, a) => acc + a.metrics.averageLatencyMs, 0) / (agents.length || 1));

  return (
    <div className={`p-5 rounded-3xl bg-gradient-to-b from-[#080812] via-[#05050a] to-[#030306] border border-white/10 space-y-4 text-left shadow-xl ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Gauge className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
            Orchestrator Telemetry & Performance
          </h3>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] uppercase tracking-wider font-bold">
          Storage: {status.storageMode}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Active Agents</span>
          <span className="text-xl font-mono font-bold text-indigo-300">{agents.length} Specialized</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Total Executions</span>
          <span className="text-xl font-mono font-bold text-purple-300">{totalExecutions}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Avg Confidence</span>
          <span className="text-xl font-mono font-bold text-emerald-300">{Math.round(Number(avgConfidence) * 100)}%</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Avg Latency</span>
          <span className="text-xl font-mono font-bold text-amber-300">{avgLatency}ms</span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
          Agent Capabilities Matrix
        </span>

        <div className="space-y-1.5 font-mono text-xs text-zinc-300">
          {agents.map(a => (
            <div key={a.agentId} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="font-bold text-zinc-200">{a.agentName}</span>
              <div className="flex items-center gap-2 text-[10px]">
                {a.capabilities.canAnalyzeDNA && <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">DNA</span>}
                {a.capabilities.canMakeDecisions && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Decision</span>}
                {a.capabilities.canSynthesizeCreative && <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Creative</span>}
                {a.capabilities.canAnalyzeVision && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Vision</span>}
                {a.capabilities.canAnalyzeTrends && <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Trends</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
