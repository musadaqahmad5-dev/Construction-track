import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, FolderPlus, Globe, Lock, Wand2, Sparkles, Plus, Search, 
  Trash2, Download, Share2, Eye, X, Check, CheckCircle, Tag, Layers, 
  ArrowRight, FolderOpen, Shield, ChevronRight, Bookmark, Heart
} from 'lucide-react';
import { 
  AIStyleHubV17Architecture, 
  AICreationFolder, 
  UniversalPublishableAsset, 
  AnonymousDraftAsset 
} from '../../features/global/AIStyleHubV17Architecture';

interface AICreationsFoldersAndMemoryProps {
  user?: any;
  onNavigateTab?: (tab: string) => void;
  onSelectAssetForStudio?: (asset: UniversalPublishableAsset | AnonymousDraftAsset) => void;
}

export const AICreationsFoldersAndMemory: React.FC<AICreationsFoldersAndMemoryProps> = ({
  user,
  onNavigateTab,
  onSelectAssetForStudio
}) => {
  // Main Navigation: Personal Folders vs Public Component Memory
  const [activeSubTab, setActiveSubTab] = useState<'PERSONAL_FOLDERS' | 'PUBLIC_MEMORY'>('PERSONAL_FOLDERS');

  // State for Personal Folders
  const [folders, setFolders] = useState<AICreationFolder[]>(() => AIStyleHubV17Architecture.getAICreationFolders());
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>('folder-fashion-apparel');
  const [privateAssets, setPrivateAssets] = useState<UniversalPublishableAsset[]>(() => 
    AIStyleHubV17Architecture.getPublishingQueue().filter(a => a.originModule === 'AI_CREATIONS')
  );

  // State for Public Component Memory
  const [publicDrafts, setPublicDrafts] = useState<AnonymousDraftAsset[]>(() => 
    AIStyleHubV17Architecture.getAnonymousDrafts().filter(a => a.originModule === 'AI_CREATIONS')
  );

  // Category & Search Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal: Create New Folder
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderDesc, setNewFolderDesc] = useState<string>('');

  // Modal: Claim & Import Public Memory Asset ("Upload For Give Your Name")
  const [selectedPublicDraft, setSelectedPublicDraft] = useState<AnonymousDraftAsset | null>(null);
  const [importTitle, setImportTitle] = useState<string>('');
  const [importCaption, setImportCaption] = useState<string>('');
  const [importFolderId, setImportFolderId] = useState<string>('folder-fashion-apparel');

  // Detail Preview Modal
  const [previewAsset, setPreviewAsset] = useState<UniversalPublishableAsset | AnonymousDraftAsset | null>(null);

  // Sync refresh helper
  const refreshState = useCallback(() => {
    setFolders(AIStyleHubV17Architecture.getAICreationFolders());
    setPrivateAssets(AIStyleHubV17Architecture.getPublishingQueue().filter(a => a.originModule === 'AI_CREATIONS'));
    setPublicDrafts(AIStyleHubV17Architecture.getAnonymousDrafts().filter(a => a.originModule === 'AI_CREATIONS'));
  }, []);

  useEffect(() => {
    refreshState();
    const handleSync = () => refreshState();
    window.addEventListener('lookvision_sync_v17_memory', handleSync);
    return () => {
      window.removeEventListener('lookvision_sync_v17_memory', handleSync);
    };
  }, [refreshState]);

  // Handle New Folder Creation
  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const created = AIStyleHubV17Architecture.createAICreationFolder(
      newFolderName.trim(),
      newFolderDesc.trim(),
      categoryFilter
    );

    setIsCreatingFolder(false);
    setNewFolderName('');
    setNewFolderDesc('');
    setSelectedFolderId(created.id);
    refreshState();

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✦ Created new Personal Folder: "${created.name}"`
    }));
  };

  // Handle Import & Claiming Public Memory Item
  const handleExecuteImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPublicDraft) return;

    const userName = user?.displayName || 'AI Universe Creator';
    const newPost = AIStyleHubV17Architecture.importPublicMemoryAssetToHomeHub(
      selectedPublicDraft.id,
      importTitle.trim() || selectedPublicDraft.titleSuggestion || 'Custom AI Creation',
      importCaption.trim() || 'Claimed from AI Creations Public Memory & titled with my personal identity.',
      userName
    );

    if (newPost) {
      // Also save into selected personal folder
      if (importFolderId) {
        AIStyleHubV17Architecture.addItemToAICreationFolder(importFolderId, newPost.id);
      }

      setSelectedPublicDraft(null);
      setImportTitle('');
      setImportCaption('');
      refreshState();

      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `✦ Claimed & Imported "${newPost.title}" into Personal Folder & HomeHub Feed!`
      }));

      if (onNavigateTab) {
        onNavigateTab('HOME');
      }
    }
  };

  // Get active selected folder object
  const activeFolder = folders.find(f => f.id === selectedFolderId) || folders[0];

  // Filter private assets in active folder (or all if filter is ALL)
  const itemsInActiveFolder = privateAssets.filter(asset => {
    if (!activeFolder) return true;
    if (activeFolder.itemIds.length > 0) {
      return activeFolder.itemIds.includes(asset.id);
    }
    // Default fallback: match category tag if itemIds is empty
    if (activeFolder.categoryTag && activeFolder.categoryTag !== 'ALL') {
      return asset.category === activeFolder.categoryTag;
    }
    return true;
  });

  // Filtered Public Memory Drafts
  const filteredPublicDrafts = publicDrafts.filter(draft => {
    const matchesCat = categoryFilter === 'ALL' || draft.category === categoryFilter;
    const matchesSearch = !searchQuery.trim() || 
      draft.titleSuggestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left w-full font-sans">
      
      {/* TOP NAVIGATION BAR: PERSONAL FOLDERS VS PUBLIC MEMORY */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#07070c] border border-white/10 rounded-2xl p-2 sm:p-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('PERSONAL_FOLDERS')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'PERSONAL_FOLDERS'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/50'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-amber-300" />
            <span>Personal Folders & Vault ({privateAssets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('PUBLIC_MEMORY')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'PUBLIC_MEMORY'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/50'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-300" />
            <span>AI Creations Public Memory ({publicDrafts.length})</span>
          </button>
        </div>

        {/* Action Button: Create New Folder or Search */}
        {activeSubTab === 'PERSONAL_FOLDERS' ? (
          <button
            type="button"
            onClick={() => setIsCreatingFolder(true)}
            className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-300" />
            <span>+ New Personal Folder</span>
          </button>
        ) : (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Public Memory..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: PERSONAL FOLDERS & VAULT */}
      {activeSubTab === 'PERSONAL_FOLDERS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* FOLDERS SIDEBAR SELECTOR (4 COLS) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Personal Folders ({folders.length})</span>
              </span>
            </div>

            <div className="space-y-2">
              {folders.map(folder => {
                const isSelected = selectedFolderId === folder.id;
                const itemCount = privateAssets.filter(a => {
                  if (folder.itemIds.length > 0) return folder.itemIds.includes(a.id);
                  if (folder.categoryTag && folder.categoryTag !== 'ALL') return a.category === folder.categoryTag;
                  return true;
                }).length;

                return (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-purple-950/40 border-violet-500/50 text-white shadow-xl'
                        : 'bg-[#07070c] border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Folder className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-zinc-500'}`} />
                        <h4 className="font-serif text-sm font-medium text-white">{folder.name}</h4>
                      </div>
                      {folder.description && (
                        <p className="text-[11px] text-zinc-400 font-light line-clamp-1">{folder.description}</p>
                      )}
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono shrink-0 ${
                      isSelected ? 'bg-violet-500/20 text-violet-200 border border-violet-500/30' : 'bg-white/5 text-zinc-500'
                    }`}>
                      {itemCount} Items
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE FOLDER CONTENT GRID (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            {activeFolder && (
              <div className="bg-[#07070c] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-amber-400" />
                    <h3 className="font-serif text-base font-medium text-white">{activeFolder.name}</h3>
                  </div>
                  <p className="text-xs text-zinc-400 font-light">{activeFolder.description || 'Personal folder collection.'}</p>
                </div>
                <span className="text-xs font-mono text-zinc-500">{itemsInActiveFolder.length} Assets Stored</span>
              </div>
            )}

            {itemsInActiveFolder.length === 0 ? (
              <div className="p-12 bg-[#07070c] border border-white/5 rounded-3xl text-center space-y-3">
                <Folder className="w-8 h-8 text-amber-400/50 mx-auto" />
                <h4 className="font-serif text-sm font-medium text-white">This Folder is Empty</h4>
                <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
                  Generate new concepts in AI Creations Studio or claim items from Public Memory to add them to this folder!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {itemsInActiveFolder.map(asset => (
                  <div
                    key={asset.id}
                    className="bg-[#07070c] border border-white/10 rounded-2xl overflow-hidden group hover:border-violet-500/40 transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                        <img
                          src={asset.imageUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewAsset(asset)}
                          className="absolute bottom-2 right-2 p-2 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-xl hover:bg-black transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3 space-y-1">
                        <h4 className="font-serif text-xs font-medium text-white line-clamp-1">{asset.title}</h4>
                        <span className="text-[9px] font-mono text-violet-400 block">{asset.styleVibe || 'AI Concept'}</span>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateTab) onNavigateTab('HOME');
                        }}
                        className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-white text-[11px] font-mono rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Share2 className="w-3 h-3 text-violet-400" />
                        <span>View in Feed</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VIEW 2: PUBLIC COMPONENT MEMORY FOR AI CREATIONS */
        <div className="space-y-5">
          <div className="bg-[#07070c] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono rounded-full uppercase">
                Public Memory Protocol
              </span>
            </div>
            <h2 className="font-serif text-xl font-medium text-white">AI Creations Public Memory Feed</h2>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              Browse anonymous AI creations generated across all studio categories. Click <strong className="text-white">"Upload / Give Your Name"</strong> to claim ownership, customize the title & narrative, and import it into your personal folder and feed!
            </p>
          </div>

          {filteredPublicDrafts.length === 0 ? (
            <div className="p-12 bg-[#07070c] border border-white/5 rounded-3xl text-center space-y-3">
              <Globe className="w-8 h-8 text-cyan-400/50 mx-auto" />
              <h4 className="font-serif text-sm font-medium text-white">No Public Memory Items Found</h4>
              <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
                No items match your query. Generate fresh creations in AI Creations Studio to populate Public Memory!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPublicDrafts.map(draft => (
                <div
                  key={draft.id}
                  className="bg-[#07070c] border border-white/10 rounded-2xl overflow-hidden group hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                      <img
                        src={draft.imageUrl}
                        alt={draft.titleSuggestion}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300 text-[9px] font-mono rounded">
                          Score {draft.qualityScore}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewAsset(draft)}
                        className="absolute bottom-2 right-2 p-2 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-xl hover:bg-black transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="font-serif text-sm font-medium text-white line-clamp-1">{draft.titleSuggestion}</h4>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>Hash: {draft.anonymousHash}</span>
                        <span>{draft.styleVibe}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPublicDraft(draft);
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
      )}

      {/* MODAL: CREATE NEW PERSONAL FOLDER */}
      <AnimatePresence>
        {isCreatingFolder && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c14] border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-amber-400" />
                  <span>Create Custom Personal Folder</span>
                </h3>
                <button type="button" onClick={() => setIsCreatingFolder(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Folder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyberpunk Outerwear & Masks"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Description (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Brief note about what goes in this folder..."
                    value={newFolderDesc}
                    onChange={e => setNewFolderDesc(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(false)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-xl cursor-pointer"
                  >
                    Create Folder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CLAIM & IMPORT PUBLIC MEMORY ASSET */}
      <AnimatePresence>
        {selectedPublicDraft && (
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
                <button type="button" onClick={() => setSelectedPublicDraft(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4 items-center p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <img src={selectedPublicDraft.imageUrl} alt="Draft" className="w-20 h-20 object-cover rounded-xl shrink-0" />
                <p className="text-xs text-zinc-300 font-light">
                  Claim this anonymous AI creation from Public Memory, assign your name/title, select a personal folder, and import it directly into HomeHub!
                </p>
              </div>

              <form onSubmit={handleExecuteImport} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Give Custom Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Cyberpunk Silk Gown"
                    value={importTitle}
                    onChange={e => setImportTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Assign To Personal Folder</label>
                  <select
                    value={importFolderId}
                    onChange={e => setImportFolderId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0c0c14] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  >
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Narrative / Caption</label>
                  <textarea
                    rows={2}
                    placeholder="Add story or aesthetic context..."
                    value={importCaption}
                    onChange={e => setImportCaption(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPublicDraft(null)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Confirm & Claim Asset</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: FULL RESOLUTION IMAGE PREVIEW */}
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
                <h3 className="font-serif text-base font-medium text-white">Full Resolution Asset</h3>
                <button type="button" onClick={() => setPreviewAsset(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-zinc-950 flex items-center justify-center">
                <img src={previewAsset.imageUrl} alt="Full View" className="max-h-[60vh] w-auto object-contain" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <h4 className="font-serif text-sm font-medium text-white">
                  {'titleSuggestion' in previewAsset ? previewAsset.titleSuggestion : previewAsset.title}
                </h4>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
