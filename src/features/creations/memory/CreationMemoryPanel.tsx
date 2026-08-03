import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, Cpu, Sparkles, GitCommit, ShieldCheck, Zap, 
  Layers, Palette, BarChart3, Clock, Check, ArrowRight, Globe, Lock, Activity
} from 'lucide-react';
import { FashionCreation } from '../CreationTypes';
import { analyzeCreationPreferences, CreationPreferencesAnalysis } from './CreationPreferenceAnalyzer';
import { fetchStyleEvolutionMilestones, StyleEvolutionMilestone } from './StyleEvolutionTracker';
import { fetchLearnedMemorySummary, LearnedMemorySummary } from './CreationMemoryEngine';

interface CreationMemoryPanelProps {
  creations?: FashionCreation[];
  userId?: string;
  onApplyMemoryEnhancement?: (memorySummary: LearnedMemorySummary) => void;
}

export const CreationMemoryPanel: React.FC<CreationMemoryPanelProps> = ({
  creations = [],
  userId,
  onApplyMemoryEnhancement
}) => {
  const [analysis, setAnalysis] = useState<CreationPreferencesAnalysis>(() => analyzeCreationPreferences(creations));
  const [milestones, setMilestones] = useState<StyleEvolutionMilestone[]>([]);
  const [memorySummary, setMemorySummary] = useState<LearnedMemorySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoEnhanceEnabled, setAutoEnhanceEnabled] = useState(true);

  useEffect(() => {
    setAnalysis(analyzeCreationPreferences(creations));
  }, [creations]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      const [mList, mSum] = await Promise.all([
        fetchStyleEvolutionMilestones(userId),
        fetchLearnedMemorySummary(userId)
      ]);

      if (isMounted) {
        setMilestones(mList);
        setMemorySummary(mSum);
        setIsLoading(false);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [userId]);

  return (
    <div className="space-y-6 text-left">
      {/* HEADER CARD */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl text-indigo-300 shadow-lg shadow-indigo-500/10">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>ARIA Creation Memory Intelligence</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.4 Telemetry
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Long-term fashion learning signal processor & creative identity graph
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Civilization Memory Ready</span>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#05050a] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Creative Identity Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-indigo-300">{analysis.creativeIdentityScore}</span>
              <span className="text-xs text-zinc-500 font-mono">/ 100</span>
            </div>
          </div>

          <div className="bg-[#05050a] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Design Consistency</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-400">{analysis.designConsistencyScore}%</span>
              <span className="text-[10px] text-emerald-500 font-mono">High Alignment</span>
            </div>
          </div>

          <div className="bg-[#05050a] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Learned Signals</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-300">{memorySummary?.totalSignalsCaptured || 0}</span>
              <span className="text-[10px] text-zinc-500 font-mono">Events Recorded</span>
            </div>
          </div>

          <div className="bg-[#05050a] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Dominant Archetype</span>
            <span className="text-xs font-bold text-amber-300 block truncate">{analysis.dominantTheme}</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PREFERENCE BREAKDOWN */}
        <div className="lg:col-span-7 space-y-6">
          {/* FAVORITE CATEGORIES */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Category Distribution & Preference</h4>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {analysis.totalCreationsAnalyzed} Total Creations
              </span>
            </div>

            <div className="space-y-3">
              {analysis.topCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{cat.category}</span>
                    <span className="font-mono text-indigo-300">{cat.percentage}% ({cat.count})</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLOR PALETTES & FABRIC PREFERENCES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DOMINANT COLORS */}
            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dominant Color Signals</h4>
              </div>

              <div className="space-y-2">
                {analysis.dominantColors.map((color, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#05050a] p-2 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                      <span className="text-xs font-medium text-zinc-300">{color.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{color.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PREFERRED FABRICS */}
            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Preferred Fabrics</h4>
              </div>

              <div className="space-y-2">
                {analysis.preferredFabrics.map((fab, idx) => (
                  <div key={idx} className="bg-[#05050a] p-2 rounded-xl border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200 truncate">{fab.fabric}</span>
                      <span className="font-mono text-amber-400">{fab.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STYLE EVOLUTION TIMELINE & CIVILIZATION ARCHITECTURE */}
        <div className="lg:col-span-5 space-y-6">
          {/* STYLE EVOLUTION GRAPH */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Creation Style Evolution Graph</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                TIMELINE
              </span>
            </div>

            <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-500/30">
              {milestones.map((m) => (
                <div key={m.id} className="relative bg-[#05050a] p-3 rounded-xl border border-white/5 space-y-1.5">
                  <div className="absolute -left-[21px] top-3.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-[#07070c]" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">{m.period}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{m.timestamp}</span>
                  </div>

                  <h5 className="text-xs font-semibold text-white">{m.primaryTheme}</h5>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono pt-1">
                    <span>Luxury: <strong className="text-amber-400">{m.luxuryScore}%</strong></span>
                    <span>•</span>
                    <span>Modernity: <strong className="text-indigo-400">{m.modernityScore}%</strong></span>
                  </div>

                  {m.notes && <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-white/5">{m.notes}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* AI CIVILIZATION MEMORY COMPATIBILITY ARCHITECTURE */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Civilization Memory Hierarchy</h4>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center justify-between">
                <span>1. Fashion Creation Memory</span>
                <Check className="w-3.5 h-3.5 text-indigo-400" />
              </div>

              <div className="text-center text-zinc-600">↓</div>

              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center justify-between">
                <span>2. Personal Style Identity Memory</span>
                <Check className="w-3.5 h-3.5 text-purple-400" />
              </div>

              <div className="text-center text-zinc-600">↓</div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                <span>3. Global AI Civilization Memory</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 uppercase">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
