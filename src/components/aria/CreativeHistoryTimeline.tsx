/**
 * ARIA v2.5 Creative History Timeline
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { History, Sparkles } from 'lucide-react';
import { CreativeConcept } from '../../aria/creative/CreativeTypes';
import { CreativeConceptCard } from './CreativeConceptCard';

interface CreativeHistoryTimelineProps {
  history: CreativeConcept[];
  onDeleteConcept?: (id: string) => void;
  className?: string;
}

export const CreativeHistoryTimeline: React.FC<CreativeHistoryTimelineProps> = ({
  history,
  onDeleteConcept,
  className = ''
}) => {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
            Creative Intelligence History ({history.length} Saved Concepts)
          </h4>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-zinc-400 space-y-2">
          <Sparkles className="w-6 h-6 text-purple-400 mx-auto opacity-50" />
          <p>No creative history recorded yet. Synthesize a fashion concept above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((concept) => (
            <CreativeConceptCard
              key={concept.creativeId}
              concept={concept}
              onDelete={onDeleteConcept}
            />
          ))}
        </div>
      )}
    </div>
  );
};
