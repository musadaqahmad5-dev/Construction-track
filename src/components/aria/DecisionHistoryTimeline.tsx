/**
 * ARIA v2.5 Decision History Timeline
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Clock, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import { FashionRecommendation } from '../../aria/decision/DecisionTypes';
import { RecommendationCard } from './RecommendationCard';

interface DecisionHistoryTimelineProps {
  history: FashionRecommendation[];
  onDeleteRecommendation?: (id: string) => void;
  className?: string;
}

export const DecisionHistoryTimeline: React.FC<DecisionHistoryTimelineProps> = ({
  history,
  onDeleteRecommendation,
  className = ''
}) => {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
            Decision Intelligence History ({history.length} Saved)
          </h4>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-zinc-400 space-y-2">
          <Sparkles className="w-6 h-6 text-violet-400 mx-auto opacity-50" />
          <p>No decision history recorded yet. Request a stylist recommendation above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((rec) => (
            <RecommendationCard
              key={rec.recommendationId}
              recommendation={rec}
              onDelete={onDeleteRecommendation}
            />
          ))}
        </div>
      )}
    </div>
  );
};
