/**
 * ARIA v2.5 Outfit Analysis Panel
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Layers, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { VisualCompatibilityResult, DetectedGarment } from '../../aria/vision/VisionTypes';
import { GarmentAnalysisCard } from './GarmentAnalysisCard';

interface OutfitAnalysisPanelProps {
  garments: DetectedGarment[];
  compatibility: VisualCompatibilityResult;
  className?: string;
}

export const OutfitAnalysisPanel: React.FC<OutfitAnalysisPanelProps> = ({
  garments,
  compatibility,
  className = ''
}) => {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-zinc-400 block">Style DNA Harmony</span>
          <span className="text-xs font-mono font-bold text-indigo-300 block mt-0.5">
            {Math.round(compatibility.styleDNAHarmonyScore * 100)}%
          </span>
        </div>
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-zinc-400 block">Color Harmony</span>
          <span className="text-xs font-mono font-bold text-purple-300 block mt-0.5">
            {Math.round(compatibility.colorHarmonyScore * 100)}%
          </span>
        </div>
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-zinc-400 block">Proportions</span>
          <span className="text-xs font-mono font-bold text-pink-300 block mt-0.5">
            {Math.round(compatibility.proportionalBalanceScore * 100)}%
          </span>
        </div>
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-zinc-400 block">Completeness</span>
          <span className="text-xs font-mono font-bold text-emerald-300 block mt-0.5">
            {Math.round(compatibility.outfitCompletenessScore * 100)}%
          </span>
        </div>
      </div>

      {/* Detected Garments List */}
      <div className="space-y-2">
        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          Detected Garments ({garments.length} Layers)
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {garments.map((garm) => (
            <GarmentAnalysisCard key={garm.id} garment={garm} />
          ))}
        </div>
      </div>

      {/* Compatibility Notes */}
      <div className="space-y-1.5">
        <h6 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
          Visual Compatibility Notes
        </h6>
        {compatibility.compatibilityNotes.map((note, idx) => (
          <div key={idx} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 text-xs font-mono text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
