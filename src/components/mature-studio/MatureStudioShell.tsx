import React from 'react';
import { Crown, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface MatureStudioShellProps {
  ageVerified: boolean;
  onAgeVerifiedChange: (verified: boolean) => void;
  statusMessage: string | null;
  onDismissStatus: () => void;
  children: React.ReactNode;
}

export const MatureStudioShell: React.FC<MatureStudioShellProps> = ({
  ageVerified,
  onAgeVerifiedChange,
  statusMessage,
  onDismissStatus,
  children
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 text-zinc-100 p-3 sm:p-6 bg-[#05050a] min-h-screen">
      
      {/* 1. Header Banner & Authorizations */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0e0728] via-[#090616] to-[#05050a] border border-violet-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-4 z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/30">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">Mature Fashion Studio</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Haute Couture Atelier</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Editorial couture, luxury corsetry, avant-garde silhouettes, and body-art inspired fashion creativity environment.
            </p>
          </div>
        </div>

        {/* Age & Privacy Control Badge */}
        <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-950/90 border border-white/10 text-xs z-10 shrink-0">
          <ShieldCheck className={`w-5 h-5 ${ageVerified ? 'text-emerald-400' : 'text-zinc-500'}`} />
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-zinc-200">18+ Creator Authorization</span>
            <label className="flex items-center space-x-2 cursor-pointer mt-0.5">
              <input
                type="checkbox"
                checked={ageVerified}
                onChange={(e) => onAgeVerifiedChange(e.target.checked)}
                className="rounded bg-slate-900 border-white/20 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <span className="text-[10px] text-zinc-400 font-mono">Verified & Consented</span>
            </label>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-xs text-violet-200 animate-fade-in flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-violet-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button 
            onClick={onDismissStatus}
            className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase tracking-wider cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Experience Slot */}
      {children}
    </div>
  );
};
