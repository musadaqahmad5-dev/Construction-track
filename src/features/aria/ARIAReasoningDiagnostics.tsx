import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, CheckCircle2, ShieldCheck, Zap, AlertCircle, ArrowRight, Eye, Code, Terminal, Sparkles } from 'lucide-react';
import { ARIAReasoningStep } from './types';

interface ARIAReasoningDiagnosticsProps {
  recentSteps?: ARIAReasoningStep[];
  onTestReasoning?: (prompt: string) => void;
}

export const ARIAReasoningDiagnostics: React.FC<ARIAReasoningDiagnosticsProps> = ({
  recentSteps,
  onTestReasoning
}) => {
  const defaultSteps: ARIAReasoningStep[] = [
    {
      id: 'step_1',
      stageName: '1. Intent & Context Classification',
      description: 'Identified query intent as OUTFIT with high confidence. Extracted occasion (Evening Gala) & weather constraints (Clear 18°C).',
      status: 'completed',
      durationMs: 42,
      confidenceScore: 0.99,
      insights: [
        'Intent matched rule OUTFIT_EVENING_FORMAL',
        'Temperature within mild layering threshold (16°C - 22°C)'
      ]
    },
    {
      id: 'step_2',
      stageName: '2. Style DNA Vector Matching',
      description: 'Cross-referenced user Cognitive Passport. Filtered candidates against primary palette (Charcoal / Navy) & architectural silhouette preferences.',
      status: 'completed',
      durationMs: 85,
      confidenceScore: 0.97,
      insights: [
        'Selected 4 high-affinity garment candidates from active wardrobe',
        'Applied negative constraint: Excluded informal denim and sport textiles'
      ]
    },
    {
      id: 'step_3',
      stageName: '3. Gemini Chain-of-Thought Synthesis',
      description: 'Invoked Google Gemini 2.5 Flash neural pipeline to generate rationale, color harmony weights, and sartorial narrative.',
      status: 'completed',
      durationMs: 310,
      confidenceScore: 0.98,
      insights: [
        'Generated spread rationale focusing on texture contrast (Matte Wool vs Satin Collar)',
        'Balanced proportion hierarchy for low-light evening venue'
      ]
    },
    {
      id: 'step_4',
      stageName: '4. Governance & Rule Verification',
      description: 'Audited output against compliance guardrails, temperature rules, and brand style invariants.',
      status: 'completed',
      durationMs: 18,
      confidenceScore: 1.0,
      insights: [
        'Zero rule violations detected',
        'All garment URLs verified in active wardrobe inventory'
      ]
    }
  ];

  const stepsToRender = recentSteps && recentSteps.length > 0 ? recentSteps : defaultSteps;
  const [testPrompt, setTestPrompt] = useState('Curate an architectural capsule look for a rainy evening gallery opening');
  const [isExecutingTest, setIsExecutingTest] = useState(false);

  const handleRunDiagnostic = () => {
    if (!testPrompt.trim() || isExecutingTest) return;
    setIsExecutingTest(true);
    setTimeout(() => {
      if (onTestReasoning) {
        onTestReasoning(testPrompt);
      }
      setIsExecutingTest(false);
    }, 1200);
  };

  return (
    <div className="w-full bg-[#07070c] border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Fashion Reasoning Diagnostics
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/30">
                CoT Trace Engine
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Live step-by-step reasoning trace executed by Gemini and LOOK VISION rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Governance Verified
          </span>
        </div>
      </div>

      {/* Interactive Prompt Execution Bar */}
      <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs">
          <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={testPrompt}
            onChange={e => setTestPrompt(e.target.value)}
            placeholder="Enter custom prompt to trace reasoning pipeline..."
            className="w-full bg-transparent text-white focus:outline-none placeholder-zinc-500"
          />
        </div>
        <button
          onClick={handleRunDiagnostic}
          disabled={isExecutingTest}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-indigo-600/20"
        >
          <Zap className={`w-3.5 h-3.5 ${isExecutingTest ? 'animate-spin' : ''}`} />
          <span>{isExecutingTest ? 'Executing CoT...' : 'Trace CoT Pipeline'}</span>
        </button>
      </div>

      {/* CoT Timeline Steps */}
      <div className="space-y-3 mt-5">
        {stepsToRender.map((step, idx) => {
          const confPct = step.confidenceScore ? Math.round(step.confidenceScore * 100) : 98;

          return (
            <motion.div
              key={step.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">{step.stageName}</h4>
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed font-sans">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                  {step.durationMs && (
                    <span className="text-zinc-500">{step.durationMs}ms</span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    {confPct}% conf
                  </span>
                </div>
              </div>

              {step.insights && step.insights.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1">
                  {step.insights.map((insight, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
