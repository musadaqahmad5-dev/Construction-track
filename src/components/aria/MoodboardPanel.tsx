/**
 * ARIA v2.5 Moodboard Panel
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Palette, Eye, Sparkles, BookOpen } from 'lucide-react';
import { MoodboardElement } from '../../aria/creative/CreativeTypes';

interface MoodboardPanelProps {
  elements: MoodboardElement[];
  editorialHeadline?: string;
  className?: string;
}

export const MoodboardPanel: React.FC<MoodboardPanelProps> = ({
  elements,
  editorialHeadline,
  className = ''
}) => {
  return (
    <div className={`space-y-3 text-left ${className}`}>
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          Tactile & Chromatic Moodboard Matrix
        </h5>
      </div>

      {editorialHeadline && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 text-xs font-serif italic text-purple-200">
          "{editorialHeadline}"
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {elements.map((elem) => (
          <div
            key={elem.id}
            className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all space-y-1 text-left"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                {elem.title}
              </span>
              {elem.accentColor && (
                <span
                  className="w-3 h-3 rounded-full border border-white/20 inline-block shrink-0"
                  style={{ backgroundColor: elem.accentColor }}
                />
              )}
            </div>
            <p className="text-xs font-mono font-bold text-white leading-tight">
              {elem.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
