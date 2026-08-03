/**
 * ARIA v2.5 Interactive Fashion Memory Panel
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Trash2, 
  X, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Palette,
  Scissors,
  Shirt,
  Box,
  Heart,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { useARIAContext } from '../../aria/core/ARIAContext';
import { FashionMemoryCategory, FashionMemoryItem, MemoryLevel } from '../../aria/memory/MemoryTypes';
import { PreferenceCard } from './PreferenceCard';
import { MemoryTimeline } from './MemoryTimeline';
import { MemoryInsightWidget } from './MemoryInsightWidget';

interface FashionMemoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FashionMemoryPanel: React.FC<FashionMemoryPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { memories, memorySummary, updateMemory, deleteMemory, syncMemory } = useARIAContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TIMELINE'>('CARDS');
  const [isAddingPreference, setIsAddingPreference] = useState(false);

  // Form states for adding explicit preference
  const [newCategory, setNewCategory] = useState<FashionMemoryCategory>('color_preference');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newLevel, setNewLevel] = useState<MemoryLevel>('preference');

  const categories: Array<{ id: string; label: string; icon: any }> = [
    { id: 'all', label: 'All Memory', icon: Database },
    { id: 'color_preference', label: 'Colors', icon: Palette },
    { id: 'style_preference', label: 'Styles', icon: Sparkles },
    { id: 'silhouette_preference', label: 'Silhouettes', icon: Scissors },
    { id: 'material_preference', label: 'Materials', icon: Shirt },
    { id: 'brand_preference', label: 'Brands', icon: Box },
    { id: 'user_correction', label: 'User Corrections', icon: Bookmark }
  ];

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    await updateMemory({
      category: newCategory,
      subcategory: newSubcategory.trim() || 'General',
      value: newValue.trim(),
      source: 'user_explicit',
      level: newLevel,
      confidence: 0.98
    });

    setNewValue('');
    setNewSubcategory('');
    setIsAddingPreference(false);
  };

  const filteredMemories = memories.filter((m) => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const valStr = typeof m.value === 'string' ? m.value : JSON.stringify(m.value);
      return m.category.toLowerCase().includes(q) || (m.subcategory || '').toLowerCase().includes(q) || valStr.toLowerCase().includes(q);
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-4xl h-[85vh] bg-[#05050a] border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(139,92,246,0.2)] flex flex-col text-left overflow-hidden relative"
        >
          {/* Top Pearl Glow Backdrop */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Panel Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/30 text-violet-300">
                <Database className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-mono font-bold tracking-wider text-zinc-100 uppercase">
                    Personal Fashion Memory Engine
                  </h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    ARIA v2.5
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-serif italic">
                  Look Vision Explicit Preference Storage & Context Pipeline
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => syncMemory()}
                title="Sync Memories"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer border border-white/5"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 relative z-10">
            {/* Top Insight Summary */}
            <MemoryInsightWidget summary={memorySummary} />

            {/* Filter Bar & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-violet-600/30 text-white border border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.2)] font-semibold'
                          : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* View Switcher & Add Button */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => setViewMode('CARDS')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                      viewMode === 'CARDS' ? 'bg-violet-600/30 text-violet-200 font-bold' : 'text-zinc-400'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('TIMELINE')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                      viewMode === 'TIMELINE' ? 'bg-violet-600/30 text-violet-200 font-bold' : 'text-zinc-400'
                    }`}
                  >
                    Pipeline
                  </button>
                </div>

                <button
                  onClick={() => setIsAddingPreference(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-mono font-medium text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Preference</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories by color, style, material, silhouette, or category..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/50 transition-all"
              />
            </div>

            {/* Explicit Add Modal Form overlay */}
            <AnimatePresence>
              {isAddingPreference && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl bg-gradient-to-b from-[#0e0e1a] to-[#080812] border border-violet-500/30 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase">
                        Add Explicit Fashion Preference
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsAddingPreference(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-xs font-mono text-zinc-200 outline-none focus:border-violet-500"
                      >
                        <option value="color_preference">Color Preference</option>
                        <option value="style_preference">Style Preference</option>
                        <option value="silhouette_preference">Silhouette Preference</option>
                        <option value="material_preference">Material Preference</option>
                        <option value="brand_preference">Brand Preference</option>
                        <option value="explicit_preference">Explicit Preference</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                        Subcategory / Label
                      </label>
                      <input
                        type="text"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        placeholder="e.g. Evening Wear, Footwear, Accent Color"
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-xs font-mono text-zinc-200 outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                        Preference Value
                      </label>
                      <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="e.g. Midnight Blue, Tailored Blazers, Silk & Cashmere"
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs font-mono text-zinc-200 outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingPreference(false)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 text-xs font-mono text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-mono text-white font-bold"
                      >
                        Save Memory
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Display Cards or Pipeline View */}
            {viewMode === 'TIMELINE' ? (
              <MemoryTimeline
                memories={filteredMemories}
                onDeleteMemory={deleteMemory}
                onConfirmMemory={(item) => {
                  updateMemory({
                    category: item.category,
                    subcategory: item.subcategory,
                    value: item.value,
                    source: 'user_explicit',
                    level: item.level,
                    confidence: 0.99
                  });
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredMemories.length === 0 ? (
                  <div className="sm:col-span-2 py-12 text-center space-y-2">
                    <Database className="w-8 h-8 text-violet-400/50 mx-auto" />
                    <p className="text-xs font-mono text-zinc-400">
                      No memory preferences found matching filter.
                    </p>
                  </div>
                ) : (
                  filteredMemories.map((m) => (
                    <PreferenceCard
                      key={m.id}
                      item={m}
                      onDelete={deleteMemory}
                      onConfirm={(item) => {
                        updateMemory({
                          category: item.category,
                          subcategory: item.subcategory,
                          value: item.value,
                          source: 'user_explicit',
                          level: item.level,
                          confidence: 0.99
                        });
                      }}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
