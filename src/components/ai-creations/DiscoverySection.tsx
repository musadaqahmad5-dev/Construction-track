import React from 'react';
import { 
  Sparkles, Award, UserCheck, Flame, Compass, Heart, Eye, ArrowRight, Stars 
} from 'lucide-react';
import { motion } from 'motion/react';
import { AICreation, AICreationCreator } from './types';
import { MOCK_CREATORS } from './data';
import { CreationCard } from './CreationCard';

interface DiscoverySectionProps {
  creations: AICreation[];
  likedMap: Record<string, boolean>;
  onSelectCreation: (creation: AICreation) => void;
  onLikeCreation: (id: string, e: React.MouseEvent) => void;
  onSaveCreation?: (id: string, e: React.MouseEvent) => void;
  onVisitCreator: (creatorId: string, e: React.MouseEvent) => void;
  onFollowCreator: (creatorId: string) => void;
  followingCreators: Record<string, boolean>;
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  creations,
  likedMap,
  onSelectCreation,
  onLikeCreation,
  onSaveCreation,
  onVisitCreator,
  onFollowCreator,
  followingCreators
}) => {
  // 1. Trending AI Creations: items with highest likes/views
  const trendingCreations = [...creations].sort((a, b) => b.likesCount - a.likesCount);

  // 2. Editor's Picks: handpicked stunning ones
  const editorsPicks = creations.filter(c => c.id === 'look-c-3' || c.id === 'look-c-5' || c.id === 'look-c-4');

  // 3. Featured Creators list
  const creatorsList = Object.values(MOCK_CREATORS).filter(c => c.id !== 'creator-current-user');

  // 4. Spotlight Creation (Hero section)
  const spotlightCreation = creations.find(c => c.id === 'look-c-1') || creations[0];

  return (
    <div className="space-y-12 animate-fade-in text-left">
      
      {/* 1. HERO SPOTLIGHT CAROUSEL BANNER */}
      {spotlightCreation && (
        <div 
          onClick={() => onSelectCreation(spotlightCreation)}
          className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#030307] min-h-[300px] flex flex-col justify-end group cursor-pointer"
        >
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={spotlightCreation.imageUrl} 
              alt={spotlightCreation.title}
              className="w-full h-full object-cover opacity-50 group-hover:scale-105 duration-[2000ms]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/40 to-black/10" />
          </div>

          {/* Interactive details */}
          <div className="relative p-6 md:p-8 z-10 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-violet-600/80 text-white px-2.5 py-1 rounded-full border border-violet-500/20 flex items-center gap-1">
                <Stars className="w-3.5 h-3.5 text-yellow-300 animate-spin" /> TODAY'S SPOTLIGHT CONCEPT
              </span>
              <span className="text-[9px] font-mono text-zinc-400 bg-[#07070c]/80 px-2 py-1 rounded-md border border-white/5">
                {spotlightCreation.model}
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-wide leading-tight group-hover:text-violet-300 transition-colors">
                {spotlightCreation.title}
              </h2>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light font-sans">
                {spotlightCreation.prompt}
              </p>
            </div>

            {/* Creator Row */}
            <div className="flex items-center gap-2.5 pt-1">
              <img 
                src={spotlightCreation.creator.avatar} 
                className="w-6 h-6 rounded-full object-cover border border-white/10" 
              />
              <span className="text-[10px] font-mono text-zinc-300 font-semibold">
                @{spotlightCreation.creator.name}
              </span>
              <span className="text-zinc-600 font-mono text-xs">•</span>
              <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-widest flex items-center gap-1">
                Explore Spotlights <ArrowRight className="w-3 h-3 group-hover:translate-x-1 duration-300" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDITOR'S PICKS SECTION */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-violet-400" /> Editor's Premium Picks
          </h3>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-light">
            Curated weekly concepts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {editorsPicks.map(creation => (
            <div 
              key={`ed-pick-${creation.id}`}
              onClick={() => onSelectCreation(creation)}
              className="bg-[#07070c]/60 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300 shadow-xl cursor-pointer"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 shadow-lg shrink-0">
                <img src={creation.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="text-left flex flex-col justify-between truncate py-0.5">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider font-bold block">{creation.style}</span>
                  <h4 className="text-xs font-bold text-white truncate">{creation.title}</h4>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed font-light">{creation.prompt}</p>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <span>@{creation.creator.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. NEW AI ARTISTS / FEATURED CREATORS ROW */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-violet-400" /> Discover Featured Artists
          </h3>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-light">
            Global creation masterminds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creatorsList.map(creator => {
            const isFollowing = !!followingCreators[creator.id];
            return (
              <div 
                key={creator.id}
                onClick={(e) => onVisitCreator(creator.id, e)}
                className="bg-[#080812]/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-violet-500/20 transition-colors shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <img src={creator.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" />
                  <div className="text-left truncate space-y-0.5">
                    <h4 className="text-xs font-bold text-white hover:text-violet-400 transition-colors">{creator.name}</h4>
                    <p className="text-[9px] text-zinc-400 font-mono truncate max-w-[140px]">{creator.bio}</p>
                    <p className="text-[9px] text-zinc-600 font-mono">{creator.followers} followers</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollowCreator(creator.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                    isFollowing
                      ? 'bg-zinc-800 text-zinc-400 border border-white/5 hover:bg-zinc-700'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TRENDING CREATIONS GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-violet-400 animate-bounce" /> Trending Wearable Concepts
          </h3>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-light">
            High performance drapes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {trendingCreations.map(creation => (
            <CreationCard
              key={`trending-${creation.id}`}
              creation={creation}
              onSelect={onSelectCreation}
              onLike={onLikeCreation}
              isLiked={!!likedMap[creation.id]}
              onSave={onSaveCreation}
              isSaved={false}
              onVisitCreator={onVisitCreator}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
