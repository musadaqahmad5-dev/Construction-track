import React from 'react';
import { useThemeIntelligence, ThemeValidationLayer } from '../engine';
import { Sparkles, Palette, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

export const AdminVirtualThemePanel: React.FC = () => {
  let themeCtx: ReturnType<typeof useThemeIntelligence> | null = null;
  try {
    themeCtx = useThemeIntelligence();
  } catch {
    themeCtx = null;
  }

  const activeTheme = themeCtx?.activeThemeName || 'cyber ai';
  const sequenceId = themeCtx?.sequenceId || 'CYBERAI-DEFAULT-SEQ';
  const switchTheme = themeCtx?.switchTheme;
  const regenerateSequence = themeCtx?.regenerateSequence;

  return (
    <div className="w-full bg-[#0c0c16] border border-white/5 rounded-2xl p-6 space-y-6 text-zinc-100">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-mono font-bold tracking-tight text-white flex items-center gap-2">
              THEME INTELLIGENCE ENGINE
              <span className="text-[9px] font-mono tracking-widest uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Production Active
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Live spectrum tokens, coat layer DNA, and user sequence memory diagnostics.
            </p>
          </div>
        </div>

        {regenerateSequence && (
          <button
            onClick={() => regenerateSequence()}
            className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white font-mono text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Sequence</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Active Preset</span>
          <span className="text-sm font-mono font-bold text-violet-400 uppercase">{activeTheme}</span>
        </div>

        <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Sequence Memory ID</span>
          <span className="text-xs font-mono font-bold text-zinc-200 truncate block">{sequenceId}</span>
        </div>

        <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Coat & Visual Status</span>
          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Coat DNA Synchronized</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase">Available Theme Spectrums</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {ThemeValidationLayer.SUPPORTED_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => switchTheme && switchTheme(preset)}
              className={`p-3 rounded-xl border text-center transition-all font-mono text-xs uppercase cursor-pointer ${
                activeTheme === preset
                  ? 'bg-violet-600 text-white border-violet-400 shadow-lg shadow-violet-500/20'
                  : 'bg-zinc-950 text-zinc-400 border-white/5 hover:border-violet-500/30 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
