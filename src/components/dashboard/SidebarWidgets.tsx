import React from 'react';
import { ChevronRight, ChevronDown, Heart } from 'lucide-react';
import { TrendingPanel } from './TrendingPanel';
import { QuickActions } from './QuickActions';

interface SidebarWidgetsProps {
  setActiveSubTab?: (tab: any) => void;
  setPromptInput: (value: string) => void;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  setActiveSubTab,
  setPromptInput
}) => {
  return (
    <div className="xl:col-span-1 space-y-4">
      {/* A. QUICK ACTIONS */}
      <QuickActions setActiveSubTab={setActiveSubTab} />

      {/* B. TRENDING TAGS */}
      <TrendingPanel setPromptInput={setPromptInput} />

      {/* C. TRY VIRTUAL TRY-ON */}
      <div className="relative bg-gradient-to-br from-violet-950/50 via-[#0a0a14] to-black border border-violet-500/10 hover:border-violet-500/35 rounded-3xl overflow-hidden p-4.5 flex justify-between items-center group transition-all duration-300 shadow-2xl">
        <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="space-y-3.5 z-10 max-w-[62%] text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <span className="text-[7.5px] font-mono font-extrabold uppercase tracking-widest text-violet-300">Beta Version</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white font-sans tracking-wide leading-snug">Virtual Studio Try-On</h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans font-light">Layer concepts onto your 3D digital model seamlessly.</p>
          </div>
          <button 
            type="button"
            onClick={() => setActiveSubTab && setActiveSubTab('VIRTUAL_TRY' as any)}
            className="py-1.5 px-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-mono text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <span>Launch Fitting</span>
            <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
          </button>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-[40%] pointer-events-none overflow-hidden flex items-end justify-end">
          <img 
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=250&auto=format&fit=crop" 
            className="h-full w-full object-cover object-center translate-y-3 translate-x-1 group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
            alt="" 
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* D. TOP CONTRIBUTORS */}
      <div className="bg-[#07070c] border border-white/5 rounded-3xl p-4.5 space-y-3.5 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase">Top Contributors</h3>
          <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500 border border-white/5 bg-white/5 px-2 py-0.5 rounded-lg cursor-pointer">
            <span>This Week</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        <div className="space-y-2.5">
          {[
            { rank: 1, name: 'Ayesha Malik', views: '12.4K', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' },
            { rank: 2, name: 'Hamza Ali', views: '9.8K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
            { rank: 3, name: 'Noor Fatima', views: '8.2K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
            { rank: 4, name: 'Zaynab', views: '7.1K', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150&auto=format&fit=crop' }
          ].map((contributor) => (
            <div 
              key={contributor.rank}
              className="flex items-center justify-between py-1 text-left hover:bg-white/[0.01] rounded-xl px-1.5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold text-zinc-600 w-3">{contributor.rank}</span>
                <img 
                  src={contributor.avatar} 
                  className="w-8 h-8 rounded-full object-cover border border-white/10" 
                  alt="" 
                />
                <div>
                  <span className="block text-xs font-bold text-white leading-tight">{contributor.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-violet-400">
                <Heart className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[10.5px] font-mono font-bold text-zinc-400">{contributor.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
