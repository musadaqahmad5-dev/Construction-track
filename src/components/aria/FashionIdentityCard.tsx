/**
 * ARIA v2.5 Fashion Identity Card
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Cpu, Layers, Palette } from 'lucide-react';
import { DigitalTwinModel } from '../../aria/digitalTwin/DigitalTwinTypes';
import { TwinConfidenceBadge } from './TwinConfidenceBadge';

interface FashionIdentityCardProps {
  twin: DigitalTwinModel;
}

export const FashionIdentityCard: React.FC<FashionIdentityCardProps> = ({ twin }) => {
  const { identitySummary, currentStyleState } = twin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-[#07070c] via-[#0b0c16] to-[#05050a] border border-white/10 shadow-2xl relative overflow-hidden group space-y-6"
    >
      {/* Background Moon Pearl Glow overlay */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-500" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 shadow-inner">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                {identitySummary.archetypeTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono uppercase font-bold">
                Active Twin
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Digital Fashion Intelligence Avatar
            </p>
          </div>
        </div>

        <TwinConfidenceBadge
          score={currentStyleState.confidence}
          level={identitySummary.styleMaturityLevel}
        />
      </div>

      {/* Summary Description */}
      <p className="text-sm text-zinc-300 font-light leading-relaxed">
        {identitySummary.description}
      </p>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Signature Palette */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Signature Palette</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            {identitySummary.signatureColors.map((hex, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-lg border border-white/20 shadow-md transform hover:scale-110 transition-transform"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>

        {/* Primary Silhouette */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Primary Silhouette</span>
          </div>
          <p className="text-sm font-medium text-white pt-1">
            {identitySummary.primarySilhouette}
          </p>
        </div>

        {/* Style Maturity */}
        <div className="p-4 rounded-2xl bg-[#080911] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Style Maturity Index</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.round(identitySummary.styleMaturityScore * 100)}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              {Math.round(identitySummary.styleMaturityScore * 100)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
