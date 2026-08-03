/**
 * ARIA v2.5 Fashion Identity Timeline
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock, GitCommit, Sparkles, ShieldCheck, Database } from 'lucide-react';
import { StyleDNASnapshot } from '../../aria/styleDNA/StyleDNATypes';

interface FashionIdentityTimelineProps {
  snapshots: StyleDNASnapshot[];
  className?: string;
}

export const FashionIdentityTimeline: React.FC<FashionIdentityTimelineProps> = ({
  snapshots,
  className = ''
}) => {
  return (
    <div className={`space-y-4 text-left ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
            Style DNA Versioning History ({snapshots.length} Snapshots)
          </h4>
        </div>
      </div>

      {snapshots.length === 0 ? (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono text-zinc-400 italic">
          No historical snapshots recorded yet.
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-4 before:w-0.5 before:bg-white/10">
          {snapshots.map((snap) => (
            <div key={snap.snapshotId} className="relative pl-9">
              <div className="absolute left-2.5 top-1.5 -translate-x-1/2 p-1 rounded-full bg-violet-600 text-white border border-violet-400">
                <GitCommit className="w-3 h-3" />
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-violet-300">
                      Version v{snap.version}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 capitalize">
                      {snap.trigger.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-[10px] text-zinc-400">
                    {new Date(snap.capturedAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs font-sans font-medium text-zinc-200">
                  Identity: <span className="text-white font-semibold">"{snap.profile.identityName}"</span>
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/5">
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    {Math.round(snap.profile.overallConfidence * 100)}% Confidence
                  </span>
                  <span>{snap.profile.totalEvidenceCount} Total Evidence Signals</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
