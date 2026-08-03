/**
 * ARIA v2.5 Garment Analysis Card
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Shirt, Tag, Layers, CheckCircle2 } from 'lucide-react';
import { DetectedGarment } from '../../aria/vision/VisionTypes';

interface GarmentAnalysisCardProps {
  garment: DetectedGarment;
  className?: string;
}

export const GarmentAnalysisCard: React.FC<GarmentAnalysisCardProps> = ({
  garment,
  className = ''
}) => {
  return (
    <div className={`p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all space-y-2 text-left ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Shirt className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">
              {garment.category}
            </span>
            <h5 className="text-xs font-mono font-bold text-white truncate">
              {garment.name}
            </h5>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          {Math.round(garment.confidence * 100)}% Match
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-zinc-300">
        <div className="bg-white/5 px-2 py-1 rounded border border-white/5">
          <span className="text-zinc-400 block text-[9px]">Color:</span>
          <span className="font-bold text-white">{garment.primaryColor}</span>
        </div>
        <div className="bg-white/5 px-2 py-1 rounded border border-white/5">
          <span className="text-zinc-400 block text-[9px]">Fabric:</span>
          <span className="font-bold text-white">{garment.fabricTexture}</span>
        </div>
        <div className="bg-white/5 px-2 py-1 rounded border border-white/5">
          <span className="text-zinc-400 block text-[9px]">Pattern:</span>
          <span className="font-bold text-white">{garment.pattern}</span>
        </div>
        <div className="bg-white/5 px-2 py-1 rounded border border-white/5">
          <span className="text-zinc-400 block text-[9px]">Fit Profile:</span>
          <span className="font-bold text-white">{garment.fitType}</span>
        </div>
      </div>
    </div>
  );
};
