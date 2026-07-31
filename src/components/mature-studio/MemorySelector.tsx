import React from 'react';
import { Lock, Globe, Search, Filter, Sparkles, FolderLock } from 'lucide-react';
import { MemoryViewType, MatureFashionMode } from '../../types/matureStudio';

interface MemorySelectorProps {
  activeMemoryTab: MemoryViewType;
  onTabChange: (tab: MemoryViewType) => void;
  personalCount: number;
  communityCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFilterCategory: string;
  onCategoryFilterChange: (cat: string) => void;
  categories: string[];
}

export const MemorySelector: React.FC<MemorySelectorProps> = ({
  activeMemoryTab,
  onTabChange,
  personalCount,
  communityCount,
  searchQuery,
  onSearchChange,
  selectedFilterCategory,
  onCategoryFilterChange,
  categories
}) => {
  return (
    <div className="space-y-4">
      {/* Top Memory System Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onTabChange('personal')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
              activeMemoryTab === 'personal'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-400/30'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FolderLock className="w-4 h-4 text-violet-300" />
            <span>Personal User Memory</span>
            <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
              {personalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('community')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
              activeMemoryTab === 'community'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-300" />
            <span>Community Public Memory</span>
            <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
              {communityCount}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Default: Private Memory Lock</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search couture concepts..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <button
            type="button"
            onClick={() => onCategoryFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedFilterCategory === 'ALL'
                ? 'bg-white/15 text-white font-bold'
                : 'bg-slate-950 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryFilterChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedFilterCategory === cat
                  ? 'bg-violet-600/40 border border-violet-500 text-white font-bold'
                  : 'bg-slate-950 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
