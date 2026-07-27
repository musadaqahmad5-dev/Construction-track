import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Search, ArrowRight, Heart, Bookmark, Eye, Award, Layers, Flame, TrendingUp } from 'lucide-react';
import { WardrobeItem } from '../../types';

interface DiscoverScreenProps {
  userWardrobe: WardrobeItem[];
  onNavigateToTab?: (tab: string) => void;
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
}

const EDITORIALS = [
  {
    id: 'ed-1',
    title: 'The Tokyo Neo-Noir Suite',
    subtitle: 'Midnight Drapes & Heavyweight Silhouettes',
    author: 'Sartorial AI Core',
    imageUrl: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&auto=format&fit=crop',
    vibe: 'cyberpunk',
    description: 'An exploration of high-contrast deep twilight and graphite tech-wool. Tailored trousers drape over high-top leather boots, completed by water-resistant technical layers.',
    featuredItems: ['Graphite Overcoat', 'Tech Cargo Pants', 'Structured Chelsea Boots']
  },
  {
    id: 'ed-2',
    title: 'Milano Quiet Linen',
    subtitle: 'Sandstone Tonal Layering for Serene Confidence',
    author: 'Elena Rostova',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
    vibe: 'minimalist',
    description: 'Clean organic textures paired with loose structural cuts. Sandstone linen, off-white basic bases, and soft leather slip-ons designed to capture soft coastal breeze.',
    featuredItems: ['Belgian Flax Linen Shirt', 'Relaxed Ecru Trousers', 'Suede Loafers']
  },
  {
    id: 'ed-3',
    title: 'Avant-Garde Tailored Utility',
    subtitle: 'Deconstructed wool structures & tactical cords',
    author: 'Julian Vance',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    vibe: 'avant-garde',
    description: 'Bridging high bespoke tailoring with aggressive utility. Featuring asymmetric closures, hidden technical zippers, and robust heavy-knit linings.',
    featuredItems: ['Asymmetric Wool Blazer', 'Heavy Knit Vest', 'Ribbed Beanie']
  }
];

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  userWardrobe,
  onNavigateToTab,
  onAddGarment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [likesMap, setLikesMap] = useState<Record<string, boolean>>({});
  const [bookmarksMap, setBookmarksMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'editorials' | 'matcher'>('editorials');

  const toggleLike = (id: string) => {
    setLikesMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarksMap(prev => ({ ...prev, [id]: !prev[id] }));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
      detail: bookmarksMap[id] ? 'Removed lookbook from your private bookmarks' : 'Added lookbook to your style bookmarks!' 
    }));
  };

  // Vibe tag configurations
  const VIBES = [
    { id: 'all', label: 'All Aesthetics' },
    { id: 'minimalist', label: 'Nordic Minimalist' },
    { id: 'cyberpunk', label: 'Cyber Couture' },
    { id: 'avant-garde', label: 'Avant-Garde' },
    { id: 'classic', label: 'Vintage Heritage' }
  ];

  // Filtering editorials based on search or vibe selector
  const filteredEditorials = useMemo(() => {
    return EDITORIALS.filter(ed => {
      const matchesVibe = selectedVibe === 'all' || ed.vibe === selectedVibe;
      const matchesSearch = searchQuery === '' || 
        ed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ed.featuredItems.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesVibe && matchesSearch;
    });
  }, [selectedVibe, searchQuery]);

  // Style Matcher: Maps user's real wardrobe items to the selected aesthetic
  const matchedWardrobeItems = useMemo(() => {
    if (selectedVibe === 'all') return userWardrobe.slice(0, 3);
    
    return userWardrobe.filter(item => {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();

      if (selectedVibe === 'minimalist') {
        return titleLower.includes('linen') || titleLower.includes('white') || titleLower.includes('ecru') || titleLower.includes('clean') || titleLower.includes('relaxed');
      }
      if (selectedVibe === 'cyberpunk') {
        return titleLower.includes('black') || titleLower.includes('dark') || titleLower.includes('slate') || titleLower.includes('chelsea') || titleLower.includes('technical');
      }
      if (selectedVibe === 'avant-garde') {
        return titleLower.includes('wool') || titleLower.includes('asymmetric') || titleLower.includes('heavy') || titleLower.includes('blazer');
      }
      if (selectedVibe === 'classic') {
        return titleLower.includes('classic') || titleLower.includes('leather') || titleLower.includes('vintage') || titleLower.includes('suit') || titleLower.includes('coat');
      }
      return true;
    });
  }, [selectedVibe, userWardrobe]);

  return (
    <div className="w-full min-h-screen bg-[#05050a] text-zinc-100 p-4 sm:p-6 lg:p-8 select-none">
      
      {/* Visual Title Header */}
      <div className="max-w-6xl mx-auto space-y-3 pb-8 border-b border-white/5 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase block font-light">
              EDITORIAL DESIGN LIBRARY
            </span>
            <h1 className="font-serif font-light tracking-tight text-4xl text-white flex items-center gap-2">
              <Compass className="w-8 h-8 text-violet-400 animate-spin-slow" /> Discover & Explore
            </h1>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('editorials')}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'editorials' 
                  ? 'bg-violet-600 text-white font-bold' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Lookbooks
            </button>
            <button
              onClick={() => setActiveTab('matcher')}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'matcher' 
                  ? 'bg-violet-600 text-white font-bold' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Aesthetic Matcher
            </button>
          </div>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xl font-light">
          Immerse yourself in curated, seasonal aesthetic editorials. Toggle our smart Aesthetic Matcher to filter and match your actual wardrobe with trending styling templates.
        </p>
      </div>

      {/* Control Utility bar */}
      <div className="max-w-6xl mx-auto py-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Dynamic Vibe Selector Chips */}
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {VIBES.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setSelectedVibe(vibe.id)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedVibe === vibe.id 
                  ? 'bg-[#1e153e] border border-violet-500/35 text-violet-300 shadow-md shadow-violet-950/25' 
                  : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {vibe.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80 select-text">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search silhouettes, materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 hover:border-white/10 focus:border-white/20 pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-all font-mono uppercase tracking-wider"
          />
        </div>

      </div>

      {/* Content Render Area */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'editorials' ? (
          
          /* SECTION 1: EDITORIAL LOOKBOOKS GRID */
          filteredEditorialList(filteredEditorials, toggleLike, toggleBookmark, likesMap, bookmarksMap)

        ) : (
          
          /* SECTION 2: SMART AESTHETIC WARDROBE MATCHER */
          <div className="space-y-6 animate-fade-in text-left">
            <div className="p-6 bg-gradient-to-r from-violet-950/15 to-indigo-950/20 border border-violet-500/10 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span className="text-xs font-mono uppercase text-white font-bold tracking-widest">Aesthetic Calibration Active</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl font-light">
                Select an aesthetic using the chips above. Our AI matches your wardrobe items, calculates compatibility thresholds, and suggests missing pieces to unlock these coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Matched Wardrobe Items */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-violet-400" /> Matched In Your Wardrobe ({matchedWardrobeItems.length})
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">Selected: {selectedVibe.toUpperCase()}</span>
                </div>

                {matchedWardrobeItems.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-white/5 rounded-2xl bg-[#08080f]/45">
                    <p className="text-xs text-zinc-500 italic">No pieces in your archive match this specific theme yet.</p>
                    <button
                      onClick={() => onNavigateToTab?.('WARDROBE')}
                      className="px-4 py-2 mt-4 text-[9px] font-mono uppercase tracking-widest bg-white/5 border border-white/10 hover:border-white/30 rounded-lg cursor-pointer transition-colors"
                    >
                      [ Add Pieces to Shelves ]
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {matchedWardrobeItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
                            detail: `Loaded wardrobe detail view for ${item.title}` 
                          }));
                        }}
                        className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3 hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer text-left"
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-neutral-900 rounded-xl">
                          <img src={item.imageUrl || null} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase">{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: AI Stylist Recommended Missing Pieces */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-b from-[#07070c] to-transparent border border-white/5 space-y-4">
                <div className="pb-3 border-b border-white/5">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-violet-400" /> AI Style Upgrade
                  </h3>
                  <span className="text-[10px] text-zinc-500 block mt-0.5 font-light">Acquire these to complete the look</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { title: 'Oversized Charcoal Trench Coat', desc: 'Adds essential heavyweight draping to complete Tokyo Neo-Noir aesthetic.', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
                    { title: 'Italian Brushed Suede Loafers', desc: 'The perfect coordinating footwear choice to polish Quiet Linen suits.', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200&auto=format&fit=crop' }
                  ].map((upgrade, uIdx) => (
                    <div key={uIdx} className="flex gap-3 bg-white/[0.01] p-2.5 rounded-xl border border-white/5 hover:border-violet-500/10 transition-colors">
                      <div className="w-14 h-16 rounded-lg overflow-hidden bg-zinc-950 shrink-0">
                        <img src={upgrade.img || null} alt={upgrade.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11.5px] font-bold text-white truncate">{upgrade.title}</h4>
                        <p className="text-[9.5px] text-zinc-500 leading-relaxed font-sans line-clamp-2 mt-0.5">{upgrade.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigateToTab?.('MARKETPLACE')}
                  className="w-full py-3 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold mt-2"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// Internal component renderer
function filteredEditorialList(
  editorials: typeof EDITORIALS,
  toggleLike: (id: string) => void,
  toggleBookmark: (id: string) => void,
  likesMap: Record<string, boolean>,
  bookmarksMap: Record<string, boolean>
) {
  if (editorials.length === 0) {
    return (
      <div className="py-24 text-center border border-white/5 rounded-2xl bg-white/[0.01] space-y-2">
        <span className="text-zinc-600 text-3xl block">◇</span>
        <h3 className="font-serif text-lg text-zinc-400">No Lookbooks Matched Search</h3>
        <p className="text-xs text-zinc-600">Try modifying your vibe tag selection or clear query filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
      {editorials.map((ed) => (
        <div
          key={ed.id}
          className="group flex flex-col justify-between bg-[#08080f]/40 border border-white/5 rounded-3xl overflow-hidden hover:border-violet-500/20 hover:scale-[1.005] duration-300 transition-all text-left shadow-2xl relative"
        >
          {/* Portrait Cover Illustration */}
          <div className="relative aspect-[3/2] overflow-hidden bg-zinc-950">
            <img src={ed.imageUrl || null}
              alt={ed.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 grayscale-[30%] group-hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
            
            {/* Swipable Vibe overlay */}
            <div className="absolute top-4 left-4">
              <span className="text-[8px] font-mono tracking-widest uppercase bg-black/60 backdrop-blur-md text-violet-300 px-2.5 py-1 rounded-lg border border-white/10">
                {ed.vibe}
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="absolute top-4 right-4 flex gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); toggleLike(ed.id); }}
                className="p-2 bg-black/60 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer"
              >
                <Heart className={`w-3.5 h-3.5 ${likesMap[ed.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleBookmark(ed.id); }}
                className="p-2 bg-black/60 backdrop-blur-md hover:bg-violet-500/20 text-white hover:text-violet-400 border border-white/10 rounded-full transition-all cursor-pointer"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarksMap[ed.id] ? 'fill-violet-400 text-violet-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>By {ed.author}</span>
                <span>Active Concept</span>
              </div>
              <h3 className="font-serif font-light text-2xl text-white group-hover:text-violet-300 transition-colors leading-snug">
                {ed.title}
              </h3>
              <p className="text-xs font-serif italic text-zinc-400 leading-relaxed pt-1.5">
                "{ed.subtitle}"
              </p>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
              {ed.description}
            </p>

            {/* Featured Items list */}
            <div className="pt-3 border-t border-white/[0.04]">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block font-bold mb-2">Featured Core Pieces:</span>
              <div className="flex flex-wrap gap-2">
                {ed.featuredItems.map((piece, pIdx) => (
                  <span
                    key={pIdx}
                    className="px-2.5 py-1 bg-white/[0.01] hover:bg-white/5 border border-white/5 text-[9.5px] font-mono text-white/80 rounded-md cursor-pointer transition-colors"
                  >
                    + {piece}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
