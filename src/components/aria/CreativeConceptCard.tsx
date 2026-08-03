/**
 * ARIA v2.5 Creative Concept Card
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Palette, 
  Layers, 
  ThumbsUp, 
  ThumbsDown,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { CreativeConcept } from '../../aria/creative/CreativeTypes';
import { CreativeConfidenceBadge } from './CreativeConfidenceBadge';
import { CapsulePlanner } from './CapsulePlanner';
import { MoodboardPanel } from './MoodboardPanel';

interface CreativeConceptCardProps {
  concept: CreativeConcept;
  onDelete?: (id: string) => void;
  onFeedback?: (id: string, isPositive: boolean) => void;
  className?: string;
}

export const CreativeConceptCard: React.FC<CreativeConceptCardProps> = ({
  concept,
  onDelete,
  onFeedback,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<'UP' | 'DOWN' | null>(null);

  const handleFeedback = (isPositive: boolean) => {
    setFeedbackSent(isPositive ? 'UP' : 'DOWN');
    onFeedback?.(concept.creativeId, isPositive);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-3xl bg-gradient-to-b from-[#0a0a14] via-[#06060c] to-[#040408] border border-white/10 hover:border-purple-500/30 transition-all shadow-xl space-y-4 text-left ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase font-bold">
              {concept.category.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {new Date(concept.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
            {concept.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <CreativeConfidenceBadge confidence={concept.confidence} originalityScore={concept.originalityScore} size="md" />

          {onDelete && (
            <button
              onClick={() => onDelete(concept.creativeId)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-zinc-400 hover:text-rose-300 transition-all cursor-pointer"
              title="Delete Concept"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
        {concept.description}
      </p>

      {/* Color Story Pill Bar */}
      {concept.colorStory && concept.colorStory.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold shrink-0 flex items-center gap-1">
            <Palette className="w-3 h-3 text-purple-400" />
            Palette:
          </span>
          {concept.colorStory.map((col, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-200 text-[10px] font-mono shrink-0"
            >
              {col}
            </span>
          ))}
        </div>
      )}

      {/* Capsule Wardrobe Planner if present */}
      {concept.capsuleItems && concept.capsuleItems.length > 0 && (
        <CapsulePlanner items={concept.capsuleItems} />
      )}

      {/* Accordion Toggle for Deep Details & Moodboard */}
      <div className="pt-1 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-mono text-purple-300 hover:text-purple-200 flex items-center gap-1.5 cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span>Hide Moodboard & Signals</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>View Moodboard & Supporting Signals</span>
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
            title="Inspired by this concept"
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
            title="Not aligned"
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 pt-3 border-t border-white/5"
        >
          {/* Moodboard */}
          {concept.moodboardElements && concept.moodboardElements.length > 0 && (
            <MoodboardPanel
              elements={concept.moodboardElements}
              editorialHeadline={concept.editorialHeadline}
            />
          )}

          {/* Alignment Scores */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-left">
              <span className="text-[10px] font-mono text-zinc-400 block">Style DNA Align</span>
              <span className="text-xs font-mono font-bold text-purple-300 block mt-0.5">
                {Math.round(concept.styleDNAAlignment * 100)}%
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-left">
              <span className="text-[10px] font-mono text-zinc-400 block">Decision Align</span>
              <span className="text-xs font-mono font-bold text-indigo-300 block mt-0.5">
                {Math.round(concept.decisionAlignment * 100)}%
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-left">
              <span className="text-[10px] font-mono text-zinc-400 block">Memory Align</span>
              <span className="text-xs font-mono font-bold text-emerald-300 block mt-0.5">
                {Math.round(concept.memoryAlignment * 100)}%
              </span>
            </div>
          </div>

          {/* Supporting Signals */}
          <div className="space-y-1.5 text-left">
            <h6 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              Supporting Signals ({concept.supportingSignals.length})
            </h6>
            {concept.supportingSignals.map((sig) => (
              <div
                key={sig.id}
                className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2 text-xs font-mono text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="text-[11px]">{sig.signalText}</span>
                </div>
                <span className="text-[10px] font-bold text-purple-300">
                  {Math.round(sig.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
