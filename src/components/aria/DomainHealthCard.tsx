/**
 * ARIA v2.5 Domain Health Card
 * Product: LOOK VISION v2.4
 */

import React from 'react';
import { motion } from 'motion/react';
import { Activity, Database, CheckCircle, ShieldCheck } from 'lucide-react';
import { MemoryDomainType } from '../../aria/civilization/CivilizationMemoryTypes';

interface DomainHealthCardProps {
  domain: MemoryDomainType;
  nodeCount: number;
  lastUpdated?: string;
}

export const DomainHealthCard: React.FC<DomainHealthCardProps> = ({
  domain,
  nodeCount,
  lastUpdated
}) => {
  const getDomainLabel = (d: MemoryDomainType) => {
    switch (d) {
      case 'personal': return 'Personal Memory';
      case 'fashion': return 'Fashion DNA Memory';
      case 'creative': return 'Creative Concepts';
      case 'decision': return 'Decision Records';
      case 'simulation': return 'Simulation Reports';
      case 'visual': return 'Visual Scans';
      case 'digital_twin': return 'Digital Twin Specs';
      case 'community_metadata': return 'Community Knowledge';
      default: return d;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-[#07070c] border border-white/5 rounded-xl p-4 shadow-lg flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
            <Database className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-zinc-200">{getDomainLabel(domain)}</span>
        </div>
        <span className="inline-flex items-center text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3 mr-1" /> Isolated
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-2">
        <span className="text-2xl font-semibold text-white tracking-tight">{nodeCount}</span>
        <span className="text-xs text-zinc-500 flex items-center">
          <Activity className="w-3 h-3 mr-1 text-violet-400" /> Active
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Status: Healthy</span>
        <span className="flex items-center text-zinc-400">
          <CheckCircle className="w-3 h-3 mr-1 text-emerald-400" /> Synced
        </span>
      </div>
    </motion.div>
  );
};
