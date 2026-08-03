/**
 * ARIA v2.5 Style Vector Card
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Scissors, 
  Shirt, 
  Box, 
  Sparkles, 
  Clock, 
  Layers, 
  UserCheck, 
  Cpu,
  Bookmark
} from 'lucide-react';
import { StyleDNAAttribute } from '../../aria/styleDNA/StyleDNATypes';
import { StyleConfidenceBadge } from './StyleConfidenceBadge';

interface StyleVectorCardProps {
  attribute: StyleDNAAttribute<string>;
  vectorType: 'color' | 'silhouette' | 'material' | 'brand' | 'lifestyle' | 'occasion';
  onAttributeClick?: (attr: StyleDNAAttribute<string>) => void;
  className?: string;
}

export const StyleVectorCard: React.FC<StyleVectorCardProps> = ({
  attribute,
  vectorType,
  onAttributeClick,
  className = ''
}) => {
  const getVectorIcon = () => {
    switch (vectorType) {
      case 'color': return <Palette className="w-4 h-4 text-violet-400" />;
      case 'silhouette': return <Scissors className="w-4 h-4 text-indigo-400" />;
      case 'material': return <Shirt className="w-4 h-4 text-emerald-400" />;
      case 'brand': return <Box className="w-4 h-4 text-amber-400" />;
      case 'lifestyle': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'occasion': return <Bookmark className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onAttributeClick?.(attribute)}
      className={`p-3.5 rounded-2xl bg-gradient-to-b from-[#0a0a14]/90 to-[#05050a]/95 border border-white/10 hover:border-violet-500/30 transition-all duration-300 shadow-md text-left cursor-pointer group ${className}`}
    >
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
            {getVectorIcon()}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
              {vectorType} Vector
            </span>
            <span className="text-xs font-mono font-semibold text-zinc-100 block truncate">
              {attribute.value}
            </span>
          </div>
        </div>

        <StyleConfidenceBadge 
          confidence={attribute.confidence} 
          evidenceCount={attribute.evidenceCount}
          showLabel={false}
        />
      </div>

      <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span className="flex items-center gap-1">
          {attribute.source === 'user_explicit' || attribute.source === 'user_correction' ? (
            <UserCheck className="w-3 h-3 text-emerald-400" />
          ) : (
            <Cpu className="w-3 h-3 text-violet-400" />
          )}
          <span className="capitalize">{attribute.source.replace('_', ' ')}</span>
        </span>

        <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
          <Layers className="w-2.5 h-2.5 text-zinc-400" />
          {attribute.evidenceCount} {attribute.evidenceCount === 1 ? 'Signal' : 'Signals'}
        </span>
      </div>
    </motion.div>
  );
};
