import React, { useEffect, useState } from 'react';
import { Bot, Sparkles, Cpu, Zap, Activity, ChevronRight, ShieldCheck, Play } from 'lucide-react';
import { LivePrototypeController } from '../../features/ariaLivePrototype/LivePrototypeController';
import { ARIAPrototypeLiveState } from '../../features/ariaLivePrototype/LivePrototypeTypes';

interface ARIALivePrototypePanelProps {
  setActiveSubTab?: (tab: any) => void;
}

export const ARIALivePrototypePanel: React.FC<ARIALivePrototypePanelProps> = ({ setActiveSubTab }) => {
  const [state, setState] = useState<ARIAPrototypeLiveState>(LivePrototypeController.getInstance().getState());
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    LivePrototypeController.getInstance().initialize();
    const unsubscribe = LivePrototypeController.getInstance().subscribe(setState);
    return () => unsubscribe();
  }, []);

  const handleRunScenario = async (scenario: 'LUXURY_OUTFIT' | 'VISION_ANALYSIS' | 'STYLE_EVOLUTION' | 'WARDROBE_OPT' | 'KNOWLEDGE_QUERY') => {
    try {
      await LivePrototypeController.getInstance().runScenario(scenario);
      window.dispatchEvent(
        new CustomEvent('lookvision_show_toast', {
          detail: `ARIA Live Prototype Scenario executed successfully.`
        })
      );
    } catch (err: any) {
      window.dispatchEvent(
        new CustomEvent('lookvision_show_toast', {
          detail: `ARIA Execution Error: ${err?.message || 'Failed'}`
        })
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || state.isProcessing) return;
    const currentPrompt = prompt;
    setPrompt('');

    try {
      await LivePrototypeController.getInstance().executeRequest({ prompt: currentPrompt });
    } catch (_) {}
  };

  const lastRes = state.lastResponse;

  return (
    <div className="bg-[#06060c] border border-violet-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-left">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-900 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">ARIA Live Prototype Engine</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE v3.2
              </span>
            </div>
            <p className="text-xs text-zinc-400">Autonomous Fashion Intelligence Prototype Mesh</p>
          </div>
        </div>

        {/* Readiness and Latency indicators */}
        <div className="flex items-center gap-2">
          <div className="bg-black/50 border border-white/5 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-mono text-zinc-300">
              <strong className="text-white">{state.activeEngines.length}</strong> Engines
            </span>
          </div>

          <div className="bg-black/50 border border-white/5 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono text-zinc-300">
              Score: <strong className="text-emerald-400">{state.overallReadinessScore}%</strong>
            </span>
          </div>

          {setActiveSubTab && (
            <button
              onClick={() => setActiveSubTab('PRODUCT_AI_CREATIONS')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 border border-violet-400/30 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/20"
            >
              📊 Investor View
            </button>
          )}
        </div>
      </div>

      {/* Quick Scenario Launch Buttons */}
      <div className="mb-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2 font-semibold">
          ⚡ Prototype Live Scenarios (Instant Autonomous Execution)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <button
            onClick={() => handleRunScenario('LUXURY_OUTFIT')}
            disabled={state.isProcessing}
            className="px-2.5 py-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-[11px] font-medium text-indigo-200 hover:text-white transition-all flex items-center gap-1.5 justify-center"
          >
            <Play className="w-3 h-3 text-indigo-400" /> Executive Fit
          </button>
          <button
            onClick={() => handleRunScenario('VISION_ANALYSIS')}
            disabled={state.isProcessing}
            className="px-2.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-[11px] font-medium text-purple-200 hover:text-white transition-all flex items-center gap-1.5 justify-center"
          >
            <Play className="w-3 h-3 text-purple-400" /> Vision Analysis
          </button>
          <button
            onClick={() => handleRunScenario('STYLE_EVOLUTION')}
            disabled={state.isProcessing}
            className="px-2.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-[11px] font-medium text-amber-200 hover:text-white transition-all flex items-center gap-1.5 justify-center"
          >
            <Play className="w-3 h-3 text-amber-400" /> Style Trajectory
          </button>
          <button
            onClick={() => handleRunScenario('WARDROBE_OPT')}
            disabled={state.isProcessing}
            className="px-2.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-200 hover:text-white transition-all flex items-center gap-1.5 justify-center"
          >
            <Play className="w-3 h-3 text-emerald-400" /> Capsule Opt
          </button>
          <button
            onClick={() => handleRunScenario('KNOWLEDGE_QUERY')}
            disabled={state.isProcessing}
            className="px-2.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-[11px] font-medium text-cyan-200 hover:text-white transition-all flex items-center gap-1.5 justify-center"
          >
            <Play className="w-3 h-3 text-cyan-400" /> Heritage Query
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask ARIA live prototype (e.g., 'Curate an evening gala look' or 'Predict autumn trends')..."
          disabled={state.isProcessing}
          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 pr-24 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={state.isProcessing || !prompt.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-[11px] font-bold text-white hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1"
        >
          {state.isProcessing ? (
            <Activity className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> Execute
            </>
          )}
        </button>
      </form>

      {/* Processing State Indicator */}
      {state.isProcessing && (
        <div className="bg-violet-950/30 border border-violet-500/20 rounded-xl p-3 flex items-center gap-3 animate-pulse">
          <Activity className="w-4 h-4 text-violet-400 animate-spin" />
          <span className="text-xs font-mono text-violet-300">
            {state.currentStepSummary || 'Multi-Agent Autonomous Reasoning in progress...'}
          </span>
        </div>
      )}

      {/* Latest Recommendation Display */}
      {lastRes && !state.isProcessing && (
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">
                {lastRes.recommendationPayload?.title || lastRes.summary}
              </h4>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-300">
                Confidence: {lastRes.confidenceReport.finalConfidence}%
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
                Latency: {lastRes.executionTimeline.totalLatencyMs}ms
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
            {lastRes.recommendationPayload?.description || lastRes.summary}
          </p>

          {lastRes.recommendationPayload?.items && lastRes.recommendationPayload.items.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Curated Items</span>
              <div className="flex flex-wrap gap-1.5">
                {lastRes.recommendationPayload.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-white/10 text-[11px] text-zinc-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning Steps Badge Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Engines:</span>
            {lastRes.executionTimeline.steps.slice(0, 4).map((step, idx) => (
              <span key={idx} className="text-[10px] font-mono text-violet-400 bg-violet-950/40 px-2 py-0.5 rounded border border-violet-500/20">
                {step.engineName} ({step.confidenceScore}%)
              </span>
            ))}
            {setActiveSubTab && (
              <button
                onClick={() => setActiveSubTab('AI_ASSISTANT_STUDIO')}
                className="ml-auto text-[11px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-1"
              >
                Full Assistant View <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
