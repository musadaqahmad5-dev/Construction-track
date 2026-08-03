/**
 * ARIA v2.5 Memory Timeline Explorer
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock, History, Calendar, Layers } from 'lucide-react';
import { TemporalSnapshot } from '../../aria/civilization/CivilizationMemoryTypes';

interface MemoryTimelineExplorerProps {
  snapshots: TemporalSnapshot[];
}

export const MemoryTimelineExplorer: React.FC<MemoryTimelineExplorerProps> = ({ snapshots }) => {
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 text-center text-zinc-400">
        <Clock className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
        <p className="text-sm">No temporal memory snapshots recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Temporal Memory Timeline</h3>
        </div>
        <span className="text-xs text-zinc-400">{snapshots.length} Snapshots</span>
      </div>

      <div className="relative border-l border-violet-500/20 ml-3 space-y-4 py-1">
        {snapshots.map((snap, idx) => (
          <motion.div
            key={snap.snapshotId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative pl-6"
          >
            <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-violet-500 ring-4 ring-[#07070c]" />
            <div className="bg-[#05050a] border border-white/5 rounded-xl p-3 hover:border-violet-500/20 transition-all">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span className="font-semibold text-violet-300">{snap.dominantTheme}</span>
                <span className="flex items-center text-zinc-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(snap.timestamp).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-zinc-300 mt-1">{snap.evolutionSummary}</p>

              <div className="mt-2.5 flex items-center space-x-4 text-[11px] text-zinc-500 border-t border-white/5 pt-2">
                <span className="flex items-center">
                  <Layers className="w-3 h-3 mr-1 text-indigo-400" /> {snap.activeNodesCount} Nodes
                </span>
                <span>{snap.activeEdgesCount} Relationships</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
