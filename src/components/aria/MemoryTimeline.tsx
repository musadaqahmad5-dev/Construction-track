/**
 * ARIA v2.5 Memory Timeline Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Clock, 
  ArrowRight, 
  Database, 
  ShieldCheck,
  Zap,
  Bookmark
} from 'lucide-react';
import { FashionMemoryItem, MemoryLevel } from '../../aria/memory/MemoryTypes';
import { PreferenceCard } from './PreferenceCard';

interface MemoryTimelineProps {
  memories: FashionMemoryItem[];
  onDeleteMemory?: (id: string) => void;
  onConfirmMemory?: (item: FashionMemoryItem) => void;
  className?: string;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  memories,
  onDeleteMemory,
  onConfirmMemory,
  className = ''
}) => {
  const levels: Array<{ id: MemoryLevel; title: string; desc: string; icon: any; color: string }> = [
    {
      id: 'short_term',
      title: 'Short-Term Signals',
      desc: 'Transient interactions & active session queries',
      icon: Zap,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300'
    },
    {
      id: 'session',
      title: 'Session Memory',
      desc: 'Context gathered during active outfit build session',
      icon: Clock,
      color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-300'
    },
    {
      id: 'preference',
      title: 'Preference Memory',
      desc: 'Validated user likes, material and silhouette preferences',
      icon: Bookmark,
      color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-300'
    },
    {
      id: 'long_term',
      title: 'Long-Term Fashion DNA',
      desc: 'Deeply ingrained brand loyalties, corrections & core style principles',
      icon: Database,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300'
    }
  ];

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* Progression Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-[#05050a] border border-violet-500/20 shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold tracking-wider text-zinc-100 uppercase">
              Fashion Memory Pipeline Progression
            </h4>
            <p className="text-xs text-zinc-400 font-serif italic mt-0.5">
              Explicit user signals ascend from short-term context into long-term style DNA
            </p>
          </div>
        </div>
      </div>

      {/* Level Columns / Stages */}
      <div className="space-y-6 relative before:absolute before:top-4 before:bottom-4 before:left-6 before:w-0.5 before:bg-white/10">
        {levels.map((lvl) => {
          const Icon = lvl.icon;
          const levelItems = memories.filter((m) => m.level === lvl.id);

          return (
            <div key={lvl.id} className="relative pl-12">
              {/* Timeline Indicator Dot */}
              <div className={`absolute left-4 top-1 -translate-x-1/2 p-2 rounded-xl bg-gradient-to-br ${lvl.color} border shadow-lg`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Stage Title Header */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                    {lvl.title}
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-300">
                      {levelItems.length}
                    </span>
                  </h5>
                  <p className="text-[11px] font-sans text-zinc-400">
                    {lvl.desc}
                  </p>
                </div>
              </div>

              {/* Memory Cards Grid */}
              {levelItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/[0.01] border border-dashed border-white/10 text-xs font-mono text-zinc-400 italic">
                  No memories in {lvl.title.toLowerCase()} phase.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {levelItems.map((item) => (
                    <PreferenceCard
                      key={item.id}
                      item={item}
                      onDelete={onDeleteMemory}
                      onConfirm={onConfirmMemory}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
