/**
 * ARIA v2.5 Capsule Wardrobe Planner Panel
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { Shirt, CheckCircle2, Layers, Sparkles, Tag } from 'lucide-react';
import { CapsuleItem } from '../../aria/creative/CreativeTypes';

interface CapsulePlannerProps {
  items: CapsuleItem[];
  className?: string;
}

export const CapsulePlanner: React.FC<CapsulePlannerProps> = ({
  items,
  className = ''
}) => {
  return (
    <div className={`space-y-3 text-left ${className}`}>
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Modular Capsule Wardrobe Architecture ({items.length} Pieces)
        </h5>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          High Synergy Matrix
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <h6 className="text-xs font-mono font-bold text-white truncate">
                  {item.name}
                </h6>
              </div>
              <span className="text-[10px] font-mono text-indigo-300 font-bold shrink-0 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                {Math.round(item.versatilityScore * 100)}% Versatile
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <span className="bg-white/5 px-2 py-0.5 rounded text-zinc-300">{item.category}</span>
              <span>•</span>
              <span className="text-zinc-300">{item.color}</span>
              <span>•</span>
              <span className="text-zinc-400">{item.material}</span>
            </div>

            {item.pairings && item.pairings.length > 0 && (
              <div className="pt-1 text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="truncate">Pairs with: {item.pairings.join(', ')}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
