import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShoppingBag, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  Shirt,
  PenSquare,
  Plus,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronDown,
  Info,
  Store
} from 'lucide-react';
import { FeedItem } from '../features/feed/feedTypes';
import { AIEngine } from '../features/feed/AIEngine';
import { FeedCard } from './FeedCard';
import { MarketplaceModule } from './MarketplaceModule';
import { WardrobeItem } from '../types';
import { WardrobeGrid } from './WardrobeGrid';
import { SellerDashboard } from './SellerDashboard';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface HomeFeedProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  user?: any;
  onLogout?: () => void;
  onReset?: () => void;
  onLoadSamples?: () => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  wardrobe,
  onAddGarment,
  onDeleteGarment,
  user,
  onLogout,
  onReset,
  onLoadSamples
}) => {
  // Feed state
  const [originalFeed, setOriginalFeed] = useState<FeedItem[]>([]);
  const [visibleFeed, setVisibleFeed] = useState<FeedItem[]>([]);
  const [customShopPosts, setCustomShopPosts] = useState<FeedItem[]>([]);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  
  // AI Prompt search states
  const [searchPrompt, setSearchPrompt] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isAiCurating, setIsAiCurating] = useState(false);

  // Modals & Panels
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isClosetDrawerOpen, setIsClosetDrawerOpen] = useState(false);
  const [activeFeedFilter, setActiveFeedFilter] = useState<'ALL' | 'OUTFITS' | 'PRODUCTS' | 'TRENDS'>('ALL');

  // Loading / Stream states
  const [pageLimit, setPageLimit] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Real-Time Marketplace Feed Streamer
  useEffect(() => {
    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const livePosts = snapshot.docs
        .filter(docSnap => {
          const data = docSnap.data();
          // Filter out unlinked, missing titles/prices, or incomplete records
          return data && data.title && data.price && data.shopId;
        })
        .map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            type: 'shop_product',
            title: data.title,
            description: data.description,
            price: data.price,
            location: data.location || "Bespoke Atelier",
            category: data.category,
            availability: data.availability === 'Out of Stock' ? 'Sold Out' : data.availability,
            shopName: data.shopName,
            shopAvatarUrl: data.shopAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
            imageUrl: data.imageUrl,
            vibeTags: data.vibeTags || [data.category.toLowerCase(), 'boutique'],
            statsLabel: "Live Artisan upload",
            likesCount: data.likesCount || 1,
            bookmarksCount: data.bookmarksCount || 0,
            createdAt: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString()
          } as FeedItem;
        });
      setCustomShopPosts(livePosts);
    }, (error) => {
      console.warn("Products stream offline fallback active:", error);
    });

    return () => unsubscribe();
  }, []);

  // Initialize Feed
  useEffect(() => {
    // Generate feed combining user wardrobe + local shop catalogs + preset tips
    const computed = AIEngine.generateFeed(wardrobe, customShopPosts);
    setOriginalFeed(computed);
    
    // Apply initial filters/searches
    const { items, explanation } = AIEngine.processSearchQuery(searchPrompt, computed);
    
    let filtered = items;
    if (activeFeedFilter === 'OUTFITS') {
      filtered = items.filter(i => i.type === 'outfit');
    } else if (activeFeedFilter === 'PRODUCTS') {
      filtered = items.filter(i => i.type === 'shop_product' || i.type === 'budget_pick');
    } else if (activeFeedFilter === 'TRENDS') {
      filtered = items.filter(i => i.type === 'trending_fashion');
    }

    setVisibleFeed(filtered);
    setAiExplanation(explanation);
  }, [wardrobe, customShopPosts, activeFeedFilter]);

  // Handle Search Input Submit or on-the-fly search ranking
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchPrompt(val);

    if (!val.trim()) {
      setIsAiCurating(false);
      setAiExplanation('');
      // Reset visible feed
      const base = AIEngine.generateFeed(wardrobe, customShopPosts);
      setVisibleFeed(base);
      return;
    }

    setIsAiCurating(true);
    // Debounce/Simulate real-time AI ranking calculation
    const timer = setTimeout(() => {
      const base = AIEngine.generateFeed(wardrobe, customShopPosts);
      const { items, explanation } = AIEngine.processSearchQuery(val, base);
      setVisibleFeed(items);
      setAiExplanation(explanation);
      setIsAiCurating(false);
    }, 400);

    return () => clearTimeout(timer);
  };

  // Preset quick suggestion prompts
  const quickSearches = [
    { label: "Winter luxury under $300", query: "luxury winter under 300" },
    { label: "Streetwear hoodies", query: "hoodie streetwear" },
    { label: "Casual own closet outfit", query: "closet own outfit" },
    { label: "Tokyo trending", query: "trending" }
  ];

  const applyQuickSearch = (query: string) => {
    setSearchPrompt(query);
    setIsAiCurating(true);
    setTimeout(() => {
      const base = AIEngine.generateFeed(wardrobe, customShopPosts);
      const { items, explanation } = AIEngine.processSearchQuery(query, base);
      setVisibleFeed(items);
      setAiExplanation(explanation);
      setIsAiCurating(false);
    }, 300);
  };

  // Liked interactions helper
  const handleLikeItem = (itemId: string) => {
    setVisibleFeed(prev => prev.map(item => {
      if (item.id === itemId) {
        const hasLiked = !item.hasLiked;
        return {
          ...item,
          hasLiked,
          likesCount: hasLiked ? item.likesCount + 1 : item.likesCount - 1
        };
      }
      return item;
    }));
  };

  // Bookmark interactions helper
  const handleBookmarkItem = (itemId: string) => {
    setVisibleFeed(prev => prev.map(item => {
      if (item.id === itemId) {
        const hasBookmarked = !item.hasBookmarked;
        return {
          ...item,
          hasBookmarked,
          bookmarksCount: hasBookmarked ? item.bookmarksCount + 1 : item.bookmarksCount - 1
        };
      }
      return item;
    }));
  };

  // Add shop posted item
  const handleAddShopPost = (newPostData: any) => {
    const post: FeedItem = {
      ...newPostData,
      id: `custom-shop-${Date.now()}`,
      likesCount: 1,
      bookmarksCount: 0,
      createdAt: new Date().toISOString()
    };
    setCustomShopPosts(prev => [post, ...prev]);
  };

  // Save shop item to user's real digital wardrobe
  const handleSaveToCloset = (title: string, description: string, category: string, imageUrl: string, price?: number) => {
    if (onAddGarment) {
      // Direct call to wardrobe context adder
      onAddGarment(title, description, category, { imageUrl, price });
    }
  };

  // Log outfit worn event
  const [feedbackSuccessToast, setFeedbackSuccessToast] = useState('');
  const handleWearOutfit = (outfitId: string, clothesNames: string[]) => {
    setFeedbackSuccessToast(`Selected Outfit Logged! We marked: ${clothesNames.join(' & ')} as worn today.`);
    setTimeout(() => {
      setFeedbackSuccessToast('');
    }, 4500);
  };

  // Load more / Infinite scroll simulator
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setPageLimit(prev => prev + 3);
      setIsLoadingMore(false);
    }, 700);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 pb-32 animate-fade-in relative selection:bg-transparent">
      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 border border-[#ccc]/20 max-w-sm w-full py-3.5 px-4 rounded-xl shadow-2xl flex items-center gap-3 text-black text-xs font-mono font-medium"
          >
            <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full animate-ping" />
            <span className="flex-1 leading-snug">{feedbackSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PRIMARY APP BRANDING HEADER */}
      <div className="text-center space-y-3 pt-6 pb-2">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/30 block">
          AI-Curated Style & Atelier Feed
        </span>
        <h1 className="font-serif font-light tracking-[-0.03em] text-4xl text-white">Sartorial Feed</h1>
        <p className="text-xs text-[#dfd7c2]/80 font-serif italic max-w-sm mx-auto leading-relaxed">
          "Discover and shop real fashion from local boutiques, powered by AI."
        </p>
      </div>

      {/* Quick Access Portal buttons for Wardrobe overlays */}
      <div className="flex md:flex-row justify-center gap-3 w-full">
        <button
          onClick={() => setIsClosetDrawerOpen(true)}
          className="flex-1 cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] text-white/80 border border-white/5 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          id="btn-open-closet-drawer"
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>My Closet Drawer ({wardrobe.length})</span>
        </button>

        <button
          onClick={() => setIsSellerDashboardOpen(true)}
          className="flex-1 cursor-pointer bg-white text-black hover:bg-neutral-200 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors font-medium shadow-sm"
          id="btn-open-seller-portal"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Seller Portal & Atelier</span>
        </button>
      </div>

      {/* 2. AI CONCIERGE PROMPT BOX */}
      <div className="bg-[#0b0b0b] border border-white/[0.05] p-4 rounded-2xl shadow-xl space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-mono tracking-widest text-[#9c9c9c] uppercase block">AI Stylist Consult</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              placeholder="What are you looking for today?"
              value={searchPrompt}
              onChange={handleSearchChange}
              className="w-full bg-white/[0.01] border border-white/5 pl-9 pr-8 py-3 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/10 rounded-xl transition-all font-light"
              id="ai-feed-search-input"
            />
            {searchPrompt && (
              <button 
                onClick={() => setSearchPrompt('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/35 hover:text-white text-xs font-mono px-1 bg-white/5 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick chip ideas */}
        <div className="flex flex-wrap gap-1.5">
          {quickSearches.map((qs, i) => (
            <button
              key={i}
              onClick={() => applyQuickSearch(qs.query)}
              className="text-[9px] font-mono text-white/35 hover:text-white/85 hover:bg-white/[0.03] border border-white/[0.03] px-2 py-0.5 rounded transition-all cursor-pointer"
            >
              {qs.label}
            </button>
          ))}
        </div>

        {/* AI curation context note */}
        <AnimatePresence>
          {aiExplanation && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#fafafa]/[0.02] border-t border-dashed border-white/10 pt-3 flex gap-2.5 items-start mt-1"
            >
              <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                <Sparkles className="w-3 h-3 animate-spin duration-3000" />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-white/30">Curation Logic</p>
                <p className="text-xs text-white/75 font-serif italic leading-relaxed">
                  {aiExplanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. CLASSIFICATION TABS / FEED FILTERS */}
      <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
        <div className="flex gap-4">
          {[
            { id: 'ALL', label: 'All Feed' },
            { id: 'OUTFITS', label: 'AI Outfits' },
            { id: 'PRODUCTS', label: 'Shops' },
            { id: 'TRENDS', label: 'Trending' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFeedFilter(tab.id as any)}
              className={`text-[10px] font-mono uppercase tracking-[0.1em] pb-2 relative transition-all cursor-pointer ${
                activeFeedFilter === tab.id ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <span>{tab.label}</span>
              {activeFeedFilter === tab.id && (
                <motion.div layoutId="feedActiveLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}
        </div>

        <span className="text-[8px] font-mono uppercase tracking-widest text-white/20">
          Showing {Math.min(visibleFeed.length, pageLimit)} of {visibleFeed.length} Items
        </span>
      </div>

      {/* 4. MAIN FEED FEED ITEMS STREAM */}
      <div className="space-y-10">
        <AnimatePresence mode="popLayout">
          {visibleFeed.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-12 border border-dashed border-white/5 bg-white/[0.01] rounded-2xl"
            >
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/30 mb-3">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <p className="font-serif italic text-sm text-white/40">"No curated silhouettes in this feed yet."</p>
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mt-1">Adjust search parameters or try another tab</p>
            </motion.div>
          ) : (
            visibleFeed.slice(0, pageLimit).map((feedItem) => (
              <FeedCard 
                key={feedItem.id} 
                item={feedItem}
                onLike={handleLikeItem}
                onBookmark={handleBookmarkItem}
                onSaveToCloset={handleSaveToCloset}
                onWearOutfit={handleWearOutfit}
              />
            ))
          )}
        </AnimatePresence>

        {/* Load More Trigger */}
        {visibleFeed.length > pageLimit && (
          <div className="text-center pt-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-2 bg-white/[0.02] hover:bg-white text-white hover:text-black border border-white/5 hover:border-white transition-all text-[10px] font-mono uppercase tracking-widest rounded-lg cursor-pointer inline-flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Loading Stream...</span>
                </>
              ) : (
                <span>Fetch More Outfits</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 5. PORTABLE DIGITAL CLOSET DRAWER (SLIDE-OVER LAYOUT) */}
      <AnimatePresence>
        {isClosetDrawerOpen && (
          <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex justify-end selection:bg-transparent">
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsClosetDrawerOpen(false)} />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#070707] border-l border-white/10 h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Content */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#ababab] uppercase">SARTORIAL STORAGE v4</span>
                    <h3 className="font-serif text-2xl font-light text-white flex items-center gap-2">
                      <Shirt className="w-5 h-5 text-white/80" /> My Wardrobe
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsClosetDrawerOpen(false)}
                    className="text-white/40 hover:text-white hover:bg-white/5 px-2.5 py-1 text-xs font-mono transition-colors rounded-md"
                  >
                    [ HIDE ]
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-light">Digital Closet Guidelines</span>
                    <p className="text-xs text-white/60 leading-relaxed font-serif font-light">
                      Items saved from the Marketplace or added manually are cataloged below. Use categories to sort your collection.
                    </p>
                  </div>

                  {/* Integrated Quick Closet Manual Adder */}
                  <QuickGarmentAdder onAdd={onAddGarment} />

                  {/* Wardrobe Grid sub-panel */}
                  <WardrobeGrid
                    items={wardrobe}
                    categories={['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories']}
                    onDelete={(item) => onDeleteGarment && onDeleteGarment(item.id)}
                  />
                </div>
              </div>

              {/* Reset/Control footer */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center bg-[#070707]">
                <button
                  onClick={() => {
                    if (onReset) onReset();
                    setIsClosetDrawerOpen(false);
                  }}
                  className="text-[9px] font-mono text-white/20 hover:text-rose-400 transition-colors uppercase cursor-pointer"
                >
                  [ RESET TO ORIGINAL VALUES ]
                </button>
                <button
                  onClick={() => {
                    if (onLoadSamples) onLoadSamples();
                    setIsClosetDrawerOpen(false);
                  }}
                  className="text-[9px] font-mono text-white/20 hover:text-white/70 transition-colors uppercase cursor-pointer"
                >
                  [ LOAD SAMPLE CLOTHES ]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Marketplace adding product modal */}
      <MarketplaceModule 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddShopPost={handleAddShopPost}
      />

      {/* Real-time Seller Onboarding and Dashboard System */}
      <AnimatePresence>
        {isSellerDashboardOpen && (
          <SellerDashboard 
            user={user}
            onClose={() => setIsSellerDashboardOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// HELPER CONTROL FOR MANUAL CLOTHES REGISTRATION INSIDE EXTENDED CLOSET DRAWER
interface QuickGarmentAdderProps {
  onAdd?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
}

export const QuickGarmentAdder: React.FC<QuickGarmentAdderProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'Casual' | 'Formal' | 'Outerwear' | 'Accessories'>('Casual');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !onAdd) return;

    setIsAdding(true);
    try {
      await onAdd(title, desc || "Personal favorite coordinate piece from private wardrobe.", category);
      setTitle('');
      setDesc('');
      setIsOpen(false);
    } catch(err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white/[0.015] border border-white/5 p-3 md:p-4 rounded-xl space-y-2">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-[9px] font-mono uppercase tracking-widest text-white/50 hover:text-white flex justify-between items-center cursor-pointer transition-colors"
      >
        <span>[ {isOpen ? 'Hide Manual Adder' : 'Add Closet Piece Manually'} ]</span>
        <span>{isOpen ? '—' : '+'}</span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="text-[8px] font-mono uppercase tracking-wider text-white/40 block pb-1">Garment Identifier Label *</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Linen Summer Trouser"
              className="w-full bg-black/60 border border-white/10 px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-white/20 rounded-md transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] font-mono uppercase tracking-wider text-white/40 block pb-1">Style Type</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 px-1 py-1.5 text-xs text-white/80 font-mono focus:outline-none rounded-md"
              >
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] font-mono uppercase tracking-wider text-white/40 block pb-1">Craftsmanship brief</label>
              <input 
                type="text" 
                value={desc} 
                onChange={e => setDesc(e.target.value)}
                placeholder="Details & weavings..."
                className="w-full bg-black/60 border border-white/10 px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-white/20 rounded-md transition-colors"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isAdding}
            className="w-full bg-white text-black py-2 text-[9px] font-mono uppercase tracking-wider rounded-md font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            {isAdding ? 'Registering Piece...' : 'Add to Closet'}
          </button>
        </form>
      )}
    </div>
  );
};

