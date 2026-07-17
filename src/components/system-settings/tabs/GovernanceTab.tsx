import React from 'react';
import { motion } from 'motion/react';
import { 
  SystemRule, 
  PendingApproval, 
  PolicyViolation, 
  GovernanceRecommendation, 
  EnterpriseGovernanceEngine,
  GovernanceState
} from '../../../engine';

export interface GovernanceTimelineEvent {
  time: string;
  text: string;
  category: string;
}

interface GovernanceTabProps {
  systemHealthMetrics: {
    governanceState: GovernanceState;
    overallAIHealthScore: number;
    engineHealth: number;
    workflowHealth: number;
    learningHealth: number;
    predictionHealth: number;
    planningHealth: number;
    executionHealth: number;
  };
  governanceRules: SystemRule[];
  governanceApprovals: PendingApproval[];
  governanceViolations: PolicyViolation[];
  governanceRecommendations: GovernanceRecommendation[];
  governanceTimeline: GovernanceTimelineEvent[];
  handleApprovalDecision: (id: string, approved: boolean) => void;
  toggleRuleStatus: (id: string) => void;
  setGovernanceViolations: (violations: PolicyViolation[]) => void;
  setAgentLog: (msg: string) => void;
}

export const GovernanceTab: React.FC<GovernanceTabProps> = ({
  systemHealthMetrics,
  governanceRules,
  governanceApprovals,
  governanceViolations,
  governanceRecommendations,
  governanceTimeline,
  handleApprovalDecision,
  toggleRuleStatus,
  setGovernanceViolations,
  setAgentLog
}) => {
  return (
    <motion.div
      key="governance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans text-white"
    >
      {/* GOVERNANCE ENGINE HEADER */}
      <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              systemHealthMetrics.governanceState === 'Healthy' ? 'bg-emerald-400' :
              systemHealthMetrics.governanceState === 'Warning' ? 'bg-amber-400' : 'bg-rose-400'
            }`} />
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Operating System State: 
              <span className={`font-bold ${
                systemHealthMetrics.governanceState === 'Healthy' ? 'text-emerald-400' :
                systemHealthMetrics.governanceState === 'Warning' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {systemHealthMetrics.governanceState.toUpperCase()}
              </span>
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            Governance & Policy Intelligence Console
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Enforce computational boundaries, supervise autonomous decisions, resolve structural resource conflicts, and monitor system-wide AI safety rules.
          </p>
        </div>

        {/* OVERALL HEALTH ACCENT */}
        <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Overall AI Health Score</span>
            <span className="text-2xl font-light font-mono text-white">{systemHealthMetrics.overallAIHealthScore}%</span>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02]">
            <span className={`text-[11px] font-bold font-mono ${
              systemHealthMetrics.overallAIHealthScore >= 80 ? 'text-emerald-400' :
              systemHealthMetrics.overallAIHealthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {systemHealthMetrics.overallAIHealthScore >= 80 ? 'EXC' : 'WARN'}
            </span>
          </div>
        </div>
      </div>

      {/* INTEGRATED HEALTH SUB-METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { name: 'Core Engines', score: systemHealthMetrics.engineHealth, color: 'bg-emerald-500' },
          { name: 'Workflows', score: systemHealthMetrics.workflowHealth, color: 'bg-teal-500' },
          { name: 'Learning Loop', score: systemHealthMetrics.learningHealth, color: 'bg-indigo-500' },
          { name: 'Predictive Model', score: systemHealthMetrics.predictionHealth, color: 'bg-violet-500' },
          { name: 'Goal Planning', score: systemHealthMetrics.planningHealth, color: 'bg-fuchsia-500' },
          { name: 'Auto Execution', score: systemHealthMetrics.executionHealth, color: 'bg-pink-500' },
        ].map((subMetric, idx) => (
          <div key={idx} className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between">
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block truncate">{subMetric.name}</span>
            <div className="space-y-1">
              <span className="text-lg font-mono text-white font-light">{subMetric.score}%</span>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${subMetric.color}`} style={{ width: `${subMetric.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT MAIN PANEL: Policies, Approvals & Violations (span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. APPROVAL CENTER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Administrator Supervisor</span>
                <h4 className="text-sm font-bold text-white tracking-tight">System Approval Request Hub</h4>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 bg-white/5 px-2.5 py-1 rounded">
                Pending Requests: {governanceApprovals.filter(a => a.status === 'Pending').length}
              </span>
            </div>

            <div className="space-y-3">
              {governanceApprovals.map((appr) => (
                <div 
                  key={appr.id} 
                  className={`p-3.5 rounded-xl border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition-all ${
                    appr.status === 'Pending' ? 'bg-indigo-500/5 border-indigo-500/10' :
                    appr.status === 'Approved' ? 'bg-emerald-500/5 border-emerald-500/10 opacity-75' :
                    'bg-rose-500/5 border-rose-500/10 opacity-75'
                  }`}
                >
                  <div className="space-y-1.5 max-w-xl text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold font-mono text-zinc-100">{appr.actionName}</span>
                      <span className="text-[8px] font-mono text-zinc-500 font-bold">Requested by: @{appr.requestedBy}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold ${
                        appr.riskRating === 'High' ? 'bg-rose-500/15 text-rose-400' :
                        appr.riskRating === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'
                      }`}>
                        Risk: {appr.riskRating}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{appr.description}</p>
                    <span className="text-[8px] font-mono text-zinc-500 block">
                      Dispatched: {new Date(appr.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {appr.status === 'Pending' ? (
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleApprovalDecision(appr.id, false)}
                        className="flex-1 md:flex-none bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-mono text-[8.5px] uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-all font-bold"
                      >
                        [ Decline ]
                      </button>
                      <button
                        onClick={() => handleApprovalDecision(appr.id, true)}
                        className="flex-1 md:flex-none bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/20 font-mono text-[8.5px] uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all font-bold"
                      >
                        [ Approve ]
                      </button>
                    </div>
                  ) : (
                    <div className="w-full md:w-auto text-right">
                      <span className={`px-2.5 py-1 rounded text-[8.5px] font-mono font-bold uppercase tracking-wider ${
                        appr.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        Decision: {appr.status}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. POLICY RULES CENTER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Rule Engine Controller</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Active Computational Constraints</h4>
              <p className="text-[10px] text-zinc-400">
                Toggle active policies to restrict or expand the automated degrees of freedom available to multi-agent engines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {governanceRules.map((rule) => (
                <div 
                  key={rule.id} 
                  className={`p-3.5 rounded-xl border bg-black/20 flex flex-col justify-between space-y-3 transition-all ${
                    rule.status === 'Active' ? 'border-white/5' : 'border-white/5 opacity-50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-white leading-none tracking-tight">{rule.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono ${
                        rule.severity === 'Critical' ? 'bg-rose-500/15 text-rose-400' :
                        rule.severity === 'Warning' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'
                      }`}>
                        {rule.severity}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">@{rule.category}</span>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{rule.description}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <span className={`text-[8.5px] font-mono font-bold uppercase ${
                      rule.status === 'Active' ? 'text-emerald-400' :
                      rule.status === 'Triggered' ? 'text-rose-400 animate-pulse' : 'text-zinc-500'
                    }`}>
                      State: {rule.status}
                    </span>
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`font-mono text-[8.5px] py-1 px-2.5 rounded transition-all cursor-pointer font-bold ${
                        rule.status === 'Active'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/15'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15'
                      }`}
                    >
                      {rule.status === 'Active' ? '[ Suspend Rule ]' : '[ Activate Rule ]'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. VIOLATION AUDIT RECORD */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-rose-400 font-bold uppercase tracking-wider block">Security Violation Terminal</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Active Policy Violations & Exceptions</h4>
            </div>

            <div className="space-y-3">
              {governanceViolations.map((viol) => (
                <div 
                  key={viol.id} 
                  className={`p-3.5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                    viol.remedied ? 'bg-emerald-500/5 border-emerald-500/10 opacity-75' : 'bg-rose-500/5 border-rose-500/10'
                  }`}
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-white">{viol.ruleName}</span>
                      <span className="text-[8px] font-mono text-zinc-500">Category: @{viol.category}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-mono uppercase font-bold ${
                        viol.remedied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'
                      }`}>
                        {viol.remedied ? 'REMEDIED' : 'UNRESOLVED'}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">{viol.description}</p>
                    <div className="text-[8.5px] text-indigo-300 font-mono">
                      Recommended Action: {viol.recommendedAction}
                    </div>
                  </div>

                  {!viol.remedied && (
                    <button
                      onClick={() => {
                        // Direct action trigger to remedy
                        if (viol.id === 'viol-purge') {
                          handleApprovalDecision('appr-purge-black', true);
                        } else if (viol.id === 'viol-dna') {
                          const vCopy = [...governanceViolations];
                          const currentViol = vCopy.find(v => v.id === 'viol-dna');
                          if (currentViol) {
                            currentViol.remedied = true;
                            currentViol.description += ' Remedied via active backpropagation optimization.';
                            setGovernanceViolations(vCopy);
                          }
                          setAgentLog("GovernanceEngine: Remedied style DNA stability violation via interactive parameter backpropagation.");
                        }
                      }}
                      className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-mono text-[8px] py-1.5 px-3 rounded-lg border border-indigo-500/25 cursor-pointer font-bold whitespace-nowrap"
                    >
                      [ Resolve Exception ]
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE PANEL: Recommendations, Timeline & Metrics (span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. AUTOMATIC REPAIR RECOMMENDATIONS */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Aesthetic Auto-Heal</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Governance Recommendations</h4>
            </div>

            <div className="space-y-3">
              {governanceRecommendations.map((rec) => (
                <div key={rec.id} className="bg-black/25 border border-white/5 p-3.5 rounded-xl space-y-2 text-left">
                  <div className="flex justify-between items-start gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-100">{rec.title}</span>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold whitespace-nowrap">
                      {rec.efficiencyGain}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-zinc-400 leading-relaxed font-sans">{rec.description}</p>
                  <div className="flex justify-between items-center pt-1.5 border-t border-white/5 text-[8px] font-mono text-zinc-500">
                    <span>Impact: {rec.impactScore}/100</span>
                    <span>Category: @{rec.category.replace(' ', '')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. REAL-TIME GOVERNANCE TIMELINE */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Supervised Logging</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Governance Activity Trace</h4>
                <p className="text-[9.5px] text-zinc-400 leading-relaxed">
                  Chrono-stream tracking background rule executions, state validations, and policy matches.
                </p>
              </div>

              <div className="bg-black/90 border border-white/10 rounded-xl p-3.5 h-64 overflow-y-auto custom-scrollbar font-mono text-[9px] text-zinc-400 space-y-2">
                {governanceTimeline.map((item, idx) => (
                  <div key={idx} className="leading-relaxed border-b border-white/[0.03] pb-1.5 text-left">
                    <div className="flex justify-between text-[8px] text-zinc-500 mb-0.5">
                      <span>[{item.time}]</span>
                      <span className="text-indigo-400 font-bold">@{item.category}</span>
                    </div>
                    <span className="text-zinc-200 block text-left">{item.text}</span>
                  </div>
                ))}
                <div className="text-zinc-600 italic text-left">... monitoring local orchestration channels headlessly ...</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8.5px] font-mono text-zinc-500">
              <span>GOVERNOR ENGINES: COMPLIANT</span>
              <span className="text-emerald-400 animate-pulse font-bold">● COOPERATIVE</span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
