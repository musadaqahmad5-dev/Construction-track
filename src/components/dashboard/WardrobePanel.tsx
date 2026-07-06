import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, MessageCircle, RefreshCw, ChevronRight, Sparkle } from 'lucide-react';

interface WardrobePanelProps {
  aiCreationsTab: string;
  setAiCreationsTab: (tab: string) => void;
  aiLooks: any[];
  seedAiLooks: any[];
  likedPosts: Record<string, boolean>;
  toggleLike: (id: string) => void;
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  setActiveSubTab?: (tab: any) => void;
}

export const WardrobePanel: React.FC<WardrobePanelProps> = ({
  aiCreationsTab,
  setAiCreationsTab,
  aiLooks,
  seedAiLooks,
  likedPosts,
  toggleLike,
  onAddGarment,
  setActiveSubTab
}) => {
  return (
    <div className="lg:col-span-1 space-y-6 bg-gradient-to-b from-[#07070c] to-transparent p-5 rounded-3xl border border-white/5 shadow-2xl">
      <div className="space-y-2 pb-3 border-b border-white/5 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-violet-400 fill-violet-400/10 animate-pulse" />
            <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-white">AI Studio</h3>
          </div>
          <span className="text-[9px] font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded">Engine Online</span>
        </div>
        <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">Generative fashion design concepts curated by the network</p>
        
        {/* Elegant sub-tabs */}
        <div className="flex flex-wrap gap-1.5 pt-3">
          {['For You', 'Trending', 'New', 'Remix'].map((tab) => (
            <button
              key={tab}
              onClick={() => setAiCreationsTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-semibold transition-all cursor-pointer ${
                aiCreationsTab === tab 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                  : 'bg-[#0f0f18]/60 text-zinc-400 hover:bg-white/5 hover:text-white border border-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {(aiCreationsTab === 'For You' ? [
          {
            id: 'ai-f-1',
            title: 'Minimal Beige Overcoat',
            prompt: 'Y2K beige outfit, clean minimalist silhouette, natural heavy drape',
            imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
            likesCount: '2.4K',
            commentsCount: 136,
            creator: 'Elena Rostova',
            creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop'
          },
          {
            id: 'ai-f-2',
            title: 'Y2K Pink Cargo Aura',
            prompt: 'Y2K bright pink streetwear, loose-fitting technical cargos',
            imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500&auto=format&fit=crop',
            likesCount: '3.1K',
            commentsCount: 214,
            creator: 'Zaynab',
            creatorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=80&auto=format&fit=crop'
          }
        ] : (aiLooks.length > 0 ? aiLooks : seedAiLooks)).map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-[#07070c] hover:border-violet-500/30 hover:scale-[1.01] duration-300 transition-all group shadow-2xl flex flex-col"
          >
            <div className="absolute inset-0 bg-zinc-950">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
              />
            </div>

            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-violet-300 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" /> AI CONCEPT
              </span>
            </div>

            <button 
              onClick={() => toggleLike(item.id)}
              className="absolute top-3.5 right-3.5 p-2 bg-black/70 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer z-10 active:scale-90"
            >
              <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Bottom details gradient background overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none z-0" />

            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 text-left z-10">
              <div>
                <h4 className="text-[13px] font-bold text-white leading-snug tracking-wide">{item.title}</h4>
                <p className="text-[9.5px] font-sans text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.prompt.startsWith('Prompt:') ? item.prompt : `Prompt: ${item.prompt}`}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <div className="w-4.5 h-4.5 rounded-full bg-violet-600/30 border border-violet-400/30 flex items-center justify-center shrink-0">
                  <Sparkle className="w-2.5 h-2.5 text-violet-300 fill-violet-300 animate-pulse" />
                </div>
                <span className="text-[10px] font-medium text-zinc-400">{item.creator || 'Sartorial AI Engine'}</span>
              </div>

              <div className="flex justify-between items-center pt-2.5 text-[10.5px] font-mono text-zinc-400 border-t border-white/5">
                <div className="flex gap-4">
                  <button onClick={() => toggleLike(item.id)} className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${likedPosts[item.id] ? 'text-rose-400' : ''}`}>
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{item.likesCount || '1.8K'}</span>
                  </button>
                  <span className="flex items-center gap-1 text-zinc-500">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{item.commentsCount || '48'}</span>
                  </span>
                </div>
                <button 
                  onClick={() => {
                    if (onAddGarment) {
                      onAddGarment(item.title, item.prompt, 'Outerwear', { imageUrl: item.imageUrl });
                      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Sartorial alignment parsed and transferred into your active Closet.' }));
                    }
                  }}
                  className="text-violet-400 hover:text-white uppercase font-sans font-bold text-[9px] tracking-wider flex items-center gap-1.5 cursor-pointer bg-violet-500/10 hover:bg-violet-600 px-2.5 py-1 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>REMIX</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={() => setActiveSubTab && setActiveSubTab('AI_STUDIO')}
        className="w-full py-3 bg-[#0d0d18]/80 hover:bg-violet-950/20 border border-violet-500/15 hover:border-violet-500/30 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <span>View More Generative Concepts</span>
        <ChevronRight className="w-4 h-4 animate-pulse" />
      </button>
    </div>
  );
};
