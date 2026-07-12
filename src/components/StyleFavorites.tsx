import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Plus, Trash2, FolderOpen, ExternalLink, Bookmark, Sparkles, Share2, Sliders, Check } from 'lucide-react';
import { WardrobeItem } from '../platform';
import { UnifiedFashionOS } from '../engine';

interface StyleFavoritesProps {
  wardrobe: WardrobeItem[];
}

interface FavoriteOutfit {
  id: string;
  name: string;
  description: string;
  folderId: string;
  tags: string[];
  items: Array<{ id: string; title: string; category: string }>;
  imageUrl?: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
}

export const StyleFavorites: React.FC<StyleFavoritesProps> = ({ wardrobe }) => {
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'all', name: 'All Favorites', count: 3 },
    { id: 'f-1', name: 'High-Tailoring', count: 1 },
    { id: 'f-2', name: 'Cyber Techwear', count: 1 },
    { id: 'f-3', name: 'Lounge Comfort', count: 1 }
  ]);

  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  
  const [favorites, setFavorites] = useState<FavoriteOutfit[]>([
    {
      id: 'fav-1',
      name: 'Double-Breasted Cashmere Warmth',
      description: 'Elegant draped winter capsule combination focusing on soft off-white and warm cashmere.',
      folderId: 'f-1',
      tags: ['Nordic Minimalist', 'Formal'],
      items: [
        { id: 'w-1', title: 'Double-Breasted Wool Overcoat', category: 'Outerwear' },
        { id: 'w-2', title: 'Ribbed Cashmere Turtleneck', category: 'Knitwear' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'fav-2',
      name: 'Matte Asymmetric Techwear',
      description: 'Fully waterproofed layers matching structured utility hardware.',
      folderId: 'f-2',
      tags: ['Cyber Couture', 'Streetwear'],
      items: [
        { id: 'w-4', title: 'Asymmetric Drape Trench', category: 'Outerwear' },
        { id: 'w-5', title: 'Structured Utility Vest', category: 'Accessories' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'fav-3',
      name: 'Oversized Weekend Drape',
      description: 'Ultra comfort minimal slouchy proportions.',
      folderId: 'f-3',
      tags: ['Casual', 'Minimalist'],
      items: [
        { id: 'w-8', title: 'Oversized Raw Heavy Tee', category: 'Casual' },
        { id: 'w-9', title: 'Vintage Stonewash Denim', category: 'Casual' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=300&auto=format&fit=crop'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newFavName, setNewFavName] = useState('');
  const [newFavDesc, setNewFavDesc] = useState('');
  const [newFavFolder, setNewFavFolder] = useState('f-1');
  const [newFavTags, setNewFavTags] = useState('Minimalist, Street');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const filteredFavorites = activeFolderId === 'all'
    ? favorites
    : favorites.filter(fav => fav.folderId === activeFolderId);

  const handleAddFolder = () => {
    const name = prompt('Enter new favorites folder name:');
    if (!name) return;

    const newFolderId = `folder-${Date.now()}`;
    const newFolder: Folder = {
      id: newFolderId,
      name,
      count: 0
    };

    setFolders(prev => [...prev, newFolder]);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Created "${name}" Favorites vault!` }));
  };

  const handleToggleItemSelection = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCreateFavorite = () => {
    if (!newFavName.trim()) {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: 'Please specify a coordinate name.' 
      }));
      return;
    }

    const selectedItems = wardrobe
      .filter(w => selectedItemIds.includes(w.id))
      .map(w => ({ id: w.id, title: w.title, category: w.category }));

    const tagList = newFavTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newFav: FavoriteOutfit = {
      id: `fav-outfit-${Date.now()}`,
      name: newFavName.trim(),
      description: newFavDesc.trim() || 'Aesthetic favorite saved.',
      folderId: newFavFolder,
      tags: tagList,
      items: selectedItems,
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop'
    };

    const updatedFavorites = [newFav, ...favorites];
    setFavorites(updatedFavorites);

    // Recalculate folder count
    const updatedFolders = folders.map(f => {
      if (f.id === 'all') return { ...f, count: updatedFavorites.length };
      const folderCount = updatedFavorites.filter(fav => fav.folderId === f.id).length;
      return { ...f, count: folderCount };
    });
    setFolders(updatedFolders);

    setShowAddModal(false);
    setNewFavName('');
    setNewFavDesc('');
    setNewFavTags('Minimalist, Street');
    setSelectedItemIds([]);

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Saved "${newFav.name}" to favorites vault!` }));
  };

  const handleRemoveFavorite = (id: string, name: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);

    // Recalculate folder count
    const updatedFolders = folders.map(f => {
      if (f.id === 'all') return { ...f, count: updatedFavorites.length };
      const folderCount = updatedFavorites.filter(fav => fav.folderId === f.id).length;
      return { ...f, count: folderCount };
    });
    setFolders(updatedFolders);

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Removed "${name}" from vault.` }));
  };

  const handleRemixToWorkspace = (fav: FavoriteOutfit) => {
    // Construct dynamic OutfitSuggestion payload
    const remixSuggestion = {
      id: `remix-outfit-${Date.now()}`,
      name: fav.name,
      explanation: fav.description,
      confidence: 0.98,
      items: wardrobe.filter(w => fav.items.some(fi => fi.id === w.id)),
      isPremiumExclusive: false
    };

    UnifiedFashionOS.getState().activeSuggestion = remixSuggestion as any;
    UnifiedFashionOS.recalculateGoLiveGate();
    UnifiedFashionOS.notify();

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Loaded "${fav.name}" into Active Workspace for editing!` }));
  };

  return (
    <div className="space-y-6 text-white text-left animate-fade-in" id="style-favorites-root">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
            Curated Showcase
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            Sartorial Favorites Vault
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Your custom high-contrast aesthetic showcase of liked coordinate silhouettes and saved design combinations."
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl font-mono text-[9.5px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save Custom Coordinate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: VAULT FOLDERS (4 Columns) */}
        <div className="lg:col-span-4 bg-[#07070c]/50 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block font-bold">Favorites Vaults</span>
              <button
                onClick={handleAddFolder}
                className="text-[9.5px] font-mono text-violet-400 uppercase tracking-wider hover:text-violet-300 transition-all font-semibold"
              >
                + Add Vault
              </button>
            </div>
            
            <div className="space-y-2">
              {folders.map((folder) => {
                const isActive = folder.id === activeFolderId;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                      isActive 
                        ? 'bg-[#181135] border-violet-500/30 text-white' 
                        : 'bg-[#07070c] border-white/5 hover:border-white/10 text-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FolderOpen className={`w-4 h-4 shrink-0 ${isActive ? 'text-violet-400' : 'text-white/40'}`} />
                      <span className="text-xs font-bold font-sans truncate">{folder.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/30 px-2 py-0.5 rounded-full bg-white/5">{folder.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SAVED COORDINATES (8 Columns) */}
        <div className="lg:col-span-8 bg-[#07070c]/50 border border-white/5 p-6 rounded-2xl">
          <div className="space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block font-bold">Saved Coordinates</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-[#05050a] border border-white/5 p-4 rounded-xl flex flex-col justify-between h-52 hover:border-rose-500/20 group duration-300 transition-all text-left relative overflow-hidden"
                >
                  <div className="space-y-2 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-wrap gap-1">
                        {fav.tags.map((tag, i) => (
                          <span key={i} className="text-[8px] font-mono bg-rose-500/10 border border-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(fav.id, fav.name)}
                        className="p-1 text-white/25 hover:text-red-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">{fav.name}</h4>
                    <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed">{fav.description}</p>
                  </div>

                  <div className="relative z-10 border-t border-white/5 pt-3 mt-3 flex items-center justify-between">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {fav.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 text-[7px] font-mono font-bold flex items-center justify-center text-violet-300"
                          title={`${item.title} (${item.category})`}
                        >
                          {item.title.charAt(0)}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleRemixToWorkspace(fav)}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-200 text-black rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3 h-3 text-violet-600" />
                      <span>Remix Load</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredFavorites.length === 0 && (
                <div className="col-span-2 py-16 text-center bg-white/[0.005] border border-white/5 rounded-2xl">
                  <Heart className="w-6 h-6 text-white/10 mx-auto mb-2" />
                  <p className="text-xs font-serif italic text-white/30">"This vault folder has no saved coordinates."</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Custom Outfit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0b14] border border-white/10 rounded-2xl max-w-lg w-full p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div>
                <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider">Save Custom Coordinate Portfolio</h3>
                <p className="text-xs text-white/40 font-sans mt-1">Bookmark high-fidelity combinations with tags and notes into specialized folders.</p>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-white/40 block">Vault Folder</label>
                    <select
                      value={newFavFolder}
                      onChange={(e) => setNewFavFolder(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white/80 focus:outline-none focus:border-rose-500 transition-all"
                    >
                      {folders.filter(f => f.id !== 'all').map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-white/40">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newFavTags}
                      onChange={(e) => setNewFavTags(e.target.value)}
                      placeholder="e.g. Minimalist, Chic, Tailored"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-white/40">Coordinate Name</label>
                  <input
                    type="text"
                    value={newFavName}
                    onChange={(e) => setNewFavName(e.target.value)}
                    placeholder="e.g. High-Contrast Charcoal Blazer Combo"
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-white/40">Description & Style Logic</label>
                  <textarea
                    value={newFavDesc}
                    onChange={(e) => setNewFavDesc(e.target.value)}
                    placeholder="Add brief details about the drape, contrast weights, or accessory pairings."
                    rows={2}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-all resize-none placeholder-white/20"
                  />
                </div>

                {/* Multiselect Closet Items */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-white/40 block">Assign Closet Garments</label>
                  <div className="bg-neutral-950 border border-white/5 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto no-scrollbar">
                    {wardrobe.map(item => {
                      const isSelected = selectedItemIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleToggleItemSelection(item.id)}
                          type="button"
                          className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected 
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                              : 'bg-white/[0.01] border-white/5 hover:border-white/10 text-white/60'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="block text-[9.5px] font-bold truncate leading-tight">{item.title}</span>
                            <span className="block text-[8px] font-mono text-white/30 uppercase mt-0.5">{item.category}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-rose-400" />}
                        </button>
                      );
                    })}
                    {wardrobe.length === 0 && (
                      <span className="text-[9.5px] font-mono text-white/20 p-2 col-span-2 text-center">No closet archive loaded</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewFavName('');
                    setNewFavDesc('');
                    setSelectedItemIds([]);
                  }}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFavorite}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center"
                >
                  Bookmark Favorite
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
