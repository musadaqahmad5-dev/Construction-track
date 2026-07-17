import React from 'react';
import { motion } from 'motion/react';
import { 
  SystemCoordinationSummary, 
  EngineStatus, 
  StateConsistencyMetric, 
  SynchronizationEvent 
} from '../../../engine';

interface CoordinationTabProps {
  coordinationSummary: SystemCoordinationSummary;
  engineStatuses: EngineStatus[];
  selectedEngine: EngineStatus | null;
  setSelectedEngine: (engine: EngineStatus | null) => void;
  stateConsistencyMetrics: StateConsistencyMetric[];
  syncTimeline: SynchronizationEvent[];
  syncTypeFilter: string;
  setSyncTypeFilter: (val: string) => void;
  selectedSyncEvent: SynchronizationEvent | null;
  setSelectedSyncEvent: (event: SynchronizationEvent | null) => void;
  handleSimulateEngineSynchronization: () => void;
  handleVerifyStateConsistency: (id: string) => void;
}

export const CoordinationTab: React.FC<CoordinationTabProps> = ({
  coordinationSummary,
  engineStatuses,
  selectedEngine,
  setSelectedEngine,
  stateConsistencyMetrics,
  syncTimeline,
  syncTypeFilter,
  setSyncTypeFilter,
  selectedSyncEvent,
  setSelectedSyncEvent,
  handleSimulateEngineSynchronization,
  handleVerifyStateConsistency
}) => {
  return (
    <motion.div
      key="coordination"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans text-zinc-100"
    >
      {/* PLATFORM OVERVIEW BANNER */}
      <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Platform Intelligence: 
              <span className="text-indigo-400 font-bold">COORDINATED SYNCHRONIZATION</span>
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            System Coordination & Intelligence Hub
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Cross-engine status orchestration layer. Monitors real-time communication paths, enforces dependency integrity, and validates multi-agent state consistency.
          </p>
        </div>

        {/* SIMULATION CONTROLS */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateEngineSynchronization}
            className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/15 font-mono text-[9px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-pointer transition-all font-bold animate-pulse"
          >
            [ Simulate Engine Sync ]
          </button>
          <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Intelligence Score</span>
              <span className="text-xl font-light font-mono text-white">{coordinationSummary.systemIntelligenceScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTEGRATED HEALTH INDEX & STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { name: 'Platform Readiness', score: coordinationSummary.platformReadinessScore, color: 'bg-emerald-500' },
          { name: 'Platform Stability', score: coordinationSummary.platformStabilityScore, color: 'bg-violet-500' },
          { name: 'Coordination Score', score: coordinationSummary.coordinationScore, color: 'bg-indigo-500' },
          { name: 'Platform Health Index', score: coordinationSummary.platformHealthIndex, color: 'bg-teal-500' },
          { name: 'Coordinated Engines', score: Math.round((coordinationSummary.enginesSynchronized / coordinationSummary.totalEnginesCoordinated) * 100), labelOverride: `${coordinationSummary.enginesSynchronized}/${coordinationSummary.totalEnginesCoordinated}`, color: 'bg-amber-500' },
          { name: 'System Status Score', score: 100, labelOverride: coordinationSummary.overallPlatformStatus.toUpperCase(), color: 'bg-rose-500' },
        ].map((m, idx) => (
          <div key={idx} className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between">
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block truncate">{m.name}</span>
            <div className="space-y-1">
              <span className="text-lg font-mono text-white font-light">
                {m.labelOverride !== undefined ? m.labelOverride : `${m.score}%`}
              </span>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN COORDINATION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Engine Readiness & Synchronization Status (span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ENGINE SYNCHRONIZATION CENTER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="pb-2 border-b border-white/5 flex justify-between items-center">
              <div className="text-left">
                <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Orchestration Registry</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Active Engine Readiness</h4>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Click to inspect dependencies</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
              {engineStatuses.map((engine) => (
                <div
                  key={engine.engineName}
                  onClick={() => setSelectedEngine(selectedEngine?.engineName === engine.engineName ? null : engine)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedEngine?.engineName === engine.engineName
                      ? 'bg-indigo-500/10 border-indigo-500/35'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11.5px] font-bold text-zinc-200">@{engine.engineName}</span>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10 uppercase font-bold">
                      {engine.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[9.5px] font-mono text-zinc-400">
                    <div>
                      <span className="text-zinc-600 text-[8px] block uppercase">Readiness</span>
                      <span className="text-white font-medium">{engine.readinessScore}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 text-[8px] block uppercase">Coordination</span>
                      <span className="text-indigo-300 font-medium">{engine.coordinationHealth}%</span>
                    </div>
                  </div>

                  {engine.activeDependencies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {engine.activeDependencies.slice(0, 3).map(dep => (
                        <span key={dep} className="text-[7.5px] font-mono text-zinc-500 bg-white/[0.02] border border-white/5 px-1 py-0.5 rounded">
                          &rarr; {dep}
                        </span>
                      ))}
                      {engine.activeDependencies.length > 3 && (
                        <span className="text-[7.5px] font-mono text-zinc-600">
                          +{engine.activeDependencies.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SELECTED ENGINE DETAILED DEPENDENCY CARD */}
          {selectedEngine && (
            <div className="bg-black/50 border border-indigo-500/20 p-5 rounded-3xl space-y-4 text-left animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="text-left">
                  <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Dependency Graph Inspector</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">@{selectedEngine.engineName} Contracts</h4>
                </div>
                <button 
                  onClick={() => setSelectedEngine(null)}
                  className="text-[9px] font-mono text-zinc-500 hover:text-white"
                >
                  [ Close Inspector ]
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-xl border border-white/5 space-y-4 font-mono text-[10px]">
                <div className="grid grid-cols-3 gap-4 text-zinc-400">
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Last Sync</span>
                    <span className="text-zinc-200">{selectedEngine.lastSyncTime}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Comm Health</span>
                    <span className="text-emerald-400 font-bold">{selectedEngine.communicationHealth}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Coordination Index</span>
                    <span className="text-zinc-200">{selectedEngine.coordinationHealth}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/[0.03]">
                  <div>
                    <span className="text-zinc-500 text-[8px] block uppercase mb-1 text-left">Active Outgoing Paths:</span>
                    {selectedEngine.activeDependencies.length > 0 ? (
                      <div className="space-y-1">
                        {selectedEngine.activeDependencies.map(dep => (
                          <div key={dep} className="text-zinc-300 text-[9px] flex items-center gap-1.5 text-left">
                            <span className="text-indigo-400">&bull;</span>
                            <span>@{dep}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-600 italic block text-left">No outgoing dependencies mapped</span>
                    )}
                  </div>

                  <div>
                    <span className="text-zinc-500 text-[8px] block uppercase mb-1 text-left">Validation Status:</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-zinc-400 text-[8.5px]">Interface contracts validated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-zinc-400 text-[8.5px]">Communication channel secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE CONSISTENCY CHECKER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="pb-2 border-b border-white/5 text-left">
              <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Integrity Monitor</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Cross-Engine State Consistency</h4>
            </div>

            <div className="space-y-3">
              {stateConsistencyMetrics.map((scm) => (
                <div key={scm.id} className="bg-black/25 border border-white/5 p-3 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="space-y-1 text-left">
                    <span className="text-[10.5px] font-bold text-zinc-100">{scm.scope}</span>
                    <div className="flex items-center gap-3 text-[8.5px] font-mono text-zinc-500">
                      <span>Last verified: {scm.lastChecked}</span>
                      <span>Mismatches: <span className={scm.mismatchCount > 0 ? 'text-rose-400 font-bold animate-pulse' : 'text-emerald-400'}>{scm.mismatchCount}</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                      scm.status === 'Consistent' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {scm.status}
                    </span>
                    <button
                      onClick={() => handleVerifyStateConsistency(scm.id)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[8.5px] px-2 py-1 rounded cursor-pointer transition-all font-bold"
                    >
                      [ Verify Consistency ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Synchronization Timeline & Replay (span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SYNCHRONIZATION TIMELINE LOGS */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="pb-2 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-0.5 text-left">
                <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Real-time Bus</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Synchronization Logs</h4>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={syncTypeFilter}
                  onChange={(e) => setSyncTypeFilter(e.target.value)}
                  className="bg-black/30 border border-white/5 px-2 py-1 rounded text-[9px] font-mono text-zinc-300 focus:outline-none cursor-pointer w-full md:w-auto"
                >
                  <option value="ALL">ALL TYPES</option>
                  <option value="StateSync">STATE SYNC</option>
                  <option value="DependencyCheck">DEPENDENCY</option>
                  <option value="GovernanceSync">GOVERNANCE</option>
                  <option value="ResourceAllocation">RESOURCE</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {syncTimeline
                .filter(e => syncTypeFilter === 'ALL' || e.syncType === syncTypeFilter)
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedSyncEvent(event)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      selectedSyncEvent?.id === event.id
                        ? 'bg-indigo-500/10 border-indigo-500/35'
                        : 'bg-black/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono text-zinc-500">[{event.timestamp}]</span>
                          <span className="text-[10.5px] font-bold text-zinc-200">
                            @{event.sourceEngine} &rarr; @{event.targetEngine}
                          </span>
                        </div>
                        <p className="text-[9.5px] text-zinc-400 leading-relaxed font-mono line-clamp-1">
                          {event.details}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-indigo-500/15 text-indigo-400">
                          {event.syncType}
                        </span>
                        <span className="text-[8px] font-mono text-emerald-400">SUCCESS</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* SYNC EVENT REPLAY WINDOW */}
          {selectedSyncEvent && (
            <div className="bg-black/50 border border-indigo-500/20 p-5 rounded-3xl space-y-4 text-left animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="text-left">
                  <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Sync Event Replay</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">Sync ID: #{selectedSyncEvent.id}</h4>
                </div>
                <button 
                  onClick={() => setSelectedSyncEvent(null)}
                  className="text-[9px] font-mono text-zinc-500 hover:text-white"
                >
                  [ Close Replay ]
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-[10px]">
                <div className="grid grid-cols-2 gap-4 text-zinc-400">
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Source:</span>
                    <span className="text-zinc-200 font-bold">@{selectedSyncEvent.sourceEngine}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Target:</span>
                    <span className="text-zinc-200 font-bold">@{selectedSyncEvent.targetEngine}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Sync Type:</span>
                    <span className="text-indigo-400 font-bold">{selectedSyncEvent.syncType}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Timestamp:</span>
                    <span className="text-zinc-200">{selectedSyncEvent.timestamp}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.03] space-y-1">
                  <span className="text-zinc-600 block text-[8px] uppercase">Sync Payload Context:</span>
                  <div className="bg-slate-950 p-3 rounded text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {selectedSyncEvent.details}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};
