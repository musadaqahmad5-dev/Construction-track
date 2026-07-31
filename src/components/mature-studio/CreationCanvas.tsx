import React from 'react';
import {
  Play,
  Film,
  Image as ImageIcon,
  Globe,
  Lock,
  Shirt,
  Bookmark,
  Share2,
  Maximize2,
  Crown,
  Sparkles
} from 'lucide-react';
import { MatureGeneratedAsset } from '../../types/matureStudio';

interface CreationCanvasProps {
  activeAsset: MatureGeneratedAsset | null;
  displayedList: MatureGeneratedAsset[];
  activeMemoryTab: 'personal' | 'community';
  onSelectAsset: (asset: MatureGeneratedAsset) => void;
  onOpenLightbox: (asset: MatureGeneratedAsset) => void;
  onSendToTryOn?: (assetUrl: string, title: string) => void;
  onSaveToWardrobe?: (asset: MatureGeneratedAsset) => void;
  onOpenShareModal?: (asset: MatureGeneratedAsset) => void;
}

export const CreationCanvas: React.FC<CreationCanvasProps> = ({
  activeAsset,
  displayedList,
  activeMemoryTab,
  onSelectAsset,
  onOpenLightbox,
  onSendToTryOn,
  onSaveToWardrobe,
  onOpenShareModal
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Primary Active Canvas Stage */}
      {activeAsset ? (
        <div className="bg-[#07070c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-zinc-100">
          
          {/* Image/Video Media Visual Container */}
          <div className="relative aspect-[3/4] md:w-1/2 bg-slate-950 overflow-hidden group">
            <img
              src={activeAsset.generatedAsset}
              alt={activeAsset.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Video Indicator */}
            {activeAsset.type === 'video' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-violet-600/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
            )}

            {/* Lightbox Maximize Overlay Button */}
            <button
              onClick={() => onOpenLightbox(activeAsset)}
              className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center space-x-1 text-[10px] font-mono"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>

            {/* Category Badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-violet-300 uppercase tracking-wider flex items-center space-x-1">
              {activeAsset.type === 'video' ? <Film className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-violet-400" />}
              <span>{activeAsset.category}</span>
            </div>

            {/* Visibility Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-300 flex items-center space-x-1">
              {activeAsset.visibility === 'public' ? (
                <span className="text-emerald-400 flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>Public Community</span>
                </span>
              ) : (
                <span className="text-violet-300 flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Private Memory</span>
                </span>
              )}
            </div>
          </div>

          {/* Asset Metadata & Action Workspace */}
          <div className="p-5 md:w-1/2 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-white leading-snug">{activeAsset.title}</h3>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-white/5 font-serif italic">
                "{activeAsset.prompt}"
              </p>

              <div className="space-y-1 text-[11px] text-zinc-400 pt-2 border-t border-white/5">
                {activeAsset.material && (
                  <div className="flex justify-between">
                    <span>Material Composition:</span>
                    <span className="text-zinc-200 font-medium truncate max-w-[160px]">{activeAsset.material}</span>
                  </div>
                )}
                {activeAsset.parameters?.drapeTension !== undefined && (
                  <div className="flex justify-between">
                    <span>Drape Tension:</span>
                    <span className="text-violet-300 font-medium">{activeAsset.parameters.drapeTension}%</span>
                  </div>
                )}
                {activeAsset.parameters?.lightingAtmosphere && (
                  <div className="flex justify-between">
                    <span>Lighting:</span>
                    <span className="text-zinc-200 capitalize">{activeAsset.parameters.lightingAtmosphere.replace('_', ' ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => onSendToTryOn?.(activeAsset.generatedAsset, activeAsset.title)}
                className="w-full min-h-[40px] rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Shirt className="w-4 h-4" />
                <span>Send to 3D Virtual Try-On</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSaveToWardrobe?.(activeAsset)}
                  className={`min-h-[38px] rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    activeAsset.savedToWardrobe 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-zinc-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-violet-400" />
                  <span>{activeAsset.savedToWardrobe ? 'In Wardrobe' : 'Save Wardrobe'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenShareModal?.(activeAsset)}
                  className={`min-h-[38px] rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    activeAsset.visibility === 'public'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-zinc-300'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeAsset.visibility === 'public' ? 'Public' : 'Share Public'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 2. Lookbook Archive Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            {activeMemoryTab === 'personal' ? 'Personal Memory Atelier Archive' : 'Community Public Showcase'}
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">{displayedList.length} Items</span>
        </div>

        {displayedList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/50 border border-white/5 text-center space-y-2">
            <Crown className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No creations saved in this memory collection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {displayedList.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className={`cursor-pointer group relative aspect-[3/4] rounded-xl overflow-hidden border transition-all ${
                  activeAsset?.id === asset.id
                    ? 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.35)] scale-[1.02]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={asset.generatedAsset} alt={asset.title} className="w-full h-full object-cover" />
                
                {asset.type === 'video' && (
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 backdrop-blur-md text-purple-300">
                    <Film className="w-3 h-3" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                  <span className="text-[10px] font-semibold text-white line-clamp-1">{asset.title}</span>
                  <span className="text-[8px] font-mono text-violet-300 uppercase mt-0.5">{asset.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
