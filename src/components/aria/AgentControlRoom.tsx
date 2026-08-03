/**
 * ARIA v2.5 Agent Control Room Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState, useEffect } from 'react';
import { useARIA } from '../../context/ARIAContext';
import { AgentRole, AgentProfile, AgentExecutionRecord } from '../../aria/agents/AgentTypes';
import { AgentCard } from './AgentCard';
import { AgentExecutionTimeline } from './AgentExecutionTimeline';
import { AgentPerformancePanel } from './AgentPerformancePanel';
import { Bot, Sparkles, Send, RefreshCw, Cpu, Layers, Activity } from 'lucide-react';

export const AgentControlRoom: React.FC = () => {
  const { agents, agentStatus, executeAgent, agentHistory } = useARIA();

  const [selectedRole, setSelectedRole] = useState<AgentRole | 'AUTO'>('AUTO');
  const [prompt, setPrompt] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastRecord, setLastRecord] = useState<AgentExecutionRecord | null>(null);

  const handleExecute = async (roleOverride?: AgentRole) => {
    const targetPrompt = prompt.trim() || 'Analyze fashion context and generate optimal style direction';
    setIsExecuting(true);

    try {
      const rec = await executeAgent({
        agentRole: roleOverride || (selectedRole === 'AUTO' ? undefined : selectedRole),
        prompt: targetPrompt
      });
      setLastRecord(rec);
    } catch (err) {
      console.error('[AgentControlRoom] Execution failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#07070e] to-purple-950/30 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[10px] font-bold uppercase tracking-wider">
                ARIA v2.5 Multi-Agent Orchestrator
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wide">
              Agent Control Room
            </h2>
            <p className="text-xs font-mono text-zinc-400 max-w-xl">
              Collaborative multi-agent swarm coordinating Fashion Analysis, Personal Styling, Creative Direction, Visual Analysis, and Trend Intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">Agents Ready</span>
              <span className="text-sm font-mono font-bold text-indigo-300">{agents.length} Specialized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Prompt Console */}
      <div className="p-5 rounded-3xl bg-[#07070d] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Dispatch Prompt to Agent Orchestrator
          </label>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-[10px]">
            <button
              onClick={() => setSelectedRole('AUTO')}
              className={`px-2.5 py-1 rounded-lg transition-all ${selectedRole === 'AUTO' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              AUTO SELECT
            </button>
            <button
              onClick={() => setSelectedRole('FASHION_ANALYST')}
              className={`px-2.5 py-1 rounded-lg transition-all ${selectedRole === 'FASHION_ANALYST' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              ANALYST
            </button>
            <button
              onClick={() => setSelectedRole('PERSONAL_STYLIST')}
              className={`px-2.5 py-1 rounded-lg transition-all ${selectedRole === 'PERSONAL_STYLIST' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              STYLIST
            </button>
            <button
              onClick={() => setSelectedRole('CREATIVE_DIRECTOR')}
              className={`px-2.5 py-1 rounded-lg transition-all ${selectedRole === 'CREATIVE_DIRECTOR' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              CREATIVE
            </button>
            <button
              onClick={() => setSelectedRole('VISUAL_ANALYSIS')}
              className={`px-2.5 py-1 rounded-lg transition-all ${selectedRole === 'VISUAL_ANALYSIS' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              VISION
            </button>
            <button
              onClick={() => setSelectedRole('TREND_INTELLIGENCE')}
              className={`px-2.5 py-1 rounded-lg transition-all ${selectedRole === 'TREND_INTELLIGENCE' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              TRENDS
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            placeholder="e.g. Synthesize tailored autumn evening outfit recommendation or analyze trend signals..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
          />

          <button
            onClick={() => handleExecute()}
            disabled={isExecuting}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Last Execution Card */}
      {lastRecord && (
        <div className="p-5 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 space-y-2 text-left shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Latest Agent Response ({lastRecord.agentRole})
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Latency: {lastRecord.latencyMs}ms | Confidence: {Math.round(lastRecord.confidence * 100)}%
            </span>
          </div>

          <p className="text-xs font-mono text-white font-bold">
            "{lastRecord.prompt}"
          </p>

          <p className="text-xs font-mono text-zinc-300 bg-white/5 p-3 rounded-2xl border border-white/5">
            {lastRecord.outputSummary}
          </p>
        </div>
      )}

      {/* Agents Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
          Specialized Swarm Agents ({agents.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.agentId}
              agent={agent}
              onExecute={(a) => handleExecute(a.role)}
            />
          ))}
        </div>
      </div>

      {/* Performance Panel & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AgentPerformancePanel agents={agents} status={agentStatus} />
        </div>

        <div className="lg:col-span-2">
          <div className="p-5 rounded-3xl bg-[#06060c] border border-white/10 shadow-xl">
            <AgentExecutionTimeline records={agentHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};
