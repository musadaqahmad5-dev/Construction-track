import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Heart, Eye, Bookmark, Share2, Filter, Search, Grid, LayoutGrid, 
  Layers, Plus, Wand2, Compass, Award, User, ArrowRight, Check, SlidersHorizontal, RefreshCw, ChevronDown, Sliders
} from 'lucide-react';
import { 
  useThemeIntelligence, 
  ThemeCoatRenderer, 
  FoundationInteractionWrapper 
} from '../engine';
import { AICreation, AICreationTab } from './ai-creations/types';
import { INITIAL_CREATIONS, MOCK_CREATORS } from './ai-creations/data';
import { CreationCard } from './ai-creations/CreationCard';
import { DiscoverySection } from './ai-creations/DiscoverySection';
import { PortfolioSection } from './ai-creations/PortfolioSection';
import { ImageExperienceModal } from './ai-creations/ImageExperienceModal';

export interface AiCreationsGalleryProps {
  creations?: AICreation[];
  onNavigateTab?: (tab: string) => void;
  onOpenStudio?: (prompt?: string) => void;
  onSelectCreation?: (creation: AICreation) => void;
  initialTab?: string;
  className?: string;
}

export const AiCreationsGallery: React.FC<AiCreationsGalleryProps> = ({
  creations: propCreations,
  onNavigateTab,
  onOpenStudio,
  onSelectCreation: propSelectCreation,
  initialTab = 'GALLERY',
  className = ''
}) => {
  // Connect Theme Intelligence Engine
  let themeCtx: ReturnType<typeof useThemeIntelligence> | null = null;
  try {
    themeCtx = useThemeIntelligence();
  } catch {
    themeCtx = null;
  }

  const themeDNA = themeCtx?.themeDNA;
  const coatDNA = themeCtx?.coatDNA;
  const sequenceId = themeCtx?.sequenceId;

  // Local State
  const [creations, setCreations] = useState<AICreation[]>(propCreations || INITIAL_CREATIONS);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedStyle, setSelectedStyle] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'most_liked' | 'most_saved'>('trending');
  const [selectedCreation, setSelectedCreation] = useState<AICreation | null>(null);
  
  // Likes, Bookmarks, Collections & Follows state
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({
    'look-c-1': true,
    'look-c-4': true
  });
  const [savedCollections, setSavedCollections] = useState<Record<string, string[]>>({
    'Cyberpunk Visions': ['look-c-1', 'look-c-5'],
    'Minimalist Drapes': ['look-c-2', 'look-c-6'],
    'Editor Picks': ['look-c-3']
  });
  const [customCollections, setCustomCollections] = useState<string[]>([
    'Cyberpunk Visions', 'Minimalist Drapes', 'Editor Picks'
  ]);
  const [followingCreators, setFollowingCreators] = useState<Record<string, boolean>>({
    'creator-xenon': true
  });
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);

  // Synchronize propCreations if provided
  React.useEffect(() => {
    if (propCreations && propCreations.length > 0) {
      setCreations(propCreations);
    }
  }, [propCreations]);

  // Handlers
  const handleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedMap(prev => {
      const isCurrentlyLiked = !!prev[id];
      const updated = { ...prev, [id]: !isCurrentlyLiked };
      
      setCreations(list => list.map(item => {
        if (item.id === id) {
          return {
            ...item,
            likesCount: isCurrentlyLiked ? item.likesCount - 1 : item.likesCount + 1
          };
        }
        return item;
      }));

      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: !isCurrentlyLiked ? '❤️ Saved to AI Creations Favorites' : 'Removed from Favorites'
      }));

      return updated;
    });
  };

  const handleSaveToCollection = (id: string, collectionName: string) => {
    setSavedCollections(prev => {
      const existing = prev[collectionName] || [];
      const exists = existing.includes(id);
      const updatedList = exists ? existing.filter(item => item !== id) : [...existing, id];
      
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: exists 
          ? `Removed from collection "${collectionName}"` 
          : `✓ Added creation to collection "${collectionName}"`
      }));

      return {
        ...prev,
        [collectionName]: updatedList
      };
    });
  };

  const handleAddCustomCollection = (name: string) => {
    if (!name.trim()) return;
    if (!customCollections.includes(name)) {
      setCustomCollections(prev => [...prev, name]);
      setSavedCollections(prev => ({ ...prev, [name]: [] }));
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `📁 Created new collection "${name}"`
      }));
    }
  };

  const handleFollowCreator = (creatorId: string) => {
    setFollowingCreators(prev => {
      const isFollowing = !!prev[creatorId];
      const next = { ...prev, [creatorId]: !isFollowing };
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: !isFollowing ? `Followed artist` : `Unfollowed artist`
      }));
      return next;
    });
  };

  const handleSelectCreation = (creation: AICreation) => {
    setSelectedCreation(creation);
    propSelectCreation?.(creation);
  };

  const handleRemix = (creation: AICreation) => {
    if (onOpenStudio) {
      onOpenStudio(creation.prompt);
    } else {
      window.dispatchEvent(new CustomEvent('lookvision_navigate', {
        detail: 'AI_STUDIO'
      }));
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `✨ Loading prompt into AI Generation Studio: "${creation.title}"`
      }));
    }
  };

  const handleGenerateVariations = (creation: AICreation) => {
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `⚡ Triggering AI variations engine for "${creation.title}"`
    }));
  };

  // Filter & Sort Creations
  const filteredCreations = useMemo(() => {
    return creations.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.creator.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStyle = selectedStyle === 'ALL' || 
        item.style.toUpperCase() === selectedStyle.toUpperCase();

      return matchesSearch && matchesStyle;
    }).sort((a, b) => {
      if (sortBy === 'trending') return b.viewsCount - a.viewsCount;
      if (sortBy === 'most_liked') return b.likesCount - a.likesCount;
      if (sortBy === 'most_saved') return b.savesCount - a.savesCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [creations, searchQuery, selectedStyle, sortBy]);

  // Style category options
  const styleCategories = ['ALL', 'STREETWEAR', 'MINIMAL', 'EDITORIAL', 'LUXURY', 'AVANT-GARDE'];

  const renderContent = () => (
    <div className={`w-full h-full space-y-6 p-4 sm:p-6 text-left ${className}`}>
      
      {/* 1. GALLERY HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#07070c] via-[#090914] to-[#07070c] p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-wide text-white">
              AI Fashion Creations Gallery
            </h1>
            {sequenceId && (
              <span className="text-[9px] font-mono text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 hidden lg:inline-block">
                SEQ: {sequenceId.substring(0, 10)}...
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 font-sans font-light max-w-xl">
            Explore haute couture generative meshes, latent cloth prompts, and community AI fashion showcases.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <FoundationInteractionWrapper themeDNA={themeDNA}>
            <button
              onClick={() => {
                if (onOpenStudio) {
                  onOpenStudio();
                } else {
                  window.dispatchEvent(new CustomEvent('lookvision_navigate', { detail: 'AI_STUDIO' }));
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-sans font-bold shadow-lg shadow-violet-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Create AI Look</span>
            </button>
          </FoundationInteractionWrapper>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'GALLERY', label: 'All Creations', icon: Grid },
            { id: 'DISCOVERY', label: 'Spotlight & Discovery', icon: Compass },
            { id: 'PORTFOLIO', label: 'My Atelier Portfolio', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <FoundationInteractionWrapper key={tab.id} themeDNA={themeDNA}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 border border-violet-500/30' 
                      : 'bg-[#0a0a12] text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              </FoundationInteractionWrapper>
            );
          })}
        </div>

        {/* View Grid Switcher */}
        {activeTab === 'GALLERY' && (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#090912] p-1 rounded-xl border border-white/5">
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  gridColumns === 3 ? 'bg-violet-600/30 text-violet-400 border border-violet-500/30' : 'text-zinc-500 hover:text-white'
                }`}
                title="3 Columns"
              >
                <Grid className="w-4 h-4" />
              </button>
            </FoundationInteractionWrapper>
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  gridColumns === 4 ? 'bg-violet-600/30 text-violet-400 border border-violet-500/30' : 'text-zinc-500 hover:text-white'
                }`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </FoundationInteractionWrapper>
          </div>
        )}
      </div>

      {/* 3. GALLERY VIEW */}
      {activeTab === 'GALLERY' && (
        <div className="space-y-6">
          {/* Search & Filtering Control Bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 bg-[#07070c]/80 p-3 rounded-2xl border border-white/5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search prompt keywords, styles, creators, tags..."
                className="w-full bg-[#0d0d16] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>

            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-[#0d0d16] border border-white/5 text-zinc-300 text-xs font-mono rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-violet-500/50 cursor-pointer"
                >
                  <option value="trending">Sort: Trending</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="most_liked">Sort: Most Liked</option>
                  <option value="most_saved">Sort: Most Saved</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Style Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {styleCategories.map(cat => (
              <FoundationInteractionWrapper key={cat} themeDNA={themeDNA}>
                <button
                  onClick={() => setSelectedStyle(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    selectedStyle === cat
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'bg-[#0a0a14] text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat === 'ALL' ? 'All Styles' : cat}
                </button>
              </FoundationInteractionWrapper>
            ))}
          </div>

          {/* Creations Grid */}
          {filteredCreations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-3xl bg-[#07070c]/30 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-zinc-600" />
              <span className="text-zinc-400 text-xs font-sans">No AI creations matched your current search filters.</span>
              <FoundationInteractionWrapper themeDNA={themeDNA}>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStyle('ALL');
                  }}
                  className="text-xs font-mono text-violet-400 hover:underline cursor-pointer"
                >
                  Reset search filters
                </button>
              </FoundationInteractionWrapper>
            </div>
          ) : (
            <div className={`grid grid-cols-2 ${gridColumns === 3 ? 'sm:grid-cols-2 md:grid-cols-3' : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4 sm:gap-6`}>
              {filteredCreations.map(creation => (
                <FoundationInteractionWrapper key={creation.id} themeDNA={themeDNA}>
                  <CreationCard
                    creation={creation}
                    onSelect={handleSelectCreation}
                    onLike={(id, e) => handleLike(id, e)}
                    isLiked={!!likedMap[creation.id]}
                    onSave={(id, e) => {
                      e.stopPropagation();
                      handleSaveToCollection(id, 'Cyberpunk Visions');
                    }}
                    isSaved={savedCollections['Cyberpunk Visions']?.includes(creation.id)}
                    onVisitCreator={(creatorId, e) => {
                      e.stopPropagation();
                      setActiveTab('PORTFOLIO');
                    }}
                  />
                </FoundationInteractionWrapper>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. DISCOVERY VIEW */}
      {activeTab === 'DISCOVERY' && (
        <DiscoverySection
          creations={creations}
          likedMap={likedMap}
          onSelectCreation={handleSelectCreation}
          onLikeCreation={(id, e) => handleLike(id, e)}
          onSaveCreation={(id, e) => {
            e.stopPropagation();
            handleSaveToCollection(id, 'Editor Picks');
          }}
          onVisitCreator={(creatorId, e) => {
            e.stopPropagation();
            setActiveTab('PORTFOLIO');
          }}
          onFollowCreator={handleFollowCreator}
          followingCreators={followingCreators}
        />
      )}

      {/* 5. PORTFOLIO VIEW */}
      {activeTab === 'PORTFOLIO' && (
        <PortfolioSection
          creator={MOCK_CREATORS.currentUser}
          creations={creations}
          likedMap={likedMap}
          savedCollections={savedCollections}
          onSelectCreation={handleSelectCreation}
          onLikeCreation={(id, e) => handleLike(id, e)}
          onSaveCreation={(id, e) => {
            e.stopPropagation();
            handleSaveToCollection(id, 'Minimalist Drapes');
          }}
          onVisitCreator={() => {}}
        />
      )}

      {/* 6. IMAGE EXPERIENCE MODAL PREVIEW */}
      <AnimatePresence>
        {selectedCreation && (
          <ImageExperienceModal
            creation={selectedCreation}
            onClose={() => setSelectedCreation(null)}
            onLike={(id) => handleLike(id)}
            isLiked={!!likedMap[selectedCreation.id]}
            onSave={(id, collectionName) => handleSaveToCollection(id, collectionName)}
            isSaved={Object.values(savedCollections).some(list => list.includes(selectedCreation.id))}
            onRemix={(creation) => {
              handleRemix(creation);
              setSelectedCreation(null);
            }}
            onGenerateVariations={handleGenerateVariations}
            onFollowCreator={handleFollowCreator}
            isFollowingCreator={!!followingCreators[selectedCreation.creator.id]}
            onVisitCreator={() => {
              setSelectedCreation(null);
              setActiveTab('PORTFOLIO');
            }}
            onAddCustomCollection={handleAddCustomCollection}
            customCollections={customCollections}
          />
        )}
      </AnimatePresence>
    </div>
  );

  if (coatDNA) {
    return (
      <ThemeCoatRenderer coatDNA={coatDNA} className="w-full h-full min-h-screen">
        {renderContent()}
      </ThemeCoatRenderer>
    );
  }

  return renderContent();
};

export default AiCreationsGallery;
