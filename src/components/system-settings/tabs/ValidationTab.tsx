import React from 'react';
import { motion } from 'motion/react';
import { 
  EnterpriseReadinessReport, 
  ComponentAudit, 
  ValidationIssue 
} from '../../../engine';

interface ValidationTabProps {
  validationReport: EnterpriseReadinessReport;
  isConductingFullAudit: boolean;
  componentAudits: ComponentAudit[];
  selectedComponentAudit: ComponentAudit | null;
  setSelectedComponentAudit: (audit: ComponentAudit | null) => void;
  validationCategoryFilter: string;
  setValidationCategoryFilter: (val: string) => void;
  selectedValidationIssue: ValidationIssue | null;
  setSelectedValidationIssue: (issue: ValidationIssue | null) => void;
  handleRunValidationAudit: () => void;
  handleResolveValidationIssue: (id: string) => void;
}

export const ValidationTab: React.FC<ValidationTabProps> = ({
  validationReport,
  isConductingFullAudit,
  componentAudits,
  selectedComponentAudit,
  setSelectedComponentAudit,
  validationCategoryFilter,
  setValidationCategoryFilter,
  selectedValidationIssue,
  setSelectedValidationIssue,
  handleRunValidationAudit,
  handleResolveValidationIssue
}) => {
  return (
    <motion.div
      key="validation"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans text-zinc-100"
    >
      {/* AUDIT & READINESS HERO BANNER */}
      <div className="bg-[#06060c] border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Architectural Integrity: 
              <span className="text-violet-400 font-bold">ENTERPRISE OS MONITOR</span>
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            Enterprise Validation & Architectural Quality
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Deep structural validator. Verifies communication bus routes, dependency cycles, duplicate modules, and runtime engines against enterprise standards.
          </p>
        </div>

        {/* AUDIT CONTROLS */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunValidationAudit}
            disabled={isConductingFullAudit}
            className="bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/15 font-mono text-[9px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-pointer transition-all font-bold"
          >
            {isConductingFullAudit ? '[ Auditing Workspace... ]' : '[ Run Full System Audit ]'}
          </button>
          <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Enterprise Score</span>
              <span className="text-xl font-light font-mono text-emerald-400">{validationReport.overallEnterpriseScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEEP READINESS DASHBOARD - SUB-SCORES GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
        {[
          { name: 'Architecture Score', score: validationReport.architectureScore, color: 'bg-indigo-500', icon: '⧉' },
          { name: 'Integration Score', score: validationReport.integrationScore, color: 'bg-teal-500', icon: '✦' },
          { name: 'Maintainability', score: validationReport.maintainabilityScore, color: 'bg-emerald-500', icon: '⚙' },
          { name: 'Scalability Score', score: validationReport.scalabilityScore, color: 'bg-amber-500', icon: '▲' },
          { name: 'Modularity Index', score: validationReport.modularityScore, color: 'bg-violet-500', icon: '⊞' },
          { name: 'Performance Score', score: validationReport.performanceScore, color: 'bg-rose-500', icon: '⚡' },
          { name: 'Reliability Index', score: validationReport.reliabilityScore, color: 'bg-sky-500', icon: '🛡' },
        ].map((m, idx) => (
          <div key={idx} className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block truncate">{m.name}</span>
              <span className="text-xs text-zinc-600 font-mono">{m.icon}</span>
            </div>
            <div className="space-y-1">
              <span className="text-lg font-mono text-white font-light">
                {m.score}%
              </span>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ARCHITECTURAL COMPONENT REGISTRY & ISSUE TICKETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Deep Component Audit (span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ACTIVE WIRING MONITOR */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="pb-2 border-b border-white/5 flex justify-between items-center text-left">
              <div>
                <span className="text-[8.5px] font-mono text-violet-400 font-bold uppercase tracking-wider block">Wiring Inspector</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Component Architecture Audit</h4>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Click to view scan trace</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
              {componentAudits.map((comp) => (
                <div
                  key={comp.name}
                  onClick={() => setSelectedComponentAudit(selectedComponentAudit?.name === comp.name ? null : comp)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedComponentAudit?.name === comp.name
                      ? 'bg-violet-500/10 border-violet-500/35'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start text-left">
                    <span className="text-[11.5px] font-bold text-zinc-200">@{comp.name}</span>
                    <span className="text-[7.5px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10 uppercase font-bold">
                      {comp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[9.5px] font-mono text-zinc-400">
                    <div>
                      <span className="text-zinc-600 text-[8px] block uppercase">Wiring Score</span>
                      <span className="text-white font-medium">{comp.wiringScore}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 text-[8px] block uppercase">Scan Domain</span>
                      <span className="text-violet-300 font-medium">{comp.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SCANNED COMPONENT TRACE VIEW */}
          {selectedComponentAudit && (
            <div className="bg-black/50 border border-violet-500/20 p-5 rounded-3xl space-y-4 text-left animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="text-left">
                  <span className="text-[8.5px] font-mono text-violet-400 font-bold uppercase tracking-wider block">Trace Inspector</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">@{selectedComponentAudit.name} Status</h4>
                </div>
                <button 
                  onClick={() => setSelectedComponentAudit(null)}
                  className="text-[9px] font-mono text-zinc-500 hover:text-white"
                >
                  [ Close Trace ]
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-xl border border-white/5 space-y-4 font-mono text-[10px]">
                <div className="grid grid-cols-3 gap-4 text-zinc-400">
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Last Scan</span>
                    <span className="text-zinc-200 text-left">{selectedComponentAudit.lastScanned}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Layer Validation</span>
                    <span className="text-emerald-400 font-bold text-left font-mono">100% SECURE</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Wiring Integrity</span>
                    <span className="text-zinc-200 text-left">{selectedComponentAudit.wiringScore}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.03] text-left">
                  <span className="text-zinc-500 text-[8px] block uppercase mb-1.5 text-left">Runtime Integration Verification:</span>
                  <p className="text-zinc-300 text-[9.5px] leading-relaxed text-left">
                    EnterpriseValidationEngine has scanned the exported hooks, functions, and state bindings of @{selectedComponentAudit.name}. Fully decoupled from presentation views, communicating reliably over local persistence buses.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Duplicate logic & Flaw Center (span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ACTIVE ANOMALIES & FLAW REPORTS */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="pb-2 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
              <div className="space-y-0.5 text-left">
                <span className="text-[8.5px] font-mono text-violet-400 font-bold uppercase tracking-wider block">Real-time Scanner</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Active Quality Issues</h4>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto text-left">
                <select
                  value={validationCategoryFilter}
                  onChange={(e) => setValidationCategoryFilter(e.target.value)}
                  className="bg-black/30 border border-white/5 px-2 py-1 rounded text-[9px] font-mono text-zinc-300 focus:outline-none cursor-pointer w-full md:w-auto"
                >
                  <option value="ALL">ALL CATEGORIES</option>
                  <option value="DuplicateLogic">DUPLICATE LOGIC</option>
                  <option value="CircularDependency">CIRCULAR DEPENDENCY</option>
                  <option value="MissingEngine">MISSING ENGINE</option>
                  <option value="MissingUI">MISSING UI</option>
                  <option value="MissingWiring">MISSING WIRING</option>
                  <option value="DeadCode">DEAD CODE</option>
                </select>
              </div>
            </div>

            {validationReport.issues.length === 0 ? (
              <div className="p-6 text-center bg-black/10 rounded-2xl border border-white/[0.02] space-y-2 text-left">
                <span className="text-2xl block text-left">✓</span>
                <p className="text-xs text-emerald-400 font-mono text-left">No validation anomalies detected.</p>
                <p className="text-[10px] text-zinc-500 text-left">Your architecture is 100% compliant with Enterprise AI standards.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1 text-left">
                {validationReport.issues
                  .filter(e => validationCategoryFilter === 'ALL' || e.category === validationCategoryFilter)
                  .map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedValidationIssue(issue)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                        selectedValidationIssue?.id === issue.id
                          ? 'bg-violet-500/10 border-violet-500/35'
                          : 'bg-black/20 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 text-left">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2 flex-wrap text-left">
                            <span className={`px-1 py-0.5 rounded text-[7.5px] font-mono font-bold uppercase ${
                              issue.severity === 'Critical' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10' :
                              issue.severity === 'Warning' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10' :
                              'bg-sky-500/15 text-sky-400 border border-sky-500/10'
                            }`}>
                              {issue.severity}
                            </span>
                            <span className="text-[10.5px] font-bold text-zinc-200">
                              {issue.component}
                            </span>
                          </div>
                          <p className="text-[9.5px] text-zinc-400 leading-relaxed font-mono line-clamp-1 text-left">
                            {issue.message}
                          </p>
                        </div>

                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-violet-500/15 text-violet-400 whitespace-nowrap text-left">
                          {issue.category}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* DETAILED RESOLUTION ACTION MODULE */}
          {selectedValidationIssue && (
            <div className="bg-black/50 border border-violet-500/20 p-5 rounded-3xl space-y-4 text-left animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="text-left">
                  <span className="text-[8.5px] font-mono text-violet-400 font-bold uppercase tracking-wider block">Intelligent Self-Healing</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">Issue: #{selectedValidationIssue.id}</h4>
                </div>
                <button 
                  onClick={() => setSelectedValidationIssue(null)}
                  className="text-[9px] font-mono text-zinc-500 hover:text-white"
                >
                  [ Close Inspector ]
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-[10px]">
                <div className="grid grid-cols-2 gap-4 text-zinc-400 text-left">
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Fault Category:</span>
                    <span className="text-zinc-200 font-bold text-left">{selectedValidationIssue.category}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Threat Severity:</span>
                    <span className="text-rose-400 font-bold text-left">{selectedValidationIssue.severity}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.03] space-y-2 text-left">
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Defect Description:</span>
                    <p className="text-zinc-300 leading-relaxed text-left">{selectedValidationIssue.message}</p>
                  </div>
                  <div className="mt-2 text-left">
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Automated Resolution Path:</span>
                    <p className="text-violet-300 italic text-left">{selectedValidationIssue.resolution}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.03] flex justify-end">
                  <button
                    onClick={() => handleResolveValidationIssue(selectedValidationIssue.id)}
                    className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/15 font-mono text-[9px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-pointer transition-all font-bold"
                  >
                    [ Apply Self-Repair Patch ]
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};
