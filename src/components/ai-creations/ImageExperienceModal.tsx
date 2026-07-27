import React, { useState } from 'react';
import { 
  X, Heart, Bookmark, Share2, Copy, Check, RefreshCw, 
  Trash2, Archive, ZoomIn, Sliders, Info, Eye, Layers, 
  UserPlus, UserMinus, Plus, FileText, ChevronRight, Minimize,
  Download, Send, ThumbsDown, AlertCircle, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AICreation } from './types';
import { AIStyleHubV17Architecture } from '../../features/global/AIStyleHubV17Architecture';

interface ImageExperienceModalProps {
  creation: AICreation;
  onClose: () => void;
  onLike: (id: string) => void;
  isLiked: boolean;
  onSave: (id: string, collectionName: string) => void;
  isSaved: boolean;
  onRemix: (creation: AICreation) => void;
  onGenerateVariations: (creation: AICreation) => void;
  onFollowCreator: (creatorId: string) => void;
  isFollowingCreator: boolean;
  onVisitCreator: (creatorId: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDuplicate?: (creation: AICreation) => void;
  onAddCustomCollection: (collectionName: string) => void;
  customCollections: string[];
}

export const ImageExperienceModal: React.FC<ImageExperienceModalProps> = ({
  creation,
  onClose,
  onLike,
  isLiked,
  onSave,
  isSaved,
  onRemix,
  onGenerateVariations,
  onFollowCreator,
  isFollowingCreator,
  onVisitCreator,
  onDelete,
  onArchive,
  onDuplicate,
  onAddCustomCollection,
  customCollections
}) => {
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'BEFORE_AFTER' | 'VARIATIONS' | 'SIDE_BY_SIDE'>('IMAGE');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [beforeAfterSplit, setBeforeAfterSplit] = useState<number>(50);
  const [isDragSliding, setIsDragSliding] = useState<boolean>(false);
  
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSettings, setCopiedSettings] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Custom collection UI dropdown
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Variation state
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0);
  const [isGeneratingVariation, setIsGeneratingVariation] = useState(false);
  const [variationLogs, setVariationLogs] = useState<string[]>([]);

  // Share link copy
  const handleShare = () => {
    const url = `${window.location.origin}/ai-creations?id=${creation.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Portfolio Share Link copied!'
    }));
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(creation.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Creation prompt copied!'
    }));
  };

  const handleCopySettings = () => {
    const settingsStr = `Model: ${creation.model}\nStyle: ${creation.style}\nResolution: ${creation.resolution}\nAspect Ratio: ${creation.aspectRatio}\nSeed: ${creation.seed || 'N/A'}`;
    navigator.clipboard.writeText(settingsStr);
    setCopiedSettings(true);
    setTimeout(() => setCopiedSettings(false), 2000);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Generation settings copied!'
    }));
  };

  const runVariationProcess = () => {
    if (isGeneratingVariation) return;
    setIsGeneratingVariation(true);
    setVariationLogs([]);

    const steps = [
      "Connecting to Diffusion Space...",
      `Loading base latents with Seed: ${creation.seed || '94827591823'}`,
      "Applying 0.45 strength visual noise warp...",
      "Resolving textile micro-threads...",
      "Re-draping mesh onto runway avatar...",
      "Final path-tracing pass complete!"
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setVariationLogs(prev => [...prev, `[${(idx * 0.5).toFixed(1)}s] ${step}`]);
        if (idx === steps.length - 1) {
          setIsGeneratingVariation(false);
          onGenerateVariations(creation);
        }
      }, (idx + 1) * 600);
    });
  };

  // Convert creation ISO date to formatted local dates
  const creationDateObj = new Date(creation.createdAt);
  const generationDate = creationDateObj.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const generationTime = creationDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg overflow-y-auto no-scrollbar select-none text-white">
      {/* Background closing overlay */}
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#06060c] border border-white/5 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[500px]"
      >
        {/* Left 7 Columns: Immersive Canvas Area */}
        <div className="lg:col-span-7 bg-[#030307] relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 min-h-[400px]">
          {/* Top Panel Buttons */}
          <div className="p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
            {/* View Mode Tabs */}
            <div className="flex bg-[#07070c]/90 border border-white/5 p-1 rounded-xl">
              {[
                { id: 'IMAGE', label: 'Render' },
                { id: 'BEFORE_AFTER', label: 'Before/After' },
                { id: 'VARIATIONS', label: 'Variations' },
                { id: 'SIDE_BY_SIDE', label: 'Side-by-Side' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Zoom Controls */}
            {activeTab === 'IMAGE' && (
              <div className="flex items-center bg-black/60 border border-white/5 rounded-xl px-2.5 py-1 text-zinc-400 gap-2">
                <button 
                  onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <Minimize className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-semibold text-zinc-300 select-none w-8 text-center">
                  {zoomLevel.toFixed(1)}x
                </span>
                <button 
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Interactive Core Screen */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black/40 min-h-[300px]">
            {/* RENDER - Default Active Tab */}
            {activeTab === 'IMAGE' && (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden p-6">
                <div 
                  className="w-full h-full max-h-[500px] flex items-center justify-center relative overflow-hidden rounded-2xl"
                  style={{
                    cursor: zoomLevel > 1 ? 'grab' : 'default',
                  }}
                >
                  <motion.img
                    src={creation.imageUrl}
                    alt={creation.title}
                    animate={{ scale: zoomLevel }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                  />
                </div>
              </div>
            )}

            {/* BEFORE / AFTER SLIDER */}
            {activeTab === 'BEFORE_AFTER' && (
              <div className="w-full h-full flex items-center justify-center p-6 relative select-none">
                <div className="w-full h-full max-h-[480px] aspect-[3/4] relative overflow-hidden rounded-2xl shadow-2xl border border-white/5">
                  {/* Before (Avatar / Grid base) */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={creation.imageUrlBefore || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800'} 
                      alt="Before" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-mono text-zinc-400">
                      Mesh Model Frame
                    </div>
                  </div>

                  {/* After (Final path traced image with clip path) */}
                  <div 
                    className="absolute inset-0 z-10"
                    style={{ clipPath: `polygon(0 0, ${beforeAfterSplit}% 0, ${beforeAfterSplit}% 100%, 0 100%)` }}
                  >
                    <img 
                      src={creation.imageUrl} 
                      alt="After" 
                      className="w-full h-full object-cover animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-violet-600/80 backdrop-blur-md rounded border border-violet-500/20 text-[9px] font-mono text-white">
                      Path Traced Render
                    </div>
                  </div>

                  {/* Slider Divider Bar */}
                  <div 
                    className="absolute top-0 bottom-0 z-20 w-0.5 bg-violet-500 cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${beforeAfterSplit}%` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-violet-500 border border-white text-white flex items-center justify-center text-[10px] shadow-lg select-none font-bold">
                      ↔
                    </div>
                  </div>

                  {/* Hidden Input for sliding control */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={beforeAfterSplit}
                    onChange={(e) => setBeforeAfterSplit(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
                  />
                </div>
              </div>
            )}

            {/* VARIATIONS COMPARISON */}
            {activeTab === 'VARIATIONS' && (
              <div className="w-full h-full flex flex-col justify-between p-6 space-y-4">
                <div className="flex-1 flex items-center justify-center relative">
                  {/* Current Active Variation Image */}
                  <div className="w-full h-full max-h-[380px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative border border-white/5 bg-zinc-950">
                    <img 
                      src={creation.variations ? creation.variations[selectedVariationIndex] : creation.imageUrl} 
                      alt={`Variation ${selectedVariationIndex + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 border border-white/10 rounded-full text-[10px] font-mono text-zinc-300">
                      Variation #{selectedVariationIndex + 1}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Selector Grid and Render Button */}
                <div className="flex justify-between items-center gap-4 bg-[#07070c]/60 border border-white/5 p-3 rounded-2xl">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {creation.variations?.map((vImg, vIdx) => (
                      <button
                        key={vIdx}
                        onClick={() => setSelectedVariationIndex(vIdx)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                          selectedVariationIndex === vIdx ? 'border-violet-500 scale-95 shadow-md' : 'border-white/5 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={vImg} className="w-full h-full object-cover" />
                      </button>
                    )) || (
                      <span className="text-[10px] text-zinc-500 font-mono">No variations generated yet.</span>
                    )}
                  </div>

                  <button
                    onClick={runVariationProcess}
                    disabled={isGeneratingVariation}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-800 text-white font-mono text-[10px] uppercase tracking-wider rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0 border border-white/5"
                  >
                    {isGeneratingVariation ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-white" />
                        <span>Solving...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3 h-3 text-violet-300" />
                        <span>Generate Variation</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Generator Terminal logs on request */}
                {isGeneratingVariation && (
                  <div className="p-3 bg-[#030307] border border-white/5 rounded-xl font-mono text-[9px] text-left text-violet-400 max-h-[100px] overflow-y-auto no-scrollbar space-y-1">
                    {variationLogs.map((log, lIdx) => (
                      <div key={lIdx}>{log}</div>
                    ))}
                    <div className="animate-pulse">● Compiling spatial vertices...</div>
                  </div>
                )}
              </div>
            )}

            {/* SIDE BY SIDE COMPARISON */}
            {activeTab === 'SIDE_BY_SIDE' && (
              <div className="w-full h-full flex items-center justify-center p-6 gap-4 select-none">
                {/* Image 1 */}
                <div className="flex-1 max-h-[440px] aspect-[3/4.2] relative overflow-hidden rounded-2xl shadow-xl border border-white/5">
                  <img src={creation.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-0.5 rounded border border-white/10 text-[9px] font-mono text-zinc-400">
                    Active Render
                  </div>
                </div>

                {/* Image 2 (Variation or default look-alike) */}
                <div className="flex-1 max-h-[440px] aspect-[3/4.2] relative overflow-hidden rounded-2xl shadow-xl border border-white/5 bg-zinc-950">
                  <img src={creation.variations && creation.variations[1] ? creation.variations[1] : 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800'} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-0.5 rounded border border-white/10 text-[9px] font-mono text-zinc-400">
                    Alternative Vibe
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Immersive Footer Overlays */}
          <div className="p-4 bg-gradient-to-t from-black/80 to-transparent z-10 flex justify-between items-center">
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 block font-semibold">
                {creation.style} • CREATION #{creation.id.slice(-6)}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{creation.title}</h4>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onLike(creation.id)}
                className={`p-2 rounded-xl bg-[#07070c]/80 border border-white/5 transition-all flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer ${isLiked ? 'text-rose-400 border-rose-500/35' : 'text-zinc-400'}`}
                title="Like"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* SAVE TO COLLECTION WITH DROP-DOWN */}
              <div className="relative">
                <button
                  onClick={() => setShowSaveDropdown(!showSaveDropdown)}
                  className={`p-2 rounded-xl bg-[#07070c]/80 border border-white/5 transition-all flex items-center justify-center hover:bg-indigo-500/10 hover:text-indigo-400 cursor-pointer ${isSaved ? 'text-indigo-400 border-indigo-500/35' : 'text-zinc-400'}`}
                  title="Save to Collection"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-500 text-indigo-500' : ''}`} />
                </button>

                {/* Dropdown Container */}
                <AnimatePresence>
                  {showSaveDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-12 right-0 w-52 bg-[#07070c] border border-white/10 rounded-2xl p-3 shadow-2xl z-50 text-left space-y-2.5"
                    >
                      <h5 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-semibold border-b border-white/5 pb-1.5">
                        Add to Collection
                      </h5>
                      <div className="max-h-28 overflow-y-auto no-scrollbar space-y-1">
                        {customCollections.map(colName => (
                          <button
                            key={colName}
                            onClick={() => {
                              onSave(creation.id, colName);
                              setShowSaveDropdown(false);
                            }}
                            className="w-full text-left text-[11px] text-zinc-300 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded transition-colors block truncate"
                          >
                            + {colName}
                          </button>
                        ))}
                      </div>

                      {/* Custom collection creator */}
                      <div className="pt-2 border-t border-white/5 flex gap-1 items-center">
                        <input
                          type="text"
                          placeholder="New collection..."
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          className="flex-1 bg-[#11111a] border border-white/5 px-2 py-1 rounded text-[10px] text-white focus:outline-none focus:border-violet-500"
                        />
                        <button
                          onClick={() => {
                            if (newCollectionName.trim()) {
                              onAddCustomCollection(newCollectionName.trim());
                              onSave(creation.id, newCollectionName.trim());
                              setNewCollectionName('');
                              setShowSaveDropdown(false);
                            }
                          }}
                          className="p-1 bg-violet-600 hover:bg-violet-500 rounded text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-[#07070c]/80 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center justify-center hover:bg-white/5 cursor-pointer"
                title="Share link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Creative Actions, Details & Metadata */}
        <div className="lg:col-span-5 p-6 bg-[#090910] flex flex-col justify-between overflow-y-auto max-h-[85vh] lg:max-h-none no-scrollbar text-left select-text">
          <div className="space-y-6">
            {/* Creator Profile Card */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div 
                onClick={() => onVisitCreator(creation.creator.id)}
                className="flex items-center gap-3 cursor-pointer group/creator"
              >
                <img
                  src={creation.creator.avatar}
                  alt={creation.creator.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover/creator:border-violet-500/40 transition-all shadow-md"
                />
                <div>
                  <h4 className="text-xs font-bold text-white group-hover/creator:text-violet-400 transition-colors">
                    {creation.creator.name}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {creation.creator.followers} Followers
                  </span>
                </div>
              </div>

              <button
                onClick={() => onFollowCreator(creation.creator.id)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isFollowingCreator
                    ? 'bg-zinc-800 text-zinc-400 border border-white/5 hover:bg-zinc-700'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-white/10 shadow-lg shadow-violet-600/10 hover:from-violet-500 hover:to-indigo-500'
                }`}
              >
                {isFollowingCreator ? (
                  <>
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Inspector Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-violet-400" />
                  Prompt Inspector
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors text-[9px] uppercase tracking-wider"
                >
                  {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>

              <div className="bg-[#030307] border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="text-left space-y-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Positive Prompt</span>
                  <p className="text-[11px] text-zinc-300 font-sans leading-relaxed select-text font-light">
                    {creation.prompt}
                  </p>
                </div>

                {creation.negativePrompt && (
                  <div className="text-left space-y-1 pt-2.5 border-t border-white/[0.04]">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Negative Prompt</span>
                    <p className="text-[11px] text-zinc-400 font-sans leading-relaxed select-text font-light">
                      {creation.negativePrompt}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Table */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-violet-400" />
                  Technical Parameters
                </span>
                <button
                  onClick={handleCopySettings}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors text-[9px] uppercase tracking-wider"
                >
                  {copiedSettings ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Settings</span>
                </button>
              </div>

              <div className="bg-[#030307] border border-white/5 rounded-2xl p-4 grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-xs select-text">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Model ID</span>
                  <span className="text-zinc-200 text-[11px] font-semibold">{creation.model}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Style preset</span>
                  <span className="text-zinc-200 text-[11px]">{creation.style}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Resolution</span>
                  <span className="text-zinc-200 text-[11px]">{creation.resolution}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Aspect Ratio</span>
                  <span className="text-zinc-200 text-[11px]">{creation.aspectRatio}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Seed Number</span>
                  <span className="text-violet-400 text-[11px] font-medium font-mono">{creation.seed || '94827591823'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Genesis Status</span>
                  <span className="text-emerald-400 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> {creation.status}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Genesis Date</span>
                  <span className="text-zinc-200 text-[11px]">{generationDate}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Genesis Time</span>
                  <span className="text-zinc-200 text-[11px]">{generationTime}</span>
                </div>
              </div>
            </div>

            {/* Creation Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {creation.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.06] rounded-lg border border-white/5 text-[9px] font-mono text-zinc-400 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Toolbar Bottom Panel */}
          <div className="pt-6 border-t border-white/5 space-y-3 mt-6">
            {/* Primary Atelier Workspace Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onRemix(creation)}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-sans font-bold text-[11px] uppercase py-3 rounded-xl tracking-wider cursor-pointer active:scale-95 transition-all border border-white/10 shadow-lg shadow-violet-600/10"
              >
                <RefreshCw className="w-3.5 h-3.5 text-violet-200" />
                <span>Remix / Preload</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  AIStyleHubV17Architecture.queueAssetForPublishing({
                    id: creation.id,
                    title: creation.title,
                    description: creation.prompt,
                    imageUrl: creation.imageUrl,
                    originModule: 'AI_CREATIONS',
                    createdAt: creation.createdAt || new Date().toISOString(),
                    tags: creation.tags,
                    category: creation.creationCategory || 'AI Fashion',
                    styleVibe: creation.style || 'Avant-Garde',
                    qualityScore: 96
                  });
                  AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'PUBLISH', creation.style || 'Avant-Garde');
                  window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                    detail: '🚀 Queued to HomeHub Universal Publishing Gateway!'
                  }));
                }}
                className="flex items-center justify-center gap-1.5 bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 font-sans font-bold text-[11px] uppercase py-3 rounded-xl tracking-wider cursor-pointer active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Send to HomeHub Gateway</span>
              </button>
            </div>

            {/* HomeHub Integrated Feedback Bar */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onLike(creation.id);
                  AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'LIKE', creation.style || 'Avant-Garde');
                  window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
                }}
                className={`py-2 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isLiked 
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' 
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'DISLIKE', creation.style || 'Avant-Garde');
                  window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                    detail: '👎 Dislike signal logged for AI Learning Engine'
                  }));
                }}
                className="bg-black/40 border border-white/5 hover:border-amber-500/30 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <ThumbsDown className="w-3 h-3" />
                <span>Dislike</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'NOT_RELATED', creation.style || 'Avant-Garde');
                  window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                    detail: '🚫 Irrelevant signal logged'
                  }));
                }}
                className="bg-black/40 border border-white/5 hover:border-orange-500/30 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <AlertCircle className="w-3 h-3" />
                <span>Irrelevant</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = creation.imageUrl;
                  link.download = `${creation.title.replace(/\s+/g, '_')}_AIStyleHub.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  AIStyleHubV17Architecture.addDownloadItem({
                    title: creation.title,
                    imageUrl: creation.imageUrl,
                    originModule: 'AI_CREATIONS',
                    fileFormat: 'PNG (Ultra 4K)',
                    resolution: creation.resolution || '2048x2048'
                  });
                  AIStyleHubV17Architecture.convertToAnonymousDraft({
                    imageUrl: creation.imageUrl,
                    title: creation.title,
                    originModule: 'AI_CREATIONS',
                    category: creation.creationCategory || 'AI Fashion',
                    styleVibe: creation.style || 'Avant-Garde',
                    tags: creation.tags
                  });
                  AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'DOWNLOAD', creation.style || 'Avant-Garde');
                  window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                    detail: '⬇ Downloaded & archived into Anonymous Drafts!'
                  }));
                }}
                className="bg-emerald-950/20 border border-emerald-500/20 hover:bg-emerald-900/30 text-emerald-300 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>

            {/* Discard / Anonymous Draft Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  AIStyleHubV17Architecture.convertToAnonymousDraft({
                    imageUrl: creation.imageUrl,
                    title: creation.title,
                    originModule: 'AI_CREATIONS',
                    category: creation.creationCategory || 'AI Fashion',
                    styleVibe: creation.style || 'Avant-Garde',
                    tags: creation.tags
                  });
                  AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'DISCARD', creation.style || 'Avant-Garde');
                  if (onDelete) onDelete(creation.id);
                  onClose();
                  window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                    detail: '🗑 Discarded & anonymized into Anonymous Draft Engine'
                  }));
                }}
                className="w-full bg-rose-950/20 border border-rose-500/20 hover:bg-rose-900/30 text-rose-300 py-2.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Discard & Convert to Anonymous Draft</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
