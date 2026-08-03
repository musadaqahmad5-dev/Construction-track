import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShoppingBag,
  Shirt,
  CheckCircle,
  ExternalLink,
  Zap,
  Tag,
  Award
} from 'lucide-react';
import { StylistRecommendation, StylistAction } from '../../ai/stylist';

export interface ProgressiveRecommendationRendererProps {
  recommendations: StylistRecommendation[];
  isStreaming?: boolean;
  onExecuteAction?: (action: StylistAction) => void;
}

export const ProgressiveRecommendationRenderer: React.FC<ProgressiveRecommendationRendererProps> = ({
  recommendations,
  isStreaming = false,
  onExecuteAction
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="w-full space-y-3 mt-4">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          Progressive Sartorial Recommendations ({recommendations.length})
        </h4>
        {isStreaming && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse">
            STREAMING CARDS
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <AnimatePresence>
          {recommendations.map((rec, index) => {
            const confidencePct = Math.round((rec.score || rec.itemDetails?.confidenceScore || 0.92) * 100);
            const price = rec.itemDetails?.price;
            const colorPalette: string[] | undefined = rec.itemDetails?.colorPalette;
            const action: StylistAction | undefined = rec.itemDetails?.action;

            return (
              <motion.div
                key={rec.id || `rec_${index}`}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="group relative rounded-2xl border border-white/10 bg-[#090916]/90 p-4 shadow-xl backdrop-blur-xl hover:border-indigo-500/40 hover:scale-[1.01] transition-all"
              >
                {/* Confidence Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {rec.title}
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                    <Award className="h-3 w-3" />
                    <span>{confidencePct}% MATCH</span>
                  </div>
                </div>

                {/* Garment Image Preview if available */}
                {rec.imageUrl && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-black/40 border border-white/5">
                    <img
                      src={rec.imageUrl}
                      alt={rec.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {price && (
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 font-mono text-xs font-bold text-emerald-400">
                        ${price}
                      </span>
                    )}
                  </div>
                )}

                {/* Rationale description */}
                <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-normal">
                  {rec.reasoning || rec.description}
                </p>

                {/* Color Palette Chips */}
                {colorPalette && colorPalette.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] font-mono text-zinc-500">Palette:</span>
                    <div className="flex items-center gap-1">
                      {colorPalette.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Action Button */}
                {action && (
                  <button
                    onClick={() => onExecuteAction && onExecuteAction(action)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all group-hover:shadow-lg"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>{action.label || 'View Outfit Details'}</span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
