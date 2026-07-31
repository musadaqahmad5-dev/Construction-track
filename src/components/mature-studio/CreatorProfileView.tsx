import React, { useState } from 'react';
import { CreatorProfile, MatureGeneratedAsset, FashionCollection } from '../../types/matureStudio';
import { Crown, Sparkles, UserCheck, UserPlus, Shield, Award, MapPin, Calendar, Heart, Eye, ArrowUpRight, MessageSquare, Send } from 'lucide-react';

interface CreatorProfileViewProps {
  creator: CreatorProfile;
  works: MatureGeneratedAsset[];
  collections: FashionCollection[];
  onSelectWork?: (asset: MatureGeneratedAsset) => void;
  onOpenBespokeModal?: (creator: CreatorProfile) => void;
  onFollowToggle?: (creatorId: string, currentFollowState: boolean) => void;
}

export const CreatorProfileView: React.FC<CreatorProfileViewProps> = ({
  creator,
  works,
  collections,
  onSelectWork,
  onOpenBespokeModal,
  onFollowToggle
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'collections' | 'about'>('portfolio');
  const [isFollowing, setIsFollowing] = useState<boolean>(creator.isFollowing || false);
  const [followersCount, setFollowersCount] = useState<number>(creator.followersCount);

  const handleFollowClick = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount(prev => prev + (nextState ? 1 : -1));
    if (onFollowToggle) {
      onFollowToggle(creator.id, nextState);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Banner & Identity Card */}
      <div className="relative rounded-2xl bg-slate-950/90 border border-white/10 overflow-hidden shadow-2xl">
        {/* Cover Banner */}
        <div className="h-44 sm:h-56 w-full relative overflow-hidden bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950">
          {creator.coverBanner ? (
            <img 
              src={creator.coverBanner} 
              alt={creator.name} 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-slate-950 to-slate-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-[#05050a] shadow-xl bg-slate-900">
                <img 
                  src={creator.avatar} 
                  alt={creator.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              {creator.verified && (
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow-lg" title="Verified Atelier Creator">
                  <Shield className="w-4 h-4 fill-slate-950" />
                </div>
              )}
            </div>

            {/* Name & Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">{creator.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>{creator.creatorLevel}</span>
                </span>
              </div>
              <p className="text-sm font-mono text-violet-400/90">{creator.handle}</p>
              
              <div className="flex items-center space-x-4 text-xs text-zinc-400 pt-1 flex-wrap gap-y-1">
                {creator.location && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{creator.location}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Joined {creator.joinedDate}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-zinc-300 border border-white/10 font-mono">
                  {creator.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={handleFollowClick}
              className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isFollowing 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Following Creator</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow Creator</span>
                </>
              )}
            </button>

            {onOpenBespokeModal && (
              <button
                onClick={() => onOpenBespokeModal(creator)}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Request Bespoke Piece</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio & Stats Strip */}
        <div className="px-6 pb-6 pt-2 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
            {creator.bio}
          </p>

          {/* Metrics & Reputation Gauge */}
          <div className="flex items-center space-x-6 bg-slate-900/80 p-3 rounded-xl border border-white/5 shrink-0">
            <div className="text-center px-2">
              <span className="block text-lg font-bold text-white font-mono">{works.length || creator.publishedWorks}</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Creations</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center px-2">
              <span className="block text-lg font-bold text-white font-mono">{followersCount.toLocaleString()}</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Followers</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center px-2">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-lg font-bold text-emerald-400 font-mono">{creator.reputationScore}</span>
                <span className="text-[10px] text-emerald-500 font-bold">/100</span>
              </div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Reputation</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Portfolio Works ({works.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'collections'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Fashion Collections ({collections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Atelier Expertise & Accreditation</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {works.map((work) => (
            <div 
              key={work.id}
              onClick={() => onSelectWork?.(work)}
              className="group relative rounded-xl bg-slate-900/80 border border-white/5 overflow-hidden hover:border-violet-500/40 hover:scale-[1.01] transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="aspect-[3/4] w-full relative overflow-hidden bg-slate-950">
                <img 
                  src={work.generatedAsset} 
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                
                <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-violet-300">
                  {work.category}
                </span>

                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">{work.title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{work.material || work.prompt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div key={col.id} className="rounded-2xl bg-slate-900/90 border border-white/10 p-5 space-y-4 hover:border-violet-500/30 transition-all">
              <div className="h-48 w-full rounded-xl overflow-hidden relative">
                <img src={col.coverImage} alt={col.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300">
                  {col.season || 'SS26 Drop'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif">{col.title}</h3>
                <p className="text-xs text-violet-300 mt-0.5">{col.tagline}</p>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{col.description}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/5">
                <span>{col.creationIds.length} Couture Pieces</span>
                <span className="font-mono text-emerald-400 font-semibold">{col.estimatedValuation}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white font-serif flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Specializations & Textile Alchemy</span>
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {creator.expertise.map((exp, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono">
                  ✨ {exp}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Style Category</h4>
            <span className="text-sm text-zinc-200 font-semibold">{creator.styleCategory}</span>
          </div>
        </div>
      )}
    </div>
  );
};
