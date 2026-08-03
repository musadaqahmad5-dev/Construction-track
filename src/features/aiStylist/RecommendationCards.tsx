import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shirt, ShoppingBag, Eye, Bookmark, ArrowUpRight, Zap } from 'lucide-react';
import { StylistRecommendation, StylistAction } from '../../ai/stylist';

export interface RecommendationCardsProps {
  recommendations: StylistRecommendation[];
  onExecuteAction?: (action: StylistAction) => void;
  onSelectRecommendation?: (rec: StylistRecommendation) => void;
}

export const RecommendationCards: React.FC<RecommendationCardsProps> = ({
  recommendations,
  onExecuteAction,
  onSelectRecommendation
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-4 my-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Curated Stylist Recommendations
        </h4>
        <span className="text-[10px] font-mono text-zinc-400">
          {recommendations.length} Option{recommendations.length > 1 ? 's' : ''} Generated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={rec.id || idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#090912]/90 p-4 transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="inline-block text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-1">
                    {rec.category || 'Outfit'}
                  </span>
                  <h5 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {rec.title}
                  </h5>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-semibold text-emerald-400">
                  <Zap className="h-3 w-3" />
                  {rec.score || 95}% Match
                </div>
              </div>

              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-3">
                {rec.description}
              </p>

              {rec.reasoning && (
                <div className="p-2 rounded bg-white/[0.02] border border-white/5 mb-3 text-[11px] text-zinc-400 italic">
                  "{rec.reasoning}"
                </div>
              )}

              {rec.tags && rec.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {rec.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 grid grid-cols-4 gap-1.5">
              <button
                onClick={() =>
                  onExecuteAction?.({
                    id: `act_tryon_${rec.id}`,
                    type: 'OPEN_TRY_ON',
                    label: 'Virtual Try-On',
                    payload: { recommendationId: rec.id, imageUrl: rec.imageUrl }
                  })
                }
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium transition-colors"
                title="Virtual Try-On"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Try On</span>
              </button>

              <button
                onClick={() =>
                  onExecuteAction?.({
                    id: `act_save_${rec.id}`,
                    type: 'SAVE_OUTFIT',
                    label: 'Save Look',
                    payload: { recommendation: rec }
                  })
                }
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-[11px] font-medium transition-colors"
                title="Save Outfit"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>

              <button
                onClick={() =>
                  onExecuteAction?.({
                    id: `act_gen_${rec.id}`,
                    type: 'NAVIGATE',
                    label: 'Studio',
                    payload: { view: 'studio', title: rec.title }
                  })
                }
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-[11px] font-medium transition-colors"
                title="Generate Visual Studio"
              >
                <Shirt className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Studio</span>
              </button>

              <button
                onClick={() =>
                  onExecuteAction?.({
                    id: `act_shop_${rec.id}`,
                    type: 'SEARCH_MARKETPLACE',
                    label: 'Shop Look',
                    payload: { query: rec.title }
                  })
                }
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition-colors"
                title="Shop Items"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Shop</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
