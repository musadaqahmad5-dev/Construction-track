/**
 * ARIA v2.5 Vision History Timeline
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { History, Eye, Trash2, Calendar, Sparkles } from 'lucide-react';
import { VisionAnalysisResult } from '../../aria/vision/VisionTypes';
import { CompatibilityBadge } from './CompatibilityBadge';
import { ColorPaletteWidget } from './ColorPaletteWidget';
import { OutfitAnalysisPanel } from './OutfitAnalysisPanel';

interface VisionHistoryTimelineProps {
  history: VisionAnalysisResult[];
  onDeleteAnalysis?: (id: string) => void;
  className?: string;
}

export const VisionHistoryTimeline: React.FC<VisionHistoryTimelineProps> = ({
  history,
  onDeleteAnalysis,
  className = ''
}) => {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
            Visual Intelligence History ({history.length} Analysis Records)
          </h4>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-zinc-400 space-y-2">
          <Eye className="w-6 h-6 text-indigo-400 mx-auto opacity-50" />
          <p>No visual analyses recorded yet. Upload a fashion garment or outfit image above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.analysisId}
              className="p-5 rounded-3xl bg-gradient-to-b from-[#0a0a14] via-[#06060c] to-[#040408] border border-white/10 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  {record.imageUrl && (
                    <img
                      src={record.imageUrl}
                      alt={record.imageName}
                      className="w-12 h-14 object-cover rounded-xl border border-white/10 shrink-0"
                    />
                  )}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                    <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      {record.imageName}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <CompatibilityBadge score={record.compatibility.overallCompatibilityScore} size="md" />

                  {onDeleteAnalysis && (
                    <button
                      onClick={() => onDeleteAnalysis(record.analysisId)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-zinc-400 hover:text-rose-300 transition-all cursor-pointer"
                      title="Delete Analysis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Color Palette */}
              {record.colorPalette && record.colorPalette.length > 0 && (
                <ColorPaletteWidget palette={record.colorPalette} />
              )}

              {/* Outfit Panel */}
              <OutfitAnalysisPanel
                garments={record.garments}
                compatibility={record.compatibility}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
