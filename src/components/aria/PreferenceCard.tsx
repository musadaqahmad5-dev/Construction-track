/**
 * ARIA v2.5 Preference Card Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  Tag, 
  UserCheck, 
  Cpu, 
  RotateCcw,
  Palette,
  Scissors,
  Shirt,
  Box,
  Heart
} from 'lucide-react';
import { FashionMemoryItem } from '../../aria/memory/MemoryTypes';

interface PreferenceCardProps {
  item: FashionMemoryItem;
  onDelete?: (id: string) => void;
  onConfirm?: (item: FashionMemoryItem) => void;
  className?: string;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({
  item,
  onDelete,
  onConfirm,
  className = ''
}) => {
  const confidencePct = Math.round(item.confidence * 100);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'color_preference': return <Palette className="w-4 h-4 text-violet-400" />;
      case 'style_preference': return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'silhouette_preference': return <Scissors className="w-4 h-4 text-purple-400" />;
      case 'material_preference': return <Shirt className="w-4 h-4 text-emerald-400" />;
      case 'brand_preference': return <Box className="w-4 h-4 text-amber-400" />;
      default: return <Heart className="w-4 h-4 text-pink-400" />;
    }
  };

  const formattedValue = typeof item.value === 'string'
    ? item.value
    : Array.isArray(item.value)
    ? item.value.join(', ')
    : JSON.stringify(item.value);

  const levelColor = 
    item.level === 'long_term' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
    item.level === 'preference' ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' :
    item.level === 'session' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
    'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative p-4 rounded-2xl bg-gradient-to-b from-[#0a0a14]/90 to-[#05050a]/95 backdrop-blur-xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group text-left ${className}`}
    >
      {/* Accent Glow Line */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
            {getCategoryIcon(item.category)}
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-wider block">
              {item.category.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 capitalize">
              {item.subcategory || 'General'}
            </span>
          </div>
        </div>

        {/* Level & Confidence Badges */}
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider ${levelColor}`}>
            {item.level.replace('_', ' ')}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-2.5 h-2.5" />
            {confidencePct}%
          </span>
        </div>
      </div>

      {/* Value Content */}
      <div className="py-3">
        <p className="text-sm font-sans font-medium text-zinc-100 leading-snug">
          {formattedValue}
        </p>
      </div>

      {/* Footer Metadata & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            {item.source === 'user_explicit' || item.source === 'correction' ? (
              <UserCheck className="w-3 h-3 text-emerald-400" />
            ) : (
              <Cpu className="w-3 h-3 text-violet-400" />
            )}
            <span className="capitalize">{item.source.replace('_', ' ')}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Clock className="w-3 h-3" />
            {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onConfirm && (
            <button
              onClick={() => onConfirm(item)}
              title="Reinforce Memory Confidence"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-violet-500/20 text-zinc-400 hover:text-violet-300 border border-transparent hover:border-violet-500/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              title="Delete Memory"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
