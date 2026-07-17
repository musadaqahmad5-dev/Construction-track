import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';
import { 
  EnterpriseResourceMetrics, 
  EnterpriseReadinessReport, 
  SystemCoordinationSummary, 
  ProductIntelligenceReport, 
  DiagnosticsSummary 
} from '../../../engine';

interface OverviewTabProps {
  resourceMetrics: EnterpriseResourceMetrics;
  validationReport: EnterpriseReadinessReport;
  coordinationSummary: SystemCoordinationSummary;
  productReport: ProductIntelligenceReport;
  diagnosticsSummary: DiagnosticsSummary;
  setActiveSubTab: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  resourceMetrics,
  validationReport,
  coordinationSummary,
  productReport,
  diagnosticsSummary,
  setActiveSubTab
}) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans text-white"
    >
      {/* ENTERPRISE OS CONTROL PANEL SUMMARY */}
      <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Enterprise System Hub: 
              <span className="text-indigo-400 font-bold">COHERENT ARCHITECTURE</span>
            </span>
          </div>
          <h3 className="text-2xl font-serif font-light text-white tracking-tight">
            AI Operating System Control Panel
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Real-time status overview of the entire AIStyleHub distributed engine layer, synchronizing memory, intelligence, validation and execution headlessly.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-black/30 border border-white/5 p-4 rounded-2xl">
          <div className="text-right">
            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">System State</span>
            <span className="text-lg font-mono text-emerald-400 font-bold">100% DECOUPLED</span>
          </div>
        </div>
      </div>

      {/* CORE BENTO GRID STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RESOURCE footprint CARD */}
        <div 
          onClick={() => setActiveSubTab('PERFORMANCE')}
          className="bg-black/45 border border-white/5 hover:border-violet-500/20 p-5 rounded-2xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] duration-300"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">System Footprint</span>
            <Cpu className="w-4 h-4 text-violet-400" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-light font-mono text-white">{resourceMetrics.cpuUsagePercent}%</span>
            <span className="text-[9px] text-zinc-500 font-mono block">CPU Usage | {resourceMetrics.memoryUsageMb}MB RAM</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${resourceMetrics.cpuUsagePercent}%` }} />
          </div>
        </div>

        {/* VALIDATION SCORE CARD */}
        <div 
          onClick={() => setActiveSubTab('VALIDATION')}
          className="bg-black/45 border border-white/5 hover:border-emerald-500/20 p-5 rounded-2xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] duration-300"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Architecture Score</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-light font-mono text-emerald-400">{validationReport.overallEnterpriseScore}/100</span>
            <span className="text-[9px] text-zinc-500 font-mono block">Enterprise Quality Checklist</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${validationReport.overallEnterpriseScore}%` }} />
          </div>
        </div>

        {/* COORDINATION SYNCHRONIZATION CARD */}
        <div 
          onClick={() => setActiveSubTab('COORDINATION')}
          className="bg-black/45 border border-white/5 hover:border-indigo-500/20 p-5 rounded-2xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] duration-300"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Coordination Sync</span>
            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-light font-mono text-white">
              {coordinationSummary.enginesSynchronized}/{coordinationSummary.totalEnginesCoordinated}
            </span>
            <span className="text-[9px] text-zinc-500 font-mono block">Engines Unified | Index: {coordinationSummary.coordinationScore}%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${coordinationSummary.coordinationScore}%` }} />
          </div>
        </div>

        {/* PRODUCT READY CARD */}
        <div 
          onClick={() => setActiveSubTab('PRODUCT')}
          className="bg-black/45 border border-white/5 hover:border-teal-500/20 p-5 rounded-2xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] duration-300"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Product readiness</span>
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-light font-mono text-teal-300">{productReport.metrics.overallProductReadiness}%</span>
            <span className="text-[9px] text-zinc-500 font-mono block">UX Completion & Journeys Scan</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${productReport.metrics.overallProductReadiness}%` }} />
          </div>
        </div>
      </div>

      {/* CORE INTEGRATION CHANNELS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CORE PLATFORM STABILITY CHART & STATUS */}
        <div className="lg:col-span-8 bg-black/40 border border-white/5 p-5 rounded-3xl space-y-5 text-left">
          <div className="pb-3 border-b border-white/5 flex justify-between items-center text-left">
            <div className="space-y-0.5 text-left">
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Decoupled Architecture Status</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Active Engine Control Planes</h4>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">Local Validation Core</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3.5 bg-black/25 p-4 rounded-xl border border-white/5">
              <span className="text-[9.5px] font-mono text-zinc-400 block uppercase tracking-wider">Engine Diagnostic Status</span>
              <div className="space-y-2">
                {[
                  { name: 'Governance Engine', score: 100, status: 'GOVERNED' },
                  { name: 'Planning Intelligence', score: 95, status: 'STABLE' },
                  { name: 'Reasoning Engine', score: 98, status: 'RESOLVED' },
                  { name: 'Autonomy Control', score: 96, status: 'AUTONOMOUS' },
                  { name: 'Unified Style Memory', score: 100, status: 'COHERENT' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-400">@{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80">{item.score}%</span>
                      <span className="text-[7.5px] font-mono text-emerald-400 bg-emerald-950/20 px-1 py-0.5 rounded border border-emerald-500/10 font-bold">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-black/25 p-4 rounded-xl border border-white/5">
              <span className="text-[9.5px] font-mono text-zinc-400 block uppercase tracking-wider">Active System Health Indices</span>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-center">
                  <span className="text-[7.5px] font-mono text-zinc-500 uppercase block leading-normal">Stability Index</span>
                  <span className="text-lg font-mono text-indigo-400 font-bold">{diagnosticsSummary.systemStabilityIndex}%</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-center">
                  <span className="text-[7.5px] font-mono text-zinc-500 uppercase block leading-normal">UX Reliability</span>
                  <span className="text-lg font-mono text-teal-400 font-bold">{diagnosticsSummary.executionReliability}%</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-center">
                  <span className="text-[7.5px] font-mono text-zinc-500 uppercase block leading-normal">Engine Cohesion</span>
                  <span className="text-lg font-mono text-emerald-400 font-bold">{diagnosticsSummary.engineStabilityIndex}%</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-center">
                  <span className="text-[7.5px] font-mono text-zinc-500 uppercase block leading-normal">System Headroom</span>
                  <span className="text-lg font-mono text-violet-400 font-bold">{resourceMetrics.capacity.estimatedHeadroom}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE ALERTS & INCIDENTS radar */}
        <div className="lg:col-span-4 bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-[8.5px] font-mono text-rose-400 font-bold uppercase tracking-wider block">Operational Security</span>
            <h4 className="text-sm font-bold text-white tracking-tight">Active Anomalies Alert Center</h4>
          </div>

          <div className="space-y-3">
            {validationReport.issues.length > 0 ? (
              validationReport.issues.slice(0, 3).map((issue) => (
                <div key={issue.id} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-rose-400 font-bold uppercase">Severity: {issue.severity}</span>
                    <span className="text-zinc-500">{issue.category}</span>
                  </div>
                  <h5 className="text-[10px] font-bold text-zinc-100 truncate">@{issue.component}</h5>
                  <p className="text-[9px] text-zinc-400 leading-normal line-clamp-2 font-mono">
                    {issue.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-emerald-400 font-mono space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <span className="block font-bold">ALL SYSTEMS SECURE & NOMINAL</span>
                <p className="text-[9px] text-zinc-500 font-sans">No security issues, performance bottlenecks, or duplicate code artifacts registered in the active Workspace scanner.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
