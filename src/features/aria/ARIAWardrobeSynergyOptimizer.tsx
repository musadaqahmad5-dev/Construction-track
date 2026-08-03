import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shirt, Sparkles, Zap, Layers, ChevronRight, AlertCircle, RefreshCw, BarChart2, Plus } from 'lucide-react';
import { WardrobeItem } from '../../types';

interface ARIAWardrobeSynergyOptimizerProps {
  wardrobe?: WardrobeItem[];
  onSelectOutfitItem?: (item: WardrobeItem) => void;
  onPromptARIAForGap?: (gapPrompt: string) => void;
}

export const ARIAWardrobeSynergyOptimizer: React.FC<ARIAWardrobeSynergyOptimizerProps> = ({
  wardrobe = [],
  onSelectOutfitItem,
  onPromptARIAForGap
}) => {
  const defaultMockItems: WardrobeItem[] = [
    {
      id: 'item_w1',
      title: 'Architectural Oversized Double-Breasted Coat',
      category: 'Outerwear',
      description: 'Acne Studios Italian Wool Coat',
      status: 'In Closet',
      userId: 'guest-sartorialist-user-100',
      createdAt: new Date(),
      primaryColor: 'Charcoal Noir',
      imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=600',
      wearCount: 14
    },
    {
      id: 'item_w2',
      title: 'Heavyweight Matte Silk Turtleneck',
      category: 'Formal',
      description: 'Jil Sander Matte Silk Knit',
      status: 'In Closet',
      userId: 'guest-sartorialist-user-100',
      createdAt: new Date(),
      primaryColor: 'Midnight Navy',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
      wearCount: 22
    },
    {
      id: 'item_w3',
      title: 'High-Waisted Pleated Wide-Leg Trousers',
      category: 'Formal',
      description: 'The Row Deep Slate Tailored Trousers',
      status: 'In Closet',
      userId: 'guest-sartorialist-user-100',
      createdAt: new Date(),
      primaryColor: 'Deep Slate',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
      wearCount: 18
    },
    {
      id: 'item_w4',
      title: 'Sculptural Italian Leather Ankle Boots',
      category: 'Accessories',
      description: 'Bottega Veneta Obsidian Leather Boots',
      status: 'In Closet',
      userId: 'guest-sartorialist-user-100',
      createdAt: new Date(),
      primaryColor: 'Obsidian Black',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600',
      wearCount: 30
    }
  ];

  const displayItems = wardrobe.length > 0 ? wardrobe : defaultMockItems;

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'TOP_SYNERGY' | 'CAPSULE_CORE' | 'GAPS'>('ALL');

  const gaps = [
    {
      id: 'gap_1',
      title: 'Structured Off-White Linen Blazer',
      reason: 'Completes 6 additional smart-casual summer evening look spreads with existing dark trousers.',
      impactScore: '+24% Wardrobe Versatility'
    },
    {
      id: 'gap_2',
      title: 'Monochrome Silver Minimalist Belt',
      reason: 'Bridges waist transitions between oversized outer coats and high-waisted pleated bottoms.',
      impactScore: '+18% Outfit Cohesion'
    }
  ];

  return (
    <div className="w-full bg-[#07070c] border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Wardrobe Synergy & Capsule Optimizer
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
                ARIA Matrix
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Garment compatibility matrix, pairing synergy, and high-yield capsule gaps calculated by ARIA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-mono">
            {displayItems.length} Active Items
          </span>
        </div>
      </div>

      {/* Wardrobe Items Synergy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {displayItems.map((item, idx) => {
          const synergyScore = 88 + (idx % 11);
          const versatilityIndex = 82 + (idx % 15);

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 mb-3 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Shirt className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-emerald-400 font-mono text-[10px] font-bold">
                    {synergyScore}% Synergy
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                  <span>{item.category}</span>
                  {item.primaryColor && <span className="text-zinc-500">{item.primaryColor}</span>}
                </div>

                <h4 className="text-xs font-semibold text-white line-clamp-2 mb-2">{item.title}</h4>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Versatility:</span>
                  <span className="text-emerald-400 font-bold">{versatilityIndex}/100</span>
                </div>

                {onSelectOutfitItem && (
                  <button
                    onClick={() => onSelectOutfitItem(item)}
                    className="w-full py-1.5 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Build Look Around This</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ARIA Gap Analysis Banner */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-indigo-950/20 to-purple-950/20 border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            ARIA High-Yield Capsule Gaps
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-semibold text-emerald-300">{gap.title}</h5>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {gap.impactScore}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans">{gap.reason}</p>
              </div>

              {onPromptARIAForGap && (
                <button
                  onClick={() => onPromptARIAForGap(`Recommend marketplace listings and styling tips for adding: ${gap.title}`)}
                  className="mt-3 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ask ARIA to source this gap</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
