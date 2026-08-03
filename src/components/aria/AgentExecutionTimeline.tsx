/**
 * ARIA v2.5 Agent Execution Timeline Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { AgentExecutionRecord } from '../../aria/agents/AgentTypes';
import { AgentStatusBadge } from './AgentStatusBadge';
import { History, Bot, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AgentExecutionTimelineProps {
  records: AgentExecutionRecord[];
  className?: string;
}

export const AgentExecutionTimeline: React.FC<AgentExecutionTimelineProps> = ({
  records,
  className = ''
}) => {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
            Multi-Agent Execution Log ({records.length} Records)
          </h4>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-zinc-400 space-y-2">
          <Bot className="w-6 h-6 text-indigo-400 mx-auto opacity-50" />
          <p>No agent executions logged yet. Dispatch an agent from the Control Room above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.executionId}
              className="p-4 rounded-2xl bg-gradient-to-b from-[#0a0a14] to-[#040408] border border-white/10 space-y-2.5 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase">
                    {record.agentRole}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {new Date(record.executedAt).toLocaleTimeString()} ({record.latencyMs}ms)
                  </span>
                </div>

                <AgentStatusBadge status={record.status} />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-white">
                  Query: "{record.prompt}"
                </p>
                <p className="text-xs font-mono text-zinc-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  {record.outputSummary}
                </p>
              </div>

              {record.supportingEvidence && record.supportingEvidence.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold block">Supporting Signals:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {record.supportingEvidence.map((ev, idx) => (
                      <span key={idx} className="text-[9px] font-mono bg-white/[0.03] border border-white/5 text-zinc-300 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
