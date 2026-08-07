import React, { useEffect, useState } from 'react';
import {
  Bot,
  Cpu,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Database,
  Users,
  Eye,
  TrendingUp,
  ShieldCheck,
  Award,
  Play,
  BarChart3,
  Globe,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { DemoExperienceController } from '../../features/ariaDemo/DemoExperienceController';
import { DemoState, DemoScenarioId } from '../../features/ariaDemo/DemoSessionTypes';
import { DEMO_SCENARIOS } from '../../features/ariaDemo/DemoScenarioEngine';

interface ARIAInvestorDashboardProps {
  onClose?: () => void;
}

export const ARIAInvestorDashboard: React.FC<ARIAInvestorDashboardProps> = ({ onClose }) => {
  const [demoState, setDemoState] = useState<DemoState>(DemoExperienceController.getInstance().getState());
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENGINES' | 'METRICS' | 'DEMO_RUNNER'>('OVERVIEW');

  useEffect(() => {
    DemoExperienceController.getInstance().initialize();
    const unsubscribe = DemoExperienceController.getInstance().subscribe(setDemoState);
    return () => unsubscribe();
  }, []);

  const handleRunScenario = async (id: DemoScenarioId) => {
    try {
      await DemoExperienceController.getInstance().runDemoScenario(id);
      window.dispatchEvent(
        new CustomEvent('lookvision_show_toast', {
          detail: 'Demo scenario executed successfully!'
        })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      window.dispatchEvent(
        new CustomEvent('lookvision_show_toast', {
          detail: `Scenario Execution Error: ${msg}`
        })
      );
    }
  };

  const overview = demoState.investorOverview;
  const metrics = demoState.metrics;
  const lastResult = demoState.currentScenarioResult;

  return (
    <div className="bg-[#05050a] border border-violet-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-left text-zinc-100 max-w-7xl mx-auto">
      {/* Background Glows */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-800 flex items-center justify-center shadow-xl shadow-indigo-500/20 border border-white/10">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-white tracking-wide">LOOK VISION ARIA</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                DEMO READY v2.4.0
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Autonomous Fashion Intelligence Architecture • Executive Presentation Dashboard
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => DemoExperienceController.getInstance().initialize()}
            className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-all"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> System Architecture Overview
        </button>
        <button
          onClick={() => setActiveTab('ENGINES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ENGINES'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-400'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Intelligence Engines (17)
        </button>
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'METRICS'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Product Metrics
        </button>
        <button
          onClick={() => setActiveTab('DEMO_RUNNER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'DEMO_RUNNER'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-400'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Interactive Demo Scenarios
        </button>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metric Headline Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 hover:border-violet-500/20 transition-all">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono font-semibold uppercase">Active Engines</span>
                <Cpu className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{overview.activeEngineCount}</div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> 100% Mesh Health
              </span>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 hover:border-violet-500/20 transition-all">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono font-semibold uppercase">Knowledge Graph</span>
                <Database className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">1.42M</div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">8.9M Civilization Edges</span>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 hover:border-violet-500/20 transition-all">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono font-semibold uppercase">Reasoning Confidence</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {overview.reasoningConfidenceAvg}%
              </div>
              <span className="text-[10px] text-emerald-400/80 font-mono mt-1 block">Cross-Validated Consensus</span>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 hover:border-violet-500/20 transition-all">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono font-semibold uppercase">Avg Response Latency</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{overview.averageLatencyMs}ms</div>
              <span className="text-[10px] text-amber-400 font-mono mt-1 block">Sub-20ms Edge Routing</span>
            </div>
          </div>

          {/* Sub-system Status Matrix */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Core Autonomous Capabilities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-black/50 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" /> Agent Collaboration Mesh
                  </span>
                  <span className="text-emerald-400 font-mono">12 Agents</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Adaptive agent selection dynamically routing tasks based on intent & confidence score.
                </p>
              </div>

              <div className="bg-black/50 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-purple-400" /> Multimodal Fashion Perception
                  </span>
                  <span className="text-emerald-400 font-mono">6 Vision Models</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Sub-millisecond garment bounding, textile drape vectoring, and chromatic harmony extraction.
                </p>
              </div>

              <div className="bg-black/50 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Predictive Trajectory Engine
                  </span>
                  <span className="text-emerald-400 font-mono">12-Month Horizon</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Markov Monte Carlo style migration simulations mapped to global fashion micro-trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTELLIGENCE ENGINES */}
      {activeTab === 'ENGINES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'ARIA Core Orchestrator', category: 'CORE', latency: '14ms', readiness: '100%', desc: 'Central coordinator directing multi-agent reasoning execution pipeline.' },
              { name: 'Style DNA Vector Engine', category: 'CORE', latency: '8ms', readiness: '100%', desc: 'High-dimensional user aesthetic vector encoding and affinity scoring.' },
              { name: 'Personal Fashion Memory', category: 'MEMORY', latency: '12ms', readiness: '100%', desc: 'Biographic wardrobe history, preference graph, and emotional sentiment storage.' },
              { name: 'Civilization Knowledge Graph', category: 'MEMORY', latency: '18ms', readiness: '100%', desc: '5,000+ years of fashion provenance, fabric technology, and subcultural heritage.' },
              { name: 'Adaptive Agent Selector', category: 'AGENT', latency: '10ms', readiness: '100%', desc: 'Dynamic router assigning requests to specialized fashion agent personas.' },
              { name: 'Agent Collaboration Mesh', category: 'AGENT', latency: '25ms', readiness: '100%', desc: 'Peer-to-peer agent consensus protocol resolving sartorial recommendations.' },
              { name: 'Multimodal Vision Engine', category: 'VISION', latency: '45ms', readiness: '100%', desc: 'Computer vision garment detection, color harmony, and fit silhouette vectorization.' },
              { name: 'Generative Fashion Synthesizer', category: 'GENERATIVE', latency: '65ms', readiness: '100%', desc: 'Modular capsule collection generator and outfit concept creator.' },
              { name: 'Predictive Style Simulator', category: 'PREDICTION', latency: '32ms', readiness: '100%', desc: 'Style migration trajectory forecaster and trend adoption simulator.' },
              { name: 'Contextual Decision Engine', category: 'DECISION', latency: '10ms', readiness: '100%', desc: 'Mathematical ranking matrix balancing comfort, weather, occasion, and DNA.' }
            ].map((engine, idx) => (
              <div
                key={idx}
                className="bg-[#07070c] border border-white/5 rounded-2xl p-4 hover:border-violet-500/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{engine.name}</span>
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300">
                      {engine.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mb-3">{engine.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                  <span>Latency: <strong className="text-white">{engine.latency}</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> {engine.readiness}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT METRICS */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Total AI Decisions</span>
              <div className="text-2xl font-black text-white font-mono">
                {metrics.totalAIDecisions.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Style Recommendations</span>
              <div className="text-2xl font-black text-indigo-400 font-mono">
                {metrics.totalStyleRecommendations.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Visual Analyses</span>
              <div className="text-2xl font-black text-purple-400 font-mono">
                {metrics.visualAnalysesCompleted.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Agent Collaborations</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {metrics.agentCollaborations.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Knowledge Retrieval Ops</span>
              <div className="text-xl font-bold text-cyan-400 font-mono">
                {metrics.knowledgeRetrievalOperations.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Generative Syntheses</span>
              <div className="text-xl font-bold text-teal-400 font-mono">
                {metrics.generationRequests.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Style Trajectory Predictions</span>
              <div className="text-xl font-bold text-amber-400 font-mono">
                {metrics.predictionRequests.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE DEMO SCENARIOS */}
      {activeTab === 'DEMO_RUNNER' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMO_SCENARIOS.map((scen) => (
              <div
                key={scen.id}
                className="bg-[#07070c] border border-white/5 rounded-2xl p-4 hover:border-violet-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">{scen.category}</span>
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1.5">{scen.title}</h4>
                  <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">{scen.description}</p>
                </div>

                <button
                  onClick={() => handleRunScenario(scen.id)}
                  disabled={demoState.isExecutingScenario}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {demoState.isExecutingScenario && demoState.activeScenarioId === scen.id ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" /> Executing Pipeline...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Execute Demo Scenario
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Last Result Box */}
          {lastResult && (
            <div className="bg-black/60 border border-violet-500/30 rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {lastResult.title} Result
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                    Confidence: {lastResult.confidenceReport.finalConfidence}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
                    Latency: {lastResult.executionTimeMs}ms
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 mb-3">
                {lastResult.response.recommendationPayload?.description || lastResult.response.summary}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Execution Reasoning Pipeline</span>
                {lastResult.response.executionTimeline.steps.map((step, i) => (
                  <div key={i} className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                    <span className="text-violet-400 font-bold">[{step.engineName}]</span>
                    <span>{step.summary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
