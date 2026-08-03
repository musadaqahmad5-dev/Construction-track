import React from 'react';
import { Sparkles, Sliders, Layers, Bookmark, ArrowUpRight, Zap, Palette, User } from 'lucide-react';
import { MemoryStatusBadge } from './MemoryStatusBadge';
import { AIStatusPanel } from './AIStatusPanel';
import { StylistRecommendation, StylistAction } from '../../ai/stylist';

export interface ContextSidebarProps {
  styleDNA: Record<string, any>;
  messageCount: number;
  sessionActive: boolean;
  recommendations: StylistRecommendation[];
  onExecuteAction?: (action: StylistAction) => void;
}

export const ContextSidebar: React.FC<ContextSidebarProps> = ({
  styleDNA,
  messageCount,
  sessionActive,
  recommendations,
  onExecuteAction
}) => {
  return (
    <aside className="w-full h-full flex flex-col gap-4 overflow-y-auto pr-1">
      {/* Style DNA Card */}
      <div className="rounded-xl border border-white/10 bg-[#0a0a12]/80 p-4 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Style DNA Profile
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {styleDNA.primaryVibe || 'Quiet Luxury'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-zinc-400 text-[11px]">Archetype</span>
            <span className="text-zinc-100 font-semibold">{styleDNA.archetype || 'Modern Minimalist'}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-zinc-400 text-[11px]">Fit Preference</span>
            <span className="text-zinc-100 font-semibold">{styleDNA.fitPreference || 'Tailored Precision'}</span>
          </div>

          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1">
                <Palette className="h-3 w-3 text-amber-400" />
                Color Palette
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {(styleDNA.colorPalette || ['#05050a', '#ffffff', '#6366f1', '#374151']).map(
                (color: string, cIdx: number) => (
                  <div
                    key={cIdx}
                    className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                )
              )}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span>Risk Tolerance</span>
              <span className="font-mono text-indigo-400">{Math.round((styleDNA.riskTolerance || 0.75) * 100)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full"
                style={{ width: `${(styleDNA.riskTolerance || 0.75) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Memory Status Badge */}
      <MemoryStatusBadge
        styleDNA={styleDNA}
        messageCount={messageCount}
        sessionActive={sessionActive}
      />

      {/* AI Neural Status Panel */}
      <AIStatusPanel />

      {/* Recent Recommendations Feed */}
      {recommendations && recommendations.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-[#0a0a12]/80 p-4 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Recent Curations
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {recommendations.length} Active
            </span>
          </div>

          <div className="space-y-2">
            {recommendations.slice(0, 3).map((rec, rIdx) => (
              <div
                key={rec.id || rIdx}
                className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-colors cursor-pointer"
                onClick={() =>
                  onExecuteAction?.({
                    id: `act_rec_sidebar_${rec.id}`,
                    type: 'SAVE_OUTFIT',
                    label: rec.title,
                    payload: { recommendation: rec }
                  })
                }
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono uppercase text-indigo-400 font-semibold">
                    {rec.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {rec.score}% Match
                  </span>
                </div>
                <h5 className="text-xs font-medium text-zinc-200 truncate">{rec.title}</h5>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
