/**
 * ARIA Visual Insight Panel Component
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Eye,
  CheckCircle2,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  Shirt,
  Scissors
} from 'lucide-react';
import { ARIAVisualInsight } from '../../features/ariaExperience/ARIAExperienceTypes';

interface ARIAVisualInsightPanelProps {
  insight: ARIAVisualInsight;
  className?: string;
}

export const ARIAVisualInsightPanel: React.FC<ARIAVisualInsightPanelProps> = ({
  insight,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#06060c] border border-indigo-500/30 rounded-2xl p-6 space-y-6 shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{insight.imageName}</h2>
            <p className="text-xs text-zinc-400">Multimodal Visual Perception Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Visual Confidence: {insight.visualConfidence}%</span>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected Garments */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Shirt className="w-4 h-4 text-violet-400" />
            Detected Garment Pieces
          </h3>
          <div className="space-y-2">
            {insight.detectedGarments.map((g, idx) => (
              <div
                key={idx}
                className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:border-violet-500/30 transition-colors"
              >
                <div>
                  <span className="text-sm font-semibold text-white block">{g.item}</span>
                  <span className="text-xs text-zinc-500 font-mono">{g.category}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-violet-950/50 text-violet-300 font-mono text-xs font-bold">
                  {g.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette & Silhouette */}
        <div className="space-y-6">
          {/* Palette */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              Extracted Color Palette
            </h3>
            <div className="flex items-center gap-2">
              {insight.dominantColors.map((hex, idx) => (
                <div key={idx} className="flex-1 space-y-1">
                  <div
                    className="h-10 rounded-lg border border-white/10 shadow-inner"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="text-[10px] font-mono text-zinc-400 block text-center">{hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Silhouette & Style Vibe */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 border border-white/5 rounded-xl p-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Silhouette</span>
              <span className="text-sm font-semibold text-indigo-300 mt-1 block">{insight.silhouette}</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Style Vibe</span>
              <span className="text-sm font-semibold text-emerald-300 mt-1 block">{insight.styleVibe}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Materials */}
      <div className="space-y-2 border-t border-white/5 pt-4">
        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Scissors className="w-4 h-4 text-purple-400" />
          Fabric Texture & Materials
        </h3>
        <div className="flex flex-wrap gap-2">
          {insight.materials.map((mat, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 font-mono"
            >
              {mat}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
