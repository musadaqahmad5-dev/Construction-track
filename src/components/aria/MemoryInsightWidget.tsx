/**
 * ARIA v2.5 Memory Insight Widget Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Palette, 
  Scissors, 
  Shirt, 
  Box, 
  ShieldCheck, 
  Database,
  Tag
} from 'lucide-react';
import { MemoryContextSummary } from '../../aria/memory/MemoryTypes';

interface MemoryInsightWidgetProps {
  summary: MemoryContextSummary;
  onOpenMemoryManager?: () => void;
  className?: string;
}

export const MemoryInsightWidget: React.FC<MemoryInsightWidgetProps> = ({
  summary,
  onOpenMemoryManager,
  className = ''
}) => {
  const avgConfidencePct = Math.round((summary.confidenceOverview.averageConfidence || 0) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-5 rounded-2xl bg-gradient-to-b from-[#0a0a14]/90 to-[#040408]/95 backdrop-blur-2xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.6)] text-left ${className}`}
    >
      {/* Background Moon Pearl Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/20 text-violet-300">
            <Database className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
              Personal Fashion Memory DNA
            </h4>
            <p className="text-[10px] text-zinc-400 font-serif italic">
              Learned preferences from explicit user signals
            </p>
          </div>
        </div>

        {onOpenMemoryManager && (
          <button
            onClick={onOpenMemoryManager}
            className="px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/30 text-[11px] font-mono text-violet-300 hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          >
            Manage Memory
          </button>
        )}
      </div>

      {/* Top Insights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 relative z-10">
        {/* Memory Count */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
            Memory Items
          </span>
          <span className="text-sm font-mono font-bold text-zinc-100 block">
            {summary.totalMemories} Records
          </span>
        </div>

        {/* Confidence Average */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
            Avg Confidence
          </span>
          <span className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {avgConfidencePct}%
          </span>
        </div>

        {/* Top Colors */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
            <Palette className="w-3 h-3 text-violet-400" />
            Top Colors
          </span>
          <span className="text-xs font-sans text-zinc-200 truncate block">
            {summary.topColors.length > 0 ? summary.topColors.slice(0, 2).join(', ') : 'None specified'}
          </span>
        </div>

        {/* Top Silhouettes */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
            <Scissors className="w-3 h-3 text-indigo-400" />
            Silhouettes
          </span>
          <span className="text-xs font-sans text-zinc-200 truncate block">
            {summary.preferredSilhouettes.length > 0 ? summary.preferredSilhouettes.slice(0, 2).join(', ') : 'None specified'}
          </span>
        </div>
      </div>

      {/* Additional Preference Pills */}
      {(summary.topStyles.length > 0 || summary.preferredMaterials.length > 0 || summary.preferredBrands.length > 0) && (
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-1.5 relative z-10">
          {summary.topStyles.map((style, idx) => (
            <span key={`st_${idx}`} className="px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[10px] font-mono">
              Style: {style}
            </span>
          ))}
          {summary.preferredMaterials.map((mat, idx) => (
            <span key={`mat_${idx}`} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
              Material: {mat}
            </span>
          ))}
          {summary.preferredBrands.map((brand, idx) => (
            <span key={`br_${idx}`} className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono">
              Brand: {brand}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};
