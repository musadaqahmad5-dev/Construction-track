import React from 'react';
import { Flame, ChevronRight } from 'lucide-react';

interface TrendingPanelProps {
  setPromptInput: (value: string) => void;
}

export const TrendingPanel: React.FC<TrendingPanelProps> = ({ setPromptInput }) => {
  return (
    <div className="bg-[#07070c] border border-white/5 rounded-3xl p-4.5 space-y-3.5 shadow-2xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse fill-orange-500/10" />
          <h3 className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase">Trending Tags</h3>
        </div>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Loading full style tag database.' }))}
          className="text-[10px] font-sans font-bold text-violet-400 hover:text-white transition-colors cursor-pointer uppercase tracking-widest bg-transparent border-none"
        >
          See all
        </button>
      </div>

      <div className="space-y-1">
        {[
          { name: '# Streetwear', views: '12.5K' },
          { name: '# OldMoney', views: '9.8K' },
          { name: '# KoreanStyle', views: '8.3K' },
          { name: '# Minimal', views: '7.1K' },
          { name: '# Y2K', views: '6.3K' }
        ].map((tag, tIdx) => (
          <button
            key={tIdx}
            onClick={() => {
              setPromptInput(`A classic high-end ${tag.name.replace('# ', '').toLowerCase()} look`);
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Vibe prompt preset configured: ${tag.name}` }));
            }}
            className="w-full flex justify-between items-center py-1.5 px-2.5 bg-transparent hover:bg-white/5 rounded-xl transition-all text-left text-xs text-zinc-300 group cursor-pointer border border-transparent hover:border-white/5"
          >
            <span className="font-semibold group-hover:text-violet-400 transition-colors">{tag.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-mono text-zinc-500">{tag.views}</span>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
