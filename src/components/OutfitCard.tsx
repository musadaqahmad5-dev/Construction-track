import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { WardrobeItem } from '../types';
import { StyleBadge } from './StyleBadge';
import { FeedbackButtons } from './FeedbackButtons';

interface OutfitCardProps {
  outfit: {
    id: string;
    name: string;
    items: WardrobeItem[];
    suitabilityScore?: number;
    score?: number; // fallback synonym
    explanation?: string;
    reason?: string; // fallback synonym
    styleIdentity?: string;
    gravityMatch?: 'High' | 'Medium' | 'Low' | string;
    vibeTags?: string[];
  };
  onWear: () => void;
  onSkip: () => void;
  onModify?: () => void;
  id?: string;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onWear, onSkip, onModify, id }) => {
  const finalScore = outfit.suitabilityScore ?? outfit.score ?? 85;
  const finalReason = outfit.explanation ?? outfit.reason ?? 'A clean architectural outfit curated for standard quiet living.';
  
  return (
    <div
      id={id || `outfit-card-${outfit.id}`}
      className="p-6 bg-zinc-950/40 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-6 hover:border-white/10 transition-all duration-300"
    >
      {/* Decorative gradient back-glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Section */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-[10px] font-mono text-white/35">
          <span className="uppercase tracking-[0.2em] font-light">SUGGESTION FEED</span>
          
          <div className="flex items-center gap-2">
            {outfit.gravityMatch && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5 text-[9px] font-light">
                GRAVITY: <span className="text-white/80 font-medium">{outfit.gravityMatch}</span>
              </span>
            )}
            <span className="font-semibold text-white/80">{finalScore}% MATCH</span>
          </div>
        </div>

        <h3 className="font-serif font-light text-xl text-white tracking-tight leading-tight">
          {outfit.name}
        </h3>
        
        {outfit.styleIdentity && (
          <div className="pt-1 select-none">
            <span className="text-[10px] uppercase font-mono bg-white/[0.04] text-white/70 px-2 py-0.5 rounded border border-white/5">
              {outfit.styleIdentity}
            </span>
          </div>
        )}
      </div>

      {/* Wardrobe Items Grid */}
      <div className="space-y-3 relative z-10">
        <span className="text-[9.5px] font-mono text-white/30 tracking-[0.15em] uppercase block font-light">
          INCLUDED HARMONICS
        </span>
        
        {outfit.items && outfit.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-2.5">
            {outfit.items.map((item, idx) => (
              <div 
                key={item.id || idx}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-cover rounded bg-zinc-900" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-white/[0.03] border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/30">
                    NIL
                  </div>
                )}
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-white/85 truncate block">
                      {item.title}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 ml-1 flex-shrink-0">
                      {item.category}
                    </span>
                  </div>
                  {item.description && (
                    <span className="text-[10px] font-serif italic text-white/45 line-clamp-1 block">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs font-mono text-white/35 italic select-none">
            Unified fallback coordinate. Upload custom wardrobe items to trigger dynamic combinations.
          </p>
        )}
      </div>

      {/* Styled explanation & Stylist notes */}
      <div className="space-y-2 border-t border-white/5 pt-4">
        <span className="text-[9.5px] font-mono text-white/30 tracking-[0.15em] uppercase block font-light">
          STYLIST OBSERVATION
        </span>
        <p className="text-[11px] font-serif italic text-white/60 leading-relaxed font-light">
          "{finalReason}"
        </p>
      </div>

      {/* Action Decision Buttons */}
      <div className="pt-2 border-t border-white/5">
        <FeedbackButtons 
          onWear={onWear}
          onSkip={onSkip}
          onModify={onModify}
        />
      </div>
    </div>
  );
};
