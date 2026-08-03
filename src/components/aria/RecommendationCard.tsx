/**
 * ARIA v2.5 Recommendation Card
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Shirt, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  CheckCircle, 
  Share2, 
  ThumbsUp, 
  ThumbsDown,
  Info
} from 'lucide-react';
import { FashionRecommendation } from '../../aria/decision/DecisionTypes';
import { DecisionScoreBadge } from './DecisionScoreBadge';
import { ReasonSignalsPanel } from './ReasonSignalsPanel';

interface RecommendationCardProps {
  recommendation: FashionRecommendation;
  onDelete?: (id: string) => void;
  onFeedback?: (id: string, isPositive: boolean) => void;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onDelete,
  onFeedback,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<'UP' | 'DOWN' | null>(null);

  const handleFeedback = (isPositive: boolean) => {
    setFeedbackSent(isPositive ? 'UP' : 'DOWN');
    onFeedback?.(recommendation.recommendationId, isPositive);
  };

  const rec = recommendation;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-3xl bg-gradient-to-b from-[#0a0a14] via-[#06060c] to-[#040408] border border-white/10 hover:border-violet-500/30 transition-all shadow-xl space-y-4 text-left ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 uppercase font-bold">
              {rec.category || 'Outfit Recommendation'}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {new Date(rec.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
            {rec.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <DecisionScoreBadge score={rec.overallScore} confidence={rec.confidence} size="md" />

          {onDelete && (
            <button
              onClick={() => onDelete(rec.recommendationId)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-zinc-400 hover:text-rose-300 transition-all cursor-pointer"
              title="Delete Recommendation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
        {rec.description}
      </p>

      {/* Suggested Items */}
      {rec.suggestedItems && rec.suggestedItems.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Shirt className="w-3 h-3 text-indigo-400" />
            Suggested Ensemble Pieces
          </h5>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-200">
            {rec.suggestedItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Accordion Toggle for Deep Details & Reason Signals */}
      <div className="pt-1 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-mono text-violet-300 hover:text-violet-200 flex items-center gap-1.5 cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span>Hide Decision Breakdown</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>View Decision Breakdown & Signals</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {/* Feedback buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleFeedback(true)}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
              feedbackSent === 'UP'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border-white/5'
            }`}
            title="Helpful recommendation"
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
              feedbackSent === 'DOWN'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border-white/5'
            }`}
            title="Not helpful"
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 pt-3 border-t border-white/5"
        >
          {/* Scoring Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: 'Style Match', score: rec.scoringBreakdown.styleMatch },
              { label: 'Color Match', score: rec.scoringBreakdown.colorMatch },
              { label: 'Lifestyle Match', score: rec.scoringBreakdown.lifestyleMatch },
              { label: 'Occasion Match', score: rec.scoringBreakdown.occasionMatch },
              { label: 'Preference Match', score: rec.scoringBreakdown.preferenceMatch },
              { label: 'Wardrobe Compat', score: rec.scoringBreakdown.wardrobeCompatibility },
            ].map((s, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/5 text-left">
                <span className="text-[10px] font-mono text-zinc-400 block">{s.label}</span>
                <span className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">
                  {Math.round(s.score * 100)}%
                </span>
              </div>
            ))}
          </div>

          {/* Styling Advice */}
          {rec.stylingAdvice && (
            <div className="p-3 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-xs font-mono text-violet-200 space-y-1">
              <span className="font-bold flex items-center gap-1 text-[10px] uppercase text-violet-400">
                <Info className="w-3 h-3" />
                Stylist Advice
              </span>
              <p className="font-sans text-zinc-300">{rec.stylingAdvice}</p>
            </div>
          )}

          {/* Reason Signals */}
          <ReasonSignalsPanel signals={rec.reasonSignals} evidenceCount={rec.evidenceCount} />
        </motion.div>
      )}
    </motion.div>
  );
};
