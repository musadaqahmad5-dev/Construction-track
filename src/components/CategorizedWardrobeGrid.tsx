import React, { useState } from 'react';
import {
  Trash2,
  Tag,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  X,
  Filter,
  Check
} from 'lucide-react';

export type WardrobeCategory = 'tops' | 'outerwear' | 'bottoms' | 'footwear' | 'accessories';

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  imageUrl: string;
  wearCount: number;
  conditionRating: string;
  tags: string[];
}

interface CategorizedWardrobeGridProps {
  items?: WardrobeItem[];
  onDeleteItem?: (id: string) => void;
  onSelectOption?: (item: WardrobeItem) => void;
}

const DEFAULT_MOCK_WARDROBE: WardrobeItem[] = [
  {
    id: 'w_1',
    name: 'Midnight Italian Velvet Blazer',
    category: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    wearCount: 14,
    conditionRating: 'Pristine (9.8)',
    tags: ['Evening', 'Luxury', 'Velvet']
  },
  {
    id: 'w_2',
    name: 'Cyber Silk Asymmetric Tunic',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    wearCount: 22,
    conditionRating: 'Excellent (9.2)',
    tags: ['Silk', 'Avant-Garde', 'Fluid']
  },
  {
    id: 'w_3',
    name: 'Obsidian Wool Tailored Trousers',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    wearCount: 31,
    conditionRating: 'Good (8.5)',
    tags: ['Tailored', 'Minimalist', 'Black']
  },
  {
    id: 'w_4',
    name: 'Carbon-Fiber Trimmed Derby Boots',
    category: 'footwear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    wearCount: 18,
    conditionRating: 'Pristine (9.5)',
    tags: ['Leather', 'Technical', 'Boots']
  },
  {
    id: 'w_5',
    name: 'Architectural Geometric Ring Set',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    wearCount: 45,
    conditionRating: 'Pristine (9.9)',
    tags: ['Silver', 'Hardware', 'Accent']
  }
];

const CATEGORY_TABS: Array<{ label: string; value: 'all' | WardrobeCategory }> = [
  { label: 'All Items', value: 'all' },
  { label: 'Tops', value: 'tops' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'Footwear', value: 'footwear' },
  { label: 'Accessories', value: 'accessories' }
];

export const CategorizedWardrobeGrid: React.FC<CategorizedWardrobeGridProps> = ({
  items = DEFAULT_MOCK_WARDROBE,
  onDeleteItem,
  onSelectOption
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | WardrobeCategory>('all');
  const [itemList, setItemList] = useState<WardrobeItem[]>(items);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredItems = itemList.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    setItemList((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    if (onDeleteItem) {
      onDeleteItem(pendingDeleteId);
    }
    setPendingDeleteId(null);
  };

  const pendingItem = itemList.find((item) => item.id === pendingDeleteId);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Category Navigation Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mr-1 shrink-0">
          <Filter className="w-4 h-4" />
        </div>
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] scale-[1.02]'
                  : 'bg-[#07070c] border border-white/5 text-zinc-400 hover:border-violet-500/20 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid Canvas */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectOption?.(item)}
              className="group relative bg-[#07070c] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              {/* Asset Frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-transparent to-transparent opacity-80" />

                {/* Category Pill Tag */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-semibold text-indigo-300">
                  {item.category}
                </span>

                {/* Trash Delete Action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingDeleteId(item.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-all opacity-0 group-hover:opacity-100"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Condition: {item.conditionRating}</p>
                </div>

                {/* Wear Log & Tags Matrix */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center space-x-1.5 text-indigo-400">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{item.wearCount} Wear Logs</span>
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-60" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 text-[10px] bg-slate-900/90 border border-white/5 text-zinc-300 px-2 py-0.5 rounded-md"
                      >
                        <Tag className="w-2.5 h-2.5 text-zinc-500" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-[#07070c] border border-white/5 rounded-2xl p-8">
          <p className="text-sm font-medium text-zinc-300">No items found in this category</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your category filter tab or add new wardrobe assets to expand your digital closet.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#07070c] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Delete Wardrobe Asset</h3>
                  <p className="text-xs text-zinc-400">Confirmation required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-semibold">{pendingItem?.name || 'this asset'}</span> from your cloud workspace? This action will remove its wear log telemetry and cognitive matching profiles.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-zinc-300 text-xs font-semibold transition-all border border-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-lg shadow-rose-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Purge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
