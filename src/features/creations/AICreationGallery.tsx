import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, Lock, Globe, Eye, Sparkles, Trash2, 
  Search, SlidersHorizontal, Heart, Share2, Layers, Check, ArrowUpRight
} from 'lucide-react';
import { FashionCreation } from './CreationTypes';

interface AICreationGalleryProps {
  creations: FashionCreation[];
  onSelectCreation: (creation: FashionCreation) => void;
  onTryOnCreation: (creation: FashionCreation) => void;
  onPublishCreation: (creation: FashionCreation) => void;
  onDeleteCreation: (id: string) => void;
}

export const AICreationGallery: React.FC<AICreationGalleryProps> = ({
  creations,
  onSelectCreation,
  onTryOnCreation,
  onPublishCreation,
  onDeleteCreation
}) => {
  const [activeTab, setActiveTab] = useState<'private' | 'public'>('private');
  const [subFilter, setSubFilter] = useState<'all' | 'drafts' | 'experiments' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCreations = creations.filter((item) => {
    if (activeTab === 'public') {
      if (item.status !== 'published') return false;
    } else {
      if (item.status === 'published') return false;
      if (subFilter === 'drafts' && item.status !== 'draft') return false;
      if (subFilter === 'experiments' && item.status !== 'experiment') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchFabric = item.fabric.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchFabric) return false;
    }

    return true;
  });

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-xl text-left">
      {/* HEADER WITH MAIN TAB TOGGLE */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              AI Creation Gallery & Collections
            </h3>
            <p className="text-xs text-zinc-400">
              Private drafts, experiments & public shoppable collections
            </p>
          </div>
        </div>

        {/* PUBLIC VS PRIVATE TAB TOGGLE */}
        <div className="flex items-center p-1 bg-[#05050a] border border-white/10 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('private')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'private'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Private Atelier</span>
          </button>

          <button
            onClick={() => setActiveTab('public')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'public'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Market</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND SUBFILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {activeTab === 'private' ? (
          <div className="flex items-center gap-1.5 bg-[#05050a] p-1 border border-white/10 rounded-lg text-xs font-mono">
            {(['all', 'drafts', 'experiments', 'saved'] as const).map((sf) => (
              <button
                key={sf}
                onClick={() => setSubFilter(sf)}
                className={`px-3 py-1 rounded-md uppercase transition-all cursor-pointer ${
                  subFilter === sf 
                    ? 'bg-white/10 text-indigo-300 font-bold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {sf}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-xs text-emerald-400 font-mono">
            ● Displaying Published Creator Marketplace Collections
          </span>
        )}

        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creations..."
            className="w-full bg-[#05050a] border border-white/10 rounded-xl px-3.5 py-1.5 pl-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* CREATIONS GRID */}
      {filteredCreations.length === 0 ? (
        <div className="bg-[#05050a] border border-white/5 rounded-2xl p-12 text-center space-y-3">
          <Folder className="w-8 h-8 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Creations Found</h4>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {activeTab === 'public'
              ? 'No published collections yet. Create a design in Private Atelier and click "Publish to Market".'
              : 'No drafts matching filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCreations.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#05050a] border border-white/5 hover:border-indigo-500/30 rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.01] shadow-lg flex flex-col justify-between"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative h-56 overflow-hidden bg-black/40">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent opacity-80" />

                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#05050a]/80 text-white border border-white/10 backdrop-blur-md">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                      {item.confidenceScore}% DNA
                    </span>
                  </div>

                  {/* ACTIONS OVERLAY */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDeleteCreation(item.id)}
                      className="p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                      title="Delete creation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate">{item.fabric}</p>
                  </div>

                  {/* PALETTE */}
                  <div className="flex items-center gap-1.5">
                    {item.colorPalette.map((color, cIdx) => (
                      <div
                        key={cIdx}
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5">
                    <button
                      onClick={() => onSelectCreation(item)}
                      className="py-1.5 px-2 bg-white/5 hover:bg-white/10 text-zinc-200 text-[10px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Canvas</span>
                    </button>

                    <button
                      onClick={() => onTryOnCreation(item)}
                      className="py-1.5 px-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[10px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-indigo-500/30"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Try On</span>
                    </button>

                    <button
                      onClick={() => onPublishCreation(item)}
                      className="py-1.5 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[10px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-emerald-500/30"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Publish</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
