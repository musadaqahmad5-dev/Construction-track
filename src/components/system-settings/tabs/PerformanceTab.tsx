import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Activity, 
  Cpu, 
  Server, 
  Zap, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  Settings,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { 
  EnterpriseResourceMetrics, 
  ResourceOptimizationSuggestion, 
  PerformanceTimelineEvent,
  DecisionInferenceEngine,
  StabilityEngine,
  GeneratorBridge,
  GdprErasureRequest,
  PredictionCache,
  TelemetryIngestion,
  OptimizationEngine,
  type DecisionAction,
  type SecurityAlert,
  type GeneratorBridgeResult,
  type TelemetryPayload
} from '../../../engine';

interface PerformanceTabProps {
  resourceMetrics: EnterpriseResourceMetrics;
  perfSuggestions: ResourceOptimizationSuggestion[];
  perfTimeline: PerformanceTimelineEvent[];
  togglePerformanceOption: (id: string) => void;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  resourceMetrics,
  perfSuggestions,
  perfTimeline,
  togglePerformanceOption
}) => {
  const [selectedNs, setSelectedNs] = useState<'ai-creation-workload' | 'community-user-data'>('ai-creation-workload');
  const [cpuLoad, setCpuLoad] = useState<number>(45);
  const [memoryLoad, setMemoryLoad] = useState<number>(60);
  const [activeRequestQueue, setActiveRequestQueue] = useState<number>(120);
  const [dryRun, setDryRun] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<DecisionAction | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [replicas, setReplicas] = useState<number>(1);

  // Generator Bridge State
  const [bridgeType, setBridgeType] = useState<'community' | 'aicreations'>('aicreations');
  const [promptSnippet, setPromptSnippet] = useState<string>('sci-fi avatar cyber-mesh overlay garment');
  const [bridgeResult, setBridgeResult] = useState<GeneratorBridgeResult | null>(null);

  // GDPR Erasure State
  const [erasureTenantId, setErasureTenantId] = useState<string>('anonymous-tenant-context');
  const [erasureResult, setErasureResult] = useState<{ success: boolean; erasedKeys: string[] } | null>(null);

  // Optimization Engine States
  const [prewarmedStyles, setPrewarmedStyles] = useState<string[]>([]);
  const [styleHistory, setStyleHistory] = useState<string[]>([]);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryPayload[]>([]);
  const [pingLatencyInput, setPingLatencyInput] = useState<number>(850);
  const [pingResult, setPingResult] = useState<{ latencyMs: number; lowLatencyFallbackActive: boolean; triggeredAlert: boolean } | null>(null);
  const [fallbackModeActive, setFallbackModeActive] = useState<boolean>(false);

  // Synchronize on mount and change of namespace
  const refreshOptimizationStates = () => {
    setPrewarmedStyles(PredictionCache.getPrewarmedStyles());
    setStyleHistory(PredictionCache.getStyleHistory());
    setTelemetryLogs(TelemetryIngestion.getLogs());
    setFallbackModeActive(OptimizationEngine.isLowLatencyFallbackActive());
  };

  useEffect(() => {
    setAlerts(StabilityEngine.getAlertLogs());
    setReplicas(DecisionInferenceEngine.getCurrentReplicas(selectedNs));
    refreshOptimizationStates();
  }, [selectedNs]);

  useEffect(() => {
    // Bootstrap some simulated telemetry history for visual richness if empty
    if (TelemetryIngestion.getLogs().length === 0) {
      TelemetryIngestion.ingest({
        timestamp: new Date(Date.now() - 120000).toISOString(),
        namespace: 'ai-creation-workload',
        latencyMs: 765,
        successRate: 0.99,
        memoryPressure: 45
      });
      TelemetryIngestion.ingest({
        timestamp: new Date(Date.now() - 60000).toISOString(),
        namespace: 'community-user-data',
        latencyMs: 310,
        successRate: 1.0,
        memoryPressure: 38
      });
    }
    refreshOptimizationStates();
  }, []);

  const handleEvaluate = () => {
    const metrics = { cpuLoad, memoryLoad, activeRequestQueue };
    const action = DecisionInferenceEngine.evaluate(selectedNs, metrics, dryRun);
    setLastAction(action);
    setAlerts(StabilityEngine.getAlertLogs());
    setReplicas(DecisionInferenceEngine.getCurrentReplicas(selectedNs));
    refreshOptimizationStates();
  };

  const handleRunBridge = () => {
    const res = GeneratorBridge(bridgeType, promptSnippet);
    setBridgeResult(res);
    setAlerts(StabilityEngine.getAlertLogs());
    refreshOptimizationStates();
  };

  const handleRunErasure = () => {
    const res = GdprErasureRequest(erasureTenantId);
    setErasureResult(res);
    refreshOptimizationStates();
  };

  const handleRunPing = () => {
    const result = OptimizationEngine.pingGoogleAIService(pingLatencyInput);
    setPingResult(result);
    setAlerts(StabilityEngine.getAlertLogs());
    refreshOptimizationStates();
  };

  const handleToggleFallback = () => {
    const nextState = !fallbackModeActive;
    OptimizationEngine.setLowLatencyFallbackMode(nextState);
    refreshOptimizationStates();
  };

  const handleClearTelemetry = () => {
    TelemetryIngestion.clearLogs();
    refreshOptimizationStates();
  };

  const handleClearCache = () => {
    PredictionCache.clearCache();
    refreshOptimizationStates();
  };

  const handleResetReplicas = () => {
    DecisionInferenceEngine.setReplicas('ai-creation-workload', 1);
    DecisionInferenceEngine.setReplicas('community-user-data', 1);
    setReplicas(1);
    setLastAction(null);
    setBridgeResult(null);
    setPingResult(null);
    refreshOptimizationStates();
  };

  const handleClearAlerts = () => {
    StabilityEngine.clearLogs();
    setAlerts([]);
    refreshOptimizationStates();
  };

  return (
    <motion.div
      key="performance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans text-white"
    >
      {/* PERFORMANCE HEADER */}
      <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Platform telemetry state: 
              <span className="text-indigo-400 font-bold">MONITORED</span>
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            Resource Intelligence & Performance Engine
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Measure, optimize, and supervise computational system performance, memory leaks, latencies, and resource capacity across the autonomous architecture.
          </p>
        </div>

        {/* OVERALL PERFORMANCE INDEX GAUGE */}
        <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Overall Perf Index</span>
            <span className="text-2xl font-light font-mono text-indigo-400">{resourceMetrics.scores.overallPerformanceIndex}%</span>
          </div>
          <div className="w-12 h-12 rounded-full border border-indigo-500/10 flex items-center justify-center bg-indigo-500/5">
            <span className="text-[11px] font-bold font-mono text-indigo-300">
              {resourceMetrics.scores.overallPerformanceIndex >= 85 ? 'OPTIMAL' : 'STABLE'}
            </span>
          </div>
        </div>
      </div>

      {/* PLATFORM SCORES ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Core CPU Performance', score: resourceMetrics.scores.performanceScore, color: 'text-violet-400', bg: 'bg-violet-500' },
          { name: 'Memory Allocation Efficiency', score: resourceMetrics.scores.efficiencyScore, color: 'text-teal-400', bg: 'bg-teal-500' },
          { name: 'Active Parameter Optimization', score: resourceMetrics.scores.optimizationScore, color: 'text-indigo-400', bg: 'bg-indigo-500' },
          { name: 'Thread & Queue Health', score: resourceMetrics.scores.resourceHealthScore, color: 'text-emerald-400', bg: 'bg-emerald-500' }
        ].map((m, idx) => (
          <div key={idx} className="bg-black/45 border border-white/5 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">{m.name}</span>
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-light font-mono text-white">{m.score}%</span>
                <span className={`text-[8px] font-mono font-bold uppercase ${m.color}`}>
                  {m.score >= 80 ? 'EXCELLENT' : m.score >= 60 ? 'NORMAL' : 'DEGRADED'}
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${m.bg}`} style={{ width: `${m.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SYSTEM ARCHITECTURE DUAL-NAMESPACE INTELLIGENCE SIMULATOR */}
      <div className="bg-slate-950/60 border border-white/5 rounded-3xl p-6 space-y-6 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-widest">
                System Infrastructure Intelligence
              </span>
            </div>
            <h4 className="text-base font-serif font-light text-white mt-1">
              Dual-Namespace Decision Inference Engine
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-normal max-w-xl">
              Simulate container workloads across <strong>'community-user-data'</strong> (Strict Zero-Data Privacy) and <strong>'ai-creation-workload'</strong> (High-Compute GPU auto-scaling).
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={handleResetReplicas}
              className="text-[9px] font-mono text-zinc-400 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Replicas
            </button>
            <button
              onClick={handleClearAlerts}
              className="text-[9px] font-mono text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/10 cursor-pointer flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              Clear Security Logs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-5">
            {/* Namespace Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Target Namespace</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedNs('ai-creation-workload')}
                  className={`text-xs font-mono py-2.5 px-3 rounded-xl border transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer ${
                    selectedNs === 'ai-creation-workload'
                      ? 'bg-violet-500/15 border-violet-500/30 text-violet-300 shadow-lg shadow-violet-950/20'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <Cpu className="w-4 h-4 mb-1" />
                  <span>ai-creation-workload</span>
                  <span className="text-[8px] text-zinc-500 block uppercase">Compute/Scaling</span>
                </button>
                <button
                  onClick={() => setSelectedNs('community-user-data')}
                  className={`text-xs font-mono py-2.5 px-3 rounded-xl border transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer ${
                    selectedNs === 'community-user-data'
                      ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 shadow-lg shadow-indigo-950/20'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <Shield className="w-4 h-4 mb-1" />
                  <span>community-user-data</span>
                  <span className="text-[8px] text-zinc-500 block uppercase">Strict ZeroTrust</span>
                </button>
              </div>
            </div>

            {/* Metric Inputs */}
            <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-4">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Workspace Telemetry Stimulators</span>
              
              {/* CPU load */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-400">Simulation CPU Load</span>
                  <span className="text-white font-bold">{cpuLoad}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cpuLoad}
                  onChange={(e) => setCpuLoad(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Memory load */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-400">Simulation Memory Load</span>
                  <span className="text-white font-bold">{memoryLoad}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={memoryLoad}
                  onChange={(e) => setMemoryLoad(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-[8px] text-zinc-500 font-mono block">
                  Threshold limit: 85% for scale-up on workload namespace.
                </span>
              </div>

              {/* Request queue */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-400">Request Rate / Queue</span>
                  <span className="text-white font-bold">{activeRequestQueue} req/sec</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={activeRequestQueue}
                  onChange={(e) => setActiveRequestQueue(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-[8px] text-zinc-500 font-mono block">
                  DenyAll Security threshold: 500 req/sec for community-user-data.
                </span>
              </div>
            </div>

            {/* Options & Action */}
            <div className="flex items-center justify-between p-3.5 bg-black/25 border border-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <input
                  id="dry-run-toggle"
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-black text-indigo-500 accent-indigo-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="dry-run-toggle" className="text-[10px] font-mono text-zinc-400 cursor-pointer select-none">
                  Dry Run Mode (Log policy reasoning only)
                </label>
              </div>
              
              <button
                onClick={handleEvaluate}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] py-1.5 px-4 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Inference
              </button>
            </div>
          </div>

          {/* Active Status & Results Output Panel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-black/25 border border-white/5 rounded-2xl flex items-center gap-3 text-left bg-black/30">
                <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <Server className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Active Replicas</span>
                  <span className="text-lg font-mono font-bold text-violet-300">
                    {DecisionInferenceEngine.getCurrentReplicas('ai-creation-workload')} / 5
                  </span>
                </div>
              </div>

              <div className="p-4 bg-black/25 border border-white/5 rounded-2xl flex items-center gap-3 text-left bg-black/30">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Shield className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Security Incidents</span>
                  <span className="text-lg font-mono font-bold text-rose-400">
                    {alerts.filter(a => a.namespace === 'community-user-data').length} Logged
                  </span>
                </div>
              </div>
            </div>

            {/* Evaluator Output Display */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-3">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Engine Execution Output</span>
              
              {lastAction ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-400">
                      Evaluated: <span className="text-zinc-200 font-bold">{lastAction.namespace}</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase border ${
                      lastAction.actionTriggered === 'AutoScaling' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' :
                      lastAction.actionTriggered === 'SecurityAlert' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse' :
                      'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                    }`}>
                      {lastAction.actionTriggered}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 bg-black/30 border border-white/5 p-3 rounded-xl leading-relaxed font-sans">
                    {lastAction.reasoning}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-zinc-500">
                    <div>
                      <span>Timestamp: </span>
                      <span className="text-zinc-300">{lastAction.timestamp}</span>
                    </div>
                    <div>
                      <span>Dry Run: </span>
                      <span className={lastAction.dryRun ? "text-amber-400 font-bold" : "text-zinc-300"}>
                        {lastAction.dryRun ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                  </div>

                  {lastAction.details && (
                    <div className="bg-black/95 rounded-xl border border-white/10 p-3">
                      <span className="text-[8px] font-mono text-zinc-600 uppercase block mb-1">Telemetry Payload Metadata</span>
                      <pre className="text-[9px] font-mono text-emerald-400 overflow-x-auto custom-scrollbar leading-tight text-left">
                        {JSON.stringify(lastAction.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-500 text-[11px] italic font-mono">
                  [ System Standby: Awaiting telemetric workload inputs to run policy inference... ]
                </div>
              )}
            </div>

            {/* StabilityEngine Security Log Trace */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">StabilityEngine Security Log Trace</span>
              
              <div className="bg-black/90 border border-white/10 rounded-xl p-3 h-32 overflow-y-auto custom-scrollbar font-mono text-[9px] text-zinc-400 space-y-2">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className="border-b border-white/[0.03] pb-2 text-left">
                      <div className="flex justify-between text-[8px] text-rose-400">
                        <span>[{alert.timestamp}] ALERT_ID: {alert.id}</span>
                        <span className="font-bold">SEV_CRITICAL</span>
                      </div>
                      <p className="text-zinc-300 mt-0.5">{alert.message}</p>
                      <div className="text-[8px] text-zinc-500 mt-1">
                        Metrics evaluated: CPU: {alert.metrics.cpuLoad}% | Mem: {alert.metrics.memoryLoad}% | Queue: {alert.metrics.activeRequestQueue} req/sec
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 italic py-6 text-center">
                    No security violations logged by StabilityEngine. ZeroTrust policy status: secure.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GENERATOR SERVICE BRIDGE */}
      <div className="bg-slate-950/60 border border-white/5 rounded-3xl p-6 space-y-6 text-left mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                Generator Service Bridge
              </span>
            </div>
            <h4 className="text-base font-serif font-light text-white mt-1">
              Google AI Studio Direct Workload Dispatcher
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-normal max-w-xl">
              Execute fashion modeling workflows. The bridge automatically evaluates node pool capacity via <strong>DecisionInferenceEngine</strong> to guarantee execution uptime.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Workflow Generator Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBridgeType('aicreations')}
                  className={`text-xs font-mono py-2 px-3 rounded-xl border text-center cursor-pointer transition-all ${
                    bridgeType === 'aicreations'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  aicreations
                </button>
                <button
                  onClick={() => setBridgeType('community')}
                  className={`text-xs font-mono py-2 px-3 rounded-xl border text-center cursor-pointer transition-all ${
                    bridgeType === 'community'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  community
                </button>
              </div>
              <span className="text-[8px] text-zinc-500 block font-mono">
                {bridgeType === 'aicreations' 
                  ? 'Routes via high-compute namespace: "ai-creation-workload"' 
                  : 'Routes via secure private namespace: "community-user-data"'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Prompt Snippet / Design Spec
              </label>
              <textarea
                value={promptSnippet}
                onChange={(e) => setPromptSnippet(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 min-h-[75px]"
                placeholder="Enter prompt snippet..."
              />
            </div>

            <button
              onClick={handleRunBridge}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/30"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Dispatch to Google AI Studio
            </button>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 space-y-4">
            {bridgeResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-black/30 border border-white/5 p-3 rounded-2xl">
                    <span className="text-[8px] font-mono text-zinc-500 block uppercase">Capacity Status</span>
                    <span className={`text-xs font-mono font-bold flex items-center gap-1.5 mt-1 ${
                      bridgeResult.capacityStatus === 'Low' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {bridgeResult.capacityStatus}
                    </span>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-3 rounded-2xl">
                    <span className="text-[8px] font-mono text-zinc-500 block uppercase">Nodes Checked</span>
                    <span className="text-xs font-mono font-bold text-white block mt-1">
                      {bridgeResult.replicasEvaluated} active replica(s)
                    </span>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl">
                    <span className="text-[8px] font-mono text-emerald-400 block uppercase font-bold">Compliance Stamp</span>
                    <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {bridgeResult.complianceStamp?.stampId}
                    </span>
                  </div>
                </div>

                {bridgeResult.complianceStamp && (
                  <div className="space-y-1 bg-violet-950/20 border border-violet-500/15 p-4 rounded-2xl text-left">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-violet-300 uppercase block font-bold">SOC2 Evidence Package Details</span>
                      <span className="text-[8px] font-mono text-violet-400">Compliant: YES</span>
                    </div>
                    <div className="text-[9.5px] font-mono text-zinc-300 space-y-1.5 bg-black/45 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between"><span className="text-zinc-500">Transaction ID:</span> <span className="text-zinc-200">{bridgeResult.complianceStamp.soc2Package.transactionId}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Evidence ID:</span> <span className="text-zinc-200">{bridgeResult.complianceStamp.soc2Package.evidenceId}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Tenant:</span> <span className="text-zinc-200">{bridgeResult.complianceStamp.soc2Package.tenantId}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Data Retention:</span> <span className="text-emerald-400">{bridgeResult.complianceStamp.soc2Package.securityControls.dataRetentionPolicy}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">In-Transit Enc:</span> <span className="text-zinc-200">{bridgeResult.complianceStamp.soc2Package.securityControls.encryptionInTransit}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">At-Rest Enc:</span> <span className="text-zinc-200">{bridgeResult.complianceStamp.soc2Package.securityControls.encryptionAtRest}</span></div>
                      <div className="border-t border-white/5 pt-1.5 mt-1.5 flex flex-col gap-0.5">
                        <span className="text-[8px] text-zinc-500 uppercase block">Immutable Ledger Integrity Hash (Auditable)</span>
                        <span className="text-[9px] text-emerald-400 select-all font-bold tracking-tight break-all">
                          {bridgeResult.complianceStamp.soc2Package.immutableLedgerIntegrityHash}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1 bg-black/40 border border-white/5 p-4 rounded-2xl text-left">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block font-bold">API Target Destination</span>
                  <div className="text-[10px] font-mono text-zinc-300 break-all bg-black/60 p-2.5 rounded-xl border border-white/5">
                    {bridgeResult.endpointUsed}
                  </div>
                </div>

                <div className="space-y-1 bg-black/40 border border-white/5 p-4 rounded-2xl text-left">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block font-bold">Generator Tunnel Trace Logs</span>
                  <pre className="text-[9.5px] font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed bg-black/65 p-3 rounded-xl h-36 overflow-y-auto custom-scrollbar border border-white/5">
                    {bridgeResult.executionTrace}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full bg-black/30 border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center py-16 text-center text-zinc-500">
                <Zap className="w-8 h-8 text-zinc-600 mb-2.5 animate-pulse" />
                <span className="text-[11px] font-mono italic">[ Standby: Ready to dispatch high-speed design workload ]</span>
              </div>
            )}
          </div>
        </div>

        {/* GDPR PRIVACY ERASURE WORKSPACE */}
        <div className="border-t border-white/5 pt-6 mt-6">
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">
                GDPR ZeroTrust Right-to-be-Forgotten Compliance
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] font-mono text-zinc-400 block uppercase">Target Tenant Identification ID</label>
                <input
                  type="text"
                  value={erasureTenantId}
                  onChange={(e) => setErasureTenantId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  placeholder="Enter tenant identifier..."
                />
              </div>

              <button
                onClick={handleRunErasure}
                className="bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/25 font-mono text-[10.5px] py-2.5 px-4 rounded-xl font-bold cursor-pointer transition-all self-end"
              >
                Trigger Automated GDPR Erasure
              </button>
            </div>

            {erasureResult && (
              <div className="bg-black/60 border border-white/10 rounded-xl p-3 text-left space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-zinc-400">Erasure Status:</span>
                  <span className={erasureResult.success ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {erasureResult.success ? "SUCCESS" : "FAILED"}
                  </span>
                </div>
                <div className="text-[8.5px] font-mono text-zinc-400 leading-normal">
                  <p className="text-zinc-300">All local storage attributes and telemetry logs containing ID context cleared. Zero retention guarantee locked.</p>
                  {erasureResult.erasedKeys.length > 0 ? (
                    <div className="mt-1.5 space-y-1">
                      <span className="text-[8px] text-zinc-500 block">PURGED CACHED KEYS:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {erasureResult.erasedKeys.map((k) => (
                          <span key={k} className="bg-rose-500/5 border border-rose-500/15 text-rose-300 px-1.5 py-0.5 rounded text-[8px]">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-500 italic mt-1">No residual active cache files found matching this tenant context.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OPTIMIZATION ENGINE CONTROL SUITE */}
      <div className="bg-slate-950/60 border border-white/5 rounded-3xl p-6 space-y-6 text-left mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
                Optimization Engine Controller
              </span>
            </div>
            <h4 className="text-base font-serif font-light text-white mt-1">
              Prediction Cache, Telemetry and Automated Latency Guard
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-normal max-w-xl">
              Dynamically analyzes workloads, maintains a memory-resident warm cache of frequent prompt signatures, and automatically shifts into high-speed backup profiles under service latency stress.
            </p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
              fallbackModeActive 
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' 
                : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
            }`}>
              {fallbackModeActive ? '● LOW-LATENCY FALLBACK ACTIVE' : '● LATENCY STABILIZED (STANDBY)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Prediction Cache & Style Warm-up */}
          <div className="lg:col-span-4 bg-black/30 border border-white/5 p-4 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Prediction Cache Warm-up</span>
              </div>
              <button 
                onClick={handleClearCache}
                className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear Cache
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[8px] font-mono text-zinc-500 uppercase block mb-1">Pre-warmed Style Patterns (Freq &gt;= 2)</span>
                {prewarmedStyles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {prewarmedStyles.map((style, idx) => (
                      <span key={idx} className="bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[8px] font-mono px-2 py-0.5 rounded-lg">
                        {style.substring(0, 32)}{style.length > 32 ? '...' : ''}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[9px] font-mono italic text-zinc-600 block bg-black/20 p-2 rounded-xl">
                    No style pattern has met the pre-warming frequency threshold (2x logs in the same session).
                  </span>
                )}
              </div>

              <div>
                <span className="text-[8px] font-mono text-zinc-500 uppercase block mb-1">Last 10 Namespace Transactions</span>
                {styleHistory.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                    {styleHistory.map((style, idx) => (
                      <div key={idx} className="bg-black/40 border border-white/5 p-2 rounded-lg text-[9px] font-mono text-zinc-300 flex justify-between gap-2">
                        <span className="truncate">{style}</span>
                        <span className="text-zinc-600 text-[8px] flex-shrink-0">#{styleHistory.length - idx}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[9px] font-mono italic text-zinc-600 block">
                    No transactions registered. Run Generator Bridge workload above.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center Column: Latency Health-Checks & Swinger Fallback */}
          <div className="lg:col-span-4 bg-black/30 border border-white/5 p-4 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Latency Guard & Health Check</span>
                <span className="text-[8px] font-mono text-zinc-500">Every 60s simulated</span>
              </div>

              <div className="bg-black/40 p-3 rounded-xl space-y-2 border border-white/5 text-xs text-zinc-400">
                <p className="leading-relaxed text-[11px]">
                  Health check queries target Google AI Studio. If latency exceeds <strong>1000ms</strong>, the system switches to <strong>Low-Latency Fallback</strong>, saving 50% on steps & image size.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase">Simulated Ping Response Latency</label>
                  <span className={`text-xs font-mono font-bold ${pingLatencyInput > 1000 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {pingLatencyInput}ms
                  </span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1500"
                  step="50"
                  value={pingLatencyInput}
                  onChange={(e) => setPingLatencyInput(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <button
                onClick={handleRunPing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs py-2 px-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Server className="w-3.5 h-3.5" />
                Ping Google AI Studio Service
              </button>
            </div>

            {pingResult && (
              <div className="bg-black/60 border border-white/10 rounded-xl p-3 text-[10px] font-mono space-y-1.5 text-left mt-2">
                <div className="flex justify-between"><span className="text-zinc-500">Test Latency:</span> <span className={pingResult.latencyMs > 1000 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>{pingResult.latencyMs}ms</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Fallback Triggered:</span> <span className={pingResult.lowLatencyFallbackActive ? "text-amber-400 font-bold" : "text-zinc-400"}>{pingResult.lowLatencyFallbackActive ? "ACTIVE" : "NO"}</span></div>
                {pingResult.triggeredAlert && (
                  <p className="text-[9px] text-rose-300 bg-rose-950/20 p-1.5 rounded border border-rose-500/20 mt-1 animate-pulse">
                    ⚠ Warning logged to StabilityEngine! Switching profiles.
                  </p>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-white/5">
              <button
                onClick={handleToggleFallback}
                className={`w-full font-mono text-[10px] py-1.5 px-3 rounded-xl border transition-all ${
                  fallbackModeActive 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' 
                    : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10'
                }`}
              >
                {fallbackModeActive ? 'Disable Fallback Profile' : 'Force Toggle Low-Latency Fallback'}
              </button>
            </div>
          </div>

          {/* Right Column: Telemetry Ingest Logs */}
          <div className="lg:col-span-4 bg-black/30 border border-white/5 p-4 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Telemetry Ingest Stream</span>
              <button 
                onClick={handleClearTelemetry}
                className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear Stream
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {telemetryLogs.map((log, idx) => (
                <div key={idx} className="bg-black/50 border border-white/5 p-3 rounded-xl text-[9px] font-mono text-zinc-300 space-y-1">
                  <div className="flex justify-between text-[8px] text-zinc-500">
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-indigo-400 font-bold truncate max-w-[130px]">{log.namespace}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 mt-1 text-[8.5px]">
                    <div>
                      <span className="text-zinc-500 block">LATENCY:</span>
                      <span className={log.latencyMs > 1000 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                        {log.latencyMs}ms
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">SUCCESS:</span>
                      <span className="text-zinc-300">{(log.successRate * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">RAM TEMP:</span>
                      <span className="text-zinc-300">{log.memoryPressure}%</span>
                    </div>
                  </div>
                </div>
              ))}

              {telemetryLogs.length === 0 && (
                <p className="text-[10px] font-mono italic text-zinc-600 py-10 text-center">
                  Telemetry logs empty. Execute a generation above to stream.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RESOURCE & CAPACITY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE: RESOURCE MONITOR & LATENCY CHARTS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. RESOURCE MONITOR & SYSTEM STATISTICS */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-5 text-left">
            <div className="pb-3 border-b border-white/5 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Real-time Telemetry</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Resource Footprint Monitor</h4>
              </div>
              <span className="text-[9px] font-mono text-zinc-500">Live Active Tracking</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CPU USAGE */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-400">CPU Usage</span>
                  <span className="text-white font-bold">{resourceMetrics.cpuUsagePercent}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      resourceMetrics.cpuUsagePercent > 75 ? 'bg-rose-500 animate-pulse' :
                      resourceMetrics.cpuUsagePercent > 50 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${resourceMetrics.cpuUsagePercent}%` }}
                  />
                </div>
                <p className="text-[8.5px] text-zinc-500 leading-normal">
                  Estimated virtual load across local background threads.
                </p>
              </div>

              {/* MEMORY USAGE */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-400">RAM Allocation</span>
                  <span className="text-white font-bold">{resourceMetrics.memoryUsageMb} MB</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-teal-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (resourceMetrics.memoryUsageMb / 512) * 100)}%` }}
                  />
                </div>
                <p className="text-[8.5px] text-zinc-500 leading-normal">
                  Volatile caching size for Active State DNA & Memory blocks.
                </p>
              </div>

              {/* STORAGE USAGE */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-400">Storage Usage</span>
                  <span className="text-white font-bold">{resourceMetrics.storageUsageKb} KB</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (resourceMetrics.storageUsageKb / 4096) * 100)}%` }}
                  />
                </div>
                <p className="text-[8.5px] text-zinc-500 leading-normal">
                  Serialized size of local browser state & database.
                </p>
              </div>
            </div>
          </div>

          {/* 2. LATENCY ANALYSIS CHARTS */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-5 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Operational Latencies</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Active Engine Latency Profile</h4>
              <p className="text-[10px] text-zinc-400">
                Telemetry profiling execution cycles and scheduling delays across decoupled framework layers.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { name: 'Autonomous Execution Latency', value: resourceMetrics.latencies.executionLatencyMs, target: '150ms max' },
                { name: 'Predictive Model Simulation Latency', value: resourceMetrics.latencies.predictionLatencyMs, target: '300ms max' },
                { name: 'Goal Decomposition Planning Latency', value: resourceMetrics.latencies.planningLatencyMs, target: '500ms max' },
                { name: 'Weight Optimizer Learning Latency', value: resourceMetrics.latencies.learningLatencyMs, target: '500ms max' },
                { name: 'Rule Resolution Reasoning Latency', value: resourceMetrics.latencies.reasoningLatencyMs, target: '400ms max' }
              ].map((lat, idx) => {
                const maxLimit = 500;
                const percent = Math.min(100, (lat.value / maxLimit) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-300 font-medium">{lat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{lat.value} ms</span>
                        <span className="text-zinc-600">({lat.target})</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-lg overflow-hidden flex">
                      <div 
                        className={`h-full rounded-lg transition-all duration-500 ${
                          lat.value > 350 ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                          lat.value > 200 ? 'bg-gradient-to-r from-amber-500 to-violet-500' :
                          'bg-gradient-to-r from-indigo-500 to-teal-500'
                        }`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. BOTTLENECK ANALYSIS */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-rose-400 font-bold uppercase tracking-wider block">Diagnostics Console</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Resource Bottlenecks & Hotspots</h4>
            </div>

            <div className="space-y-3">
              {resourceMetrics.bottlenecks.map((bot) => (
                <div key={bot.id} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-100">{bot.sourceEngine}</span>
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Impact: {bot.metricImpact}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                      bot.severity === 'Critical' ? 'bg-red-500/15 text-red-400' :
                      bot.severity === 'High' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      Severity: {bot.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{bot.description}</p>
                  <div className="bg-black/30 border border-white/5 p-2.5 rounded-lg text-[9.5px] text-indigo-300 font-mono">
                    <span className="font-bold text-indigo-400">Suggested Action: </span> {bot.remedy}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE: CAPACITY MONITOR, ENGINE ACTIVITY & OPTIMIZATION CENTER */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. CAPACITY MONITOR */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Scale Indexer</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Capacity & Limits Manager</h4>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-center">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Current Load</span>
                  <span className="text-lg font-mono text-white font-light">{resourceMetrics.capacity.currentCapacity} items</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-center">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Growth Trend</span>
                  <span className="text-lg font-mono text-emerald-400 font-bold">{resourceMetrics.capacity.growthTrend}</span>
                </div>
              </div>

              <div className="p-3.5 bg-black/20 border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>Local Storage Capacity</span>
                  <span className="text-white">{resourceMetrics.capacity.estimatedHeadroom}% Headroom</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${resourceMetrics.capacity.estimatedHeadroom}%` }} 
                  />
                </div>
                <span className="text-[8px] font-mono text-zinc-500 block text-right">
                  Peak Threshold Capacity: {resourceMetrics.capacity.peakCapacity} wardrobe slots
                </span>
              </div>
            </div>
          </div>

          {/* 2. ENGINE ACTIVITY MONITOR */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Active Queue Load</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Engine Activity Telemetry</h4>
            </div>

            <div className="space-y-3 text-[10px] font-mono">
              <div className="flex justify-between items-center p-2.5 bg-black/20 rounded-lg">
                <span className="text-zinc-400">Workflow Engine Load</span>
                <span className="text-white font-bold">{resourceMetrics.load.workflowLoad}%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-black/20 rounded-lg">
                <span className="text-zinc-400">Multi-Agent Communication Load</span>
                <span className="text-white font-bold">{resourceMetrics.load.agentLoad}%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-black/20 rounded-lg">
                <span className="text-zinc-400">Task Telemetry Throughput</span>
                <span className="text-emerald-400 font-bold">{resourceMetrics.load.taskThroughput} cycles/m</span>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Execution Queue Statistics</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-1.5">
                    <span className="text-emerald-400 font-bold block">{resourceMetrics.load.queueStatistics.activeTasks}</span>
                    <span className="text-[7.5px] text-zinc-500 uppercase">Active</span>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-1.5">
                    <span className="text-indigo-400 font-bold block">{resourceMetrics.load.queueStatistics.pendingTasks}</span>
                    <span className="text-[7.5px] text-zinc-500 uppercase">Pending</span>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded p-1.5">
                    <span className="text-rose-400 font-bold block">{resourceMetrics.load.queueStatistics.blockedTasks}</span>
                    <span className="text-[7.5px] text-zinc-500 uppercase">Blocked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. PERFORMANCE OPTIMIZATION CENTER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Computational Tuning</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Active Engine Tuning Center</h4>
            </div>

            <div className="space-y-3">
              {perfSuggestions.map((sug) => (
                <div key={sug.id} className="bg-black/25 border border-white/5 p-3 rounded-xl space-y-2.5 text-left transition-all">
                  <div className="flex justify-between items-start gap-1.5">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-100">{sug.title}</span>
                      <span className="text-[8px] font-mono text-zinc-500 block">Engine: @{sug.targetEngine}</span>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold whitespace-nowrap">
                      {sug.savingEstimate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[8.5px] font-mono text-zinc-500">Impact Score: {sug.impactScore}/100</span>
                    <button
                      onClick={() => togglePerformanceOption(sug.id)}
                      className={`font-mono text-[8px] py-1 px-2 rounded-lg cursor-pointer transition-all font-bold ${
                        sug.applied 
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/25'
                          : 'bg-white/10 hover:bg-white/15 text-zinc-300 border border-white/10'
                      }`}
                    >
                      {sug.applied ? '[ Applied ]' : '[ Apply Optim ]'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. PERFORMANCE TIMELINE */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="space-y-1 text-left">
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Chrono Telemetry Logging</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Performance Trace</h4>
            </div>

            <div className="bg-black/90 border border-white/10 rounded-xl p-3 h-48 overflow-y-auto custom-scrollbar font-mono text-[9px] text-zinc-400 space-y-2 text-left">
              {perfTimeline.map((item, idx) => (
                <div key={idx} className="leading-relaxed border-b border-white/[0.03] pb-1.5">
                  <div className="flex justify-between text-[8px] text-zinc-500 mb-0.5">
                    <span>[{item.timestamp}]</span>
                    <span className={`font-bold ${
                      item.status === 'Optimized' ? 'text-emerald-400' :
                      item.status === 'Degraded' ? 'text-rose-400 animate-pulse' : 'text-zinc-500'
                    }`}>
                      @{item.engine}
                    </span>
                  </div>
                  <span className="text-zinc-200 block text-left">
                    {item.operation} <span className="text-zinc-500">({item.latencyMs}ms)</span>
                  </span>
                </div>
              ))}
              <div className="text-zinc-600 italic text-left">... monitoring local orchestration channels headlessly ...</div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
