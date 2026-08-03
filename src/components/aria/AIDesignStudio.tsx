/**
 * ARIA v2.5 AI Design Studio
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Send, 
  Palette, 
  Layers, 
  History, 
  Compass, 
  SlidersHorizontal,
  Shirt,
  Calendar,
  Check
} from 'lucide-react';
import { useARIAContext } from '../../aria/core/ARIAContext';
import { CreativeConceptCard } from './CreativeConceptCard';
import { CreativeHistoryTimeline } from './CreativeHistoryTimeline';
import { CreativeCategory, CreativeConcept, CreativeQueryRequest } from '../../aria/creative/CreativeTypes';

interface AIDesignStudioProps {
  className?: string;
}

export const AIDesignStudio: React.FC<AIDesignStudioProps> = ({
  className = ''
}) => {
  const { 
    creativeHistory, 
    generateCreativeConcept, 
    deleteCreativeConcept, 
    creativeStatus,
    styleDNAProfile,
    memories,
    decisionHistory
  } = useARIAContext();

  const [activeTab, setActiveTab] = useState<'NEW_STUDIO' | 'HISTORY'>('NEW_STUDIO');

  // Input States
  const [selectedCategory, setSelectedCategory] = useState<CreativeCategory>('CAPSULE_WARDROBE');
  const [themePrompt, setThemePrompt] = useState('');
  const [targetSeason, setTargetSeason] = useState('');
  const [desiredPieceCount, setDesiredPieceCount] = useState<number>(8);

  const [activeConcept, setActiveConcept] = useState<CreativeConcept | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: CreativeQueryRequest = {
        category: selectedCategory,
        themePrompt: themePrompt.trim() || undefined,
        targetSeason: targetSeason.trim() || undefined,
        desiredPieceCount
      };

      const result = await generateCreativeConcept(payload);
      setActiveConcept(result);
    } catch (err) {
      console.error('[AIDesignStudio] Error synthesizing creative concept:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-[#05050a] border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 border border-purple-400 text-white shadow-lg shrink-0">
              <Wand2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  ARIA v2.5 Creative Intelligence Engine
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold text-white uppercase tracking-wider mt-1">
                AI Design Studio
              </h2>
              <p className="text-xs text-zinc-400 font-serif italic mt-0.5">
                Synthesizing Memory ({memories.length}) + Style DNA ({styleDNAProfile?.identityName || 'Active'}) + Decision Engine ({decisionHistory.length}) into sartorial creativity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('NEW_STUDIO')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'NEW_STUDIO'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              Design Studio
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'HISTORY'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History ({creativeHistory.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'NEW_STUDIO' ? (
        <div className="space-y-6">
          {/* Query Form */}
          <form onSubmit={handleGenerate} className="p-5 rounded-3xl bg-gradient-to-b from-[#0a0a14] to-[#05050a] border border-white/10 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 pb-2 border-b border-white/5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              Configure Creative Concept Parameters
            </h4>

            {/* Category Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Creative Output Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'CAPSULE_WARDROBE', label: 'Capsule Wardrobe' },
                  { id: 'MOOD_BOARD', label: 'Mood Board' },
                  { id: 'SEASONAL_COLLECTION', label: 'Seasonal Edit' },
                  { id: 'COLOR_STORY', label: 'Color Story' },
                ].map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as CreativeCategory)}
                    className={`p-2.5 rounded-xl border text-xs font-mono cursor-pointer transition-all text-center ${
                      selectedCategory === cat.id
                        ? 'bg-purple-500/20 text-purple-200 border-purple-500/40 font-bold shadow-md'
                        : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Theme or Sartorial Mood
                </label>
                <input
                  type="text"
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  placeholder="e.g. Architectural Tailoring, Minimalist Resort, Urban Executive"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  Target Season / Climate
                </label>
                <input
                  type="text"
                  value={targetSeason}
                  onChange={(e) => setTargetSeason(e.target.value)}
                  placeholder="e.g. Autumn / Winter, Transitional Spring, All-Season"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Piece Count:</span>
                <select
                  value={desiredPieceCount}
                  onChange={(e) => setDesiredPieceCount(Number(e.target.value))}
                  className="bg-white/10 text-white rounded px-2 py-0.5 border border-white/10 focus:outline-none"
                >
                  <option value={4} className="bg-zinc-900">4 Pieces (Essential)</option>
                  <option value={6} className="bg-zinc-900">6 Pieces (Balanced)</option>
                  <option value={8} className="bg-zinc-900">8 Pieces (Full Capsule)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || creativeStatus.isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Concept...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Synthesize Creative Concept</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Active Concept Output */}
          {activeConcept && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Active Synthesized Creative Concept
              </h4>
              <CreativeConceptCard
                concept={activeConcept}
                onDelete={(id) => {
                  deleteCreativeConcept(id);
                  setActiveConcept(null);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <CreativeHistoryTimeline
          history={creativeHistory}
          onDeleteConcept={deleteCreativeConcept}
        />
      )}
    </div>
  );
};
