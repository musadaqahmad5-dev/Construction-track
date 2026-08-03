import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Brain, Sparkles, Clock, ShieldAlert, CheckCircle2, RefreshCw, Plus, Trash2, Sliders, Filter, Zap, ArrowUpRight, TrendingUp, Cpu, Calendar, ShieldCheck } from 'lucide-react';
import { PersonalFashionMemoryEngine, PersonalFashionMemory } from '../../engine/personalMemory';

interface ARIAMemoryIntelligenceProps {
  userId?: string;
  onApplyPromptToStudio?: (prompt: string) => void;
}

export const ARIAMemoryIntelligence: React.FC<ARIAMemoryIntelligenceProps> = ({
  userId = 'guest-sartorialist-user-100',
  onApplyPromptToStudio
}) => {
  const [memory, setMemory] = useState<PersonalFashionMemory>(() =>
    PersonalFashionMemoryEngine.getMemory(userId)
  );

  const [activeSubTab, setActiveSubTab] = useState<'EVOLUTION' | 'DISLIKES' | 'TIMELINE' | 'PROMPTS'>('EVOLUTION');
  
  // New Dislike Input
  const [newDislikeType, setNewDislikeType] = useState<keyof typeof memory.dislikes>('colors');
  const [newDislikeValue, setNewDislikeValue] = useState<string>('');

  // Timeline season switcher
  const [activeSeason, setActiveSeason] = useState<string>(memory.timeline.activeSeason || 'Daily casual');

  // Test accuracy simulation
  const [isSimulatingLearning, setIsSimulatingLearning] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const refreshMemoryState = () => {
    const updated = PersonalFashionMemoryEngine.getMemory(userId);
    setMemory({ ...updated });
  };

  const handleAddDislike = () => {
    if (!newDislikeValue.trim()) return;
    const valueLower = newDislikeValue.trim().toLowerCase();
    
    if (!memory.dislikes[newDislikeType].includes(valueLower)) {
      memory.dislikes[newDislikeType].push(valueLower);
      memory.learningEventsLogged += 1;
      // Re-save memory
      try {
        localStorage.setItem(`fashion_memory_${userId}`, JSON.stringify(memory));
      } catch (e) {
        console.warn('LocalStorage error saving memory');
      }
      refreshMemoryState();
      setNotification(`Added "${newDislikeValue}" to negative filter rules.`);
      setNewDislikeValue('');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRemoveDislike = (type: keyof typeof memory.dislikes, item: string) => {
    memory.dislikes[type] = memory.dislikes[type].filter(i => i !== item);
    memory.learningEventsLogged += 1;
    try {
      localStorage.setItem(`fashion_memory_${userId}`, JSON.stringify(memory));
    } catch (e) {
      console.warn('LocalStorage error saving memory');
    }
    refreshMemoryState();
    setNotification(`Removed "${item}" from negative filter rules.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChangeSeason = (season: string) => {
    setActiveSeason(season);
    memory.timeline.activeSeason = season;
    memory.learningEventsLogged += 1;
    try {
      localStorage.setItem(`fashion_memory_${userId}`, JSON.stringify(memory));
    } catch (e) {
      console.warn('LocalStorage error saving memory');
    }
    refreshMemoryState();
  };

  const handleTriggerLearningSimulation = () => {
    setIsSimulatingLearning(true);
    setTimeout(() => {
      memory.learningEventsLogged += 12;
      memory.accuracyEstimate = Math.min(99, memory.accuracyEstimate + 1.2);
      memory.apiCallsSaved += 4;
      try {
        localStorage.setItem(`fashion_memory_${userId}`, JSON.stringify(memory));
      } catch (e) {
        console.warn('LocalStorage error saving memory');
      }
      refreshMemoryState();
      setIsSimulatingLearning(false);
      setNotification('ARIA Neural Memory recalibrated with 12 new behavioral data vectors.');
      setTimeout(() => setNotification(null), 4000);
    }, 1000);
  };

  const handleResetMemory = () => {
    PersonalFashionMemoryEngine.resetMemory(userId);
    refreshMemoryState();
    setNotification('Personal Fashion Memory reset to baseline.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full space-y-6 text-zinc-100 font-sans">
      {/* Top Banner & Memory Metrics */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">ARIA Long-Term Sartorial Memory Intelligence</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                  Vector Memory Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Learns and tracks personal wardrobe evolution, style affinity vectors, seasonal preferences, and strict negative filter guardrails over time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerLearningSimulation}
              disabled={isSimulatingLearning}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isSimulatingLearning ? 'animate-spin' : ''}`} />
              <span>{isSimulatingLearning ? 'Recalibrating...' : 'Recalibrate Memory Vectors'}</span>
            </button>

            <button
              onClick={handleResetMemory}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-mono transition-all"
              title="Reset Memory to Baseline"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Intelligence Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/5">
          <div className="p-3 rounded-xl bg-white/[0.015] border border-white/5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Learning Events</span>
            <div className="text-lg font-bold font-mono text-white mt-0.5">{memory.learningEventsLogged}</div>
            <span className="text-[10px] text-indigo-400 font-mono">Logged Interactions</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.015] border border-white/5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Prediction Accuracy</span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{memory.accuracyEstimate.toFixed(1)}%</div>
            <span className="text-[10px] text-emerald-400 font-mono">Affinity Match SLA</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.015] border border-white/5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">API Overhead Saved</span>
            <div className="text-lg font-bold font-mono text-violet-400 mt-0.5">{memory.apiCallsSaved} Calls</div>
            <span className="text-[10px] text-violet-400 font-mono">Cached Reasoning</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.015] border border-white/5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Formality Preference</span>
            <div className="text-lg font-bold font-mono text-indigo-300 mt-0.5">{(memory.styleDNA.formalityPreference * 100).toFixed(0)}%</div>
            <span className="text-[10px] text-zinc-400 font-mono">{memory.styleDNA.primaryVibe}</span>
          </div>
        </div>

        {notification && (
          <div className="mt-3 text-xs text-indigo-300 font-mono bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveSubTab('EVOLUTION')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all ${
            activeSubTab === 'EVOLUTION'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Sartorial Evolution</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DISLIKES')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all ${
            activeSubTab === 'DISLIKES'
              ? 'bg-red-600/20 text-red-300 border border-red-500/40 font-bold'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>Negative Filters ({Object.values(memory.dislikes).flat().length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('TIMELINE')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all ${
            activeSubTab === 'TIMELINE'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Seasonal Timeline Context</span>
        </button>

        <button
          onClick={() => setActiveSubTab('PROMPTS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all ${
            activeSubTab === 'PROMPTS'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-bold'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Prompt Knowledge Base ({memory.promptLibrary.length})</span>
        </button>
      </div>

      {/* Sub-Tab 1: Sartorial Evolution */}
      {activeSubTab === 'EVOLUTION' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Affinity Brand & Color Vectors</span>
            </h4>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Favorite Brands</span>
              <div className="flex flex-wrap gap-1.5">
                {memory.favBrands.map((brand, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Favorite Color Palettes</span>
              <div className="flex flex-wrap gap-1.5">
                {memory.favColors.map((color, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-200 text-xs font-mono">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Preferred Garment Types</span>
              <div className="flex flex-wrap gap-1.5">
                {memory.favGarmentTypes.map((g, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" />
              <span>Style DNA Vector Ratios</span>
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-zinc-400">Formality Index</span>
                  <span className="text-indigo-400 font-bold">{(memory.styleDNA.formalityPreference * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${memory.styleDNA.formalityPreference * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-zinc-400">Experimental Index</span>
                  <span className="text-violet-400 font-bold">{(memory.styleDNA.experimentalIndex * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-violet-500 h-full rounded-full" style={{ width: `${memory.styleDNA.experimentalIndex * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Preferred Materials & Fabrics</span>
              <div className="flex flex-wrap gap-1.5">
                {memory.favMaterials.map((mat, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Dislikes & Negative Knowledge Filters */}
      {activeSubTab === 'DISLIKES' && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h4 className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Smart Negative Dislikes Library</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                ARIA strictly screens out any garments, colors, or brands matching these negative vectors.
              </p>
            </div>

            {/* Add New Dislike Controls */}
            <div className="flex items-center gap-2">
              <select
                value={newDislikeType}
                onChange={(e) => setNewDislikeType(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none"
              >
                <option value="colors">Colors</option>
                <option value="garments">Garments</option>
                <option value="materials">Materials</option>
                <option value="brands">Brands</option>
                <option value="footwear">Footwear</option>
                <option value="prints">Prints</option>
              </select>

              <input
                type="text"
                placeholder="e.g. neon yellow"
                value={newDislikeValue}
                onChange={(e) => setNewDislikeValue(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-red-500/40 w-36 sm:w-48"
              />

              <button
                onClick={handleAddDislike}
                className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(memory.dislikes) as Array<keyof typeof memory.dislikes>).map((category) => (
              <div key={category} className="bg-black/30 border border-white/5 rounded-xl p-4">
                <h5 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-[10px] text-zinc-500">{memory.dislikes[category].length} Rules</span>
                </h5>

                <div className="flex flex-wrap gap-1.5">
                  {memory.dislikes[category].map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono flex items-center gap-1.5 group"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemoveDislike(category, item)}
                        className="text-red-400/60 hover:text-red-200 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {memory.dislikes[category].length === 0 && (
                    <span className="text-[11px] font-mono text-zinc-500 italic">No negative rules set</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Seasonal Timeline Context */}
      {activeSubTab === 'TIMELINE' && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Active Seasonal & Social Context</span>
            </h4>
            <span className="text-xs font-mono text-indigo-300 font-semibold">Active: {activeSeason}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {Object.keys(memory.timeline.seasonalPreferences).map((season) => (
              <button
                key={season}
                onClick={() => handleChangeSeason(season)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  activeSeason === season
                    ? 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {season}
              </button>
            ))}
          </div>

          {memory.timeline.seasonalPreferences[activeSeason] && (
            <div className="bg-black/30 border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold font-mono text-white">
                  {activeSeason} Preferred Wardrobe Vector
                </h5>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  {memory.timeline.seasonalPreferences[activeSeason].vibe}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Seasonal Colors</span>
                  <div className="flex flex-wrap gap-1.5">
                    {memory.timeline.seasonalPreferences[activeSeason].colors.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-200 text-xs font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Key Core Garments</span>
                  <div className="flex flex-wrap gap-1.5">
                    {memory.timeline.seasonalPreferences[activeSeason].garments.map((g, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 4: Prompt Knowledge Base */}
      {activeSubTab === 'PROMPTS' && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Optimized Sartorial Prompt Library</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-500">Cached Prompt Fingerprints</span>
          </div>

          <div className="space-y-3">
            {memory.promptLibrary.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {item.styleCategory}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Success Score: {item.successScore}%
                    </span>
                    {onApplyPromptToStudio && (
                      <button
                        onClick={() => onApplyPromptToStudio(item.promptText)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center gap-1 transition-all"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/[0.03]">
                  "{item.promptText}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
