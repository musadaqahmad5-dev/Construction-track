import React from 'react';
import { motion } from 'motion/react';
import { Users, MoreVertical, Heart, MessageCircle, Bookmark, ChevronRight } from 'lucide-react';

interface CommunityFeedProps {
  communityTab: string;
  setCommunityTab: (tab: string) => void;
  communityPosts: any[];
  seedCommunityFits: any[];
  likedPosts: Record<string, boolean>;
  toggleLike: (id: string) => void;
  toggleBookmark: (id: string) => void;
  bookmarkedPosts: Record<string, boolean>;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  communityTab,
  setCommunityTab,
  communityPosts,
  seedCommunityFits,
  likedPosts,
  toggleLike,
  toggleBookmark,
  bookmarkedPosts
}) => {
  return (
    <div className="lg:col-span-1 space-y-6 bg-gradient-to-b from-[#07070c] to-transparent p-5 rounded-3xl border border-white/5 shadow-2xl">
      <div className="space-y-2 pb-3 border-b border-white/5 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-blue-400 fill-blue-400/5" />
            <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-white">Community</h3>
          </div>
          <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">Live Feed</span>
        </div>
        <p className="text-[10px] text-zinc-500 font-sans leading-relaxed font-light">Real silhouettes and combinations shared by global stylists</p>
        
        {/* Elegant sub-tabs */}
        <div className="flex flex-wrap gap-1.5 pt-3">
          {['Following', 'Popular', 'New', 'Challenge'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCommunityTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-semibold transition-all cursor-pointer ${
                communityTab === tab 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-[#0f0f18]/60 text-zinc-400 hover:bg-white/5 hover:text-white border border-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {(communityTab === 'Following' ? [
          {
            id: 'comm-f-1',
            username: 'Ayesha Malik',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop',
            imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop',
            caption: 'Street style walking vibes in urban neutral tones, wool and silk combo.',
            likesCount: '2.6K',
            commentsCount: 89,
            time: '2h ago'
          },
          {
            id: 'comm-f-2',
            username: 'Hamza Ali',
            userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&auto=format&fit=crop',
            imageUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=500&auto=format&fit=crop',
            caption: 'Ready for monochrome tailoring season. Minimal structured overcoat.',
            likesCount: '1.8K',
            commentsCount: 72,
            time: '4h ago'
          }
        ] : (communityPosts.length > 0 ? communityPosts : seedCommunityFits)).map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#080810] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/20 hover:scale-[1.01] duration-300 transition-all group shadow-2xl flex flex-col"
          >
            {/* Community Header with Avatar & Time */}
            <div className="p-3.5 flex items-center justify-between text-left border-b border-white/[0.02]">
              <div className="flex items-center gap-3">
                <img src={item.userAvatar || null} 
                  className="w-8 h-8 rounded-full object-cover border border-white/10"
                  alt="" 
                />
                <div>
                  <span className="block text-xs font-bold text-white leading-tight">{item.username}</span>
                  <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">{item.time}</span>
                </div>
              </div>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Connecting to stylist network node.' }))}
                className="p-1.5 text-zinc-400 hover:text-white bg-[#0e0e18] hover:bg-white/5 rounded-xl border border-white/5 transition-all cursor-pointer"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
              <img src={item.imageUrl || null} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4">
                <p className="text-[10px] text-zinc-200 line-clamp-2 leading-relaxed text-left">{item.caption}</p>
              </div>
            </div>

            <div className="p-3.5 text-left bg-[#080810]">
              <div className="flex justify-between items-center text-[10.5px] font-mono text-zinc-400">
                <div className="flex gap-4">
                  <button onClick={() => toggleLike(item.id)} className={`flex items-center gap-1.5 hover:text-rose-400 transition-colors ${likedPosts[item.id] ? 'text-rose-400' : ''}`}>
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{item.likesCount}</span>
                  </button>
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{item.commentsCount || 12}</span>
                  </span>
                </div>
                
                <button
                  onClick={() => toggleBookmark(item.id)}
                  className={`hover:text-violet-400 flex items-center gap-1.5 transition-colors p-1.5 rounded-lg bg-[#0e0e18] border border-white/5 ${bookmarkedPosts[item.id] ? 'text-violet-400' : 'text-zinc-500'}`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedPosts[item.id] ? 'fill-violet-400 text-violet-400' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={() => {
          window.dispatchEvent(new CustomEvent('lookvision_navigate', { detail: 'COMMUNITY_ROOM' }));
        }}
        className="w-full py-3 bg-[#0d0d18]/80 hover:bg-blue-950/20 border border-blue-500/15 hover:border-blue-500/30 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <span>Explore Community Archives</span>
        <ChevronRight className="w-4 h-4 animate-pulse" />
      </button>
    </div>
  );
};
