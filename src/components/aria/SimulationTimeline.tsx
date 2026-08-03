/**
 * ARIA v2.5 Simulation Timeline
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { History, Calendar, CheckCircle2 } from 'lucide-react';
import { SimulationReport } from '../../aria/simulation/SimulationTypes';

interface SimulationTimelineProps {
  history: SimulationReport[];
  onSelectReport?: (report: SimulationReport) => void;
}

export const SimulationTimeline: React.FC<SimulationTimelineProps> = ({ history, onSelectReport }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#07070c] border border-white/10 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-serif font-medium text-white">Simulation Execution History</h3>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {history.length} Past Runs
        </span>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {history.map((item, idx) => (
          <motion.div
            key={item.simulationId || idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.03 }}
            onClick={() => onSelectReport?.(item)}
            className="p-4 rounded-2xl bg-[#080911] border border-white/5 hover:border-amber-500/30 cursor-pointer transition-all duration-200 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono uppercase font-bold">
                  {item.scenario.type.replace('_', ' ')}
                </span>
                <span className="text-sm font-serif font-medium text-white">
                  {item.scenario.title}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-light truncate max-w-xl">
                {item.expectedStyleImpact}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1 text-zinc-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <span className="text-amber-300 font-bold">
                Versatility: {Math.round(item.versatilityScore * 100)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
