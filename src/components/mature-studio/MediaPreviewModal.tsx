import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  Film,
  Image as ImageIcon,
  Shirt,
  Bookmark,
  Share2,
  Lock,
  Globe,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { MatureGeneratedAsset } from '../../types/matureStudio';

interface MediaPreviewModalProps {
  asset: MatureGeneratedAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onSendToTryOn?: (assetUrl: string, title: string) => void;
  onSaveToWardrobe?: (asset: MatureGeneratedAsset) => void;
  onOpenShareModal?: (asset: MatureGeneratedAsset) => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  asset,
  isOpen,
  onClose,
  onSendToTryOn,
  onSaveToWardrobe,
  onOpenShareModal
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen || !asset) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl h-[85vh] bg-[#05050a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-zinc-100 relative"
        >
          {/* Close Lightbox Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Media Stage */}
          <div className="relative md:w-3/5 h-1/2 md:h-full bg-slate-950 flex items-center justify-center overflow-hidden">
            <img
              src={asset.generatedAsset}
              alt={asset.title}
              className="w-full h-full object-contain"
            />

            {asset.type === 'video' && (
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-4">
                <div className="flex justify-start">
                  <span className="px-2.5 py-1 rounded-md bg-purple-600/80 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1">
                    <Film className="w-3 h-3" />
                    <span>Runway Video Showcase</span>
                  </span>
                </div>

                {/* Video Play/Pause Overlay Control */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-4 rounded-full bg-violet-600/80 hover:bg-violet-500 text-white backdrop-blur-md border border-white/20 shadow-xl transition-transform hover:scale-110 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>
                </div>

                {/* Simulated Video Timeline Bar */}
                <div className="space-y-1 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>00:04 / 00:15</span>
                    <span>1080p Haute Couture Stream</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-full w-1/3 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Fashion Details Panel */}
          <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-[#07070c] border-t md:border-t-0 md:border-l border-white/5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-violet-500/15 border border-violet-500/30 text-violet-300">
                  {asset.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 text-zinc-400 flex items-center space-x-1">
                  {asset.visibility === 'public' ? (
                    <>
                      <Globe className="w-3 h-3 text-emerald-400" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-violet-400" />
                      <span>Private</span>
                    </>
                  )}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white font-serif leading-snug">{asset.title}</h2>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Design Prompt</span>
                <p className="text-xs text-zinc-300 font-serif italic leading-relaxed">"{asset.prompt}"</p>
              </div>

              {/* Technical Atelier Parameters */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Haute Couture Specs</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-zinc-500 block font-mono">Style Preset</span>
                    <span className="text-zinc-200 capitalize font-medium">{asset.stylePreset.replace('_', ' ')}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-zinc-500 block font-mono">Drape Tension</span>
                    <span className="text-violet-300 font-bold">{asset.parameters?.drapeTension ?? 75}%</span>
                  </div>

                  {asset.material && (
                    <div className="col-span-2 p-2.5 rounded-lg bg-slate-950 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block font-mono">Material Composition</span>
                      <span className="text-zinc-200 font-medium truncate block">{asset.material}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  onSendToTryOn?.(asset.generatedAsset, asset.title);
                  onClose();
                }}
                className="w-full min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/25"
              >
                <Shirt className="w-4 h-4" />
                <span>Send to 3D Virtual Try-On</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSaveToWardrobe?.(asset)}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-medium text-zinc-200 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-violet-400" />
                  <span>{asset.savedToWardrobe ? 'Saved' : 'Save Wardrobe'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenShareModal?.(asset);
                  }}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-medium text-zinc-200 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>{asset.visibility === 'public' ? 'Public' : 'Share Public'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
