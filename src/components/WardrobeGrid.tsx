import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Trash2, Shield, PlusCircle, Wind } from 'lucide-react';
import { WardrobeItem, ClothingCategory } from '../types';

interface WardrobeGridProps {
  items: WardrobeItem[];
  onDelete: (item: WardrobeItem) => void;
  onSelect?: (item: WardrobeItem) => void;
  onAddTrigger?: () => void;
  categories: ClothingCategory[];
  id?: string;
}

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  items,
  onDelete,
  onSelect,
  onAddTrigger,
  categories,
  id
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');

  const filtered = items.filter(item => {
    const isCategoryMatch = selectedCategory === 'ALL' || item.category === selectedCategory;
    const isSeasonMatch = selectedSeason === 'ALL' || item.season === selectedSeason;
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    return isCategoryMatch && isSeasonMatch && matchesSearch;
  });

  return (
    <div id={id || "wardrobe-grid-container"} className="space-y-6">
      {/* Search and Filter panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            id="wardrobe-search"
            type="text"
            placeholder="Search closet items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 pl-9 pr-4 py-2 text-xs font-mono text-white/80 placeholder-white/30 rounded-lg focus:outline-none focus:border-white/15 transition-all"
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', ...categories].map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[9.5px] font-mono tracking-wider uppercase rounded-md border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.01] text-white/50 border-white/5 hover:border-white/10 hover:text-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid items layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {onAddTrigger && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border border-dashed border-white/10 hover:border-white/20 rounded-xl flex flex-col items-center justify-center p-6 text-center h-52 cursor-pointer bg-white/[0.005]/[0.1] hover:bg-white/[0.01] transition-all"
            onClick={onAddTrigger}
          >
            <PlusCircle className="w-8 h-8 text-white/20 mb-3" />
            <span className="text-xs font-mono text-white/45 tracking-wider uppercase">
              Add New Garment
            </span>
            <span className="text-[10px] font-serif text-white/25 italic mt-1">
              "Enlist look slowly."
            </span>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelect?.(item)}
                className="group relative bg-zinc-950/20 border border-white/5 hover:border-white/10 rounded-xl p-4 flex flex-col justify-between h-52 overflow-hidden transition-all duration-300 cursor-pointer"
              >
                {/* Clean soft drop shimmer */}
                <div className="absolute inset-0 bg-white/[0.002] group-hover:bg-white/[0.01] transition-all duration-300" />
                
                <div className="space-y-2 relative z-10 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.1em] block font-light">
                      {item.category}
                    </span>
                    
                    {/* Clothing Lifecyle Status Badge */}
                    <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-medium tracking-wide leading-none border ${
                      item.status === 'In Closet' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                      item.status === 'Planned' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-mono font-medium text-white truncate block">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-[10px] font-serif italic text-white/45 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Foot/Actions */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="space-y-0.5">
                    {item.season && (
                      <span className="text-[9px] font-mono text-white/30 block">
                        SEASON: <span className="text-white/60 font-light">{item.season}</span>
                      </span>
                    )}
                    {item.primaryColor && (
                      <span className="text-[9px] font-mono text-white/30 block truncate max-w-[120px]">
                        COLOR: <span className="text-white/60 font-light">{item.primaryColor}</span>
                      </span>
                    )}
                  </div>

                  <button
                    id={`btn-delete-${item.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                    className="p-1.5 bg-white/[0.02] border border-white/5 rounded-md hover:bg-red-950/30 text-white/30 hover:text-red-400 hover:border-red-900/20 cursor-pointer transition-colors relative z-20"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-2 bg-white/[0.005] border border-white/5 rounded-2xl select-none">
          <p className="text-sm font-serif italic text-white/35">
            "Your closet is empty or filtered to stillness."
          </p>
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest block font-light">
            nil matched results
          </span>
        </div>
      )}
    </div>
  );
};
