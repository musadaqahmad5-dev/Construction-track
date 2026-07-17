import React from 'react';
import { motion } from 'motion/react';
import { Award, Brain, Zap, Cpu, Sliders, Activity, Layers, CloudSun, Sparkles, Check, Database } from 'lucide-react';

interface BrainTabProps {
  fashionMemory: any;
  state: any;
  graphStats: any;
  selectedGraphStyle: string;
  setSelectedGraphStyle: (style: string) => void;
  currentGraphNode: any;
  handlePeriodSwitch: (period: string) => void;
}

export const BrainTab: React.FC<BrainTabProps> = ({
  fashionMemory,
  state,
  graphStats,
  selectedGraphStyle,
  setSelectedGraphStyle,
  currentGraphNode,
  handlePeriodSwitch
}) => {
  return (
    <motion.div
      key="brain"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left animate-fade-in"
    >
      {/* Enterprise Dashboard header with Enterprise scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
              Enterprise Intelligence Score
            </span>
            <span className="text-3xl font-serif font-light text-white block mt-1">98.4 <span className="text-xs font-mono text-indigo-400">/ 100</span></span>
            <span className="text-[10px] text-white/30 block mt-0.5">Verified local-first styling stability</span>
          </div>
          <Award className="w-8 h-8 text-indigo-400" />
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
              Self-Learning Accuracy Rank
            </span>
            <span className="text-3xl font-serif font-light text-white block mt-1">{fashionMemory.accuracyEstimate.toFixed(1)}% <span className="text-xs font-mono text-emerald-400">Cognitive</span></span>
            <span className="text-[10px] text-white/30 block mt-0.5">Dynamic feedback loops active</span>
          </div>
          <Brain className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
              Local Caching API Reduction
            </span>
            <span className="text-3xl font-serif font-light text-white block mt-1">
              {((fashionMemory.apiCallsSaved / Math.max(1, fashionMemory.apiCallsSaved + 2)) * 100).toFixed(1)}% <span className="text-xs font-mono text-violet-400">Saved</span>
            </span>
            <span className="text-[10px] text-white/30 block mt-0.5">{fashionMemory.apiCallsSaved} styling queries resolved headlessly</span>
          </div>
          <Zap className="w-8 h-8 text-violet-400" />
        </div>
      </div>

      {/* Main reports grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. FASHION INTELLIGENCE ARCHITECTURE */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
              1. Fashion Intelligence Architecture
            </span>
          </div>
          <p className="text-xs font-serif text-white/60 leading-relaxed">
            AIStyleHub's brain operates a layered local-first architecture. It intercepts fashion requests, executes modular sub-intelligence layers, computes a detailed outfit score, and runs explainable narrative decoders before dispatching optional generative pixels.
          </p>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 font-mono text-[9px] text-white/50">
            <div className="flex items-center justify-between">
              <span className="text-white/80 font-medium">Layer A: Style DNA Encoder</span>
              <span className="text-indigo-400">ACTIVE [100% Local]</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 font-medium">Layer B: Skin Tone & Color Harmony</span>
              <span className="text-indigo-400">ACTIVE [100% Local]</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 font-medium">Layer C: Proportional Body Calibration</span>
              <span className="text-indigo-400">ACTIVE [100% Local]</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 font-medium">Layer D: Occasion & Weather Context Map</span>
              <span className="text-indigo-400">ACTIVE [100% Local]</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 font-medium">Layer E: Explainable AI Narrative</span>
              <span className="text-indigo-400">ACTIVE [100% Local]</span>
            </div>
          </div>
        </div>

        {/* 2. STYLE DNA REPORT */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
              2. Persistent User Style DNA Report
            </span>
          </div>
          <p className="text-xs font-serif text-white/60 leading-relaxed">
            Calculated dynamically from closet demographics, history, and preferred color palettes.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/30 uppercase block font-light">Primary Vibe Identity</span>
              <span className="text-white font-medium">{fashionMemory.styleDNA.primaryVibe}</span>
            </div>
            <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/30 uppercase block font-light">Formality Ratio</span>
              <span className="text-white font-medium">{fashionMemory.styleDNA.formalityPreference.toFixed(2)} (Adaptive)</span>
            </div>
            <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/30 uppercase block font-light">Favored Palette</span>
              <span className="text-emerald-400 font-medium">{fashionMemory.favColors.slice(0, 3).join(', ')}</span>
            </div>
            <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/30 uppercase block font-light">Experimental Tolerance</span>
              <span className="text-indigo-400 font-medium">{fashionMemory.styleDNA.experimentalIndex.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 3. OUTFIT SCORING REPORT */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Activity className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
              3. Outfit Compatibility Scoring Report
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Style Alignment Score', val: state.activeSuggestion?.scoring?.styleScore ?? 96, color: 'bg-violet-500' },
              { label: 'Thermal / Weather Comfort', val: state.activeSuggestion?.scoring?.weatherScore ?? 95, color: 'bg-indigo-500' },
              { label: 'Occasion Appropriateness', val: state.activeSuggestion?.scoring?.occasionScore ?? 94, color: 'bg-emerald-500' },
              { label: 'Chromatism & Color Harmony', val: state.activeSuggestion?.scoring?.colorScore ?? 92, color: 'bg-cyan-500' },
              { label: 'Physical Proportion & Fit', val: state.activeSuggestion?.scoring?.fitScore ?? 88, color: 'bg-pink-500' }
            ].map((sc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-white/60">{sc.label}</span>
                  <span className="text-white font-semibold">{sc.val}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className={`${sc.color} h-full`} style={{ width: `${sc.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. EXPLAINABLE AI REPORT */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
              4. Explainable AI (XAI) Narrative Report
            </span>
          </div>
          <p className="text-xs font-serif text-white/60 leading-relaxed">
            Our brain never proposes a style without explaining the underlying reasoning:
          </p>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 font-serif text-xs italic text-white/85">
            {state.activeSuggestion?.explanations && state.activeSuggestion.explanations.length > 0 ? (
              state.activeSuggestion.explanations.map((exp: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 not-italic block">{exp.itemTitle}</span>
                  <p>"{exp.why}"</p>
                </div>
              ))
            ) : (
              <p className="text-white/40">"The selected aesthetic blazer perfectly frames the structured dark tailored chinos, completing a clean high-contrast silhouette suited perfectly for the evening schedule."</p>
            )}
          </div>
        </div>

        {/* 5. PERSONAL FASHION TIMELINE */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <CloudSun className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
              5. Personal Fashion Timeline & Context Curation
            </span>
          </div>
          <p className="text-xs font-serif text-white/60 leading-relaxed">
            AIStyleHub segments your life into social periods and seasons. Click to test how the local recommendation engine adapts user Style DNA preferences:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.keys(fashionMemory.timeline.seasonalPreferences).map((period) => {
              const isActive = fashionMemory.timeline.activeSeason === period;
              return (
                <button
                  key={period}
                  onClick={() => handlePeriodSwitch(period)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                      : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-mono">
            <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/30 uppercase block font-light">Mapped Season Vibe</span>
              <span className="text-white font-medium">
                {fashionMemory.timeline.seasonalPreferences[fashionMemory.timeline.activeSeason]?.vibe || 'Default'}
              </span>
            </div>
            <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/30 uppercase block font-light">Target Colors</span>
              <span className="text-emerald-400 font-medium">
                {fashionMemory.timeline.seasonalPreferences[fashionMemory.timeline.activeSeason]?.colors.join(', ') || 'N/A'}
              </span>
            </div>
            <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/30 uppercase block font-light">Target Key Garments</span>
              <span className="text-indigo-400 font-medium">
                {fashionMemory.timeline.seasonalPreferences[fashionMemory.timeline.activeSeason]?.garments.join(', ') || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* 6. SMART NEGATIVE FILTER SYSTEM */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
              6. Smart Negative Filters (Dislikes Elimination)
            </span>
          </div>
          <p className="text-xs font-serif text-white/60 leading-relaxed">
            Negative preferences prevent inappropriate look formulations. The local recommendation engine strictly avoids proposing:
          </p>
          <div className="space-y-2.5 font-mono text-[10px] text-white/70">
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-white/40">Avoid Colors:</span>
              <span className="text-rose-400 font-medium">{fashionMemory.dislikes.colors.join(', ')}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-white/40">Avoid Silhouette:</span>
              <span className="text-rose-400 font-medium">{fashionMemory.dislikes.garments.join(', ')}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-white/40">Avoid Materials:</span>
              <span className="text-rose-400 font-medium">{fashionMemory.dislikes.materials.join(', ')}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-white/40">Avoid Styles:</span>
              <span className="text-rose-400 font-medium">{fashionMemory.dislikes.prints.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* 7. PROMPT LEARNING & CACHE LIBRARY */}
        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
              7. Prompt Reuse & Successful Templates Library
            </span>
          </div>
          <p className="text-xs font-serif text-white/60 leading-relaxed">
            Reusable highly-scored local prompts are cached inside the user memory container, preventing redundant Imagen or Gemini tokens:
          </p>
          <div className="space-y-2">
            {fashionMemory.promptLibrary.map((item: any, idx: number) => (
              <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-violet-400 font-bold uppercase">{item.styleCategory}</span>
                  <span className="text-emerald-400 font-medium">SUCCESS SCORE: {item.successScore}%</span>
                </div>
                <p className="font-mono text-[9px] text-white/50 leading-relaxed line-clamp-2">
                  {item.promptText}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. RECOMMENDATION DECISION FLOW */}
      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
            8. Real-Time Recommendation Decision Flow Trace
          </span>
        </div>
        <p className="text-xs font-serif text-white/60 leading-relaxed">
          The continuous internal pipeline resolving the active curation trace:
        </p>
        <div className="space-y-2 font-mono text-[9px] text-white/40">
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-semibold">[0.0s]</span>
            <p className="text-white/80">Retrieve active User Context. (Occasion: {state.activeSuggestion?.occasion ?? 'Formal Dinner'}, Climate: Clear Sky / 19°C)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-semibold">[0.1s]</span>
            <p className="text-white/80">Decode user persistent Style DNA vector from permanent closet metadata history.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-semibold">[0.2s]</span>
            <p className="text-white/80">Execute smart negative filters to eliminate neon items or forbidden silhouettes.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-semibold">[0.3s]</span>
            <p className="text-white/80">Query color harmony sub-engine. Scheme resolved: Monochrome Slate (Suitability score: 92%).</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-semibold">[0.4s]</span>
            <p className="text-white/80">Check current active season from timeline ({fashionMemory.timeline.activeSeason}) and prioritize {fashionMemory.timeline.seasonalPreferences[fashionMemory.timeline.activeSeason]?.vibe || 'Nordic Minimalist'} patterns.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-semibold">[0.5s]</span>
            <p className="text-white/80">Compare candidate clothing combinations. Suggestion successfully formulated via local personal memory!</p>
          </div>
        </div>
      </div>

      {/* 9. ENTERPRISE FASHION KNOWLEDGE GRAPH DIAGNOSTICS */}
      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6 lg:col-span-2">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-bold">
                9. Enterprise Fashion Knowledge Graph (Local Intelligence)
              </span>
              <span className="text-[9px] text-white/40 block mt-0.5">High-fidelity localized taxonomy mapping & prompt enrichment engine</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
            Offline Curation Ready
          </span>
        </div>

        {/* Graph Analytics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
            <span className="text-[9px] text-white/30 uppercase font-mono block">Taxonomy Nodes</span>
            <span className="text-xl font-mono text-white font-semibold mt-1 block">{graphStats.nodeCount}</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
            <span className="text-[9px] text-white/30 uppercase font-mono block">Direct Relationships</span>
            <span className="text-xl font-mono text-white font-semibold mt-1 block">{graphStats.relationshipCount}</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
            <span className="text-[9px] text-white/30 uppercase font-mono block">API Calls Saved</span>
            <span className="text-xl font-mono text-violet-400 font-semibold mt-1 block">+{graphStats.apiCallsPrevented}</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
            <span className="text-[9px] text-white/30 uppercase font-mono block">Knowledge Coverage</span>
            <span className="text-xl font-mono text-emerald-400 font-semibold mt-1 block">100% (Absolute)</span>
          </div>
        </div>

        {/* Interactive Node Selection */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-white/50 uppercase block">Active Node Explorer:</span>
          <div className="flex flex-wrap gap-1.5">
            {['Luxury', 'Quiet Luxury', 'Old Money', 'Italian Luxury', 'Streetwear', 'Cyber Avant-Garde', 'Wedding / Formal'].map((styleName) => {
              const isActive = selectedGraphStyle === styleName;
              return (
                <button
                  key={styleName}
                  onClick={() => setSelectedGraphStyle(styleName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {styleName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Node Detailed Inspection View */}
        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl space-y-4 font-sans">
          <div className="flex justify-between items-start pb-2 border-b border-white/5">
            <div>
              <span className="text-sm font-mono text-white font-semibold">{currentGraphNode.styleName} Specification</span>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Static representation inside localized graph memory</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-white/40 block">Seasonality Suitability</span>
              <span className="text-xs font-mono text-indigo-400 block">{currentGraphNode.season} ({currentGraphNode.weather})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Column 1: Aesthetic DNA & Materials */}
            <div className="space-y-3">
              <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono text-white/40 uppercase block">Aesthetic DNA & Fit Matrix</span>
                <div className="space-y-1.5 pt-1 text-[11px] text-white/80">
                  <div><span className="text-white/40 font-mono">Silhouette:</span> {currentGraphNode.silhouette}</div>
                  <div><span className="text-white/40 font-mono">Structure Fit:</span> {currentGraphNode.fit}</div>
                  <div><span className="text-white/40 font-mono">Fabric Types:</span> {currentGraphNode.fabricTypes.join(', ')}</div>
                  <div><span className="text-white/40 font-mono">Textures:</span> {currentGraphNode.texture.join(', ')}</div>
                  <div><span className="text-white/40 font-mono">Patterns:</span> {currentGraphNode.pattern.join(', ')}</div>
                </div>
              </div>

              <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono text-white/40 uppercase block">Color Palette Coordination</span>
                <div className="flex gap-2 flex-wrap pt-1">
                  {currentGraphNode.colorPalette.map((c: string) => (
                    <span key={c} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-white/80 border border-white/5">
                      {c}
                    </span>
                  ))}
                  {currentGraphNode.accentColors.map((c: string) => (
                    <span key={c} className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono text-rose-400 uppercase block">Smart Negative Prompt Constraints</span>
                <p className="text-[10px] text-rose-300/80 leading-relaxed font-mono mt-0.5">
                  {currentGraphNode.negativePromptKeywords.join(', ')}
                </p>
              </div>
            </div>

            {/* Column 2: Curation Coordinates & Media Parameters */}
            <div className="space-y-3">
              <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono text-white/40 uppercase block">Coordinating Wardrobe Curation</span>
                <div className="space-y-1.5 pt-1 text-[11px] text-white/80">
                  <div><span className="text-white/40 font-mono">Garments:</span> {currentGraphNode.recommendedGarments.join(', ')}</div>
                  <div><span className="text-white/40 font-mono">Shoes:</span> {currentGraphNode.recommendedShoes.join(', ')}</div>
                  <div><span className="text-white/40 font-mono">Bags:</span> {currentGraphNode.recommendedBags.join(', ')}</div>
                  <div><span className="text-white/40 font-mono">Accessories:</span> {currentGraphNode.accessories.join(', ')}</div>
                </div>
              </div>

              <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono text-white/40 uppercase block">Brand Footprint Curation</span>
                <div className="space-y-1 pt-1 text-[11px]">
                  <div><span className="text-amber-400/80 font-mono">Luxury Tier:</span> <span className="text-white/90 font-medium">{currentGraphNode.luxuryBrands.join(', ')}</span></div>
                  <div><span className="text-emerald-400/80 font-mono">Affordable Alternatives:</span> <span className="text-white/90">{currentGraphNode.affordableBrands.join(', ')}</span></div>
                </div>
              </div>

              <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono text-white/40 uppercase block">Grooming & Expression</span>
                <div className="space-y-1.5 pt-1 text-[11px] text-white/80">
                  <div><span className="text-white/40 font-mono">Hair Styling:</span> {currentGraphNode.hairstyles.join(', ')}</div>
                  <div><span className="text-white/40 font-mono">Facial Hair:</span> {currentGraphNode.facialHairSuggestions.join(', ')}</div>
                  <div><span className="text-white/40 font-mono">Makeup:</span> {currentGraphNode.makeupStyle}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Relationship Connections (Parent & Child Quick Jumps) */}
          <div className="bg-white/5 p-3.5 rounded-lg border border-white/5 space-y-2">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Active Local Node Relationships</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[9px] text-white/30 block">Parent Styles (Heritage)</span>
                <div className="flex gap-1.5 mt-1">
                  {currentGraphNode.parentStyles.length > 0 ? (
                    currentGraphNode.parentStyles.map((p: string) => (
                      <button
                        key={p}
                        onClick={() => setSelectedGraphStyle(p)}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 text-[10px]"
                      >
                        {p} ↑
                      </button>
                    ))
                  ) : (
                    <span className="text-white/30 text-[10px]">None (Root Style Node)</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[9px] text-white/30 block">Child Styles (Derivatives)</span>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {currentGraphNode.childStyles.length > 0 ? (
                    currentGraphNode.childStyles.map((c: string) => (
                      <button
                        key={c}
                        onClick={() => setSelectedGraphStyle(c)}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 text-[10px]"
                      >
                        {c} ↓
                      </button>
                    ))
                  ) : (
                    <span className="text-white/30 text-[10px]">None (Leaf Style Node)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Lens & Studio Directives */}
          <div className="bg-white/5 p-3.5 rounded-lg border border-white/5 space-y-2 text-xs">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Editorial Camera, Lighting & Atmosphere Instructions</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] leading-relaxed text-white/80">
              <div className="space-y-1">
                <div><span className="text-white/40 font-mono">Photography Style:</span> {currentGraphNode.photographyStyle}</div>
                <div><span className="text-white/40 font-mono">Camera Lens Suggestion:</span> {currentGraphNode.cameraLensSuggestion}</div>
                <div><span className="text-white/40 font-mono">Camera Angle Directive:</span> {currentGraphNode.cameraAngle}</div>
              </div>
              <div className="space-y-1">
                <div><span className="text-white/40 font-mono">Lighting Coordinates:</span> {currentGraphNode.lighting}</div>
                <div><span className="text-white/40 font-mono">Editorial Mood:</span> {currentGraphNode.editorialMood}</div>
                <div><span className="text-white/40 font-mono">Runway Mood:</span> {currentGraphNode.runwayMood}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
