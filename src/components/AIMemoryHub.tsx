import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, Cpu, Clock, RefreshCw, Wand2, Sparkles, Filter, 
  Search, Shield, Globe, Lock, ArrowRight, Share2, Download, 
  Trash2, Eye, Check, X, Tag, Layers, Heart, User, CheckCircle
} from 'lucide-react';
import { 
  AIStyleHubV17Architecture, 
  AnonymousDraftAsset, 
  UniversalPublishableAsset,
  ProductModule
} from '../features/global/AIStyleHubV17Architecture';

interface AIMemoryHubProps {
  user?: any;
  onNavigateTab?: (tab: string) => void;
}

export const AIMemoryHub: React.FC<AIMemoryHubProps> = ({ user, onNavigateTab }) => {
  // Main memory view tab: Public Component Memory vs Private User Memory
  const [memoryTab, setMemoryTab] = useState<'PUBLIC_COMPONENT_MEMORY' | 'PRIVATE_USER_MEMORY'>('PUBLIC_COMPONENT_MEMORY');

  // Component origin filter
  const [moduleFilter, setModuleFilter] = useState<'ALL' | 'COMMUNITY' | 'AI_CREATIONS' | 'OUTFITS'>('ALL');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states
  const [publicDrafts, setPublicDrafts] = useState<AnonymousDraftAsset[]>(() => AIStyleHubV17Architecture.getAnonymousDrafts());
  const [privateQueue, setPrivateQueue] = useState<UniversalPublishableAsset[]>(() => AIStyleHubV17Architecture.getPublishingQueue());
  const [lastSyncTs, setLastSyncTs] = useState<number>(() => AIStyleHubV17Architecture.getLastHourlySyncTimestamp());

  // Import Modal State
  const [selectedImportDraft, setSelectedImportDraft] = useState<AnonymousDraftAsset | null>(null);
  const [importTitle, setImportTitle] = useState<string>('');
  const [importCaption, setImportCaption] = useState<string>('');

  // Detail Preview Modal State
  const [previewAsset, setPreviewAsset] = useState<AnonymousDraftAsset | UniversalPublishableAsset | null>(null);

  // Sync state helper
  const refreshMemoryState = useCallback(() => {
    setPublicDrafts(AIStyleHubV17Architecture.getAnonymousDrafts());
    setPrivateQueue(AIStyleHubV17Architecture.getPublishingQueue());
    setLastSyncTs(AIStyleHubV17Architecture.getLastHourlySyncTimestamp());
  }, []);

  useEffect(() => {
    refreshMemoryState();
    const handleSync = () => refreshMemoryState();
    window.addEventListener('lookvision_sync_v17_memory', handleSync);
    return () => {
      window.removeEventListener('lookvision_sync_v17_memory', handleSync);
    };
  }, [refreshMemoryState]);

  // Trigger Manual Hourly Sync
  const handleManualSync = () => {
    AIStyleHubV17Architecture.checkAndRunHourlyAIMemorySync(true);
    refreshMemoryState();
  };

  // Execute Import into HomeHub ("Upload For Give Your Name")
  const handleExecuteImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImportDraft) return;

    const userName = user?.displayName || 'Personal Stylist';
    const newPost = AIStyleHubV17Architecture.importPublicMemoryAssetToHomeHub(
      selectedImportDraft.id,
      importTitle.trim() || selectedImportDraft.titleSuggestion || 'Personalized AI Creation',
      importCaption.trim() || 'Imported from AI Public Component Memory and titled with my identity.',
      userName
    );

    if (newPost) {
      setSelectedImportDraft(null);
      setImportTitle('');
      setImportCaption('');
      refreshMemoryState();

      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `✦ Asset imported into HomeHub as "${newPost.title}"! Removed from Public Memory.`
      }));

      if (onNavigateTab) {
        onNavigateTab('HOME');
      }
    }
  };

  // Filtered Public Drafts
  const filteredPublicDrafts = publicDrafts.filter(draft => {
    const matchesModule = moduleFilter === 'ALL' || draft.originModule === moduleFilter;
    const matchesSearch = !searchQuery.trim() || 
      draft.titleSuggestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.styleVibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  // Filtered Private Assets
  const filteredPrivateQueue = privateQueue.filter(asset => {
    const matchesModule = moduleFilter === 'ALL' || asset.originModule === moduleFilter;
    const matchesSearch = !searchQuery.trim() || 
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.description && asset.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      asset.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  // Calculate next sync estimate
  const timeSinceSyncSec = Math.floor((Date.now() - (lastSyncTs || Date.now())) / 1000);
  const minutesUntilNextSync = Math.max(0, 60 - Math.floor(timeSinceSyncSec / 60));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-20 px-4 sm:px-6 text-left font-sans">
      
      {/* 1. HEADER & HOURLY AI SYNC STATUS BANNER */}
      <div className="bg-[#07070c] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-mono rounded-full tracking-wider uppercase flex items-center gap-1.5">
                <Database className="w-3 h-3" />
                <span>AI Memory Vault Protocol v1.7</span>
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Hourly Auto-Sync Active</span>
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-tight">
              AI Memory & Public Component Memory
            </h1>
            
            <p className="text-xs text-zinc-300 font-light max-w-2xl leading-relaxed">
              Every image generated across <strong className="text-white">Community</strong>, <strong className="text-white">AI Creations</strong>, and <strong className="text-white">Outfit Planner</strong> is automatically preserved. Fresh AI creations are uploaded every hour to Public Component Memory for anonymous browsing and identity claiming.
            </p>
          </div>

          {/* Hourly Sync Control Widget */}
          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl shrink-0 space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Hourly AI Sync</span>
              </span>
              <span className="text-amber-300 font-bold">~{minutesUntilNextSync}m left</span>
            </div>

            <p className="text-[10.5px] text-zinc-400 font-light">
              Fresh AI generated images automatically populate Component Public Memory every 60 minutes.
            </p>

            <button
              type="button"
              onClick={handleManualSync}
              className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-950/40 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-amber-300" />
              <span>⚡ Sync Fresh AI Images Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN MEMORY VAULT TOGGLE (Public Component Memory vs Private User Memory) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setMemoryTab('PUBLIC_COMPONENT_MEMORY')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer text-left space-y-2 ${
            memoryTab === 'PUBLIC_COMPONENT_MEMORY'
              ? 'bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-purple-950/40 border-violet-500/40 shadow-xl'
              : 'bg-[#07070c] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" />
              <h3 className="font-serif text-sm font-medium text-white">Component Public Memory</h3>
            </div>
            <span className="px-2.5 py-0.5 bg-violet-500/20 border border-violet-500/30 text-violet-200 text-[10px] font-mono rounded-full">
              {publicDrafts.length} Assets
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Anonymous AI creations across all components. Browse and click <strong className="text-white">"Upload For Give Your Name"</strong> to import directly into your HomeHub Personal World.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setMemoryTab('PRIVATE_USER_MEMORY')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer text-left space-y-2 ${
            memoryTab === 'PRIVATE_USER_MEMORY'
              ? 'bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-emerald-950/40 border-emerald-500/40 shadow-xl'
              : 'bg-[#07070c] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h3 className="font-serif text-sm font-medium text-white">Private User Memory</h3>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-[10px] font-mono rounded-full">
              {privateQueue.length} Assets
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Your private personal generated history. Saved safely in your vault with quality scores and publishing control.
          </p>
        </button>
      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Component Origin Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {[
            { id: 'ALL', label: 'All Components' },
            { id: 'COMMUNITY', label: '👥 Community Wear' },
            { id: 'AI_CREATIONS', label: '🎨 AI Creations' },
            { id: 'OUTFITS', label: '👔 Outfit Planner' }
          ].map(m => {
            const isSel = moduleFilter === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setModuleFilter(m.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AI memory tags or concepts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 font-mono"
          />
        </div>
      </div>

      {/* 4. MEMORY GRID DISPLAY */}
      {memoryTab === 'PUBLIC_COMPONENT_MEMORY' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" />
              <span>Public Component Memory Vault</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">{filteredPublicDrafts.length} Available Items</span>
          </div>

          {filteredPublicDrafts.length === 0 ? (
            <div className="p-12 bg-[#07070c] border border-white/5 rounded-3xl text-center space-y-3">
              <Database className="w-8 h-8 text-violet-400/50 mx-auto" />
              <h4 className="font-serif text-sm font-medium text-white">No Public Memory Items Found</h4>
              <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
                No items match your search or filter. Trigger a manual sync above to generate fresh AI creations!
              </p>
              <button
                type="button"
                onClick={handleManualSync}
                className="px-4 py-2 bg-violet-600 text-white text-xs font-mono rounded-xl cursor-pointer hover:bg-violet-500"
              >
                ⚡ Sync Fresh AI Memory
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPublicDrafts.map(draft => (
                <div
                  key={draft.id}
                  className="bg-[#07070c] border border-white/10 rounded-2xl overflow-hidden group hover:border-violet-500/40 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3">
                    {/* Image Preview */}
                    <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                      <img
                        src={draft.imageUrl}
                        alt={draft.titleSuggestion}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      
                      {/* Quality & Component Origin Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 text-[9px] font-mono rounded">
                          ✦ Score {draft.qualityScore}
                        </span>
                        <span className="px-2 py-0.5 bg-violet-950/80 backdrop-blur-md border border-violet-500/30 text-violet-200 text-[9px] font-mono rounded">
                          {draft.originModule}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewAsset(draft)}
                        className="absolute bottom-2 right-2 p-2 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-xl hover:bg-black transition-all cursor-pointer"
                        title="View Full Resolution"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="p-4 space-y-2">
                      <h4 className="font-serif text-sm font-medium text-white line-clamp-1">
                        {draft.titleSuggestion}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>Hash: {draft.anonymousHash}</span>
                        <span>{draft.styleVibe}</span>
                      </div>

                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {draft.tags.slice(0, 3).map(t => (
                          <span key={t} className="px-2 py-0.5 bg-white/5 text-zinc-400 text-[9px] font-mono rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA: Upload For Give Your Name */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImportDraft(draft);
                        setImportTitle(draft.titleSuggestion || '');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Upload / Give Your Name</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* PRIVATE USER MEMORY GRID */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Private User Memory Vault</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">{filteredPrivateQueue.length} Private Items</span>
          </div>

          {filteredPrivateQueue.length === 0 ? (
            <div className="p-12 bg-[#07070c] border border-white/5 rounded-3xl text-center space-y-3">
              <Lock className="w-8 h-8 text-emerald-400/50 mx-auto" />
              <h4 className="font-serif text-sm font-medium text-white">Private Memory Empty</h4>
              <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
                Any images you generate in Community, AI Creations, or Outfit Planner will automatically save here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPrivateQueue.map(asset => (
                <div
                  key={asset.id}
                  className="bg-[#07070c] border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                      <img
                        src={asset.imageUrl}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-200 text-[9px] font-mono rounded">
                          Private Vault
                        </span>
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 text-[9px] font-mono rounded">
                          Score {asset.qualityScore || 90}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="font-serif text-sm font-medium text-white line-clamp-1">{asset.title}</h4>
                      {asset.description && (
                        <p className="text-xs text-zinc-400 font-light line-clamp-2">{asset.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateTab) onNavigateTab('HOME');
                      }}
                      className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View in HomeHub</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: "UPLOAD FOR GIVE YOUR NAME" */}
      <AnimatePresence>
        {selectedImportDraft && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c14] border border-violet-500/30 rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <span>Upload For Give Your Name Protocol</span>
                </h3>
                <button type="button" onClick={() => setSelectedImportDraft(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4 items-center p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <img src={selectedImportDraft.imageUrl} alt="Asset" className="w-24 h-24 object-cover rounded-xl shrink-0" />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[9px] font-mono rounded">
                    Origin: {selectedImportDraft.originModule}
                  </span>
                  <p className="text-xs text-zinc-300 font-light">
                    Claim ownership of this anonymous AI creation by giving it your custom title and caption. Once claimed, it will publish into your HomeHub Personal Feed and be removed from Public Memory.
                  </p>
                </div>
              </div>

              <form onSubmit={handleExecuteImport} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Give Your Custom Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Emerald Silk Concept"
                    value={importTitle}
                    onChange={e => setImportTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Caption & Narrative</label>
                  <textarea
                    rows={3}
                    placeholder="Describe how this piece fits your personal aesthetic..."
                    value={importCaption}
                    onChange={e => setImportCaption(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedImportDraft(null)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl cursor-pointer shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Confirm & Import to HomeHub</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: IMAGE FULL PREVIEW */}
      <AnimatePresence>
        {previewAsset && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c14] border border-white/10 rounded-3xl p-6 w-full max-w-2xl space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-medium text-white">Full Resolution AI Asset</h3>
                <button type="button" onClick={() => setPreviewAsset(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-zinc-950 flex items-center justify-center">
                <img src={previewAsset.imageUrl} alt="Full Preview" className="max-h-[60vh] w-auto object-contain" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <h4 className="font-serif text-sm font-medium text-white">
                    {'titleSuggestion' in previewAsset ? previewAsset.titleSuggestion : previewAsset.title}
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-400">Origin: {previewAsset.originModule}</span>
                </div>

                {'anonymousHash' in previewAsset && (
                  <button
                    type="button"
                    onClick={() => {
                      const draft = previewAsset as AnonymousDraftAsset;
                      setPreviewAsset(null);
                      setSelectedImportDraft(draft);
                      setImportTitle(draft.titleSuggestion || '');
                    }}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-xl cursor-pointer"
                  >
                    Upload / Give Your Name
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
