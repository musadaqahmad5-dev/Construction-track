import React from 'react';
import { Sparkles, Shirt, SlidersHorizontal, Palette } from 'lucide-react';

interface QuickActionsProps {
  setActiveSubTab?: (tab: any) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ setActiveSubTab }) => {
  return (
    <div className="bg-[#07070c] border border-white/5 rounded-3xl p-4.5 space-y-3.5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
      <h3 className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase text-left">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2.5">
        <button 
          onClick={() => setActiveSubTab && setActiveSubTab('AI_STUDIO')}
          className="bg-[#121124] hover:bg-violet-600 border border-violet-500/20 hover:border-violet-500/40 rounded-2xl p-3 flex flex-col gap-2 transition-all duration-300 cursor-pointer group text-left shadow-lg shadow-violet-950/10 hover:-translate-y-0.5"
        >
          <div className="p-1.5 bg-violet-500/20 rounded-xl text-violet-300 w-fit group-hover:bg-white group-hover:text-violet-600 transition-all">
            <Sparkles className="w-4 h-4 fill-violet-300 group-hover:fill-violet-600" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-white group-hover:text-white">AI Studio</span>
            <span className="block text-[8.5px] font-mono text-zinc-500 mt-0.5 group-hover:text-white/60">Generate looks</span>
          </div>
        </button>

        <button 
          onClick={() => setActiveSubTab && setActiveSubTab('VIRTUAL_TRY' as any)}
          className="bg-[#0e0e18] hover:bg-[#1a1a2b] border border-white/5 hover:border-white/15 rounded-2xl p-3 flex flex-col gap-2 transition-all duration-300 cursor-pointer group text-left hover:-translate-y-0.5"
        >
          <div className="p-1.5 bg-white/5 rounded-xl text-zinc-400 w-fit group-hover:bg-violet-600 group-hover:text-white transition-all">
            <Shirt className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-zinc-300 group-hover:text-white">Virtual Try-On</span>
            <span className="block text-[8.5px] font-mono text-zinc-500 mt-0.5 group-hover:text-zinc-400">Apply garments</span>
          </div>
        </button>

        <button 
          onClick={() => setActiveSubTab && setActiveSubTab('OUTFIT_GEN' as any)}
          className="bg-[#0e0e18] hover:bg-[#1a1a2b] border border-white/5 hover:border-white/15 rounded-2xl p-3 flex flex-col gap-2 transition-all duration-300 cursor-pointer group text-left hover:-translate-y-0.5"
        >
          <div className="p-1.5 bg-white/5 rounded-xl text-zinc-400 w-fit group-hover:bg-violet-600 group-hover:text-white transition-all">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-zinc-300 group-hover:text-white">AI Stylist</span>
            <span className="block text-[8.5px] font-mono text-zinc-500 mt-0.5 group-hover:text-zinc-400">Virtual fitting</span>
          </div>
        </button>

        <button 
          onClick={() => setActiveSubTab && setActiveSubTab('SYSTEM_ROOM' as any)}
          className="bg-[#0e0e18] hover:bg-[#1a1a2b] border border-white/5 hover:border-white/15 rounded-2xl p-3 flex flex-col gap-2 transition-all duration-300 cursor-pointer group text-left hover:-translate-y-0.5"
        >
          <div className="p-1.5 bg-white/5 rounded-xl text-zinc-400 w-fit group-hover:bg-violet-600 group-hover:text-white transition-all">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-zinc-300 group-hover:text-white">Color Palette</span>
            <span className="block text-[8.5px] font-mono text-zinc-500 mt-0.5 group-hover:text-zinc-400">Aesthetic codes</span>
          </div>
        </button>
      </div>
    </div>
  );
};
