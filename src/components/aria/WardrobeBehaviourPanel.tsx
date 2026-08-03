/**
 * ARIA v2.5 Wardrobe Behaviour Panel
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shirt, CheckCircle2, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { WardrobeInsight } from '../../aria/digitalTwin/DigitalTwinTypes';

interface WardrobeBehaviourPanelProps {
  insights: WardrobeInsight[];
}

export const WardrobeBehaviourPanel: React.FC<WardrobeBehaviourPanelProps> = ({ insights }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#07070c] border border-white/10 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Shirt className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-serif font-medium text-white">Wardrobe Behaviour Analysis</h3>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {insights.length} Pattern Signals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item, idx) => {
          const isGap = item.category === 'wardrobe_gaps';
          return (
            <motion.div
              key={item.insightId || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between transition-all duration-300 hover:border-violet-500/30 ${
                isGap
                  ? 'bg-gradient-to-br from-amber-950/20 via-[#0a0812] to-[#07070c] border-amber-500/20'
                  : 'bg-[#080911] border-white/5'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isGap ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {item.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span>{Math.round(item.confidence * 100)}%</span>
                  </div>
                </div>

                <h4 className="text-sm font-serif font-semibold text-white">
                  {item.title}
                </h4>

                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Evidence: {item.evidenceCount} records</span>
                <span className="truncate max-w-[120px]" title={item.source}>{item.source}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
