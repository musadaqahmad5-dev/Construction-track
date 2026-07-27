import React, { useState } from 'react';
import { 
  Folder, Heart, Eye, Bookmark, Sparkles, Award, Users, 
  Settings, Grid, Plus, Check, ChevronRight, Lock, ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { AICreation, AICreationCreator } from './types';
import { CreationCard } from './CreationCard';

interface PortfolioSectionProps {
  creator: AICreationCreator;
  creations: AICreation[];
  likedMap: Record<string, boolean>;
  savedCollections: Record<string, string[]>; // collectionName -> creationIds[]
  onSelectCreation: (creation: AICreation) => void;
  onLikeCreation: (id: string, e: React.MouseEvent) => void;
  onSaveCreation: (id: string, e: React.MouseEvent) => void;
  onVisitCreator: (creatorId: string, e: React.MouseEvent) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  creator,
  creations,
  likedMap,
  savedCollections,
  onSelectCreation,
  onLikeCreation,
  onSaveCreation,
  onVisitCreator
}) => {
  const [portfolioTab, setPortfolioTab] = useState<'CREATIONS' | 'COLLECTIONS' | 'FAVORITES' | 'FEATURED'>('CREATIONS');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Filter owned creations
  const ownedCreations = creations.filter(c => c.creator.id === creator.id || c.creator.id === 'creator-current-user');
  
  // Total likes received on their own items
  const totalLikes = ownedCreations.reduce((sum, item) => sum + item.likesCount + (likedMap[item.id] ? 1 : 0), 0);
  
  // Total views received
  const totalViews = ownedCreations.reduce((sum, item) => sum + item.viewsCount, 0);

  // Favorite creations (where likedMap is true)
  const favoriteCreations = creations.filter(c => likedMap[c.id]);

  // Featured creations (with >250 likes or first 2)
  const featuredCreations = ownedCreations.filter(c => c.likesCount > 200 || c.id === 'look-c-1' || c.id === 'look-c-4');

  // Group creations by collection
  const renderCollectionGrid = () => {
    if (selectedCollection) {
      const targetIds = savedCollections[selectedCollection] || [];
      const collectionCreations = creations.filter(c => targetIds.includes(c.id));

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#07070c]/50 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button 
                onClick={() => setSelectedCollection(null)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                Collections
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-violet-400 font-bold">{selectedCollection}</span>
            </div>
            <button
              onClick={() => setSelectedCollection(null)}
              className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Back to folders ↖
            </button>
          </div>

          {collectionCreations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl bg-[#07070c]/30 text-center space-y-2">
              <span className="text-zinc-500 text-xs font-mono">No creations in this collection yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {collectionCreations.map(creation => (
                <CreationCard
                  key={creation.id}
                  creation={creation}
                  onSelect={onSelectCreation}
                  onLike={onLikeCreation}
                  isLiked={!!likedMap[creation.id]}
                  onSave={onSaveCreation}
                  isSaved={true}
                  onVisitCreator={onVisitCreator}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    const availableCollections = Object.keys(savedCollections);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {availableCollections.map(colName => {
          const itemIds = savedCollections[colName] || [];
          const count = itemIds.length;
          
          // Get a thumbnail from the first item if available
          const firstItem = creations.find(c => itemIds.includes(c.id));
          const thumbnail = firstItem ? firstItem.imageUrl : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200';

          return (
            <div
              key={colName}
              onClick={() => setSelectedCollection(colName)}
              className="group bg-[#080810]/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300 shadow-xl cursor-pointer aspect-[1.3/1]"
            >
              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-md shrink-0">
                  <Folder className="w-6 h-6" />
                </div>
                <div className="text-left space-y-0.5 truncate">
                  <h4 className="text-sm font-bold text-zinc-100 group-hover:text-violet-400 transition-colors truncate">
                    {colName}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    {count} {count === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              {/* Stacked overlapping preview squares */}
              <div className="flex justify-between items-end pt-4 mt-auto">
                <span className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                  Open Collection <ChevronRight className="w-3.5 h-3.5" />
                </span>
                
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow-lg shrink-0">
                  <img src={thumbnail} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Portfolio Header & Panoramic Cover Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#030307] min-h-[220px] flex flex-col justify-end">
        {/* Cover Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
            alt="Atelier Cover"
            className="w-full h-full object-cover opacity-35 filter saturate-[0.85] blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/40 to-black/10" />
        </div>

        {/* Banner Details Block */}
        <div className="relative p-6 z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10 shadow-2xl relative -mb-2 bg-zinc-900 shrink-0"
            />
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-violet-400 font-bold block">
                Verified AI Artist
              </span>
              <h2 className="text-2xl font-bold font-sans text-white tracking-wide leading-none">
                {creator.name}
              </h2>
              <p className="text-xs text-zinc-400 max-w-md font-sans leading-relaxed font-light">
                {creator.bio}
              </p>
            </div>
          </div>

          {/* Social and quick follow info */}
          <div className="flex gap-4 self-center sm:self-end shrink-0">
            <div className="text-center font-mono bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2">
              <span className="text-xs font-bold text-white block">{creator.followers}</span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mt-0.5">Followers</span>
            </div>
            <div className="text-center font-mono bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2">
              <span className="text-xs font-bold text-white block">{creator.following}</span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mt-0.5">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Statistics Segment */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total AI Creations', value: ownedCreations.length, desc: 'Draped meshes solved', icon: Sparkles },
          { label: 'Total Likes', value: totalLikes, desc: 'Across client portfolio', icon: Heart },
          { label: 'Total Views', value: totalViews, desc: 'Unique digital exposures', icon: Eye },
          { label: 'Total Collections', value: Object.keys(savedCollections).length, desc: 'Organized portfolios', icon: Bookmark }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#07070c]/60 border border-white/5 p-4 rounded-2xl text-left space-y-1.5 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none group-hover:opacity-10 duration-500">
                <Icon className="w-16 h-16 text-violet-500" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block font-semibold">{stat.label}</span>
              <h3 className="text-2xl font-bold font-mono text-zinc-100 group-hover:text-violet-400 transition-colors leading-none">{stat.value}</h3>
              <p className="text-[10px] text-zinc-600 font-sans leading-none">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Tabs bar */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2 w-full">
        <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-6 overflow-x-auto w-full">
          {[
            { id: 'CREATIONS', label: 'My Creations', icon: Grid },
            { id: 'COLLECTIONS', label: 'My Collections', icon: Folder },
            { id: 'FAVORITES', label: 'Saved Favorites', icon: Heart },
            { id: 'FEATURED', label: 'Featured Works', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setPortfolioTab(tab.id as any);
                  setSelectedCollection(null);
                }}
                className={`flex items-center gap-1.5 pb-2 text-xs font-mono font-bold uppercase tracking-wider transition-all relative cursor-pointer whitespace-nowrap ${
                  portfolioTab === tab.id
                    ? 'text-violet-400 font-bold border-b-2 border-violet-500'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid View Switcher */}
      <div>
        {portfolioTab === 'CREATIONS' && (
          ownedCreations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl bg-[#07070c]/30 text-center">
              <span className="text-zinc-400 text-xs font-sans">No digital dress meshes solved yet in this session.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ownedCreations.map(creation => (
                <CreationCard
                  key={creation.id}
                  creation={creation}
                  onSelect={onSelectCreation}
                  onLike={onLikeCreation}
                  isLiked={!!likedMap[creation.id]}
                  onSave={onSaveCreation}
                  isSaved={true}
                  onVisitCreator={onVisitCreator}
                />
              ))}
            </div>
          )
        )}

        {portfolioTab === 'COLLECTIONS' && renderCollectionGrid()}

        {portfolioTab === 'FAVORITES' && (
          favoriteCreations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl bg-[#07070c]/30 text-center">
              <span className="text-zinc-500 text-xs font-mono">No creations saved or liked. Explore and bookmark creations first.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {favoriteCreations.map(creation => (
                <CreationCard
                  key={creation.id}
                  creation={creation}
                  onSelect={onSelectCreation}
                  onLike={onLikeCreation}
                  isLiked={true}
                  onSave={onSaveCreation}
                  isSaved={true}
                  onVisitCreator={onVisitCreator}
                />
              ))}
            </div>
          )
        )}

        {portfolioTab === 'FEATURED' && (
          featuredCreations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl bg-[#07070c]/30 text-center">
              <span className="text-zinc-500 text-xs font-mono">Nothing is featured yet. Gather likes to raise creations to the front of your portfolio.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {featuredCreations.map(creation => (
                <CreationCard
                  key={creation.id}
                  creation={creation}
                  onSelect={onSelectCreation}
                  onLike={onLikeCreation}
                  isLiked={!!likedMap[creation.id]}
                  onSave={onSaveCreation}
                  isSaved={true}
                  onVisitCreator={onVisitCreator}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
