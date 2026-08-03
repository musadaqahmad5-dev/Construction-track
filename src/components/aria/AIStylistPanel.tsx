/**
 * ARIA v2.5 AI Stylist Panel
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Shirt, 
  Calendar, 
  CloudSun, 
  Check, 
  SlidersHorizontal,
  History,
  Dna,
  ShieldCheck
} from 'lucide-react';
import { useARIAContext } from '../../aria/core/ARIAContext';
import { RecommendationCard } from './RecommendationCard';
import { DecisionHistoryTimeline } from './DecisionHistoryTimeline';
import { DecisionQueryRequest, FashionRecommendation } from '../../aria/decision/DecisionTypes';

interface AIStylistPanelProps {
  className?: string;
}

export const AIStylistPanel: React.FC<AIStylistPanelProps> = ({
  className = ''
}) => {
  const { 
    decisionHistory, 
    generateRecommendation, 
    deleteRecommendation, 
    decisionStatus,
    styleDNAProfile,
    memories
  } = useARIAContext();

  const [activeTab, setActiveTab] = useState<'NEW_RECOMMENDATION' | 'HISTORY'>('NEW_RECOMMENDATION');

  // Input states
  const [occasion, setOccasion] = useState('');
  const [weatherContext, setWeatherContext] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [activeRecommendation, setActiveRecommendation] = useState<FashionRecommendation | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: DecisionQueryRequest = {
        occasion: occasion.trim() || undefined,
        weatherContext: weatherContext.trim() || undefined,
        userPrompt: userPrompt.trim() || undefined
      };

      const result = await generateRecommendation(payload);
      setActiveRecommendation(result);
    } catch (err) {
      console.error('[AIStylistPanel] Error generating recommendation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-[#05050a] border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400 text-white shadow-lg shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                  ARIA v2.5 Decision Intelligence
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold text-white uppercase tracking-wider mt-1">
                Personalized AI Stylist
              </h2>
              <p className="text-xs text-zinc-400 font-serif italic mt-0.5">
                Synthesizing {memories.length} memories & Style DNA ({styleDNAProfile?.identityName || 'Active Identity'}) into precision sartorial decisions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('NEW_RECOMMENDATION')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'NEW_RECOMMENDATION'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              New Recommendation
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'HISTORY'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History ({decisionHistory.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'NEW_RECOMMENDATION' ? (
        <div className="space-y-6">
          {/* Query Form */}
          <form onSubmit={handleGenerate} className="p-5 rounded-3xl bg-gradient-to-b from-[#0a0a14] to-[#05050a] border border-white/10 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 pb-2 border-b border-white/5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              Configure Occasion & Context Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  Target Occasion
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g. Gallery Opening, Executive Briefing, Casual Dinner"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <CloudSun className="w-3 h-3 text-amber-400" />
                  Weather & Atmosphere Context
                </label>
                <input
                  type="text"
                  value={weatherContext}
                  onChange={(e) => setWeatherContext(e.target.value)}
                  placeholder="e.g. Crisp Autumn Afternoon 15°C, Warm Summer Evening"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-400" />
                Styling Prompt / Specific Guidance
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g. Recommend an outfit anchored in my charcoal Virgin Wool blazer preference, suitable for an evening dinner."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <Dna className="w-3.5 h-3.5 text-violet-400" />
                <span>Auto-syncing with active Style DNA (v{styleDNAProfile?.version || 1})</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || decisionStatus.isProcessing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Decision...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate Sartorial Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Active Generated Recommendation */}
          {activeRecommendation && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Active Precision Recommendation
              </h4>
              <RecommendationCard
                recommendation={activeRecommendation}
                onDelete={(id) => {
                  deleteRecommendation(id);
                  setActiveRecommendation(null);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <DecisionHistoryTimeline
          history={decisionHistory}
          onDeleteRecommendation={deleteRecommendation}
        />
      )}
    </div>
  );
};
