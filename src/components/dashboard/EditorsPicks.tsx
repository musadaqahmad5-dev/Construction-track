import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface EditorsPicksProps {
  setActiveSubTab?: (tab: any) => void;
}

export const EditorsPicks: React.FC<EditorsPicksProps> = ({ setActiveSubTab }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const editorsPicks = [
    { title: "Summer Edit", subtitle: "2024", imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop" },
    { title: "Monochrome", subtitle: "Collection", imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop" },
    { title: "Wedding", subtitle: "Inspo", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop" },
    { title: "Street Icons", subtitle: "This Week", imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=400&auto=format&fit=crop" },
    { title: "Street Icons", subtitle: "This Week", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400&auto=format&fit=crop" }
  ];

  const scrollHorizontal = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 pt-8 border-t border-white/5 text-left bg-gradient-to-r from-[#07070c] via-transparent to-transparent p-6 rounded-3xl border border-white/5">
      {/* Title Block on the left */}
      <div className="shrink-0 w-full lg:w-48 flex flex-col justify-center space-y-1">
        <div className="flex items-center gap-2">
          <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
          <h3 className="text-xs font-bold text-white tracking-widest uppercase font-sans">Editor's Picks</h3>
        </div>
        <p className="text-[10px] text-zinc-500 font-sans leading-relaxed uppercase tracking-widest">Seasonal drops curated by the fashion bureau</p>
      </div>

      {/* Scrollable list in the center */}
      <div 
        ref={scrollRef}
        className="flex-1 flex gap-5 overflow-x-auto no-scrollbar pb-1.5 select-none w-full"
      >
        {editorsPicks.map((pick, pIdx) => (
          <div 
            key={pIdx}
            className="min-w-[280px] w-[280px] h-[100px] bg-[#07070c] border border-white/5 hover:border-violet-500/20 hover:scale-[1.01] duration-300 rounded-2xl overflow-hidden flex cursor-pointer select-none group shrink-0 transition-all shadow-2xl"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Displaying curated collection: ${pick.title}` }));
              if (setActiveSubTab) setActiveSubTab('AI_STUDIO');
            }}
          >
            {/* Left side: Image */}
            <div className="w-[110px] h-full overflow-hidden relative shrink-0 border-r border-white/5 bg-zinc-950">
              <img 
                src={pick.imageUrl} 
                alt={pick.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; }}
              />
            </div>

            {/* Right side: Metadata and Call to Action */}
            <div className="flex-1 p-3.5 flex flex-col justify-between text-left min-w-0 bg-[#080810]">
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-white font-sans truncate leading-tight group-hover:text-violet-400 transition-colors">{pick.title}</h4>
                <span className="text-[9px] text-zinc-500 font-mono block tracking-wider uppercase">{pick.subtitle}</span>
              </div>
              
              <button className="self-start text-[8px] font-mono font-bold uppercase tracking-widest text-violet-400 bg-violet-600/10 hover:bg-violet-600 hover:text-white px-3 py-1.5 rounded-lg border border-violet-500/20 transition-all">
                VIEW CUT
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Control arrows on the far right */}
      <div className="shrink-0 flex items-center gap-2 pl-2">
        <button 
          onClick={() => scrollHorizontal('left')}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-violet-600 border border-white/5 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => scrollHorizontal('right')}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-violet-600 border border-white/5 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
