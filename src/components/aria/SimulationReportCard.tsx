/**
 * ARIA v2.5 Simulation Report Card
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, Sparkles, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SimulationReport } from '../../aria/simulation/SimulationTypes';
import { SimulationConfidenceBadge } from './SimulationConfidenceBadge';

interface SimulationReportCardProps {
  report: SimulationReport;
}

export const SimulationReportCard: React.FC<SimulationReportCardProps> = ({ report }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-[#07070c] via-[#0b0c16] to-[#05050a] border border-white/10 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-serif font-bold text-white tracking-wide">
              {report.scenario.title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase">
              Simulated Outcome
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            {report.scenario.description}
          </p>
        </div>

        <SimulationConfidenceBadge
          score={report.confidence}
          scenarioType={report.scenario.type}
        />
      </div>

      {/* Expected Impact Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 border border-indigo-500/20 text-indigo-100 text-sm font-serif leading-relaxed">
        {report.expectedStyleImpact}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compatibility Score */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">Wardrobe Compatibility</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-white">
              {Math.round(report.wardrobeCompatibilityScore * 100)}%
            </span>
            <span className="text-xs text-emerald-400 font-mono">High Fit</span>
          </div>
        </div>

        {/* Versatility Score */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">Outfit Versatility Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-amber-300">
              {Math.round(report.versatilityScore * 100)}%
            </span>
            <span className="text-xs text-amber-400 font-mono">Expanded</span>
          </div>
        </div>

        {/* Style DNA Alignment */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">Style DNA Effect</span>
          <p className="text-xs text-zinc-200 font-medium truncate" title={report.styleDNAEffect.silhouetteAlignment}>
            {report.styleDNAEffect.silhouetteAlignment}
          </p>
          <span className="text-[10px] text-indigo-400 font-mono">
            Delta: +{Math.round(report.styleDNAEffect.archetypeMatchDelta * 100)}%
          </span>
        </div>

        {/* Creative Synergy */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">Creative Effect</span>
          <p className="text-xs text-zinc-200 font-medium truncate" title={report.creativeEffect.aestheticSynergy}>
            {report.creativeEffect.aestheticSynergy}
          </p>
          <span className="text-[10px] text-purple-400 font-mono">
            Mood Score: {Math.round(report.creativeEffect.moodElevationScore * 100)}%
          </span>
        </div>
      </div>

      {/* Reason Signals & Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reason Signals */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <span className="text-xs font-serif font-semibold text-amber-300 uppercase tracking-wider">
            Reason Signals
          </span>
          <ul className="space-y-1.5 pt-1">
            {report.reasonSignals.map((sig, i) => (
              <li key={i} className="text-xs text-zinc-300 font-light flex items-center gap-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{sig}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supporting Grounding */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <span className="text-xs font-serif font-semibold text-indigo-300 uppercase tracking-wider">
            Supporting Grounding
          </span>
          <ul className="space-y-1.5 pt-1">
            {report.supportingEvidence.map((ev, i) => (
              <li key={i} className="text-xs text-zinc-300 font-light flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
