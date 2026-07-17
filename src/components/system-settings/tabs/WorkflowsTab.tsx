import React from 'react';
import { motion } from 'motion/react';
import { Zap, Layers, Activity, HelpCircle, ShieldCheck } from 'lucide-react';
import { EnterpriseWorkflowEngine } from '../../../engine';

interface WorkflowsTabProps {
  workflows: any[];
  workflowQueue: string[];
  workflowHistory: any[];
  workflowMetrics: any;
  selectedWfForTrace: string | null;
  setSelectedWfForTrace: (id: string | null) => void;
  isProcessingQueue: boolean;
  triggerWorkflowManual: (id: string) => void;
  cancelWorkflowExecution: (id: string) => void;
  triggerAllWorkflowsByEvent: (event: string) => void;
  refreshWorkflowState: () => void;
}

export const WorkflowsTab: React.FC<WorkflowsTabProps> = ({
  workflows,
  workflowQueue,
  workflowHistory,
  workflowMetrics,
  selectedWfForTrace,
  setSelectedWfForTrace,
  isProcessingQueue,
  triggerWorkflowManual,
  cancelWorkflowExecution,
  triggerAllWorkflowsByEvent,
  refreshWorkflowState
}) => {
  return (
    <motion.div
      key="workflows"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left animate-fade-in text-white"
    >
      {/* WORKFLOWS MODULE HEADER */}
      <div className="bg-gradient-to-br from-indigo-950/20 via-slate-900/10 to-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-white/5">
          <div className="space-y-1">
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              Enterprise Workflow Orchestration Engine
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">
              Local-first deterministic orchestrator executing chained agent pipelines based on events, priorities, and dependency maps.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                EnterpriseWorkflowEngine.resetEngineState();
                refreshWorkflowState();
              }}
              className="bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/5 text-zinc-400 hover:text-rose-300 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              [ Reset Scheduler State ]
            </button>
          </div>
        </div>

        {/* EVENT BUS INTEGRATION BROADCAST LOGS */}
        <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isProcessingQueue ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <p className="text-[10px] font-mono text-zinc-300">
              <span className="text-zinc-500 font-bold mr-2">SCHEDULER STATUS:</span>
              {isProcessingQueue ? 'Executing active queue pipelines...' : 'Idle. Awaiting triggering events or manual runs.'}
            </p>
          </div>
        </div>
      </div>

      {/* EVENT TRIGGER RAIL */}
      <div className="bg-slate-950/40 border border-white/5 p-4 rounded-xl space-y-3">
        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
          ⚡ SIMULATE EVENT BROADCASTS (TRIGGER LOCAL WORKFLOWS)
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { event: 'Daily startup', label: 'Daily Startup' },
            { event: 'Weekly review', label: 'Weekly Review' },
            { event: 'Season changes', label: 'Season Transition' },
            { event: 'New fashion trend detected', label: 'Trend Detection' },
            { event: 'User uploads wardrobe', label: 'Wardrobe Upload' }
          ].map((ev) => (
            <button
              key={ev.event}
              onClick={() => triggerAllWorkflowsByEvent(ev.event)}
              disabled={isProcessingQueue}
              className="bg-white/[0.02] border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 text-zinc-300 hover:text-amber-400 font-mono text-[9px] px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-40"
            >
              [ Broadcast: "{ev.label}" ]
            </button>
          ))}
        </div>
      </div>

      {/* ENTERPRISE METRICS DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Active Queue", value: `${workflowMetrics.queueSize} units`, desc: "Pending resolution", color: "text-amber-400" },
          { label: "Completed", value: `${workflowMetrics.completedCount} runs`, desc: "Successful runs", color: "text-emerald-400" },
          { label: "Failed", value: `${workflowMetrics.failedCount} runs`, desc: "Core abort counts", color: "text-rose-400" },
          { label: "Success Rate", value: `${workflowMetrics.successRatePercent}%`, desc: "Execution stability", color: "text-indigo-400" },
          { label: "Overhead", value: "< 0.8ms", desc: "Scheduler dispatch latency", color: "text-teal-400" },
          { label: "Avg Latency", value: `${workflowMetrics.averageDurationMs}ms`, desc: "Agent compute duration", color: "text-violet-400" },
          { label: "Retries Logged", value: `${workflowMetrics.retryOperationsCount} times`, desc: "Self-healing actions", color: "text-amber-300" }
        ].map((m, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[8px] text-zinc-400 block font-mono uppercase tracking-wider">
              {m.label}
            </span>
            <div className="space-y-0.5 my-2">
              <span className={`text-base font-mono font-bold block ${m.color}`}>
                {m.value}
              </span>
            </div>
            <span className="text-[7.5px] text-zinc-500 block leading-tight">
              {m.desc}
            </span>
          </div>
        ))}
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: TEMPLATES & DETAILED PIPELINE EXECUTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* WORKFLOW TEMPLATES GRID */}
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Local Workflow Templates</h4>
                  <p className="text-[9px] text-zinc-500 font-mono">Select a pre-designed corporate template to deploy on the local cluster</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflows.map((wf) => {
                const isRunning = wf.status === 'Running';
                const isCompleted = wf.status === 'Completed';
                const isFailed = wf.status === 'Failed';

                const priorityColor = 
                  wf.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                  wf.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  'bg-zinc-500/10 text-zinc-400 border-white/5';

                return (
                  <div key={wf.id} className="bg-slate-950 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-violet-500/25 duration-300">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[7px] font-mono border px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ${priorityColor}`}>
                          {wf.priority}
                        </span>

                        <span className={`text-[7.5px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isRunning ? 'bg-amber-500/10 text-amber-400 animate-pulse' :
                          isCompleted ? 'bg-emerald-500/10 text-emerald-400' :
                          isFailed ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-zinc-400'
                        }`}>
                          {wf.status}
                        </span>
                      </div>

                      <div>
                        <h5 className="text-xs font-bold text-white tracking-tight">{wf.name}</h5>
                        <p className="text-[9.5px] text-zinc-400 leading-snug mt-1 font-serif italic">
                          "{wf.description}"
                        </p>
                      </div>

                      {/* Required Agents list */}
                      <div className="flex flex-wrap gap-1">
                        {wf.requiredAgents.map((agent: string) => (
                          <span key={agent} className="text-[7.5px] font-mono bg-indigo-950/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/10">
                            {agent.replace('Agent', '')}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-400">
                        <div>
                          <span className="text-[7.5px] text-zinc-500 block uppercase">Trigger Event</span>
                          <span className="text-zinc-200 truncate block">{wf.trigger}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-zinc-500 block uppercase">Confidence</span>
                          <span className="text-emerald-400 font-bold block">{wf.confidenceScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => triggerWorkflowManual(wf.id)}
                        disabled={isProcessingQueue}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] uppercase tracking-wider py-1.5 rounded cursor-pointer disabled:opacity-40 transition-colors font-bold"
                      >
                        [ Deploy & Run ]
                      </button>

                      {isCompleted && (
                        <button
                          onClick={() => setSelectedWfForTrace(wf.id)}
                          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-mono text-[9px] uppercase tracking-wider py-1.5 rounded cursor-pointer transition-colors"
                        >
                          [ Trace Audit ]
                        </button>
                      )}

                      {isRunning && (
                        <button
                          onClick={() => cancelWorkflowExecution(wf.id)}
                          className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-mono text-[9px] uppercase tracking-wider py-1.5 rounded cursor-pointer transition-colors"
                        >
                          [ Terminate ]
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAILED PIPELINE EXECUTION TRACE & TIMELINE */}
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Step-by-Step Executing Pipeline Trace
                  </h4>
                  <p className="text-[9px] text-zinc-500 font-mono">Inspect latency, agent variables, and state outputs across the orchestrated tree</p>
                </div>
              </div>
            </div>

            {selectedWfForTrace ? (() => {
              const selectedWf = workflows.find(w => w.id === selectedWfForTrace);
              if (!selectedWf) return null;

              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black/40 border border-white/5 p-3 rounded-lg">
                    <div>
                      <span className="text-[8px] font-mono text-zinc-500 block uppercase">Inspecting Workflow</span>
                      <span className="text-xs font-bold text-indigo-400">{selectedWf.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-mono text-zinc-500 block uppercase">Duration / Confidence</span>
                      <span className="text-[10px] font-mono text-zinc-300">
                        {selectedWf.durationMs ? `${selectedWf.durationMs}ms` : 'Pending'} / <strong className="text-emerald-400">{selectedWf.confidenceScore}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Visual timeline execution */}
                  <div className="space-y-3 pl-3 border-l border-white/5">
                    {selectedWf.steps.map((step: any, sIdx: number) => {
                      const isStepCompleted = step.status === 'Completed';
                      const isStepRunning = step.status === 'Running';
                      const isStepFailed = step.status === 'Failed';
                      const isStepSkipped = step.status === 'Skipped';

                      return (
                        <div key={step.id} className="relative space-y-1">
                          <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full border border-slate-950 bg-slate-950 flex items-center justify-center">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              isStepCompleted ? 'bg-emerald-400' :
                              isStepRunning ? 'bg-amber-400 animate-ping' :
                              isStepFailed ? 'bg-rose-500' :
                              isStepSkipped ? 'bg-zinc-500' : 'bg-zinc-800'
                            }`} />
                          </div>

                          <div className="flex flex-wrap justify-between items-center text-[10px] font-mono">
                            <div className="space-x-1.5">
                              <span className="text-zinc-500 font-bold">Step {sIdx + 1}:</span>
                              <span className="text-white font-semibold">{step.name}</span>
                              <span className="text-indigo-400">@{step.targetAgent.replace('Agent', '')}</span>
                            </div>

                            <div className="text-zinc-400 space-x-2">
                              <span>{step.durationMs ? `${step.durationMs}ms` : 'Pending'}</span>
                              <span>Confidence: <strong className="text-emerald-400">{step.confidence || 0}%</strong></span>
                              <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-bold ${
                                isStepCompleted ? 'bg-emerald-500/10 text-emerald-400' :
                                isStepRunning ? 'bg-amber-500/10 text-amber-400' :
                                'bg-white/5 text-zinc-500'
                              }`}>
                                {step.status}
                              </span>
                            </div>
                          </div>

                          {/* Step Output details */}
                          {step.output && (
                            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-[9px] font-mono text-zinc-300 leading-relaxed max-h-[100px] overflow-y-auto">
                              <span className="text-zinc-500 block uppercase tracking-wide text-[7.5px] font-bold">Agent Output Result:</span>
                              <p className="mt-0.5 text-zinc-200">
                                {typeof step.output === 'object' 
                                  ? JSON.stringify(step.output).slice(0, 200) + '...'
                                  : String(step.output)
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Result Box */}
                  {selectedWf.resultSummary && (
                    <div className="bg-gradient-to-r from-indigo-950/20 to-black/40 border border-indigo-500/10 p-3.5 rounded-xl space-y-1">
                      <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest font-bold block">✓ RESOLVED ORCHESTRATION RESULT</span>
                      <p className="text-[10px] font-mono text-zinc-200 leading-relaxed font-serif italic">
                        "{selectedWf.resultSummary}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="bg-black/30 border border-white/5 p-8 rounded-xl text-center space-y-1.5 py-14">
                <HelpCircle className="w-6 h-6 text-zinc-600 mx-auto" />
                <p className="text-[11px] font-mono text-zinc-400 font-bold">No Trace Audit Selected</p>
                <p className="text-[9px] text-zinc-500">Deploy & Run any template above, then click [ Trace Audit ] to inspect intermediate variables in this console.</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: QUEUE & DEPENDENCY FLOWGRAPH */}
        <div className="space-y-6">

          {/* SCHEDULER PRIORITY QUEUE */}
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Scheduler Priority Queue</h4>
              <p className="text-[9px] text-zinc-500 font-mono">Live list of scheduled processes awaiting dispatcher turn</p>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
              {workflowQueue.map((qId, idx) => {
                const qWf = workflows.find(w => w.id === qId);
                if (!qWf) return null;

                return (
                  <div key={qId} className="bg-black/40 border border-white/5 p-3 rounded-lg flex items-center justify-between font-mono text-[10px]">
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 text-[8px] font-bold block">POS {idx + 1} • {qWf.priority}</span>
                      <span className="text-white font-semibold truncate max-w-[150px] block">{qWf.name}</span>
                    </div>
                    <span className="text-amber-400 animate-pulse text-[8px] uppercase font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                      QUEUED
                    </span>
                  </div>
                );
              })}

              {workflowQueue.length === 0 && (
                <div className="text-center py-8 text-zinc-600 font-mono text-[9px] italic border border-dashed border-white/5 rounded-xl">
                  "Priority queue empty. All systems normal."
                </div>
              )}
            </div>
          </div>

          {/* DEPENDENCY FLOW CHART */}
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Orchestration Routing Chain</h4>
              <p className="text-[9px] text-zinc-500 font-mono">Canonical dependency chain resolved for daily outfit plans</p>
            </div>

            <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-3.5 font-mono text-[9px] text-zinc-400">
              {[
                { node: "Climate Context Analyzer", desc: "Monitors active weather changes & thermal coefficients", color: "border-teal-500/30 text-teal-300" },
                { node: "Vision Category Classifier", desc: "Checks outfit similarity metrics to avoid repetition", color: "border-indigo-500/30 text-indigo-300" },
                { node: "Memory Profile Loader", desc: "Loads user style preference matrices & previous feedback", color: "border-purple-500/30 text-purple-300" },
                { node: "Color Harmony Checker", desc: "Validates palette integrity via high-contrast taxonomy maps", color: "border-amber-500/30 text-amber-300" },
                { node: "Multi-Node Ranking Tree", desc: "Calculates strategic look suitability and efficiency points", color: "border-emerald-500/30 text-emerald-300" },
                { node: "Stylist Core Renderer", desc: "Formulates final recommendation proposal coordinates", color: "border-pink-500/30 text-pink-300" }
              ].map((step, idx, arr) => (
                <div key={idx} className="space-y-2">
                  <div className={`p-2.5 rounded-lg border bg-white/[0.01] ${step.color}`}>
                    <strong className="block text-[9.5px] mb-0.5">{step.node}</strong>
                    <span className="text-[7.5px] leading-tight block text-zinc-500">{step.desc}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="text-center text-zinc-600 font-bold leading-none py-0.5">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SELF-HEALING ENGINE MONITOR */}
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Self-Healing Cluster Policy
              </h4>
              <p className="text-[9px] text-zinc-500 font-mono">Fail-safe mechanism logs</p>
            </div>

            <div className="bg-black/60 p-3.5 rounded-lg text-[9px] font-mono text-zinc-300 space-y-2 border border-white/5">
              <div className="flex justify-between border-b border-white/5 pb-1 text-[8px] text-zinc-500">
                <span>POLICY TYPE</span>
                <span>STATUS</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Transient Network Timeout</span>
                <span className="text-emerald-400 font-bold">Auto-Retry (3x)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Secondary Agent Crash</span>
                <span className="text-amber-400">Fallback/Skip Step</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Color Conflict Detection</span>
                <span className="text-indigo-400">Trigger Resolver</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* HISTORICAL WORKFLOW EXECUTION LIST */}
      <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block">
          Continuous Learning & Historical Runs Log
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px]">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500">
                <th className="pb-2 font-semibold">Workflow Name</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Duration</th>
                <th className="pb-2 font-semibold">Confidence</th>
                <th className="pb-2 font-semibold">Timestamp</th>
                <th className="pb-2 font-semibold text-right">Execution Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {workflowHistory.map((hist, index) => (
                <tr key={index} className="hover:bg-white/[0.01] transition-all">
                  <td className="py-2.5 font-semibold text-white">{hist.name}</td>
                  <td className="py-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-bold ${
                      hist.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      hist.status === 'Cancelled' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {hist.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 text-zinc-400">{hist.durationMs ? `${hist.durationMs}ms` : 'Pending'}</td>
                  <td className="py-2.5 text-emerald-400 font-bold">{hist.confidenceScore}%</td>
                  <td className="py-2.5 text-zinc-500">{new Date(hist.createdTime).toLocaleTimeString()}</td>
                  <td className="py-2.5 text-right text-zinc-300 max-w-xs truncate">{hist.resultSummary || 'N/A'}</td>
                </tr>
              ))}

              {workflowHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 italic">
                    No workflows executed in this session.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
