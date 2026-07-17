import React from 'react';
import { motion } from 'motion/react';
import { 
  DiagnosticsSummary, 
  TraceEvent, 
  RootCauseReport, 
  EngineRelationship 
} from '../../../engine';

interface ObservabilityTabProps {
  diagnosticsSummary: DiagnosticsSummary;
  traceTimeline: TraceEvent[];
  traceSearch: string;
  setTraceSearch: (val: string) => void;
  traceFilter: string;
  setTraceFilter: (val: string) => void;
  selectedTrace: TraceEvent | null;
  setSelectedTrace: (trace: TraceEvent | null) => void;
  rootCauseReports: RootCauseReport[];
  selectedRootCause: RootCauseReport | null;
  setSelectedRootCause: (report: RootCauseReport | null) => void;
  engineRelationships: EngineRelationship[];
  handleSimulateDiagnosticsIncident: () => void;
  handleResolveDiagnosticsIncident: (id: string) => void;
}

export const ObservabilityTab: React.FC<ObservabilityTabProps> = ({
  diagnosticsSummary,
  traceTimeline,
  traceSearch,
  setTraceSearch,
  traceFilter,
  setTraceFilter,
  selectedTrace,
  setSelectedTrace,
  rootCauseReports,
  selectedRootCause,
  setSelectedRootCause,
  engineRelationships,
  handleSimulateDiagnosticsIncident,
  handleResolveDiagnosticsIncident
}) => {
  return (
    <motion.div
      key="observability"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans text-zinc-100"
    >
      {/* OBSERVABILITY SUMMARY BANNER */}
      <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Distributed OS Observability: 
              <span className="text-emerald-400 font-bold">PASSIVE MONITORING</span>
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            Observability & Distributed Diagnostics Console
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Deep event tracking, timeline correlations, root-cause analyzers, dependency graphs, and multi-agent execution replays.
          </p>
        </div>

        {/* SIMULATE & INCIDENT TRIGGERS */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateDiagnosticsIncident}
            className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/15 font-mono text-[9px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-pointer transition-all font-bold"
          >
            [ Simulate Incident ]
          </button>
          <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Stability Index</span>
              <span className="text-xl font-light font-mono text-white">{diagnosticsSummary.systemStabilityIndex}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* OBSERVABILITY METRICS STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { name: 'System Stability', score: diagnosticsSummary.systemStabilityIndex },
          { name: 'Engine Stability', score: diagnosticsSummary.engineStabilityIndex },
          { name: 'Execution Reliability', score: diagnosticsSummary.executionReliability },
          { name: 'Workflow Reliability', score: diagnosticsSummary.workflowReliability },
          { name: 'Recovery Effectiveness', score: diagnosticsSummary.recoveryEffectiveness },
          { name: 'Diagnostic Confidence', score: diagnosticsSummary.diagnosticConfidence },
        ].map((m, idx) => (
          <div key={idx} className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between">
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block truncate">{m.name}</span>
            <div className="space-y-1">
              <span className="text-lg font-mono text-white font-light">{m.score}%</span>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${m.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Distributed Trace Explorer & System Events Timeline (span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. DISTRIBUTED TRACE EXPLORER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-white/5">
              <div className="space-y-0.5 text-left">
                <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Trace Explorer</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Active Computational Traces</h4>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search payload..."
                  value={traceSearch}
                  onChange={(e) => setTraceSearch(e.target.value)}
                  className="bg-black/30 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/45 w-full md:w-44"
                />
                <select
                  value={traceFilter}
                  onChange={(e) => setTraceFilter(e.target.value)}
                  className="bg-black/30 border border-white/5 px-2 py-1.5 rounded-lg text-[10px] font-mono text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">ALL CATEGORIES</option>
                  <option value="Execution">EXECUTION</option>
                  <option value="Decision">DECISION</option>
                  <option value="Planning">PLANNING</option>
                  <option value="Prediction">PREDICTION</option>
                  <option value="Learning">LEARNING</option>
                  <option value="Reasoning">REASONING</option>
                </select>
              </div>
            </div>

            {/* Trace Table / Card list */}
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {traceTimeline
                .filter(t => {
                  const matchesSearch = t.eventName.toLowerCase().includes(traceSearch.toLowerCase()) || 
                                        t.payload.toLowerCase().includes(traceSearch.toLowerCase()) || 
                                        t.engine.toLowerCase().includes(traceSearch.toLowerCase());
                  const matchesFilter = traceFilter === 'ALL' || t.category === traceFilter;
                  return matchesSearch && matchesFilter;
                })
                .map((trace) => (
                  <div 
                    key={trace.id}
                    onClick={() => setSelectedTrace(trace)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedTrace?.id === trace.id
                        ? 'bg-indigo-500/10 border-indigo-500/35'
                        : 'bg-black/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono text-zinc-500">[{trace.timestamp}]</span>
                          <span className="text-[10.5px] font-bold text-white">@{trace.engine}</span>
                          <span className="text-[8.5px] font-mono text-indigo-400 bg-indigo-950/20 px-1.5 py-0.5 rounded border border-indigo-500/10 font-bold">
                            {trace.category}
                          </span>
                        </div>
                        <h5 className="text-[11px] font-medium text-zinc-200">{trace.eventName}</h5>
                        <p className="text-[9.5px] text-zinc-400 leading-relaxed font-mono line-clamp-1">
                          {trace.payload}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                          trace.status === 'Success' ? 'bg-emerald-500/15 text-emerald-400' :
                          trace.status === 'Warning' ? 'bg-amber-500/15 text-amber-400' :
                          trace.status === 'Recovered' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-rose-500/15 text-rose-400 animate-pulse'
                        }`}>
                          {trace.status.toUpperCase()}
                        </span>
                        <span className="text-[8px] font-mono text-zinc-500">{trace.latencyMs}ms</span>
                      </div>
                    </div>

                    {/* Interactive resolution helper for simulated incidents */}
                    {(trace.status === 'Warning' || trace.status === 'Failure') && (
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolveDiagnosticsIncident(trace.id);
                          }}
                          className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-mono text-[8.5px] py-1 px-2 rounded cursor-pointer font-bold transition-all"
                        >
                          [ Supervise & Solve ]
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* 2. REPLAY WINDOW (IF SELECTED) */}
          {selectedTrace && (
            <div className="bg-black/50 border border-indigo-500/20 p-5 rounded-3xl space-y-4 text-left animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="space-y-0.5 text-left">
                  <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Trace Replay Window</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">Trace ID: #{selectedTrace.id} Replay</h4>
                </div>
                <button 
                  onClick={() => setSelectedTrace(null)}
                  className="text-[9px] font-mono text-zinc-500 hover:text-white"
                >
                  [ Close Replay ]
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-[10px]">
                <div className="grid grid-cols-2 gap-4 text-zinc-400">
                  <div>
                    <span className="text-zinc-600 block text-[8px]">SYSTEM ENGINE:</span>
                    <span className="text-zinc-200 font-bold">@{selectedTrace.engine}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px]">TIMESTAMP:</span>
                    <span className="text-zinc-200">{selectedTrace.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px]">CATEGORY:</span>
                    <span className="text-indigo-400 font-bold">@{selectedTrace.category}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px]">CYCLE MEASUREMENT:</span>
                    <span className="text-zinc-200">{selectedTrace.latencyMs} ms</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.03] space-y-1">
                  <span className="text-zinc-600 block text-[8px]">EVENT PAYLOAD REPLAY:</span>
                  <div className="bg-slate-950 p-3 rounded text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {selectedTrace.payload}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. ROOT CAUSE ANALYZER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-rose-400 font-bold uppercase tracking-wider block">AI Forensic Engine</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Root Cause Investigation Hub</h4>
              <p className="text-[10px] text-zinc-400">
                Correlate multi-agent transaction graphs to identify failure triggers and system state drifts.
              </p>
            </div>

            <div className="space-y-3">
              {rootCauseReports.map((report) => (
                <div 
                  key={report.id}
                  onClick={() => setSelectedRootCause(selectedRootCause?.id === report.id ? null : report)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRootCause?.id === report.id
                      ? 'bg-indigo-500/10 border-indigo-500/35'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 flex-wrap">
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-bold text-white tracking-tight">{report.title}</h5>
                      <span className="text-[8px] font-mono text-zinc-500 block">Target: @{report.suspectedComponent}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10 font-bold">
                        Confidence: {report.confidenceScore}%
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                        report.impactRadius === 'Systemic' ? 'bg-rose-500/15 text-rose-400' :
                        report.impactRadius === 'High' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'
                      }`}>
                        Impact: {report.impactRadius}
                      </span>
                    </div>
                  </div>

                  {selectedRootCause?.id === report.id && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                      {/* Failure Trace Path */}
                      <div className="space-y-1.5">
                        <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block text-left">Forensic Reconstruction Timeline:</span>
                        <div className="space-y-1.5 pl-2 font-mono text-[9px] text-zinc-400 text-left">
                          {report.reconstructionTimeline.map((step, sIdx) => (
                            <div key={sIdx} className="leading-relaxed text-left">{step}</div>
                          ))}
                        </div>
                      </div>

                      {/* State Difference Analysis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[8.5px] font-mono text-emerald-400 uppercase tracking-wider block text-left">State Before Failure:</span>
                          <pre className="bg-black/80 border border-white/5 p-2.5 rounded-lg text-[8.5px] font-mono text-zinc-400 overflow-x-auto text-left">
                            {JSON.stringify(JSON.parse(report.stateDiff.before), null, 2)}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[8.5px] font-mono text-rose-400 uppercase tracking-wider block text-left">State After Failure:</span>
                          <pre className="bg-black/80 border border-white/5 p-2.5 rounded-lg text-[8.5px] font-mono text-zinc-400 overflow-x-auto text-left">
                            {JSON.stringify(JSON.parse(report.stateDiff.after), null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Actionable Remedy recommendation */}
                      <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg text-[9.5px] text-indigo-300 font-mono text-left">
                        <span className="font-bold text-indigo-400">Automated Remediation Plan:</span> {report.remedyRecommendation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Dependency Graph, Diagnostic Health Center, Recovery Suggestions (span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. INTERACTIVE ENGINE RELATIONSHIP RELATION GRAPH */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1 text-left">
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Distributed Graph</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Engine Dependency Relationships</h4>
            </div>

            <div className="space-y-3.5 pt-2">
              {engineRelationships.map((rel, idx) => (
                <div key={idx} className="bg-black/25 border border-white/5 p-3 rounded-xl space-y-2 text-[10px] font-mono">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="text-white font-bold">@{rel.source}</span>
                    <span className="text-zinc-600 font-light">&rarr;</span>
                    <span className="text-white">@{rel.target}</span>
                  </div>
                  <div className="flex justify-between items-center text-[8.5px] text-zinc-500">
                    <span>Correlation Factor: {rel.weight}%</span>
                    <span className={`px-1 rounded text-[7.5px] font-bold ${
                      rel.type === 'Control' ? 'bg-violet-500/15 text-violet-400' :
                      rel.type === 'Data' ? 'bg-teal-500/15 text-teal-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {rel.type}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${rel.weight}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. DIAGNOSTICS INCIDENT SUMMARY */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Incident Radar</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Active Diagnostic Incidents</h4>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                <span className="text-rose-400 text-lg font-bold block">{diagnosticsSummary.criticalErrorsCount}</span>
                <span className="text-[7.5px] text-zinc-500 uppercase font-bold">Critical</span>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <span className="text-amber-400 text-lg font-bold block">{diagnosticsSummary.warningsCount}</span>
                <span className="text-[7.5px] text-zinc-500 uppercase font-bold">Warnings</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <span className="text-emerald-400 text-lg font-bold block">{diagnosticsSummary.infoCount}</span>
                <span className="text-[7.5px] text-zinc-500 uppercase font-bold">Healthy</span>
              </div>
            </div>
          </div>

          {/* 3. FORENSIC RECOVERY RECOMMENDATIONS */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Recovery Assistant</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Suggested Self-Repair Measures</h4>
            </div>

            <div className="space-y-3">
              {diagnosticsSummary.recoverySuggestions.map((sug, idx) => (
                <div key={idx} className="bg-black/25 border border-white/5 p-3 rounded-xl flex items-start gap-2.5 text-left">
                  <span className="text-emerald-400 font-mono text-[9px] mt-0.5">[ {idx + 1} ]</span>
                  <p className="text-[9.5px] text-zinc-400 font-sans leading-relaxed text-left">{sug}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
