import React from 'react';
import { AlertCircle, Sparkles, X, ArrowUpRight, Check, Crown, Zap } from 'lucide-react';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits?: number;
  availableCredits?: number;
  creditType?: string;
  reason?: string;
  onUpgradePlan?: (planId: string) => void;
}

export const LimitReachedModal: React.FC<LimitReachedModalProps> = ({
  isOpen,
  onClose,
  requiredCredits = 20,
  availableCredits = 0,
  creditType = 'image',
  reason,
  onUpgradePlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#07070f] border border-violet-500/30 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
          AI Generation Capacity Limit
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
          {reason || `You have reached your allocated ${creditType.toUpperCase()} credit pool limit. Upgrade your LOOK VISION membership to unlock higher capacity & 4K ultra-HD generations.`}
        </p>

        {/* Credit Delta Summary */}
        <div className="bg-[#0a0a14] border border-white/5 rounded-2xl p-4 mb-6 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Required Credits</span>
            <span className="text-amber-400 font-bold text-sm">{requiredCredits} {creditType.toUpperCase()}</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div>
            <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Available Pool</span>
            <span className="text-rose-400 font-bold text-sm">{availableCredits} {creditType.toUpperCase()}</span>
          </div>
        </div>

        {/* Tier Upgrade Highlights */}
        <div className="space-y-3 mb-6">
          <div
            onClick={() => {
              onUpgradePlan?.('PREMIUM');
              onClose();
            }}
            className="p-3 bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border border-violet-500/30 hover:border-violet-500/60 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">Style Studio Pro</h4>
                <p className="text-[11px] text-zinc-400">1,500 Images + 300 Try-Ons monthly</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs font-semibold text-violet-400">
              <span>$29/mo</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => {
              onUpgradePlan?.('CREATOR_PRO');
              onClose();
            }}
            className="p-3 bg-gradient-to-r from-amber-900/20 to-purple-900/20 border border-amber-500/30 hover:border-amber-500/60 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">Creator Operating System</h4>
                <p className="text-[11px] text-zinc-400">8,000 Images + 1,500 Try-Ons + Seller Studio</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs font-semibold text-amber-400">
              <span>$99/mo</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium rounded-xl transition-colors border border-white/5"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onUpgradePlan?.('PREMIUM');
              onClose();
            }}
            className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-900/40 transition-all flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade Capacity</span>
          </button>
        </div>
      </div>
    </div>
  );
};
