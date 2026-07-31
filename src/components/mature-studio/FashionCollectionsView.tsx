import React, { useState } from 'react';
import { FashionCollection, MatureGeneratedAsset } from '../../types/matureStudio';
import { Crown, Sparkles, Plus, Layers, Calendar, Heart, Share2, Tag, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface FashionCollectionsViewProps {
  collections: FashionCollection[];
  onSelectCollection?: (col: FashionCollection) => void;
  onCreateCollection?: (newColData: Partial<FashionCollection>) => void;
}

export const FashionCollectionsView: React.FC<FashionCollectionsViewProps> = ({
  collections,
  onSelectCollection,
  onCreateCollection
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<'collection' | 'seasonal_drop' | 'fashion_story' | 'editorial_campaign'>('seasonal_drop');
  const [newSeason, setNewSeason] = useState('Autumn / Winter 2026');

  const handleSubmitNewDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateCollection?.({
      title: newTitle.trim(),
      tagline: newTagline.trim() || 'Haute couture editorial story',
      description: newDescription.trim() || 'A curated campaign exploring fashion silhouette tension.',
      type: newType,
      season: newSeason,
      coverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      creationIds: []
    });

    setNewTitle('');
    setNewTagline('');
    setNewDescription('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#07070c] border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif text-white">Fashion Collections & Drops</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Organize haute couture creations into seasonal drops, editorial campaigns, and fashion stories.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 flex items-center space-x-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection Drop</span>
        </button>
      </div>

      {/* 2. Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            onClick={() => onSelectCollection?.(col)}
            className="group rounded-2xl bg-slate-950/90 border border-white/10 overflow-hidden hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="h-56 w-full relative overflow-hidden bg-slate-900">
                <img 
                  src={col.coverImage} 
                  alt={col.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-violet-300 uppercase tracking-wider">
                    {col.type.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300">
                    {col.season || 'SS26'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  <img src={col.creatorAvatar} alt={col.creatorName} className="w-6 h-6 rounded-full border border-white/20 object-cover" />
                  <span className="text-xs font-mono text-zinc-300">{col.creatorName}</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors font-serif">{col.title}</h3>
                <p className="text-xs text-violet-400 font-medium">{col.tagline}</p>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{col.description}</p>
              </div>
            </div>

            {/* Valuation & Footer */}
            <div className="px-5 py-3.5 border-t border-white/5 bg-slate-900/40 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono text-[11px] text-zinc-400">
                {col.creationIds.length} Couture Works
              </span>

              <div className="flex items-center space-x-2 font-mono text-emerald-400 font-semibold">
                <span>Est. {col.estimatedValuation}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Create Drop Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#090616] border border-violet-500/30 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-serif text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span>Create Collection Drop</span>
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmitNewDrop} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-mono mb-1">Collection Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Midnight Obsidian & Liquid Silk" 
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-violet-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-mono mb-1">Tagline</label>
                <input 
                  type="text" 
                  value={newTagline}
                  onChange={e => setNewTagline(e.target.value)}
                  placeholder="e.g. High fashion tension between liquid titanium and soft organza." 
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-violet-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-mono mb-1">Drop Format</label>
                  <select 
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-violet-500 outline-none"
                  >
                    <option value="seasonal_drop">Seasonal Drop</option>
                    <option value="editorial_campaign">Editorial Campaign</option>
                    <option value="fashion_story">Fashion Story</option>
                    <option value="collection">Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-mono mb-1">Season</label>
                  <input 
                    type="text" 
                    value={newSeason}
                    onChange={e => setNewSeason(e.target.value)}
                    placeholder="Autumn / Winter 2026" 
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-violet-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-mono mb-1">Description</label>
                <textarea 
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Editorial notes describing silhouette, drape physics and material lighting..." 
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-violet-500 outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-zinc-300 font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-violet-500/20 cursor-pointer"
                >
                  Publish Collection Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
