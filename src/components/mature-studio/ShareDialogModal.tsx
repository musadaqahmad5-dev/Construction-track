import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Lock, Globe, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { MatureGeneratedAsset } from '../../types/matureStudio';

interface ShareDialogModalProps {
  asset: MatureGeneratedAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmShare: (asset: MatureGeneratedAsset, targetVisibility: 'public' | 'private') => void;
}

export const ShareDialogModal: React.FC<ShareDialogModalProps> = ({
  asset,
  isOpen,
  onClose,
  onConfirmShare
}) => {
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'private'>('public');

  if (!isOpen || !asset) return null;

  const isPublic = selectedVisibility === 'public';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#07070c] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)] text-zinc-100"
        >
          {/* Modal Header */}
          <div className="p-5 bg-gradient-to-r from-slate-950 to-[#07070c] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-serif">Community Memory Publishing</h3>
                <p className="text-[11px] text-zinc-400">Explicit creator permission workflow</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 space-y-5">
            {/* Asset Preview Row */}
            <div className="flex items-center space-x-4 p-3 rounded-xl bg-slate-950 border border-white/5">
              <img
                src={asset.generatedAsset}
                alt={asset.title}
                className="w-16 h-20 object-cover rounded-lg border border-white/10 shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{asset.title}</h4>
                <p className="text-[10px] text-zinc-400 font-mono uppercase">{asset.category}</p>
                <p className="text-[10px] text-zinc-500 line-clamp-1 italic font-serif">"{asset.prompt}"</p>
              </div>
            </div>

            {/* Privacy Rule Guarantee Box */}
            <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs space-y-1.5">
              <div className="flex items-center space-x-2 text-violet-300 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Strict Privacy Default System</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Creations reside in your <strong className="text-zinc-200">Private Personal Memory</strong> by default. Publishing to <strong className="text-emerald-300">Community Public Memory</strong> makes it visible on the public discovery showcase.
              </p>
            </div>

            {/* Visibility Selector Toggle */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Select Memory Destination
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedVisibility('public')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                    isPublic
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                      : 'bg-slate-950 border-white/5 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Globe className={`w-4 h-4 ${isPublic ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    {isPublic && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">Community Public</span>
                    <span className="text-[10px] text-zinc-400">Visible to global creator showcase</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedVisibility('private')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                    !isPublic
                      ? 'bg-violet-950/40 border-violet-500/60 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                      : 'bg-slate-950 border-white/5 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Lock className={`w-4 h-4 ${!isPublic ? 'text-violet-400' : 'text-zinc-500'}`} />
                    {!isPublic && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">Private Memory</span>
                    <span className="text-[10px] text-zinc-400">Locked exclusively to your account</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onConfirmShare(asset, selectedVisibility);
                  onClose();
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-lg ${
                  isPublic
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>{isPublic ? 'Confirm & Publish Publicly' : 'Keep as Private Memory'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
