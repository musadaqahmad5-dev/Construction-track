import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { AutonomousGoalRecord, ExecutionMetricsSummary, AutonomousExecutionEngine } from '../../../engine';

interface AutonomousTabProps {
  schedulerPolicy: 'Priority First' | 'FCFS' | 'Interactive Adaptive';
  setSchedulerPolicy: (val: 'Priority First' | 'FCFS' | 'Interactive Adaptive') => void;
  autonomousGoals: AutonomousGoalRecord[];
  setAutonomousGoals: (goals: AutonomousGoalRecord[]) => void;
  activeGoalId: string;
  setActiveGoalId: (id: string) => void;
  customGoalName: string;
  setCustomGoalName: (val: string) => void;
  customGoalDesc: string;
  setCustomGoalDesc: (val: string) => void;
  runGoalStep: (goalId: string, taskId: string) => void;
  rollbackGoal: (goalId: string) => void;
  recoverGoalTask: (goalId: string, taskId: string) => void;
  createCustomGoal: () => void;
  executionMetrics: ExecutionMetricsSummary;
  setAgentLog: (msg: string) => void;
}

export const AutonomousTab: React.FC<AutonomousTabProps> = ({
  schedulerPolicy,
  setSchedulerPolicy,
  autonomousGoals,
  setAutonomousGoals,
  activeGoalId,
  setActiveGoalId,
  customGoalName,
  setCustomGoalName,
  customGoalDesc,
  setCustomGoalDesc,
  runGoalStep,
  rollbackGoal,
  recoverGoalTask,
  createCustomGoal,
  executionMetrics,
  setAgentLog
}) => {
  const currentGoal = autonomousGoals.find(g => g.id === activeGoalId);

  return (
    <motion.div
      key="autonomous"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans text-white"
    >
      {/* AUTONOMOUS ENGINE HEADER */}
      <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
              Enterprise Autonomous Goal Execution Layer Active
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            Autonomous Goal Execution Center
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Automate approved planning objectives, execute topological tasks with dependency checks, and audit self-repair recovery sequences.
          </p>
        </div>

        {/* SCHEDULER POLICY CONTROLS */}
        <div className="bg-black/30 border border-white/5 p-1.5 rounded-xl flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider pl-2">Policy:</span>
          {(['Priority First', 'FCFS', 'Interactive Adaptive'] as const).map((policy) => (
            <button
              key={policy}
              onClick={() => {
                setSchedulerPolicy(policy);
                setAgentLog(`AutonomousEngine: Scheduler policy updated to ${policy}.`);
              }}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                schedulerPolicy === policy
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-bold'
                  : 'text-zinc-500 hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              {policy}
            </button>
          ))}
        </div>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Goal Success Rate */}
        <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Goal Success Rate</span>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-light text-white font-mono">{executionMetrics.successRate}%</span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">OPTIMAL</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${executionMetrics.successRate}%` }}
              />
            </div>
          </div>
          <div className="text-[8.5px] font-mono text-zinc-500 flex justify-between">
            <span>Completed: {executionMetrics.completedCount}</span>
            <span>Failed: {executionMetrics.failedCount}</span>
          </div>
        </div>

        {/* Metric 2: Avg Execution Latency */}
        <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Average Step Latency</span>
          <div>
            <span className="text-3xl font-light text-white font-mono">{executionMetrics.averageExecutionTime}ms</span>
            <div className="text-[8.5px] font-mono text-zinc-500 mt-2">
              Topological sort & scheduling validation time.
            </div>
          </div>
          <div className="text-[8.5px] font-mono text-zinc-500">
            Clock cycles: <span className="text-white">Deterministic Local</span>
          </div>
        </div>

        {/* Metric 3: Multi-Agent Platform Utilization */}
        <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Agent Utilization Index</span>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
              <span>Thread Allocation</span>
              <span className="text-white font-bold">{executionMetrics.agentUtilizationRate}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${executionMetrics.agentUtilizationRate}%` }} />
            </div>
          </div>
          <div className="text-[8.5px] font-mono text-zinc-500">
            Active Bus channels: <span className="text-white">5 Headless Agents</span>
          </div>
        </div>

        {/* Metric 4: Workflow Synchronization Rate */}
        <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Workflow Harness Sync</span>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
              <span>Integration Coverage</span>
              <span className="text-white font-bold">{executionMetrics.workflowUtilizationRate}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-violet-500 h-full rounded-full" style={{ width: `${executionMetrics.workflowUtilizationRate}%` }} />
            </div>
          </div>
          <div className="text-[8.5px] font-mono text-zinc-500">
            Shared engines: <span className="text-white">11 Registered</span>
          </div>
        </div>
      </div>

      {/* THREE-COLUMN INTERACTIVE TERMINALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Goals List & Scheduler Configuration (span 4) */}
        <div className="bg-black/40 border border-white/5 p-5 rounded-3xl lg:col-span-4 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Orchestrator Registry</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Active Execution Goals</h4>
            </div>

            {/* Active Goals list */}
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {autonomousGoals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGoalId(g.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col space-y-1.5 ${
                    activeGoalId === g.id
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                      : 'bg-black/25 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-[11px] font-bold tracking-tight leading-none text-white">{g.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[7.5px] font-mono font-bold uppercase ${
                      g.overallState === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      g.overallState === 'Running' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' :
                      g.overallState === 'Failed' ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {g.overallState}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed font-sans">{g.description}</p>
                  <div className="text-[8.5px] font-mono text-zinc-500 flex justify-between w-full pt-1.5 border-t border-white/5">
                    <span>Tasks: {g.tasks.length}</span>
                    <span>Priority: {g.tasks[0]?.priority || 'Medium'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Seed Reset and Custom Dispatcher */}
          <div className="pt-4 border-t border-white/5 space-y-3 text-left">
            <div className="space-y-1.5">
              <span className="text-[8.5px] font-mono uppercase text-zinc-500 font-bold block">Speculative Custom Goal Dispatcher</span>
              <input
                type="text"
                placeholder="e.g. Winter Capsule Curation"
                value={customGoalName}
                onChange={(e) => setCustomGoalName(e.target.value)}
                className="w-full bg-black/60 text-white font-mono text-[10px] border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-indigo-500/40"
              />
              <input
                type="text"
                placeholder="Goal description context..."
                value={customGoalDesc}
                onChange={(e) => setCustomGoalDesc(e.target.value)}
                className="w-full bg-black/60 text-white font-mono text-[10px] border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-indigo-500/40"
              />
              <button
                onClick={createCustomGoal}
                disabled={!customGoalName.trim()}
                className="w-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/35 text-indigo-300 font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                [ Dispatch Custom Goal Seq ]
              </button>
            </div>

            <button
              onClick={() => {
                const defaults = AutonomousExecutionEngine.resetToDefault();
                setAutonomousGoals(defaults);
                setActiveGoalId('goal-seasonal-curator');
                setAgentLog("AutonomousEngine: Execution queue restored to high-fidelity factory default seed.");
              }}
              className="w-full text-center text-[9px] font-mono text-rose-400 hover:text-rose-300 cursor-pointer pt-2 border-t border-white/5"
            >
              [ Reset Database to Defaults ]
            </button>
          </div>
        </div>

        {/* 2. Selected Goal's Dependency Graph & Task List (span 4) */}
        <div className="bg-black/40 border border-white/5 p-5 rounded-3xl lg:col-span-4 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Dependency Solver</span>
            <h4 className="text-sm font-bold text-white tracking-tight">Topological Task Queue</h4>
            <p className="text-[10px] text-zinc-400 font-sans">
              Tasks are arranged topologically. Predecessors must succeed before descendants proceed.
            </p>
          </div>

          {!currentGoal ? (
            <div className="text-zinc-500 text-[10px] italic py-8 font-mono">
              Select a goal in the list to examine its dependency graph...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Graph tree presentation */}
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                {AutonomousExecutionEngine.resolveDependencies(currentGoal.tasks).map((t, i, solvedTasks) => {
                  const hasPredecessor = t.dependencies.length > 0;
                  return (
                    <div key={t.id} className="relative flex items-start gap-3">
                      {/* Left trace indicator line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                          t.state === 'Completed' ? 'bg-emerald-500 border-emerald-500' :
                          t.state === 'Recovered' ? 'bg-emerald-400 border-emerald-400' :
                          t.state === 'Running' ? 'bg-indigo-500 border-indigo-500 animate-pulse' :
                          t.state === 'Failed' ? 'bg-rose-500 border-rose-500' : 'bg-zinc-800 border-zinc-700'
                        }`}>
                          {t.state === 'Completed' && <Check className="w-2 h-2 text-black" />}
                        </div>
                        {i < solvedTasks.length - 1 && (
                          <div className="w-0.5 bg-white/5 h-16" />
                        )}
                      </div>

                      {/* Task card */}
                      <div className="bg-black/35 border border-white/5 p-3 rounded-xl flex-1 space-y-1.5 text-left relative overflow-hidden">
                        {t.state === 'Running' && (
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 animate-pulse" />
                        )}
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold font-mono text-zinc-100">{t.type}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono ${
                            t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' :
                            t.priority === 'High' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            {t.priority}
                          </span>
                        </div>

                        <div className="text-[8.5px] font-mono text-zinc-400 flex justify-between items-center">
                          <span>Progress: {t.progress}%</span>
                          <span>{t.executionTimeMs}ms</span>
                        </div>

                        {/* Predecessor reference */}
                        {hasPredecessor && (
                          <div className="text-[7.5px] font-mono text-indigo-400 bg-indigo-950/20 border border-indigo-500/10 px-2 py-0.5 rounded w-max">
                            Predecessor: {t.dependencies.join(', ')}
                          </div>
                        )}

                        {/* Individual task actions */}
                        <div className="flex gap-1.5 pt-1 border-t border-white/5 justify-end">
                          {t.state === 'Failed' && (
                            <button
                              onClick={() => recoverGoalTask(currentGoal.id, t.id)}
                              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[8px] py-1 px-2.5 rounded border border-emerald-500/20 cursor-pointer font-bold"
                            >
                              [ Self-Repair / Recover ]
                            </button>
                          )}
                          {(t.state === 'Idle' || t.state === 'Waiting' || t.state === 'Queued' || t.state === 'Running') && (
                            <button
                              onClick={() => runGoalStep(currentGoal.id, t.id)}
                              className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-mono text-[8.5px] py-1 px-2.5 rounded border border-indigo-500/20 cursor-pointer font-bold"
                            >
                              {t.state === 'Running' ? '[ Progressing Step ]' : '[ Compile & Execute ]'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rollback and Complete triggers */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => rollbackGoal(currentGoal.id)}
                  className="w-full bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 font-mono text-[9px] uppercase tracking-wider py-2 rounded-xl border border-rose-500/10 transition-all cursor-pointer font-bold"
                >
                  [ Rollback Goal State ]
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Task Monitor, Logs & Live Trace (span 4) */}
        <div className="bg-black/40 border border-white/5 p-5 rounded-3xl lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Task Monitor</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Active Step Log Diagnostic</h4>
              <p className="text-[10px] text-zinc-400 font-sans">
                Inspect telemetry and run logs for the selected autonomous goal sequence.
              </p>
            </div>

            {!currentGoal ? (
              <div className="text-zinc-500 text-[10px] italic py-8 font-mono">No goal active...</div>
            ) : (
              <div className="space-y-3">
                <div className="bg-black/85 border border-white/10 rounded-xl p-3.5 h-64 overflow-y-auto custom-scrollbar font-mono text-[9px] text-zinc-400 space-y-1">
                  <div className="text-zinc-500 italic pb-1.5 border-b border-white/5 flex justify-between items-center mb-1">
                    <span>System process trace</span>
                    <span>CPU ACTIVE</span>
                  </div>
                  {currentGoal.tasks.flatMap(t => t.logs.map(log => ({ task: t.type, text: log }))).map((lg, idx) => (
                    <div key={idx} className="leading-relaxed text-left">
                      <span className="text-indigo-400/80 font-bold mr-1">@{lg.task.replace(' ', '')}</span>
                      <span className={lg.text.includes('[CRITICAL]') || lg.text.includes('[FAIL]') ? 'text-rose-400' : lg.text.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-zinc-300'}>
                        {lg.text}
                      </span>
                    </div>
                  ))}
                  <div className="text-zinc-600 italic mt-1.5 text-left">... listening for next scheduler trigger ...</div>
                </div>

                {/* Interactive Retry Policy details */}
                <div className="bg-black/35 border border-white/5 p-3 rounded-xl space-y-1.5 text-left">
                  <span className="text-[8px] font-mono text-zinc-500 block uppercase font-bold">Execution & Retry Policy</span>
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-zinc-400">
                    <div>Standard Policy: <strong className="text-zinc-200">Local-First</strong></div>
                    <div>Max Backoff: <strong className="text-zinc-200">3 Retries</strong></div>
                    <div>Execution Policy: <strong className="text-indigo-300">Self-Repairing</strong></div>
                    <div>Rollback Policy: <strong className="text-rose-300">Deterministic</strong></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8.5px] font-mono text-zinc-500">
            <span>SCHEDULER STATUS: ONLINE</span>
            <span className="text-emerald-400 animate-pulse font-bold">● ACTIVE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
