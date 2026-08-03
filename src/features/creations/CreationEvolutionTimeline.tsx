import React from 'react';
import { motion } from 'motion/react';
import { 
  GitCommit, Clock, Layers, Sparkles, Check, ArrowDown, 
  RotateCcw, Sliders, Palette
} from 'lucide-react';
import { CreationVersion } from './CreationTypes';

interface CreationEvolutionTimelineProps {
  versions: CreationVersion[];
  activeVersionId?: string;
  onRestoreVersion?: (version: CreationVersion) => void;
}

export const CreationEvolutionTimeline: React.FC<CreationEvolutionTimelineProps> = ({
  versions,
  activeVersionId,
  onRestoreVersion
}) => {
  if (!versions || versions.length === 0) {
    return (
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 text-center space-y-2">
        <GitCommit className="w-6 h-6 text-zinc-500 mx-auto" />
        <h4 className="text-xs font-bold text-white">Creation Evolution Timeline Empty</h4>
        <p className="text-[11px] text-zinc-400">
          Modify fabric, silhouette or color in the Canvas to establish version snapshots.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-xl text-left">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Creation Evolution Timeline
            </h3>
            <p className="text-xs text-zinc-400">
              Complete historical record of fabric, drape & parameter iterations
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
          {versions.length} Version Snapshots
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-500/20">
        {versions.map((ver, idx) => {
          const isActive = ver.id === activeVersionId || idx === versions.length - 1;

          return (
            <motion.div
              key={ver.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative p-4 rounded-xl border transition-all ${
                isActive 
                  ? 'bg-[#05050a] border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'bg-[#05050a]/50 border-white/5 hover:border-white/10'
              }`}
            >
              {/* TIMELINE NODE DOT */}
              <div className={`absolute -left-[31px] top-4 w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/50' 
                  : 'bg-zinc-800 border-zinc-600 text-zinc-400'
              }`}>
                {ver.versionNumber}
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">
                    Version {ver.versionNumber}.0
                  </span>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      CURRENT ITERATION
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{ver.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-medium mb-2">{ver.feedback}</p>

              {/* LIST OF CHANGES */}
              {ver.changes && ver.changes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {ver.changes.map((c, cIdx) => (
                    <span key={cIdx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-zinc-400">
                      • {c}
                    </span>
                  ))}
                </div>
              )}

              {/* PARAMETERS SUMMARY */}
              {ver.parameters && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 rounded-lg bg-white/5 text-[10px] font-mono text-zinc-400 border border-white/5">
                  {ver.parameters.fabric && <div>Fabric: <span className="text-zinc-200">{ver.parameters.fabric}</span></div>}
                  {ver.parameters.silhouette && <div>Silhouette: <span className="text-zinc-200">{ver.parameters.silhouette}</span></div>}
                  {ver.parameters.luxuryIntensity !== undefined && <div>Luxury: <span className="text-amber-400 font-bold">{ver.parameters.luxuryIntensity}%</span></div>}
                </div>
              )}

              {onRestoreVersion && !isActive && (
                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => onRestoreVersion(ver)}
                    className="px-2.5 py-1 bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/30 text-[11px] font-semibold text-zinc-300 hover:text-indigo-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Version {ver.versionNumber}</span>
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
